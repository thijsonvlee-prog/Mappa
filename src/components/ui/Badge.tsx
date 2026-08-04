import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'visited' | 'planned' | 'not_visited' | 'outline';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-primary-light text-primary',
  visited:
    'bg-visited-light text-[var(--color-visited-foreground)]',
  planned:
    'bg-planned-light text-[var(--color-planned-foreground)]',
  not_visited:
    'bg-not-visited/20 text-[var(--color-not-visited-foreground)]',
  outline:
    'bg-transparent text-foreground-secondary border border-border-strong',
};

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        'transition-colors duration-[var(--transition-fast)]',
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  ),
);
Badge.displayName = 'Badge';

export { Badge };
export type { BadgeProps, BadgeVariant };
