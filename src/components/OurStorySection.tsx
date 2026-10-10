import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, Heart, ShieldCheck, Gift } from 'lucide-react';
import { motion } from 'motion/react';

export const OurStorySection: React.FC = () => {
  const { setCurrentView } = useStore();

  const featureCards = [
    {
      icon: Heart,
      title: 'Artisan Studio',
      tagline: '♥ Artisan Craftsmanship',
      description: 'Every piece is crafted with patient precision and artistic dedication at our studio table.',
      bgColor: 'bg-[#F8D7DA]/30',
      borderColor: 'border-[#EAD0D3]',
      iconColor: 'text-[#4A3728]'
    },
    {
      icon: ShieldCheck,
      title: 'Carefully Crafted',
      tagline: '🌿 Premium & Non-Toxic',
      description: 'Perfected through our handmade crafting process and sealed with water-resistant protective glaze.',
      bgColor: 'bg-white',
      borderColor: 'border-[#F2E8E0]',
      iconColor: 'text-[#C5A059]'
    },
    {
      icon: Gift,
      title: 'Perfect for Every Occasion',
      tagline: '🎁 Keepsake Gift Ready',
      description: 'Arrives lovingly packaged in our signature keepsake box with custom ribbon.',
      bgColor: 'bg-[#FCE4EC]/40',
      borderColor: 'border-[#EAD0D3]',
      iconColor: 'text-[#4A3728]'
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-white border-y border-[#F2E8E0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Storytelling & Studio Image */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#C5A059] uppercase tracking-widest mb-3">
              <span>Behind the Studio Table</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#4A3728] leading-tight">
              Small pieces, <br />
              <span className="font-serif italic font-normal text-[#C5A059]">
                big emotions.
              </span>
            </h2>

            <p className="mt-5 text-base sm:text-lg text-[#7D6B5D] leading-relaxed font-normal">
              Every piece at <strong className="text-[#4A3728] font-semibold">Painite Crafts</strong> is lovingly handmade with attention to detail. We believe clay art is more than just something cute — it is a way to express love, memories and creativity.
            </p>

            <p className="mt-3 text-sm sm:text-base text-[#7D6B5D] leading-relaxed">
              From our cozy workbench filled with colorful clay blocks to the delicate painting of blush cheeks, every mini creation carries a little slice of heartfelt joy.
            </p>

            {/* Studio Workspace Image Strip */}
            <div className="mt-6 grid grid-cols-3 gap-3 w-full">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#F2E8E0] shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80"
                  alt="Clay Hand Sculpting"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#F2E8E0] shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80"
                  alt="Clay Detailing with brushes"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#F2E8E0] shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80"
                  alt="Studio Gift Packaging"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="mt-8">
              <button
                id="story-learn-more-btn"
                onClick={() => {
                  setCurrentView('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#4A3728] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#5D4636] hover:shadow-md transition-all shadow-xs"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F8D7DA]" />
              </button>
            </div>
          </div>

          {/* Right Column: 3 Feature Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {featureCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  className={`p-5 sm:p-6 rounded-3xl ${card.bgColor} border ${card.borderColor} shadow-xs hover:shadow-sm transition-all`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-xs border border-[#F2E8E0]">
                      <Icon className={`w-4 h-4 ${card.iconColor}`} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">
                        {card.tagline}
                      </span>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#4A3728]">
                        {card.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-[#7D6B5D] leading-relaxed mt-2 pl-1">
                    {card.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

