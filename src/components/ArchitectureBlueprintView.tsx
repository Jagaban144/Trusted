/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Server,
  Database,
  Cloud,
  Shield,
  Layers,
  Cpu,
  GitBranch,
  Terminal,
  Code2,
  Copy,
  Check,
  Play,
  FileCode,
  Network,
  RefreshCw,
} from 'lucide-react';

export const ArchitectureBlueprintView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'topology' | 'database' | 'apis' | 'concurrency' | 'devops' | 'security'>('topology');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<string>('');
  const [apiLoading, setApiLoading] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/properties');

  const copyCode = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const executeApiTest = async (endpoint: string) => {
    setApiLoading(true);
    setSelectedEndpoint(endpoint);
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setApiResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    executeApiTest('/api/architecture');
  }, []);

  const POSTGRESQL_DDL = `-- ============================================================================
-- AeroStay Global Travel & Property Platform: PostgreSQL Relational Schema
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- Spatial indexing for latitude/longitude

-- 1. Users & RBAC
CREATE TYPE user_role AS ENUM ('guest', 'host', 'admin', 'auditor');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    role user_role DEFAULT 'guest',
    genius_tier SMALLINT DEFAULT 1 CHECK (genius_tier BETWEEN 1 AND 3),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- 2. Properties
CREATE TYPE property_category AS ENUM ('Hotel', 'Apartment', 'Villa', 'Chalet', 'Guest House');

CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    property_type property_category NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    geom GEOMETRY(Point, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED,
    star_rating SMALLINT CHECK (star_rating BETWEEN 1 AND 5),
    review_score NUMERIC(3, 1) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    genius_discount SMALLINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_spatial ON properties USING GIST(geom);

-- 3. Rooms & Dynamic Inventory
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    room_type VARCHAR(100) NOT NULL,
    bed_type VARCHAR(100) NOT NULL,
    size_sqm NUMERIC(5, 2),
    max_occupancy SMALLINT NOT NULL DEFAULT 2,
    base_price_per_night NUMERIC(10, 2) NOT NULL,
    total_inventory INTEGER NOT NULL DEFAULT 5,
    meal_plan VARCHAR(50) DEFAULT 'Breakfast Included',
    cancellation_policy VARCHAR(50) DEFAULT 'Free Cancellation',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE room_daily_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    calendar_date DATE NOT NULL,
    available_units INTEGER NOT NULL,
    custom_price NUMERIC(10, 2),
    CONSTRAINT unique_room_date UNIQUE(room_id, calendar_date)
);

CREATE INDEX idx_inventory_lookup ON room_daily_inventory(room_id, calendar_date);

-- 4. Bookings & Reservations
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'refunded');

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_code VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE RESTRICT,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    nights SMALLINT NOT NULL,
    adults_count SMALLINT NOT NULL DEFAULT 1,
    children_count SMALLINT NOT NULL DEFAULT 0,
    base_amount NUMERIC(10, 2) NOT NULL,
    taxes_and_fees NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status booking_status DEFAULT 'pending',
    special_requests TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_dates CHECK (check_out_date > check_in_date)
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_ref ON bookings(reference_code);

-- 5. Payments & Financial Ledger
CREATE TYPE payment_status AS ENUM ('initiated', 'authorized', 'captured', 'refunded', 'failed');

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
    gateway_reference VARCHAR(255) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    payment_status payment_status DEFAULT 'initiated',
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_booking ON payments(booking_id);

-- 6. Verified User Reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    cleanliness_score NUMERIC(3, 1) NOT NULL,
    location_score NUMERIC(3, 1) NOT NULL,
    service_score NUMERIC(3, 1) NOT NULL,
    value_score NUMERIC(3, 1) NOT NULL,
    overall_rating NUMERIC(3, 1) NOT NULL,
    title VARCHAR(200),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_property ON reviews(property_id);
`;

  const DOCKERFILE_CODE = `# ============================================================================
# Production Multi-Stage Dockerfile for AeroStay High-Performance Monolith
# ============================================================================

# Stage 1: Build & Dependencies
FROM node:22-alpine AS builder
WORKDIR /app

# Install native compilation dependencies for SQLite/Postgres drivers
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Minimal Distroless Production Runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Security: Non-root execution
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/src/constants.ts ./src/

USER appuser

EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=3s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "--loader", "tsx", "server.ts"]
`;

  const GITHUB_ACTIONS_YAML = `name: AeroStay Continuous Deployment Pipeline

on:
  push:
    branches: [ "main", "release/*" ]
  pull_request:
    branches: [ "main" ]

jobs:
  test-and-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js 22.x
        uses: actions/setup-node@v4
        with:
          node-version: 22.x
          cache: 'npm'
      - run: npm ci
      - name: Typecheck and Lint
        run: npm run lint
      - name: Production Vite Build
        run: npm run build

  docker-build-push:
    needs: test-and-lint
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      - name: Login to Amazon ECR / Container Registry
        uses: docker/login-action@v3
        with:
          registry: \${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.\${{ secrets.AWS_REGION }}.amazonaws.com
          username: \${{ secrets.AWS_ACCESS_KEY_ID }}
          password: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
      - name: Build and Push Docker Image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            \${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.\${{ secrets.AWS_REGION }}.amazonaws.com/aerostay:\${{ github.sha }}
            \${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.\${{ secrets.AWS_REGION }}.amazonaws.com/aerostay:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-to-ecs:
    needs: docker-build-push
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Amazon ECS Task Definition
        run: |
          aws ecs update-service --cluster aerostay-prod-cluster \\
            --service aerostay-api-service \\
            --force-new-deployment
`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Blueprint Header */}
      <div className="mb-8 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60 uppercase tracking-wider flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" /> Lead Software Architect Blueprint
          </span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Production Ready Specification
          </span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          System Architecture & Engineering Specification
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Comprehensive blueprint for the AeroStay global travel platform: microservice topologies, PostGIS spatial indexing, atomic row-level reservation locks, multi-currency payment ledger, and AWS/Kubernetes DevOps pipelines.
        </p>

        {/* Blueprint Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6">
          <button
            onClick={() => setActiveTab('topology')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'topology'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>1. Core Services Topology</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'database'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>2. PostgreSQL Schema & DDL</span>
          </button>

          <button
            onClick={() => setActiveTab('concurrency')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'concurrency'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>3. Concurrency & Locking</span>
          </button>

          <button
            onClick={() => setActiveTab('apis')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'apis'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>4. Live API Tester</span>
          </button>

          <button
            onClick={() => setActiveTab('devops')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'devops'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>5. Docker & CI/CD Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'security'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>6. Security & PCI-DSS</span>
          </button>
        </div>
      </div>

      {/* TAB 1: TOPOLOGY */}
      {activeTab === 'topology' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Spatial Property Search
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                PostGIS and Elasticsearch indexing with geo-distance filters, polygon boundaries, and sub-50ms fuzzy full-text matching for international airports and destinations.
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-400 border-t border-slate-100">
                SLA: 99.95% · GeoJSON Coordinates
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Atomic Inventory Engine
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transaction-safe reservation pipeline using row-level database locking (<code className="text-blue-600">SELECT ... FOR UPDATE</code>) and Redis Redlock to prevent double-booking.
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-400 border-t border-slate-100">
                SLA: 99.999% · Zero Race Conditions
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Payment Ledger & Routing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                PCI-DSS Level 1 compliant tokenization, Stripe Elements, PayPal, and local real-time bank switches with idempotent webhook processing and immutable double-entry ledger.
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-400 border-t border-slate-100">
                Multi-currency · Idempotency keys
              </div>
            </div>
          </div>

          {/* Visual Architecture Topology Diagram */}
          <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl overflow-hidden relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <span className="font-mono text-xs font-semibold text-blue-400">
                SYSTEM TOPOLOGY: DISTRIBUTED EVENT-DRIVEN MONOLITH
              </span>
              <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md">
                Traffic Ingress: AWS Route 53 + CloudFront
              </span>
            </div>

            {/* Topology Flowchart Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center text-xs">
              {/* Layer 1: Clients */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
                <span className="font-bold text-blue-300 block mb-2">Edge Layer</span>
                <div className="space-y-2 py-2">
                  <div className="bg-slate-700/60 p-2 rounded">React 19 SPA (Vite)</div>
                  <div className="bg-slate-700/60 p-2 rounded">Mobile PWA</div>
                  <div className="bg-slate-700/60 p-2 rounded">CloudFront CDN</div>
                </div>
                <span className="text-[10px] text-slate-400">&darr; TLS 1.3 / HTTP/3</span>
              </div>

              {/* Layer 2: API Gateway */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
                <span className="font-bold text-emerald-300 block mb-2">Ingress & API Gateway</span>
                <div className="space-y-2 py-2">
                  <div className="bg-slate-700/60 p-2 rounded">Kong / Nginx Ingress</div>
                  <div className="bg-slate-700/60 p-2 rounded">JWT Auth Verification</div>
                  <div className="bg-slate-700/60 p-2 rounded">Rate Limiting & WAF</div>
                </div>
                <span className="text-[10px] text-slate-400">&darr; gRPC / REST Internal</span>
              </div>

              {/* Layer 3: Services */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
                <span className="font-bold text-indigo-300 block mb-2">Microservices Core</span>
                <div className="space-y-2 py-2">
                  <div className="bg-slate-700/60 p-2 rounded font-semibold text-white">Booking & Inventory</div>
                  <div className="bg-slate-700/60 p-2 rounded">Property Search</div>
                  <div className="bg-slate-700/60 p-2 rounded">Payment Ledger</div>
                </div>
                <span className="text-[10px] text-slate-400">&darr; ACID Transactions</span>
              </div>

              {/* Layer 4: Data Tier */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
                <span className="font-bold text-amber-300 block mb-2">Persistent Data Tier</span>
                <div className="space-y-2 py-2">
                  <div className="bg-slate-700/60 p-2 rounded font-semibold text-white">PostgreSQL 16 (Multi-AZ)</div>
                  <div className="bg-slate-700/60 p-2 rounded">Redis Sentinel Cluster</div>
                  <div className="bg-slate-700/60 p-2 rounded">Kafka / SQS Event Bus</div>
                </div>
                <span className="text-[10px] text-slate-400">Read Replicas & Snapshots</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DATABASE SCHEMA */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900">
                PostgreSQL Relational Schema (DDL)
              </h2>
              <p className="text-xs text-slate-500">
                PostGIS spatial geometric columns, strict referential integrity, check constraints, and performance indexes.
              </p>
            </div>

            <button
              onClick={() => copyCode(POSTGRESQL_DDL, 'ddl')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              {copiedSection === 'ddl' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'ddl' ? 'Copied' : 'Copy SQL'}</span>
            </button>
          </div>

          <pre className="bg-slate-950 text-slate-100 p-5 rounded-2xl text-xs font-mono overflow-x-auto max-h-[550px] leading-relaxed border border-slate-800">
            <code>{POSTGRESQL_DDL}</code>
          </pre>
        </div>
      )}

      {/* TAB 3: CONCURRENCY & LOCKING */}
      {activeTab === 'concurrency' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="font-display font-bold text-lg text-slate-900 mb-2">
              Double-Booking Prevention Engine
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              During high-demand flash sales or holiday booking surges, hundreds of users may attempt to reserve the final remaining suite concurrently. To guarantee absolute ACID compliance and eliminate overselling, AeroStay employs a dual-tier locking architecture:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 text-sm block mb-1">
                  1. Tier 1: Distributed Redis Redlock (Edge Ingress)
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Before hitting the database, the API acquires an atomic key lock in Redis with a 15-minute TTL: <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">lock:room:&#123;roomId&#125;:dates:&#123;rangeHash&#125;</code>. This prevents competing HTTP threads from overloading the primary database cluster.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 text-sm block mb-1">
                  2. Tier 2: PostgreSQL Row-Level Lock (`SELECT FOR UPDATE`)
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Inside an explicit database transaction block (<code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">BEGIN ... COMMIT</code>), the booking service queries the room quota with exclusive row locking.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800">
              <p className="text-slate-400">// Sample Atomic Reservation Pipeline in Node.js / PostgreSQL</p>
              <pre className="mt-2 text-emerald-400">
{`await db.transaction(async (tx) => {
  // 1. Acquire exclusive lock on the specific room inventory
  const room = await tx.query(
    \`SELECT id, available_inventory, base_price_per_night 
     FROM rooms 
     WHERE id = $1 FOR UPDATE\`,
    [roomId]
  );

  if (room.rows[0].available_inventory <= 0) {
    throw new ConcurrencyError("Room quota exhausted by concurrent checkout");
  }

  // 2. Atomically decrement room units
  await tx.query(
    \`UPDATE rooms 
     SET available_inventory = available_inventory - 1 
     WHERE id = $1\`,
    [roomId]
  );

  // 3. Insert guaranteed non-colliding booking record
  const booking = await tx.query(
    \`INSERT INTO bookings (reference_code, user_id, room_id, status)
     VALUES ($1, $2, $3, 'confirmed') RETURNING *\`,
    [refCode, userId, roomId]
  );

  return booking.rows[0];
});`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE API TESTER */}
      {activeTab === 'apis' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="font-display font-bold text-lg text-slate-900 mb-1">
              Live Backend API Tester
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Directly ping our running Express endpoints to inspect live JSON responses.
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              {[
                '/api/properties',
                '/api/properties?destination=paris',
                '/api/properties?minPrice=300&maxPrice=500',
                '/api/bookings',
                '/api/architecture',
                '/api/health',
              ].map((endpoint) => (
                <button
                  key={endpoint}
                  onClick={() => executeApiTest(endpoint)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors flex items-center gap-1.5 ${
                    selectedEndpoint === endpoint
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Play className="w-3 h-3" />
                  <span>GET {endpoint}</span>
                </button>
              ))}
            </div>

            <div className="relative">
              <div className="flex items-center justify-between pb-2 mb-2 text-xs text-slate-500 border-b border-slate-100">
                <span>Response for: <strong className="font-mono text-slate-800">{selectedEndpoint}</strong></span>
                {apiLoading && (
                  <span className="flex items-center gap-1 text-blue-600">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Querying server...
                  </span>
                )}
              </div>

              <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-96 leading-relaxed border border-slate-800">
                <code>{apiResponse || 'Click any endpoint above to execute.'}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DEVOPS & CI/CD */}
      {activeTab === 'devops' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-display font-bold text-lg text-slate-900">
                  Production Docker Multi-Stage Build
                </h2>
                <p className="text-xs text-slate-500">
                  Minimal Alpine container, non-root user execution, and container health checks.
                </p>
              </div>

              <button
                onClick={() => copyCode(DOCKERFILE_CODE, 'docker')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                {copiedSection === 'docker' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'docker' ? 'Copied' : 'Copy Dockerfile'}</span>
              </button>
            </div>

            <pre className="bg-slate-950 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-80 leading-relaxed border border-slate-800">
              <code>{DOCKERFILE_CODE}</code>
            </pre>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-display font-bold text-lg text-slate-900">
                  GitHub Actions Automated CI/CD Workflow
                </h2>
                <p className="text-xs text-slate-500">
                  Runs linting, build verification, container compilation, and Amazon ECS zero-downtime deployment.
                </p>
              </div>

              <button
                onClick={() => copyCode(GITHUB_ACTIONS_YAML, 'ci')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                {copiedSection === 'ci' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'ci' ? 'Copied' : 'Copy Workflow'}</span>
              </button>
            </div>

            <pre className="bg-slate-950 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-80 leading-relaxed border border-slate-800">
              <code>{GITHUB_ACTIONS_YAML}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 6: SECURITY & PCI-DSS */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="font-display font-bold text-lg text-slate-900">
              Security, Data Protection & PCI-DSS Compliance
            </h2>
            <p className="text-xs text-slate-500">
              Strict payment isolation, OWASP top 10 defense, and privacy compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-sm text-slate-900 block">PCI-DSS Tokenization</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Raw credit card numbers never touch AeroStay application servers. Payment card fields render inside sandboxed Stripe Elements iFrames directly tokenized against PCI Level 1 HSM vaults.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-sm text-slate-900 block">Idempotent Webhook Processing</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Payment event webhooks enforce cryptographically signed headers (<code className="text-blue-600">Stripe-Signature</code>) and deduplication keys to prevent duplicate booking confirmations during transient network retries.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-sm text-slate-900 block">OWASP Top 10 Mitigation</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Parameterized SQL queries eliminate SQL injection. CSP headers prohibit inline unsafe scripts. CORS is strictly restricted to trusted application origins.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-sm text-slate-900 block">GDPR & Data Retention</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Right-to-be-forgotten automated purge scripts redact guest PII 90 days after stay completion while preserving financial transaction ledgers for tax compliance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
