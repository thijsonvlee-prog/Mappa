import { continentLabels } from '@/lib/labels';
import type { StatsData } from '@/lib/stats-utils';

export interface Milestone {
  /** Distinguishes one stamp from the next so the overlay can re-key. */
  id: string;
  /** The stamp's headline, already uppercased for the rubber-stamp look. */
  label: string;
  kind: 'continent-complete' | 'new-continent' | 'decade';
}

/**
 * Compares two snapshots of the stats and returns the single most significant
 * milestone crossed between them, or null.
 *
 * Pure on purpose: this is the part most likely to misfire, so it's testable
 * without a store, a renderer, or a clock.
 *
 * Priority is deliberate — completing a continent outranks setting foot on a
 * new one, which outranks a round-number count. Only one stamp is ever shown
 * per action, so the rarest achievement wins.
 */
export function detectMilestone(
  prev: StatsData,
  curr: StatsData,
): Milestone | null {
  // Un-marking a country is not an achievement.
  if (curr.totalVisited <= prev.totalVisited) return null;

  const prevByContinent = new Map(prev.byContinent.map((c) => [c.name, c]));

  for (const continent of curr.byContinent) {
    const before = prevByContinent.get(continent.name);
    if (!before) continue;
    if (
      continent.total > 0 &&
      continent.visited === continent.total &&
      before.visited < before.total
    ) {
      return {
        id: `continent-complete-${continent.name}`,
        label: `${continentLabels[continent.name]} compleet`.toUpperCase(),
        kind: 'continent-complete',
      };
    }
  }

  for (const continent of curr.byContinent) {
    const before = prevByContinent.get(continent.name);
    if (!before) continue;
    if (before.visited === 0 && continent.visited > 0) {
      return {
        id: `new-continent-${continent.name}`,
        label: `Eerste land in ${continentLabels[continent.name]}`.toUpperCase(),
        kind: 'new-continent',
      };
    }
  }

  if (curr.totalVisited > 0 && curr.totalVisited % 10 === 0) {
    return {
      id: `decade-${curr.totalVisited}`,
      label: `${curr.totalVisited} landen`.toUpperCase(),
      kind: 'decade',
    };
  }

  return null;
}
