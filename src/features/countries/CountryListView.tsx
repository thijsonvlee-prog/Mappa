import { useMemo } from 'react';
import { useCountryStore } from '@/stores/country-store';
import { CountryListItem } from './CountryListItem';
import type { Country } from '@/types';
import type { Continent } from '@/types/enums';
import { cn } from '@/lib/utils';

interface CountryListViewProps {
  countries: Country[];
}

const CONTINENT_ORDER: Record<Continent, number> = {
  'Europe': 0,
  'Asia': 1,
  'Africa': 2,
  'North America': 3,
  'South America': 4,
  'Oceania': 5,
  'Antarctica': 6,
};

export function CountryListView({ countries }: CountryListViewProps) {
  const visits = useCountryStore((s) => s.visits);

  const groupedCountries = useMemo(() => {
    const groups = new Map<Continent, Country[]>();

    // Group countries by continent
    countries.forEach((country) => {
      if (!groups.has(country.continent)) {
        groups.set(country.continent, []);
      }
      groups.get(country.continent)!.push(country);
    });

    // Sort continents by defined order
    const sorted = Array.from(groups.entries()).sort(
      ([continentA], [continentB]) =>
        (CONTINENT_ORDER[continentA] ?? 999) - (CONTINENT_ORDER[continentB] ?? 999)
    );

    return sorted;
  }, [countries]);

  const getContinentStats = (continent: Continent) => {
    const continentCountries = countries.filter((c) => c.continent === continent);
    const visited = continentCountries.filter(
      (c) => visits.get(c.code)?.status === 'visited'
    ).length;
    return { visited, total: continentCountries.length };
  };

  return (
    <div className="flex flex-col gap-6">
      {groupedCountries.map(([continent, continentCountries]) => {
        const stats = getContinentStats(continent);
        const progressPercent = stats.total > 0 ? (stats.visited / stats.total) * 100 : 0;

        return (
          <div key={continent} className="flex flex-col gap-2">
            {/* Sticky continent header */}
            <div className="sticky top-0 bg-background z-10 pb-2">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-foreground">
                  {continent}
                </h3>
                <div className="flex items-center gap-2 text-xs text-foreground-muted">
                  <span>{stats.visited} van {stats.total}</span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
                <div
                  className="h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%`, backgroundColor: 'var(--color-visited)' }}
                />
              </div>
            </div>

            {/* Continent countries */}
            <div className="flex flex-col rounded-[var(--radius-lg)] border border-border bg-card overflow-hidden">
              {continentCountries.map((country, index) => (
                <div
                  key={country.code}
                  className={cn(
                    'border-b border-border',
                    index === continentCountries.length - 1 && 'border-b-0'
                  )}
                >
                  <CountryListItem country={country} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
