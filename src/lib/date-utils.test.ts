import { describe, it, expect } from 'vitest';
import { formatDate, formatRelativeDate } from './date-utils';

describe('formatDate', () => {
  const iso = '2023-05-09T00:00:00.000Z';

  it('formats as YYYY-MM-DD', () => {
    expect(formatDate(iso, 'YYYY-MM-DD')).toBe('2023-05-09');
  });

  it('formats as DD/MM/YYYY', () => {
    expect(formatDate(iso, 'DD/MM/YYYY')).toBe('09/05/2023');
  });

  it('formats as MM/DD/YYYY', () => {
    expect(formatDate(iso, 'MM/DD/YYYY')).toBe('05/09/2023');
  });

  it('returns the original string for an invalid date', () => {
    expect(formatDate('not-a-date', 'YYYY-MM-DD')).toBe('not-a-date');
  });
});

describe('formatRelativeDate', () => {
  function daysAgo(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
  }

  it('returns "Today" for the current date', () => {
    expect(formatRelativeDate(new Date().toISOString())).toBe('Today');
  });

  it('returns "Yesterday" for one day ago', () => {
    expect(formatRelativeDate(daysAgo(1))).toBe('Yesterday');
  });

  it('returns days ago for less than a week', () => {
    expect(formatRelativeDate(daysAgo(3))).toBe('3 days ago');
  });

  it('returns weeks ago for less than a month', () => {
    expect(formatRelativeDate(daysAgo(14))).toBe('2 weeks ago');
  });

  it('returns months ago for less than a year', () => {
    expect(formatRelativeDate(daysAgo(60))).toBe('2 months ago');
  });

  it('returns years ago for a year or more', () => {
    expect(formatRelativeDate(daysAgo(400))).toBe('1 years ago');
  });
});
