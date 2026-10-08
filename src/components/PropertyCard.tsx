/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Property } from '../types';
import { useBooking } from '../context/BookingContext';
import { Heart, MapPin, Star, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
  const { openPDP, formatPrice, wishlistIds, toggleWishlist, searchState } = useBooking();

  const isSaved = wishlistIds.includes(property.id);

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

  // Price calculation
  const nightlyPrice = property.startingPricePerNight;
  const originalNightly = property.geniusDiscount
    ? Math.round(nightlyPrice / (1 - property.geniusDiscount / 100))
    : nightlyPrice;

  const totalCalculated = nightlyPrice * nights;
  const originalTotal = originalNightly * nights;

  return (
    <div
      onClick={() => openPDP(property.id)}
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 p-4 sm:p-5 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col sm:flex-row gap-5"
    >
      {/* Property Image Thumbnail */}
      <div className="relative w-full sm:w-64 md:w-72 h-52 sm:h-auto shrink-0 rounded-xl overflow-hidden bg-slate-100">
        <img
          src={property.featuredImage}
          alt={property.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(property.id);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-700 hover:text-red-500 shadow-md transition-colors"
          title={isSaved ? 'Remove from Wishlist' : 'Save to Wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isSaved ? 'fill-red-500 text-red-500' : 'text-slate-600'
            }`}
          />
        </button>

        {/* Genius Member Badge */}
        {property.geniusDiscount && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Genius {property.geniusDiscount}% Off</span>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Stars, Type & Review Score */}
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="font-medium text-blue-600 uppercase tracking-wide text-[11px]">
                  {property.propertyType}
                </span>
                <span aria-hidden="true">·</span>
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: property.starRating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>

              <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                {property.name}
              </h3>
            </div>

            {/* Score Box */}
            <div className="flex items-center gap-2 text-right shrink-0">
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {property.reviewSummary}
                </p>
                <p className="text-[11px] text-slate-500">
                  {property.reviewCount.toLocaleString()} reviews
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                {property.reviewScore}
              </div>
            </div>
          </div>

          {/* Location & Distance */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-800">{property.city}, {property.country}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500">{property.distanceFromCenter}</span>
          </div>

          {/* Tagline */}
          <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
            {property.tagline}
          </p>

          {/* Unboxed Metadata / Key Perks (Zero-Pill Discipline) */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
            {property.amenities.slice(0, 4).map((amenity, idx) => (
              <React.Fragment key={amenity}>
                <span className="text-slate-700 font-medium">{amenity}</span>
                {idx < 3 && <span className="text-slate-300" aria-hidden="true">·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Pricing & CTA Bottom Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Free Cancellation Available</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Includes taxes & charges
            </p>
          </div>

          <div className="text-right">
            <div className="flex items-baseline justify-end gap-2">
              {property.geniusDiscount && (
                <span className="text-xs text-slate-400 line-through tabular-nums">
                  {formatPrice(originalNightly)}
                </span>
              )}
              <span className="text-xl sm:text-2xl font-bold font-display text-slate-900 tabular-nums">
                {formatPrice(nightlyPrice)}
              </span>
              <span className="text-xs text-slate-500">/ night</span>
            </div>

            <p className="text-[11px] text-slate-500 tabular-nums">
              {formatPrice(totalCalculated)} total for {nights} {nights === 1 ? 'night' : 'nights'}
            </p>

            <button
              type="button"
              className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold transition-colors group-hover:bg-blue-600 group-hover:text-white"
            >
              <span>See Availability</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
