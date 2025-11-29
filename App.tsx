import React, { useState, useEffect } from 'react';
import { Sparkles, Moon, Wind, Stars, Lock, Loader2, X } from 'lucide-react';
import DuaInput from './components/DuaInput';
import DuaResult from './components/DuaResult';
import Navigation from './components/Navigation';
import PremiumPage from './components/PremiumPage';
import Dashboard from './components/Dashboard';
import Login from './src/pages/Login'; // Import the Login page
import { useSession } from './src/contexts/SessionContext'; // Import useSession hook

import { DuaResponse, ViewState } from './types';
import { generateDua } from './services/geminiService';
import { 
  getDailyUsage, 
  incrementDailyUsage, 
  getPremiumStatus, 
  setPremiumStatus, 
  getSavedDuas, 
  saveDuaToHistory, 
  FREE_DAILY_LIMIT 
} from './services/userService';

const App: React.FC = () => {
  const { session, user, isLoading: isSessionLoading } = useSession();
  const [dua, setDua] = useState<DuaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<ViewState>('HOME');
  const [resultMode, setResultMode] = useState(false); // Sub-state for HOME view
  const [showAuthModal, setShowAuthModal] = useState(false); // New state for auth modal
  
  // User State
  const [dailyCount, setDailyCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [savedDuas, setSavedDuas] = useState<DuaResponse[]>([]);

  useEffect(() => {
    const initializeUserData = async () => {
      if (user) {
        setDailyCount(getDailyUsage()); 
        const premium = await getPremiumStatus(user.id);
        setIsPremium(premium);
        const saved = await getSavedDuas(user.id);
        setSavedDuas(saved);
      } else {
        // Reset state if no user is logged in
        setDailyCount(0);
        setIsPremium(false);
        setSavedDuas([]);
      }
    };
    initializeUserData();
  }, [user, view]);

  const handleRequest = async (query: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Rate Limit Check
    if (!isPremium && dailyCount >= FREE_DAILY_LIMIT) {
      alert("You have reached your free daily limit. Please upgrade for unlimited Duas.");
      setView('PREMIUM');
      return;
    }

    setLoading(true);
    const [result] = await Promise.all([
      generateDua(query),
      new Promise(resolve => setTimeout(resolve, 1500)) 
    ]);
    
    if (result) {
      setDua(result);
      setResultMode(true);
      
      if (!isPremium) {
        incrementDailyUsage();
        setDailyCount(prev => prev + 1);
      }
      
      await saveDuaToHistory(result, user.id);
      setSavedDuas(await getSavedDuas(user.id));
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

  const handleUpgradeSuccess = async () => {
    if (user) {
      await setPremiumStatus(user.id, true);
      setIsPremium(true);
      setView('HOME');
      setShowAuthModal(false); // Close modal if open
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
      case 'PREMIUM':
        return <PremiumPage onUpgrade={handleUpgradeSuccess} user={user} setShowAuthModal={setShowAuthModal} />;
      case 'DASHBOARD':
        return (
          <Dashboard 
            dailyUsage={dailyCount} 
            isPremium={isPremium} 
            savedDuas={savedDuas}
            onUpgrade={() => setView('PREMIUM')}
            onViewDua={(d) => { setDua(d); setResultMode(true); setView('HOME'); }}
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
            isPremium={isPremium}
            onUpgrade={() => setView('PREMIUM')}
            setShowAuthModal={setShowAuthModal} // Pass to DuaResult
            user={user} // Pass to DuaResult
          />
        ) : (
          <div className="flex flex-col items-center w-full">
            {/* Limit Badge */}
            {!isPremium && (
              <div className="mb-6 px-4 py-1 bg-slate-200/50 backdrop-blur-sm rounded-full border border-slate-300/50 text-xs font-semibold text-slate-500 flex items-center gap-2">
                <span>Daily Limit: {dailyCount}/{FREE_DAILY_LIMIT}</span>
                {dailyCount >= FREE_DAILY_LIMIT && <Lock size={12} />}
              </div>
            )}
            
            <DuaInput onSubmit={handleRequest} />
            
            {/* Upgrade CTA */}
            {!isPremium && (
              <button 
                onClick={() => setView('PREMIUM')}
                className="mt-8 px-6 py-2 bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 text-amber-800 rounded-full text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
              >
                <Sparkles size={14} /> 
                Get Unlimited Duas & Audio
              </button>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-slate-50 text-slate-800 font-sans selection:bg-amber-100 selection:text-amber-900 transition-colors duration-1000">
      
      {/* Heavenly Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none fixed">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-100 via-indigo-50 to-amber-50 opacity-80"></div>
        <div className="absolute top-[-10%] left-[20%] w-96 h-96 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse duration-[5000ms]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-violet-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse duration-[7000ms]"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
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
        <Navigation currentView={view} setView={handleNavChange} isPremium={isPremium} />
        
        {/* Auth Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in">
            <div className="relative w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
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