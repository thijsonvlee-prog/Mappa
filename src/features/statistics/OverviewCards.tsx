import { Globe, MapPin, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
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
    <div className="space-y-8">
      {/* Hero section with circular progress */}
      <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-[var(--radius-xl)] bg-card border border-border">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <CircularProgress
            value={Math.min(stats.totalVisited, 195)}
            max={195}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatedNumber
              value={stats.totalVisited}
              className="text-4xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-serif)' }}
            />
            <div className="text-xs text-foreground-muted">landen</div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-lg text-foreground-muted">
            {formatPercentage(stats.percentageOfWorld)} van de wereld
          </p>
        </div>
      </div>

      {/* Quick stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard
          icon={<MapPin className="h-6 w-6" />}
          label="Continenten"
          value={`${stats.continentsReached}/${stats.totalContinents}`}
        />
        <StatCard
          icon={<Building2 className="h-6 w-6" />}
          label="Steden"
          value={stats.totalCities}
        />
        <StatCard
          icon={<Globe className="h-6 w-6" />}
          label="Landen/jaar"
          value={Math.round(stats.totalVisited / (stats.recentlyAdded.length || 1))}
          className="hidden lg:block"
        />
      </div>
    </div>
  );
}
