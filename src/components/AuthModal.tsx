/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { X, Mail, Lock, Sparkles, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, authModalMode, setAuthModalMode, setUser } = useBooking();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleLoginOrRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setUser({
        id: 'user-' + Date.now(),
        email: email || 'denzy1212@gmail.com',
        firstName: fullName.split(' ')[0] || 'Denzy',
        lastName: fullName.split(' ')[1] || 'Traveler',
        role: 'guest',
        geniusTier: 2,
        savedProperties: ['prop-paris-grand', 'prop-bali-azure'],
      });
      setAuthModalOpen(false);
    }, 600);
  };

  const handleSendMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMagicLinkSent(true);
      setTimeout(() => {
        setUser({
          id: 'user-' + Date.now(),
          email,
          firstName: 'Denzy',
          lastName: 'Traveler',
          role: 'guest',
          geniusTier: 2,
          savedProperties: ['prop-paris-grand'],
        });
        setMagicLinkSent(false);
        setAuthModalOpen(false);
      }, 1500);
    }, 800);
  };

  const handleSocialLogin = (provider: 'Google' | 'Apple' | 'Facebook') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUser({
        id: `user-${provider.toLowerCase()}-${Date.now()}`,
        email: `traveler.${provider.toLowerCase()}@example.com`,
        firstName: 'Denzy',
        lastName: `(${provider})`,
        role: 'guest',
        geniusTier: 2,
        savedProperties: ['prop-paris-grand', 'prop-bali-azure'],
      });
      setAuthModalOpen(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
        {/* Close button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg mx-auto mb-3 shadow-md shadow-blue-600/20">
            A
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
            {authModalMode === 'login' && 'Sign in to AeroStay'}
            {authModalMode === 'register' && 'Create your AeroStay Account'}
            {authModalMode === 'magic-link' && 'Passwordless Magic Link Sign-In'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Unlock Genius member discounts and seamless travel itinerary syncing.
          </p>
        </div>

        {/* Social OAuth Buttons */}
        <div className="space-y-2.5 mb-5">
          <button
            type="button"
            onClick={() => handleSocialLogin('Google')}
            className="w-full py-2.5 px-4 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-3 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin('Apple')}
            className="w-full py-2.5 px-4 bg-black text-white hover:bg-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-3 transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.64-.78 1.08-1.87.96-2.84-.93.04-2.07.62-2.73 1.4-.58.67-1.09 1.76-.95 2.76 1.04.08 2.09-.54 2.72-1.32"/>
            </svg>
            <span>Continue with Apple</span>
          </button>
        </div>

        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-3 text-[11px] text-slate-400 uppercase font-semibold">
            Or with email
          </span>
        </div>

        {/* Email Forms */}
        {authModalMode === 'magic-link' ? (
          <form onSubmit={handleSendMagicLink} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
              />
            </div>

            {magicLinkSent ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Magic sign-in link verified! Logging you in...</span>
              </div>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
              >
                {loading ? 'Sending link...' : 'Send Magic Link'}
              </button>
            )}

            <button
              type="button"
              onClick={() => setAuthModalMode('login')}
              className="w-full text-center text-xs text-blue-600 hover:underline"
            >
              Back to Password Sign-In
            </button>
          </form>
        ) : (
          <form onSubmit={handleLoginOrRegister} className="space-y-3.5">
            {authModalMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Denzy Traveler"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="denzy1212@gmail.com"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                {authModalMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('magic-link')}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    Use magic link instead?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
            >
              {loading
                ? 'Authenticating...'
                : authModalMode === 'login'
                ? 'Sign In to Account'
                : 'Create Account'}
            </button>

            <div className="text-center pt-2">
              {authModalMode === 'login' ? (
                <p className="text-xs text-slate-500">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('register')}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Register free
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('login')}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
