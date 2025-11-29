import React, { useState, useEffect } from 'react';
import { Surah, Verse, UserProgress } from '../types';
import { Eye, EyeOff, HelpCircle, ChevronRight, ChevronLeft, Sparkles, Wand2, Brain } from 'lucide-react';
import { generateQuizForVerse, explainVerseContext } from '../services/geminiService';

interface MemorizationModeProps {
  surah: Surah;
  progress: Record<string, UserProgress>;
  onRateVerse: (verseId: string, rating: 'easy' | 'medium' | 'hard') => void;
  initialVerseId: string | null;
}

const MemorizationMode: React.FC<MemorizationModeProps> = ({ surah, progress, onRateVerse, initialVerseId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [blurLevel, setBlurLevel] = useState<number>(0); // 0 = none, 1 = partial, 2 = full hidden
  const [showTranslation, setShowTranslation] = useState(true);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedWords, setSelectedWords] = useState<Set<number>>(new Set());

  const activeVerse = surah.verses[currentIndex];

  useEffect(() => {
    // Reset state on verse change
    setBlurLevel(0);
    setIsQuizMode(false);
    setQuizData(null);
    setExplanation(null);
    setSelectedWords(new Set());
  }, [currentIndex]);

  const handleWordClick = (index: number) => {
    const newSet = new Set(selectedWords);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setSelectedWords(newSet);
  };

  const toggleBlur = () => {
    setBlurLevel((prev) => (prev + 1) % 3);
  };

  const handleGenerateQuiz = async () => {
    if (quizData) {
      setIsQuizMode(true);
      return;
    }
    setLoadingAI(true);
    const data = await generateQuizForVerse(activeVerse);
    setQuizData(data);
    setIsQuizMode(true);
    setLoadingAI(false);
  };

  const handleExplain = async () => {
    if (explanation) return;
    setLoadingAI(true);
    const text = await explainVerseContext(activeVerse);
    setExplanation(text);
    setLoadingAI(false);
  };

  // Split arabic text into words for interactive hiding
  const words = activeVerse.arabicText.split(' ');

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Top Bar */}
      <div className="h-16 border-b flex items-center justify-between px-6 bg-white sticky top-0 z-10">
        <h2 className="font-semibold text-lg text-slate-700">{surah.englishName}</h2>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Verse {activeVerse.verseNumber} / {surah.verses.length}</span>
        </div>
      </div>

      {/* Main Card Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[500px]">
        
        {isQuizMode && quizData ? (
           <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-emerald-100 p-8 animate-in fade-in zoom-in duration-300">
             <div className="flex items-center gap-2 mb-6 text-emerald-600">
                <Brain className="w-6 h-6" />
                <h3 className="font-bold text-xl">Quick Quiz</h3>
             </div>
             <p className="text-lg font-medium text-slate-800 mb-6">{quizData.question}</p>
             <div className="space-y-3">
               {quizData.options.map((opt: string, idx: number) => (
                 <button 
                  key={idx}
                  onClick={() => {
                    if (idx !== quizData.correctIndex) alert("Try again!"); 
                    else {
                      alert("Correct!");
                      setIsQuizMode(false);
                    }
                  }}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all font-medium text-slate-600"
                 >
                   {opt}
                 </button>
               ))}
             </div>
             <button onClick={() => setIsQuizMode(false)} className="mt-6 text-slate-400 hover:text-slate-600 underline">Exit Quiz</button>
           </div>
        ) : (
          <div className="w-full max-w-3xl flex flex-col items-center gap-8">
            
            {/* The Verse Card */}
            <div className="w-full relative group">
              {/* Controls Overlay (Top Right) */}
              <div className="absolute top-0 right-0 -mt-10 flex gap-2">
                 <button onClick={toggleBlur} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors" title="Toggle visibility">
                   {blurLevel === 0 ? <Eye size={20} /> : <EyeOff size={20} />}
                 </button>
                 <button onClick={handleGenerateQuiz} disabled={loadingAI} className="p-2 text-slate-400 hover:text-purple-600 transition-colors" title="Quiz Me">
                   <Brain size={20} />
                 </button>
                 <button onClick={handleExplain} disabled={loadingAI} className="p-2 text-slate-400 hover:text-amber-500 transition-colors" title="Explain Verse">
                   <Sparkles size={20} />
                 </button>
              </div>

              {/* Arabic Text */}
              <div 
                className="text-center font-arabic text-4xl md:text-5xl lg:text-6xl text-slate-800 leading-loose md:leading-[2.5]" 
                dir="rtl"
              >
                {words.map((word, idx) => {
                  // Determine visibility based on blurLevel and manual selection
                  let opacity = 'opacity-100';
                  let blur = 'blur-0';
                  
                  if (blurLevel === 2) {
                    opacity = 'opacity-0'; // Fully hidden
                  } else if (blurLevel === 1) {
                    // Randomly blur some words or use a specific pattern if desired
                    // Here we just blur random words for demo, utilizing index for consistency
                    if (idx % 2 === 0) blur = 'blur-sm opacity-20';
                  }

                  // Manual toggle overrides
                  if (selectedWords.has(idx)) {
                     opacity = opacity === 'opacity-100' ? 'opacity-0' : 'opacity-100';
                  }

                  return (
                    <span 
                      key={idx} 
                      onClick={() => handleWordClick(idx)}
                      className={`inline-block mx-1 cursor-pointer transition-all duration-500 select-none hover:text-emerald-700 ${opacity} ${blur}`}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>

              {/* Translation */}
              {showTranslation && (
                <p className="text-center text-slate-500 mt-8 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
                  {activeVerse.translation}
                </p>
              )}
            </div>

            {/* AI Explanation Area */}
            {explanation && (
              <div className="bg-amber-50 border border-amber-100 p-6 rounded-xl text-amber-900 text-sm leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-2 mb-2 font-bold text-amber-700">
                  <Sparkles size={16} />
                  <span>Insight</span>
                </div>
                {explanation}
              </div>
            )}

            {/* Loading State */}
            {loadingAI && (
              <div className="flex items-center gap-2 text-emerald-600 animate-pulse">
                <Wand2 className="w-5 h-5 animate-spin" />
                <span>Consulting the knowledge base...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Controls (SRS) */}
      <div className="bg-white border-t p-6 pb-8">
        <div className="max-w-xl mx-auto flex flex-col gap-4">
          <p className="text-center text-xs text-slate-400 uppercase tracking-widest font-semibold">How well did you know this?</p>
          <div className="grid grid-cols-3 gap-4">
            <button 
              onClick={() => { onRateVerse(activeVerse.id, 'hard'); if (currentIndex < surah.verses.length - 1) setCurrentIndex(c => c + 1); }}
              className="py-3 rounded-lg border-2 border-red-100 text-red-600 font-semibold hover:bg-red-50 hover:border-red-200 transition-all active:scale-95"
            >
              Hard
            </button>
            <button 
              onClick={() => { onRateVerse(activeVerse.id, 'medium'); if (currentIndex < surah.verses.length - 1) setCurrentIndex(c => c + 1); }}
              className="py-3 rounded-lg border-2 border-yellow-100 text-yellow-600 font-semibold hover:bg-yellow-50 hover:border-yellow-200 transition-all active:scale-95"
            >
              Medium
            </button>
            <button 
              onClick={() => { onRateVerse(activeVerse.id, 'easy'); if (currentIndex < surah.verses.length - 1) setCurrentIndex(c => c + 1); }}
              className="py-3 rounded-lg border-2 border-emerald-100 text-emerald-600 font-semibold hover:bg-emerald-50 hover:border-emerald-200 transition-all active:scale-95"
            >
              Easy
            </button>
          </div>

          <div className="flex justify-between items-center mt-4 text-slate-400">
             <button 
               onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
               disabled={currentIndex === 0}
               className="hover:text-slate-800 disabled:opacity-30"
             >
               <ChevronLeft />
             </button>
             <span className="text-xs">Navigate verses</span>
             <button 
               onClick={() => setCurrentIndex(prev => Math.min(surah.verses.length - 1, prev + 1))}
               disabled={currentIndex === surah.verses.length - 1}
               className="hover:text-slate-800 disabled:opacity-30"
             >
               <ChevronRight />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemorizationMode;