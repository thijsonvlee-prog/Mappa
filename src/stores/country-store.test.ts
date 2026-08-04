import { describe, it, expect, beforeEach } from 'vitest';
import { useCountryStore } from './country-store';
import { db } from '@/db/database';
import type { AppData } from '@/types';

async function resetStore() {
  await db.countryVisits.clear();
  await db.tags.clear();
  await db.photos.clear();
  useCountryStore.setState({
    visits: new Map(),
    tags: new Map(),
    photos: new Map(),
    isHydrated: false,
  });
}

describe('country-store', () => {
  beforeEach(async () => {
    await resetStore();
  });

  it('setCountryStatus creates a visit record with correct defaults', async () => {
    await useCountryStore.getState().setCountryStatus('NL', 'visited');
    const visit = useCountryStore.getState().visits.get('NL');

    expect(visit).toBeDefined();
    expect(visit?.countryCode).toBe('NL');
    expect(visit?.status).toBe('visited');
    expect(visit?.cities).toEqual([]);
    expect(visit?.tagIds).toEqual([]);
    expect(visit?.photoIds).toEqual([]);
    expect(visit?.visits).toEqual([]);
    expect(visit?.isFavorite).toBe(false);
    expect(visit?.id).toBeTruthy();
  });

  it('setCountryStatus updates status on an existing visit without changing its id', async () => {
    await useCountryStore.getState().setCountryStatus('NL', 'planned');
    const firstId = useCountryStore.getState().visits.get('NL')?.id;

    await useCountryStore.getState().setCountryStatus('NL', 'visited');
    const visit = useCountryStore.getState().visits.get('NL');

    expect(visit?.status).toBe('visited');
    expect(visit?.id).toBe(firstId);
  });

  it('setCountryStatus("not_visited") deletes the visit record', async () => {
    await useCountryStore.getState().setCountryStatus('NL', 'visited');
    await useCountryStore.getState().setCountryStatus('NL', 'not_visited');

    expect(useCountryStore.getState().visits.has('NL')).toBe(false);
    const stored = await db.countryVisits.where('countryCode').equals('NL').first();
    expect(stored).toBeUndefined();
  });

  it('removeCountryVisit removes an existing visit', async () => {
    await useCountryStore.getState().setCountryStatus('FR', 'visited');
    await useCountryStore.getState().removeCountryVisit('FR');

    expect(useCountryStore.getState().visits.has('FR')).toBe(false);
  });

  it('updateCountryVisit patches fields and updates updatedAt', async () => {
    await useCountryStore.getState().setCountryStatus('DE', 'visited');
    const before = useCountryStore.getState().visits.get('DE');

    await new Promise((resolve) => setTimeout(resolve, 5));
    await useCountryStore.getState().updateCountryVisit('DE', { rating: 5, notes: 'Great trip' });
    const after = useCountryStore.getState().visits.get('DE');

    expect(after?.rating).toBe(5);
    expect(after?.notes).toBe('Great trip');
    expect(after?.updatedAt).not.toBe(before?.updatedAt);
  });

  it('addVisit, updateVisit and removeVisit manage the nested visits array', async () => {
    await useCountryStore.getState().setCountryStatus('IT', 'visited');

    await useCountryStore.getState().addVisit('IT', { startDate: '2023-05-01', endDate: '2023-05-10' });
    let visit = useCountryStore.getState().visits.get('IT');
    expect(visit?.visits).toHaveLength(1);
    const visitId = visit!.visits[0].id;
    expect(visitId).toBeTruthy();

    await useCountryStore.getState().updateVisit('IT', visitId, { notes: 'Rome and Florence' });
    visit = useCountryStore.getState().visits.get('IT');
    expect(visit?.visits[0].notes).toBe('Rome and Florence');

    await useCountryStore.getState().removeVisit('IT', visitId);
    visit = useCountryStore.getState().visits.get('IT');
    expect(visit?.visits).toHaveLength(0);
  });

  it('addTag creates a tag with a generated id and removeTag strips it from visits', async () => {
    const tag = await useCountryStore.getState().addTag({ name: 'Roadtrip', color: '#ff0000' });
    expect(tag.id).toBeTruthy();
    expect(useCountryStore.getState().tags.has(tag.id)).toBe(true);

    await useCountryStore.getState().setCountryStatus('ES', 'visited');
    await useCountryStore.getState().updateCountryVisit('ES', { tagIds: [tag.id] });

    await useCountryStore.getState().removeTag(tag.id);

    expect(useCountryStore.getState().tags.has(tag.id)).toBe(false);
    const visit = useCountryStore.getState().visits.get('ES');
    expect(visit?.tagIds).not.toContain(tag.id);
  });

  it('exportData produces an AppData object with correct schema shape', async () => {
    await useCountryStore.getState().setCountryStatus('JP', 'visited');
    await useCountryStore.getState().addTag({ name: 'Solo', color: '#00ff00' });

    const exported = await useCountryStore.getState().exportData(false);

    expect(exported.schemaVersion).toBe(1);
    expect(exported.data.countryVisits).toHaveLength(1);
    expect(exported.data.countryVisits[0].countryCode).toBe('JP');
    expect(exported.data.tags).toHaveLength(1);
    expect(exported.photos).toBeUndefined();
  });

  it('importData in replace mode clears existing data before importing', async () => {
    await useCountryStore.getState().setCountryStatus('PT', 'visited');

    const appData: AppData = {
      schemaVersion: 1,
      appVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      data: {
        countryVisits: [
          {
            countryCode: 'BE',
            status: 'visited',
            cities: [],
            tagIds: [],
            photoIds: [],
            visits: [],
            isFavorite: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        tags: [],
      },
    };

    await useCountryStore.getState().importData(appData, 'replace');

    const state = useCountryStore.getState();
    expect(state.visits.has('PT')).toBe(false);
    expect(state.visits.has('BE')).toBe(true);
  });

  it('importData in merge mode preserves existing records by countryCode', async () => {
    await useCountryStore.getState().setCountryStatus('AT', 'planned');

    const appData: AppData = {
      schemaVersion: 1,
      appVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      data: {
        countryVisits: [
          {
            countryCode: 'CH',
            status: 'visited',
            cities: [],
            tagIds: [],
            photoIds: [],
            visits: [],
            isFavorite: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        tags: [],
      },
    };

    await useCountryStore.getState().importData(appData, 'merge');

    const state = useCountryStore.getState();
    expect(state.visits.has('AT')).toBe(true);
    expect(state.visits.has('CH')).toBe(true);
  });

  it('clearAllData empties all tables and resets state', async () => {
    await useCountryStore.getState().setCountryStatus('SE', 'visited');
    await useCountryStore.getState().addTag({ name: 'Winter', color: '#0000ff' });

    await useCountryStore.getState().clearAllData();

    const state = useCountryStore.getState();
    expect(state.visits.size).toBe(0);
    expect(state.tags.size).toBe(0);
    expect(state.photos.size).toBe(0);
    expect(await db.countryVisits.count()).toBe(0);
    expect(await db.tags.count()).toBe(0);
  });
});
