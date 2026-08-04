import { describe, it, expect } from 'vitest';
import { searchCountries } from './search-utils';
import type { Country } from '@/types';

function makeCountry(overrides: Partial<Country>): Country {
  return {
    code: 'XX',
    name: 'Testland',
    continent: 'Europe',
    subregion: 'Test',
    flag: '🏳️',
    capital: 'Test City',
    area: 1000,
    coordinates: [0, 0],
    ...overrides,
  };
}

describe('searchCountries', () => {
  const countries: Country[] = [
    makeCountry({ code: 'NL', name: 'Netherlands', capital: 'Amsterdam' }),
    makeCountry({ code: 'FR', name: 'France', capital: 'Paris' }),
    makeCountry({ code: 'JP', name: 'Japan', capital: 'Tokyo' }),
  ];

  it('matches by country name case-insensitively', () => {
    const result = searchCountries(countries, 'neth');
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe('NL');
  });

  it('matches by partial name', () => {
    const result = searchCountries(countries, 'FRA');
    expect(result.map((c) => c.code)).toEqual(['FR']);
  });

  it('matches by country code', () => {
    const result = searchCountries(countries, 'jp');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Japan');
  });

  it('matches by capital', () => {
    const result = searchCountries(countries, 'tokyo');
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe('JP');
  });

  it('returns all countries for an empty query', () => {
    const result = searchCountries(countries, '');
    expect(result).toHaveLength(3);
  });

  it('returns all countries for a whitespace-only query', () => {
    const result = searchCountries(countries, '   ');
    expect(result).toHaveLength(3);
  });

  it('returns an empty array when nothing matches', () => {
    const result = searchCountries(countries, 'zzzzz');
    expect(result).toHaveLength(0);
  });
});
