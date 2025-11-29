import React from 'react';
import { DuaResponse } from '../types';
import { Clock, Star, User } from 'lucide-react'; // Removed Zap
import { User as SupabaseUser } from '@supabase/supabase-js';

interface DashboardProps {
  // Removed dailyUsage, isPremium, onUpgrade
  savedDuas: DuaResponse[];
  onViewDua: (dua: DuaResponse) => void;
  user: SupabaseUser | null;
}

const Dashboard: React.FC<DashboardProps> = ({ savedDuas, onViewDua, user }) => {
  
  if (!user) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-20 animate-in fade-in">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
          <User size={48} className="text-slate-400 mx-auto mb-6" />
          <h2 className="font-serif-display text-2xl text-slate-800 mb-4">
            Log In to Access Your Dashboard
          </h2>
          <p className="text-slate-500 mb-6">
            Your spiritual journey and saved prayers will appear here once you're logged in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-700 pb-24">
       <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h1 className="font-serif-display text-3xl text-slate-800">My Spiritual Journey</h1>
            <p className="text-slate-500">Track your progress and revisit your prayers.</p>
         </div>
         {/* Removed Plan display */}
       </div>

       {/* Stats Grid */}
       <div className="grid md:grid-cols-1 gap-6 mb-10"> {/* Changed to 1 column */}
         {/* Removed Usage Card */}

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
             All your saved duas are here.
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