import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { CountryListItem } from './CountryListItem';
import type { Country } from '@/types';

interface CountryListViewProps {
  countries: Country[];
}

export function CountryListView({ countries }: CountryListViewProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: countries.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 10,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  return (
    <div
      ref={parentRef}
      className="flex flex-col rounded-[var(--radius-lg)] border border-border bg-card overflow-y-auto"
      style={{ height: '600px' }}
    >
      <div
        style={{
          height: `${totalSize}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <CountryListItem country={countries[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
