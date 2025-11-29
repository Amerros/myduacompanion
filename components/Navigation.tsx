import React from 'react';
import { ViewState } from '../types';
import { Moon, Heart, Star, LayoutDashboard } from 'lucide-react';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isPremium: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, isPremium }) => {
  const navItems: { view: ViewState; label: string; icon: React.ReactNode }[] = [
    { view: 'HOME', label: 'Home', icon: <Moon size={18} /> },
    { view: 'DASHBOARD', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { view: 'PREMIUM', label: 'Premium', icon: <Star size={18} className={isPremium ? "fill-amber-400 text-amber-400" : ""} /> },
    { view: 'DONATE', label: 'Donate', icon: <Heart size={18} /> },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md border border-white/50 shadow-lg shadow-slate-200/50 rounded-full px-2 py-2 flex items-center gap-1">
      {navItems.map((item) => (
        <button
          key={item.view}
          onClick={() => setView(item.view)}
          className={`
            relative px-4 py-3 rounded-full flex items-center gap-2 transition-all duration-300
            ${currentView === item.view 
              ? 'bg-slate-800 text-white shadow-md scale-105' 
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}
          `}
        >
          {item.icon}
          <span className={`${currentView === item.view ? 'inline-block' : 'hidden md:inline-block'} text-sm font-medium`}>
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;