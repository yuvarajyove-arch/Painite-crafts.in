import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronDown, Sparkles, HelpCircle, MessageCircle, ArrowRight, RotateCcw, Video, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FAQSection: React.FC = () => {
  const { faqs, setCurrentView } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIds, setOpenIds] = useState<string[]>(['faq-7', 'faq-1', 'faq-3']);

  const categories = ['All', 'Returns & Refunds', 'Orders', 'Shipping', 'Care & Materials', 'Payments'];

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = faqs.filter((f) => {
    if (activeCategory === 'All') return true;
    return f.category === activeCategory;
  });

  return (
    <div className="py-10 sm:py-16 bg-[#FFFDF9] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D9829B] uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#3D272A]">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-sm text-[#6E5357]">
            Everything you need to know about our handcrafted clay art, durability, care tips, shipping, and official return policy.
          </p>

          {/* Category Filter Tabs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#3D272A] text-white shadow-xs'
                    : 'bg-white text-[#6E5357] border border-[#FCE7EC] hover:bg-[#FCE7EC]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Highlight Banner: Return & Refund Policy Card */}
        <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-50/90 to-rose-50/90 border border-amber-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif-title font-bold text-sm sm:text-base text-[#3D272A]">
                  Mandatory Unboxing Video Policy
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold uppercase">
                  Required for Returns/Refunds
                </span>
              </div>
              <p className="text-xs text-[#6E5357] mt-1 leading-relaxed max-w-xl">
                Continuous unboxing video before opening outer seal is mandatory within 48h for any damaged, defective, or incorrect item claims.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setCurrentView('return-policy');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-5 py-2 rounded-full bg-[#3D272A] text-white text-xs font-semibold hover:bg-[#5C3A42] transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View Full Policy</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-[#FCE7EC] overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-[#FAF7F2]/40 transition-colors"
                >
                  <span className="font-serif-title text-base sm:text-lg font-bold text-[#3D272A]">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#F5EFEB] flex items-center justify-center text-[#B85B75] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#FCE7EC]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#6E5357] leading-relaxed border-t border-[#FAF7F2]"
                    >
                      <p>{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#FFF5F7] border border-[#F9D5DF] text-center space-y-3">
          <h3 className="font-serif-title text-xl font-bold text-[#3D272A]">
            Have more questions about our creations?
          </h3>
          <p className="text-xs sm:text-sm text-[#6E5357] max-w-md mx-auto">
            Our artisan is always happy to guide you on sizing, clay care, or gift packaging.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setCurrentView('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#3D272A] text-white text-xs font-semibold hover:bg-[#5C3A42]"
            >
              <span>Chat with Artisan Desk</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FCE7EC]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
