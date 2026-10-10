import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Mail,
  Phone,
  Instagram,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Youtube
} from 'lucide-react';
import { motion } from 'motion/react';

export const ContactPage: React.FC = () => {
  const { showToast, storeSettings } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Question');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitted(true);
    showToast('Message sent! Our artisan team will reply within 24 hours 💌');
  };

  return (
    <div className="py-10 sm:py-16 bg-[#FFFDF9] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D9829B] uppercase tracking-wider mb-2">
            <Mail className="w-3.5 h-3.5" />
            <span>Studio Desk</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#4A3728]">
            Get In Touch
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#7D6B5D]">
            Have a question about a product, shipping, or care tips? We’d love to chat!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details & Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Quick Channels Card */}
            <div className="bg-white rounded-3xl border border-[#FCE7EC] p-6 sm:p-8 shadow-xs space-y-6">
              <h3 className="font-serif text-xl font-bold text-[#4A3728]">
                Studio Direct Channels
              </h3>

              <div className="space-y-3 text-xs">
                <a
                  href={`mailto:${storeSettings.email}`}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FDF9F6] hover:bg-[#F8D7DA]/30 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#F2E8E0] flex items-center justify-center text-[#4A3728] shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div>
                    <span className="text-[#7D6B5D] block font-medium">Email Address</span>
                    <span className="font-bold text-[#4A3728] text-sm break-all">{storeSettings.email}</span>
                  </div>
                </a>

                <a
                  href={storeSettings.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FDF9F6] hover:bg-[#E8F8F0] transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#F2E8E0] flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#7D6B5D] block font-medium">WhatsApp Support</span>
                    <span className="font-bold text-[#4A3728] text-sm">{storeSettings.whatsappNumber}</span>
                  </div>
                </a>

                <a
                  href={storeSettings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FDF9F6] hover:bg-[#F8D7DA]/30 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#F2E8E0] flex items-center justify-center text-[#4A3728] shrink-0 group-hover:scale-105 transition-transform">
                    <Instagram className="w-4 h-4 text-[#D9829B]" />
                  </div>
                  <div>
                    <span className="text-[#7D6B5D] block font-medium">Instagram Studio</span>
                    <span className="font-bold text-[#4A3728] text-sm">{storeSettings.instagramHandle}</span>
                  </div>
                </a>

                <a
                  href={storeSettings.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FDF9F6] hover:bg-[#F8D7DA]/30 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#F2E8E0] flex items-center justify-center text-red-600 shrink-0 group-hover:scale-105 transition-transform">
                    <Youtube className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#7D6B5D] block font-medium">YouTube Channel</span>
                    <span className="font-bold text-[#4A3728] text-sm">{storeSettings.youtubeName}</span>
                  </div>
                </a>
              </div>

              <div className="pt-4 border-t border-[#FAF7F2] space-y-2 text-xs text-[#7D6B5D]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C5A059]" />
                  <span>Studio Hours: Mon - Sat, 10:00 AM - 7:00 PM IST</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D9829B]" />
                  <span>Handcrafted Clay Studio, India 🌸</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#FCE7EC] p-6 sm:p-10 shadow-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FFF5F7] border border-[#F9D5DF] flex items-center justify-center mx-auto text-[#B85B75]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#4A3728]">
                  Thank you for writing to us!
                </h3>
                <p className="text-xs sm:text-sm text-[#7D6B5D] max-w-sm mx-auto leading-relaxed">
                  We have received your message and will get back to you at <strong>{email}</strong> shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#FAF7F2] text-[#4A3728] text-xs font-semibold hover:bg-[#FCE7EC]"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-[#4A3728] mb-2">
                  Send a Note to our Workbench
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#4A3728] uppercase mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maya Patel"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs text-[#4A3728] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A3728] uppercase mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="maya@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs text-[#4A3728] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3728] uppercase mb-1.5">
                    Subject / Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs text-[#4A3728] font-semibold focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="General Question">General Question</option>
                    <option value="Product Sizing & Materials">Product Sizing & Materials</option>
                    <option value="Bulk & Gift Favors">Bulk & Gift Favors</option>
                    <option value="Order Tracking & Shipping">Order Tracking & Shipping</option>
                    <option value="Collaboration / Wholesale">Collaboration / Wholesale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3728] uppercase mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help your clay dreams come true?"
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#F5EFEB] text-xs text-[#4A3728] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-[#4A3728] text-white text-xs font-semibold hover:bg-[#5D4636] transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 text-[#F8D7DA]" />
                  <span>Send Message 💌</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
