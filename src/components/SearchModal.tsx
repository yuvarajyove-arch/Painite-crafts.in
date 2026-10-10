import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    products,
    setSelectedProductId,
    setCurrentView
  } = useStore();

  const [localQuery, setLocalQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  const searchChips = [
    'Boba Bear',
    'Matcha Frog',
    'Tulip Garden',
    'Keychains',
    'Fridge Magnets',
    'Desk Buddy',
    'Gift Sets'
  ];

  const searchResults = localQuery.trim()
    ? (products || []).filter(
        (p) =>
          p && (
            (p.name || '').toLowerCase().includes(localQuery.toLowerCase()) ||
            (p.category || '').toLowerCase().includes(localQuery.toLowerCase()) ||
            (p.shortDescription || '').toLowerCase().includes(localQuery.toLowerCase())
          )
      )
    : [];

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setIsSearchOpen(false);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyChip = (chip: string) => {
    setLocalQuery(chip);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center p-4 sm:p-6 md:p-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 bg-[#4A3728]/40 backdrop-blur-xs"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl sm:rounded-[36px] border border-[#F2E8E0] p-6 shadow-2xl z-10 space-y-4"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 pb-4 border-b border-[#F2E8E0]">
              <Search className="w-5 h-5 text-[#C5A059]" />
              <input
                ref={inputRef}
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search charms, keychains, mini figures..."
                className="w-full text-sm sm:text-base font-medium text-[#4A3728] focus:outline-none placeholder:text-[#7D6B5D]/60"
              />
              {localQuery && (
                <button
                  onClick={() => setLocalQuery('')}
                  className="p-1 rounded-full text-[#7D6B5D] hover:bg-[#FDF9F6]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="px-3 py-1 rounded-full bg-[#FDF9F6] border border-[#F2E8E0] text-xs font-semibold text-[#7D6B5D] hover:bg-[#F8D7DA]/40"
              >
                Esc
              </button>
            </div>

            {/* Quick Suggestion Chips */}
            <div>
              <span className="text-[10px] font-bold text-[#7D6B5D] uppercase tracking-wider block mb-2">
                Popular Studio Searches
              </span>
              <div className="flex flex-wrap gap-1.5">
                {searchChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleApplyChip(chip)}
                    className="px-3 py-1 rounded-full bg-[#FDF9F6] border border-[#F2E8E0] hover:bg-[#F8D7DA]/40 text-xs text-[#4A3728] transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Grid or Suggestions */}
            {localQuery.trim() && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3 text-xs text-[#7D6B5D]">
                  <span>
                    Found <strong>{searchResults.length}</strong> creations
                  </span>
                </div>

                {searchResults.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#7D6B5D]">
                    <p>No handmade clay pieces found for “{localQuery}”.</p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product.id)}
                        className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FDF9F6] hover:bg-[#F8D7DA]/30 border border-[#F2E8E0] cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-cover bg-white border border-[#F2E8E0]"
                          />
                          <div>
                            <span className="font-serif font-bold text-sm text-[#4A3728] group-hover:text-[#5D4636] transition-colors block">
                              {product.name}
                            </span>
                            <span className="text-[11px] text-[#7D6B5D]">
                              {product.category} • ₹{product.price}
                            </span>
                          </div>
                        </div>

                        <ArrowRight className="w-4 h-4 text-[#C5A059] group-hover:translate-x-1 transition-transform" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
