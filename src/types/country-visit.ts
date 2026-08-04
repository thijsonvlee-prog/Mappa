import type { CountryStatus } from './enums';

export interface Visit {
  id: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export interface CountryVisit {
  id: string;
  countryCode: string;
  status: CountryStatus;
  rating?: number;
  notes?: string;
  cities: string[];
  tagIds: string[];
  photoIds: string[];
  visits: Visit[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}
