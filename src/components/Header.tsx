/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { CURRENCIES, LANGUAGES } from '../constants';
import { CurrencyCode, LanguageCode } from '../types';
import {
  Globe,
  HelpCircle,
  User as UserIcon,
  Heart,
  Calendar,
  Building,
  Terminal,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currency,
    setCurrency,
    language,
    setLanguage,
    user,
    setUser,
    setAuthModalOpen,
    setAuthModalMode,
    setHelpModalOpen,
    wishlistIds,
    bookings,
  } = useBooking();

  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const currencyRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeBookingsCount = bookings.filter((b) => b.status === 'confirmed').length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
      {/* Top utility row complying with Top Bar Contract: 3 zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('search')}
            className="flex items-center gap-2.5 text-left focus:outline-hidden group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-blue-700 transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zm0 9.2L4.5 7.5 12 4l7.5 3.5L12 11.2zM2 17l10 5 10-5-2.2-1.1L12 19.8l-7.8-3.9L2 17zm0-4l10 5 10-5-2.2-1.1L12 15.8l-7.8-3.9L2 13z"/>
              </svg>
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                AeroStay
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Text with subtle hover underline) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('search')}
            className={`transition-colors hover:text-blue-600 whitespace-nowrap ${
              activeTab === 'search' || activeTab === 'pdp' || activeTab === 'checkout'
                ? 'text-blue-600 font-semibold'
                : ''
            }`}
          >
            Stays & Search
          </button>

          <button
            onClick={() => setActiveTab('wishlists')}
            className={`transition-colors hover:text-blue-600 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'wishlists' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            <span>Wishlists</span>
            {wishlistIds.length > 0 && (
              <span className="text-xs bg-slate-100 text-slate-700 rounded-full px-1.5 py-0.2">
                {wishlistIds.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('my-bookings')}
            className={`transition-colors hover:text-blue-600 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'my-bookings' || activeTab === 'confirmation' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            <span>My Bookings</span>
            {activeBookingsCount > 0 && (
              <span className="text-xs bg-blue-50 text-blue-700 font-semibold rounded-full px-1.5 py-0.2">
                {activeBookingsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('host-portal')}
            className={`transition-colors hover:text-blue-600 whitespace-nowrap ${
              activeTab === 'host-portal' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            Host Portal
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`transition-colors hover:text-blue-600 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'architecture' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-blue-600" />
            <span>Architecture Blueprint</span>
          </button>
        </nav>

        {/* Zone 3: Primary Utility Actions & Account */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Currency Selector */}
          <div className="relative" ref={currencyRef}>
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Select Currency"
            >
              <span>{currency}</span>
              <span className="text-slate-400">({CURRENCIES[currency].symbol})</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs">
                <div className="px-3 py-1 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  Select Currency
                </div>
                {Object.values(CURRENCIES).map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCurrency(c.code as CurrencyCode);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      currency === c.code ? 'font-semibold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="font-mono text-slate-500">
                      {c.symbol} {c.code}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Change Language"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-medium uppercase">{language}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs">
                <div className="px-3 py-1 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  Select Language
                </div>
                {Object.values(LANGUAGES).map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code as LanguageCode);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      language === l.code ? 'font-semibold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{l.name}</span>
                    <span className="text-slate-400 uppercase">{l.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Support / Help */}
          <button
            onClick={() => setHelpModalOpen(true)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Help & Customer Support"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* User Account / Sign In Dropdown */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 border border-slate-200 hover:border-slate-300 rounded-full transition-all hover:shadow-xs"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                {user ? user.firstName[0] : 'U'}
              </div>
              <span className="text-xs font-medium text-slate-800 hidden sm:inline">
                {user ? user.firstName : 'Account'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-sm">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 rounded-t-xl">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-slate-900">{user.firstName} {user.lastName}</p>
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Genius Level {user.geniusTier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveTab('my-bookings');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700"
                  >
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>My Bookings & Stays</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('wishlists');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700"
                  >
                    <Heart className="w-4 h-4 text-slate-400" />
                    <span>Saved Wishlists ({wishlistIds.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('host-portal');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700"
                  >
                    <Building className="w-4 h-4 text-slate-400" />
                    <span>Host & Property Management</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('architecture');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700"
                  >
                    <Terminal className="w-4 h-4 text-slate-400" />
                    <span>System Architecture Blueprint</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1 mt-1">
                  <button
                    onClick={() => {
                      setAuthModalMode('login');
                      setAuthModalOpen(true);
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 text-xs"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>Switch Account / Sign In</span>
                  </button>

                  <button
                    onClick={() => {
                      setUser((u) => ({ ...u, geniusTier: u.geniusTier === 2 ? 3 : 2 }));
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-blue-600 text-xs font-medium"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Toggle Genius VIP Tier</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
