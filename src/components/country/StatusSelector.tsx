import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { Check, MapPin, Circle } from 'lucide-react';
import type { CountryStatus } from '@/types';
import { statusLabels } from '@/lib/labels';
import { cn } from '@/lib/utils';

const options: { value: CountryStatus; icon: typeof Check; dotColor: string }[] = [
  { value: 'not_visited', icon: Circle, dotColor: 'bg-not-visited' },
  { value: 'planned', icon: MapPin, dotColor: 'bg-planned' },
  { value: 'visited', icon: Check, dotColor: 'bg-visited' },
];

interface StatusSelectorProps {
  value: CountryStatus;
  onChange: (status: CountryStatus) => void;
  className?: string;
}

export function StatusSelector({ value, onChange, className }: StatusSelectorProps) {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(val) => {
        if (val) onChange(val as CountryStatus);
      }}
      className={cn('inline-flex rounded-[var(--radius-md)] border border-border p-0.5 gap-0.5', className)}
    >
      {options.map((option) => (
        <ToggleGroup.Item
          key={option.value}
          value={option.value}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium',
            'transition-colors duration-[var(--transition-fast)]',
            'text-foreground-muted hover:text-foreground hover:bg-background-secondary',
            'data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:shadow-sm',
            'cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1',
          )}
        >
          <span className={cn('size-2 rounded-full shrink-0', option.dotColor)} />
          <option.icon className="size-3.5" />
          {statusLabels[option.value]}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
