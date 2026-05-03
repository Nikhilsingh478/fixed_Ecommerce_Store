# SwiftCart PWA

A modern, mobile-first e-commerce Progressive Web Application (PWA) for grocery, beauty, and daily essentials.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite with `@vitejs/plugin-react-swc`
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **Routing**: React Router v6
- **Data Fetching**: TanStack Query (React Query)
- **PWA**: vite-plugin-pwa (Workbox)
- **Package Manager**: npm

## Project Structure

- `src/components/` - Reusable UI components (shadcn/ui + custom)
- `src/pages/` - Route-level page components
- `src/store/` - Zustand global state stores
- `src/data/` - Mock product/category data
- `src/routes/` - Centralized routing config
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions
- `public/` - Static assets and PWA icons

## Running the App

- **Dev**: `npm run dev` (port 5000)
- **Build**: `npm run build`
- **Test**: `npm test`

## PWA Manifest Fields

The manifest in `vite.config.ts` is fully enriched for PWABuilder compliance:
- `id`, `lang`, `dir`, `categories`, `iarc_rating_id`
- `display_override` (window-controls-overlay, standalone, browser)
- `shortcuts` — Cart, Products, Orders, Account
- `screenshots` — mobile (390x844) and desktop (1280x800) in `public/`
- `launch_handler` — focus-existing client mode
- `share_target` — GET handler via `/share-target` route
- `protocol_handlers` — `web+swiftcart:` custom protocol
- `edge_side_panel` — sidebar pinning support
- `file_handlers` — CSV file handling
- `scope_extensions` — wildcard subdomains

Service worker (Workbox) is enabled in both dev and production with:
- Precaching of all static assets
- Runtime caching for images, fonts, pages, static resources
- Offline fallback via `public/offline.html`
- NetworkFirst for HTML pages, CacheFirst for images/fonts

## Features Implemented

### Dark Mode
- All components use Tailwind CSS variable-based classes (`bg-background`, `bg-card`, `text-foreground`, `border-border`, etc.) to respond to the `.dark` class applied by `next-themes`.
- Toggle lives in the Account page.

### Checkout Flow (`/checkout`)
- Multi-step checkout: Address → Payment → Order Confirmed
- Address management: saved to `localStorage` via `useAddressStore` (add, select, remove)
- Support for Home / Work / Other address types with full Indian state list
- Payment methods: Cash on Delivery (COD) or Online (simulated)
- Free delivery on orders ≥ ₹499
- Orders saved to `useOrderStore` (persisted in `localStorage`)

### Orders Page (`/orders`)
- Shows real order history from `useOrderStore`
- Displays items, address, payment method, status, and totals
- "Buy Again" button re-adds all items from an order to cart

### Buy Again Page (`/buy-again`)
- Dedicated page at `/buy-again` (in both header and bottom nav)
- Shows unique products from all past orders
- "Add to Cart" per item with live cart state display

## Backend API Configuration

This app connects to a custom backend API. Set the `VITE_API_URL` environment variable (or secret) to point to your backend:

- Default fallback: `http://localhost:8080/ecommerce`
- Example: `VITE_API_URL=https://your-api.example.com/ecommerce`

Auth uses email/password sent as request headers (via Axios interceptor in `src/services/apiClient.ts`). Credentials are stored in `localStorage` after login.

## Deployment

Configured as a static site deployment:
- Build command: `npm run build`
- Output directory: `dist`
