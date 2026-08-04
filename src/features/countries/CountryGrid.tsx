import { CountryCard } from './CountryCard';
import type { Country } from '@/types';

interface CountryGridProps {
  countries: Country[];
}

export function CountryGrid({ countries }: CountryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {countries.map((country) => (
        <CountryCard key={country.code} country={country} />
      ))}
    </div>
  );
}
