import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Search, SlidersHorizontal, Sparkles, X, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

export const ShopPage: React.FC = () => {
  const {
    products,
    categories,
    selectedCategorySlug,
    setSelectedCategorySlug,
    searchQuery,
    setSearchQuery
  } = useStore();

  const [sortBy, setSortBy] = useState<string>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return (products || [])
      .filter((p) => {
        if (!p) return false;
        // Category Filter
        if (selectedCategorySlug && selectedCategorySlug !== 'All') {
          const productCategory = p.category || '';
          if (productCategory.toLowerCase() !== selectedCategorySlug.toLowerCase()) {
            return false;
          }
        }
        // Search Filter
        if (searchQuery && searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = (p.name || '').toLowerCase().includes(q);
          const matchCat = (p.category || '').toLowerCase().includes(q);
          const matchDesc = (p.shortDescription || '').toLowerCase().includes(q);
          const matchMat = (p.materials || []).some((m) => (m || '').toLowerCase().includes(q));
          if (!matchName && !matchCat && !matchDesc && !matchMat) {
            return false;
          }
        }
        // Price Filter
        if (p.price > maxPrice) return false;
        // In Stock Filter
        if (onlyInStock && !p.inStock) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        if (sortBy === 'bestseller') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
        return 0;
      });
  }, [products, selectedCategorySlug, searchQuery, maxPrice, onlyInStock, sortBy]);

  const clearFilters = () => {
    setSelectedCategorySlug(null);
    setSearchQuery('');
    setMaxPrice(1000);
    setOnlyInStock(false);
    setSortBy('featured');
  };

  const hasActiveFilters =
    Boolean(selectedCategorySlug) ||
    Boolean(searchQuery) ||
    maxPrice < 1000 ||
    onlyInStock ||
    sortBy !== 'featured';

  return (
    <div className="py-8 sm:py-12 bg-[#FDF9F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#C5A059] uppercase tracking-widest mb-2">
            <span>Handmade Studio Store</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#4A3728]">
            Shop All Clay Creations
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#7D6B5D]">
            Explore our full collection of handmade charms, magnets, desk buddies & gift sets.
          </p>
        </div>

        {/* Category Filter Pills (Horizontal Bar) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <button
            onClick={() => setSelectedCategorySlug(null)}
            className={`px-4 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap transition-all ${
              !selectedCategorySlug
                ? 'bg-[#4A3728] text-white shadow-xs'
                : 'bg-white border border-[#F2E8E0] text-[#7D6B5D] hover:bg-[#F8D7DA]/30 hover:text-[#4A3728]'
            }`}
          >
            All Categories ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategorySlug(cat.name)}
              className={`px-4 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap transition-all ${
                selectedCategorySlug === cat.name
                  ? 'bg-[#4A3728] text-white shadow-xs'
                  : 'bg-white border border-[#F2E8E0] text-[#7D6B5D] hover:bg-[#F8D7DA]/30 hover:text-[#4A3728]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="bg-white rounded-2xl border border-[#F2E8E0] p-3 sm:p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]" />
            <input
              type="text"
              placeholder="Search by name, charm, bear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-full bg-[#FDF9F6] border border-[#F2E8E0] text-xs text-[#4A3728] focus:outline-none focus:border-[#D4AF37] placeholder:text-[#7D6B5D]/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7D6B5D] hover:text-[#4A3728]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Mobile Filter Trigger Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="sm:hidden flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FDF9F6] text-xs font-semibold text-[#4A3728] border border-[#F2E8E0]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Filters</span>
            </button>

            {/* In-Stock Only Toggle (Desktop) */}
            <label className="hidden md:flex items-center gap-2 text-xs font-medium text-[#7D6B5D] cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded border-[#F2E8E0] text-[#4A3728] focus:ring-[#D4AF37]"
              />
              <span>In Stock Only</span>
            </label>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#7D6B5D] font-medium hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-full bg-[#FDF9F6] border border-[#F2E8E0] text-xs font-semibold text-[#4A3728] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="featured">Featured & Curated</option>
                <option value="bestseller">Best Selling</option>
                <option value="newest">Newest Drops</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Expandable Filter Panel */}
        {mobileFilterOpen && (
          <div className="sm:hidden bg-white rounded-2xl border border-[#F2E8E0] p-4 mb-6 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#4A3728] mb-1">
                Max Price: ₹{maxPrice}
              </label>
              <input
                type="range"
                min="150"
                max="1000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#4A3728]"
              />
            </div>
            <label className="flex items-center gap-2 text-xs font-medium text-[#7D6B5D]">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded text-[#4A3728]"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        )}

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#7D6B5D] font-medium">Active filters:</span>
            {selectedCategorySlug && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F8D7DA]/40 text-xs font-semibold text-[#4A3728] border border-[#EAD0D3]">
                {selectedCategorySlug}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setSelectedCategorySlug(null)}
                />
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F8D7DA]/40 text-xs font-semibold text-[#4A3728] border border-[#EAD0D3]">
                “{searchQuery}”
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
              </span>
            )}
            {onlyInStock && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F8D7DA]/40 text-xs font-semibold text-[#4A3728] border border-[#EAD0D3]">
                In Stock Only
                <X className="w-3 h-3 cursor-pointer" onClick={() => setOnlyInStock(false)} />
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-xs text-[#C5A059] underline hover:text-[#4A3728] ml-2 font-medium"
            >
              Reset all
            </button>
          </div>
        )}

        {/* Product Grid or Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#F2E8E0] p-8 max-w-lg mx-auto">
            <span className="text-5xl">🌸</span>
            <h3 className="font-serif text-xl font-bold text-[#4A3728] mt-4">
              No matching clay pieces found
            </h3>
            <p className="text-xs sm:text-sm text-[#7D6B5D] mt-2 leading-relaxed">
              We couldn’t find any clay items matching your filters. Try clearing your search or exploring our collections!
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 rounded-full bg-[#4A3728] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#5D4636]"
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-xs text-[#7D6B5D] font-medium">
              Showing <strong>{filteredProducts.length}</strong> handcrafted items
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

