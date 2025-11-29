import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { MOOD_PRESETS } from '../constants';

interface DuaInputProps {
  onSubmit: (text: string) => void;
}

const DuaInput: React.FC<DuaInputProps> = ({ onSubmit }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) onSubmit(text);
  };

  return (
    <div className="w-full max-w-2xl animate-in slide-in-from-bottom-8 duration-700 fade-in">
      <div className="text-center mb-10">
        <h1 className="font-serif-display text-4xl md:text-6xl text-slate-800 mb-4 tracking-tight">
          What burdens your heart?
        </h1>
        <p className="text-slate-500 text-lg md:text-xl font-light">
          Tell us your worries, your wishes, or your situation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative group mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-indigo-200 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
        <div className="relative glass-card rounded-3xl p-2 flex items-center shadow-xl shadow-indigo-100/50">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., I feel lost and need guidance..."
            className="flex-grow bg-transparent border-none outline-none px-6 py-4 text-lg text-slate-700 placeholder:text-slate-400 font-medium"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="p-4 bg-slate-800 text-white rounded-2xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <p className="text-center text-xs uppercase tracking-widest text-slate-400 font-semibold">
          Or choose a feeling
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {MOOD_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => onSubmit(preset.query)}
              className="px-4 py-2 bg-white/60 hover:bg-white border border-white/50 rounded-full text-sm text-slate-600 transition-all hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2 backdrop-blur-sm"
            >
              <span>{preset.emoji}</span>
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DuaInput;
