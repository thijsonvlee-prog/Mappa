import { useCountryStore } from '@/stores/country-store';
import { useUIStore } from '@/stores/ui-store';
import { CountryFlag } from '@/components/country/CountryFlag';
import { StatusBadge } from '@/components/country/StatusBadge';
import { RatingStars } from '@/components/country/RatingStars';
import { cn } from '@/lib/utils';
import type { Country } from '@/types';

interface CountryListItemProps {
  country: Country;
}

export function CountryListItem({ country }: CountryListItemProps) {
  const visit = useCountryStore((s) => s.visits.get(country.code));
  const openDetail = useUIStore((s) => s.openDetail);

  const status = visit?.status ?? 'not_visited';

  return (
    <button
      type="button"
      onClick={() => openDetail(country.code)}
      className={cn(
        'flex items-center gap-3 px-4 py-3 w-full text-left',
        'hover:bg-background-secondary',
        'transition-colors duration-[var(--transition-fast)]',
        'cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1',
      )}
    >
      <CountryFlag flag={country.flag} size="sm" />
      <span className="text-sm font-medium text-foreground truncate min-w-0 flex-1">
        {country.name}
      </span>
      <span className="text-xs text-foreground-muted shrink-0 hidden sm:block">
        {country.continent}
      </span>
      <StatusBadge status={status} className="shrink-0" />
      {visit?.rating !== undefined && visit.rating > 0 && (
        <RatingStars value={visit.rating} readonly className="shrink-0 hidden md:flex" />
      )}
      {visit?.updatedAt && (
        <span className="text-xs text-foreground-muted shrink-0 hidden lg:block w-24 text-right">
          {new Date(visit.updatedAt).toLocaleDateString()}
        </span>
      )}
    </button>
  );
}
