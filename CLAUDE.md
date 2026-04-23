# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marketplace — Two-sided marketplace with listings, search, categories, orders, reviews, and Supabase Auth. Buyers browse and purchase listings; sellers manage inventory and track sales via a dashboard.

Built with Next.js 14, React 18, TypeScript 5.9, Tailwind CSS, and Supabase (PostgreSQL with RLS).

## Commands

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm run start            # Start production server
npm run typecheck        # tsc --noEmit type check
npm run lint             # ESLint (eslint-config-next)

# Unit tests (Vitest + React Testing Library)
npm test                 # Run all unit tests once
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report (80% threshold)

# E2E tests (Playwright)
npm run test:e2e         # Headless Playwright suite
npm run test:e2e:ui      # Playwright UI mode (interactive)

# Database
npx supabase start       # Start local Supabase (requires Docker)
npx supabase db reset    # Reset DB and apply migrations + seed
npm run db:migrate       # Apply pending migrations
npm run db:reset         # Alias for supabase db reset
```

## Environment

Copy `.env.example` to `.env.local` and fill in values before running locally.

Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
Optional: `SUPABASE_SERVICE_ROLE_KEY` (for server-side queries that bypass RLS), Stripe keys.

For local development with `npx supabase start`, the URL and anon key are printed in the terminal output.

## Architecture

- `src/app/` — App Router pages and layouts
  - `src/app/auth/` — Login, signup, and OAuth callback
  - `src/app/listings/[id]/` — Listing detail page (fetches from DB by UUID)
  - `src/app/listings/new/` — Create new listing (auth-protected)
  - `src/app/search/` — Full-text search across listings
  - `src/app/dashboard/` — Seller dashboard (auth-protected)
  - `src/app/orders/` — Order history (auth-protected)
  - `src/app/messages/` — Messages placeholder (auth-protected)
- `src/components/` — Reusable React components
  - `src/components/auth/AuthProvider.tsx` — Auth context provider
  - `src/components/Navbar.tsx` — Global navigation bar
  - `src/components/ListingCard.tsx` — Listing card for grid display
  - `src/components/SearchBar.tsx` — Search form
  - `src/components/CategoryFilter.tsx` — Category pill filter
  - `src/components/BuyButton.tsx` — Buy action with order creation
- `src/lib/supabase/` — Supabase client setup
  - `client.ts` — Browser client (use in client components)
  - `server.ts` — Server client factory (use in server components and API routes)
- `src/types/database.ts` — TypeScript interfaces matching DB schema
- `src/middleware.ts` — Auth middleware protecting /dashboard, /orders, /messages, /listings/new
- `src/test/setup.ts` — Vitest global setup (jest-dom matchers, next/navigation mock)
- `supabase/migrations/` — Database migrations
- `supabase/seed.sql` — Seed data (5 sellers, 15 listings, 8 orders, 10 reviews)
- `supabase/config.toml` — Supabase local dev configuration
- `e2e/` — Playwright end-to-end specs
- `prisma/schema.prisma` — Legacy Prisma schema (not used, kept for reference)
- `public/` — Static assets

## Database Schema

Four tables: `profiles`, `listings`, `orders`, `reviews`. RLS enabled on all tables.

- **profiles** — extends `auth.users`; public read, self-update. Auto-created on signup via trigger.
- **listings** — active listings readable by everyone; sellers can CRUD their own.
- **orders** — accessible by buyer or seller of the related listing.
- **reviews** — public read; only the reviewer can insert/update.

Categories: `electronics`, `furniture`, `clothing`, `vehicles`, `collectibles`, `sports`, `home-garden`, `other`.

## Key Patterns

- **Auth:** Supabase Auth with email/password. `AuthProvider` wraps the app, provides user state via React context. Middleware redirects unauthenticated users from protected routes.
- **Server queries:** Server components use `createServerClient()` from `src/lib/supabase/server.ts` (service role key bypasses RLS).
- **Client queries:** Client components use the singleton `supabase` from `src/lib/supabase/client.ts` (anon key, RLS applies).
- **Demo credentials:** `alice@demo.local` / `password123` (and bob, carol, dave, eve with same password).

## Testing

Unit tests live alongside source files as `*.test.tsx`. They use:
- `vitest` as the test runner
- `@testing-library/react` + `@testing-library/jest-dom` for assertions
- `@testing-library/user-event` for realistic browser interactions
- `jsdom` as the DOM environment

E2E tests live in `e2e/` and require a running dev server (managed automatically via `webServer` in `playwright.config.ts`).

## Rules

- TypeScript strict mode — no `any` types
- All components must have proper TypeScript interfaces
- Use Tailwind utility classes — no custom CSS files
- ARIA labels on all interactive elements
- Error + loading states on all data-fetching components
- Use `next/image` for all images, `next/link` for navigation
- Supabase queries use the typed clients from `src/lib/supabase/`
- Unit tests required for all new components (80%+ coverage)
- E2E tests for all new user-facing pages
