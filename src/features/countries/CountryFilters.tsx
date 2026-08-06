import { m } from 'motion/react';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils';
import { springPop } from '@/lib/motion';
import { continentLabels, statusLabels } from '@/lib/labels';
import type { Continent, CountryStatus } from '@/types';

/** Shared chip motion: a quick punch down on press, springing back on release. */
const chipMotion = {
  whileTap: { scale: 0.92 },
  transition: springPop,
} as const;

const continents: Continent[] = [
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Oceania',
];

const statuses: CountryStatus[] = ['visited', 'planned', 'not_visited'];

export function CountryFilters() {
  const filters = useUIStore((s) => s.filters);
  const setFilters = useUIStore((s) => s.setFilters);
  const resetFilters = useUIStore((s) => s.resetFilters);

  const hasActiveFilters =
    filters.continents.length > 0 || filters.statuses.length > 0;

  function toggleContinent(continent: Continent) {
    const current = filters.continents;
    const next = current.includes(continent)
      ? current.filter((c) => c !== continent)
      : [...current, continent];
    setFilters({ continents: next });
  }

  function toggleStatus(status: CountryStatus) {
    const current = filters.statuses;
    const next = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    setFilters({ statuses: next });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-foreground-muted shrink-0">
          Continent:
        </span>
        {continents.map((continent) => {
          const active = filters.continents.includes(continent);
          return (
            <m.button
              key={continent}
              type="button"
              onClick={() => toggleContinent(continent)}
              {...chipMotion}
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
                'transition-colors duration-[var(--transition-fast)] cursor-pointer',
                'focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background-secondary text-foreground-secondary hover:bg-background-secondary/80',
              )}
            >
              {continentLabels[continent]}
            </m.button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-foreground-muted shrink-0">
          Status:
        </span>
        {statuses.map((value) => {
          const active = filters.statuses.includes(value);
          return (
            <m.button
              key={value}
              type="button"
              onClick={() => toggleStatus(value)}
              {...chipMotion}
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
                'transition-colors duration-[var(--transition-fast)] cursor-pointer',
                'focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background-secondary text-foreground-secondary hover:bg-background-secondary/80',
              )}
            >
              {statusLabels[value]}
            </m.button>
          );
        })}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
              'text-destructive hover:bg-destructive/10',
              'transition-colors duration-[var(--transition-fast)] cursor-pointer',
              'focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1',
            )}
          >
            Wissen
          </button>
        )}
      </div>
    </div>
  );
}
