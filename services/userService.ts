import { DuaResponse } from "../types";

const KEY_USAGE = 'dua_ai_usage';
const KEY_PREMIUM = 'dua_ai_premium';
const KEY_SAVED = 'dua_ai_saved';

export const FREE_DAILY_LIMIT = 3;

export const getDailyUsage = (): number => {
  const stored = localStorage.getItem(KEY_USAGE);
  const today = new Date().toDateString();
  
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed.date === today) {
      return parsed.count;
    }
  }
  return 0;
};

export const incrementDailyUsage = () => {
  const current = getDailyUsage();
  const today = new Date().toDateString();
  localStorage.setItem(KEY_USAGE, JSON.stringify({ date: today, count: current + 1 }));
};

export const isPremiumUser = (): boolean => {
  return localStorage.getItem(KEY_PREMIUM) === 'true';
};

export const setPremiumUser = (status: boolean) => {
  localStorage.setItem(KEY_PREMIUM, String(status));
  // Force reload to update UI state across components if needed, 
  // though React state in App.tsx is better.
};

export const saveDuaToHistory = (dua: DuaResponse) => {
    const saved = getSavedDuas();
    // Prevent duplicates based on arabic text
    if (!saved.some(d => d.arabic === dua.arabic)) {
        const newDua = { ...dua, timestamp: Date.now() };
        saved.unshift(newDua);
        localStorage.setItem(KEY_SAVED, JSON.stringify(saved));
    }
}

export const getSavedDuas = (): DuaResponse[] => {
    return JSON.parse(localStorage.getItem(KEY_SAVED) || '[]');
}

export const clearHistory = () => {
    localStorage.removeItem(KEY_SAVED);
}
