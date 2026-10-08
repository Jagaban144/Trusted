/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { X, MessageSquare, Phone, Mail, HelpCircle, CheckCircle2 } from 'lucide-react';

const FAQS = [
  {
    q: 'How does Free Cancellation work?',
    a: 'Properties with the Free Cancellation badge allow full refunds if cancelled at least 24 to 48 hours prior to your scheduled check-in date. Refunds are processed immediately to your original payment method.',
  },
  {
    q: 'What is Genius Member Tier?',
    a: 'AeroStay Genius is our global loyalty program. Tier 1 grants 10% off stays, while Tier 2 unlocks up to 20% discounts, complimentary daily gourmet breakfast, and priority room upgrades.',
  },
  {
    q: 'Can I pay at the property instead of online?',
    a: 'Yes, select rooms offer a "Pay at Hotel" policy where your credit card is held for guarantee only, and full settlement occurs during check-in or checkout.',
  },
  {
    q: 'How do I download my booking confirmation or calendar file?',
    a: 'Navigate to "My Bookings" at any time to view your confirmed stays, re-download your official PDF travel voucher, or export the .ics calendar file.',
  },
];

export const HelpSupportModal: React.FC = () => {
  const { helpModalOpen, setHelpModalOpen } = useBooking();
  const [ticketSent, setTicketSent] = useState(false);
  const [message, setMessage] = useState('');

  if (!helpModalOpen) return null;

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setTicketSent(true);
    setTimeout(() => {
      setTicketSent(false);
      setMessage('');
      setHelpModalOpen(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setHelpModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              Customer Support & Help Center
            </h2>
            <p className="text-xs text-slate-500">24/7 Global Traveler Assistance</p>
          </div>
        </div>

        {/* 24/7 Channels */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <Phone className="w-4 h-4 text-blue-600 mb-1" />
            <p className="font-semibold text-slate-800">Phone Support</p>
            <p className="text-slate-500 text-[11px]">+1 (800) 555-0199 (Toll-free)</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <Mail className="w-4 h-4 text-blue-600 mb-1" />
            <p className="font-semibold text-slate-800">Priority Email</p>
            <p className="text-slate-500 text-[11px]">support@aerostay.com</p>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Frequently Asked Questions
          </h3>
          {FAQS.map((faq, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-50 text-xs border border-slate-100">
              <p className="font-semibold text-slate-900 mb-1">{faq.q}</p>
              <p className="text-slate-600 leading-relaxed text-[11px]">{faq.a}</p>
            </div>
          ))}
        </div>

        {/* Quick Message Box */}
        <form onSubmit={handleSubmitTicket} className="border-t border-slate-100 pt-4">
          <label className="block text-xs font-semibold text-slate-800 mb-1.5">
            Need immediate help with a stay? Send a message to concierge
          </label>
          <textarea
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your inquiry..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-none resize-none mb-3"
          />

          {ticketSent ? (
            <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Ticket received! A travel concierge will reply shortly.</span>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-2xs"
            >
              Submit Support Request
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
