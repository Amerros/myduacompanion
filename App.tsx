import React, { useState, useEffect } from 'react';
import { Sparkles, Moon, Wind, Stars, Loader2, X } from 'lucide-react'; // Removed Lock
import DuaInput from './components/DuaInput';
import DuaResult from './components/DuaResult';
import Navigation from './components/Navigation';
import DonatePage from './components/DonatePage'; // Changed from PremiumPage
import Dashboard from './components/Dashboard';
import Login from './src/pages/Login';
import { useSession } from './src/contexts/SessionContext';

import { DuaResponse, ViewState } from './types';
import { generateDua } from './services/geminiService';
import { 
  getSavedDuas, 
  saveDuaToHistory, 
  // Removed FREE_DAILY_LIMIT, FREE_AUDIO_LIMIT, getDailyUsage, incrementDailyUsage, getDailyAudioUsage, incrementDailyAudioUsage, getPremiumStatus, setPremiumStatus
} from './services/userService';

const App: React.FC = () => {
  const { session, user, isLoading: isSessionLoading } = useSession();
  const [dua, setDua] = useState<DuaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<ViewState>('HOME');
  const [resultMode, setResultMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Removed dailyCount, dailyAudioCount, isPremium states
  const [savedDuas, setSavedDuas] = useState<DuaResponse[]>([]);

  useEffect(() => {
    const initializeUserData = async () => {
      // Removed dailyCount and dailyAudioCount initialization
      if (user) {
        // Removed premium status fetching
        const saved = await getSavedDuas(user.id);
        setSavedDuas(saved);
      } else {
        // Reset Supabase-dependent state if no user is logged in
        setSavedDuas([]);
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
      
      // All duas are now free, no incrementDailyUsage needed
      
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
  };

  // Removed handleUpgradeSuccess

  if (isSessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  const renderContent = () => {
    switch (view) {
      case 'DONATE': // New case for DonatePage
        return <DonatePage />;
      case 'DASHBOARD':
        return (
          <Dashboard 
            savedDuas={savedDuas}
            onViewDua={(d) => { setDua(d); setResultMode(true); setView('HOME'); }}
            user={user}
          />
        );
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
            // Removed isPremium, onUpgrade, setShowAuthModal, user, dailyAudioCount, setDailyAudioCount
          />
        ) : (
          <div className="flex flex-col items-center w-full">
            {/* Removed Limit Badge */}
            
            <DuaInput onSubmit={handleRequest} />
            
            {/* Removed Upgrade CTA */}
            <button 
                onClick={() => setView('DONATE')}
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
      
      {/* Heavenly Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none fixed">
        {/* Main heavenly glow */}
        <div className="absolute inset-0 heavenly-glow-bg"></div>
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.03] noise-bg"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen items-center p-4 md:p-8">
        
        {/* Header */}
        <header className="w-full p-4 md:p-6 flex justify-between items-center opacity-80 pointer-events-none sticky top-0 z-40">
          <div 
            onClick={() => setView('HOME')}
            className="flex items-center gap-2 text-slate-600 pointer-events-auto cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Moon className="w-6 h-6" />
            <span className="font-serif-display font-semibold text-xl tracking-wide">My Dua Companion</span>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="w-full flex-grow flex flex-col items-center justify-center pt-4 md:pt-10">
          {renderContent()}
        </main>
        
        {/* Navigation Bar */}
        <Navigation currentView={view} setView={handleNavChange} />
        
        {/* Auth Modal */}
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