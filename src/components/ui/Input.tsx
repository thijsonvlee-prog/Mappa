import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leadingIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leadingIcon, id: idProp, ...props }, ref) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const errorId = `${id}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leadingIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted [&>svg]:h-4 [&>svg]:w-4">
              {leadingIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'flex h-10 w-full border border-border bg-card px-3 py-2 text-sm text-foreground',
              'rounded-[var(--radius-md)]',
              'placeholder:text-foreground-muted',
              'transition-colors duration-[var(--transition-fast)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              'disabled:cursor-not-allowed disabled:opacity-50',
              leadingIcon && 'pl-10',
              error && 'border-destructive focus-visible:ring-destructive',
              className,
            )}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />
        </div>
        {error && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
export type { InputProps };
