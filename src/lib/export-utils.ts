import { db } from '@/db/database';
import { blobToBase64 } from './photo-utils';
import { CURRENT_SCHEMA_VERSION } from '@/types';
import type { AppData } from '@/types';

declare const __APP_VERSION__: string;

export async function exportAppData(includePhotos: boolean): Promise<AppData> {
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
}

export function downloadAsJson(data: AppData, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
