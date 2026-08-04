import { appDataSchema } from './schemas';
import type { AppData } from '@/types';

export interface ImportValidationResult {
  valid: boolean;
  data?: AppData;
  errors?: string[];
  summary?: {
    countryVisits: number;
    tags: number;
    photos: number;
  };
}

export function validateImportFile(jsonString: string): ImportValidationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    return { valid: false, errors: ['Invalid JSON file'] };
  }

  const result = appDataSchema.safeParse(parsed);
  if (!result.success) {
    const errors = result.error.errors.map(
      (e) => `${e.path.join('.')}: ${e.message}`,
    );
    return { valid: false, errors };
  }

  const data = result.data as AppData;
  return {
    valid: true,
    data,
    summary: {
      countryVisits: data.data.countryVisits.length,
      tags: data.data.tags.length,
      photos: data.photos?.length ?? 0,
    },
  };
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
