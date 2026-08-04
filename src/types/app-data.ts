import type { CountryVisit } from './country-visit';
import type { Tag } from './tag';

export interface ExportedPhoto {
  countryCode: string;
  fileName: string;
  mimeType: string;
  caption?: string;
  takenAt?: string;
  dataBase64: string;
}

export interface AppData {
  schemaVersion: number;
  appVersion: string;
  exportedAt: string;
  data: {
    countryVisits: Omit<CountryVisit, 'id'>[];
    tags: Omit<Tag, 'id'>[];
  };
  photos?: ExportedPhoto[];
}

export const CURRENT_SCHEMA_VERSION = 1;
