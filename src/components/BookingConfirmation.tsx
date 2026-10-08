/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useBooking } from '../context/BookingContext';
import {
  CheckCircle2,
  Calendar,
  Download,
  Printer,
  MapPin,
  Share2,
  ArrowRight,
  ShieldCheck,
  Building,
  User,
  Mail,
  Phone,
} from 'lucide-react';

export const BookingConfirmation: React.FC = () => {
  const { latestBooking, setActiveTab, formatPrice } = useBooking();

  if (!latestBooking) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <p className="text-slate-600 mb-4">No recent booking confirmation found.</p>
        <button
          onClick={() => setActiveTab('search')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold"
        >
          Return to Stays
        </button>
      </div>
    );
  }

  // Generate real RFC-5545 iCalendar .ics file
  const downloadCalendarFile = () => {
    const startDate = latestBooking.checkIn.replace(/-/g, '');
    const endDate = latestBooking.checkOut.replace(/-/g, '');
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AeroStay Global Stays//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${latestBooking.referenceCode}@aerostay.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;VALUE=DATE:${startDate}`,
      `DTEND;VALUE=DATE:${endDate}`,
      `SUMMARY:Stay at ${latestBooking.propertyName} (Ref: ${latestBooking.referenceCode})`,
      `DESCRIPTION:Booking Reference: ${latestBooking.referenceCode}\\nRoom: ${latestBooking.roomName}\\nGuests: ${latestBooking.guests.adults} Adults\\nStatus: Confirmed`,
      `LOCATION:${latestBooking.propertyCity}\\, ${latestBooking.propertyCountry}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `AeroStay-${latestBooking.referenceCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Success Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 mb-8 text-center no-print">
        <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-600/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
          Your Booking is Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          We’ve sent the full booking voucher and receipt to{' '}
          <strong className="text-slate-900">{latestBooking.guestDetails.email}</strong>.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-emerald-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Booking Reference:</span>
          <span className="font-mono font-bold text-slate-900 text-sm tracking-wider">
            {latestBooking.referenceCode}
          </span>
        </div>
      </div>

      {/* Printable Voucher Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8" id="voucher-printable-area">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                A
              </div>
              <span className="font-display font-bold text-lg text-slate-900">AeroStay Stays</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Official Travel Voucher & Receipt</p>
          </div>

          <div className="sm:text-right">
            <span className="text-xs text-slate-500 block">Confirmation Code</span>
            <span className="font-mono text-base font-bold text-blue-600">
              {latestBooking.referenceCode}
            </span>
            <span className="text-[11px] text-slate-400 block">Issued {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Property & Stay Details */}
        <div className="py-6 border-b border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 space-y-3">
            <h2 className="font-display text-xl font-bold text-slate-900">
              {latestBooking.propertyName}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{latestBooking.propertyCity}, {latestBooking.propertyCountry}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-700">
              <p><strong>Reserved Room:</strong> {latestBooking.roomName}</p>
              <p><strong>Guests:</strong> {latestBooking.guests.adults} Adults {latestBooking.guests.children > 0 ? `· ${latestBooking.guests.children} Children` : ''}</p>
              <p><strong>Cancellation Policy:</strong> {latestBooking.cancellationPolicy}</p>
            </div>
          </div>

          <div className="md:col-span-4 bg-slate-50 rounded-xl p-4 text-xs space-y-3 border border-slate-100">
            <div>
              <span className="text-slate-500 block">Check-in Date</span>
              <strong className="text-slate-900 text-sm block">{latestBooking.checkIn}</strong>
              <span className="text-[11px] text-slate-400">From 15:00 onwards</span>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-500 block">Check-out Date</span>
              <strong className="text-slate-900 text-sm block">{latestBooking.checkOut}</strong>
              <span className="text-[11px] text-slate-400">Until 11:00</span>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-500 block">Total Duration</span>
              <strong className="text-slate-900 text-xs">{latestBooking.nights} Nights</strong>
            </div>
          </div>
        </div>

        {/* Guest Information */}
        <div className="py-6 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Lead Guest Information</h3>
            <p className="text-slate-700 font-medium">{latestBooking.guestDetails.firstName} {latestBooking.guestDetails.lastName}</p>
            <p className="text-slate-500">{latestBooking.guestDetails.email}</p>
            <p className="text-slate-500">{latestBooking.guestDetails.phone}</p>
            <p className="text-slate-500">{latestBooking.guestDetails.country}</p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Special Requests</h3>
            <p className="text-slate-600 italic">
              {latestBooking.guestDetails.specialRequests || 'None specified.'}
            </p>
          </div>
        </div>

        {/* Pricing Receipt */}
        <div className="pt-6">
          <div className="flex justify-between items-baseline text-xs mb-2">
            <span className="text-slate-600">Base Accommodation ({latestBooking.nights} nights):</span>
            <span className="font-mono text-slate-900">{formatPrice(latestBooking.baseAmountUSD)}</span>
          </div>

          <div className="flex justify-between items-baseline text-xs mb-2">
            <span className="text-slate-600">Taxes & Service Fees:</span>
            <span className="font-mono text-slate-900">{formatPrice(latestBooking.taxesAndFeesUSD)}</span>
          </div>

          {latestBooking.selectedAddOns?.length > 0 && (
            <div className="flex justify-between items-baseline text-xs mb-2">
              <span className="text-slate-600">Selected Add-ons:</span>
              <span className="font-mono text-slate-900">+{formatPrice(latestBooking.addOnsAmountUSD)}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
            <span className="font-bold text-sm text-slate-900">Total Paid:</span>
            <span className="font-mono text-lg font-bold text-blue-600">
              {formatPrice(latestBooking.totalPriceUSD)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <button
            onClick={downloadCalendarFile}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold transition-colors shadow-2xs"
          >
            <Calendar className="w-4 h-4" />
            <span>Add to Calendar (.ics)</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Voucher</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('my-bookings')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            <span>View in My Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-semibold transition-colors"
          >
            Search More Stays
          </button>
        </div>
      </div>
    </div>
  );
};
