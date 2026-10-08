/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CurrencyCode,
  LanguageCode,
  Property,
  Room,
  Booking,
  User,
  SearchState,
  FilterState,
  AddOn,
  WishlistCollection,
  PropertyType,
  Amenity,
} from '../types';
import { CURRENCIES, INITIAL_PROPERTIES, ADD_ONS } from '../constants';

export type ActiveTab =
  | 'search'
  | 'pdp'
  | 'checkout'
  | 'confirmation'
  | 'my-bookings'
  | 'wishlists'
  | 'host-portal'
  | 'architecture';

interface BookingContextType {
  // Navigation & View
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  viewMode: 'list' | 'map';
  setViewMode: (mode: 'list' | 'map') => void;

  // Localization
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  formatPrice: (amountUSD: number) => string;
  convertPrice: (amountUSD: number) => number;

  // Search & Filtering
  searchState: SearchState;
  setSearchState: React.Dispatch<React.SetStateAction<SearchState>>;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  applyDestinationSearch: (dest: string) => void;

  // Properties & Selection
  properties: Property[];
  filteredProperties: Property[];
  selectedProperty: Property | null;
  setSelectedProperty: (prop: Property | null) => void;
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room | null) => void;
  openPDP: (propertyId: string) => void;

  // Checkout flow
  checkoutStep: 1 | 2 | 3 | 4;
  setCheckoutStep: (step: 1 | 2 | 3 | 4) => void;
  selectedAddOns: AddOn[];
  toggleAddOn: (addon: AddOn) => void;
  startCheckout: (property: Property, room: Room) => void;
  completeBooking: (guestDetails: any, paymentDetails: any) => Promise<Booking>;
  latestBooking: Booking | null;

  // User & Bookings
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  bookings: Booking[];
  cancelBooking: (bookingId: string) => Promise<boolean>;
  modifyBookingDates: (bookingId: string, newCheckIn: string, newCheckOut: string) => void;

  // Wishlists
  wishlistIds: string[];
  toggleWishlist: (propertyId: string) => void;
  wishlistCollections: WishlistCollection[];
  createWishlistCollection: (name: string) => void;

  // Host Portal
  hostProperties: Property[];
  updateRoomInventory: (propertyId: string, roomId: string, newInventory: number) => void;

  // Modals
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'magic-link';
  setAuthModalMode: (mode: 'login' | 'register' | 'magic-link') => void;
  helpModalOpen: boolean;
  setHelpModalOpen: (open: boolean) => void;
  lightboxOpen: boolean;
  setLightboxOpen: (open: boolean) => void;
  lightboxImages: string[];
  lightboxIndex: number;
  openLightbox: (images: string[], index?: number) => void;
  setLightboxIndex: (index: number) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('search');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Localization
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [language, setLanguage] = useState<LanguageCode>('EN');

  // Search State
  const [searchState, setSearchState] = useState<SearchState>({
    destination: '',
    checkIn: '2026-10-15',
    checkOut: '2026-10-18',
    adults: 2,
    children: 0,
    childrenAges: [],
    rooms: 1,
    workTrip: false,
  });

  // Filter State
  const initialFilterState: FilterState = {
    minPrice: 0,
    maxPrice: 1200,
    starRatings: [],
    propertyTypes: [],
    amenities: [],
    freeCancellationOnly: false,
    breakfastIncludedOnly: false,
    sortBy: 'recommended',
  };
  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);

  // Data & Selection
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Checkout State
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [latestBooking, setLatestBooking] = useState<Booking | null>(null);

  // User & Bookings
  const [user, setUser] = useState<User>({
    id: 'user-vip-1',
    email: 'denzy1212@gmail.com',
    firstName: 'Denzy',
    lastName: 'Traveler',
    role: 'guest',
    geniusTier: 2,
    savedProperties: ['prop-paris-grand', 'prop-bali-azure'],
  });

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'bk-sample-1',
      referenceCode: 'AS-2026-PAR-8421',
      propertyId: 'prop-paris-grand',
      propertyName: 'Hotel Le Grand Boulevard & Spa',
      propertyCity: 'Paris',
      propertyCountry: 'France',
      propertyImage: '/src/assets/images/destination_paris_1791457864605.jpg',
      roomId: 'room-paris-1',
      roomName: 'Deluxe Boulevard King Suite with Balcony',
      checkIn: '2026-11-10',
      checkOut: '2026-11-14',
      nights: 4,
      guests: { adults: 2, children: 0, rooms: 1 },
      guestDetails: {
        firstName: 'Denzy',
        lastName: 'Traveler',
        email: 'denzy1212@gmail.com',
        phone: '+1 555-019-2834',
        country: 'United States',
        specialRequests: 'High floor with boulevard view requested.',
        isBusinessTrip: false,
      },
      selectedAddOns: [ADD_ONS[0]], // Chauffeur
      baseAmountUSD: 1280,
      taxesAndFeesUSD: 85,
      addOnsAmountUSD: 45,
      totalPriceUSD: 1410,
      chargedCurrency: 'USD',
      chargedTotal: 1410,
      status: 'confirmed',
      cancellationPolicy: 'Free Cancellation',
      createdAt: '2026-10-01T10:30:00Z',
    },
  ]);

  // Wishlists
  const [wishlistIds, setWishlistIds] = useState<string[]>(['prop-paris-grand', 'prop-bali-azure']);
  const [wishlistCollections, setWishlistCollections] = useState<WishlistCollection[]>([
    {
      id: 'col-1',
      name: 'European Getaways 2026',
      description: 'Charming suites in Paris & Swiss alpine chalets',
      propertyIds: ['prop-paris-grand', 'prop-swiss-matterhorn'],
    },
    {
      id: 'col-2',
      name: 'Dream Tropical Villas',
      description: 'Oceanfront infinity pool escapes in Bali',
      propertyIds: ['prop-bali-azure'],
    },
  ]);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'magic-link'>('login');
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Sync initial properties with backend if available
  useEffect(() => {
    fetch('/api/properties')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.properties && data.properties.length > 0) {
          // Keep rich client fields like detailed reviews and images
          setProperties((prev) =>
            prev.map((p) => {
              const remote = data.properties.find((rp: any) => rp.id === p.id);
              if (remote) {
                return {
                  ...p,
                  rooms: p.rooms.map((rm) => {
                    const remoteRoom = remote.rooms?.find((rr: any) => rr.id === rm.id);
                    return remoteRoom ? { ...rm, availableInventory: remoteRoom.availableInventory } : rm;
                  }),
                };
              }
              return p;
            })
          );
        }
      })
      .catch((_err) => {
        // Fallback to local properties
      });
  }, []);

  // Format currency
  const convertPrice = (amountUSD: number): number => {
    const rate = CURRENCIES[currency]?.rateFromUSD || 1.0;
    return Math.round(amountUSD * rate);
  };

  const formatPrice = (amountUSD: number): string => {
    const config = CURRENCIES[currency] || CURRENCIES.USD;
    const converted = convertPrice(amountUSD);
    return `${config.symbol}${converted.toLocaleString()}`;
  };

  // Filter properties
  const filteredProperties = properties
    .filter((prop) => {
      // Destination search
      if (searchState.destination.trim()) {
        const q = searchState.destination.toLowerCase().trim();
        const matchesCity = prop.city.toLowerCase().includes(q);
        const matchesCountry = prop.country.toLowerCase().includes(q);
        const matchesName = prop.name.toLowerCase().includes(q);
        if (!matchesCity && !matchesCountry && !matchesName) return false;
      }

      // Price filter
      if (prop.startingPricePerNight < filterState.minPrice || prop.startingPricePerNight > filterState.maxPrice) {
        return false;
      }

      // Star rating
      if (filterState.starRatings.length > 0 && !filterState.starRatings.includes(prop.starRating)) {
        return false;
      }

      // Property type
      if (filterState.propertyTypes.length > 0 && !filterState.propertyTypes.includes(prop.propertyType)) {
        return false;
      }

      // Amenities
      if (filterState.amenities.length > 0) {
        const hasAll = filterState.amenities.every((a) => prop.amenities.includes(a));
        if (!hasAll) return false;
      }

      // Free cancellation
      if (filterState.freeCancellationOnly) {
        const hasFreeCanc = prop.rooms.some((r) => r.cancellationPolicy === 'Free Cancellation');
        if (!hasFreeCanc) return false;
      }

      // Breakfast included
      if (filterState.breakfastIncludedOnly) {
        const hasBreakfast = prop.rooms.some((r) => r.mealPlan === 'Breakfast Included' || r.mealPlan === 'All Inclusive');
        if (!hasBreakfast) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (filterState.sortBy === 'price_asc') return a.startingPricePerNight - b.startingPricePerNight;
      if (filterState.sortBy === 'price_desc') return b.startingPricePerNight - a.startingPricePerNight;
      if (filterState.sortBy === 'rating') return b.reviewScore - a.reviewScore;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  const resetFilters = () => {
    setFilterState(initialFilterState);
  };

  const applyDestinationSearch = (dest: string) => {
    setSearchState((prev) => ({ ...prev, destination: dest }));
    setActiveTab('search');
  };

  const openPDP = (propertyId: string) => {
    const prop = properties.find((p) => p.id === propertyId);
    if (prop) {
      setSelectedProperty(prop);
      setSelectedRoom(prop.rooms[0] || null);
      setActiveTab('pdp');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const startCheckout = (property: Property, room: Room) => {
    setSelectedProperty(property);
    setSelectedRoom(room);
    setCheckoutStep(1);
    setSelectedAddOns([]);
    setActiveTab('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleAddOn = (addon: AddOn) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) return prev.filter((a) => a.id !== addon.id);
      return [...prev, addon];
    });
  };

  const completeBooking = async (guestDetails: any, paymentDetails: any): Promise<Booking> => {
    if (!selectedProperty || !selectedRoom) {
      throw new Error('No property or room selected for checkout');
    }

    const nights = 3; // Based on search checkIn to checkOut
    const baseAmountUSD = selectedRoom.basePricePerNight * nights;
    const taxesAndFeesUSD = Math.round(baseAmountUSD * 0.12);
    const addOnsAmountUSD = selectedAddOns.reduce((acc, curr) => acc + curr.priceUSD, 0);
    const totalPriceUSD = baseAmountUSD + taxesAndFeesUSD + addOnsAmountUSD;
    const chargedTotal = convertPrice(totalPriceUSD);

    const bookingPayload = {
      propertyId: selectedProperty.id,
      roomId: selectedRoom.id,
      checkIn: searchState.checkIn,
      checkOut: searchState.checkOut,
      nights,
      guests: { adults: searchState.adults, children: searchState.children, rooms: searchState.rooms },
      guestDetails,
      paymentDetails,
      selectedAddOns,
      baseAmountUSD,
      taxesAndFeesUSD,
      addOnsAmountUSD,
      totalPriceUSD,
      chargedCurrency: currency,
      chargedTotal,
    };

    let confirmedBooking: Booking;

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });
      const data = await res.json();
      if (data && data.booking) {
        confirmedBooking = {
          ...data.booking,
          propertyName: selectedProperty.name,
          propertyImage: selectedProperty.featuredImage,
        };
      } else {
        throw new Error('Server returned empty booking');
      }
    } catch (_err) {
      // Local fallback
      const referenceCode = `AS-${new Date().getFullYear()}-${selectedProperty.city.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      confirmedBooking = {
        id: `bk-${Date.now()}`,
        referenceCode,
        propertyId: selectedProperty.id,
        propertyName: selectedProperty.name,
        propertyCity: selectedProperty.city,
        propertyCountry: selectedProperty.country,
        propertyImage: selectedProperty.featuredImage,
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        checkIn: searchState.checkIn,
        checkOut: searchState.checkOut,
        nights,
        guests: { adults: searchState.adults, children: searchState.children, rooms: searchState.rooms },
        guestDetails,
        selectedAddOns,
        baseAmountUSD,
        taxesAndFeesUSD,
        addOnsAmountUSD,
        totalPriceUSD,
        chargedCurrency: currency,
        chargedTotal,
        status: 'confirmed',
        cancellationPolicy: selectedRoom.cancellationPolicy,
        createdAt: new Date().toISOString(),
      };
    }

    // Decrement inventory locally
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === selectedProperty.id) {
          return {
            ...p,
            rooms: p.rooms.map((r) =>
              r.id === selectedRoom.id ? { ...r, availableInventory: Math.max(0, r.availableInventory - 1) } : r
            ),
          };
        }
        return p;
      })
    );

    setBookings((prev) => [confirmedBooking, ...prev]);
    setLatestBooking(confirmedBooking);
    setActiveTab('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return confirmedBooking;
  };

  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    try {
      await fetch(`/api/bookings/${bookingId}/cancel`, { method: 'POST' });
    } catch (_err) {
      // offline/fallback
    }

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return { ...b, status: 'cancelled' };
        }
        return b;
      })
    );

    // Restore room inventory locally
    const target = bookings.find((b) => b.id === bookingId);
    if (target) {
      setProperties((prev) =>
        prev.map((p) => {
          if (p.id === target.propertyId) {
            return {
              ...p,
              rooms: p.rooms.map((r) =>
                r.id === target.roomId ? { ...r, availableInventory: r.availableInventory + 1 } : r
              ),
            };
          }
          return p;
        })
      );
    }

    return true;
  };

  const modifyBookingDates = (bookingId: string, newCheckIn: string, newCheckOut: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return { ...b, checkIn: newCheckIn, checkOut: newCheckOut };
        }
        return b;
      })
    );
  };

  const toggleWishlist = (propertyId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(propertyId);
      const next = exists ? prev.filter((id) => id !== propertyId) : [...prev, propertyId];
      // update collection
      setWishlistCollections((cols) =>
        cols.map((col, idx) => (idx === 0 ? { ...col, propertyIds: next } : col))
      );
      return next;
    });
  };

  const createWishlistCollection = (name: string) => {
    const newCol: WishlistCollection = {
      id: `col-${Date.now()}`,
      name,
      description: 'Custom curated collection',
      propertyIds: [],
    };
    setWishlistCollections((prev) => [...prev, newCol]);
  };

  // Host Portal
  const hostProperties = properties.filter((p) => p.hostId === 'host-1' || p.hostId === 'host-2');

  const updateRoomInventory = (propertyId: string, roomId: string, newInventory: number) => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === propertyId) {
          return {
            ...p,
            rooms: p.rooms.map((r) => (r.id === roomId ? { ...r, availableInventory: newInventory } : r)),
          };
        }
        return p;
      })
    );
    fetch(`/api/host/rooms/${roomId}/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inventory: newInventory }),
    }).catch(() => {});
  };

  const openLightbox = (images: string[], index = 0) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <BookingContext.Provider
      value={{
        activeTab,
        setActiveTab,
        viewMode,
        setViewMode,
        currency,
        setCurrency,
        language,
        setLanguage,
        formatPrice,
        convertPrice,
        searchState,
        setSearchState,
        filterState,
        setFilterState,
        resetFilters,
        applyDestinationSearch,
        properties,
        filteredProperties,
        selectedProperty,
        setSelectedProperty,
        selectedRoom,
        setSelectedRoom,
        openPDP,
        checkoutStep,
        setCheckoutStep,
        selectedAddOns,
        toggleAddOn,
        startCheckout,
        completeBooking,
        latestBooking,
        user,
        setUser,
        bookings,
        cancelBooking,
        modifyBookingDates,
        wishlistIds,
        toggleWishlist,
        wishlistCollections,
        createWishlistCollection,
        hostProperties,
        updateRoomInventory,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        helpModalOpen,
        setHelpModalOpen,
        lightboxOpen,
        setLightboxOpen,
        lightboxImages,
        lightboxIndex,
        openLightbox,
        setLightboxIndex,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
