/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import { createServer } from "http";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In-memory data store with live state updates
let properties = [
  {
    id: 'prop-paris-grand',
    hostId: 'host-1',
    hostName: 'Maison de Prestige Hospitality',
    name: 'Hotel Le Grand Boulevard & Spa',
    tagline: '5-Star Parisian luxury with panoramic balcony views of Boulevard Haussmann',
    propertyType: 'Hotel',
    starRating: 5,
    reviewScore: 9.6,
    reviewCount: 1482,
    city: 'Paris',
    country: 'France',
    address: '14 Boulevard Haussmann, 8th Arrondissement',
    distanceFromCenter: '0.6 km from Opera Garnier',
    coordinates: { lat: 48.8722, lng: 2.3332 },
    startingPricePerNight: 320,
    geniusDiscount: 15,
    featured: true,
    amenities: ['Free Wi-Fi', 'Breakfast Included', 'Air Conditioning', 'Spa & Wellness', 'Airport Shuttle', 'Private Balcony', 'Fitness Center'],
    categoryScores: { cleanliness: 9.8, location: 9.9, service: 9.7, value: 9.2, comfort: 9.6 },
    rooms: [
      {
        id: 'room-paris-1',
        name: 'Deluxe Boulevard King Suite with Balcony',
        roomType: 'Suite',
        bedType: '1 Extra-large Double Bed (King)',
        sizeSqM: 42,
        maxOccupancy: 2,
        basePricePerNight: 320,
        originalPricePerNight: 380,
        totalInventory: 6,
        availableInventory: 4,
        mealPlan: 'Breakfast Included',
        cancellationPolicy: 'Free Cancellation',
        features: ['Balcony with City View', 'Free Wi-Fi', 'Soundproofing'],
      },
      {
        id: 'room-paris-2',
        name: 'Prestige Executive Junior Suite',
        roomType: 'Junior Suite',
        bedType: '1 King Bed + 1 Sofa Bed',
        sizeSqM: 55,
        maxOccupancy: 3,
        basePricePerNight: 460,
        originalPricePerNight: 540,
        totalInventory: 4,
        availableInventory: 2,
        mealPlan: 'Breakfast Included',
        cancellationPolicy: 'Free Cancellation',
        features: ['Courtyard Garden View', 'Walk-in Wardrobe', 'Champagne Welcome'],
      }
    ],
  },
  {
    id: 'prop-tokyo-lumina',
    hostId: 'host-2',
    hostName: 'Komorebi Luxury Group',
    name: 'The Lumina Ginza Boutique Hotel',
    tagline: 'Modern Japanese minimalism meets sky-high neon tranquility in Ginza',
    propertyType: 'Hotel',
    starRating: 5,
    reviewScore: 9.5,
    reviewCount: 920,
    city: 'Tokyo',
    country: 'Japan',
    address: '6-10-1 Ginza, Chuo City',
    distanceFromCenter: '0.2 km from Ginza Station',
    coordinates: { lat: 35.6712, lng: 139.765 },
    startingPricePerNight: 285,
    geniusDiscount: 10,
    featured: true,
    amenities: ['Free Wi-Fi', 'Breakfast Included', 'Air Conditioning', 'Fitness Center', 'Spa & Wellness', 'Airport Shuttle'],
    categoryScores: { cleanliness: 9.9, location: 9.8, service: 9.6, value: 9.1, comfort: 9.7 },
    rooms: [
      {
        id: 'room-tokyo-1',
        name: 'Skyline Panorama Superior Room',
        roomType: 'Deluxe',
        bedType: '1 Extra-large Double Bed (King)',
        sizeSqM: 36,
        maxOccupancy: 2,
        basePricePerNight: 285,
        originalPricePerNight: 320,
        totalInventory: 8,
        availableInventory: 5,
        mealPlan: 'Breakfast Included',
        cancellationPolicy: 'Free Cancellation',
        features: ['Skyline Panorama', 'Aromatherapy Diffuser', 'Yukata Robes'],
      }
    ]
  },
  {
    id: 'prop-bali-azure',
    hostId: 'host-3',
    hostName: 'Azure Cliffside Estates',
    name: 'Uluwatu Cliff Azure Sanctuary Villa',
    tagline: 'Private infinity pool estate hanging dramatically over turquoise Indian Ocean waves',
    propertyType: 'Villa',
    starRating: 5,
    reviewScore: 9.8,
    reviewCount: 640,
    city: 'Bali',
    country: 'Indonesia',
    address: 'Jalan Labuan Sait, Uluwatu',
    distanceFromCenter: '1.2 km from Uluwatu Temple',
    coordinates: { lat: -8.8142, lng: 115.0884 },
    startingPricePerNight: 410,
    geniusDiscount: 20,
    featured: true,
    amenities: ['Swimming Pool', 'Ocean View', 'Free Wi-Fi', 'Breakfast Included', 'Airport Shuttle', 'Spa & Wellness', 'Private Balcony'],
    categoryScores: { cleanliness: 9.9, location: 9.9, service: 9.8, value: 9.4, comfort: 9.9 },
    rooms: [
      {
        id: 'room-bali-1',
        name: 'Private Pool Cliff Villa with Ocean View',
        roomType: 'Villa',
        bedType: '1 Extra-large Double Bed (King)',
        sizeSqM: 110,
        maxOccupancy: 2,
        basePricePerNight: 410,
        originalPricePerNight: 512,
        totalInventory: 5,
        availableInventory: 2,
        mealPlan: 'Breakfast Included',
        cancellationPolicy: 'Free Cancellation',
        features: ['15m Private Infinity Pool', 'Floating Breakfast Option'],
      }
    ]
  },
  {
    id: 'prop-swiss-matterhorn',
    hostId: 'host-4',
    hostName: 'Alpine Heritage Lodges',
    name: 'Chalet Matterhorn Royal Alpine Lodge',
    tagline: 'Ski-in ski-out luxury timber sanctuary with unobstructed Matterhorn peak panorama',
    propertyType: 'Chalet',
    starRating: 5,
    reviewScore: 9.7,
    reviewCount: 480,
    city: 'Zermatt & Swiss Alps',
    country: 'Switzerland',
    address: 'Oberer Mattenweg 22, Zermatt',
    distanceFromCenter: '0.4 km from Sunnegga Funicular',
    coordinates: { lat: 45.981, lng: 7.748 },
    startingPricePerNight: 490,
    geniusDiscount: 15,
    featured: true,
    amenities: ['Free Wi-Fi', 'Breakfast Included', 'Spa & Wellness', 'Private Balcony', 'Airport Shuttle', 'Swimming Pool'],
    categoryScores: { cleanliness: 9.9, location: 9.9, service: 9.7, value: 9.3, comfort: 9.8 },
    rooms: [
      {
        id: 'room-swiss-1',
        name: 'Matterhorn Alpine Suite with Heated Terrace',
        roomType: 'Suite',
        bedType: '1 Extra-large Double Bed (King)',
        sizeSqM: 52,
        maxOccupancy: 2,
        basePricePerNight: 490,
        originalPricePerNight: 575,
        totalInventory: 4,
        availableInventory: 3,
        mealPlan: 'Breakfast Included',
        cancellationPolicy: 'Free Cancellation',
        features: ['Matterhorn Direct View', 'Heated Outdoor Jacuzzi Access'],
      }
    ]
  }
];

