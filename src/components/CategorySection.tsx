import React from 'react';
import { useStore } from '../context/StoreContext';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

export const CategorySection: React.FC = () => {
  const { categories, setCurrentView, setSelectedCategorySlug } = useStore();

  const handleCategoryClick = (category: typeof categories[0]) => {
    setSelectedCategorySlug(category.name);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FDF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#C5A059] uppercase tracking-widest mb-2">
              <span>Clay Catalog</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#4A3728]">
              Sculpted by Category
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="mt-3 sm:mt-0 inline-flex items-center gap-1 text-[11px] uppercase tracking-widest font-bold border-b-2 border-[#D4AF37] pb-1 text-[#4A3728] hover:text-[#C5A059] transition-all group"
          >
            <span>View All Pieces</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Horizontal Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              id={`cat-card-${cat.slug}`}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={() => handleCategoryClick(cat)}
              className="flex flex-col items-center text-center cursor-pointer group"
            >
              {/* Circular Soft Image Frame */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full p-1 bg-white border border-[#F2E8E0] shadow-xs group-hover:shadow-md group-hover:border-[#D4AF37] transition-all overflow-hidden">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#FAF7F2]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Title & Item Count */}
              <h3 className="mt-3 text-xs sm:text-sm font-bold text-[#4A3728] group-hover:text-[#5D4636] transition-colors">
                {cat.name}
              </h3>
              <p className="text-[10px] text-[#7D6B5D] font-medium tracking-wide">
                {cat.itemCount} designs
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

