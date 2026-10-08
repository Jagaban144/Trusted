/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useBooking } from '../context/BookingContext';
import { PropertyType, Amenity } from '../types';
import { RotateCcw, Star, Check } from 'lucide-react';

const PROPERTY_TYPES: PropertyType[] = ['Hotel', 'Apartment', 'Villa', 'Chalet', 'Guest House'];

const POPULAR_AMENITIES: Amenity[] = [
  'Free Wi-Fi',
  'Swimming Pool',
  'Breakfast Included',
  'Air Conditioning',
  'Airport Shuttle',
  'Spa & Wellness',
  'Fitness Center',
  'Private Balcony',
  'Pet Friendly',
];

export const FilterSidebar: React.FC = () => {
  const { filterState, setFilterState, resetFilters, formatPrice } = useBooking();

  const handleStarToggle = (star: number) => {
    setFilterState((prev) => {
      const exists = prev.starRatings.includes(star);
      return {
        ...prev,
        starRatings: exists ? prev.starRatings.filter((s) => s !== star) : [...prev.starRatings, star],
      };
    });
  };

  const handleTypeToggle = (type: PropertyType) => {
    setFilterState((prev) => {
      const exists = prev.propertyTypes.includes(type);
      return {
        ...prev,
        propertyTypes: exists ? prev.propertyTypes.filter((t) => t !== type) : [...prev.propertyTypes, type],
      };
    });
  };

  const handleAmenityToggle = (amenity: Amenity) => {
    setFilterState((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter((a) => a !== amenity) : [...prev.amenities, amenity],
      };
    });
  };

  return (
    <aside className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-6">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900 text-sm">Filter By</h3>
        <button
          onClick={resetFilters}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset all</span>
        </button>
      </div>

      {/* Free Cancellation Toggle */}
      <div className="space-y-3 pb-4 border-b border-slate-100">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filterState.freeCancellationOnly}
            onChange={(e) =>
              setFilterState((prev) => ({ ...prev, freeCancellationOnly: e.target.checked }))
            }
            className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
          />
          <div>
            <span className="text-sm font-medium text-slate-900 block">Free Cancellation</span>
            <span className="text-xs text-slate-500">Only show stays with risk-free cancellation</span>
          </div>
        </label>

        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filterState.breakfastIncludedOnly}
            onChange={(e) =>
              setFilterState((prev) => ({ ...prev, breakfastIncludedOnly: e.target.checked }))
            }
            className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
          />
          <div>
            <span className="text-sm font-medium text-slate-900 block">Breakfast Included</span>
            <span className="text-xs text-slate-500">Wake up to delicious morning meals</span>
          </div>
        </label>
      </div>

      {/* Price Range Slider */}
      <div className="pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
            Price per Night
          </span>
          <span className="text-xs font-bold text-blue-600">
            Up to {formatPrice(filterState.maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="1200"
          step="25"
          value={filterState.maxPrice}
          onChange={(e) =>
            setFilterState((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
          }
          className="w-full accent-blue-600 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>{formatPrice(100)}</span>
          <span>{formatPrice(1200)}+</span>
        </div>
      </div>

      {/* Star Rating */}
      <div className="pb-4 border-b border-slate-100">
        <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider block mb-3">
          Property Star Rating
        </span>
        <div className="space-y-2">
          {[5, 4, 3].map((star) => {
            const checked = filterState.starRatings.includes(star);
            return (
              <label key={star} className="flex items-center gap-2.5 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleStarToggle(star)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: star }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <span className="text-xs text-slate-600 ml-1 font-medium">{star} Stars</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Property Type */}
      <div className="pb-4 border-b border-slate-100">
        <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider block mb-3">
          Property Type
        </span>
        <div className="space-y-2">
          {PROPERTY_TYPES.map((type) => {
            const checked = filterState.propertyTypes.includes(type);
            return (
              <label key={type} className="flex items-center gap-2.5 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleTypeToggle(type)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-slate-700 text-xs font-medium">{type}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Popular Amenities */}
      <div>
        <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider block mb-3">
          Amenities & Features
        </span>
        <div className="space-y-2">
          {POPULAR_AMENITIES.map((amenity) => {
            const checked = filterState.amenities.includes(amenity);
            return (
              <label key={amenity} className="flex items-center gap-2.5 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-slate-700 text-xs font-medium">{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
