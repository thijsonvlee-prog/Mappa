import { useEffect } from 'react';
import { useSettingsStore } from '@/stores/settings-store';

export function useTheme() {
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const apply = (dark: boolean) => {
        root.setAttribute('data-theme', dark ? 'dark' : 'light');
      };
      apply(mql.matches);
      const handler = (e: MediaQueryListEvent) => apply(e.matches);
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    }

    root.setAttribute('data-theme', theme);
  }, [theme]);
}
