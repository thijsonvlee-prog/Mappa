import { describe, it, expect } from 'vitest';
import { validateImportFile } from './import-utils';

function validAppDataJson() {
  const now = new Date().toISOString();
  return JSON.stringify({
    schemaVersion: 1,
    appVersion: '1.0.0',
    exportedAt: now,
    data: {
      countryVisits: [
        {
          countryCode: 'NL',
          status: 'visited',
          cities: [],
          tagIds: [],
          photoIds: [],
          visits: [],
          isFavorite: false,
          createdAt: now,
          updatedAt: now,
        },
      ],
      tags: [{ name: 'Roadtrip', color: '#ff8800', createdAt: now }],
    },
  });
}

describe('validateImportFile', () => {
  it('returns a success result with counts for valid JSON', () => {
    const result = validateImportFile(validAppDataJson());

    expect(result.valid).toBe(true);
    expect(result.summary).toEqual({ countryVisits: 1, tags: 1, photos: 0 });
    expect(result.data).toBeDefined();
  });

  it('returns an error for malformed JSON', () => {
    const result = validateImportFile('{ this is not valid json');

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Invalid JSON file');
  });

  it('returns validation errors for valid JSON with the wrong schema shape', () => {
    const result = validateImportFile(JSON.stringify({ foo: 'bar' }));

    expect(result.valid).toBe(false);
    expect(result.errors?.length).toBeGreaterThan(0);
  });
});
