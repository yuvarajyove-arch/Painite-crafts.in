import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Lock, ShieldCheck, UserCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
    loginAdmin,
    adminCredentials
  } = useStore();

  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAdminLoginModalOpen) {
      setAdminId('');
      setPassword('');
      setErrorMessage(null);
    }
  }, [isAdminLoginModalOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = adminId.trim();
    const cleanPass = password.trim();

    if (!cleanEmail) {
      setErrorMessage('Please enter your Admin Email.');
      return;
    }
    if (!cleanPass) {
      setErrorMessage('Please enter your Admin Password.');
      return;
    }

    const res = loginAdmin(cleanEmail, cleanPass);
    if (!res.success) {
      setErrorMessage(res.message);
    } else {
      setPassword('');
      setErrorMessage(null);
    }
  };

  return (
    <AnimatePresence>
      {isAdminLoginModalOpen && (
        <div id="admin-login-modal-overlay" className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAdminLoginModalOpen(false)}
            className="fixed inset-0 bg-[#32231A]/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 10 }}
            className="relative w-full max-w-md bg-white rounded-3xl border border-[#F2E8E0] p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
          >
            {/* Ambient decoration */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#F8D7DA]/40 rounded-full blur-xl pointer-events-none" />

            {/* Close Button */}
            <button
              id="admin-login-close-btn"
              onClick={() => setIsAdminLoginModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#7D6B5D] hover:bg-[#FDF9F6] transition-colors cursor-pointer"
              aria-label="Close Admin Login"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-3 text-amber-700 shadow-xs">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#4A3728]">
                Studio Admin Portal
              </h2>
              <p className="text-xs text-[#7D6B5D] mt-1.5 leading-relaxed">
                Restricted access for Painite Crafts studio administrators.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between gap-2 font-medium"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A3728] uppercase tracking-wider mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7D6B5D]" />
                  <input
                    id="admin-id-input"
                    type="email"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="Enter admin email address"
                    required
                    autoComplete="off"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DCCF] bg-[#FDF9F6] text-sm text-[#4A3728] focus:outline-hidden focus:border-[#C48B9F] focus:ring-2 focus:ring-[#C48B9F]/20 transition-all placeholder:text-[#B8A89A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3728] uppercase tracking-wider mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7D6B5D]" />
                  <input
                    id="admin-password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E8DCCF] bg-[#FDF9F6] text-sm text-[#4A3728] focus:outline-hidden focus:border-[#C48B9F] focus:ring-2 focus:ring-[#C48B9F]/20 transition-all placeholder:text-[#B8A89A]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7D6B5D] hover:text-[#4A3728] p-1 cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="admin-login-submit-btn"
                type="submit"
                className="w-full py-3 rounded-full bg-[#4A3728] hover:bg-[#32231A] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-[0.98] mt-2 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Authorize & Enter Admin Studio</span>
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
