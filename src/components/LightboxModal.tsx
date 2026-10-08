/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export const LightboxModal: React.FC = () => {
  const {
    lightboxOpen,
    setLightboxOpen,
    lightboxImages,
    lightboxIndex,
    setLightboxIndex,
  } = useBooking();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length);
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((lightboxIndex + 1) % lightboxImages.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, lightboxIndex, lightboxImages]);

  if (!lightboxOpen || lightboxImages.length === 0) return null;

  const currentImage = lightboxImages[lightboxIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Top Bar with counter & close */}
      <div className="flex items-center justify-between text-white z-10">
        <span className="text-xs font-mono font-medium text-slate-300">
          Photo {lightboxIndex + 1} of {lightboxImages.length}
        </span>

        <button
          onClick={() => setLightboxOpen(false)}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        <img
          src={currentImage}
          alt={`Gallery view ${lightboxIndex + 1}`}
          referrerPolicy="no-referrer"
          className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl shadow-2xl transition-all"
        />

        {/* Prev / Next controls */}
        {lightboxImages.length > 1 && (
          <>
            <button
              onClick={() =>
                setLightboxIndex((lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length)
              }
              className="absolute left-4 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors shadow-lg"
              title="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() =>
                setLightboxIndex((lightboxIndex + 1) % lightboxImages.length)
              }
              className="absolute right-4 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors shadow-lg"
              title="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      <div className="flex justify-center gap-2 overflow-x-auto py-2">
        {lightboxImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setLightboxIndex(idx)}
            className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
              idx === lightboxIndex ? 'border-blue-500 scale-105' : 'border-transparent opacity-50 hover:opacity-100'
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
