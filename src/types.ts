/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CurrencyCode = 'USD' | 'EUR' | 'NGN' | 'GBP' | 'JPY';
export type LanguageCode = 'EN' | 'ES' | 'FR' | 'DE' | 'JA';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateFromUSD: number; // multiplier against USD
}

export interface LanguageConfig {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

export type PropertyType = 'Hotel' | 'Apartment' | 'Villa' | 'Chalet' | 'Guest House';

export type Amenity =
  | 'Free Wi-Fi'
  | 'Swimming Pool'
  | 'Breakfast Included'
  | 'Air Conditioning'
  | 'Airport Shuttle'
  | 'Fitness Center'
  | 'Pet Friendly'
  | 'Spa & Wellness'
  | 'Ocean View'
  | 'Private Balcony'
  | 'Kitchenette';

export type MealPlan = 'Room Only' | 'Breakfast Included' | 'Half Board' | 'All Inclusive';
export type CancellationPolicy = 'Free Cancellation' | 'Non-refundable' | 'Flexible 24h';

export interface Room {
  id: string;
  propertyId: string;
  name: string;
  description: string;
  roomType: string;
  bedType: string;
  sizeSqM: number;
  maxOccupancy: number;
  basePricePerNight: number;
  originalPricePerNight?: number;
  totalInventory: number;
  availableInventory: number;
  mealPlan: MealPlan;
  cancellationPolicy: CancellationPolicy;
  features: string[];
  image: string;
}

export interface ReviewCategoryScores {
  cleanliness: number;
  location: number;
  service: number;
  value: number;
  comfort: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userCountry: string;
  travelerType: 'Couple' | 'Solo' | 'Family' | 'Group' | 'Business';
  rating: number; // e.g. 9.4 out of 10
  title: string;
  comment: string;
  stayDate: string;
  verified: boolean;
}

export interface Property {
  id: string;
  hostId: string;
  hostName: string;
  name: string;
  tagline: string;
  description: string;
  propertyType: PropertyType;
  starRating: number;
  reviewScore: number; // e.g. 9.2
  reviewCount: number;
  reviewSummary: string;
  address: string;
  city: string;
  country: string;
  distanceFromCenter: string;
  coordinates: { lat: number; lng: number };
  images: string[];
  featuredImage: string;
  featured: boolean;
  geniusDiscount?: number; // percentage discount (e.g. 15)
  amenities: Amenity[];
  categoryScores: ReviewCategoryScores;
  rooms: Room[];
  reviews: Review[];
  startingPricePerNight: number;
}

export interface SearchState {
  destination: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  adults: number;
  children: number;
  childrenAges: number[];
  rooms: number;
  workTrip: boolean;
}

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  starRatings: number[];
  propertyTypes: PropertyType[];
  amenities: Amenity[];
  freeCancellationOnly: boolean;
  breakfastIncludedOnly: boolean;
  sortBy: 'recommended' | 'price_asc' | 'price_desc' | 'rating';
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  priceUSD: number;
  perStayOrNight: 'per_stay' | 'per_night';
}

export interface BookingGuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  specialRequests: string;
  isBusinessTrip: boolean;
  companyName?: string;
  taxId?: string;
}

export interface BookingPaymentDetails {
  paymentMethod: 'credit_card' | 'paypal' | 'local_bank';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  cardholderName?: string;
  currency: CurrencyCode;
  transactionId: string;
  paidAt: string;
}

export interface Booking {
  id: string;
  referenceCode: string; // e.g. AS-2026-PARIS-992
  propertyId: string;
  propertyName: string;
  propertyCity: string;
  propertyCountry: string;
  propertyImage: string;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: {
    adults: number;
    children: number;
    rooms: number;
  };
  guestDetails: BookingGuestDetails;
  selectedAddOns: AddOn[];
  baseAmountUSD: number;
  taxesAndFeesUSD: number;
  addOnsAmountUSD: number;
  totalPriceUSD: number;
  chargedCurrency: CurrencyCode;
  chargedTotal: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  cancellationPolicy: CancellationPolicy;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'guest' | 'host' | 'admin';
  geniusTier: 1 | 2 | 3;
  savedProperties: string[];
}

export interface WishlistCollection {
  id: string;
  name: string;
  description: string;
  propertyIds: string[];
}

export interface DestinationHighlight {
  id: string;
  name: string;
  country: string;
  propertyCount: number;
  tagline: string;
  image: string;
  coordinates: { lat: number; lng: number };
}

export interface PromotionOffer {
  id: string;
  title: string;
  badge: string;
  discountPercent: number;
  description: string;
  validUntil: string;
  bgGradient: string;
  code: string;
}
