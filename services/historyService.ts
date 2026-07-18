import { HistoryItem } from '../types';

const STORAGE_KEY = 'lumina_search_history';

const createHistoryId = (): string => {
  if (crypto?.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const getHistory = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

export const saveToHistory = (query: string): HistoryItem[] => {
  const history = getHistory();
  
  // Remove duplicate if exists to push it to the top
  const filtered = history.filter(item => item.query.toLowerCase() !== query.toLowerCase());
  
  const newItem: HistoryItem = {
    id: createHistoryId(),
    query,
    timestamp: Date.now(),
  };

  const newHistory = [newItem, ...filtered].slice(0, 20); // Keep last 20
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  return newHistory;
};

export const clearHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
