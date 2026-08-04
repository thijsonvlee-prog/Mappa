import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  className?: string;
}

export function StatCard({ title, value, icon, description, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card p-6 shadow-sm',
        'transition-colors duration-[var(--transition-fast)]',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground-muted">{title}</p>
        <div className="text-foreground-muted [&>svg]:h-5 [&>svg]:w-5">{icon}</div>
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</p>
      {description && (
        <p className="mt-1 text-xs text-foreground-muted">{description}</p>
      )}
    </div>
  );
}
