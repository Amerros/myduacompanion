import React from 'react';
import { Heart, Globe, Server, ArrowRight, ExternalLink } from 'lucide-react';

const DonationPage: React.FC = () => {
  const handleDonate = (amount?: number) => {
    const baseUrl = "https://paypal.me/drowsymasks";
    const url = amount ? `${baseUrl}/${amount}` : baseUrl;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-700 pb-24">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full text-red-600 mb-6">
          <Heart size={32} className="fill-red-600" />
        </div>
        <h1 className="font-serif-display text-4xl md:text-5xl text-slate-800 mb-6">
          Giving Back
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
          DuaAI is committed to purification of wealth through Sadaqah. 
          <br className="hidden md:block" />
          Your contributions help keep this service running and support those in need.
        </p>
      </div>

      {/* Impact Breakdown */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
            <Globe size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">50% to Palestine</h3>
          <p className="text-slate-500 mb-6">
            Half of all donations go directly to reputable aid organizations providing food, medical aid, and shelter in Gaza and the West Bank.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>UNRWA</span> • <span>Islamic Relief</span> • <span>PCRF</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
            <Server size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">50% to Server Costs</h3>
          <p className="text-slate-500 mb-6">
            Generating high-quality AI responses requires significant computational power. Your support keeps DuaAI free for those who cannot afford it.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>LLM API Costs</span> • <span>Hosting</span> • <span>Maintenance</span>
          </div>
        </div>
      </div>

      {/* Donation Form */}
      <div className="bg-slate-800 rounded-3xl p-8 md:p-12 text-white text-center shadow-xl shadow-slate-900/10">
        <h3 className="text-2xl font-bold mb-8">Make a Donation via PayPal</h3>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[10, 25, 50, 100].map((amount) => (
            <button 
              key={amount} 
              onClick={() => handleDonate(amount)}
              className="px-8 py-4 bg-slate-700 hover:bg-[#0070BA] rounded-xl font-bold text-lg transition-colors border border-slate-600 hover:border-[#0070BA]"
            >
              ${amount}
            </button>
          ))}
          <button 
            onClick={() => handleDonate()}
            className="px-8 py-4 bg-transparent border border-slate-600 hover:border-slate-400 rounded-xl font-bold text-lg transition-colors"
          >
            Custom
          </button>
        </div>

        <button 
          onClick={() => handleDonate()}
          className="w-full max-w-md py-4 bg-[#0070BA] text-white font-bold rounded-xl hover:bg-[#005ea6] transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          Proceed to PayPal <ExternalLink size={20} />
        </button>
        <p className="mt-6 text-slate-400 text-sm">Secure donation via PayPal.me</p>
      </div>
    </div>
  );
};

export default DonationPage;