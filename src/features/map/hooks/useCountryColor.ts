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
    visited: '#16A34A',
    planned: '#D97706',
    not_visited: '#D4D4D8',
  },
  dark: {
    visited: '#22C55E',
    planned: '#F59E0B',
    not_visited: '#3F3F46',
  },
} as const;

const hoverFills = {
  light: {
    visited: '#22C55E',
    planned: '#F59E0B',
    not_visited: '#C4C4CC',
  },
  dark: {
    visited: '#4ADE80',
    planned: '#FBBF24',
    not_visited: '#52525B',
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
