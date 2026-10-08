/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import {
  Building,
  TrendingUp,
  Users,
  Bed,
  Plus,
  Edit,
  Save,
  CheckCircle2,
  Calendar,
  DollarSign,
  Layers,
  Sparkles,
} from 'lucide-react';

export const HostPortal: React.FC = () => {
  const { hostProperties, updateRoomInventory, formatPrice, bookings } = useBooking();

  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [newInvValue, setNewInvValue] = useState<number>(0);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const handleStartEdit = (roomId: string, currentInv: number) => {
    setEditingRoomId(roomId);
    setNewInvValue(currentInv);
  };

  const handleSaveInventory = (propertyId: string, roomId: string) => {
    updateRoomInventory(propertyId, roomId, newInvValue);
    setEditingRoomId(null);
    setSaveSuccessMsg(`Room inventory updated to ${newInvValue} available units.`);
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  // Metrics calculation
  const totalListings = hostProperties.length;
  const totalRoomsCount = hostProperties.reduce((acc, p) => acc + p.rooms.length, 0);
  const totalRevenueUSD = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((acc, b) => acc + b.totalPriceUSD, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60 uppercase tracking-wider">
              Host Operations Portal
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            Property & Inventory Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Live inventory distribution, price management, and reservation flow control.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Logged in as:</span>
          <span className="text-xs font-semibold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            Maison de Prestige Group
          </span>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* KPI Stat Cards (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Managed Properties</span>
            <Building className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-display">{totalListings}</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">All active on Global GDS</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Room Categories</span>
            <Bed className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-display">{totalRoomsCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">With live synchronized quotas</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Average Occupancy</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-display">86.4%</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">+4.2% vs previous quarter</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Platform Revenue</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-display tabular-nums">
            {formatPrice(totalRevenueUSD || 1410)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Direct payout via Stripe Connect</p>
        </div>
      </div>

      {/* Room Inventory Management Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs mb-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
          <div>
            <h2 className="font-display font-bold text-lg text-slate-900">
              Live Room Inventory & Allocation Engine
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Row-level concurrency guarantees zero double-booking during flash sales and peak bookings.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
            Transactional Lock Active
          </span>
        </div>

        <div className="space-y-6">
          {hostProperties.map((prop) => (
            <div key={prop.id} className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/40">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-slate-900 text-sm">{prop.name}</span>
                  <span className="text-xs text-slate-400">({prop.city}, {prop.country})</span>
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  Rating: ★ {prop.reviewScore} ({prop.reviewSummary})
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-slate-400 uppercase tracking-wider font-semibold text-[10px] pb-2 border-b border-slate-200">
                      <th className="py-2">Room Category</th>
                      <th className="py-2">Bed & Size</th>
                      <th className="py-2">Base Rate</th>
                      <th className="py-2">Available Quota</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {prop.rooms.map((room) => {
                      const isEditing = editingRoomId === room.id;

                      return (
                        <tr key={room.id} className="hover:bg-white transition-colors">
                          <td className="py-3 font-semibold text-slate-800">
                            {room.name}
                          </td>
                          <td className="py-3 text-slate-500">
                            {room.bedType} · {room.sizeSqM} m²
                          </td>
                          <td className="py-3 font-mono font-bold text-slate-900">
                            {formatPrice(room.basePricePerNight)}
                          </td>
                          <td className="py-3">
                            {isEditing ? (
                              <input
                                type="number"
                                min="0"
                                max="50"
                                value={newInvValue}
                                onChange={(e) => setNewInvValue(Number(e.target.value))}
                                className="w-16 px-2 py-1 text-xs border border-blue-500 rounded bg-white text-slate-900 font-bold"
                              />
                            ) : (
                              <span
                                className={`font-bold px-2 py-0.5 rounded text-xs ${
                                  room.availableInventory > 2
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-amber-50 text-amber-700'
                                }`}
                              >
                                {room.availableInventory} Available
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            {isEditing ? (
                              <button
                                onClick={() => handleSaveInventory(prop.id, room.id)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                              >
                                <Save className="w-3 h-3" />
                                <span>Save</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStartEdit(room.id, room.availableInventory)}
                                className="px-2.5 py-1 border border-slate-200 hover:bg-white text-slate-700 rounded-lg text-xs font-medium inline-flex items-center gap-1 transition-colors"
                              >
                                <Edit className="w-3 h-3" />
                                <span>Adjust Quota</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Host Reservations Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="font-display font-bold text-lg text-slate-900 mb-1">
          Recent Guest Reservations Ledger
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Real-time check-in schedule, guest profiles, and settlement status.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold text-[10px] border-y border-slate-200">
                <th className="py-3 px-3">Reference Code</th>
                <th className="py-3 px-3">Guest Name</th>
                <th className="py-3 px-3">Room Reserved</th>
                <th className="py-3 px-3">Check-in / Out</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 font-mono font-bold text-blue-600">
                    {b.referenceCode}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {b.guestDetails.firstName} {b.guestDetails.lastName}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {b.roomName}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {b.checkIn} &rarr; {b.checkOut} ({b.nights}n)
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    {formatPrice(b.totalPriceUSD)}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
