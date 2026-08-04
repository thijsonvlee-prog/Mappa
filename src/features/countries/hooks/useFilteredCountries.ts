import { useMemo } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { useCountryStore } from '@/stores/country-store';
import { countries } from '@/data/countries-lookup';
import { searchCountries } from '@/lib/search-utils';
import type { Country } from '@/types';

export function useFilteredCountries(): Country[] {
  const searchQuery = useUIStore((s) => s.searchQuery);
  const filters = useUIStore((s) => s.filters);
  const sortBy = useUIStore((s) => s.sortBy);
  const sortDirection = useUIStore((s) => s.sortDirection);
  const visits = useCountryStore((s) => s.visits);

  return useMemo(() => {
    let result = searchCountries(countries, searchQuery);

    if (filters.continents.length > 0) {
      result = result.filter((c) => filters.continents.includes(c.continent));
    }

    if (filters.statuses.length > 0) {
      result = result.filter((c) => {
        const visit = visits.get(c.code);
        const status = visit?.status ?? 'not_visited';
        return filters.statuses.includes(status);
      });
    }

    result = [...result].sort((a, b) => {
      let cmp = 0;

      switch (sortBy) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'status': {
          const statusOrder = { visited: 0, planned: 1, not_visited: 2 };
          const aStatus = visits.get(a.code)?.status ?? 'not_visited';
          const bStatus = visits.get(b.code)?.status ?? 'not_visited';
          cmp = statusOrder[aStatus] - statusOrder[bStatus];
          break;
        }
        case 'rating': {
          const aRating = visits.get(a.code)?.rating ?? 0;
          const bRating = visits.get(b.code)?.rating ?? 0;
          cmp = aRating - bRating;
          break;
        }
        case 'updatedAt': {
          const aDate = visits.get(a.code)?.updatedAt ?? '';
          const bDate = visits.get(b.code)?.updatedAt ?? '';
          cmp = aDate.localeCompare(bDate);
          break;
        }
      }

      return sortDirection === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [searchQuery, filters, sortBy, sortDirection, visits]);
}