let bookings: any[] = [];

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Properties Search & List
  app.get("/api/properties", (req, res) => {
    let result = [...properties];
    const { destination, minPrice, maxPrice, starRating, propertyType, freeCancellation } = req.query;

    if (destination && typeof destination === "string" && destination.trim()) {
      const q = destination.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.city.toLowerCase().includes(q) ||
          p.country.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q)
      );
    }

    if (minPrice) {
      result = result.filter((p) => p.startingPricePerNight >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter((p) => p.startingPricePerNight <= Number(maxPrice));
    }
    if (starRating) {
      result = result.filter((p) => p.starRating >= Number(starRating));
    }
    if (propertyType && typeof propertyType === "string") {
      result = result.filter((p) => p.propertyType.toLowerCase() === propertyType.toLowerCase());
    }
    if (freeCancellation === "true") {
      result = result.filter((p) =>
        p.rooms.some((r) => r.cancellationPolicy === "Free Cancellation")
      );
    }

    res.json({ total: result.length, properties: result });
  });

  // Single Property
  app.get("/api/properties/:id", (req, res) => {
    const prop = properties.find((p) => p.id === req.params.id);
    if (!prop) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.json(prop);
  });

  // Create Booking (Atomic inventory decrement)
  app.post("/api/bookings", (req, res) => {
    const { propertyId, roomId, checkIn, checkOut, guestDetails, nights, guests, selectedAddOns, chargedCurrency, chargedTotal, baseAmountUSD, taxesAndFeesUSD, addOnsAmountUSD, totalPriceUSD } = req.body;

    if (!propertyId || !roomId || !guestDetails || !guestDetails.email) {
      return res.status(400).json({ error: "Missing required booking details" });
    }

    const prop = properties.find((p) => p.id === propertyId);
    if (!prop) {
      return res.status(404).json({ error: "Property not found" });
    }

    const room = prop.rooms.find((r) => r.id === roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (room.availableInventory <= 0) {
      return res.status(409).json({ error: "Selected room is currently fully booked" });
    }

    // Atomic decrement
    room.availableInventory -= 1;

    const referenceCode = `AS-${new Date().getFullYear()}-${prop.city.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = {
      id: `bk-${Date.now()}`,
      referenceCode,
      propertyId: prop.id,
      propertyName: prop.name,
      propertyCity: prop.city,
      propertyCountry: prop.country,
      roomId: room.id,
      roomName: room.name,
      checkIn: checkIn || "2026-10-15",
      checkOut: checkOut || "2026-10-18",
      nights: nights || 3,
      guests: guests || { adults: 2, children: 0, rooms: 1 },
      guestDetails,
      selectedAddOns: selectedAddOns || [],
      baseAmountUSD: baseAmountUSD || room.basePricePerNight * (nights || 3),
      taxesAndFeesUSD: taxesAndFeesUSD || 45,
      addOnsAmountUSD: addOnsAmountUSD || 0,
      totalPriceUSD: totalPriceUSD || 950,
      chargedCurrency: chargedCurrency || "USD",
      chargedTotal: chargedTotal || 950,
      status: "confirmed",
      cancellationPolicy: room.cancellationPolicy,
      createdAt: new Date().toISOString(),
    };

    bookings.unshift(newBooking);
    res.status(201).json({ success: true, booking: newBooking });
  });

  // Get Bookings
  app.get("/api/bookings", (_req, res) => {
    res.json({ bookings });
  });

  // Cancel Booking
  app.post("/api/bookings/:id/cancel", (req, res) => {
    const booking = bookings.find((b) => b.id === req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.status = "cancelled";

    // Restore inventory
    const prop = properties.find((p) => p.id === booking.propertyId);
    if (prop) {
      const room = prop.rooms.find((r) => r.id === booking.roomId);
      if (room) {
        room.availableInventory += 1;
      }
    }

    res.json({ success: true, message: "Booking cancelled and refund queued", booking });
  });

  // Host: update room inventory
  app.post("/api/host/rooms/:roomId/inventory", (req, res) => {
    const { inventory } = req.body;
    for (const prop of properties) {
      const room = prop.rooms.find((r) => r.id === req.params.roomId);
      if (room) {
        room.availableInventory = Number(inventory);
        return res.json({ success: true, room });
      }
    }
    res.status(404).json({ error: "Room not found" });
  });

  // Architecture Blueprint Metadata Endpoint
  app.get("/api/architecture", (_req, res) => {
    res.json({
      architecture: {
        platformName: "AeroStay Global Travel Platform",
        pattern: "Modular Microservices with Distributed Ledger & Read-Replica Cache",
        services: [
          {
            name: "Identity & Access Management (IAM)",
            tech: "Node.js / Go, JWT (RS256), OAuth2 Social Providers",
            description: "Handles user signup, RBAC for Guests, Hosts, and Platform Admins, session tokens, and magic links.",
            sla: "99.99%",
          },
          {
            name: "Spatial Property & Search Engine",
            tech: "Elasticsearch 8.x + PostgreSQL PostGIS",
            description: "Sub-50ms geo-spatial queries, fuzzy destination matching, dynamic facet counts and price aggregations.",
            sla: "99.95%",
          },
          {
            name: "Atomic Booking & Inventory Engine",
            tech: "PostgreSQL with Row-Level Locking (`SELECT FOR UPDATE`) & Redis Redlock",
            description: "Guarantees zero double-booking during flash sales, handles multi-night date range availability verification.",
            sla: "99.999%",
          },
          {
            name: "Payment Gateway & Ledger Service",
            tech: "Stripe Elements, PayPal SDK, Multi-Currency Exchange Worker",
            description: "PCI-DSS Level 1 compliant tokenized card processing, webhook verification, idempotent ledger journal entries.",
            sla: "99.99%",
          },
          {
            name: "Event-Driven Notification Service",
            tech: "Apache Kafka / AWS SQS, SendGrid, Twilio SMS",
            description: "Async booking confirmations, PDF voucher generation worker, dynamic calendar .ics generation, reminder triggers.",
            sla: "99.9%",
          },
        ],
        database: {
          engine: "PostgreSQL 16 Multi-AZ with Read Replicas",
          tables: ["users", "properties", "rooms", "room_inventory", "bookings", "payments", "reviews", "wishlists"],
        },
        devops: {
          containerization: "Docker Multi-stage minimal scratch/alpine builds",
          orchestration: "AWS ECS Fargate / Kubernetes (EKS)",
          cdn: "AWS CloudFront with edge TLS termination and S3 static asset origin",
          monitoring: "Prometheus & Grafana distributed tracing (OpenTelemetry)",
        },
      },
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`AeroStay server running on http://localhost:${PORT}`);
  });
}

startServer();
