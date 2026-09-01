import { useEffect, useState } from 'react';
import type { ThemeName } from '@/types';

const STORAGE_KEY = 'fefodinha-theme';
const DEFAULT_THEME: ThemeName = 'blue';

function getInitialTheme(): ThemeName {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeName | null;
  if (stored === 'blue' || stored === 'pink' || stored === 'green') return stored;
  return DEFAULT_THEME;
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeName>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return { theme, setTheme };
}
