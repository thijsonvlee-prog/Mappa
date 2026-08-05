import { Check, MapPin, Circle } from 'lucide-react';
import type { CountryStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { statusLabels } from '@/lib/labels';

const statusConfig: Record<CountryStatus, { variant: 'visited' | 'planned' | 'not_visited'; icon: typeof Check }> = {
  visited: { variant: 'visited', icon: Check },
  planned: { variant: 'planned', icon: MapPin },
  not_visited: { variant: 'not_visited', icon: Circle },
};

interface StatusBadgeProps {
  status: CountryStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { variant, icon: Icon } = statusConfig[status];

  return (
    <Badge variant={variant} className={className}>
      <Icon className="size-3" />
      {statusLabels[status]}
    </Badge>
  );
}
