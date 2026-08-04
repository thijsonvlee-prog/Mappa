import {
  forwardRef,
  type ComponentRef,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
} from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = forwardRef<
  ComponentRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-overlay backdrop-blur-sm',
      'data-[state=open]:animate-[fadeIn_200ms_ease-out] data-[state=closed]:animate-[fadeOut_150ms_ease-in]',
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = 'SheetOverlay';

type SheetSide = 'right' | 'left' | 'top' | 'bottom';

const slideAnimations: Record<SheetSide, string> = {
  right:
    'inset-y-0 right-0 h-full w-3/4 max-w-sm data-[state=open]:animate-[slideInRight_200ms_ease-out] data-[state=closed]:animate-[slideOutRight_150ms_ease-in]',
  left:
    'inset-y-0 left-0 h-full w-3/4 max-w-sm data-[state=open]:animate-[slideInLeft_200ms_ease-out] data-[state=closed]:animate-[slideOutLeft_150ms_ease-in]',
  top:
    'inset-x-0 top-0 w-full data-[state=open]:animate-[slideInTop_200ms_ease-out] data-[state=closed]:animate-[slideOutTop_150ms_ease-in]',
  bottom:
    'inset-x-0 bottom-0 w-full data-[state=open]:animate-[slideInBottom_200ms_ease-out] data-[state=closed]:animate-[slideOutBottom_150ms_ease-in]',
};

interface SheetContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: SheetSide;
}

const SheetContent = forwardRef<
  ComponentRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ className, children, side = 'right', ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed z-50 border border-border bg-card p-6 shadow-lg',
        slideAnimations[side],
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm text-foreground-muted opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = 'SheetContent';

function SheetHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col gap-1.5 text-center sm:text-left', className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  );
}

const SheetTitle = forwardRef<
  ComponentRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none text-foreground', className)}
    {...props}
  />
));
SheetTitle.displayName = 'SheetTitle';

const SheetDescription = forwardRef<
  ComponentRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-foreground-muted', className)}
    {...props}
  />
));
SheetDescription.displayName = 'SheetDescription';

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
};
