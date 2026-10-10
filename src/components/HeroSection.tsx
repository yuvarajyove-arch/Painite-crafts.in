import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, Heart, Star, Palette, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const HeroSection: React.FC = () => {
  const { setCurrentView, setSelectedProductId } = useStore();

  return (
    <section className="relative px-4 sm:px-8 lg:px-10 pt-6 pb-12 sm:pb-16 overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-br from-[#FCE4EC]/40 via-[#F8D7DA]/20 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left">
            {/* Color Dot Palette Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-4 flex items-center gap-1.5"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#F8D7DA]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#EAD0D3]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] opacity-60"></span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#7D6B5D] ml-2">
                Handmade Clay Studio
              </span>
            </motion.div>

            {/* Main Headline with Serif Italic Artistry */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[40px] sm:text-[54px] lg:text-[62px] leading-[0.95] font-serif text-[#4A3728] mb-2"
            >
              Handcrafted <br />
              <span className="italic font-normal">with love.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="font-serif italic text-lg sm:text-xl text-[#C5A059] mb-4"
            >
              Every piece tells a story.
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#7D6B5D] text-base sm:text-lg leading-relaxed mb-8 max-w-[420px]"
            >
              Cute, creative clay art, carefully handmade to bring a little more joy to your everyday.
            </motion.p>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center"
            >
              <button
                id="hero-shop-now-btn"
                onClick={() => {
                  setCurrentView('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 bg-[#4A3728] text-white px-9 sm:px-10 py-3.5 sm:py-4 rounded-full font-semibold text-sm hover:shadow-xl hover:bg-[#5D4636] active:scale-95 transition-all shadow-sm"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 text-[#F8D7DA]" />
              </button>
            </motion.div>

            {/* Trust Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-8 pt-6 border-t border-[#F2E8E0] flex flex-wrap items-center gap-5 text-xs text-[#7D6B5D]"
            >
              <div className="flex items-center gap-1.5 font-medium">
                <Heart className="w-3.5 h-3.5 text-[#C5A059] fill-[#F8D7DA]" />
                <span>Artisan Keepsakes</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Non-Toxic Clay</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                <span>4.9/5 Collector Rating</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Layered Artistic Clay Feature Showcase */}
          <div className="lg:col-span-7 relative flex items-center justify-center bg-[#FCE4EC]/50 rounded-[40px] sm:rounded-[60px] overflow-hidden border border-white p-6 sm:p-12 min-h-[380px] sm:min-h-[440px]">
            {/* Ambient Blurred Spheres */}
            <div className="absolute top-10 right-10 w-28 h-28 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-10 left-10 w-36 h-36 bg-[#F8D7DA]/40 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center">
              {/* Primary Rotating Art Card: Tiny Teddy Charm */}
              <motion.div
                whileHover={{ rotate: 0, scale: 1.03 }}
                transition={{ duration: 0.3 }}
                onClick={() => {
                  setSelectedProductId('prod-cute-bear');
                  setCurrentView('product-detail');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-60 sm:w-72 bg-white rounded-[36px] sm:rounded-[40px] shadow-2xl p-6 rotate-3 flex flex-col items-center justify-center border-8 border-[#FDF9F6] cursor-pointer transition-transform"
              >
                <div className="w-28 sm:w-32 h-28 sm:h-32 bg-[#F8D7DA] rounded-full mb-4 flex items-center justify-center text-4xl sm:text-5xl shadow-inner border-2 border-[#EAD0D3]">
                  🧸
                </div>
                <div className="text-center">
                  <div className="font-serif italic text-xl font-bold text-[#4A3728]">Tiny Teddy Charm</div>
                  <div className="text-xs text-[#C5A059] uppercase tracking-widest font-bold mt-0.5">Limited Edition</div>
                </div>
              </motion.div>

              {/* Secondary Floating Art Card: Petal Pendant */}
              <motion.div
                whileHover={{ rotate: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                onClick={() => {
                  setSelectedProductId('prod-tulip-charm');
                  setCurrentView('product-detail');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="absolute -bottom-4 -left-6 sm:-left-10 w-36 sm:w-44 bg-white rounded-[26px] sm:rounded-[30px] shadow-xl p-3.5 sm:p-4 -rotate-6 flex flex-col items-center justify-center border-4 border-[#FDF9F6] cursor-pointer"
              >
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-[#FFF3E0] rounded-full mb-2 flex items-center justify-center text-2xl sm:text-3xl border border-[#FFE0B2]">
                  🌸
                </div>
                <div className="text-[10px] uppercase font-bold tracking-tighter text-[#4A3728]">
                  Petal Pendant
                </div>
                <span className="text-[9px] text-[#7D6B5D]">Hand-Painted</span>
              </motion.div>

              {/* Floating Mini Ribbon Badge */}
              <motion.div
                animate={{ y: [-3, 4, -3], rotate: [2, -2, 2] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-2 -right-4 sm:-right-6 bg-white px-3.5 py-1.5 rounded-full shadow-md border border-[#F2E8E0] text-[10px] font-bold text-[#4A3728] flex items-center gap-1.5"
              >
                <span className="text-[#C5A059]">✨</span>
                <span>Fresh Clay Batch</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

