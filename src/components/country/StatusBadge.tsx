import type { CountryStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';

const statusConfig: Record<CountryStatus, { label: string; variant: 'visited' | 'planned' | 'not_visited' }> = {
  visited: { label: 'Visited', variant: 'visited' },
  planned: { label: 'Planned', variant: 'planned' },
  not_visited: { label: 'Not Visited', variant: 'not_visited' },
};

interface StatusBadgeProps {
  status: CountryStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, variant } = statusConfig[status];

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
