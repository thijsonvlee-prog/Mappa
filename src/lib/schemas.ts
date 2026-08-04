import { z } from 'zod';

const visitSchema = z.object({
  id: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  notes: z.string().optional(),
});

const countryVisitSchema = z.object({
  countryCode: z.string().length(2),
  status: z.enum(['not_visited', 'visited', 'planned']),
  rating: z.number().min(1).max(5).optional(),
  notes: z.string().optional(),
  cities: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),
  photoIds: z.array(z.string()).default([]),
  visits: z.array(visitSchema).default([]),
  isFavorite: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const tagSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  createdAt: z.string(),
});

const exportedPhotoSchema = z.object({
  countryCode: z.string().length(2),
  fileName: z.string(),
  mimeType: z.string(),
  caption: z.string().optional(),
  takenAt: z.string().optional(),
  dataBase64: z.string(),
});

export const appDataSchema = z.object({
  schemaVersion: z.number().int().min(1),
  appVersion: z.string().optional(),
  exportedAt: z.string(),
  data: z.object({
    countryVisits: z.array(countryVisitSchema),
    tags: z.array(tagSchema),
  }),
  photos: z.array(exportedPhotoSchema).optional(),
});

export type ValidatedAppData = z.infer<typeof appDataSchema>;
