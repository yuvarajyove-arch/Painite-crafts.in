import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, Star, ShoppingBag, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onOpenDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { toggleWishlist, isInWishlist, addToCart, setSelectedProductId, setCurrentView } = useStore();
  const wishlisted = isInWishlist(product.id);

  const handleClick = () => {
    if (onOpenDetails) {
      onOpenDetails(product);
    } else {
      setSelectedProductId(product.id);
      setCurrentView('product-detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      id={`product-card-${product.id}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={handleClick}
      className="group relative flex flex-col rounded-3xl bg-white border border-[#F2E8E0] p-4 shadow-sm hover:shadow-md transition-all cursor-pointer select-none"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-white to-[#FDF9F6] border border-[#F2E8E0]/60">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=700&auto=format&fit=crop&q=80'}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F8D7DA] px-2.5 py-1 text-[10px] font-bold text-[#4A3728] shadow-xs border border-[#EAD0D3]">
              <Sparkles className="w-2.5 h-2.5 text-[#C5A059]" />
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label="Add to wishlist"
          className={`absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs shadow-xs transition-transform duration-200 active:scale-80 hover:scale-110 ${
            wishlisted ? 'text-[#4A3728]' : 'text-[#7D6B5D] hover:text-[#4A3728]'
          }`}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? 'fill-[#F8D7DA] stroke-[#4A3728]' : 'stroke-current'}`} />
        </button>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/75 backdrop-blur-xs">
            <span className="rounded-full bg-[#4A3728] px-3.5 py-1 text-xs font-semibold text-white">
              Sold Out (Restocking)
            </span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="mt-3.5 flex flex-1 flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[#7D6B5D]">
            <span className="font-bold text-[#C5A059] uppercase tracking-widest text-[10px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="font-semibold text-[#4A3728] text-xs">{product.rating}</span>
              <span className="text-[11px] text-[#7D6B5D]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="mt-1.5 font-serif text-sm sm:text-base font-bold text-[#4A3728] line-clamp-1 group-hover:text-[#5D4636] transition-colors">
            {product.name}
          </h3>

          {/* Short Note */}
          <p className="mt-1 text-xs text-[#7D6B5D] line-clamp-1 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Quick Add Button */}
        <div className="mt-3.5 flex items-center justify-between pt-2.5 border-t border-[#F2E8E0]">
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif font-bold text-sm sm:text-base text-[#4A3728]">
              ₹{product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-[#7D6B5D] line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className="flex items-center gap-1.5 rounded-full bg-[#4A3728] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#5D4636] transition-all active:scale-95 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
