import { describe, it, expect } from 'vitest';
import { detectMilestone } from './detectMilestone';
import type { StatsData } from '@/lib/stats-utils';
import type { Continent } from '@/types';

type ContinentCount = { name: Continent; visited: number; total: number };

function stats(totalVisited: number, byContinent: ContinentCount[]): StatsData {
  return {
    totalVisited,
    totalPlanned: 0,
    percentageOfWorld: 0,
    continentsReached: byContinent.filter((c) => c.visited > 0).length,
    totalContinents: byContinent.length,
    totalCities: 0,
    byContinent,
    topRated: [],
    recentlyAdded: [],
    favoriteCountries: [],
  } as StatsData;
}

const EUROPE = (visited: number, total = 44): ContinentCount => ({
  name: 'Europe',
  visited,
  total,
});
const ASIA = (visited: number, total = 48): ContinentCount => ({
  name: 'Asia',
  visited,
  total,
});

describe('detectMilestone', () => {
  it('fires on the 10th country', () => {
    const found = detectMilestone(
      stats(9, [EUROPE(9), ASIA(0)]),
      stats(10, [EUROPE(10), ASIA(0)]),
    );
    expect(found?.kind).toBe('decade');
    expect(found?.label).toBe('10 LANDEN');
  });

  it('does not fire on a count that is not a round ten', () => {
    const found = detectMilestone(
      stats(11, [EUROPE(11), ASIA(0)]),
      stats(12, [EUROPE(12), ASIA(0)]),
    );
    expect(found).toBeNull();
  });

  it('fires the first time a continent is entered', () => {
    const found = detectMilestone(
      stats(5, [EUROPE(5), ASIA(0)]),
      stats(6, [EUROPE(5), ASIA(1)]),
    );
    expect(found?.kind).toBe('new-continent');
    expect(found?.label).toContain('AZIË');
  });

  it('fires when a continent is completed', () => {
    const found = detectMilestone(
      stats(43, [EUROPE(43), ASIA(0)]),
      stats(44, [EUROPE(44), ASIA(0)]),
    );
    expect(found?.kind).toBe('continent-complete');
    expect(found?.label).toBe('EUROPA COMPLEET');
  });

  it('prefers completing a continent over a simultaneous decade', () => {
    // 44th European country is both "continent complete" and a round number
    // in some worlds; the rarer achievement must win.
    const found = detectMilestone(
      stats(39, [EUROPE(39), ASIA(0)]),
      stats(40, [EUROPE(40, 40), ASIA(0)]),
    );
    expect(found?.kind).toBe('continent-complete');
  });

  it('never fires when un-marking a country', () => {
    const found = detectMilestone(
      stats(11, [EUROPE(11), ASIA(0)]),
      stats(10, [EUROPE(10), ASIA(0)]),
    );
    expect(found).toBeNull();
  });

  it('does not re-fire for a continent that was already complete', () => {
    const found = detectMilestone(
      stats(44, [EUROPE(44, 44), ASIA(0)]),
      stats(45, [EUROPE(44, 44), ASIA(1)]),
    );
    expect(found?.kind).toBe('new-continent');
  });
});
