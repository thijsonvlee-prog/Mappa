import { forwardRef, type HTMLAttributes } from 'react';
import { Check, MapPin, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'visited' | 'planned' | 'not_visited' | 'outline';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  showIcon?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-primary-light text-primary',
  visited:
    'bg-visited-light text-visited-foreground',
  planned:
    'bg-planned-light text-planned-foreground',
  not_visited:
    'bg-background-secondary text-foreground-muted',
  outline:
    'bg-transparent text-foreground-secondary border border-border-strong',
};

const iconMap: Record<BadgeVariant, React.ReactNode | null> = {
  default: null,
  visited: <Check className="w-3 h-3" />,
  planned: <MapPin className="w-3 h-3" />,
  not_visited: <Circle className="w-3 h-3" />,
  outline: null,
};

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', showIcon = false, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        'transition-colors duration-[var(--transition-fast)]',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {showIcon && iconMap[variant]}
      {children}
    </span>
  ),
);
Badge.displayName = 'Badge';

export { Badge };
export type { BadgeProps, BadgeVariant };
