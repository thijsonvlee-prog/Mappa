import { useMemo, useState } from 'react';
import { Globe, MapPin, Map, Building2 } from 'lucide-react';
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

export function MapPage() {
  const visits = useCountryStore((s) => s.visits);
  const isDesktop = useIsDesktop();
  const [bottomSheetState, setBottomSheetState] = useState<'collapsed' | 'half' | 'full'>('collapsed');

  const stats = useMemo(
    () => computeStats(visits, countryMap, TOTAL_COUNTRIES),
    [visits],
  );

  const statsContent = (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-foreground">Travel Stats</h2>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Countries"
          value={stats.totalVisited}
          icon={<Globe className="size-5" />}
        />
        <StatCard
          label="Of World"
          value={formatPercentage(stats.percentageOfWorld)}
          icon={<Map className="size-5" />}
        />
        <StatCard
          label="Continents"
          value={`${stats.continentsReached}/${stats.totalContinents}`}
          icon={<MapPin className="size-5" />}
        />
        <StatCard
          label="Cities"
          value={stats.totalCities}
          icon={<Building2 className="size-5" />}
        />
      </div>

      {stats.recentlyAdded.length > 0 && (
        <div className="mt-2">
          <h3 className="text-sm font-medium text-foreground mb-2">Recently Visited</h3>
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

  if (isDesktop) {
    return (
      <div className="flex h-full">
        <div className="flex-1 relative">
          <ErrorBoundary
            fallbackTitle="The map couldn't be displayed"
            fallbackDescription="Try reloading the page. Your travel data is unaffected."
          >
            <WorldMap className="absolute inset-0" />
          </ErrorBoundary>
        </div>
        <aside className="w-80 border-l border-border overflow-y-auto bg-background p-4">
          {statsContent}
        </aside>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <ErrorBoundary
        fallbackTitle="The map couldn't be displayed"
        fallbackDescription="Try reloading the page. Your travel data is unaffected."
      >
        <WorldMap className="absolute inset-0" />
      </ErrorBoundary>

      <button
        onClick={() => setBottomSheetState(bottomSheetState === 'collapsed' ? 'half' : 'collapsed')}
        className="absolute bottom-0 left-0 right-0 z-40 flex flex-col items-center gap-2 bg-card border-t border-border px-4 py-3 rounded-t-2xl max-w-lg mx-auto"
      >
        <div className="w-8 h-1 bg-border-strong rounded-full" />
        <span className="text-xs font-medium text-foreground-muted">
          {stats.totalVisited} countries visited
        </span>
      </button>

      {bottomSheetState !== 'collapsed' && (
        <div className="absolute bottom-0 left-0 right-0 z-50 bg-card border-t border-border rounded-t-2xl max-h-96 overflow-y-auto">
          <div className="p-4">
            {statsContent}
          </div>
        </div>
      )}
    </div>
  );
}
