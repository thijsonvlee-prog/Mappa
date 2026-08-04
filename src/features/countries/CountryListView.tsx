import { CountryListItem } from './CountryListItem';
import type { Country } from '@/types';

interface CountryListViewProps {
  countries: Country[];
}

export function CountryListView({ countries }: CountryListViewProps) {
  return (
    <div className="flex flex-col divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-card overflow-hidden">
      {countries.map((country) => (
        <CountryListItem key={country.code} country={country} />
      ))}
    </div>
  );
}
