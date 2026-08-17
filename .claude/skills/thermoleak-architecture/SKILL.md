---
name: thermoleak-architecture
description: Start-here orientation for thermoleak.co.il — the lib/site.ts → lib/services.ts → routes data flow, the flat file map, static-export constraints (no headers, redirects, middleware or API routes), Next 16 async params, the npm scripts, and the deploy truth that every push to main ships to production. Use at the start of any task in this repo, or when unsure where content, routes, metadata or business facts come from. Triggers "where does X live", "how is this site built", "orient me", "architecture", "why is this not working in production".
---

# thermoleak.co.il architecture

טרמוליק — thermal (infrared) leak and moisture detection, גוש דן והמרכז. Hebrew RTL marketing site,
**11 content routes**, Next.js 16 App Router compiled to static HTML. Read this before changing
anything.

## The stack, and what it forbids

**Next 16.2.9** · **React 19.2.4** · TypeScript strict · Tailwind **v4** (CSS-first `@theme` in
`app/globals.css` — **there is no `tailwind.config.ts`**) · `lucide-react` · fonts via
`next/font/google` in `app/fonts.ts`. Flat layout, alias `@/* -> ./*`.

> ⚠️ **`AGENTS.md` at the repo root:** this is not the Next.js you know. Next 16 has breaking changes
> from earlier majors. Check `node_modules/next/dist/docs/` before using a framework API from memory.

```ts
// next.config.ts
output: "export",              // emit a static ./out site (no Node server on cPanel)
trailingSlash: true,           // /services/ -> /services/index.html (Apache-friendly)
images: { unoptimized: true },
```

`output: "export"` **forbids** `headers()`, `redirects()`, `rewrites()`, middleware, API routes, server
actions and ISR. Response headers come from **`public/.htaccess`** at the Apache origin, with Cloudflare
in front. If a task seems to need one of the forbidden APIs, the answer is in `.htaccess` or at the
edge, not in Next.

`app/sitemap.ts` and `app/robots.ts` each carry `export const dynamic = "force-static"` — that line is
what makes them emit at build time under `output: "export"`. Don't delete it as noise.

## Data flow — the thing to internalise

```
Israeli services sites/roster/sites/thermoleak.json   ← fleet manifest: NAP, brand, analytics
        │  (reference only — nothing syncs into this repo automatically)
        ▼
lib/site.ts        site · navLinks · telHref · mailHref · whatsappHref() · canonicalUrl()
        │          ⭐ THE source of truth for NAP, hours, stats, service areas
        ├─► lib/services.ts   the 4 services: copy, steps, benefits, FAQs, keywords
        ├─► lib/faqs.ts       the general FAQ
        ├─► lib/reviews.ts    testimonials + averageRating  ⚠️ PLACEHOLDER DATA
        ├─► lib/jsonld.ts     every JSON-LD builder, reading from the above
        ▼
app/**/page.tsx  →  components/**
```

**Business identity lives in `lib/site.ts`. Wording lives in `lib/services.ts` / `lib/faqs.ts`. Layout
lives in components.** A phone number, email or service name typed into a component is a bug — the repo
is currently clean of them, so any new one is a regression, not a precedent.

**The roster manifest is a reference, not an upstream build input.** Unlike the Cloudflare-Pages sites
in the same fleet, nothing here is generated from `thermoleak.json`. Read it to learn what the fleet
believes is true (its `_needsConfirmation` array is the honest list), then edit `lib/site.ts` by hand.

## Routes — 11 content routes, 13 emitted files

| Route                                                              | Source                          | Count |
| ------------------------------------------------------------------ | ------------------------------- | ----- |
| `/`                                                                | `app/page.tsx`                  | 1     |
| `/services/`                                                       | `app/services/page.tsx`         | 1     |
| `/services/{slug}/`                                                | `app/services/[slug]/page.tsx`  | 4     |
| `/about/` `/reviews/` `/contact/` `/accessibility/` `/privacy/`    | one dir each under `app/`       | 5     |
| `/404/` + `/_not-found/`                                           | `app/not-found.tsx`             | 2     |
| `/sitemap.xml` `/robots.txt`                                       | `app/sitemap.ts` `app/robots.ts`| —     |

