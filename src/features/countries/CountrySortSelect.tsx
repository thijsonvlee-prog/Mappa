import { ArrowUpDown } from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils';

const sortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'status', label: 'Status' },
  { value: 'rating', label: 'Rating' },
  { value: 'updatedAt', label: 'Last Updated' },
] as const;

export function CountrySortSelect() {
  const sortBy = useUIStore((s) => s.sortBy);
  const sortDirection = useUIStore((s) => s.sortDirection);
  const setSortBy = useUIStore((s) => s.setSortBy);
  const toggleSortDirection = useUIStore((s) => s.toggleSortDirection);

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
        className={cn(
          'h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground',
          'transition-colors duration-[var(--transition-fast)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'cursor-pointer',
        )}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={toggleSortDirection}
        aria-label={`Sort ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
        className={cn(
          'flex items-center justify-center size-9',
          'border border-border rounded-md bg-card hover:bg-card-hover text-foreground',
          'transition-colors duration-[var(--transition-fast)]',
          'cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1',
        )}
      >
        <ArrowUpDown
          className={cn(
            'size-4 transition-transform duration-[var(--transition-fast)]',
            sortDirection === 'desc' && 'rotate-180',
          )}
        />
      </button>
    </div>
  );
}
