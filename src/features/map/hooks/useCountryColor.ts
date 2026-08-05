import { useMemo, useSyncExternalStore } from 'react';
import type { CountryStatus } from '@/types';

function getTheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function subscribeToTheme(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => observer.disconnect();
}

const fills = {
  light: {
    visited: '#2D6A4F',
    planned: '#C17B3A',
    not_visited: '#D5D0C8',
  },
  dark: {
    visited: '#40916C',
    planned: '#D49050',
    not_visited: '#2E3440',
  },
} as const;

const hoverFills = {
  light: {
    visited: '#40916C',
    planned: '#D49050',
    not_visited: '#C5CED6',
  },
  dark: {
    visited: '#52B788',
    planned: '#E0A468',
    not_visited: '#3D4556',
  },
} as const;


export function useCountryColor() {
  const theme = useSyncExternalStore(subscribeToTheme, getTheme, () => 'light' as const);

  return useMemo(() => {
    const currentFills = fills[theme];
    const currentHoverFills = hoverFills[theme];

    return {
      getFill(status?: CountryStatus): string {
        if (!status) return currentFills.not_visited;
        return currentFills[status];
      },
      getHoverFill(status?: CountryStatus): string {
        if (!status) return currentHoverFills.not_visited;
        return currentHoverFills[status];
      },
    };
  }, [theme]);
}
