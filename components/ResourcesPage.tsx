import React from 'react';
import { AffiliateProduct } from '../types';
import { ExternalLink, Tag } from 'lucide-react';

const PRODUCTS: AffiliateProduct[] = [
  {
    id: '1',
    title: 'The Clear Quran - English Translation',
    description: 'A thematic English translation of the Quran that is easy to understand and accurate.',
    price: '$15.99',
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&q=80&w=400',
    link: '#'
  },
  {
    id: '2',
    title: 'Premium Velvet Prayer Mat',
    description: 'Luxurious, soft velvet prayer rug with memory foam for knee comfort.',
    price: '$29.99',
    category: 'Prayer',
    image: 'https://images.unsplash.com/photo-1564121211835-e88c852648ab?auto=format&fit=crop&q=80&w=400',
    link: '#'
  },
  {
    id: '3',
    title: 'Fortress of the Muslim (Hisn al-Muslim)',
    description: 'Essential collection of daily authentic Adhkar and Duas from the Sunnah.',
    price: '$8.50',
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&q=80&w=400',
    link: '#'
  },
  {
    id: '4',
    title: 'Digital Tasbih Counter',
    description: 'Modern, sleek digital counter for tracking your Dhikr throughout the day.',
    price: '$12.00',
    category: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&q=80&w=400',
    link: '#'
  }
];

const ResourcesPage: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto animate-in slide-in-from-bottom-8 duration-700 pb-24">
      <div className="text-center mb-12">
        <h1 className="font-serif-display text-4xl md:text-5xl text-slate-800 mb-4">
          Curated Essentials
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Handpicked resources to enhance your spiritual journey. 
          <br />
          <span className="text-sm text-slate-400 italic">Disclosure: Purchases help support our free service via affiliate commissions.</span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group">
            <div className="h-48 overflow-hidden relative">
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-slate-600 flex items-center gap-1">
                <Tag size={12} /> {product.category}
              </div>
            </div>
            
            <div className="p-5 flex flex-col h-[calc(100%-12rem)]">
              <h3 className="font-bold text-slate-800 mb-2 line-clamp-2">{product.title}</h3>
              <p className="text-sm text-slate-500 mb-4 flex-grow line-clamp-3">{product.description}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                <span className="font-bold text-emerald-600">{product.price}</span>
                <a 
                  href={product.link}
                  className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
                >
                  Buy Now <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourcesPage;
