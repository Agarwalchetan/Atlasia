# Changelog

All notable changes to Atlasia are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions follow [Semantic Versioning](https://semver.org).

---

## [Unreleased]

---

## [0.5.0] — 2026-03-16

### Added
- **Travel Survival Card** (`/survival-card`) — AI-generated per-country card with real tap-to-call emergency numbers, 6 survival phrases with TTS + copy, local rules with category badges, payment info, safety tips, and a quick-info strip (timezone, voltage, visa, water). 14 popular destination quick-picks.
- **Food Explorer** (`/food-explorer`) — 6–8 iconic local dishes per destination with description, flavour profile, where to try, dietary tags, and price range. Expandable cards reveal ordering phrases in the local language with TTS + copy. 10 popular destination quick-picks.
- **Ask Atlasia AI Chat** (`/chat`) — multi-turn AI travel assistant with optional destination context, 8 suggested questions, full markdown rendering (bold, code, bullets, headings), Shift+Enter for newline, auto-scroll, and clear button.
- **Browser language auto-detection** — `src/lib/language-context.tsx` now detects the user's browser language via `navigator.languages` on first mount. Shows a dismissable teal banner: *"Interface language set to [Language] based on your browser"*. Manual language changes are saved to `sessionStorage` and skip future detection.

### Changed
- **Navbar** (`src/components/layout/navbar.tsx`) — all 8 routes flat on desktop with short labels (`Map | Guide | Phrases | Conversation | Emergency | Survival | Food | Ask Atlasia`). **Ask Atlasia** styled as a glowing teal CTA (`bg-gradient-to-br from-teal-500 to-teal-600`, `shadow-[0_0_12px_rgba(20,184,166,0.35)]`). Removed the "More" dropdown. Mobile menu retains full labels with the same gradient CTA at the bottom.
- **Home page** (`src/app/page.tsx`) — added feature cards for Survival Card, Food Explorer, and Ask Atlasia. Fixed `key={i}` on features map to prevent stale-key collisions during translation.

### Fixed
- **Conversation page** (`src/app/conversation/page.tsx`) — flag icon IDs (Iconify strings like `circle-flags:gb`) were rendering as raw text in three places: the language selector labels, the `RecorderPanel` avatar, and the conversation history bubbles. Replaced with `<Icon>` from `@iconify/react` throughout. Added a custom `LangSelect` component that renders flag icons natively inside a `<select>` wrapper. Removed unused `Button` import that was triggering a Turbopack dev-server parse error.

---

## [0.4.0] — 2026-03-16

### Added
- Footer attribution: "Developed with love by Chetan Agarwal" with GitHub profile and project repository links
- `DEPLOYMENT.md` — comprehensive Vercel deployment guide with self-hosting, troubleshooting, and plan requirements
- `CONTRIBUTING.md` — development setup, design system rules, branching strategy, and PR process
- `CHANGELOG.md` — this file
- `vercel.json` — Vercel deployment config with `bun install`/`bun run build` overrides and per-route `maxDuration` settings

### Changed
- `README.md` — complete rewrite with full feature docs, tech stack table, project structure, env var reference, API routes table, and deploy guide
- `.gitignore` — added `!.env.example` exception so the template file is tracked by git
- `next.config.ts` — removed stale `api.mapbox.com` image hostname (project uses MapLibre/MapTiler); added `api.maptiler.com`

---

## [0.3.0] — 2026-03-15

### Fixed
- **Map canvas not full-screen** — added `html, body { height: 100% }` to `globals.css` to establish the height chain; added `style={{ width: '100%', height: '100%' }}` inline to container divs in both `map-canvas.tsx` and `map-leaflet-canvas.tsx` (MapLibre and Leaflet ignore Tailwind height classes)
- **Icon rail showing wrong items** — replaced hardcoded "Saved / Recents / Get app" placeholder items with actual app navigation routes (Map, Guide, Phrases, Chat, SOS); added `usePathname()` for active state; uses `<Link>` for navigation

---

## [0.2.0] — 2026-03-14

### Added
- **Google Maps-style `/map` layout** — full-bleed 100vh, zero scroll, navbar hidden on map route
  - Left icon rail (56px fixed) with logo and app nav items
  - Floating pill-shaped search bar with amber focus ring
  - Horizontal category filter pills with staggered `pill-fade-in` animation
  - Left sliding place detail panel (380px, 3 tabs: Overview / Navigate / About)
  - Bottom-right floating map controls (zoom, my location, street view)
  - Bottom quick-select location chips
- **Modular map architecture** — split monolithic 590-line `map-component.tsx` into 9 focused modules: `map-types`, `map-geocoding`, `map-search-bar`, `map-icon-rail`, `map-category-pills`, `map-place-panel`, `map-controls`, `map-canvas`, `map-leaflet-canvas`

### Changed
- `client-layout.tsx` — conditionally hides navbar when pathname is `/map`

---

## [0.1.0] — 2026-03-13

### Added
- **Platform-wide visual redesign** with amber / teal / stone design system
  - Design tokens: Sora (headings), Inter (body), DM Mono (pronunciation/mono)
  - Color palette: `amber-500/600` primary, `teal-400/500` secondary, `stone-950` base
  - Custom `@theme inline` Tailwind v4 configuration in `globals.css`
- **UI component library** — `button`, `card`, `badge`, `input`, `select`, `tabs`, `loading` in `src/components/ui/`
- **6 page redesigns**: Home, Map, Travel Guide, Phrases, Conversation, Emergency
- **Navbar redesign** with language selector, active route highlighting, mobile-responsive

---

## [0.0.1] — Initial Release

### Added
- Next.js 16 App Router project scaffold
- Multi-provider AI system (`src/lib/ai-provider.ts`) — OpenAI, Google Gemini, Groq switchable via env vars
- MapLibre GL (globe mode) with Leaflet + OpenStreetMap fallback
- Nominatim geocoding (free, no key required)
- OpenStreetMap Overpass API for nearby places (free, no key required)
- Lingo.dev localization across all API routes and UI
- 9 API routes: translate, translate-ui, phrases, travel-guide, itinerary, cultural-intelligence, nearby-places, speech/transcribe, speech/tts
- Groq Whisper STT support (`SPEECH_PROVIDER=groq`)
- 15-language support across all features
- Emergency contacts, phrase translator, and medical alert card
- Animated home page with stats counter, feature showcase, and CTA

[Unreleased]: https://github.com/AgarwalChetan/Atlasia/compare/v0.5.0...HEAD
[0.5.0]: https://github.com/AgarwalChetan/Atlasia/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/AgarwalChetan/Atlasia/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/AgarwalChetan/Atlasia/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/AgarwalChetan/Atlasia/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/AgarwalChetan/Atlasia/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/AgarwalChetan/Atlasia/releases/tag/v0.0.1
