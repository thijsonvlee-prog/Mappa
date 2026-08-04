import { describe, it, expect } from 'vitest';
import { countryMap, getCountry, getCountriesByContinent, countries, TOTAL_COUNTRIES } from './countries-lookup';

describe('countries-lookup', () => {
  it('countryMap resolves the Netherlands by ISO code', () => {
    const nl = countryMap.get('NL');
    expect(nl).toBeDefined();
    expect(nl?.name).toBe('Netherlands');
    expect(nl?.continent).toBe('Europe');
  });

  it('getCountry returns the same result as countryMap.get', () => {
    expect(getCountry('JP')).toEqual(countryMap.get('JP'));
    expect(getCountry('ZZ')).toBeUndefined();
  });

  it('getCountriesByContinent returns only countries in that continent', () => {
    const europeanCountries = getCountriesByContinent('Europe');
    expect(europeanCountries.length).toBeGreaterThan(0);
    expect(europeanCountries.every((c) => c.continent === 'Europe')).toBe(true);
  });

  it('TOTAL_COUNTRIES matches the number of non-Antarctica countries', () => {
    const nonAntarctica = countries.filter((c) => c.continent !== 'Antarctica').length;
    expect(TOTAL_COUNTRIES).toBe(nonAntarctica);
    expect(TOTAL_COUNTRIES).toBe(195);
  });

  it('every country has a unique two-letter code', () => {
    const codes = new Set(countries.map((c) => c.code));
    expect(codes.size).toBe(countries.length);
    expect(countries.every((c) => /^[A-Z]{2}$/.test(c.code))).toBe(true);
  });
});
