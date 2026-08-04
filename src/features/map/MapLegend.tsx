import { cn } from '@/lib/utils';

const legendItems = [
  { label: 'Visited', colorClass: 'bg-visited' },
  { label: 'Planned', colorClass: 'bg-planned' },
  { label: 'Not Visited', colorClass: 'bg-not-visited' },
] as const;

interface MapLegendProps {
  className?: string;
}

export function MapLegend({ className }: MapLegendProps) {
  return (
    <div
      className={cn(
        'absolute bottom-3 left-3 z-10',
        'flex items-center gap-4 px-3 py-2',
        'bg-card/80 backdrop-blur-sm',
        'border border-border rounded-[var(--radius-md)]',
        'shadow-sm text-xs text-foreground-secondary',
        className,
      )}
    >
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className={cn('size-2.5 rounded-full shrink-0', item.colorClass)} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
