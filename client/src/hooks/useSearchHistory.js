import { useState, useEffect } from 'react';

const DEFAULT_RECENT = ['Coimbatore Railway Station', 'RS Puram', 'Gandhipuram', 'Chennai Central'];

export function useSearchHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('safemap_recent_searches');
      return stored ? JSON.parse(stored) : DEFAULT_RECENT;
    } catch {
      return DEFAULT_RECENT;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('safemap_recent_searches', JSON.stringify(history));
    } catch { /* silent */ }
  }, [history]);

  const addSearch = (term) => {
    if (!term || typeof term !== 'string') return;
    const clean = term.trim();
    if (!clean) return;
    setHistory(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== clean.toLowerCase());
      return [clean, ...filtered].slice(0, 8);
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return { history, addSearch, clearHistory };
}
