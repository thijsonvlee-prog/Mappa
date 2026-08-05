import type { Continent, CountryStatus } from '@/types';

export const continentLabels: Record<Continent, string> = {
  Africa: 'Afrika',
  Asia: 'Azië',
  Europe: 'Europa',
  'North America': 'Noord-Amerika',
  'South America': 'Zuid-Amerika',
  Oceania: 'Oceanië',
  Antarctica: 'Antarctica',
};

export const statusLabels: Record<CountryStatus, string> = {
  visited: 'Bezocht',
  planned: 'Gepland',
  not_visited: 'Niet bezocht',
};
