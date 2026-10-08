/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import {
  MapPin,
  Star,
  Heart,
  Share2,
  ChevronLeft,
  CheckCircle2,
  ShieldCheck,
  Coffee,
  Users,
  Maximize2,
  Sparkles,
  Award,
  Building2,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export const PropertyDetailsPage: React.FC = () => {
  const {
    selectedProperty,
    setActiveTab,
    formatPrice,
    wishlistIds,
    toggleWishlist,
    startCheckout,
    openLightbox,
    searchState,
  } = useBooking();

  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    selectedProperty?.rooms[0]?.id || ''
  );
  const [copiedShare, setCopiedShare] = useState(false);

  if (!selectedProperty) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <p className="text-slate-600 mb-4">No property selected.</p>
        <button
          onClick={() => setActiveTab('search')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold"
        >
          Return to Stays
        </button>
      </div>
    );
  }

  const isSaved = wishlistIds.includes(selectedProperty.id);

  // Nights calculation
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

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back to search navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => setActiveTab('search')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Stays</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedShare ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={() => toggleWishlist(selectedProperty.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              isSaved
                ? 'border-red-200 bg-red-50 text-red-600'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-red-500' : ''}`} />
            <span>{isSaved ? 'Saved to Wishlist' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Property Title & Summary Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              {selectedProperty.propertyType}
            </span>
            <span className="text-slate-300">·</span>
            <div className="flex items-center text-amber-500">
              {Array.from({ length: selectedProperty.starRating }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            {selectedProperty.geniusDiscount && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Genius Tier Discount
                </span>
              </>
            )}
          </div>

          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {selectedProperty.name}
          </h1>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 mt-2">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{selectedProperty.address}, {selectedProperty.city}, {selectedProperty.country}</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500">{selectedProperty.distanceFromCenter}</span>
          </div>
        </div>

        {/* Rating Score Card */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 p-3 rounded-2xl shrink-0">
          <div className="text-right">
            <p className="font-bold text-slate-900 text-sm leading-tight">
              {selectedProperty.reviewSummary}
            </p>
            <p className="text-xs text-slate-500">
              {selectedProperty.reviewCount.toLocaleString()} verified reviews
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-xs">
            {selectedProperty.reviewScore}
          </div>
        </div>
      </div>

      {/* Image Gallery Bento Grid with Lightbox trigger */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-10 h-[360px] sm:h-[460px] rounded-2xl overflow-hidden">
        {/* Main large image (2 cols) */}
        <div
          onClick={() => openLightbox(selectedProperty.images, 0)}
          className="md:col-span-2 relative group overflow-hidden bg-slate-900 cursor-pointer h-full"
        >
          <img
            src={selectedProperty.images[0] || selectedProperty.featuredImage}
            alt={selectedProperty.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Click to View Full Photo Gallery</span>
          </div>
        </div>

        {/* 2nd image */}
        <div
          onClick={() => openLightbox(selectedProperty.images, 1)}
          className="hidden md:block relative group overflow-hidden bg-slate-900 cursor-pointer h-full"
        >
          <img
            src={selectedProperty.images[1] || selectedProperty.images[0]}
            alt="Interior view"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* 3rd image with +more overlay */}
        <div
          onClick={() => openLightbox(selectedProperty.images, 2)}
          className="hidden md:block relative group overflow-hidden bg-slate-900 cursor-pointer h-full"
        >
          <img
            src={selectedProperty.images[2] || selectedProperty.images[0]}
            alt="Suite amenities"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center text-white">
            <div className="text-center">
              <span className="block text-2xl font-bold">+28</span>
              <span className="text-xs font-medium uppercase tracking-wider">All Photos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overview & Host Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-8 space-y-6">
          {/* About description */}
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-3">
              About this property
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              {selectedProperty.description}
            </p>
          </div>

          {/* Highlights & Amenities */}
          <div>
            <h3 className="font-semibold text-slate-900 text-sm mb-3">
              Popular property amenities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {selectedProperty.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Reservation Quick Box */}
        <div className="lg:col-span-4">
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 shadow-xs sticky top-24">
            <div className="flex items-baseline justify-between mb-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider block">From</span>
                <span className="text-3xl font-extrabold text-slate-900 font-display tabular-nums">
                  {formatPrice(selectedProperty.startingPricePerNight)}
                </span>
                <span className="text-xs text-slate-500"> / night</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Free Cancellation
                </span>
                <span className="text-[11px] text-slate-400">Zero booking fees</span>
              </div>
            </div>

            <div className="text-xs space-y-2 mb-5">
              <div className="flex justify-between text-slate-600">
                <span>Check-in:</span>
                <strong className="text-slate-900">{searchState.checkIn} (from 15:00)</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Check-out:</span>
                <strong className="text-slate-900">{searchState.checkOut} (until 11:00)</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Duration:</span>
                <strong className="text-slate-900">{nights} {nights === 1 ? 'night' : 'nights'}</strong>
              </div>
            </div>

            <a
              href="#room-selection-section"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center transition-colors shadow-md shadow-blue-600/20"
            >
              Select Your Room Below
            </a>
          </div>
        </div>
      </div>

      {/* Detailed Room Selection Table */}
      <section id="room-selection-section" className="mb-14 scroll-mt-24">
        <div className="mb-5">
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Available Room Types & Rates
          </h2>
          <p className="text-sm text-slate-500">
            All room rates include free high-speed fiber Wi-Fi and complimentary access to spa & wellness facilities.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs bg-white">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-4 px-5">Room Type</th>
                <th className="py-4 px-4">Sleeps</th>
                <th className="py-4 px-4">Inclusions & Policies</th>
                <th className="py-4 px-4">Price for {nights} {nights === 1 ? 'night' : 'nights'}</th>
                <th className="py-4 px-5 text-right">Reservation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {selectedProperty.rooms.map((room) => {
                const isSelected = selectedRoomId === room.id;
                const totalForStay = room.basePricePerNight * nights;

                return (
                  <tr
                    key={room.id}
                    className={`hover:bg-slate-50/60 transition-colors ${
                      isSelected ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    {/* Room Type & Description */}
                    <td className="py-5 px-5 max-w-xs align-top">
                      <p className="font-bold text-sm text-slate-900 mb-1">{room.name}</p>
                      <p className="text-slate-500 text-[11px] mb-2 leading-relaxed">{room.description}</p>
                      <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-slate-600">
                        <span>{room.bedType}</span>
                        <span className="text-slate-300">·</span>
                        <span>{room.sizeSqM} m²</span>
                      </div>
                    </td>

                    {/* Sleeps / Max Occupancy */}
                    <td className="py-5 px-4 align-top whitespace-nowrap">
                      <div className="flex items-center gap-1 text-slate-700 font-medium">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span>Up to {room.maxOccupancy} guests</span>
                      </div>
                    </td>

                    {/* Inclusions & Policies */}
                    <td className="py-5 px-4 align-top space-y-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                        <Coffee className="w-3.5 h-3.5 shrink-0" />
                        <span>{room.mealPlan}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                        <span>{room.cancellationPolicy}</span>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Pay online or at property
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-5 px-4 align-top">
                      <div>
                        {room.originalPricePerNight && (
                          <span className="text-slate-400 line-through text-[11px] block tabular-nums">
                            {formatPrice(room.originalPricePerNight * nights)}
                          </span>
                        )}
                        <span className="text-base font-bold text-slate-900 font-display tabular-nums">
                          {formatPrice(totalForStay)}
                        </span>
                        <span className="text-slate-500 text-[11px] block">
                          ({formatPrice(room.basePricePerNight)} / night)
                        </span>
                        <span className="text-[10px] text-slate-400">Includes taxes & fees</span>
                      </div>
                    </td>

                    {/* Action & Availability */}
                    <td className="py-5 px-5 align-top text-right">
                      {room.availableInventory > 0 ? (
                        <div>
                          <span className="text-[11px] text-blue-600 font-semibold block mb-2">
                            Only {room.availableInventory} rooms left
                          </span>
                          <button
                            type="button"
                            onClick={() => startCheckout(selectedProperty, room)}
                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold rounded-xl text-xs transition-colors shadow-sm whitespace-nowrap cursor-pointer"
                          >
                            Reserve This Room &rarr;
                          </button>
                        </div>
                      ) : (
                        <div className="text-rose-600 text-xs font-semibold">
                          Sold Out
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Verified User Reviews Section with Category Breakdown */}
      <section className="mb-14 pt-8 border-t border-slate-200">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Guest Reviews & Category Scores
          </h2>
          <p className="text-sm text-slate-500">
            100% verified reviews from real guests who completed their stay.
          </p>
        </div>

        {/* Category Breakdown Progress Grid */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700">Cleanliness</span>
                <span className="text-slate-900">{selectedProperty.categoryScores.cleanliness} / 10</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${selectedProperty.categoryScores.cleanliness * 10}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700">Location</span>
                <span className="text-slate-900">{selectedProperty.categoryScores.location} / 10</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${selectedProperty.categoryScores.location * 10}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700">Service & Staff</span>
                <span className="text-slate-900">{selectedProperty.categoryScores.service} / 10</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${selectedProperty.categoryScores.service * 10}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700">Value for Money</span>
                <span className="text-slate-900">{selectedProperty.categoryScores.value} / 10</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${selectedProperty.categoryScores.value * 10}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Individual Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedProperty.reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                    {rev.userName[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{rev.userName}</p>
                    <p className="text-[11px] text-slate-500">
                      {rev.userCountry} · {rev.travelerType}
                    </p>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {rev.rating}
                </div>
              </div>

              <h4 className="font-semibold text-slate-900 text-xs mb-1.5">
                "{rev.title}"
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed mb-3">
                {rev.comment}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2">
                <span>Stayed {rev.stayDate}</span>
                {rev.verified && (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified stay
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
