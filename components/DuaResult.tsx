import React, { useState, useRef, useEffect } from 'react';
import { DuaResponse } from '../types';
import { ArrowLeft, Copy, Share2, Feather, Play, Pause, Lock, Loader2, Volume2 } from 'lucide-react';
import { generateDuaAudio, decodeAudioData } from '../services/geminiService';

interface DuaResultProps {
  dua: DuaResponse;
  onBack: () => void;
  isPremium: boolean;
  onUpgrade: () => void;
}

const DuaResult: React.FC<DuaResultProps> = ({ dua, onBack, isPremium, onUpgrade }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (sourceRef.current) {
        sourceRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handlePlayAudio = async () => {
    if (!isPremium) {
      onUpgrade();
      return;
    }

    if (isPlaying) {
      if (sourceRef.current) {
        sourceRef.current.stop();
        sourceRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    setIsLoadingAudio(true);
    try {
      const audioData = await generateDuaAudio(dua.arabic);
      
      if (audioData) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
            sampleRate: 24000
          });
        }
        
        // Resume context if suspended (browser policy)
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        const ctx = audioContextRef.current;
        const buffer = await decodeAudioData(audioData, ctx);

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => setIsPlaying(false);
        
        source.start(0);
        sourceRef.current = source;
        setIsPlaying(true);
      } else {
        alert("Unable to generate audio at this time. Please try again.");
      }
    } catch (error) {
      console.error("Playback failed:", error);
      alert("Error playing audio.");
    } finally {
      setIsLoadingAudio(false);
    }
  };

  return (
    <div className="w-full max-w-3xl animate-in zoom-in-95 duration-700 fade-in">
      <button 
        onClick={onBack}
        className="relative z-50 mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to search
      </button>

      {/* Main Card */}
      <div className="glass-card rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/5 border border-white/80">
        
        {/* Top Decorative Bar */}
        <div className="h-2 bg-gradient-to-r from-amber-200 via-violet-200 to-sky-200"></div>

        <div className="p-8 md:p-12 relative">
          
          {/* Source Tag */}
          <div className="flex justify-center mb-8">
            <span className="px-4 py-1 rounded-full bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-400 tracking-wider uppercase">
              {dua.source}
            </span>
          </div>

          {/* Audio Controls */}
          <div className="absolute top-8 right-8 z-10">
             <button
               onClick={handlePlayAudio}
               disabled={isLoadingAudio}
               className={`
                 flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all
                 ${isPremium 
                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}
                 ${isLoadingAudio ? 'opacity-70 cursor-wait' : ''}
               `}
               title={isPremium ? "Play Recitation" : "Upgrade to Listen"}
             >
               {isLoadingAudio ? (
                 <Loader2 className="w-4 h-4 animate-spin" />
               ) : !isPremium ? (
                 <>
                   <Lock className="w-3 h-3" />
                   <span>Listen</span>
                 </>
               ) : isPlaying ? (
                 <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Stop</span>
                 </>
               ) : (
                 <>
                   <Volume2 className="w-4 h-4" />
                   <span>Recite</span>
                 </>
               )}
             </button>
          </div>

          {/* Arabic */}
          <div className="text-center mb-10 mt-6">
            <p className="font-arabic text-3xl md:text-5xl text-slate-800 leading-loose md:leading-[2.5] drop-shadow-sm" dir="rtl">
              {dua.arabic}
            </p>
          </div>

          {/* English Sections */}
          <div className="space-y-8 text-center max-w-xl mx-auto">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-amber-500/80 uppercase tracking-widest">Transliteration</h3>
              <p className="text-slate-500 italic font-serif-display text-lg">
                "{dua.transliteration}"
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-sky-500/80 uppercase tracking-widest">Translation</h3>
              <p className="text-slate-700 font-medium text-lg md:text-xl leading-relaxed">
                {dua.translation}
              </p>
            </div>
          </div>
        </div>

        {/* Guidance Section (Footer) */}
        <div className="bg-gradient-to-b from-white/50 to-amber-50/50 p-8 md:p-10 border-t border-slate-100">
          <div className="flex gap-4 items-start max-w-2xl mx-auto">
            <div className="bg-white p-3 rounded-full shadow-sm text-amber-500 shrink-0">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif-display font-semibold text-slate-800 text-lg mb-2">Wisdom & Comfort</h4>
              <p className="text-slate-600 leading-relaxed font-light">
                {dua.guidance}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuaResult;