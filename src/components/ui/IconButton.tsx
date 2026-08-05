import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type IconButtonVariant = 'default' | 'ghost';
type IconButtonSize = 'sm' | 'md';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  children: ReactNode;
}

const variantStyles: Record<IconButtonVariant, string> = {
  default:
    'bg-background-secondary text-foreground hover:bg-border border border-border',
  ghost: 'bg-transparent text-foreground-secondary hover:bg-background-secondary hover:text-foreground',
};

const sizeStyles: Record<IconButtonSize, string> = {
  sm: 'h-8 w-8 [&>svg]:h-4 [&>svg]:w-4',
  md: 'h-10 w-10 [&>svg]:h-5 [&>svg]:w-5',
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-[var(--radius-md)]',
        'transition-colors duration-[var(--transition-fast)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:pointer-events-none disabled:opacity-50',
        'cursor-pointer',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);
IconButton.displayName = 'IconButton';

export { IconButton };
export type { IconButtonProps, IconButtonVariant, IconButtonSize };
