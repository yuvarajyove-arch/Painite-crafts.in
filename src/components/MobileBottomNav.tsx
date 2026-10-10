import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Home,
  ShoppingBag,
  Heart,
  User as UserIcon,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    setIsCartOpen,
    wishlist,
    user,
    setIsAuthModalOpen,
    isAdminAuthenticated,
    openAdminPortal,
    setSelectedCategorySlug,
    setSelectedCollectionSlug
  } = useStore();

  const handleNav = (view: string) => {
    setSelectedCategorySlug(null);
    setSelectedCollectionSlug(null);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAccountClick = () => {
    if (user) {
      handleNav('account');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const wishlistCount = wishlist.length;

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#F2E8E0] shadow-[0_-4px_20px_rgba(74,55,40,0.06)] px-2 py-1.5 safe-area-pb"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center">
        {/* 1. Home */}
        <button
          id="mobile-nav-home"
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            currentView === 'home'
              ? 'text-[#4A3728] font-bold'
              : 'text-[#7D6B5D] hover:text-[#4A3728]'
          }`}
        >
          <div className="relative">
            <Home className={`w-5 h-5 ${currentView === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {currentView === 'home' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#D9829B] rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
        </button>

        {/* 2. Shop */}
        <button
          id="mobile-nav-shop"
          onClick={() => handleNav('shop')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            currentView === 'shop' || currentView === 'collections' || currentView === 'product-detail'
              ? 'text-[#4A3728] font-bold'
              : 'text-[#7D6B5D] hover:text-[#4A3728]'
          }`}
        >
          <div className="relative">
            <ShoppingBag
              className={`w-5 h-5 ${
                currentView === 'shop' || currentView === 'collections' || currentView === 'product-detail'
                  ? 'stroke-[2.5]'
                  : 'stroke-2'
              }`}
            />
            {(currentView === 'shop' || currentView === 'collections' || currentView === 'product-detail') && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#D9829B] rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Shop</span>
        </button>

        {/* 3. Wishlist */}
        <button
          id="mobile-nav-wishlist"
          onClick={() => handleNav('wishlist')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
            currentView === 'wishlist'
              ? 'text-[#4A3728] font-bold'
              : 'text-[#7D6B5D] hover:text-[#4A3728]'
          }`}
        >
          <div className="relative">
            <Heart
              className={`w-5 h-5 ${
                currentView === 'wishlist'
                  ? 'fill-[#D9829B] text-[#D9829B] stroke-[2.5]'
                  : 'stroke-2'
              }`}
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#D9829B] text-white text-[9px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
            {currentView === 'wishlist' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#D9829B] rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Wishlist</span>
        </button>

        {/* 4. Bag / Cart */}
        <button
          id="mobile-nav-bag"
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-[#7D6B5D] hover:text-[#4A3728] transition-all relative"
        >
          <div className="relative">
            <div className="w-5 h-5 flex items-center justify-center">
              <span className="text-base leading-none">🛍️</span>
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#4A3728] text-[#F8D7DA] text-[9px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Bag</span>
        </button>

        {/* 5. Account */}
        <button
          id="mobile-nav-account"
          onClick={handleAccountClick}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            currentView === 'account'
              ? 'text-[#4A3728] font-bold'
              : 'text-[#7D6B5D] hover:text-[#4A3728]'
          }`}
        >
          <div className="relative">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-5 h-5 rounded-full object-cover border border-[#E8DCCF]"
              />
            ) : (
              <UserIcon
                className={`w-5 h-5 ${
                  currentView === 'account' ? 'stroke-[2.5]' : 'stroke-2'
                }`}
              />
            )}
            {currentView === 'account' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#D9829B] rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-12">
            {user ? (user.name.split(' ')[0] || 'Account') : 'Account'}
          </span>
        </button>
      </div>
    </nav>
  );
};
