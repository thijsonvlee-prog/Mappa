import {
  forwardRef,
  useState,
  useCallback,
  useSyncExternalStore,
  type ComponentRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastVariant = 'default' | 'destructive' | 'success';

const variantStyles: Record<ToastVariant, string> = {
  default: 'border-border bg-card text-foreground',
  destructive: 'border-destructive bg-destructive text-destructive-foreground',
  success: 'border-success bg-success text-success-foreground',
};

const ToastProvider = ToastPrimitive.Provider;

const ToastViewport = forwardRef<
  ComponentRef<typeof ToastPrimitive.Viewport>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:max-w-[420px]',
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = 'ToastViewport';

interface ToastProps extends ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {
  variant?: ToastVariant;
}

const Toast = forwardRef<
  ComponentRef<typeof ToastPrimitive.Root>,
  ToastProps
>(({ className, variant = 'default', ...props }, ref) => (
  <ToastPrimitive.Root
    ref={ref}
    className={cn(
      'group pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-[var(--radius-lg)] border p-4 shadow-lg',
      'transition-all duration-[var(--transition-fast)]',
      'data-[state=open]:animate-[slideInRight_200ms_ease-out] data-[state=closed]:animate-[fadeOut_150ms_ease-in]',
      'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]',
      variantStyles[variant],
      className,
    )}
    {...props}
  />
));
Toast.displayName = 'Toast';

const ToastTitle = forwardRef<
  ComponentRef<typeof ToastPrimitive.Title>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn('text-sm font-semibold', className)}
    {...props}
  />
));
ToastTitle.displayName = 'ToastTitle';

const ToastDescription = forwardRef<
  ComponentRef<typeof ToastPrimitive.Description>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
));
ToastDescription.displayName = 'ToastDescription';

const ToastAction = forwardRef<
  ComponentRef<typeof ToastPrimitive.Action>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-border bg-transparent px-3 text-sm font-medium',
      'transition-colors duration-[var(--transition-fast)]',
      'hover:bg-background-secondary',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:pointer-events-none disabled:opacity-50',
      'cursor-pointer',
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = 'ToastAction';

const ToastClose = forwardRef<
  ComponentRef<typeof ToastPrimitive.Close>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-sm text-foreground/50 opacity-0 transition-opacity',
      'hover:text-foreground group-hover:opacity-100',
      'focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'cursor-pointer',
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitive.Close>
));
ToastClose.displayName = 'ToastClose';

interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  action?: ReactNode;
  duration?: number;
}

type Listener = () => void;

let toasts: ToastData[] = [];
const listeners = new Set<Listener>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return toasts;
}

function addToast(toast: Omit<ToastData, 'id'>) {
  const id = crypto.randomUUID();
  toasts = [...toasts, { ...toast, id }];
  emitChange();
  return id;
}

function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emitChange();
}

export function useToast() {
  const currentToasts = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const toast = useCallback((data: Omit<ToastData, 'id'>) => {
    return addToast(data);
  }, []);

  const dismiss = useCallback((id: string) => {
    dismissToast(id);
  }, []);

  return { toasts: currentToasts, toast, dismiss };
}

export function Toaster() {
  const { toasts: currentToasts, dismiss } = useToast();
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  return (
    <ToastProvider>
      {currentToasts.map((t) => (
        <Toast
          key={t.id}
          variant={t.variant}
          duration={t.duration}
          open={!openIds.has(t.id) || undefined}
          onOpenChange={(open) => {
            if (!open) {
              setOpenIds((prev) => {
                const next = new Set(prev);
                next.add(t.id);
                return next;
              });
              dismiss(t.id);
            }
          }}
        >
          <div className="flex flex-col gap-1">
            {t.title && <ToastTitle>{t.title}</ToastTitle>}
            {t.description && <ToastDescription>{t.description}</ToastDescription>}
          </div>
          {t.action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}

export {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  ToastViewport,
};
export type { ToastData, ToastVariant };
