/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { PropertyCard } from './PropertyCard';
import { Heart, Plus, FolderPlus, ArrowRight, Trash2 } from 'lucide-react';

export const WishlistsView: React.FC = () => {
  const {
    properties,
    wishlistIds,
    wishlistCollections,
    createWishlistCollection,
    setActiveTab,
    toggleWishlist,
    formatPrice,
    openPDP,
  } = useBooking();

  const [newCollectionName, setNewCollectionName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedColId, setSelectedColId] = useState<string>('all');

  const savedProperties = properties.filter((p) => wishlistIds.includes(p.id));

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollectionName.trim()) {
      createWishlistCollection(newCollectionName.trim());
      setNewCollectionName('');
      setShowCreateModal(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <span>Saved Wishlists</span>
            <Heart className="w-6 h-6 text-red-500 fill-current" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Keep track of dreamy villas, boutique hotels, and mountain lodges for your upcoming journeys.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Collection</span>
        </button>
      </div>

      {/* Collection Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <button
          onClick={() => setSelectedColId('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            selectedColId === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All Saved ({savedProperties.length})
        </button>

        {wishlistCollections.map((col) => (
          <button
            key={col.id}
            onClick={() => setSelectedColId(col.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedColId === col.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {col.name}
          </button>
        ))}
      </div>

      {savedProperties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-800 text-base mb-1">Your wishlist is empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
            Click the heart icon on any stay to save it to your personalized collections.
          </p>
          <button
            onClick={() => setActiveTab('search')}
            className="px-5 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:bg-blue-700 transition-colors"
          >
            Explore Properties
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProperties.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                <img
                  src={prop.featuredImage}
                  alt={prop.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => toggleWishlist(prop.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-red-500 shadow-md hover:scale-105 transition-transform"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                  ★ {prop.reviewScore} ({prop.reviewSummary})
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
                    {prop.city}, {prop.country}
                  </span>
                  <h3 className="font-display font-bold text-base text-slate-900 mt-0.5 line-clamp-1">
                    {prop.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {prop.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">From</span>
                    <span className="text-base font-bold text-slate-900 font-display tabular-nums">
                      {formatPrice(prop.startingPricePerNight)}
                    </span>
                    <span className="text-slate-400 text-[11px]"> / night</span>
                  </div>

                  <button
                    onClick={() => openPDP(prop.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <span>View Stay</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="font-display font-bold text-lg text-slate-900 mb-1">
              Create New Wishlist Collection
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Group properties together for specific trips or themes.
            </p>

            <form onSubmit={handleCreateCollection} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Collection Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Honeymoon Retreats, Swiss Ski Trip"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-1/2 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
