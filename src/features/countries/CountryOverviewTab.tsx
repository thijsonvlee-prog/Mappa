import { useCallback } from 'react';
import { useCountryStore } from '@/stores/country-store';
import { RatingStars } from '@/components/country/RatingStars';
import { NotesEditor } from './NotesEditor';
import { CitiesEditor } from './CitiesEditor';
import type { CountryVisit } from '@/types';

interface CountryOverviewTabProps {
  countryCode: string;
  visit: CountryVisit | undefined;
}

export function CountryOverviewTab({ countryCode, visit }: CountryOverviewTabProps) {
  const updateCountryVisit = useCountryStore((s) => s.updateCountryVisit);

  const handleRatingChange = useCallback(
    (rating: number) => {
      updateCountryVisit(countryCode, { rating: rating || undefined });
    },
    [countryCode, updateCountryVisit],
  );

  const handleNotesChange = useCallback(
    (notes: string) => {
      updateCountryVisit(countryCode, { notes: notes || undefined });
    },
    [countryCode, updateCountryVisit],
  );

  const handleCitiesChange = useCallback(
    (cities: string[]) => {
      updateCountryVisit(countryCode, { cities });
    },
    [countryCode, updateCountryVisit],
  );

  if (!visit) {
    return (
      <div className="py-8 text-center text-sm text-foreground-muted">
        Stel een status in om dit land bij te houden.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Beoordeling</label>
        <RatingStars value={visit.rating ?? 0} onChange={handleRatingChange} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Notities</label>
        <NotesEditor value={visit.notes ?? ''} onChange={handleNotesChange} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Steden</label>
        <CitiesEditor cities={visit.cities} onChange={handleCitiesChange} />
      </div>

      {visit.tagIds.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Tags</label>
          <div className="flex flex-wrap gap-1.5">
            {visit.tagIds.map((tagId) => (
              <span
                key={tagId}
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-background-secondary text-foreground-secondary"
              >
                {tagId}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
