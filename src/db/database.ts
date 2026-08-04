import Dexie from 'dexie';
import type { CountryVisit, Tag, LocalPhoto } from '@/types';

export class MappaDB extends Dexie {
  countryVisits!: Dexie.Table<CountryVisit, string>;
  tags!: Dexie.Table<Tag, string>;
  photos!: Dexie.Table<LocalPhoto, string>;

  constructor() {
    super('MappaDB');

    this.version(1).stores({
      countryVisits: 'id, &countryCode, status, updatedAt',
      tags: 'id, &name',
      photos: 'id, countryCode, createdAt',
    });
  }
}

export const db = new MappaDB();
