import { getCountry } from '@/data/countries-lookup';
import { useCountryStore } from '@/stores/country-store';
import { CountryFlag } from '@/components/country/CountryFlag';
import { StatusBadge } from '@/components/country/StatusBadge';

interface MapTooltipProps {
  countryCode: string | null;
  position: { x: number; y: number };
  countryName: string;
}

export function MapTooltip({ countryCode, position, countryName }: MapTooltipProps) {
  const status = useCountryStore((s) =>
    countryCode ? s.visits.get(countryCode)?.status : undefined,
  );

  if (!countryCode) return null;

  const country = getCountry(countryCode);
  const displayName = country?.name ?? countryName;
  const flag = country?.flag;

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: position.x + 12,
        top: position.y - 8,
      }}
    >
      <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-[var(--radius-md)] shadow-lg text-sm whitespace-nowrap">
        {flag && <CountryFlag flag={flag} size="sm" />}
        <span className="font-medium text-foreground">{displayName}</span>
        <StatusBadge status={status ?? 'not_visited'} />
      </div>
    </div>
  );
}
