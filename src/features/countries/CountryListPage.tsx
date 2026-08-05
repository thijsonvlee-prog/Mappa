import { LayoutGrid, List, Compass } from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';
import { useFilteredCountries } from './hooks/useFilteredCountries';
import { CountrySearch } from './CountrySearch';
import { CountryFilters } from './CountryFilters';
import { CountrySortSelect } from './CountrySortSelect';
import { CountryGrid } from './CountryGrid';
import { CountryListView } from './CountryListView';
import { cn } from '@/lib/utils';

export function CountryListPage() {
  const viewMode = useUIStore((s) => s.viewMode);
  const setViewMode = useUIStore((s) => s.setViewMode);
  const resetFilters = useUIStore((s) => s.resetFilters);
  const filteredCountries = useFilteredCountries();

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-4 p-4 border-b border-border bg-background">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <CountrySearch />
          </div>
          <CountrySortSelect />
          <div className="flex items-center border border-border rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Rasterweergave"
              className={cn(
                'flex items-center justify-center size-9',
                'transition-colors duration-[var(--transition-fast)]',
                'cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1',
                viewMode === 'grid'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-foreground-muted hover:text-foreground',
              )}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="Lijstweergave"
              className={cn(
                'flex items-center justify-center size-9',
                'transition-colors duration-[var(--transition-fast)]',
                'cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1',
                viewMode === 'list'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-foreground-muted hover:text-foreground',
              )}
            >
              <List className="size-4" />
            </button>
          </div>
        </div>

        <CountryFilters />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-sm text-foreground-muted mb-4">
          {filteredCountries.length} {filteredCountries.length === 1 ? 'land' : 'landen'}
        </p>

        {filteredCountries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Compass className="size-10 text-foreground-muted" />
            <p className="text-lg font-medium text-foreground">Geen landen gevonden</p>
            <p className="text-sm text-foreground-muted">
              Pas je zoekopdracht of filters aan.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-medium text-primary hover:text-primary-hover transition-colors cursor-pointer"
            >
              Filters wissen
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <CountryGrid countries={filteredCountries} />
        ) : (
          <CountryListView countries={filteredCountries} />
        )}
      </div>
    </div>
  );
}
