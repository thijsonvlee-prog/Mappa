import { create } from 'zustand';
import { db } from '@/db/database';
import { processPhoto, blobToBase64, base64ToBlob } from '@/lib/photo-utils';
import { CURRENT_SCHEMA_VERSION } from '@/types';
import type { CountryVisit, CountryStatus, Tag, LocalPhoto, AppData, Visit } from '@/types';

declare const __APP_VERSION__: string;

interface CountryStoreState {
  visits: Map<string, CountryVisit>;
  tags: Map<string, Tag>;
  photos: Map<string, Omit<LocalPhoto, 'blob' | 'thumbnailBlob'>>;
  isHydrated: boolean;
}

interface CountryStoreActions {
  hydrate: () => Promise<void>;
  setCountryStatus: (countryCode: string, status: CountryStatus) => Promise<void>;
  removeCountryVisit: (countryCode: string) => Promise<void>;
  updateCountryVisit: (countryCode: string, patch: Partial<CountryVisit>) => Promise<void>;
  addVisit: (countryCode: string, visit: Omit<Visit, 'id'>) => Promise<void>;
  updateVisit: (countryCode: string, visitId: string, patch: Partial<Visit>) => Promise<void>;
  removeVisit: (countryCode: string, visitId: string) => Promise<void>;
  addTag: (tag: Omit<Tag, 'id' | 'createdAt'>) => Promise<Tag>;
  updateTag: (tagId: string, patch: Partial<Tag>) => Promise<void>;
  removeTag: (tagId: string) => Promise<void>;
  addPhoto: (countryCode: string, file: File) => Promise<LocalPhoto>;
  removePhoto: (photoId: string) => Promise<void>;
  updatePhotoCaption: (photoId: string, caption: string) => Promise<void>;
  importData: (appData: AppData, mode: 'replace' | 'merge') => Promise<void>;
  exportData: (includePhotos: boolean) => Promise<AppData>;
  clearAllData: () => Promise<void>;
}

function ensureVisit(countryCode: string, status: CountryStatus, existing?: CountryVisit): CountryVisit {
  const now = new Date().toISOString();
  if (existing) {
    return { ...existing, status, updatedAt: now };
  }
  return {
    id: crypto.randomUUID(),
    countryCode,
    status,
    cities: [],
    tagIds: [],
    photoIds: [],
    visits: [],
    isFavorite: false,
    createdAt: now,
    updatedAt: now,
  };
}

