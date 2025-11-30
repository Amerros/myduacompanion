import React from 'react';
import { DuaResponse } from '../types';
import { Clock, Star, User } from 'lucide-react'; // Removed LogIn icon
import { User as SupabaseUser } from '@supabase/supabase-js';

interface DashboardProps {
  savedDuas: DuaResponse[];
  onViewDua: (dua: DuaResponse) => void;
  user: SupabaseUser | null;
  // Removed setShowAuthModal as it's no longer needed here
}

const Dashboard: React.FC<DashboardProps> = ({ savedDuas, onViewDua, user }) => {
  // The dashboard is now always rendered. If no user, savedDuas will be empty.

  return (
    <div className="w-full max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-700 pb-24">
       <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h1 className="font-serif-display text-3xl text-slate-800">My Spiritual Journey</h1>
            <p className="text-slate-500">Track your progress and revisit your prayers.</p>
         </div>
       </div>

       <div className="grid md:grid-cols-1 gap-6 mb-10">
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
             {user ? "All your saved duas are here." : "Log in to save and view your personal duas."}
           </p>
         </div>
       </div>

       <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Duas</h2>
       <div className="space-y-4">
         {savedDuas.length === 0 ? (
           <div className="text-center py-12 bg-white/50 rounded-3xl border border-dashed border-slate-200">
             <p className="text-slate-400">
               {user ? "No saved Duas yet." : "Log in to save your duas and see them here."}
             </p>
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