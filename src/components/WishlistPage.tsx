import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, toggleWishlist, addToCart, setCurrentView } = useStore();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveAllToCart = () => {
    wishlistedProducts.forEach((p) => {
      if (p.inStock) {
        addToCart(p, 1);
      }
    });
  };

  return (
    <div className="py-8 sm:py-14 bg-[#FFFDF9] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D9829B] uppercase tracking-wider mb-2">
              <Heart className="w-3.5 h-3.5 fill-[#FCE7EC]" />
              <span>Your Saved Favorites</span>
            </div>
            <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#3D272A]">
              Studio Wishlist ({wishlistedProducts.length})
            </h1>
            <p className="mt-1 text-sm text-[#6E5357]">
              Keep track of clay pieces you love or plan to gift.
            </p>
          </div>

          {wishlistedProducts.length > 0 && (
            <button
              onClick={handleMoveAllToCart}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#3D272A] text-white text-xs font-semibold hover:bg-[#5C3A42] transition-colors shadow-xs"
            >
              <ShoppingBag className="w-4 h-4 text-[#FCE7EC]" />
              <span>Move All to Bag</span>
            </button>
          )}
        </div>

        {/* Wishlist Items Grid or Empty State */}
        {wishlistedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl sm:rounded-[36px] border border-[#FCE7EC] p-8 max-w-lg mx-auto shadow-xs">
            <div className="w-20 h-20 rounded-full bg-[#FFF5F7] border border-[#F9D5DF] flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-[#D9829B] stroke-[1.5]" />
            </div>
            <h3 className="font-serif-title text-2xl font-bold text-[#3D272A]">
              Your wishlist is empty
            </h3>
            <p className="text-xs sm:text-sm text-[#6E5357] mt-2 mb-6 leading-relaxed">
              Explore our handmade clay keychains, mini figures, and charms and tap the heart icon to save your favorites!
            </p>
            <button
              onClick={() => {
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#3D272A] text-white text-xs sm:text-sm font-semibold hover:bg-[#5C3A42]"
            >
              <span>Explore Handmade Crafts</span>
              <ArrowRight className="w-4 h-4 text-[#FCE7EC]" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
