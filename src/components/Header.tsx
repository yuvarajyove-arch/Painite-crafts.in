import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Heart,
  Search,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    setIsCartOpen,
    wishlist,
    user,
    setIsAuthModalOpen,
    setIsSearchModalOpen,
    setSelectedCategorySlug,
    setSelectedCollectionSlug,
    openAdminPortal,
    isAdminAuthenticated,
    freeShippingThreshold,
    storeSettings
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateTo = (view: string, categorySlug?: string | null, collectionSlug?: string | null) => {
    setSelectedCategorySlug(categorySlug || null);
    setSelectedCollectionSlug(collectionSlug || null);
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Home', view: 'home' },
    { label: 'Shop Crafts', view: 'shop' },
    { label: 'Collections', view: 'collections' },
    { label: 'Studio Story', view: 'about' },
    { label: 'FAQ & Care', view: 'faq' },
    { label: 'Contact', view: 'contact' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#F2E8E0] transition-all">
      {/* 1. Top Announcement Bar - Signature Dusty Rose Clay Theme */}
      {storeSettings.showAnnouncementBar !== false && (
        <div className="bg-[#F8D7DA] text-[#4A3728] border-b border-[#EAD0D3] py-2 px-3 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center">
            <span className="text-[#C5A059] text-xs">♥</span>
            <p className="text-[11px] sm:text-xs font-semibold tracking-wider text-[#4A3728] uppercase">
              <span>{storeSettings.announcementText || 'Handcrafted with love. Every piece tells a story.'}</span>
              {storeSettings.announcementHighlight && (
                <span className="hidden sm:inline">
                  <span className="mx-2 text-[#EAD0D3]">•</span>
                  <span className="font-bold text-[#4A3728]">
                    {storeSettings.announcementHighlight}
                  </span>
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* 2. Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* LEFT: Mobile Menu Button (Mobile) & Desktop Search (Desktop) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#4A3728] hover:bg-[#FAF3EE] transition-colors focus:outline-hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile Search Button */}
            <button
              id="mobile-search-btn"
              onClick={() => setIsSearchModalOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#7D6B5D] hover:text-[#4A3728] hover:bg-[#FAF3EE] transition-colors focus:outline-hidden"
              aria-label="Search Catalog"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Desktop Brand Logo */}
            <div
              id="brand-logo-desktop"
              onClick={() => navigateTo('home')}
              className="hidden lg:flex flex-col cursor-pointer group py-1 select-none pr-4"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] group-hover:scale-125 transition-transform" />
                <span className="font-serif text-2xl font-bold tracking-tight uppercase text-[#4A3728] group-hover:text-[#2E2017] transition-colors">
                  Painite Crafts
                </span>
              </div>
              <span className="text-[9px] font-sans font-semibold tracking-[0.28em] uppercase text-[#8C7A6B] pl-4 -mt-0.5">
                Handmade Clay Studio
              </span>
            </div>
          </div>

          {/* CENTER: Mobile Brand Logo (Centered on Mobile) & Desktop Main Navigation */}
          <div className="flex items-center justify-center">
            {/* Mobile Logo Centered */}
            <div
              id="brand-logo-mobile"
              onClick={() => navigateTo('home')}
              className="lg:hidden flex flex-col items-center cursor-pointer select-none py-1"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span className="font-serif text-lg font-bold tracking-tight uppercase text-[#4A3728]">
                  Painite Crafts
                </span>
              </div>
              <span className="text-[8px] font-sans font-medium tracking-[0.2em] uppercase text-[#8C7A6B] -mt-0.5">
                Artisan Studio
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 xl:gap-8">
              {navItems.map((item) => {
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.view}
                    id={`nav-${item.view}`}
                    onClick={() => navigateTo(item.view)}
                    className={`relative py-1.5 text-xs font-semibold tracking-wider uppercase transition-all ${
                      isActive
                        ? 'text-[#4A3728] font-bold'
                        : 'text-[#7D6B5D] hover:text-[#4A3728]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] rounded-full"
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* RIGHT: Header Actions (Search, Wishlist, Admin, Account, Cart) */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Desktop Search Trigger */}
            <button
              id="desktop-search-btn"
              onClick={() => setIsSearchModalOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-[#7D6B5D] hover:text-[#4A3728] hover:bg-[#FAF3EE] transition-colors border border-transparent hover:border-[#E8DCCF]"
              title="Search Products (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-[#8C7A6B]" />
              <span className="text-[11px]">Search</span>
            </button>

            {/* Admin Portal Badge (Desktop) */}
            <button
              id="admin-dashboard-btn"
              onClick={openAdminPortal}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                currentView === 'admin'
                  ? 'bg-[#4A3728] text-white border-[#4A3728]'
                  : isAdminAuthenticated
                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 shadow-2xs'
                  : 'bg-white text-[#7D6B5D] border-[#E8DCCF] hover:bg-[#FAF3EE] hover:text-[#4A3728]'
              }`}
              title="Studio Admin Portal"
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${isAdminAuthenticated ? 'text-amber-700' : 'text-[#8C7A6B]'}`} />
              <span>{isAdminAuthenticated ? 'Admin Portal' : 'Admin'}</span>
            </button>

            {/* Wishlist Icon (Desktop only, mobile has bottom bar) */}
            <button
              id="wishlist-header-btn"
              onClick={() => navigateTo('wishlist')}
              className={`hidden lg:flex relative p-2 rounded-full text-xs transition-colors ${
                currentView === 'wishlist'
                  ? 'text-[#4A3728] bg-[#FAF3EE]'
                  : 'text-[#7D6B5D] hover:text-[#4A3728] hover:bg-[#FAF3EE]'
              }`}
              aria-label="Wishlist"
              title="Saved Items"
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'fill-[#E8B4B8] text-[#C45E6A]' : 'stroke-[1.8]'}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-[#4A3728] text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account Icon (Desktop only, mobile has bottom bar) */}
            <button
              id="account-header-btn"
              onClick={() => {
                if (user) {
                  navigateTo('account');
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className="hidden lg:flex p-2 rounded-full text-[#7D6B5D] hover:text-[#4A3728] hover:bg-[#FAF3EE] transition-colors"
              aria-label="Account"
              title={user ? `Signed in as ${user.name}` : 'Sign In / Register'}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-5 h-5 rounded-full object-cover border border-[#E8DCCF]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <UserIcon className="w-4 h-4 stroke-[1.8]" />
              )}
            </button>

            {/* Bag / Cart Button */}
            <button
              id="cart-header-btn"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#4A3728] hover:bg-[#32231A] text-white text-xs font-bold transition-all shadow-2xs active:scale-95 shrink-0"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#F8D7DA]" />
              <span className="hidden sm:inline uppercase tracking-wider text-[10px]">Cart</span>
              <span className="min-w-4 h-4 px-1 rounded-full bg-white/20 text-[#FFFDF9] text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Mobile Slide-Down Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden bg-[#FFFDF9] border-b border-[#F2E8E0] overflow-hidden px-4 pt-2 pb-6 shadow-xl"
          >
            <div className="flex flex-col space-y-1">
              <div className="py-2 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.view}
                    onClick={() => navigateTo(item.view)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left text-sm font-semibold transition-all ${
                      currentView === item.view
                        ? 'bg-[#FAF3EE] text-[#4A3728] font-bold border-l-3 border-[#D4AF37]'
                        : 'text-[#6E5357] hover:bg-[#FAF3EE]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                  </button>
                ))}
              </div>

              {/* Mobile Quick Action Strip */}
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigateTo('about')}
                  className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-[#FAF3EE] text-[#4A3728] text-xs font-semibold hover:bg-[#F5EFEB] transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>About Studio</span>
                </button>
                <button
                  onClick={() => navigateTo('faq')}
                  className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-[#FAF3EE] text-[#4A3728] text-xs font-semibold hover:bg-[#F5EFEB] transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-[#D4AF37]" />
                  <span>Care & FAQ</span>
                </button>
              </div>

              {/* Admin Portal Opener in Mobile Menu */}
              <div className="mt-3 pt-3 flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#FDF9F6] border border-[#F2E8E0] text-xs text-[#7D6B5D]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span className="font-medium">
                    {isAdminAuthenticated ? 'Admin Authenticated' : (user ? user.name : 'Studio Administration')}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAdminPortal();
                  }}
                  className="text-[#4A3728] font-bold underline hover:text-[#32231A]"
                >
                  {isAdminAuthenticated ? 'Open Suite' : 'Admin Login'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

