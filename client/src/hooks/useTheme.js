import { useState, useEffect } from 'react';

export function useTheme() {
  const [themeMode, setThemeMode] = useState(() => {
    try {
      const stored = localStorage.getItem('safemap_theme_mode');
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
      return 'light'; // Default commercial light mode
    } catch {
      return 'light';
    }
  });

  const [resolvedTheme, setResolvedTheme] = useState('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      let activeTheme = 'light';
      if (themeMode === 'system') {
        activeTheme = mediaQuery.matches ? 'dark' : 'light';
      } else {
        activeTheme = themeMode;
      }
      setResolvedTheme(activeTheme);
      document.documentElement.setAttribute('data-theme', activeTheme);
      try {
        localStorage.setItem('safemap_theme_mode', themeMode);
      } catch { /* silent */ }
    };

    applyTheme();

    const listener = () => {
      if (themeMode === 'system') applyTheme();
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [themeMode]);

  return {
    themeMode,       // 'light' | 'dark' | 'system'
    resolvedTheme,   // 'light' | 'dark'
    setThemeMode,
  };
}
