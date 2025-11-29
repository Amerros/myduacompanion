import React from 'react';
import { Heart, Handshake, Globe, DollarSign } from 'lucide-react';

const DonatePage: React.FC = () => {
  const paypalLink = "https://paypal.me/drowsymasks/5"; // Example link, user should replace with their own

  return (
    <div className="w-full max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-700 pb-24">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold mb-4">
          <Heart size={16} className="fill-emerald-700" />
          <span>Community-Powered Dua</span>
        </div>
        <h1 className="font-serif-display text-4xl md:text-5xl text-slate-800 mb-4">
          Support Our Mission
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          My Dua Companion is built by the community, for the community. Your contributions help us keep this spiritual tool accessible to everyone.
        </p>
      </div>

      <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-xl text-center max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Handshake size={48} className="text-emerald-600" />
          <h3 className="font-serif-display text-3xl text-slate-800">Our Pledge</h3>
        </div>
        <p className="text-slate-700 text-lg leading-relaxed mb-8">
          <span className="font-bold text-emerald-700">50% of every contribution</span> is dedicated to humanitarian aid in Palestine, supporting those in need. The remaining 50% is used to cover website maintenance, AI costs, and ongoing development to enhance your spiritual journey.
        </p>
        
        <a 
          href={paypalLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#0070BA] text-white font-bold rounded-xl hover:bg-[#005ea6] transition-all shadow-lg text-xl group"
        >
          <DollarSign size={24} className="group-hover:scale-110 transition-transform" />
          <span>Donate via PayPal</span>
        </a>
        <p className="text-slate-500 text-sm mt-4">Clicking this button will open PayPal.me in a new tab.</p>
      </div>

      <div className="mt-12 text-center text-slate-500 text-sm">
        <p>Every contribution, no matter how small, makes a difference. Jazakallahu Khairan!</p>
      </div>
    </div>
  );
};

export default DonatePage;