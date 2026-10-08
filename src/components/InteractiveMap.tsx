/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Property } from '../types';
import { useBooking } from '../context/BookingContext';
import { MapPin, Star, X, ArrowRight, Plus, Minus, Compass } from 'lucide-react';

interface InteractiveMapProps {
  properties: Property[];
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ properties }) => {
  const { openPDP, formatPrice } = useBooking();
  const [selectedPin, setSelectedPin] = useState<Property | null>(properties[0] || null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Normalize coordinates for the custom canvas
  // Base center
  const centerLat = 35;
  const centerLng = 20;

  const getPinPosition = (lat: number, lng: number) => {
    // Project simple equirectangular onto 100% width and height
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(10, Math.min(85, y)) };
  };

  return (
    <div className="relative w-full h-[620px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 shadow-md">
      {/* Map Texture & Landmasses SVG */}
      <svg
        className="w-full h-full object-cover transition-transform duration-300"
        style={{ transform: `scale(${zoomLevel})` }}
        viewBox="0 0 1000 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="1000" height="600" fill="#0A192F" />
        {/* Subtle coordinate grid lines */}
        <line x1="0" y1="150" x2="1000" y2="150" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="0" y1="300" x2="1000" y2="300" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="0" y1="450" x2="1000" y2="450" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="250" y1="0" x2="250" y2="600" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="500" y1="0" x2="500" y2="600" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="750" y1="0" x2="750" y2="600" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />

        {/* Continents outlines (Stylized Global Map) */}
        {/* North America */}
        <path
          d="M 120 120 Q 220 100 280 180 T 260 300 Q 180 340 140 260 Z"
          fill="#132B4F"
          stroke="#1E40AF"
          strokeWidth="1.5"
          opacity="0.8"
        />
        {/* South America */}
        <path
          d="M 270 340 Q 340 370 310 470 T 260 550 Q 220 460 250 370 Z"
          fill="#132B4F"
          stroke="#1E40AF"
          strokeWidth="1.5"
          opacity="0.8"
        />
        {/* Europe */}
        <path
          d="M 460 140 Q 550 120 570 190 T 500 240 Q 440 220 450 160 Z"
          fill="#1E3A8A"
          stroke="#3B82F6"
          strokeWidth="1.5"
          opacity="0.9"
        />
        {/* Africa */}
        <path
          d="M 470 260 Q 560 270 540 420 T 470 480 Q 420 370 450 280 Z"
          fill="#132B4F"
          stroke="#1E40AF"
          strokeWidth="1.5"
          opacity="0.8"
        />
        {/* Asia */}
        <path
          d="M 600 130 Q 820 100 860 240 T 780 360 Q 640 300 580 210 Z"
          fill="#132B4F"
          stroke="#1E40AF"
          strokeWidth="1.5"
          opacity="0.85"
        />
        {/* Japan */}
        <path
          d="M 870 210 Q 890 220 880 260 Z"
          fill="#2563EB"
          stroke="#60A5FA"
          strokeWidth="1.5"
          opacity="0.95"
        />
        {/* Indonesia / Australia */}
        <path
          d="M 760 380 Q 820 370 850 400 T 780 440 Z"
          fill="#2563EB"
          stroke="#60A5FA"
          strokeWidth="1.5"
          opacity="0.95"
        />
        <path
          d="M 800 450 Q 900 440 880 540 T 780 530 Z"
          fill="#132B4F"
          stroke="#1E40AF"
          strokeWidth="1.5"
          opacity="0.8"
        />
      </svg>

      {/* Interactive Property Pin Markers with Price Tags */}
      <div className="absolute inset-0 pointer-events-none">
        {properties.map((prop) => {
          const pos = getPinPosition(prop.coordinates.lat, prop.coordinates.lng);
          const isSelected = selectedPin?.id === prop.id;

          return (
            <div
              key={prop.id}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-transform hover:scale-110 z-20"
            >
              <button
                type="button"
                onClick={() => setSelectedPin(prop)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full font-bold text-xs shadow-xl transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white ring-4 ring-blue-300 scale-110'
                    : 'bg-white text-slate-900 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
                <span className="tabular-nums">{formatPrice(prop.startingPricePerNight)}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Map Control Buttons */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-30">
        <button
          onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
          className="w-9 h-9 rounded-lg bg-white/95 text-slate-700 shadow-md flex items-center justify-center hover:bg-white hover:text-blue-600 transition-colors"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
          className="w-9 h-9 rounded-lg bg-white/95 text-slate-700 shadow-md flex items-center justify-center hover:bg-white hover:text-blue-600 transition-colors"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel(1)}
          className="w-9 h-9 rounded-lg bg-white/95 text-slate-700 shadow-md flex items-center justify-center hover:bg-white hover:text-blue-600 transition-colors"
          title="Reset View"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Selected Property Popup Card in Corner */}
      {selectedPin && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-96 bg-white rounded-2xl shadow-2xl p-4 border border-slate-200 z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {selectedPin.city}
              </span>
              <div className="flex items-center text-amber-500">
                {Array.from({ length: selectedPin.starRating }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
            </div>
            <button
              onClick={() => setSelectedPin(null)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-3">
            <img
              src={selectedPin.featuredImage}
              alt={selectedPin.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-900 text-sm truncate">{selectedPin.name}</h4>
              <p className="text-xs text-slate-500 mb-2">{selectedPin.distanceFromCenter}</p>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold text-slate-900 tabular-nums">
                  {formatPrice(selectedPin.startingPricePerNight)} <span className="text-[11px] font-normal text-slate-500">/ night</span>
                </span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                  ★ {selectedPin.reviewScore}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => openPDP(selectedPin.id)}
            className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View Rooms & Rates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
