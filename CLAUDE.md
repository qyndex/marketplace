# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marketplace — Two-sided marketplace with listings, search, messaging, and Stripe payments.

Built with Next.js 14, React 19, TypeScript 5.9, and Tailwind CSS.

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
npx prisma migrate dev   # Apply pending migrations
npx prisma db seed       # Seed development data
npx prisma studio        # Open Prisma Studio GUI
```

## Environment

Copy `.env.example` → `.env.local` and fill in values before running locally.
Required: `DATABASE_URL`. Optional for full functionality: Stripe keys, Algolia keys.

## Architecture

- `src/app/` — App Router pages and layouts
- `src/components/` — Reusable React components (unit-tested in `*.test.tsx` siblings)
- `src/lib/` — Utilities, helpers, API clients (`prisma.ts` singleton)
- `src/test/setup.ts` — Vitest global setup (jest-dom matchers, next/navigation mock)
- `e2e/` — Playwright end-to-end specs
- `prisma/schema.prisma` — Database schema (User, Listing, Message, Transaction)
- `public/` — Static assets

## Testing

Unit tests live alongside source files as `*.test.tsx`. They use:
- `vitest` as the test runner
- `@testing-library/react` + `@testing-library/jest-dom` for assertions
- `@testing-library/user-event` for realistic browser interactions
- `jsdom` as the DOM environment

E2E tests live in `e2e/` and require a running dev server (managed automatically via
`webServer` in `playwright.config.ts`).

## Rules

- TypeScript strict mode — no `any` types
- All components must have proper TypeScript interfaces
- Use Tailwind utility classes — no custom CSS files
- ARIA labels on all interactive elements
- Error + loading states on all data-fetching components
- Use `next/image` for all images, `next/link` for navigation
- Unit tests required for all new components (≥80% coverage)
- E2E tests for all new user-facing pages
