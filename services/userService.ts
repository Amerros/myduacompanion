import { DuaResponse } from "../types";
import { supabase } from '@/src/integrations/supabase/client';

// Removed FREE_DAILY_LIMIT and FREE_AUDIO_LIMIT
// Removed getDailyUsage, incrementDailyUsage, getDailyAudioUsage, incrementDailyAudioUsage

// Removed getPremiumStatus and setPremiumStatus

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