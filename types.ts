export interface DuaResponse {
  arabic: string;
  transliteration: string;
  translation: string;
  source: string; // e.g., "Surah Al-Baqarah 2:286" or "Inspirational"
  guidance: string; // Comforting explanation
  timestamp?: number;
}

export interface MoodPreset {
  emoji: string;
  label: string;
  query: string;
}

export interface AffiliateProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  category: 'Books' | 'Prayer' | 'Learning' | 'Lifestyle';
  image: string;
  link: string;
}

export type ViewState = 'HOME' | 'PREMIUM' | 'DONATE' | 'RESOURCES' | 'DASHBOARD';

export interface Verse {
  id: string;
  verseNumber: number;
  arabicText: string;
  translation: string;
}

export interface Surah {
  id: string;
  englishName: string;
  verses: Verse[];
}

export interface UserProgress {
  verseId: string;
  nextReview: number;
  interval: number;
  easeFactor: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}