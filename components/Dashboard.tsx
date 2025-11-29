import React from 'react';
import { DuaResponse } from '../types';
import { Clock, Star, Zap, User } from 'lucide-react';
import { FREE_DAILY_LIMIT } from '../services/userService';

interface DashboardProps {
  dailyUsage: number;
  isPremium: boolean;
  savedDuas: DuaResponse[];
  onUpgrade: () => void;
  onViewDua: (dua: DuaResponse) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ dailyUsage, isPremium, savedDuas, onUpgrade, onViewDua }) => {
  const usagePercentage = Math.min((dailyUsage / FREE_DAILY_LIMIT) * 100, 100);
  
  return (
    <div className="w-full max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-700 pb-24">
       <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h1 className="font-serif-display text-3xl text-slate-800">My Spiritual Journey</h1>
            <p className="text-slate-500">Track your progress and revisit your prayers.</p>
         </div>
         <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
           <div className={`p-2 rounded-full ${isPremium ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
             <User size={20} />
           </div>
           <div>
             <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Plan</p>
             <p className={`font-semibold ${isPremium ? 'text-amber-600' : 'text-slate-700'}`}>
               {isPremium ? 'Premium Member' : 'Free Tier'}
             </p>
           </div>
         </div>
       </div>

       {/* Stats Grid */}
       <div className="grid md:grid-cols-2 gap-6 mb-10">
         {/* Usage Card */}
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex justify-between items-start mb-4">
             <div>
               <h3 className="font-bold text-slate-700">Daily Generations</h3>
               <p className="text-sm text-slate-400">Refreshes at midnight</p>
             </div>
             <div className="bg-sky-50 p-2 rounded-xl text-sky-600">
               <Zap size={20} />
             </div>
           </div>
           
           {isPremium ? (
             <div className="text-emerald-600 font-bold flex items-center gap-2">
               <Zap size={20} className="fill-emerald-600" />
               Unlimited Access
             </div>
           ) : (
             <>
               <div className="flex items-end gap-2 mb-2">
                 <span className="text-4xl font-bold text-slate-800">{dailyUsage}</span>
                 <span className="text-slate-400 mb-1">/ {FREE_DAILY_LIMIT} used</span>
               </div>
               <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                 <div 
                   className={`h-full rounded-full transition-all duration-1000 ${dailyUsage >= FREE_DAILY_LIMIT ? 'bg-red-500' : 'bg-sky-500'}`} 
                   style={{ width: `${usagePercentage}%` }}
                 ></div>
               </div>
               {dailyUsage >= FREE_DAILY_LIMIT && (
                 <button 
                   onClick={onUpgrade}
                   className="mt-4 w-full py-2 bg-amber-100 text-amber-800 rounded-lg text-sm font-semibold hover:bg-amber-200 transition-colors"
                 >
                   Upgrade for Unlimited
                 </button>
               )}
             </>
           )}
         </div>

         {/* Saved Stats */}
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex justify-between items-start mb-4">
             <div>
               <h3 className="font-bold text-slate-700">Saved Prayers</h3>
               <p className="text-sm text-slate-400">Your personal collection</p>
             </div>
             <div className="bg-amber-50 p-2 rounded-xl text-amber-600">
               <Star size={20} />
             </div>
           </div>
           <div className="text-4xl font-bold text-slate-800 mb-2">{savedDuas.length}</div>
           <p className="text-sm text-slate-500">
             {isPremium ? 'Library active' : 'Upgrade to save more'}
           </p>
         </div>
       </div>

       {/* History List */}
       <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Duas</h2>
       <div className="space-y-4">
         {savedDuas.length === 0 ? (
           <div className="text-center py-12 bg-white/50 rounded-3xl border border-dashed border-slate-200">
             <p className="text-slate-400">No saved Duas yet.</p>
           </div>
         ) : (
           savedDuas.map((dua, idx) => (
             <div 
               key={idx}
               onClick={() => onViewDua(dua)}
               className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
             >
               <div className="flex justify-between items-start mb-2">
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{dua.source}</span>
                 <span className="text-xs text-slate-300">
                   {dua.timestamp ? new Date(dua.timestamp).toLocaleDateString() : ''}
                 </span>
               </div>
               <p className="text-slate-800 font-medium line-clamp-2 group-hover:text-emerald-700 transition-colors">
                 "{dua.translation}"
               </p>
             </div>
           ))
         )}
       </div>
    </div>
  );
};

export default Dashboard;
