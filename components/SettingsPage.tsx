import React, { useState, useEffect } from 'react';
import { Settings, Globe } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [language, setLanguage] = useState<string>(() => {
    // Initialize language from localStorage or default to 'en'
    if (typeof window !== 'undefined') {
      return localStorage.getItem('appLanguage') || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    // Save language preference to localStorage whenever it changes
    if (typeof window !== 'undefined') {
      localStorage.setItem('appLanguage', language);
      // In a full i18n setup, you would load translations here
      console.log(`Language set to: ${language}`);
    }
  }, [language]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-in slide-in-from-bottom-8 duration-700 pb-24">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-bold mb-4">
          <Settings size={16} />
          <span>App Settings</span>
        </div>
        <h1 className="font-serif-display text-4xl md:text-5xl text-slate-800 mb-4">
          Customize Your Experience
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Personalize My Dua Companion to better suit your preferences.
        </p>
      </div>

      <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-xl">
        <h2 className="font-serif-display text-2xl text-slate-800 mb-6 flex items-center gap-3">
          <Globe size={24} className="text-emerald-600" />
          Language Preferences
        </h2>
        <div className="mb-6">
          <label htmlFor="language-select" className="block text-slate-700 text-sm font-medium mb-2">
            Select Language:
          </label>
          <select
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
            className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          >
            <option value="en">English</option>
            <option value="ar">العربية (Arabic)</option>
            {/* Add more languages here */}
          </select>
          <p className="text-xs text-slate-500 mt-2">
            (Note: Full content translation is a future feature. This sets your preferred display language.)
          </p>
        </div>

        {/* Placeholder for other settings */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <h2 className="font-serif-display text-2xl text-slate-800 mb-6 flex items-center gap-3">
            <Settings size={24} className="text-purple-600" />
            Other Settings
          </h2>
          <p className="text-slate-600">
            More customization options will be available here soon!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;