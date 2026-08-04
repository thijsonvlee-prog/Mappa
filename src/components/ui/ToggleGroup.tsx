import {
  forwardRef,
  type ComponentRef,
  type ComponentPropsWithoutRef,
} from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { cn } from '@/lib/utils';

const ToggleGroup = forwardRef<
  ComponentRef<typeof ToggleGroupPrimitive.Root>,
  ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn(
      'inline-flex items-center rounded-[var(--radius-md)] border border-border bg-card',
      className,
    )}
    {...props}
  />
));
ToggleGroup.displayName = 'ToggleGroup';

const ToggleGroupItem = forwardRef<
  ComponentRef<typeof ToggleGroupPrimitive.Item>,
  ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-foreground-muted',
      'transition-colors duration-[var(--transition-fast)]',
      'hover:bg-background-secondary hover:text-foreground',
      'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:pointer-events-none disabled:opacity-50',
      'first:rounded-l-[var(--radius-md)] last:rounded-r-[var(--radius-md)]',
      'border-r border-border last:border-r-0',
      'cursor-pointer',
      className,
    )}
    {...props}
  />
));
ToggleGroupItem.displayName = 'ToggleGroupItem';

export { ToggleGroup, ToggleGroupItem };
