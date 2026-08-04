import type { CountryVisit, Continent } from '@/types';
import type { Country } from '@/types/country';

export interface StatsData {
  totalVisited: number;
  totalPlanned: number;
  percentageOfWorld: number;
  continentsReached: number;
  totalContinents: number;
  totalCities: number;
  byContinent: { name: Continent; visited: number; total: number }[];
  topRated: CountryVisit[];
  recentlyAdded: CountryVisit[];
  favoriteCountries: CountryVisit[];
}

const ALL_CONTINENTS: Continent[] = [
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Oceania',
];

export function computeStats(
  visits: Map<string, CountryVisit>,
  countryMap: Map<string, Country>,
  totalCountries: number,
): StatsData {
  const allVisits = Array.from(visits.values());
  const visited = allVisits.filter((v) => v.status === 'visited');
  const planned = allVisits.filter((v) => v.status === 'planned');

  const continentVisited = new Map<Continent, number>();
  const continentTotal = new Map<Continent, number>();

  for (const c of countryMap.values()) {
    if (c.continent === 'Antarctica') continue;
    continentTotal.set(c.continent, (continentTotal.get(c.continent) ?? 0) + 1);
  }

  for (const v of visited) {
    const country = countryMap.get(v.countryCode);
    if (country && country.continent !== 'Antarctica') {
      continentVisited.set(
        country.continent,
        (continentVisited.get(country.continent) ?? 0) + 1,
      );
    }
  }

  const byContinent = ALL_CONTINENTS.map((name) => ({
    name,
    visited: continentVisited.get(name) ?? 0,
    total: continentTotal.get(name) ?? 0,
  }));

  const totalCities = allVisits.reduce((sum, v) => sum + v.cities.length, 0);

  const topRated = allVisits
    .filter((v) => v.rating !== undefined)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 10);

  const recentlyAdded = allVisits
    .filter((v) => v.status === 'visited')
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5);

  const favoriteCountries = allVisits.filter((v) => v.isFavorite);

  return {
    totalVisited: visited.length,
    totalPlanned: planned.length,
    percentageOfWorld: totalCountries > 0 ? (visited.length / totalCountries) * 100 : 0,
    continentsReached: continentVisited.size,
    totalContinents: ALL_CONTINENTS.length,
    totalCities,
    byContinent,
    topRated,
    recentlyAdded,
    favoriteCountries,
  };
}
