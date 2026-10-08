/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useBooking } from '../context/BookingContext';
import {
  Search,
  Heart,
  Calendar,
  User,
  ShieldCheck,
  Building,
  Terminal,
  Globe,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { activeTab, setActiveTab, wishlistIds, bookings, setAuthModalOpen } = useBooking();

  const activeBookingsCount = bookings.filter((b) => b.status === 'confirmed').length;

  return (
    <>
      {/* Desktop / Global Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs py-12 pb-24 md:pb-12 mt-16 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            {/* Brand column */}
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  A
                </div>
                <span className="font-display font-bold text-xl text-white">AeroStay</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                Next-generation global travel booking and property management platform. Transparent rates, flexible cancellation, and verified guest reviews.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>PCI-DSS Level 1 & SOC 2 Type II Certified</span>
              </div>
            </div>

            {/* Destinations */}
            <div>
              <p className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
                Top Destinations
              </p>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => setActiveTab('search')} className="hover:text-white transition-colors">Paris, France</button></li>
                <li><button onClick={() => setActiveTab('search')} className="hover:text-white transition-colors">Tokyo, Japan</button></li>
                <li><button onClick={() => setActiveTab('search')} className="hover:text-white transition-colors">Bali, Indonesia</button></li>
                <li><button onClick={() => setActiveTab('search')} className="hover:text-white transition-colors">Swiss Alps</button></li>
                <li><button onClick={() => setActiveTab('search')} className="hover:text-white transition-colors">New York, USA</button></li>
              </ul>
            </div>

            {/* Property Types */}
            <div>
              <p className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
                Discover Stays
              </p>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => setActiveTab('search')} className="hover:text-white transition-colors">Boutique Luxury Hotels</button></li>
                <li><button onClick={() => setActiveTab('search')} className="hover:text-white transition-colors">Private Oceanfront Villas</button></li>
                <li><button onClick={() => setActiveTab('search')} className="hover:text-white transition-colors">Ski-in Alpine Chalets</button></li>
                <li><button onClick={() => setActiveTab('search')} className="hover:text-white transition-colors">Urban Studio Lofts</button></li>
                <li><button onClick={() => setActiveTab('wishlists')} className="hover:text-white transition-colors">Curated Wishlists</button></li>
              </ul>
            </div>

            {/* Platform & Engineering */}
            <div>
              <p className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
                Platform & Host
              </p>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => setActiveTab('host-portal')} className="hover:text-white transition-colors">Host Operations Portal</button></li>
                <li><button onClick={() => setActiveTab('architecture')} className="hover:text-white transition-colors text-blue-400 font-semibold">Architecture Blueprint</button></li>
                <li><button onClick={() => setActiveTab('my-bookings')} className="hover:text-white transition-colors">Self-Service Bookings</button></li>
                <li><button onClick={() => setAuthModalOpen(true)} className="hover:text-white transition-colors">Genius VIP Loyalty</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-4">
            <p>© 2026 AeroStay Global Hospitality Platform. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Cookie Preferences</span>
              <span>Security Whitepaper</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky Bottom Navigation Bar for Mobile (< 15% mobile viewport height) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-3 shadow-lg flex items-center justify-around no-print">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'search' || activeTab === 'pdp' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlists')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors relative ${
            activeTab === 'wishlists' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span>Saved</span>
          {wishlistIds.length > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-blue-600" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('my-bookings')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors relative ${
            activeTab === 'my-bookings' || activeTab === 'confirmation' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Stays</span>
          {activeBookingsCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-blue-600" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('host-portal')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'host-portal' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building className="w-5 h-5" />
          <span>Host</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'architecture' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Terminal className="w-5 h-5" />
          <span>Blueprint</span>
        </button>
      </nav>
    </>
  );
};
