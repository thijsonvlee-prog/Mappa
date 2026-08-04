import { describe, it, expect } from 'vitest';
import { appDataSchema } from './schemas';

function validAppData() {
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    appVersion: '1.0.0',
    exportedAt: now,
    data: {
      countryVisits: [
        {
          countryCode: 'NL',
          status: 'visited',
          cities: ['Amsterdam'],
          tagIds: [],
          photoIds: [],
          visits: [],
          isFavorite: false,
          rating: 5,
          createdAt: now,
          updatedAt: now,
        },
      ],
      tags: [{ name: 'Roadtrip', color: '#ff8800', createdAt: now }],
    },
  };
}

describe('appDataSchema', () => {
  it('accepts valid AppData', () => {
    const result = appDataSchema.safeParse(validAppData());
    expect(result.success).toBe(true);
  });

  it('rejects data missing required fields', () => {
    const data = validAppData();
    // @ts-expect-error intentionally removing a required field
    delete data.exportedAt;

    const result = appDataSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('rejects a rating outside the 1-5 range', () => {
    const data = validAppData();
    data.data.countryVisits[0].rating = 7;

    const result = appDataSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('rejects a countryCode that is not exactly 2 characters', () => {
    const data = validAppData();
    data.data.countryVisits[0].countryCode = 'NLD';

    const result = appDataSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('rejects an invalid tag color', () => {
    const data = validAppData();
    data.data.tags[0].color = 'not-a-color';

    const result = appDataSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});
