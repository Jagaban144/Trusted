/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useBooking } from '../context/BookingContext';
import { FilterSidebar } from './FilterSidebar';
import { PropertyCard } from './PropertyCard';
import { InteractiveMap } from './InteractiveMap';
import { List, Map, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export const SearchResultsSection: React.FC = () => {
  const {
    filteredProperties,
    viewMode,
    setViewMode,
    filterState,
    setFilterState,
    searchState,
  } = useBooking();

  return (
    <section id="search-results-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            {searchState.destination ? `Stays in ${searchState.destination}` : 'Top Curated Stays Worldwide'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing <strong className="text-slate-800">{filteredProperties.length}</strong> available properties for {searchState.checkIn} &rarr; {searchState.checkOut}
          </p>
        </div>

        {/* View Mode & Sort Controls */}
        <div className="flex items-center gap-3">
          {/* Dual View Mode Segmented Controls */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'map'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={filterState.sortBy}
              onChange={(e) =>
                setFilterState((prev) => ({ ...prev, sortBy: e.target.value as any }))
              }
              aria-label="Sort properties"
              className="appearance-none bg-white border border-slate-200 hover:border-slate-300 px-3 py-2 pr-8 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer shadow-2xs"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Guest Rating</option>
            </select>
            <ArrowUpDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Grid: Filters on Left + Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3">
          <FilterSidebar />
        </div>

        {/* Right Listings / Map Area */}
        <div className="lg:col-span-8 xl:col-span-9">
          {viewMode === 'map' ? (
            <div className="space-y-6">
              <InteractiveMap properties={filteredProperties} />
              {/* Mini cards below map */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProperties.slice(0, 4).map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProperties.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <SlidersHorizontal className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-800 text-base">No stays matched your criteria</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Try relaxing your price filters, selecting a different destination, or removing star constraints.
                  </p>
                </div>
              ) : (
                filteredProperties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
