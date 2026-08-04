import { Globe, TrendingUp, Map, Building } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { formatPercentage } from '@/lib/utils';
import { useStatistics } from './hooks/useStatistics';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  className?: string;
}

function StatCard({ icon, label, value, className }: StatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="flex items-center gap-4 p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-foreground-muted">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function OverviewCards() {
  const stats = useStatistics();

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        icon={<Globe className="h-6 w-6" />}
        label="Countries Visited"
        value={stats.totalVisited}
      />
      <StatCard
        icon={<TrendingUp className="h-6 w-6" />}
        label="World Coverage"
        value={formatPercentage(stats.percentageOfWorld)}
      />
      <StatCard
        icon={<Map className="h-6 w-6" />}
        label="Continents"
        value={`${stats.continentsReached} of ${stats.totalContinents}`}
      />
      <StatCard
        icon={<Building className="h-6 w-6" />}
        label="Cities Visited"
        value={stats.totalCities}
      />
    </div>
  );
}
