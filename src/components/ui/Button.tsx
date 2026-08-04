import {
  forwardRef,
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'default' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  children?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary-hover',
  secondary:
    'border border-border-strong bg-transparent text-foreground hover:bg-background-secondary',
  ghost: 'bg-transparent text-foreground hover:bg-background-secondary',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive-hover',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
  icon: 'h-10 w-10',
};

const baseStyles = [
  'inline-flex items-center justify-center rounded-md font-medium',
  'transition-colors duration-[var(--transition-fast)]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  'disabled:pointer-events-none disabled:opacity-50',
  'cursor-pointer',
].join(' ');

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      asChild = false,
      children,
      ...props
    },
    ref,
  ) => {
    const classes = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className,
    );

    if (asChild && isValidElement<Record<string, unknown>>(children)) {
      return cloneElement(children, {
        ...props,
        className: cn(
          classes,
          (children.props as { className?: string }).className,
        ),
        ref,
      });
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
