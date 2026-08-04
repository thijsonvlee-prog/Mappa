import type { Country } from '@/types';

export function searchCountries(countries: Country[], query: string): Country[] {
  if (!query.trim()) return countries;
  const q = query.toLowerCase().trim();
  return countries.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.capital.toLowerCase().includes(q),
  );
}
