import { useEffect, useRef, useState } from 'react';
import { useCountryStore } from '@/stores/country-store';
import { countryMap, TOTAL_COUNTRIES } from '@/data/countries-lookup';
import { computeStats, type StatsData } from '@/lib/stats-utils';
import { detectMilestone, type Milestone } from './detectMilestone';

/**
 * Watches for milestone crossings and surfaces at most one at a time.
 *
 * The suppression rules matter more than the detection: a stamp must only ever
 * appear for a country the user just marked by hand. Bulk writes during
 * onboarding, import, and hydration all move the numbers past milestones, and
 * celebrating those would machine-gun the screen at someone who did nothing.
 *
 * Three guards enforce that:
 *  - `lastMarked` is null after hydrate/import/reset, so those runs only
 *    re-baseline the comparison snapshot and return.
 *  - `origin !== 'user'` skips onboarding's bulk marking.
 *  - `at` is remembered, so a re-render can't replay a milestone already shown.
 */
export function useMilestones() {
  const visits = useCountryStore((s) => s.visits);
  const lastMarked = useCountryStore((s) => s.lastMarked);

  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const prevStats = useRef<StatsData | null>(null);
  const handledAt = useRef<number | null>(null);

  useEffect(() => {
    const stats = computeStats(visits, countryMap, TOTAL_COUNTRIES);
    const before = prevStats.current;
    prevStats.current = stats;

    // First run establishes the baseline; there is nothing to compare against.
    if (!before) return;
    // Hydration, import, and reset all clear lastMarked. Landing here simply
    // re-baselines above, which is what stops the next hand-made mark from
    // being compared against a pre-import world.
    if (!lastMarked) return;
    if (lastMarked.origin !== 'user') return;
    if (handledAt.current === lastMarked.at) return;

    handledAt.current = lastMarked.at;

    const found = detectMilestone(before, stats);
    if (found) setMilestone({ ...found, id: `${found.id}-${lastMarked.at}` });
  }, [visits, lastMarked]);

  return {
    milestone,
    dismiss: () => setMilestone(null),
  };
}
