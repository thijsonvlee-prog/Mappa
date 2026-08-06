import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useMilestones } from './useMilestones';
import { useCountryStore } from '@/stores/country-store';
import { countries } from '@/data/countries-lookup';

/**
 * These cover the suppression rules rather than the detection maths (which is
 * unit-tested against detectMilestone directly). A stamp firing for work the
 * user didn't do by hand is the failure mode that would actually ship.
 */

const europeanCodes = countries
  .filter((c) => c.continent === 'Europe')
  .map((c) => c.code);

async function markMany(codes: string[], origin: 'user' | 'bulk') {
  const { setCountryStatus } = useCountryStore.getState();
  for (const code of codes) {
    await setCountryStatus(code, 'visited', origin);
  }
}

describe('useMilestones suppression', () => {
  beforeEach(async () => {
    await useCountryStore.getState().clearAllData();
  });

  it('fires when the user marks the 10th country by hand', async () => {
    const { result } = renderHook(() => useMilestones());

    // Nine first — the baseline snapshot is taken on the hook's first run.
    await act(async () => {
      await markMany(europeanCodes.slice(0, 9), 'user');
    });

    await act(async () => {
      await markMany(europeanCodes.slice(9, 10), 'user');
    });

    await waitFor(() => {
      expect(result.current.milestone).not.toBeNull();
    });
    expect(result.current.milestone?.label).toBe('10 LANDEN');
  });

  it('does not fire for onboarding-style bulk marking', async () => {
    const { result } = renderHook(() => useMilestones());

    await act(async () => {
      await markMany(europeanCodes.slice(0, 12), 'bulk');
    });

    expect(result.current.milestone).toBeNull();
  });

  it('does not fire when data arrives via hydration', async () => {
    // Seed the database, then hydrate as a fresh app start would.
    await markMany(europeanCodes.slice(0, 15), 'bulk');

    const { result } = renderHook(() => useMilestones());

    await act(async () => {
      await useCountryStore.getState().hydrate();
    });

    expect(result.current.milestone).toBeNull();
  });

  it('does not replay a milestone across re-renders', async () => {
    const { result, rerender } = renderHook(() => useMilestones());

    await act(async () => {
      await markMany(europeanCodes.slice(0, 10), 'user');
    });

    await waitFor(() => {
      expect(result.current.milestone).not.toBeNull();
    });

    act(() => {
      result.current.dismiss();
    });
    rerender();

    expect(result.current.milestone).toBeNull();
  });

  it('does not fire when a country is un-marked', async () => {
    const { result } = renderHook(() => useMilestones());

    await act(async () => {
      await markMany(europeanCodes.slice(0, 10), 'user');
    });
    await waitFor(() => expect(result.current.milestone).not.toBeNull());
    act(() => result.current.dismiss());

    await act(async () => {
      await useCountryStore
        .getState()
        .setCountryStatus(europeanCodes[0], 'not_visited', 'user');
    });

    expect(result.current.milestone).toBeNull();
  });
});
