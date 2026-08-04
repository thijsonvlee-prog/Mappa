import * as ToggleGroup from '@radix-ui/react-toggle-group';
import type { CountryStatus } from '@/types';
import { cn } from '@/lib/utils';

const options: { value: CountryStatus; label: string; dotColor: string }[] = [
  { value: 'not_visited', label: 'Not Visited', dotColor: 'bg-not-visited' },
  { value: 'planned', label: 'Planned', dotColor: 'bg-planned' },
  { value: 'visited', label: 'Visited', dotColor: 'bg-visited' },
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
          {option.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
