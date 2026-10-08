/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DESTINATIONS } from '../constants';
import { useBooking } from '../context/BookingContext';
import { MapPin, ArrowUpRight } from 'lucide-react';

export const ExploreDestinations: React.FC = () => {
  const { applyDestinationSearch } = useBooking();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
          Explore Trending Global Destinations
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          These popular destinations have a lot to offer. Click to view available properties.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {DESTINATIONS.map((dest) => (
          <div
            key={dest.id}
            onClick={() => applyDestinationSearch(dest.name)}
            className="group relative rounded-2xl overflow-hidden bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer aspect-4/3 flex flex-col justify-end p-5"
          >
            {/* Background Image with Fallback */}
            <img
              src={dest.image}
              alt={dest.name}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Gradient Scrim for WCAG AA readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 text-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {dest.country}
                </span>
                <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </span>
              </div>

              <h3 className="font-display text-xl font-bold text-white mb-1">
                {dest.name}
              </h3>

              <div className="flex items-center justify-between text-xs text-slate-200">
                <span>{dest.propertyCount.toLocaleString()} properties</span>
                <span className="text-[11px] text-blue-200 font-medium">Explore &rarr;</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
