# Conductor Tracking Page - Seoul

## Project Overview

A branded order tracking page product for Borderless360 (B360). This is a configurable white-label tracking experience that B360's merchant clients can customise via an admin panel. Built as static HTML pages (no framework/bundler).

## Live Demo

Deployed on Vercel: https://seoul-eight.vercel.app
- Admin panel: /admin.html
- Search page: /search-page.html
- Single tracking: /tracking-demo.html
- Multi-package tracking: /multi-package.html

## Architecture

### Files

- **admin.html** - Admin configuration panel with 2-step wizard. Step 1: Search page settings (branding, logo, fonts, colours, nav links, support). Step 2: Tracking page settings (carrier info, delivery date, delays, address notifications, returns, claims, GTM). Has a live preview iframe on the right side.
- **search-page.html** - Consumer-facing order search page. Accepts tracking/order reference and redirects to tracking-demo.html.
- **tracking-demo.html** - Single package tracking page. Shows delivery timeline, status states (shipped, in-transit, local delivery, delivered, delayed). Includes return and claim modals.
- **multi-package.html** - Multi-package tracking with expandable cards per package. Uses success icon for delivered packages.
- **index.html** - Entry point (redirects or landing).
- **icons/** - SVG and PNG icon assets. Calendar state icons in `icons/calendar-icons/`. Admin nav icons in `icons/admin-nav/`.

### Key Patterns

- **PostMessage API** for admin-to-preview iframe communication. Admin sends config object via `postMessage`, preview pages listen and update in real-time.
- **`_lastToggledFeature`** config property tracks which toggle (returns/claims) was most recently interacted with, enabling smart modal switching in the preview.
- **`window.__adminConfig`** stores previous state in the preview iframe for comparison.
- **URL params** - `?ref=` on tracking-demo.html to skip search view when coming from search-page.html.
- **State management** via `setState()` function in tracking-demo.html controls which delivery state is shown (shipped, in-transit, delivered, delayed, etc.).
- **View toggling** uses `.hidden` / `.visible` CSS classes.

### Fonts

- Headings: Plus Jakarta Sans (700-800 weight)
- Body: Inter (400-600 weight)
- Admin UI: Montserrat

### Brand Colours

- Primary header: #1F1541 (dark purple)
- Accent/links: #47CD89 (green)
- Admin accent: #6B1AFF (purple)
- Admin highlight: #05E7FF (cyan)

## Admin Panel Details

The admin has a 2-step wizard:
1. **Search Page** - Page title, logo/favicon/hero image uploads, font selection, colour pickers, navigation links, client support (email/phone)
2. **Tracking Page** - Toggle switches for: carrier info, delivery date, delay notifications (with custom message), address notifications (with sub-toggle for customer edit). Returns section with reason categories, success message, failed label message. Claims section with eligibility window, reason categories, confirmation message. Google Tag Manager ID.

Config is sent to the preview iframe on every change. The preview switches between search-page.html (step 1) and tracking-demo.html (step 2).

## Return/Claim Modal Logic

When both returns and claims toggles are on, the preview shows whichever was most recently toggled:
- Returns toggle ON -> shows delivered state + return modal
- Claims toggle ON -> shows delayed state + claim modal
- Disabling one while other is on -> switches to the remaining one's modal
- Tracked via `config._lastToggledFeature`

## Git

- Branch: `Robin-powell-design/study-tracking-demo`
- Remote: https://github.com/Robin-powell-design/conductor-tracking-page.git
- Vercel project: `seoul` under `robs-projects-26a30227`

## Style Notes

- All form inputs should use consistent sizing (`.field-input` class with `padding: 12px`)
- UX text was audited and improved - avoid command-style labels ("Add your X"), use descriptive labels instead ("Page title")
- No truncated hint text - every hint should be a complete, useful sentence
- Consistent capitalisation across toggle titles and card headers
