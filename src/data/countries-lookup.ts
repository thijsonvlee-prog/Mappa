import { countries } from './countries';
import type { Country } from '@/types/country';
import type { Continent } from '@/types/enums';

export { countries } from './countries';

export const countryMap = new Map<string, Country>(
  countries.map((c) => [c.code, c]),
);

export function getCountry(code: string): Country | undefined {
  return countryMap.get(code);
}

export function getCountriesByContinent(continent: Continent): Country[] {
  return countries.filter((c) => c.continent === continent);
}

export const allContinents: Continent[] = [
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Oceania',
];

export const TOTAL_COUNTRIES = countries.filter(
  (c) => c.continent !== 'Antarctica',
).length;
