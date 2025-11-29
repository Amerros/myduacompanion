import React from 'react';
import { Check, Star, Lock, Zap, Music, CreditCard } from 'lucide-react';
import { setPremiumUser } from '../services/userService';

interface PremiumPageProps {
  onUpgrade: () => void;
}

const PremiumPage: React.FC<PremiumPageProps> = ({ onUpgrade }) => {
  const handleSubscribe = (amount: number, planType: string) => {
    // Open PayPal in new tab
    window.open(`https://paypal.me/drowsymasks/${amount}`, '_blank');
    
    // Simulate web-hook verification for demo purposes
    // In a real app, this would listen for a success URL or server-side event
    setTimeout(() => {
      if (confirm(`Did you complete the ${planType} payment on PayPal? Click OK to activate your Premium status.`)) {
        setPremiumUser(true);
        onUpgrade();
      }
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-700 pb-24">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-bold mb-4">
          <Star size={16} className="fill-amber-700" />
          <span>Unlock Your Spiritual Potential</span>
        </div>
        <h1 className="font-serif-display text-4xl md:text-5xl text-slate-800 mb-4">
          Upgrade to DuaAI Premium
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Support our mission and gain unlimited access to personalized supplications, audio recitations, and more.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Free Tier */}
        <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-200"></div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">Basic</h3>
            <p className="text-slate-500 mb-6">For daily reflection</p>
            <div className="text-4xl font-bold text-slate-800 mb-8">Free</div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-600">
                <Check size={20} className="text-emerald-500" />
                <span>3 AI Duas per day</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600">
                <Check size={20} className="text-emerald-500" />
                <span>Standard Duas</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Lock size={20} />
                <span>No Audio Recitations</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Lock size={20} />
                <span>No Saved History</span>
              </li>
            </ul>
        </div>

        {/* Premium Tier */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl text-white shadow-2xl shadow-slate-900/20 relative transform md:-translate-y-4">
            <div className="absolute top-0 right-0 p-4">
              <div className="bg-gradient-to-r from-amber-300 to-amber-500 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-amber-50 mb-2">Premium</h3>
            <p className="text-slate-400 mb-6">For the dedicated seeker</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-bold text-white">$5</span>
              <span className="text-slate-400">/month</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <Zap size={20} className="text-amber-400" />
                <span>Unlimited AI Duas</span>
              </li>
              <li className="flex items-center gap-3">
                <Music size={20} className="text-amber-400" />
                <span>AI Audio Recitations</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={20} className="text-amber-400" />
                <span>Save Favorite Duas</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={20} className="text-amber-400" />
                <span>Priority Support</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={20} className="text-amber-400" />
                <span>Ad-free Experience</span>
              </li>
            </ul>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => handleSubscribe(5, 'monthly')}
                className="w-full py-4 bg-[#0070BA] text-white font-bold rounded-xl hover:bg-[#005ea6] transition-all flex items-center justify-center gap-2 group"
              >
                <span>Pay $5 with PayPal</span>
                <CreditCard size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                 onClick={() => handleSubscribe(50, 'yearly')}
                 className="w-full py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all text-sm"
              >
                Pay $50 Yearly (Save 16%)
              </button>
            </div>
        </div>
      </div>
      
      <div className="mt-12 text-center text-slate-500 text-sm">
        <p>Processed securely by PayPal. Cancel anytime.</p>
      </div>
    </div>
  );
};

export default PremiumPage;