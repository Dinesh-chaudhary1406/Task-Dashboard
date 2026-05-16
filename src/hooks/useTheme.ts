import { useCallback, useEffect } from 'react';
import type { Theme } from '../types';
import { useLocalStorage } from './useLocalStorage';

export const THEME_STORAGE_KEY = 'taskflow_theme';

export function useTheme(): { theme: Theme; toggleTheme: () => void; setTheme: (t: Theme) => void } {
  const [theme, setStoredTheme] = useLocalStorage<Theme>(THEME_STORAGE_KEY, 'dark');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setStoredTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, [setStoredTheme]);

  const setTheme = useCallback(
    (t: Theme) => setStoredTheme(t),
    [setStoredTheme],
  );

  return { theme, toggleTheme, setTheme };
}
