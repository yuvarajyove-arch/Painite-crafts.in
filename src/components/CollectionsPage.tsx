import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export const CollectionsPage: React.FC = () => {
  const { collections, setCurrentView, setSelectedCollectionSlug, setSelectedCategorySlug } = useStore();

  const handleOpenCollection = (collection: typeof collections[0]) => {
    setSelectedCollectionSlug(collection.id);
    setSelectedCategorySlug(null);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-10 sm:py-16 bg-[#FFFDF9] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D9829B] uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Artisan Curation</span>
          </div>
          <h1 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-[#3D272A]">
            Curated Clay Collections
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#6E5357] leading-relaxed">
            Themed drops and seasonal batches sculpted with character, story, and whimsical joy.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {collections.map((col, idx) => (
            <motion.div
              key={col.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={() => handleOpenCollection(col)}
              className="group bg-white rounded-3xl border border-[#FCE7EC] overflow-hidden shadow-xs hover:shadow-xl hover:shadow-[#FCE7EC]/60 hover:border-[#F9D5DF] transition-all cursor-pointer flex flex-col justify-between"
            >
              {/* Image Banner */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF7F2]">
                <img
                  src={col.image}
                  alt={col.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3D272A]/50 via-transparent to-transparent opacity-60 group-hover:opacity-70 transition-opacity" />

                {/* Collection Tag */}
                <span className="absolute top-3.5 left-3.5 inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-xs px-3 py-1 text-[11px] font-bold text-[#B85B75] shadow-xs">
                  <Sparkles className="w-3 h-3 text-[#D9829B]" />
                  {col.tag}
                </span>

                {/* Subtitle floating on image */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                  <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90 block">
                    {col.subtitle}
                  </span>
                  <h3 className="font-serif-title text-xl sm:text-2xl font-bold leading-tight">
                    {col.title}
                  </h3>
                </div>
              </div>

              {/* Body Description & Action */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-[#6E5357] leading-relaxed">
                  {col.description}
                </p>

                <div className="mt-5 pt-4 border-t border-[#FAF7F2] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#B85B75] group-hover:text-[#3D272A] transition-colors flex items-center gap-1">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[11px] text-[#6E5357]">
                    {col.productIds.length} styles
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
