import { Check, MapPin, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { statusLabels } from '@/lib/labels';

const legendItems = [
  { status: 'visited', colorClass: 'bg-visited', icon: Check },
  { status: 'planned', colorClass: 'bg-planned', icon: MapPin },
  { status: 'not_visited', colorClass: 'bg-not-visited', icon: Circle },
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
        <div key={item.status} className="flex items-center gap-1.5">
          <span className={cn('size-2.5 rounded-full shrink-0', item.colorClass)} />
          <item.icon className="size-3 shrink-0" />
          <span>{statusLabels[item.status]}</span>
        </div>
      ))}
    </div>
  );
}
