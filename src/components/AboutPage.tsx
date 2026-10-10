import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Heart
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setCurrentView } = useStore();

  return (
    <div className="py-10 sm:py-16 bg-[#FDF9F6] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Story */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5A059] uppercase tracking-widest mb-2">
            <Heart className="w-3.5 h-3.5 fill-[#F8D7DA] text-[#4A3728]" />
            <span>Behind The Clay Studio</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#4A3728] leading-tight">
            Little clay treasures, <br />
            <span className="font-serif italic font-normal text-[#C5A059]">
              crafted with heart & patience.
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#7D6B5D] leading-relaxed">
            Painite Crafts began as a cozy corner workbench filled with blocks of colorful clay, sculpting tools, and a passion for bringing tactile warmth back into everyday lives.
          </p>
        </div>

        {/* Studio Image & Mission Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl sm:rounded-[36px] border border-[#F2E8E0] p-6 sm:p-10 lg:p-12 shadow-xs mb-16">
          <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FAF7F2]">
            <img
              src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80"
              alt="Artisan sculpting handmade clay"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#4A3728]/40 to-transparent" />
            <span className="absolute bottom-4 left-4 bg-white/95 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#4A3728] shadow-xs">
              Handcrafted in India 🌸
            </span>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A3728]">
              Mindful Studio Craftsmanship
            </h2>
            <p className="text-xs sm:text-sm text-[#7D6B5D] leading-relaxed">
              In a world filled with mass production, we believe true charm lives in thoughtful, small-batch artistry. When you hold a Painite Crafts piece, you feel the gentle curve of a sculpted bear ear, the warmth of the handmade crafting process, and the spirit of mindful creation.
            </p>
            <p className="text-xs sm:text-sm text-[#7D6B5D] leading-relaxed">
              From our bestselling miniature bear keychains to floral magnets and desk companions, every piece is produced in conscious small batches using safe, durable, and non-toxic materials.
            </p>

            <div className="pt-4 grid grid-cols-3 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-[#FDF9F6] border border-[#F2E8E0]">
                <span className="font-serif font-bold text-xl text-[#4A3728] block">
                  Artisan
                </span>
                <span className="text-[11px] text-[#7D6B5D]">Quality Clay</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FDF9F6] border border-[#F2E8E0]">
                <span className="font-serif font-bold text-xl text-[#4A3728] block">
                  3,500+
                </span>
                <span className="text-[11px] text-[#7D6B5D]">Happy Homes</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FDF9F6] border border-[#F2E8E0]">
                <span className="font-serif font-bold text-xl text-[#C5A059] block">
                  4.9★
                </span>
                <span className="text-[11px] text-[#7D6B5D]">Collector Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shop Callout Banner */}
        <div className="bg-[#4A3728] rounded-3xl sm:rounded-[36px] p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <span className="text-3xl">✨</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              Bring Joy to Your Everyday
            </h2>
            <p className="text-xs sm:text-sm text-[#FDF9F6]/80 leading-relaxed">
              Explore our curated selection of handmade clay keychains, desk companions, magnets, and gift sets.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setCurrentView('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-3.5 rounded-full bg-[#F8D7DA] text-[#4A3728] text-xs sm:text-sm font-semibold hover:bg-white transition-all shadow-md active:scale-95"
              >
                Browse All Clay Crafts ♥
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
