import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Sparkles, Mail, Lock, User as UserIcon, ArrowRight, Loader2, AlertCircle, Copy, Check, ExternalLink, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, loginWithGoogle } = useStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUnauthorizedDomain, setIsUnauthorizedDomain] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setErrorMessage(null);
    setIsUnauthorizedDomain(false);
    setIsGoogleLoading(false);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    setIsAuthModalOpen(false);
  };

  const copyDomainToClipboard = () => {
    if (currentHostname) {
      navigator.clipboard.writeText(currentHostname);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setErrorMessage(null);
    setIsUnauthorizedDomain(false);
    setIsSubmitting(true);
    try {
      const res = await login(email, password, isSignUp ? name : undefined);
      if (!res.success && res.message) {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsUnauthorizedDomain(false);
    setIsGoogleLoading(true);
    try {
      const res = await loginWithGoogle();
      if (!res.success && res.message) {
        setErrorMessage(res.message);
        if (res.code === 'auth/unauthorized-domain' || res.message.includes('unauthorized-domain')) {
          setIsUnauthorizedDomain(true);
        }
      }
    } catch (err: any) {
      const msg = err?.message || 'Google sign-in could not be completed.';
      setErrorMessage(msg);
      if (err?.code === 'auth/unauthorized-domain' || msg.includes('unauthorized-domain')) {
        setIsUnauthorizedDomain(true);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#4A3728]/40 backdrop-blur-xs"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-white rounded-3xl sm:rounded-[36px] border border-[#F2E8E0] p-6 sm:p-8 shadow-2xl z-10"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 rounded-full text-[#7D6B5D] hover:bg-[#FDF9F6] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-[#F8D7DA]/40 border border-[#EAD0D3] flex items-center justify-center mx-auto mb-3 text-xl">
                🌸
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#4A3728]">
                {isSignUp ? 'Join Painite Crafts' : 'Welcome Back'}
              </h2>
              <p className="text-xs text-[#7D6B5D] mt-1">
                Save your favorite clay pieces, track orders & view studio drops.
              </p>
            </div>

            {/* Error Message Banner / Unauthorized Domain Notice */}
            {isUnauthorizedDomain ? (
              <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-2.5 animate-in fade-in">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <div className="flex-1">
                    <p className="font-bold text-amber-900">Authorize Domain in Firebase Console</p>
                    <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                      Google OAuth requires this web domain to be added to your Firebase project&apos;s authorized list.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-amber-200/80">
                  <span className="font-mono text-[11px] text-[#4A3728] truncate select-all">
                    {currentHostname}
                  </span>
                  <button
                    type="button"
                    onClick={copyDomainToClipboard}
                    className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[10px] transition-colors cursor-pointer"
                  >
                    {copiedDomain ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Domain</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                  <strong>Quick steps:</strong> Firebase Console &rarr; <em>Authentication</em> &rarr; <em>Settings</em> &rarr; <em>Authorized domains</em> &rarr; <em>Add domain</em>.
                </p>
                <div className="pt-1 border-t border-amber-200/60 text-[11px] text-[#4A3728]">
                  💡 <strong>Instant Access:</strong> You can continue below using <strong>Email & Password</strong> right now!
                </div>
              </div>
            ) : errorMessage ? (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <div className="flex-1">{errorMessage}</div>
              </div>
            ) : null}

            {/* Google Fast Sign-In */}
            <button
              id="google-signin-btn"
              type="button"
              disabled={isGoogleLoading || isSubmitting}
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-full border border-[#F2E8E0] bg-[#FDF9F6] hover:bg-[#F8D7DA]/30 text-xs font-bold text-[#4A3728] transition-all mb-4 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-xs"
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#4A3728]" />
                  <span>Connecting with Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#F2E8E0]" />
              </div>
              <span className="relative bg-white px-3 text-[10px] text-[#7D6B5D] uppercase font-bold tracking-wider">
                Or with email
              </span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {isSignUp && (
                <div>
                  <label className="block text-[10px] font-bold text-[#4A3728] uppercase mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-full bg-[#FDF9F6] border border-[#F2E8E0] text-xs text-[#4A3728] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-[#4A3728] uppercase mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-full bg-[#FDF9F6] border border-[#F2E8E0] text-xs text-[#4A3728] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#4A3728] uppercase mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-full bg-[#FDF9F6] border border-[#F2E8E0] text-xs text-[#4A3728] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isGoogleLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#4A3728] text-white text-xs uppercase tracking-wider font-bold hover:bg-[#5D4636] transition-colors mt-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F8D7DA]" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Collector Account' : 'Sign In'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F8D7DA]" />
                  </>
                )}
              </button>
            </form>

            {/* Switch Sign in / Sign up */}
            <div className="mt-4 text-center text-xs text-[#7D6B5D]">
              {isSignUp ? (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      setErrorMessage(null);
                    }}
                    className="font-bold text-[#4A3728] hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p>
                  New to Painite Crafts?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true);
                      setErrorMessage(null);
                    }}
                    className="font-bold text-[#4A3728] hover:underline cursor-pointer"
                  >
                    Create Account
                  </button>
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

