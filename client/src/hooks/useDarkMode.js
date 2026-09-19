import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem('safemap_darkmode');
      if (stored !== null) return JSON.parse(stored);
      return false; // Default to crisp light mode like Google Maps / Apple Maps
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('safemap_darkmode', JSON.stringify(darkMode));
      document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    } catch { /* silent */ }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return [darkMode, toggleDarkMode];
}
