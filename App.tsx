import React, { useState, useEffect } from 'react';
import { Sparkles, Moon, Wind, Stars, Loader2, X } from 'lucide-react';
import DuaInput from './components/DuaInput';
import DuaResult from './components/DuaResult';
import Navigation from './components/Navigation';
import ContributePage from './components/ContributePage';
import Dashboard from './components/Dashboard';
import SettingsPage from './components/SettingsPage'; // Import SettingsPage
import Login from './src/pages/Login';
import { useSession } from './src/contexts/SessionContext';

import { DuaResponse, ViewState } from './types';
import { generateDua } from './services/geminiService';
import { 
  getSavedDuas, 
  saveDuaToHistory, 
} from './services/userService';

const App: React.FC = () => {
  const { session, user, isLoading: isSessionLoading } = useSession();
  const [dua, setDua] = useState<DuaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<ViewState>('HOME');
  const [resultMode, setResultMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const [savedDuas, setSavedDuas] = useState<DuaResponse[]>([]);
  const [appLanguage, setAppLanguage] = useState<string>('en'); // State for app language

  useEffect(() => {
    // Initialize app language from localStorage
    if (typeof window !== 'undefined') {
      setAppLanguage(localStorage.getItem('appLanguage') || 'en');
    }

    const initializeUserData = async () => {
      if (user) {
        const saved = await getSavedDuas(user.id);
        setSavedDuas(saved);
      } else {
        setSavedDuas([]); // Clear saved duas if no user is logged in
      }
    };
    initializeUserData();
  }, [user, view]);

  useEffect(() => {
    if (user && showAuthModal) {
      setShowAuthModal(false);
    }
  }, [user, showAuthModal]);

  const handleRequest = async (query: string) => {
    setLoading(true);
    const [result] = await Promise.all([
      generateDua(query),
      new Promise(resolve => setTimeout(resolve, 1500)) 
    ]);
    
    if (result) {
      setDua(result);
      setResultMode(true);
      
      // Save Dua to history ONLY if user is logged in
      if (user) {
        await saveDuaToHistory(result, user.id);
        setSavedDuas(await getSavedDuas(user.id));
      }
    }
    setLoading(false);
  };

  const handleReset = () => {
    setDua(null);
    setResultMode(false);
  };

  const handleNavChange = (newView: ViewState) => {
    setView(newView);
    if (newView !== 'HOME') {
      setResultMode(false);
    }
    // Re-fetch language when navigating to ensure it's up-to-date
    if (typeof window !== 'undefined') {
      setAppLanguage(localStorage.getItem('appLanguage') || 'en');
    }
  };

  if (isSessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  const renderContent = () => {
    switch (view) {
      case 'CONTRIBUTE':
        return <ContributePage />;
      case 'DASHBOARD':
        return (
          <Dashboard 
            savedDuas={savedDuas}
            onViewDua={(d) => { setDua(d); setResultMode(true); setView('HOME'); }}
            user={user}
          />
        );
      case 'SETTINGS': // New case for SettingsPage
        return <SettingsPage />;
      case 'HOME':
      default:
        return loading ? (
          <div className="flex flex-col items-center gap-6 animate-in fade-in duration-1000 py-20">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-200 blur-xl opacity-30 animate-pulse rounded-full"></div>
              <Stars className="w-12 h-12 text-amber-500/80 animate-spin-slow duration-[10000ms]" />
            </div>
            <p className="text-xl font-serif-display text-slate-600 animate-pulse">Seeking knowledge and guidance for you...</p>
          </div>
        ) : resultMode && dua ? (
          <DuaResult 
            dua={dua} 
            onBack={handleReset} 
            targetLanguage={appLanguage} // Pass the selected language
          />
        ) : (
          <div className="flex flex-col items-center w-full">
            <DuaInput onSubmit={handleRequest} />
            
            <button 
                onClick={() => setView('CONTRIBUTE')}
                className="mt-8 px-6 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 text-emerald-800 rounded-full text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
              >
                <Sparkles size={14} /> 
                Support Our Mission
              </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-white text-slate-800 font-sans selection:bg-amber-100 selection:text-amber-900 transition-colors duration-1000">
      
      <div className="absolute inset-0 z-0 pointer-events-none fixed">
        <div className="absolute inset-0 heavenly-glow-bg"></div>
        <div className="absolute inset-0 opacity-[0.03] noise-bg"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen items-center p-4 md:p-8">
        
        <header className="w-full p-4 md:p-6 flex justify-between items-center opacity-80 pointer-events-none sticky top-0 z-40">
          <div 
            onClick={() => setView('HOME')}
            className="flex items-center gap-2 text-slate-600 pointer-events-auto cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Moon className="w-6 h-6" />
            <span className="font-serif-display font-semibold text-xl tracking-wide">My Dua Companion</span>
          </div>
        </header>

        <main className="w-full flex-grow flex flex-col items-center justify-center pt-4 md:pt-10">
          {renderContent()}
        </main>
        
        <Navigation currentView={view} setView={handleNavChange} />
        
        {showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in">
            <div className="relative w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-100 overflow-y-auto max-h-[90vh]">
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
              <Login />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;