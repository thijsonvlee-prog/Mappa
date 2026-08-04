import { db } from './database';
import type { CountryVisit, LocalPhoto } from '@/types';

export async function getAllCountryVisits(): Promise<CountryVisit[]> {
  return db.countryVisits.toArray();
}

export async function getCountryVisit(countryCode: string): Promise<CountryVisit | undefined> {
  return db.countryVisits.where('countryCode').equals(countryCode).first();
}

export async function getPhotosByCountry(countryCode: string): Promise<LocalPhoto[]> {
  return db.photos.where('countryCode').equals(countryCode).toArray();
}

export async function getStorageEstimate(): Promise<{ usage: number; quota: number }> {
  if (navigator.storage && navigator.storage.estimate) {
    const est = await navigator.storage.estimate();
    return { usage: est.usage ?? 0, quota: est.quota ?? 0 };
  }
  return { usage: 0, quota: 0 };
}

export async function clearAllData(): Promise<void> {
  await db.transaction('rw', db.countryVisits, db.tags, db.photos, async () => {
    await db.countryVisits.clear();
    await db.tags.clear();
    await db.photos.clear();
  });
}
