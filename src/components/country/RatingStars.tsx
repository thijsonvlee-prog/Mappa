import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  value?: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  className?: string;
}

export function RatingStars({ value = 0, onChange, readonly = false, className }: RatingStarsProps) {
  function handleClick(star: number) {
    if (readonly || !onChange) return;
    // Click same star to clear
    onChange(star === value ? 0 : star);
  }

  return (
    <div className={cn('inline-flex items-center gap-0.5', className)} role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            disabled={readonly}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            className={cn(
              'p-0.5 transition-colors duration-[var(--transition-fast)]',
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110',
              'disabled:opacity-100 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1 rounded-sm',
            )}
          >
            <Star
              className={cn(
                'size-5 transition-colors',
                filled
                  ? 'text-[var(--color-planned)]'
                  : 'text-foreground-muted',
              )}
              style={{
                fill: filled ? 'var(--color-planned)' : 'transparent',
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
