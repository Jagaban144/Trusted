/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import {
  Search,
  MapPin,
  Calendar as CalendarIcon,
  Users,
  Briefcase,
  Plus,
  Minus,
  Check,
  X,
} from 'lucide-react';

const SUGGESTIONS = [
  { name: 'Paris', country: 'France', type: 'City', landmark: 'Eiffel Tower / Opera' },
  { name: 'Tokyo', country: 'Japan', type: 'City', landmark: 'Ginza / Shinjuku' },
  { name: 'Bali', country: 'Indonesia', type: 'Island', landmark: 'Uluwatu / Seminyak' },
  { name: 'Zermatt & Swiss Alps', country: 'Switzerland', type: 'Alpine Resort', landmark: 'Matterhorn' },
  { name: 'New York', country: 'United States', type: 'City', landmark: 'Chelsea / Manhattan' },
  { name: 'London', country: 'United Kingdom', type: 'City', landmark: 'Mayfair / Soho' },
  { name: 'Rome', country: 'Italy', type: 'City', landmark: 'Colosseum / Trastevere' },
  { name: 'Dubai', country: 'United Arab Emirates', type: 'City', landmark: 'Downtown / Marina' },
];

export const HeroSearchWidget: React.FC = () => {
  const { searchState, setSearchState, setActiveTab } = useBooking();

  const [destinationInput, setDestinationInput] = useState(searchState.destination);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestPopover, setShowGuestPopover] = useState(false);

  const destRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);

  // Close modals on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setShowDestSuggestions(false);
      }
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setShowDatePicker(false);
      }
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) {
        setShowGuestPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSuggestions = SUGGESTIONS.filter((s) => {
    if (!destinationInput.trim()) return true;
    const q = destinationInput.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.country.toLowerCase().includes(q) || s.landmark.toLowerCase().includes(q);
  });

  const handleSelectDestination = (name: string) => {
    setDestinationInput(name);
    setSearchState((prev) => ({ ...prev, destination: name }));
    setShowDestSuggestions(false);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchState((prev) => ({ ...prev, destination: destinationInput }));
    setActiveTab('search');
    // Scroll to results
    const resultsElement = document.getElementById('search-results-section');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calculate nights
  const calculateNights = () => {
    try {
      const d1 = new Date(searchState.checkIn);
      const d2 = new Date(searchState.checkOut);
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return isNaN(diffDays) ? 3 : Math.max(1, diffDays);
    } catch {
      return 3;
    }
  };

  const nights = calculateNights();

  return (
    <div className="relative bg-slate-900 text-white pt-10 pb-16 lg:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A192F] via-[#002244] to-[#0A192F] opacity-95 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Editorial Heading */}
        <div className="max-w-2xl mb-8">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance leading-tight">
            Find your next extraordinary stay across the globe.
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 font-normal">
            Search top-tier hotels, private ocean villas, and alpine chalets with transparent rates and flexible cancellation.
          </p>
        </div>

        {/* Hero Search Box Container */}
        <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-2xl border border-white/20 text-slate-900 relative z-30">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-2.5 items-center">
            {/* Field 1: Destination Auto-complete (4 cols) */}
            <div className="md:col-span-4 relative" ref={destRef}>
              <div
                onClick={() => setShowDestSuggestions(true)}
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-slate-200 hover:border-blue-500 transition-colors cursor-pointer bg-slate-50/50 hover:bg-white"
              >
                <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider cursor-pointer">
                    Where are you going?
                  </label>
                  <input
                    type="text"
                    value={destinationInput}
                    onChange={(e) => {
                      setDestinationInput(e.target.value);
                      setShowDestSuggestions(true);
                    }}
                    onFocus={() => setShowDestSuggestions(true)}
                    placeholder="Search city, resort, or landmark..."
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 placeholder:font-normal truncate"
                  />
                </div>
                {destinationInput && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDestinationInput('');
                    }}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Destination Dropdown */}
              {showDestSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 max-h-72 overflow-y-auto">
                  <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Popular Destinations
                  </div>
                  {filteredSuggestions.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleSelectDestination(item.name)}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-blue-50/60 flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">
                            {item.name}, {item.country}
                          </p>
                          <p className="text-xs text-slate-500">{item.landmark}</p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 font-medium group-hover:text-slate-600">
                        {item.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Field 2: Dates - Dual Calendar Picker (4 cols) */}
            <div className="md:col-span-4 relative" ref={dateRef}>
              <div
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-slate-200 hover:border-blue-500 transition-colors cursor-pointer bg-slate-50/50 hover:bg-white"
              >
                <CalendarIcon className="w-5 h-5 text-blue-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider cursor-pointer">
                    Dates ({nights} {nights === 1 ? 'night' : 'nights'})
                  </label>
                  <div className="text-sm font-semibold text-slate-900 truncate">
                    {searchState.checkIn} &rarr; {searchState.checkOut}
                  </div>
                </div>
              </div>

              {/* Date Range Modal */}
              {showDatePicker && (
                <div className="absolute left-0 md:left-auto md:right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <span className="font-semibold text-sm text-slate-900">Select Travel Dates</span>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {nights} Nights
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Check-in</label>
                      <input
                        type="date"
                        value={searchState.checkIn}
                        onChange={(e) => setSearchState((prev) => ({ ...prev, checkIn: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Check-out</label>
                      <input
                        type="date"
                        value={searchState.checkOut}
                        min={searchState.checkIn}
                        onChange={(e) => setSearchState((prev) => ({ ...prev, checkOut: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date();
                        const tomorrow = new Date(today);
                        tomorrow.setDate(today.getDate() + 2);
                        setSearchState((prev) => ({
                          ...prev,
                          checkIn: today.toISOString().split('T')[0],
                          checkOut: tomorrow.toISOString().split('T')[0],
                        }));
                      }}
                      className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 font-medium text-slate-700"
                    >
                      This Weekend
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const start = new Date();
                        start.setDate(start.getDate() + 7);
                        const end = new Date(start);
                        end.setDate(start.getDate() + 7);
                        setSearchState((prev) => ({
                          ...prev,
                          checkIn: start.toISOString().split('T')[0],
                          checkOut: end.toISOString().split('T')[0],
                        }));
                      }}
                      className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 font-medium text-slate-700"
                    >
                      Next Week (7 nights)
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowDatePicker(false)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

            {/* Field 3: Guests & Rooms Popover (3 cols) */}
            <div className="md:col-span-3 relative" ref={guestRef}>
              <div
                onClick={() => setShowGuestPopover(!showGuestPopover)}
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-slate-200 hover:border-blue-500 transition-colors cursor-pointer bg-slate-50/50 hover:bg-white"
              >
                <Users className="w-5 h-5 text-blue-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider cursor-pointer">
                    Guests & Rooms
                  </label>
                  <div className="text-sm font-semibold text-slate-900 truncate">
                    {searchState.adults} {searchState.adults === 1 ? 'adult' : 'adults'} · {searchState.rooms}{' '}
                    {searchState.rooms === 1 ? 'room' : 'rooms'}
                    {searchState.children > 0 && ` · ${searchState.children} ch`}
                  </div>
                </div>
              </div>

              {/* Guest Counter Popover */}
              {showGuestPopover && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-50 text-slate-900">
                  <div className="space-y-4">
                    {/* Adults */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Adults</p>
                        <p className="text-xs text-slate-500">Ages 18 or above</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={searchState.adults <= 1}
                          onClick={() =>
                            setSearchState((prev) => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))
                          }
                          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-400 disabled:opacity-40"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-semibold text-sm w-4 text-center">{searchState.adults}</span>
                        <button
                          type="button"
                          onClick={() => setSearchState((prev) => ({ ...prev, adults: prev.adults + 1 }))}
                          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-400"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Children</p>
                        <p className="text-xs text-slate-500">Ages 0 to 17</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={searchState.children <= 0}
                          onClick={() =>
                            setSearchState((prev) => ({ ...prev, children: Math.max(0, prev.children - 1) }))
                          }
                          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-400 disabled:opacity-40"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-semibold text-sm w-4 text-center">{searchState.children}</span>
                        <button
                          type="button"
                          onClick={() => setSearchState((prev) => ({ ...prev, children: prev.children + 1 }))}
                          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-400"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Rooms */}
                    <div className="flex items-center justify-between pb-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Rooms</p>
                        <p className="text-xs text-slate-500">Number of rooms</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={searchState.rooms <= 1}
                          onClick={() =>
                            setSearchState((prev) => ({ ...prev, rooms: Math.max(1, prev.rooms - 1) }))
                          }
                          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-400 disabled:opacity-40"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-semibold text-sm w-4 text-center">{searchState.rooms}</span>
                        <button
                          type="button"
                          onClick={() => setSearchState((prev) => ({ ...prev, rooms: prev.rooms + 1 }))}
                          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-400"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowGuestPopover(false)}
                    className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

            {/* Field 4: Search Action Button (1 col) */}
            <div className="md:col-span-1">
              <button
                type="submit"
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                title="Search Stays"
              >
                <Search className="w-5 h-5" />
                <span className="md:hidden ml-2">Search Stays</span>
              </button>
            </div>
          </form>

          {/* Bottom Filter Toggle: "Traveling for work" */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 px-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={searchState.workTrip}
                onChange={(e) => setSearchState((prev) => ({ ...prev, workTrip: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <span className="font-medium text-slate-700 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                I'm traveling for work
              </span>
              <span className="text-slate-400 text-[11px] hidden sm:inline">
                (Filters for workspace desks, fast fiber Wi-Fi & business invoices)
              </span>
            </label>

            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Instant confirmation · Zero booking fees
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