The export emits **13** `index.html` files; the sitemap lists **11**. The two extras are the 404
artifacts, correctly excluded — but note the route **emits twice**, as `/404/` and `/_not-found/`, and
`public/.htaccess` points `ErrorDocument 404` at `/404.html`. See backlog §1.1.

The URL taxonomy is **all-English paths with Hebrew content** (`/services/water-leak-detection/`), which
is the opposite of the Hebrew-slug fleet sites. That is the live scheme and it stays — renaming a slug
without a 301 discards its ranking signal, and a static export on Apache means that 301 lives in
`public/.htaccess`.

## The four services

`lib/services.ts` is a single typed array. Each entry drives the card, the detail route, the footer
link, the form `<select>`, the sitemap entry and the `Service` JSON-LD:

| Slug                       | Title                  |
| -------------------------- | ---------------------- |
| `water-leak-detection`     | איתור נזילות מים       |
| `moisture-detection`       | איתור רטיבות ובידוד    |
| `electrical-thermography`  | בדיקת לוחות חשמל       |
| `insurance-reports`        | דו״ח תרמוגרפי לביטוח   |

Adding a service is a data edit, not a routing task — see `/new-service`.

## Next 16 async params — the trap

Dynamic route params are a **Promise**:

```ts
interface PageProps { params: Promise<{ slug: string }> }
const { slug } = await params;          // in the page AND in generateMetadata
```

`app/services/[slug]/page.tsx` does this correctly in both places. A new dynamic route that types
`params` synchronously is a type error at best.

Slugs here are ASCII, so there is no percent-encoding matcher to copy — **but if a Hebrew-slugged route
is ever added, it will need `decodeURIComponent(param).normalize("NFC")` before matching**, or it will
work in dev and 404 in production. See `/new-city`.

## Components — flat, one per file

`components/` has **no subfolders**. Chrome: `Navbar`, `Footer`, `StickyContact`. Primitives:
`Container`, `CtaButton`, `SectionHeading`, `PageHero`, `Breadcrumbs`, `Logo`, `JsonLd`. Sections:
`Hero`, `TrustBar`, `ServicePillars`, `ServiceCard`, `Process`, `Testimonials`, `Faq`, `ContactCTA`.
Form: `ContactForm`. Icons: `WhatsappIcon`, `FacebookIcon`, `InstagramIcon`. Plus `EmailOff` — the
Cloudflare workaround, below.

Only **two** client components exist (`ContactForm`, `Navbar`). The FAQ is deliberately built on native
`<details>/<summary>` so every answer ships in the DOM with zero JS — that is what makes `FAQPage`
schema honest and the content extractable by answer engines. Don't convert it.

## `EmailOff` — the Cloudflare email-obfuscation workaround

Cloudflare Scrape Shield rewrites every address it finds in the served HTML: a `mailto:` becomes
`/cdn-cgi/l/email-protection#…`, which **returns 404** to crawlers and to anyone without JS. Every page
here carries the address, so every page shipped a broken link. `components/EmailOff.tsx` wraps the
address in real `<!--email_off-->` / `<!--email_on-->` HTML comments — emitted via
`dangerouslySetInnerHTML` with build-time constant strings, because JSX comments are compile-time only.
The carrier span is `display: contents` so it adds no box. **Wrap any new visible email in it.**

## Commands

```
npm run dev · build · start · lint
npx tsc --noEmit          # there is no `typecheck` script
```

Build gate: **`npm run lint && npm run build`** — `next build` type-checks the whole app. See
`/qa-build-gate` for the assertions on `out/` that a green build does not cover.

## Deploy — the opposite of the rest of the fleet

**Every push to `main` deploys to production.** `.github/workflows/deploy.yml` builds the export and
rsyncs `./out/` over SSH to the cPanel docroot (`websquadinc` account), then asserts three URLs return
200. Committing to `main` *is* the production action here. See `/deploy-thermoleak`.

## Where to go next

`/seo-metadata` · `/schema-structured-data` · `/hebrew-rtl` · `/local-seo-il` · `/new-service` ·
`/new-city` · `/qa-build-gate` · `/deploy-thermoleak`. The acceptance bars live in `docs/`:
`optimization-backlog.md`, `content-standards.md`, `keyword-map.md`, `schema-graph.md`,
`business-facts.md`.
