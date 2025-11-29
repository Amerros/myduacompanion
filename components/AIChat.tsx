import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { chatWithCoach } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AIChatProps {
  context: string;
}

const AIChat: React.FC<AIChatProps> = ({ context }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'As-salamu alaykum! I am your memorization coach. How can I assist you with your Quran journey today?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const response = await chatWithCoach(input, context);
    
    setMessages(prev => [...prev, { role: 'model', text: response || "I'm sorry, I couldn't process that.", timestamp: Date.now() }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b px-6 py-4 shadow-sm flex-shrink-0">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Bot className="text-emerald-600" />
          HafizAI Coach
        </h2>
        <p className="text-xs text-slate-500 mt-1">Context: {context}</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-slate-100 flex items-center gap-2 text-slate-400">
               <Loader2 className="animate-spin w-4 h-4" />
               <span className="text-sm">Thinking...</span>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t flex-shrink-0">
        <div className="max-w-4xl mx-auto relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about a verse, recitation tips, or meaning..."
            className="w-full bg-slate-100 border-0 rounded-full py-4 pl-6 pr-14 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-inner"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-2 p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-md"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
