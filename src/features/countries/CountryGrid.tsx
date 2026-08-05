import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { CountryCard } from './CountryCard';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { Country } from '@/types';

interface CountryGridProps {
  countries: Country[];
}

export function CountryGrid({ countries }: CountryGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Mirrors the Tailwind breakpoints on the grid below (sm/lg/xl), so the
  // virtualizer groups the same number of cards per row that CSS renders.
  const isSm = useMediaQuery('(min-width: 640px)');
  const isLg = useMediaQuery('(min-width: 1024px)');
  const isXl = useMediaQuery('(min-width: 1280px)');
  const columns = isXl ? 4 : isLg ? 3 : isSm ? 2 : 1;

  const virtualizer = useVirtualizer({
    count: Math.ceil(countries.length / columns),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 132,
    overscan: 4,
    measureElement: (el) => el.getBoundingClientRect().height,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  return (
    <div ref={parentRef} className="w-full overflow-y-auto" style={{ height: '600px' }}>
      <div
        style={{
          height: `${totalSize}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => {
          const startIndex = virtualItem.index * columns;
          const rowCountries = countries.slice(startIndex, startIndex + columns);

          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 py-4"
            >
              {rowCountries.map((country) => (
                <CountryCard key={country.code} country={country} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
