import { DuaResponse } from "../types";
import { supabase } from '@/src/integrations/supabase/client'; // Corrected import path

const KEY_USAGE = 'dua_ai_usage';
const KEY_AUDIO_USAGE = 'dua_ai_audio_usage'; // New key for audio usage

export const FREE_DAILY_LIMIT = 3;
export const FREE_AUDIO_LIMIT = 1; // New limit for free audio plays

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

export const getDailyAudioUsage = (): number => {
  const stored = localStorage.getItem(KEY_AUDIO_USAGE);
  const today = new Date().toDateString();
  
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed.date === today) {
      return parsed.count;
    }
  }
  return 0;
};

export const incrementDailyAudioUsage = () => {
  const current = getDailyAudioUsage();
  const today = new Date().toDateString();
  localStorage.setItem(KEY_AUDIO_USAGE, JSON.stringify({ date: today, count: current + 1 }));
};

export const getPremiumStatus = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('premium_status')
    .eq('id', userId)
    .single();

  if (error) {
    console.error("Error fetching premium status:", error);
    return false;
  }
  return data?.premium_status || false;
};

export const setPremiumStatus = async (userId: string, status: boolean): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update({ premium_status: status, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    console.error("Error updating premium status:", error);
  }
};

export const saveDuaToHistory = async (dua: DuaResponse, userId: string) => {
    // Check for duplicates before inserting
    const { data: existingDuas, error: fetchError } = await supabase
        .from('saved_duas')
        .select('id')
        .eq('user_id', userId)
        .eq('arabic', dua.arabic); // Assuming arabic text is unique enough for a user

    if (fetchError) {
        console.error("Error checking for existing dua:", fetchError);
        return;
    }

    if (existingDuas && existingDuas.length > 0) {
        console.log("Dua already saved for this user.");
        return; // Don't save duplicates
    }

    const { error: insertError } = await supabase
        .from('saved_duas')
        .insert({
            user_id: userId,
            arabic: dua.arabic,
            transliteration: dua.transliteration,
            translation: dua.translation,
            source: dua.source,
            guidance: dua.guidance,
            timestamp: new Date().toISOString()
        });

    if (insertError) {
        console.error("Error saving dua to history:", insertError);
    }
};

export const getSavedDuas = async (userId: string): Promise<DuaResponse[]> => {
    const { data, error } = await supabase
        .from('saved_duas')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

    if (error) {
        console.error("Error fetching saved duas:", error);
        return [];
    }
    return data || [];
};

export const clearHistory = async (userId: string): Promise<void> => {
    const { error } = await supabase
        .from('saved_duas')
        .delete()
        .eq('user_id', userId);

    if (error) {
        console.error("Error clearing history:", error);
    }
};