import type { Continent } from './enums';

export interface Country {
  code: string;
  name: string;
  continent: Continent;
  subregion: string;
  flag: string;
  capital: string;
  area: number;
  coordinates: [number, number];
}
