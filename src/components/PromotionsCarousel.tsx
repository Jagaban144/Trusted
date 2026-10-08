/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { PROMOTIONAL_OFFERS } from '../constants';
import { useBooking } from '../context/BookingContext';
import { ChevronLeft, ChevronRight, Tag, ArrowRight, Sparkles } from 'lucide-react';

export const PromotionsCarousel: React.FC = () => {
  const { applyDestinationSearch } = useBooking();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>Special Offers & Promotions</span>
            <Sparkles className="w-5 h-5 text-blue-600" />
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Promotions, deals, and exclusive member savings on premier properties.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full border border-slate-200 hover:border-slate-400 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            aria-label="Previous offers"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full border border-slate-200 hover:border-slate-400 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            aria-label="Next offers"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-3 scrollbar-none snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {PROMOTIONAL_OFFERS.map((promo) => (
          <div
            key={promo.id}
            className={`min-w-[300px] sm:min-w-[340px] max-w-[360px] snap-start rounded-2xl bg-gradient-to-br ${promo.bgGradient} text-white p-6 shadow-md flex flex-col justify-between shrink-0 relative overflow-hidden`}
          >
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white">
                  {promo.badge}
                </span>
                <span className="text-xs text-blue-100/90 font-mono">
                  Code: <strong className="text-white">{promo.code}</strong>
                </span>
              </div>

              <h3 className="font-display text-lg font-bold text-white mb-2 leading-snug">
                {promo.title}
              </h3>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                {promo.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between">
              <span className="text-[11px] text-blue-100/80">Valid until {promo.validUntil}</span>
              <button
                onClick={() => applyDestinationSearch('')}
                className="text-xs font-semibold text-white hover:text-blue-100 flex items-center gap-1 transition-colors group"
              >
                <span>Browse Deals</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