export const useCountryStore = create<CountryStoreState & CountryStoreActions>()((set, get) => ({
  visits: new Map(),
  tags: new Map(),
  photos: new Map(),
  isHydrated: false,

  hydrate: async () => {
    const [visitArr, tagArr, photoArr] = await Promise.all([
      db.countryVisits.toArray(),
      db.tags.toArray(),
      db.photos.toArray(),
    ]);

    const visits = new Map(visitArr.map((v) => [v.countryCode, v]));
    const tags = new Map(tagArr.map((t) => [t.id, t]));
    const photos = new Map(
      photoArr.map((p) => {
        const { blob: _, thumbnailBlob: _tb, ...meta } = p;
        return [p.id, meta];
      }),
    );

    set({ visits, tags, photos, isHydrated: true });
  },

  setCountryStatus: async (countryCode, status) => {
    if (status === 'not_visited') {
      const existing = get().visits.get(countryCode);
      if (existing) {
        set((s) => {
          const next = new Map(s.visits);
          next.delete(countryCode);
          return { visits: next };
        });
        await db.countryVisits.delete(existing.id);
      }
      return;
    }

    const existing = get().visits.get(countryCode);
    const record = ensureVisit(countryCode, status, existing);

    set((s) => {
      const next = new Map(s.visits);
      next.set(countryCode, record);
      return { visits: next };
    });

    await db.countryVisits.put(record);
  },

  removeCountryVisit: async (countryCode) => {
    const existing = get().visits.get(countryCode);
    if (!existing) return;

    set((s) => {
      const next = new Map(s.visits);
      next.delete(countryCode);
      return { visits: next };
    });

    await db.countryVisits.delete(existing.id);
  },

  updateCountryVisit: async (countryCode, patch) => {
    const existing = get().visits.get(countryCode);
    if (!existing) return;

    const updated = { ...existing, ...patch, updatedAt: new Date().toISOString() };

    set((s) => {
      const next = new Map(s.visits);
      next.set(countryCode, updated);
      return { visits: next };
    });

    await db.countryVisits.put(updated);
  },

  addVisit: async (countryCode, visit) => {
    const existing = get().visits.get(countryCode);
    if (!existing) return;

    const newVisit: Visit = { ...visit, id: crypto.randomUUID() };
    const updated = {
      ...existing,
      visits: [...existing.visits, newVisit],
      updatedAt: new Date().toISOString(),
    };

    set((s) => {
      const next = new Map(s.visits);
      next.set(countryCode, updated);
      return { visits: next };
    });

    await db.countryVisits.put(updated);
  },

  updateVisit: async (countryCode, visitId, patch) => {
    const existing = get().visits.get(countryCode);
    if (!existing) return;

    const updated = {
      ...existing,
      visits: existing.visits.map((v) =>
        v.id === visitId ? { ...v, ...patch } : v,
      ),
      updatedAt: new Date().toISOString(),
    };

    set((s) => {
      const next = new Map(s.visits);
      next.set(countryCode, updated);
      return { visits: next };
    });

    await db.countryVisits.put(updated);
  },

  removeVisit: async (countryCode, visitId) => {
    const existing = get().visits.get(countryCode);
    if (!existing) return;

    const updated = {
      ...existing,
      visits: existing.visits.filter((v) => v.id !== visitId),
      updatedAt: new Date().toISOString(),
    };

    set((s) => {
      const next = new Map(s.visits);
      next.set(countryCode, updated);
      return { visits: next };
    });

    await db.countryVisits.put(updated);
  },

  addTag: async (tagData) => {
    const tag: Tag = {
      ...tagData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    set((s) => {
      const next = new Map(s.tags);
      next.set(tag.id, tag);
      return { tags: next };
    });

    await db.tags.put(tag);
    return tag;
  },

  updateTag: async (tagId, patch) => {
    const existing = get().tags.get(tagId);
    if (!existing) return;

    const updated = { ...existing, ...patch };

    set((s) => {
      const next = new Map(s.tags);
      next.set(tagId, updated);
      return { tags: next };
    });

    await db.tags.put(updated);
  },

  removeTag: async (tagId) => {
    set((s) => {
      const nextTags = new Map(s.tags);
      nextTags.delete(tagId);

      const nextVisits = new Map(s.visits);
      for (const [code, visit] of nextVisits) {
        if (visit.tagIds.includes(tagId)) {
          nextVisits.set(code, {
            ...visit,
            tagIds: visit.tagIds.filter((id) => id !== tagId),
          });
        }
      }

      return { tags: nextTags, visits: nextVisits };
    });

    await db.tags.delete(tagId);
    await db.countryVisits
      .filter((v) => v.tagIds.includes(tagId))
      .modify((v) => {
        v.tagIds = v.tagIds.filter((id) => id !== tagId);
      });
  },

  addPhoto: async (countryCode, file) => {
    const { blob, thumbnailBlob, width, height } = await processPhoto(file);

    const photo: LocalPhoto = {
      id: crypto.randomUUID(),
      countryCode,
      fileName: file.name,
      mimeType: 'image/jpeg',
      blob,
      thumbnailBlob,
      width,
      height,
      sizeBytes: blob.size,
      createdAt: new Date().toISOString(),
    };

    await db.photos.put(photo);

    const { blob: _, thumbnailBlob: _tb, ...meta } = photo;
    set((s) => {
      const nextPhotos = new Map(s.photos);
      nextPhotos.set(photo.id, meta);
      return { photos: nextPhotos };
    });

    const existing = get().visits.get(countryCode);
    if (existing) {
      const updated = {
        ...existing,
        photoIds: [...existing.photoIds, photo.id],
        updatedAt: new Date().toISOString(),
      };
      set((s) => {
        const next = new Map(s.visits);
        next.set(countryCode, updated);
        return { visits: next };
      });
      await db.countryVisits.put(updated);
    }

    return photo;
  },

  removePhoto: async (photoId) => {
    const photoMeta = get().photos.get(photoId);
    if (!photoMeta) return;

    await db.photos.delete(photoId);

    set((s) => {
      const nextPhotos = new Map(s.photos);
      nextPhotos.delete(photoId);

      const nextVisits = new Map(s.visits);
      const visit = nextVisits.get(photoMeta.countryCode);
      if (visit) {
        nextVisits.set(photoMeta.countryCode, {
          ...visit,
          photoIds: visit.photoIds.filter((id) => id !== photoId),
          updatedAt: new Date().toISOString(),
        });
      }

      return { photos: nextPhotos, visits: nextVisits };
    });
  },

  updatePhotoCaption: async (photoId, caption) => {
    const existing = get().photos.get(photoId);
    if (!existing) return;

    await db.photos.update(photoId, { caption });

    set((s) => {
      const next = new Map(s.photos);
      next.set(photoId, { ...existing, caption });
      return { photos: next };
    });
  },

  importData: async (appData, mode) => {
    if (mode === 'replace') {
      await db.countryVisits.clear();
      await db.tags.clear();
      await db.photos.clear();
    }

    const tagIdMap = new Map<string, string>();
    for (const tagData of appData.data.tags) {
      const existing = mode === 'merge'
        ? await db.tags.where('name').equals(tagData.name).first()
        : undefined;

      if (existing) {
        tagIdMap.set(tagData.name, existing.id);
      } else {
        const id = crypto.randomUUID();
        await db.tags.put({ ...tagData, id });
        tagIdMap.set(tagData.name, id);
      }
    }

    for (const visitData of appData.data.countryVisits) {
      const existing = mode === 'merge'
        ? await db.countryVisits.where('countryCode').equals(visitData.countryCode).first()
        : undefined;

      const id = existing?.id ?? crypto.randomUUID();
      const visits = visitData.visits.map((v) => ({
        ...v,
        id: v.id ?? crypto.randomUUID(),
      }));

      await db.countryVisits.put({
        ...visitData,
        id,
        visits,
      });
    }

    if (appData.photos) {
      for (const photo of appData.photos) {
        const blob = base64ToBlob(photo.dataBase64, photo.mimeType);
        const { blob: processedBlob, thumbnailBlob, width, height } =
          await processPhoto(new File([blob], photo.fileName, { type: photo.mimeType }));

        await db.photos.put({
          id: crypto.randomUUID(),
          countryCode: photo.countryCode,
          fileName: photo.fileName,
          mimeType: photo.mimeType,
          blob: processedBlob,
          thumbnailBlob,
          width,
          height,
          sizeBytes: processedBlob.size,
          caption: photo.caption,
          takenAt: photo.takenAt,
          createdAt: new Date().toISOString(),
        });
      }
    }

    await get().hydrate();
  },

  exportData: async (includePhotos) => {
    const visits = await db.countryVisits.toArray();
    const tags = await db.tags.toArray();

    const appData: AppData = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      appVersion: typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.0',
      exportedAt: new Date().toISOString(),
      data: {
        countryVisits: visits.map(({ id: _, ...rest }) => rest),
        tags: tags.map(({ id: _, ...rest }) => rest),
      },
    };

    if (includePhotos) {
      const photos = await db.photos.toArray();
      appData.photos = await Promise.all(
        photos.map(async (p) => ({
          countryCode: p.countryCode,
          fileName: p.fileName,
          mimeType: p.mimeType,
          caption: p.caption,
          takenAt: p.takenAt,
          dataBase64: await blobToBase64(p.blob),
        })),
      );
    }

    return appData;
  },

  clearAllData: async () => {
    await db.transaction('rw', db.countryVisits, db.tags, db.photos, async () => {
      await db.countryVisits.clear();
      await db.tags.clear();
      await db.photos.clear();
    });

    set({
      visits: new Map(),
      tags: new Map(),
      photos: new Map(),
    });
  },
}));
