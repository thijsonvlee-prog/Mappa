import { describe, it, expect } from 'vitest';
import { computeStats } from './stats-utils';
import type { CountryVisit } from '@/types';
import type { Country } from '@/types/country';

function makeCountry(code: string, continent: Country['continent']): Country {
  return {
    code,
    name: code,
    continent,
    subregion: 'Test',
    flag: '🏳️',
    capital: 'Test City',
    area: 1000,
    coordinates: [0, 0],
  };
}

function makeVisit(
  countryCode: string,
  overrides: Partial<CountryVisit> = {},
): CountryVisit {
  const now = new Date().toISOString();
  return {
    id: countryCode,
    countryCode,
    status: 'visited',
    cities: [],
    tagIds: [],
    photoIds: [],
    visits: [],
    isFavorite: false,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('computeStats', () => {
  const countryMap = new Map<string, Country>([
    ['NL', makeCountry('NL', 'Europe')],
    ['FR', makeCountry('FR', 'Europe')],
    ['JP', makeCountry('JP', 'Asia')],
    ['AQ', makeCountry('AQ', 'Antarctica')],
  ]);

  it('returns zero percentage when there are no visits', () => {
    const stats = computeStats(new Map(), countryMap, 195);
    expect(stats.totalVisited).toBe(0);
    expect(stats.percentageOfWorld).toBe(0);
    expect(stats.continentsReached).toBe(0);
  });

  it('calculates percentage of world correctly for some visited countries', () => {
    const visits = new Map<string, CountryVisit>([
      ['NL', makeVisit('NL', { status: 'visited' })],
      ['FR', makeVisit('FR', { status: 'planned' })],
    ]);

    const stats = computeStats(visits, countryMap, 195);

    expect(stats.totalVisited).toBe(1);
    expect(stats.totalPlanned).toBe(1);
    expect(stats.percentageOfWorld).toBeCloseTo((1 / 195) * 100, 5);
  });

  it('counts continentsReached only for visited (not planned) countries', () => {
    const visits = new Map<string, CountryVisit>([
      ['NL', makeVisit('NL', { status: 'visited' })],
      ['JP', makeVisit('JP', { status: 'visited' })],
      ['FR', makeVisit('FR', { status: 'planned' })],
    ]);

    const stats = computeStats(visits, countryMap, 195);
    expect(stats.continentsReached).toBe(2);
  });

  it('excludes Antarctica from continent breakdown', () => {
    const visits = new Map<string, CountryVisit>([
      ['AQ', makeVisit('AQ', { status: 'visited' })],
    ]);

    const stats = computeStats(visits, countryMap, 195);
    expect(stats.byContinent.some((c) => c.name === 'Antarctica')).toBe(false);
    expect(stats.continentsReached).toBe(0);
  });

  it('sorts topRated descending and limits to 10', () => {
    const visits = new Map<string, CountryVisit>();
    for (let i = 0; i < 12; i++) {
      const code = `C${i}`;
      visits.set(code, makeVisit(code, { rating: (i % 5) + 1 }));
    }

    const stats = computeStats(visits, countryMap, 195);
    expect(stats.topRated).toHaveLength(10);
    for (let i = 0; i < stats.topRated.length - 1; i++) {
      expect(stats.topRated[i].rating ?? 0).toBeGreaterThanOrEqual(
        stats.topRated[i + 1].rating ?? 0,
      );
    }
  });

  it('filters favoriteCountries correctly', () => {
    const visits = new Map<string, CountryVisit>([
      ['NL', makeVisit('NL', { isFavorite: true })],
      ['FR', makeVisit('FR', { isFavorite: false })],
    ]);

    const stats = computeStats(visits, countryMap, 195);
    expect(stats.favoriteCountries).toHaveLength(1);
    expect(stats.favoriteCountries[0].countryCode).toBe('NL');
  });

  it('sums total cities across all visits', () => {
    const visits = new Map<string, CountryVisit>([
      ['NL', makeVisit('NL', { cities: ['Amsterdam', 'Rotterdam'] })],
      ['FR', makeVisit('FR', { cities: ['Paris'] })],
    ]);

    const stats = computeStats(visits, countryMap, 195);
    expect(stats.totalCities).toBe(3);
  });
});
