# CLAUDE.md — ThermoLeak (thermoleak.co.il)

Marketing / lead-generation website for a thermal (infrared) leak-detection service in Israel.
Stack: **Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS v4**. Hebrew, **RTL**, Israeli locale.

> ⚠️ **Business data is placeholder.** Phone, WhatsApp, email, prices, stats, and reviews live in
> [`lib/site.ts`](lib/site.ts) and are invented (see `docs/thermoleak-brief.md`). Replace with real
> values before going live. Anything still assumed is a placeholder, not a fact.

## Build & dev commands

```bash
npm run dev      # local dev server  → http://localhost:3000
npm run build    # production build (must pass with zero TS/ESLint errors)
npm run start    # serve the production build
npm run lint     # ESLint (next/core-web-vitals + typescript)
```

Always run `npm run build` before declaring work done — it type-checks and lints the whole app.

## Code style & guidelines

- **Strict TypeScript.** No `any`. Type every prop with an explicit `interface` / `type`. Components
  are explicit function declarations: `export default function Hero() {…}` or named exports.
- **Server Components by default.** Add `"use client"` only when a component needs state/effects/events
  (currently: `ContactForm`, `Navbar` mobile menu, `StickyContact`).
- **Mobile-first.** Style the base (smallest) case first, then layer `sm:` / `md:` / `lg:` overrides.
- **Descriptive Tailwind.** Group classes logically (layout → spacing → color → state). Reuse the
  design tokens below instead of raw hex.
- **No content in JSX literals.** All Hebrew copy lives in `lib/*` data files and is rendered via
  `{variable}` — this keeps `react/no-unescaped-entities` happy and centralizes content.

## RTL & localization rules (mandatory)

- Document is `<html lang="he" dir="rtl">` (set in `app/layout.tsx`). Never hardcode LTR.
- **Use logical/flow-relative utilities, never physical ones:**
  - padding/margin: `ps-*` / `pe-*` / `ms-*` / `me-*` (start/end) — **not** `pl-*` / `pr-*`.
  - position: `start-*` / `end-*` — **not** `left-*` / `right-*`.
  - text: `text-start` / `text-end` — **not** `text-left` / `text-right`.
- Prefer **`gap-*`** on flex/grid over `space-x-*`. If you must use `space-x-*`, add `space-x-reverse`.
- Icons that imply direction (arrows, chevrons) must point correctly for RTL (e.g. "next" points left).
- **Israeli formats:** currency `₪` (e.g. `₪450`), phones `0XX-XXX-XXXX` (tel link uses `+972…`),
  dates `dd/mm/yyyy`. Helpers/constants in `lib/site.ts`.

## Component rules

- All UI blocks live **flat** in [`components/`](components/) — one component per file, PascalCase.
- Keep components modular and presentational; pull data from `lib/`, don't fetch inside blocks.
- Section blocks (Hero, TrustBar, ServicePillars, Process, Testimonials, FAQ, ContactCTA) are
  composed by `app/page.tsx` in the brief's order:
  **Hero → TrustBar → ServicePillars → Process → Testimonials → FAQ → ContactCTA.**
- Conversion: `StickyContact` is a mobile-only fixed bottom bar (Click-to-Call + WhatsApp).

## Design tokens (defined in `app/globals.css` via `@theme`)

| Token | Value | Use |
|-------|-------|-----|
| `brand` | `#0B3D5C` deep blue | primary buttons (white text), heading accents |
| `brand-dark` | `#082A40` | hovers, dark sections |
| `brand-light` | `#1E88A8` teal | secondary accents |
| `accent` | `#FF6A3D` thermal orange | decorative highlights, icon accents |
| `accent-strong` | `#C2410C` | orange button bg with white text (AA-safe) |
| `ink` | `#1B2733` | body text |
| `paper` | `#F7F9FB` | light section backgrounds |

Fonts: **Heebo** (headings, `font-heading`) + **Assistant** (body, `font-sans`) via `next/font/google`.

## SEO & structured data

- Each route exports `metadata` (or `generateMetadata`) via the Next Metadata API. Set `canonical`
  in `alternates`. `metadataBase` is set in the root layout.
- JSON-LD lives in `lib/jsonld.ts` and is injected with the `<JsonLd>` component:
  **LocalBusiness + WebSite** globally, **Service + BreadcrumbList** on service pages,
  **FAQPage** wherever FAQs render.
- `app/sitemap.ts` and `app/robots.ts` are generated from the routes + `lib/services.ts`.

## Accessibility (WCAG 2.0 AA / IS 5568)

- Semantic landmarks (`header`/`nav`/`main`/`footer`), one `<h1>` per page, logical heading order.
- All interactive elements keyboard-focusable with visible `focus-visible` rings.
- Form fields have associated `<label>`s; errors use `aria-describedby` / `aria-invalid`.
- Maintain ≥4.5:1 text contrast (use the tokens above as vetted). Provide a skip-to-content link.
- An accessibility statement is published at `/accessibility`.
