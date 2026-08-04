import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { CountryCard } from './CountryCard';
import type { Country } from '@/types';

interface CountryGridProps {
  countries: Country[];
}

export function CountryGrid({ countries }: CountryGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: Math.ceil(countries.length / 4),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 280,
    overscan: 2,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  return (
    <div
      ref={parentRef}
      className="w-full overflow-y-auto"
      style={{ height: '600px' }}
    >
      <div
        style={{
          height: `${totalSize}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => {
          const startIndex = virtualItem.index * 4;
          const rowCountries = countries.slice(startIndex, startIndex + 4);

          return (
            <div
              key={virtualItem.key}
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
