/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { Booking } from '../types';
import {
  Calendar,
  MapPin,
  FileText,
  XCircle,
  Clock,
  ArrowRight,
  Printer,
  Edit2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const MyBookingsView: React.FC = () => {
  const { bookings, cancelBooking, modifyBookingDates, formatPrice, setActiveTab, openPDP } = useBooking();

  const [modifyingBooking, setModifyingBooking] = useState<Booking | null>(null);
  const [newCheckIn, setNewCheckIn] = useState('');
  const [newCheckOut, setNewCheckOut] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleOpenModify = (booking: Booking) => {
    setModifyingBooking(booking);
    setNewCheckIn(booking.checkIn);
    setNewCheckOut(booking.checkOut);
  };

  const handleSaveDates = (e: React.FormEvent) => {
    e.preventDefault();
    if (modifyingBooking && newCheckIn && newCheckOut) {
      modifyBookingDates(modifyingBooking.id, newCheckIn, newCheckOut);
      setModifyingBooking(null);
      setFeedbackMsg('Dates successfully updated for reservation ' + modifyingBooking.referenceCode);
      setTimeout(() => setFeedbackMsg(''), 4000);
    }
  };

  const handleCancel = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this booking? Room inventory will be restored.')) {
      setCancellingId(id);
      await cancelBooking(id);
      setCancellingId(null);
      setFeedbackMsg('Reservation successfully cancelled and refund initiated.');
      setTimeout(() => setFeedbackMsg(''), 4000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            My Bookings & Stays
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your upcoming stays, change travel dates, download receipts, or cancel.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('search')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors"
        >
          <span>Book Another Stay</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {feedbackMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-800 text-base mb-1">No bookings yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
            Your confirmed trips and reservations will appear here. Explore luxury stays worldwide!
          </p>
          <button
            onClick={() => setActiveTab('search')}
            className="px-5 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:bg-blue-700 transition-colors"
          >
            Find Stays
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {bookings.map((booking) => {
            const isCancelled = booking.status === 'cancelled';

            return (
              <div
                key={booking.id}
                className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all ${
                  isCancelled
                    ? 'border-slate-200 bg-slate-50/70 opacity-75'
                    : 'border-slate-200 shadow-xs hover:border-blue-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      Ref: {booking.referenceCode}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        isCancelled
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {isCancelled ? 'Cancelled' : 'Confirmed'}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400">
                    Booked on {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  {/* Property Thumbnail & Info */}
                  <div className="md:col-span-6 flex gap-4">
                    <img
                      src={booking.propertyImage}
                      alt={booking.propertyName}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h3
                        onClick={() => openPDP(booking.propertyId)}
                        className="font-bold text-slate-900 text-sm sm:text-base hover:text-blue-600 cursor-pointer truncate"
                      >
                        {booking.propertyName}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {booking.propertyCity}, {booking.propertyCountry}
                      </p>
                      <p className="text-xs font-medium text-slate-700 mt-1">{booking.roomName}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Lead Guest: {booking.guestDetails.firstName} {booking.guestDetails.lastName}
                      </p>
                    </div>
                  </div>

                  {/* Dates & Nights */}
                  <div className="md:col-span-3 text-xs space-y-1 text-slate-600 border-l border-slate-100 pl-4">
                    <div>
                      <span className="text-slate-400 block">Check-in:</span>
                      <strong className="text-slate-900">{booking.checkIn}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Check-out:</span>
                      <strong className="text-slate-900">{booking.checkOut}</strong>
                    </div>
                    <p className="text-[11px] text-slate-400 pt-1">
                      {booking.nights} Nights · {booking.guests.adults} Adults
                    </p>
                  </div>

                  {/* Total & Action Controls */}
                  <div className="md:col-span-3 text-right">
                    <span className="text-xs text-slate-500 block">Total Paid:</span>
                    <span className="font-mono text-lg font-bold text-slate-900 block tabular-nums">
                      {formatPrice(booking.totalPriceUSD)}
                    </span>

                    {!isCancelled && (
                      <div className="mt-3 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModify(booking)}
                          className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                          title="Modify Dates"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Modify</span>
                        </button>

                        <button
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="px-2.5 py-1.5 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                          title="Cancel Booking"
                        >
                          <XCircle className="w-3 h-3" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modify Dates Modal */}
      {modifyingBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="font-display font-bold text-lg text-slate-900 mb-1">
              Modify Reservation Dates
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {modifyingBooking.propertyName} (Ref: {modifyingBooking.referenceCode})
            </p>

            <form onSubmit={handleSaveDates} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Check-in Date</label>
                <input
                  type="date"
                  required
                  value={newCheckIn}
                  onChange={(e) => setNewCheckIn(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Check-out Date</label>
                <input
                  type="date"
                  required
                  min={newCheckIn}
                  value={newCheckOut}
                  onChange={(e) => setNewCheckOut(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setModifyingBooking(null)}
                  className="w-1/2 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                >
                  Save New Dates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
