import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Star, Flower2 } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onFinish, 600);
    }, 2400);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const handleSkip = () => {
    setVisible(false);
    setTimeout(onFinish, 400);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFF5F7] overflow-hidden select-none cursor-pointer"
          onClick={handleSkip}
        >
          {/* Subtle Ambient Clay Color Blobs */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#FCE7EC] rounded-full blur-3xl opacity-70" />
          <div className="absolute -bottom-20 -right-20 w-88 h-88 bg-[#F9D5DF] rounded-full blur-3xl opacity-60" />
          <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-[#FAF7F2] rounded-full blur-2xl opacity-80" />

          {/* Floating Miniature Clay Charms */}
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.6, rotate: -15 }}
            animate={{ y: 0, opacity: 0.9, scale: 1, rotate: 10 }}
            transition={{ duration: 1.2, delay: 0.1, ease: 'easeOut' }}
            className="absolute top-[18%] left-[15%] flex items-center justify-center w-14 h-14 rounded-full bg-white/80 shadow-md backdrop-blur-xs text-[#D9829B]"
          >
            <Heart className="w-7 h-7 fill-[#FCE7EC] stroke-[#D9829B] stroke-[1.5]" />
          </motion.div>

          <motion.div
            initial={{ y: -50, opacity: 0, scale: 0.5, rotate: 20 }}
            animate={{ y: 0, opacity: 0.9, scale: 1, rotate: -8 }}
            transition={{ duration: 1.1, delay: 0.25, ease: 'easeOut' }}
            className="absolute top-[22%] right-[16%] flex items-center justify-center w-12 h-12 rounded-full bg-white/80 shadow-md backdrop-blur-xs text-[#D4A373]"
          >
            <Flower2 className="w-6 h-6 fill-[#FAF7F2] stroke-[#D4A373] stroke-[1.5]" />
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.6, rotate: -25 }}
            animate={{ y: 0, opacity: 0.9, scale: 1, rotate: 15 }}
            transition={{ duration: 1.3, delay: 0.35, ease: 'easeOut' }}
            className="absolute bottom-[22%] left-[18%] flex items-center justify-center w-12 h-12 rounded-full bg-white/80 shadow-md backdrop-blur-xs text-[#D9829B]"
          >
            <Star className="w-6 h-6 fill-[#FCE7EC] stroke-[#D9829B] stroke-[1.5]" />
          </motion.div>

          <motion.div
            initial={{ y: 70, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 0.85, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
            className="absolute bottom-[20%] right-[18%] flex items-center justify-center w-14 h-14 rounded-full bg-white/80 shadow-md backdrop-blur-xs text-[#B85B75]"
          >
            <span className="text-xl">🌸</span>
          </motion.div>

          {/* Central Logo & Brand Reveal */}
          <div className="relative z-10 flex flex-col items-center text-center px-6">
            {/* Cute Handcrafted Clay Character Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 14, stiffness: 120, delay: 0.2 }}
              className="relative mb-6"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-[#FFFDF9] to-[#FCE7EC] p-1 shadow-lg shadow-[#F4B8C8]/30 flex items-center justify-center border-2 border-[#F9D5DF]">
                <div className="relative flex flex-col items-center justify-center">
                  <span className="text-4xl sm:text-5xl animate-pulse-gentle">🧸</span>
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    className="absolute -top-2 -right-2 text-base"
                  >
                    ✨
                  </motion.div>
                </div>
              </div>

              {/* Pulsing Little Heart */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 1.8, delay: 0.8 }}
                className="absolute -bottom-2 -right-1 w-8 h-8 rounded-full bg-[#D9829B] text-white flex items-center justify-center shadow-md border-2 border-white text-xs font-bold"
              >
                ♥
              </motion.div>
            </motion.div>

            {/* Sparkle Icon */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex items-center gap-1.5 text-[#D9829B] mb-2 text-xs font-semibold tracking-widest uppercase"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handcrafted Clay Studio</span>
              <Sparkles className="w-3.5 h-3.5" />
            </motion.div>

            {/* Logo Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#4A3728]"
            >
              PAINITE CRAFTS
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-3 text-sm sm:text-base text-[#6E5357] font-light max-w-sm italic font-serif"
            >
              “Handcrafted with love. Every piece tells a story.”
            </motion.p>

            {/* Loading Indicator Dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-8 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-[#D9829B] animate-ping" />
              <span className="w-2 h-2 rounded-full bg-[#D4A373]" />
              <span className="w-2 h-2 rounded-full bg-[#F4B8C8]" />
            </motion.div>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1.2 }}
              className="mt-4 text-xs text-[#6E5357] cursor-pointer hover:underline"
            >
              Tap anywhere to enter studio
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
