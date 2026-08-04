import { useMemo } from 'react';
import { useCountryStore } from '@/stores/country-store';
import { countryMap, TOTAL_COUNTRIES } from '@/data/countries-lookup';
import { computeStats } from '@/lib/stats-utils';

export function useStatistics() {
  const visits = useCountryStore((s) => s.visits);
  return useMemo(() => computeStats(visits, countryMap, TOTAL_COUNTRIES), [visits]);
}
