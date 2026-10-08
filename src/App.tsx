/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookingProvider, useBooking } from './context/BookingContext';
import { Header } from './components/Header';
import { HeroSearchWidget } from './components/HeroSearchWidget';
import { PromotionsCarousel } from './components/PromotionsCarousel';
import { ExploreDestinations } from './components/ExploreDestinations';
import { SearchResultsSection } from './components/SearchResultsSection';
import { PropertyDetailsPage } from './components/PropertyDetailsPage';
import { CheckoutFlow } from './components/CheckoutFlow';
import { BookingConfirmation } from './components/BookingConfirmation';
import { MyBookingsView } from './components/MyBookingsView';
import { WishlistsView } from './components/WishlistsView';
import { HostPortal } from './components/HostPortal';
import { ArchitectureBlueprintView } from './components/ArchitectureBlueprintView';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { HelpSupportModal } from './components/HelpSupportModal';
import { LightboxModal } from './components/LightboxModal';

function MainAppContent() {
  const { activeTab } = useBooking();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Global Top Bar Navigation */}
      <Header />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'search' && (
          <>
            <HeroSearchWidget />
            <PromotionsCarousel />
            <ExploreDestinations />
            <SearchResultsSection />
          </>
        )}

        {activeTab === 'pdp' && <PropertyDetailsPage />}

        {activeTab === 'checkout' && <CheckoutFlow />}

        {activeTab === 'confirmation' && <BookingConfirmation />}

        {activeTab === 'my-bookings' && <MyBookingsView />}

        {activeTab === 'wishlists' && <WishlistsView />}

        {activeTab === 'host-portal' && <HostPortal />}

        {activeTab === 'architecture' && <ArchitectureBlueprintView />}
      </main>

      {/* Footer & Mobile Navigation */}
      <Footer />

      {/* Global Overlay Modals */}
      <AuthModal />
      <HelpSupportModal />
      <LightboxModal />
    </div>
  );
}

export default function App() {
  return (
    <BookingProvider>
      <MainAppContent />
    </BookingProvider>
  );
}
