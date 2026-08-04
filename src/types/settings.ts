import type { ThemeMode, MapProjection, DateFormat } from './enums';

export interface UserSettings {
  theme: ThemeMode;
  mapProjection: MapProjection;
  defaultMapCenter: [number, number];
  defaultMapZoom: number;
  dateFormat: DateFormat;
  homeCountry?: string;
  onboardingCompleted: boolean;
}

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  mapProjection: 'geoEqualEarth',
  defaultMapCenter: [20, 0],
  defaultMapZoom: 1,
  dateFormat: 'YYYY-MM-DD',
  onboardingCompleted: false,
};
