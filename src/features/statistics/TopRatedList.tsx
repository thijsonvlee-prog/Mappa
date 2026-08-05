import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { CountryFlag } from '@/components/country/CountryFlag';
import { RatingStars } from '@/components/country/RatingStars';
import { countryMap } from '@/data/countries-lookup';
import { useStatistics } from './hooks/useStatistics';

export function TopRatedList() {
  const stats = useStatistics();

  if (stats.topRated.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">Beste beoordeeld</h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground-muted">
            Geen landen beoordeeld. Voeg beoordelingen toe aan bezochte landen om ze hier te zien.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-foreground">Beste beoordeeld</h3>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {stats.topRated.map((visit) => {
            const country = countryMap.get(visit.countryCode);
            if (!country) return null;

            return (
              <li
                key={visit.countryCode}
                className="flex items-center gap-3"
              >
                <CountryFlag flag={country.flag} size="sm" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                  {country.name}
                </span>
                <RatingStars value={visit.rating} readonly />
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
