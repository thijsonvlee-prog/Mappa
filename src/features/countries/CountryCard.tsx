import { useCountryStore } from '@/stores/country-store';
import { useUIStore } from '@/stores/ui-store';
import { CountryFlag } from '@/components/country/CountryFlag';
import { StatusBadge } from '@/components/country/StatusBadge';
import { RatingStars } from '@/components/country/RatingStars';
import { cn } from '@/lib/utils';
import { continentLabels } from '@/lib/labels';
import type { Country } from '@/types';

interface CountryCardProps {
  country: Country;
}

export function CountryCard({ country }: CountryCardProps) {
  const visit = useCountryStore((s) => s.visits.get(country.code));
  const openDetail = useUIStore((s) => s.openDetail);

  const status = visit?.status ?? 'not_visited';

  return (
    <button
      type="button"
      onClick={() => openDetail(country.code)}
      className={cn(
        'flex flex-col items-start gap-3 p-4 w-full text-left',
        'rounded-[var(--radius-lg)] border border-border bg-card',
        'shadow-sm hover:shadow-md hover:border-border-strong',
        'transition-all duration-[var(--transition-fast)]',
        'cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1',
      )}
    >
      <div className="flex items-center gap-2.5 w-full">
        <CountryFlag flag={country.flag} size="md" />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {country.name}
          </h3>
          <p className="text-xs text-foreground-muted">{continentLabels[country.continent]}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 w-full">
        <StatusBadge status={status} />
        {visit?.rating !== undefined && visit.rating > 0 && (
          <RatingStars value={visit.rating} readonly className="ml-auto" />
        )}
      </div>
    </button>
  );
}
