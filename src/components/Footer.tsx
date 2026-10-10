import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Sparkles,
  Heart,
  Instagram,
  Mail,
  Send,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle,
  Lock,
  Youtube
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setSelectedCategorySlug, showToast, storeSettings, freeShippingThreshold, openAdminPortal } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    showToast('Welcome to the Clay Club! Use code CLAYLOVE10 for 10% off ♥');
  };

  const navigateTo = (view: any, category?: string) => {
    if (category) {
      setSelectedCategorySlug(category);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white text-[#7D6B5D] pt-14 pb-20 sm:pb-12 border-t border-[#F2E8E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Studio Trust Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-10 mb-10 border-b border-[#F2E8E0] text-xs">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FDF9F6] border border-[#F2E8E0]">
            <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
            <div>
              <span className="font-bold text-[#4A3728] block">Artisan Quality</span>
              <span className="text-[#7D6B5D] text-[11px]">Premium non-toxic clay</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FDF9F6] border border-[#F2E8E0]">
            <Truck className="w-4 h-4 text-[#4A3728] shrink-0" />
            <div>
              <span className="font-bold text-[#4A3728] block">Free Shipping</span>
              <span className="text-[#7D6B5D] text-[11px]">On orders over ₹{freeShippingThreshold}</span>
            </div>
          </div>
          <div
            onClick={() => navigateTo('return-policy')}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FDF9F6] border border-[#F2E8E0] hover:border-[#C5A059] transition-colors cursor-pointer"
            role="button"
            tabIndex={0}
          >
            <RotateCcw className="w-4 h-4 text-[#C5A059] shrink-0" />
            <div>
              <span className="font-bold text-[#4A3728] block">Safe Arrival Guarantee</span>
              <span className="text-[#7D6B5D] text-[11px]">48h Return/Refund Policy</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FDF9F6] border border-[#F2E8E0]">
            <Lock className="w-4 h-4 text-[#4A3728] shrink-0" />
            <div>
              <span className="font-bold text-[#4A3728] block">Secure Payments</span>
              <span className="text-[#7D6B5D] text-[11px]">UPI, Cards & Net Banking</span>
            </div>
          </div>
        </div>

        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-[#F2E8E0]">
          {/* Brand & Mission Column */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#4A3728] uppercase">
                PAINITE CRAFTS
              </span>
              <span className="text-[9px] tracking-[0.25em] text-[#C5A059] uppercase font-bold">
                Handmade Clay Crafts & Keepsakes
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#7D6B5D] leading-relaxed max-w-sm">
              “Handcrafted with love. Every piece tells a story.” Cute, creative clay art, carefully handmade to bring a little more joy to your everyday.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A3728] block mb-1">
                Let's stay in touch!
              </span>
              <span className="text-xs text-[#7D6B5D] block mb-2">
                Be the first to know about new releases, exclusive offers and studio updates.
              </span>
              {subscribed ? (
                <div className="p-3 rounded-2xl bg-[#F8D7DA]/40 border border-[#EAD0D3] text-xs text-[#4A3728]">
                  ♥ Welcome! Use code <strong className="font-mono font-bold">CLAYLOVE10</strong> at checkout for 10% off.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-full bg-[#FDF9F6] border border-[#F2E8E0] text-xs text-[#4A3728] placeholder:text-[#7D6B5D]/60 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#4A3728] text-white text-xs font-semibold hover:bg-[#5D4636] transition-colors"
                  >
                    Subscribe ♥
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Links Column 1: Shop */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#4A3728] uppercase tracking-wider">
              Shop Crafts
            </h4>
            <ul className="space-y-2 text-xs text-[#7D6B5D]">
              <li>
                <button onClick={() => navigateTo('shop', 'Keychains')} className="hover:text-[#4A3728] transition-colors">
                  Clay Keychains
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop', 'Charms')} className="hover:text-[#4A3728] transition-colors">
                  Phone & Bag Charms
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop', 'Mini Figures')} className="hover:text-[#4A3728] transition-colors">
                  Mini Figures & Buddies
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop', 'Magnets')} className="hover:text-[#4A3728] transition-colors">
                  Fridge Magnets
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop')} className="hover:text-[#4A3728] transition-colors">
                  Browse All Shop
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links Column 2: Studio & Support */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#4A3728] uppercase tracking-wider">
              Help & Support
            </h4>
            <ul className="space-y-2 text-xs text-[#7D6B5D]">
              <li>
                <button onClick={() => navigateTo('tracking')} className="hover:text-[#4A3728] transition-colors cursor-pointer">
                  Track Live Order
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('faq')} className="hover:text-[#4A3728] transition-colors cursor-pointer">
                  FAQ & Shipping
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('return-policy')} className="hover:text-[#4A3728] transition-colors font-medium text-[#4A3728] underline underline-offset-2 decoration-[#D9829B] cursor-pointer">
                  Return & Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-[#4A3728] transition-colors cursor-pointer">
                  About Our Studio
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-[#4A3728] transition-colors cursor-pointer">
                  Customer Care
                </button>
              </li>
              <li>
                <button
                  id="footer-admin-portal-link"
                  onClick={openAdminPortal}
                  className="text-amber-800 hover:text-amber-950 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links Column 3: Direct Studio Contact & Socials */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#4A3728] uppercase tracking-wider">
              Studio Direct
            </h4>
            <ul className="space-y-2 text-xs text-[#7D6B5D]">
              <li>
                <a
                  href={`mailto:${storeSettings.email}`}
                  className="hover:text-[#4A3728] transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{storeSettings.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={storeSettings.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#4A3728] transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp: {storeSettings.whatsappNumber}</span>
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A3728] block mb-2">
                Follow Our Studio
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href={storeSettings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-[#FDF9F6] border border-[#F2E8E0] flex items-center justify-center text-[#4A3728] hover:bg-[#F8D7DA]/40 transition-colors"
                  title={`Instagram ${storeSettings.instagramHandle}`}
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={storeSettings.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-[#FDF9F6] border border-[#F2E8E0] flex items-center justify-center text-[#4A3728] hover:bg-[#F8D7DA]/40 transition-colors"
                  title={`YouTube ${storeSettings.youtubeName}`}
                >
                  <Youtube className="w-4 h-4 text-red-600" />
                </a>
                <a
                  href={storeSettings.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-[#FDF9F6] border border-[#F2E8E0] flex items-center justify-center text-[#4A3728] hover:bg-[#F8D7DA]/40 transition-colors"
                  title="WhatsApp Chat"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                </a>
                <a
                  href={`mailto:${storeSettings.email}`}
                  className="w-8 h-8 rounded-full bg-[#FDF9F6] border border-[#F2E8E0] flex items-center justify-center text-[#4A3728] hover:bg-[#F8D7DA]/40 transition-colors"
                  title={`Email ${storeSettings.email}`}
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7D6B5D] gap-3">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <p>© {new Date().getFullYear()} PAINITE CRAFTS. All rights reserved.</p>
            <span>•</span>
            <button
              onClick={() => navigateTo('return-policy')}
              className="hover:text-[#4A3728] underline underline-offset-2 cursor-pointer transition-colors"
            >
              Return & Refund Policy
            </button>
          </div>
          <div className="font-serif italic text-sm text-[#4A3728]">
            “Handcrafted with love. Every piece tells a story.”
          </div>
        </div>
      </div>
    </footer>
  );
};

