import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';

export const FeaturedCollection: React.FC = () => {
  const { products, setCurrentView, setSelectedCategorySlug } = useStore();
  const [activeFilter, setActiveFilter] = useState<'all' | 'best' | 'charms' | 'figures' | 'magnets' | 'gifts'>('all');

  const filterTabs = [
    { id: 'all', label: 'All Featured' },
    { id: 'best', label: 'Best Sellers' },
    { id: 'charms', label: 'Charms & Keychains' },
    { id: 'figures', label: 'Mini Figures' },
    { id: 'magnets', label: 'Magnets' },
    { id: 'gifts', label: 'Gift Sets' }
  ];

  const filteredProducts = (products || []).filter((p) => {
    if (!p) return false;
    const cat = (p.category || '').toLowerCase();
    if (activeFilter === 'all') return p.isFeatured || p.isBestSeller;
    if (activeFilter === 'best') return p.isBestSeller;
    if (activeFilter === 'charms') return cat === 'charms' || cat === 'keychains';
    if (activeFilter === 'figures') return cat === 'mini figures';
    if (activeFilter === 'magnets') return cat === 'magnets';
    if (activeFilter === 'gifts') return cat === 'gift sets';
    return true;
  });

  return (
    <section className="py-14 sm:py-20 bg-[#FDF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#C5A059] uppercase tracking-widest mb-2">
            <span>Studio Favorites</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A3728]">
            Featured Art Pieces
          </h2>

          {/* Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-4 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-semibold transition-all ${
                  activeFilter === tab.id
                    ? 'bg-[#4A3728] text-white shadow-xs'
                    : 'bg-white border border-[#F2E8E0] text-[#7D6B5D] hover:text-[#4A3728] hover:bg-[#F8D7DA]/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Products Bottom Bar */}
        <div className="mt-12 text-center">
          <button
            id="view-all-products-btn"
            onClick={() => {
              setSelectedCategorySlug(null);
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#4A3728] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#5D4636] transition-all shadow-xs"
          >
            <span>Explore Entire Shop ({products.length} Designs)</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F8D7DA]" />
          </button>
        </div>
      </div>
    </section>
  );
};

