import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

export function CountrySearch() {
  const setSearchQuery = useUIStore((s) => s.setSearchQuery);
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);

  function handleClear() {
    setValue('');
    setSearchQuery('');
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted">
        <Search className="size-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Zoek landen..."
        className={cn(
          'flex h-10 w-full rounded-md border border-border bg-card pl-10 pr-9 py-2 text-sm text-foreground',
          'placeholder:text-foreground-muted',
          'transition-colors duration-[var(--transition-fast)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        )}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground cursor-pointer"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
