import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Sparkles,
  Clock,
  Instagram,
  MessageCircle,
  Mail,
  ShieldCheck,
  Heart,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

export const StoreOfflinePage: React.FC = () => {
  const { storeSettings, openAdminPortal, showToast } = useStore();
  const [notifyEmail, setNotifyEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail) return;
    setIsSubscribed(true);
    showToast('We will notify you the moment the studio reopens! ✨');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FDF9F6] text-[#4A3728] relative overflow-hidden selection:bg-[#F8D7DA] selection:text-[#4A3728]">
      {/* Background Decorative Clay Texture Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F8D7DA]/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FCE7EC]/40 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full px-6 py-5 flex items-center justify-between border-b border-[#F2E8E0]/80 bg-[#FFFDF9]/80 backdrop-blur-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#EAD0D3] inline-block animate-pulse" />
          <span className="font-serif text-lg sm:text-xl font-bold tracking-tight uppercase text-[#4A3728]">
            PAINITE CRAFTS
          </span>
        </div>

        {/* Admin Login Trigger */}
        <button
          id="offline-admin-login-btn"
          onClick={openAdminPortal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#E8DCCF] text-[#7D6B5D] hover:bg-[#F8D7DA]/40 hover:text-[#4A3728] transition-all shadow-xs"
          title="Studio Admin Access"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Studio Admin Login</span>
        </button>
      </header>

      {/* Center Main Offline Notice Hero */}
      <main className="relative z-10 flex-1 max-w-3xl mx-auto px-6 py-12 sm:py-20 flex flex-col items-center text-center justify-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F8D7DA] text-[#4A3728] text-xs font-bold uppercase tracking-wider mb-6 border border-[#EAD0D3]"
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span>Studio Offline • Creative Restock</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-serif text-3xl sm:text-5xl font-bold text-[#4A3728] tracking-tight leading-tight mb-4"
        >
          Our Handcraft Studio is Taking a Short Restock Break
        </motion.h1>

        {/* Dynamic Studio Message */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/90 border border-[#F2E8E0] rounded-3xl p-6 sm:p-8 shadow-sm mb-8 max-w-2xl text-left space-y-3 backdrop-blur-xs"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[#C5A059] uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Studio Note from the Artisan</span>
          </div>
          <p className="text-sm sm:text-base text-[#4A3728] leading-relaxed font-medium">
            {storeSettings.storeInactiveMessage ||
              '🌸 Painite Crafts is currently taking a short creative studio break & restock. Order checkout is temporarily paused.'}
          </p>
          <div className="pt-2 border-t border-[#F2E8E0] flex items-center gap-2 text-xs text-[#7D6B5D]">
            <Clock className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
            <span>
              {storeSettings.offlineResumingNotice ||
                'We will be resuming online studio orders very shortly! Follow our craftsmanship on Instagram or WhatsApp us for custom inquiries.'}
            </span>
          </div>
        </motion.div>

        {/* Email Notification Sign-up */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-md mb-8"
        >
          {isSubscribed ? (
            <div className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>You are on our priority reopening list! We will email you.</span>
            </div>
          ) : (
            <form onSubmit={handleNotifySubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-[#7D6B5D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email to get restock alert..."
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-full bg-white border border-[#E8DCCF] text-xs text-[#4A3728] placeholder-[#7D6B5D]/70 focus:outline-hidden focus:border-[#4A3728] shadow-xs"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 rounded-full bg-[#4A3728] hover:bg-[#32231A] text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1 shadow-xs"
              >
                <span>Notify Me</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F8D7DA]" />
              </button>
            </form>
          )}
        </motion.div>

        {/* Social / WhatsApp Connect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3 text-xs"
        >
          {storeSettings.whatsappUrl && (
            <a
              href={storeSettings.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#E7F7ED] hover:bg-[#D3F0DD] text-[#1E7E34] font-bold border border-[#C2E8CE] transition-all shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Inquiry</span>
            </a>
          )}

          {storeSettings.instagramUrl && (
            <a
              href={storeSettings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#FDF9F6] text-[#4A3728] font-bold border border-[#E8DCCF] transition-all shadow-xs"
            >
              <Instagram className="w-4 h-4 text-[#D9829B]" />
              <span>Follow @painitecrafts45</span>
            </a>
          )}
        </motion.div>
      </main>

      {/* Footer Note */}
      <footer className="relative z-10 w-full px-6 py-4 text-center border-t border-[#F2E8E0] bg-[#FFFDF9]/80 text-xs text-[#7D6B5D]">
        <div className="flex items-center justify-center gap-1">
          <span>Handcrafted with</span>
          <Heart className="w-3.5 h-3.5 text-[#D9829B] fill-current" />
          <span>in our home studio • Painite Crafts</span>
        </div>
      </footer>
    </div>
  );
};
