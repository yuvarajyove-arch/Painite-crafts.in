import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { SplashScreen } from './components/SplashScreen';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TrustServiceBar } from './components/TrustServiceBar';
import { CategorySection } from './components/CategorySection';
import { FeaturedCollection } from './components/FeaturedCollection';
import { OurStorySection } from './components/OurStorySection';
import { ShopPage } from './components/ShopPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CollectionsPage } from './components/CollectionsPage';
import { WishlistPage } from './components/WishlistPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { FAQSection } from './components/FAQSection';
import { ReturnPolicyPage } from './components/ReturnPolicyPage';
import { AccountPage } from './components/AccountPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmation } from './components/OrderConfirmation';
import { OrderTrackingPage } from './components/OrderTrackingPage';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { StoreOfflinePage } from './components/StoreOfflinePage';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { SearchModal } from './components/SearchModal';
import { Footer } from './components/Footer';
import { AnimatePresence, motion } from 'motion/react';
import { Heart, Sparkles, Check, AlertCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentView,
    toastMessage,
    isStoreActive,
    isAdminAuthenticated,
    storeSettings,
    openAdminPortal
  } = useStore();

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // When store is offline and user is not in admin view or not admin authenticated, show full-page offline screen
  if (!isStoreActive && currentView !== 'admin' && !isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDF9F6] text-[#4A3728]">
        <SplashScreen />
        <StoreOfflinePage />
        <AdminLoginModal />
        
        {/* Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-8 right-8 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#4A3728] text-white text-xs font-semibold shadow-xl border border-[#5D4636]"
            >
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF9F6] text-[#4A3728] selection:bg-[#F8D7DA] selection:text-[#4A3728]">
      {/* Intro Splash Screen */}
      <SplashScreen />

      {/* Store Paused Banner if inactive but admin is previewing */}
      {!isStoreActive && (
        <div className="bg-amber-100/90 text-amber-900 border-b border-amber-300 py-2 px-4 text-xs font-semibold flex items-center justify-between gap-3 sticky top-0 z-50 backdrop-blur-xs">
          <div className="flex items-center gap-2 max-w-4xl">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <p className="truncate sm:whitespace-normal">
              <strong>Admin Preview Notice:</strong> Store is currently marked Offline for customers.
            </p>
          </div>
          <button
            onClick={openAdminPortal}
            className="text-[11px] font-bold underline hover:text-amber-800 shrink-0 text-amber-900"
          >
            Admin Dashboard →
          </button>
        </div>
      )}

      {/* Main Studio Navigation Header */}
      <Header />

      {/* Dynamic Content Views */}
      <main className="flex-1 pb-20 lg:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {currentView === 'home' && (
              <>
                <HeroSection />
                <TrustServiceBar />
                <CategorySection />
                <FeaturedCollection />
                <OurStorySection />
              </>
            )}

            {currentView === 'shop' && <ShopPage />}
            {currentView === 'product-detail' && <ProductDetailPage />}
            {currentView === 'collections' && <ShopPage />}
            {currentView === 'wishlist' && <WishlistPage />}
            {currentView === 'about' && <AboutPage />}
            {currentView === 'contact' && <ContactPage />}
            {currentView === 'faq' && <FAQSection />}
            {currentView === 'return-policy' && <ReturnPolicyPage />}
            {currentView === 'account' && <AccountPage />}
            {currentView === 'checkout' && <CheckoutPage />}
            {currentView === 'order-confirmation' && <OrderConfirmation />}
            {currentView === 'tracking' && <OrderTrackingPage />}
            {currentView === 'admin' && <AdminDashboard />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Studio Footer */}
      <div className="pb-16 lg:pb-0">
        <Footer />
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Global Slide-Out Bag & Modals */}
      <CartDrawer />
      <AuthModal />
      <AdminLoginModal />
      <SearchModal />

      {/* Global Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 lg:bottom-8 right-4 sm:right-8 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#4A3728] text-white text-xs font-semibold shadow-xl border border-[#5D4636]"
          >
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
