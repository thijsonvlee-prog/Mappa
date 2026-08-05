import { useMemo } from 'react';
import { Globe, MapPin, Building2 } from 'lucide-react';
import { WorldMap } from './WorldMap';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useCountryStore } from '@/stores/country-store';
import { countryMap, TOTAL_COUNTRIES } from '@/data/countries-lookup';
import { computeStats } from '@/lib/stats-utils';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { getCountry } from '@/data/countries-lookup';
import { CountryFlag } from '@/components/country/CountryFlag';
import { StatusBadge } from '@/components/country/StatusBadge';
import { cn } from '@/lib/utils';
import { formatPercentage } from '@/lib/utils';

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4',
        'bg-card border border-border rounded-[var(--radius-lg)]',
        'shadow-sm',
      )}
    >
      <div className="flex items-center justify-center size-10 rounded-[var(--radius-md)] bg-primary-light text-primary shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-foreground leading-tight">{value}</p>
        <p className="text-xs text-foreground-muted">{label}</p>
      </div>
    </div>
  );
}

function StatsPanel() {
  const visits = useCountryStore((s) => s.visits);

  const stats = useMemo(
    () => computeStats(visits, countryMap, TOTAL_COUNTRIES),
    [visits],
  );

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>
        Je ontdekkingen
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Landen"
          value={stats.totalVisited}
          icon={<Globe className="size-5" />}
        />
        <StatCard
          label="Van wereld"
          value={formatPercentage(stats.percentageOfWorld)}
          icon={<MapPin className="size-5" />}
        />
        <StatCard
          label="Continenten"
          value={`${stats.continentsReached}/${stats.totalContinents}`}
          icon={<Globe className="size-5" />}
        />
        <StatCard
          label="Steden"
          value={stats.totalCities}
          icon={<Building2 className="size-5" />}
        />
      </div>

      {stats.recentlyAdded.length > 0 && (
        <div className="mt-2">
          <h3 className="text-sm font-medium text-foreground mb-2">Recent bezocht</h3>
          <div className="flex flex-col gap-1">
            {stats.recentlyAdded.map((visit) => {
              const country = getCountry(visit.countryCode);
              if (!country) return null;
              return (
                <div
                  key={visit.countryCode}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2',
                    'rounded-[var(--radius-md)] hover:bg-background-secondary',
                    'transition-colors duration-[var(--transition-fast)]',
                  )}
                >
                  <CountryFlag flag={country.flag} size="sm" />
                  <span className="text-sm text-foreground truncate flex-1">
                    {country.name}
                  </span>
                  <StatusBadge status={visit.status} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function MapPage() {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <div className="flex h-full overflow-hidden">
        {/* Map fills flex-1 */}
        <div className="flex-1 relative">
          <ErrorBoundary
            fallbackTitle="The map couldn't be displayed"
            fallbackDescription="Try reloading the page. Your travel data is unaffected."
          >
            <WorldMap className="absolute inset-0" />
          </ErrorBoundary>
        </div>
        {/* Floating stats panel (300px, semi-transparent) */}
        <div className="absolute bottom-6 right-6 w-80 bg-card/90 backdrop-blur-sm border border-border rounded-[var(--radius-xl)] p-6 shadow-lg max-h-[70vh] overflow-y-auto z-10">
          <StatsPanel />
        </div>
      </div>
    );
  }

  // Mobile: Full-screen map with bottom sheet stats
  return (
    <div className="flex flex-col h-full relative">
      {/* Map fills entire screen */}
      <ErrorBoundary
        fallbackTitle="The map couldn't be displayed"
        fallbackDescription="Try reloading the page. Your travel data is unaffected."
      >
        <WorldMap className="absolute inset-0" />
      </ErrorBoundary>

      {/* Bottom sheet stats (translucent overlay at bottom) */}
      <div className="absolute bottom-0 left-0 right-0 rounded-t-[var(--radius-xl)] bg-card/95 backdrop-blur-sm border-t border-border p-6 shadow-lg max-h-[50vh] overflow-y-auto">
        <StatsPanel />
      </div>
    </div>
  );
}
