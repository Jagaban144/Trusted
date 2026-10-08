/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { ADD_ONS } from '../constants';
import {
  ChevronLeft,
  ShieldCheck,
  CreditCard,
  Lock,
  Building,
  User,
  CheckCircle2,
  Calendar,
  Sparkles,
  Plane,
  Clock,
  Coffee,
  Check,
} from 'lucide-react';

export const CheckoutFlow: React.FC = () => {
  const {
    selectedProperty,
    selectedRoom,
    checkoutStep,
    setCheckoutStep,
    selectedAddOns,
    toggleAddOn,
    completeBooking,
    formatPrice,
    convertPrice,
    currency,
    searchState,
    setActiveTab,
  } = useBooking();

  // Form State
  const [formData, setFormData] = useState({
    firstName: 'Denzy',
    lastName: 'Traveler',
    email: 'denzy1212@gmail.com',
    phone: '+1 555-019-2834',
    country: 'United States',
    specialRequests: 'Quiet room on high floor with balcony view preferred.',
    isBusinessTrip: searchState.workTrip,
    companyName: '',
    taxId: '',
  });

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'paypal' | 'local_bank'>('credit_card');
  const [cardData, setCardData] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardholderName: 'Denzy Traveler',
    expiry: '12/28',
    cvc: '382',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!selectedProperty || !selectedRoom) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <p className="text-slate-600 mb-4">No room selected for checkout.</p>
        <button
          onClick={() => setActiveTab('search')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold"
        >
          Return to Stays
        </button>
      </div>
    );
  }

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

  const basePriceUSD = selectedRoom.basePricePerNight * nights;
  const taxesUSD = Math.round(basePriceUSD * 0.12);
  const addOnsUSD = selectedAddOns.reduce((acc, curr) => acc + curr.priceUSD, 0);
  const totalUSD = basePriceUSD + taxesUSD + addOnsUSD;

  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await completeBooking(formData, {
        paymentMethod,
        cardholderName: cardData.cardholderName,
        currency,
        transactionId: `TX-${Date.now().toString(36).toUpperCase()}`,
        paidAt: new Date().toISOString(),
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment processing failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Breadcrumb & Step Progress */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <button
          onClick={() => (checkoutStep === 1 ? setActiveTab('pdp') : setCheckoutStep((s) => (s - 1) as any))}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{checkoutStep === 1 ? 'Back to Property' : 'Previous Step'}</span>
        </button>

        {/* Step Indicator Tabs */}
        <div className="flex items-center gap-2 sm:gap-6 text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${checkoutStep >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${checkoutStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              1
            </span>
            <span className="hidden sm:inline">Guest Details</span>
          </div>

          <span className="text-slate-300">&rarr;</span>

          <div className={`flex items-center gap-1.5 ${checkoutStep >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${checkoutStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              2
            </span>
            <span className="hidden sm:inline">Add-ons</span>
          </div>

          <span className="text-slate-300">&rarr;</span>

          <div className={`flex items-center gap-1.5 ${checkoutStep >= 3 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${checkoutStep >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              3
            </span>
            <span className="hidden sm:inline">Payment</span>
          </div>
        </div>

        <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
          <Lock className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">256-Bit SSL Encrypted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Area (7 cols) */}
        <div className="lg:col-span-7">
          {/* STEP 1: Guest Details */}
          {checkoutStep === 1 && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900">
                  Step 1: Primary Guest Details
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  We will send your instant booking confirmation and voucher to this email address.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Country of Residence */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Country / Region of Residence
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Business Trip Toggle */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isBusinessTrip}
                    onChange={(e) => setFormData({ ...formData, isBusinessTrip: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-slate-800">
                    I am booking for work / business travel
                  </span>
                </label>

                {formData.isBusinessTrip && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 pl-6">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Company Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Acme Corp"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tax / VAT ID (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. US-9823412"
                        value={formData.taxId}
                        onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Special Requests */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Special Requests (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  placeholder="Quiet room, feather-free pillows, late arrival estimate..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-none resize-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Special requests cannot be guaranteed, but the property will do its best to meet your needs.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCheckoutStep(2)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md shadow-blue-600/20"
              >
                Continue to Step 2: Travel Add-ons &rarr;
              </button>
            </div>
          )}

          {/* STEP 2: Add-ons */}
          {checkoutStep === 2 && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900">
                  Step 2: Enhance Your Stay with Add-ons
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select optional convenience upgrades to customize your arrival and stay.
                </p>
              </div>

              <div className="space-y-3">
                {ADD_ONS.map((addon) => {
                  const isChecked = selectedAddOns.some((a) => a.id === addon.id);

                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddOn(addon)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                        isChecked
                          ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-md mt-0.5 border flex items-center justify-center transition-colors ${
                            isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-3" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{addon.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{addon.description}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-slate-900 tabular-nums">
                          +{formatPrice(addon.priceUSD)}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {addon.perStayOrNight === 'per_stay' ? 'per stay' : 'per night'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCheckoutStep(1)}
                  className="w-1/3 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutStep(3)}
                  className="w-2/3 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md shadow-blue-600/20"
                >
                  Continue to Step 3: Payment &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Integrated Payment Gateway */}
          {checkoutStep === 3 && (
            <form onSubmit={handleSubmitFinal} className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900">
                  Step 3: Secure Payment Gateway
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Multi-currency checkout with zero conversion surcharge.
                </p>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'credit_card'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-semibold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                  <span className="text-xs block">Credit / Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-semibold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold text-sm text-blue-700 block mb-0.5">PayPal</span>
                  <span className="text-xs block">Instant Checkout</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('local_bank')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'local_bank'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-semibold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building className="w-5 h-5 mx-auto mb-1 text-slate-600" />
                  <span className="text-xs block">Bank Transfer</span>
                </button>
              </div>

              {/* Credit Card Simulated Inputs */}
              {paymentMethod === 'credit_card' && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardData.cardholderName}
                      onChange={(e) => setCardData({ ...cardData, cardholderName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={cardData.cardNumber}
                        onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 pr-10 text-sm font-mono rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                      />
                      <CreditCard className="w-5 h-5 text-slate-400 absolute right-3 top-2.5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        required
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Security CVC
                      </label>
                      <input
                        type="text"
                        placeholder="CVC"
                        required
                        value={cardData.cvc}
                        onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 text-center">
                  You will be safely routed to PayPal to complete your purchase using your linked wallet or balance.
                </div>
              )}

              {paymentMethod === 'local_bank' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                  <p className="font-semibold text-slate-800 mb-1">Local Real-time Bank Routing</p>
                  <p>Bank wire and local payment switch instructions will be provided with your reservation code. Room is held for 2 hours.</p>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCheckoutStep(2)}
                  className="w-1/3 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors"
                >
                  &larr; Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue-600/20"
                >
                  {isSubmitting
                    ? 'Authorizing Transaction...'
                    : `Pay ${formatPrice(totalUSD)} & Confirm Stay`}
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  PCI-DSS Level 1 Validated
                </span>
                <span>·</span>
                <span>Idempotent Transaction Ledger</span>
              </div>
            </form>
          )}
        </div>

        {/* Right Sticky Order Summary (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs sticky top-24 space-y-5">
            <h3 className="font-display font-bold text-base text-slate-900 pb-3 border-b border-slate-100">
              Booking Summary
            </h3>

            {/* Property mini-card */}
            <div className="flex gap-3.5">
              <img
                src={selectedProperty.featuredImage}
                alt={selectedProperty.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
                  {selectedProperty.propertyType}
                </p>
                <h4 className="font-bold text-slate-900 text-sm truncate">{selectedProperty.name}</h4>
                <p className="text-xs text-slate-500">{selectedProperty.city}, {selectedProperty.country}</p>
                <p className="text-xs font-semibold text-slate-800 mt-1">{selectedRoom.name}</p>
              </div>
            </div>

            {/* Dates & Duration */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Check-in:</span>
                <strong className="text-slate-900">{searchState.checkIn}</strong>
              </div>
              <div className="flex justify-between">
                <span>Check-out:</span>
                <strong className="text-slate-900">{searchState.checkOut}</strong>
              </div>
              <div className="flex justify-between">
                <span>Total Stay:</span>
                <strong className="text-slate-900">{nights} {nights === 1 ? 'Night' : 'Nights'}, {searchState.adults} Adults</strong>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Room rate ({nights} nights × {formatPrice(selectedRoom.basePricePerNight)}):</span>
                <span className="font-medium text-slate-900 tabular-nums">{formatPrice(basePriceUSD)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Taxes & service fee (12%):</span>
                <span className="font-medium text-slate-900 tabular-nums">{formatPrice(taxesUSD)}</span>
              </div>

              {selectedAddOns.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <p className="font-semibold text-slate-700">Add-ons:</p>
                  {selectedAddOns.map((ao) => (
                    <div key={ao.id} className="flex justify-between text-slate-500 pl-2">
                      <span>{ao.name}</span>
                      <span className="font-medium text-slate-900 tabular-nums">+{formatPrice(ao.priceUSD)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Total Amount</span>
                  <span className="text-[11px] text-slate-400">All local city taxes included</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-slate-900 font-display tabular-nums">
                    {formatPrice(totalUSD)}
                  </span>
                  <span className="text-xs text-slate-500 block uppercase font-mono">
                    ({currency})
                  </span>
                </div>
              </div>
            </div>

            {/* Cancellation Policy note */}
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>{selectedRoom.cancellationPolicy}:</strong> You can cancel without penalty up to 24 hours before check-in.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
