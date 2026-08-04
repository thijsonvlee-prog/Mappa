import { useEffect } from 'react';

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: { meta?: boolean; ctrl?: boolean; shift?: boolean } = {},
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (options.meta && !e.metaKey) return;
      if (options.ctrl && !e.ctrlKey) return;
      if (options.shift && !e.shiftKey) return;
      if (e.key.toLowerCase() !== key.toLowerCase()) return;

      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      e.preventDefault();
      callback();
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback, options.meta, options.ctrl, options.shift]);
}
