# Multi-Tenant Backend MVP

NestJS + Prisma + PostgreSQL backend for a multi-tenant booking/catalog system.

## Features

- 🏢 **Multi-tenant**: Resolved by Host header (subdomain/domain)
- 🔐 **Staff Authentication**: JWT-based auth for OWNER and EMPLOYEE roles
- 🛍️ **Unified Catalog**: Products and Services in one model
- 📅 **Booking System**: With overlap validation for confirmed bookings
- 📱 **WhatsApp Integration**: PreOrder generates WhatsApp message payload
- 🌐 **Public API**: Unauthenticated endpoints for customers
- 🔒 **SSR Safe**: All public endpoints return `Cache-Control: private, no-store`

## Stack

- **Framework**: NestJS
- **Database**: PostgreSQL (via Prisma ORM)
- **Auth**: JWT + bcrypt
- **Validation**: class-validator
- **Security**: Throttler, CORS config

## Prerequisites

- Bun (or Node.js 18+)
- PostgreSQL database (Neon recommended)

## Setup

1. **Install dependencies**:

   ```bash
   bun install
   ```

2. **Configure environment**:
   Copy `.env.example` to `.env` and update values:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require"
   JWT_ACCESS_SECRET="your-secret-key"
   JWT_ACCESS_TTL="15m"
   CORS_ORIGINS="http://localhost:3000"
   PORT=3001
   ```

3. **Run Prisma migration**:

   ```bash
   bunx prisma migrate dev --name init
   ```

4. **Start development server**:
   ```bash
   bun run start:dev
   ```

## API Endpoints

### Public (No Auth)

- `GET /public/store/:slug` - Get store info
- `GET /public/store/:slug/items` - List active items
- `POST /public/store/:slug/preorders` - Create pre-order (returns WhatsApp payload)

### Auth

- `POST /auth/login` - Staff login
- `GET /auth/me` - Current user info

### Private (Auth Required)

- `/tenants` - CRUD for tenants (OWNER only)
- `/users` - CRUD for staff accounts (OWNER only)
- `/employees` - CRUD for employees (OWNER, EMPLOYEE)
- `/locations` - CRUD for locations (OWNER, EMPLOYEE)
- `/items` - CRUD for catalog items (OWNER, EMPLOYEE)
- `/bookings` - CRUD for bookings with overlap validation (OWNER, EMPLOYEE)
- `/preorders` - CRUD for pre-orders (OWNER, EMPLOYEE)

### Health

- `GET /health` - Health check

## Multi-Tenant Resolution

Tenants are resolved by the `Host` header:

- `mystore.example.com` → slug: `mystore`
- `localhost:3001` → slug: `localhost`

The `TenantMiddleware` runs on ALL routes and attaches the tenant to `req.tenant`.

## Database Schema

Key models:

- `Tenant` - Store/tenant
- `User` - Staff accounts (OWNER, EMPLOYEE)
- `Employee` - Employee records for bookings
- `Location` - Physical locations
- `Item` - Products and Services (via `ItemType` enum)
- `Booking` - Reservations with overlap validation
- `PreOrder` - Customer requests with WhatsApp payload

All models (except `Tenant`) have `tenantId` for data isolation.

## Security

- ✅ All queries filter by `tenantId`
- ✅ Throttling on login and public endpoints
- ✅ DTOs with class-validator on all endpoints
- ✅ SSR-safe cache headers on public API
- ✅ Passwords hashed with bcrypt

## Scripts

```bash
# Development
bun run start:dev

# Build
bun run build

# Production
bun run start:prod

# Prisma
bunx prisma migrate dev
bunx prisma studio
bunx prisma generate
```

## Important Notes

- **No client authentication**: Customers do NOT log in. Their data is stored as snapshots in bookings/preorders.
- **WhatsApp**: Backend generates message text; frontend/client sends the actual WhatsApp message.
- **Booking overlap**: Only checked for `CONFIRMED` status bookings.
- **Multi-tenant isolation**: EVERY query must filter by `tenantId`. This is enforced at service level.

## License

MIT
