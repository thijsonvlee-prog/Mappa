import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagChipProps {
  name: string;
  color: string;
  onRemove?: () => void;
  className?: string;
}

export function TagChip({ name, color, onRemove, className }: TagChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        'border transition-colors duration-[var(--transition-fast)]',
        className,
      )}
      style={{
        backgroundColor: `${color}18`,
        borderColor: `${color}40`,
        color,
      }}
    >
      {name}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-ring"
          aria-label={`Remove ${name}`}
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  );
}
