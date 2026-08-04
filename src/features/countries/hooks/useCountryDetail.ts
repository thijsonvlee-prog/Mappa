import { useState, useEffect } from 'react';
import { getCountry } from '@/data/countries-lookup';
import { useCountryStore } from '@/stores/country-store';
import { db } from '@/db/database';
import type { Country, CountryVisit, LocalPhoto } from '@/types';

interface CountryDetailData {
  country: Country | undefined;
  visit: CountryVisit | undefined;
  photos: LocalPhoto[];
  isLoading: boolean;
}

export function useCountryDetail(countryCode: string | null): CountryDetailData {
  const country = countryCode ? getCountry(countryCode) : undefined;
  const visit = useCountryStore((s) =>
    countryCode ? s.visits.get(countryCode) : undefined,
  );
  const [photos, setPhotos] = useState<LocalPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!visit?.photoIds.length) {
      setPhotos([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    Promise.all(visit.photoIds.map((id) => db.photos.get(id)))
      .then((results) => {
        if (!cancelled) {
          setPhotos(results.filter((p): p is LocalPhoto => p !== undefined));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [visit?.photoIds]);

  return { country, visit, photos, isLoading };
}
