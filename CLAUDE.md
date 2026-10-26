# CLAUDE.md — טרמוליק / ThermoLeak (thermoleak.co.il) project rulebook

> The operating manual for any AI agent (and human) working in this repo. Project rules here
> **override** global defaults. When this file and the code disagree, fix the code. When this file and
> `Israeli services sites/roster/sites/thermoleak.json` disagree about a business fact, check
> [docs/business-facts.md](docs/business-facts.md) — it records which source won and why.

---

## 1. Business context

- **Business:** טרמוליק (ThermoLeak) — thermal/infrared **leak and moisture detection**. Non-destructive
  diagnosis with a thermal camera, plus reports for insurance claims.
- **No public premises.** Service-area business: "שירות עד בית הלקוח — אין צורך להגיע למשרד".
- **Phone (click-to-call):** `055-660-1006` · WhatsApp same number · `info@thermoleak.co.il`.
  **These are real** (fleet values, confirmed in the roster).
- **Hours:** ראשון–חמישי 08:00–18:00, שישי 08:00–13:00, plus out-of-hours for active leaks.
- **Service area:** גוש דן והמרכז core, plus national service by prior arrangement — reach is ~2 hours' drive from Tel Aviv (confirmed 2026-09-17; the old "~60 km" was never confirmed and understated it). 12 named cities. **3 have location pages**
  (תל אביב, חולון, בת ים — doorway gate run 2026-08-24, shipped 2026-08-30 in `7c9bbda`); the other
  9 are served without a page and are gated in business-facts §E.
- **Founded:** 2015 — the **business** is 11 years old.
- **Founder / owner:** רונן דהן — **confirmed** 2026-08-24 (business-facts §A). He is the byline on
  the `/guides/` articles and the `founder` in `LocalBusiness`. **In the trade since ~2005** and a
  **two-person team** (both confirmed 2026-09-17). His **certification and ח.פ. are confirmed not to
  exist**; photo permission is still open.
  > ⚠️ **Keep the two experience numbers apart.** `site.stats.years` reads "20+ שנות ניסיון **בשטח**"
  > — that is the founder's field experience, not the company's age. "20 years in business" is false.
- **Audience:** homeowners mid-crisis (a damp stain, a jumped water bill), ועדי בתים, property managers,
  loss adjusters, businesses needing electrical-panel scans.
- **Core promise:** find the **source**, not the symptom — without breaking walls — and hand over a
  report an insurer accepts.
- **Conversion goals, in order:** (1) phone call, (2) WhatsApp, (3) contact form. Every page keeps a
  call/WhatsApp action within reach; `StickyContact` is a mobile-only fixed bottom bar.

> ⚠️ **What is still placeholder.** Phone, WhatsApp and email are **real**. So are the **founder**
> and the **guarantee's scope** — both confirmed 2026-08-24 (business-facts §A/§C) and **published**:
> `site.guaranteeTerms` renders through `components/GuaranteeTerms.tsx` on `/pricing/`, so an agent
> must not re-gate them as unverified. **Confirmed 2026-09-17** (business-facts §A/§B/§C/§E): the
> **₪350** starting price, the **FLIR E8** camera, a **two-person team**, the founder in the trade
> since **~2005**, **third-party insurance**, **national service by prior arrangement** with a reach
> of **~2 hours' drive from Tel Aviv**, and that **tax invoices are issued**.
>
> **Confirmed ABSENT the same day — these are answers, not gaps.** There is **no ח.פ. and no company
> registration** (so `legalName` is `טרמוליק`, never `טרמוליק בע״מ`), **no thermography
> certificate** (the "Thermography Level 1" badge was deleted; `site.certifications` is now
> `site.credentials` and holds only concrete capabilities), and **no accessibility coordinator**
> (`/accessibility/` no longer asserts one). **Never refill any of the three.**
>
> Still unverified: **what the ₪350 visit includes/excludes**, **report turnaround as a number**,
> and **accepted payment methods**. Purged 2026-08-17 and not to be reintroduced without sources:
> the six fabricated testimonials and their 4.9 rating, the 3,000+/97% stats, the placeholder `geo`,
> and the facebook.com/instagram.com `sameAs` links. See
> [docs/business-facts.md](docs/business-facts.md). **Never present an unconfirmed value as fact.**

---

## 2. Golden rules

1. **Never fabricate a business fact.** Years, prices, job counts, success rates, warranty terms,
   licences, insurance, ratings, reviews, certifications, customer names. If it is not in `lib/site.ts`,
   the roster manifest, or [docs/business-facts.md](docs/business-facts.md), mark it `// 🔶 confirm` and
   add a row to that file. **Fabricated reviews or ratings are a Google policy violation, not a style
   problem** — and this site is already carrying that cost once (rule 3).
2. **Business facts come from `lib/site.ts`, never hardcoded in components.** Import `site`, `navLinks`,
   `telHref`, `mailHref`, `whatsappHref()`, `canonicalUrl()`. The repo is currently **clean** of NAP
   literals; a new one is a regression, not a precedent.
3. **No reviews, ratings or testimonials without a verifiable public source.** The six fabricated
   testimonials, the `/reviews/` page and the 4.9 `aggregateRating` they fed were **removed
   2026-08-17** (`/reviews/` now 301s to `/about/` via `public/_redirects`). Reintroducing any of
   them — including "sample data" — without real, sourced reviews is a stop-ship. The legitimate
   source is a Google Business Profile: see [docs/business-facts.md](docs/business-facts.md) §B.
4. **Pushing to `main` does NOT deploy.** Production is **Cloudflare Pages** (project `thermoleak`),
   direct upload via wrangler, since the 2026-08-02 fleet cutover. `.github/workflows/deploy.yml`
   is build-only CI. The old rsync path ran green for 15 days while deploying to a retired server —
   see §10 before believing anything about deployment.
5. **No page ships under the content bar in [docs/content-standards.md](docs/content-standards.md).**
   A service or location page a find-and-replace could regenerate is a doorway page.
6. **The FAQ stays `<details>`-based.** Native `<details>/<summary>` keeps every answer in the DOM with
   zero JS, which is what makes `FAQPage` schema honest and the content extractable by answer engines.
   Converting it to client state breaks both.
7. **Wrap every visible email in `<EmailOff>`.** Cloudflare Scrape Shield rewrites bare `mailto:` links
   into a URL that **404s**. `components/EmailOff.tsx` exists solely to prevent that — don't "clean it up".
8. **Headers and redirects live in `public/_headers` and `public/_redirects`** (Cloudflare Pages
   format). There is no `.htaccess` — this stopped being an Apache/cPanel site at the 2026-08-02
   cutover, and adding one does nothing.
9. **Read `AGENTS.md`.** This is Next.js **16** — breaking changes from earlier majors. Check
   `node_modules/next/dist/docs/` before using a framework API from memory. Dynamic route `params` are a
   **Promise**.
10. **Never edit generated output** — `node_modules/`, `.next/`, `out/`. And never audit `out/` without
    checking it is newer than the last commit; it is routinely stale.

---

## 3. Stack

Next.js **16.2.9** App Router · React **19.2.4** · TypeScript strict · Tailwind **v4** (CSS-first
`@theme` in `app/globals.css` — **there is no `tailwind.config.ts`**) · `lucide-react` · fonts via
`next/font/google` in `app/fonts.ts`. Flat layout (no `src/`), path alias `@/* -> ./*`.

**`next.config.ts` — the constraints that shape everything:**

```ts
output: "export",              // emit a static ./out site — deployed to Cloudflare Pages
trailingSlash: true,           // /services/ -> /services/index.html (directory-style URLs)
images: { unoptimized: true }, // next/image works without a server
```

**Static export forbids** `headers()`, `redirects()`, `rewrites()`, middleware, API routes, server
actions and ISR. Response headers come from **`public/_headers`** and redirects from
**`public/_redirects`** — Cloudflare Pages mechanisms, because Pages **is** the origin since the
2026-08-02 cutover. There is no `.htaccess`; the Apache/cPanel origin is retired.

`app/sitemap.ts` and `app/robots.ts` each carry `export const dynamic = "force-static"`. That line is
what makes them emit at build time; don't delete it as noise.

**`public/llms.txt` is hand-maintained on purpose.** Generating it from `lib/site.ts` would need a
GET route handler, which this config forbids — so do **not** propose one. The cost of that is drift:
the file sat unchanged from 2026-08-17 through two sprints and never learned that `/guides/` or
`/locations/` existed. **Adding or removing an indexed route means editing `public/llms.txt` in the
same commit**, and its URL list must stay a subset of `app/sitemap.ts`.

---

## 4. Layout

```
app/
  layout.tsx              # metadata, fonts, JSON-LD, skip link, <html lang="he" dir="rtl">
  page.tsx                # homepage — FAQPage JSON-LD; its title must be COMPLETE (see §9)
  sitemap.ts robots.ts    # /sitemap.xml, /robots.txt
  not-found.tsx           # 404
  services/page.tsx       # services index
  services/[slug]/        # 4 pages — Service + FAQPage JSON-LD, answer block, honest-limits section
  pricing/                # /pricing/ — the money-intent page, renders from lib/pricing.ts
  guides/ guides/[slug]/  # knowledge hub — 3 articles; FAQPage DERIVED from lib/articles.ts blocks
  locations/ locations/[city]/  # local silo — 3 gated cities only (lib/locations.ts)
  thank-you/              # noindex post-form conversion page; absent from the sitemap on purpose
  about/ contact/ accessibility/ privacy/
components/               # FLAT — 28 files, one component per file, PascalCase, no subfolders
  Navbar Footer StickyContact          # chrome
  ConsentBanner                        # the Consent Mode v2 question (client, §7)
  Container CtaButton SectionHeading PageHero Breadcrumbs Logo JsonLd
  Hero TrustBar MethodExplainer ServicePillars ServiceCard Process Faq ContactCTA
  ServiceChooser                       # homepage symptom→service decision aid (lib/services.ts)
  Gallery                              # homepage scene pairs (lib/gallery.ts) — AI images; no label of any kind (owner, 2026-10-26)
  ArticleBody                          # renders the typed blocks — the reason FAQPage can be DERIVED
  GuaranteeTerms                       # the bounded guarantee on /pricing/, from site.guaranteeTerms
  ContactForm ThankYouContent          # the form + its post-submit page
  Analytics                            # the ONLY third-party script — GTM from site.analytics.gtmId
  EmailOff                             # Cloudflare Scrape Shield workaround
  WhatsappIcon
  live/Live.tsx                        # the ONE subfolder: the fleet live-kit's server components (§14)
lib/
  site.ts       # ⭐ NAP, hours, service areas, trust stats, helpers (telHref, whatsappHref, canonicalUrl)
  services.ts   # ⭐ the 4 services — copy, answer blocks, limits, steps, FAQs, keywords
  faqs.ts       # the general FAQ
  pricing.ts    # /pricing/ copy — per-service prices stay in services.ts, never restated here
  articles.ts   # /guides/ typed blocks — FAQPage is DERIVED from them, so schema cannot drift
  locations.ts  # ⭐ the 3 gated cities. READ its header before adding a 4th
  gallery.ts    # the homepage gallery: files, alt text, provenance — scripts/optimize-gallery.mjs reads it
  jsonld.ts     # every JSON-LD builder
  live/         # fleet live-kit copies — byte-locked, never edit (§14)
content/live/   # ⭐ the live registers: _campaigns.mjs, _updates.mjs (+ the synced calendar) (§14)
live.config.mjs # the live surfaces' calm / no-card pages, NAP restated, this site's ⛔ claim stems (§14)
public/         # copied verbatim into out/ — _headers, _redirects, llms.txt, og.png, images/
                #   assets/live.js is a fleet live-kit copy (§14)
scripts/        # check-sitemap-parity.mjs (`npm run check:sitemap`), keep-previous-assets.mjs (postbuild, §10)
                #   optimize-gallery.mjs — assets/gallery/ masters → public/images/gallery/*.webp (by hand)
  live/         # the live-kit gates (prebuild + postbuild) and the weekly reminder (§14)
assets/gallery/ # gallery masters: gitignored, never shipped — its README.md is the per-image register
docs/           # the acceptance bars every agent cites
```

`/reviews/` and `lib/reviews.ts` were **removed 2026-08-17** (fabricated testimonials — golden rule
3); the URL 301s to `/about/` in `public/_redirects` until real reviews exist.

Sibling components import each other **relatively** (`./Container`); anything from `lib/` uses the `@/`
alias. Match that.

---

## 5. Data flow & source of truth

```
Israeli services sites/roster/sites/thermoleak.json   ← fleet record; REFERENCE ONLY, nothing syncs
        ▼
lib/site.ts        site · navLinks · telHref · mailHref · whatsappHref() · canonicalUrl()
        ├─► lib/faqs.ts · lib/pricing.ts          (import site directly)
        ├─► lib/services.ts · lib/articles.ts · lib/locations.ts   (content only, no site import)
        ├─► lib/jsonld.ts     (site + the Service / Article / Location shapes above)
        ▼
app/**/page.tsx  →  components/**
```

**Identity and NAP live in `lib/site.ts`. Wording lives in `lib/services.ts` / `lib/faqs.ts`. Layout
lives in components.** Copy never gets typed directly into JSX — components render `{variable}`, which
keeps `react/no-unescaped-entities` quiet and centralises content.

The roster manifest is **not** an upstream build input (unlike the Cloudflare Pages sites in the same
fleet). Read it to learn what the fleet believes is true — its `_needsConfirmation` array is the honest
list — then edit `lib/site.ts` by hand and keep the two in sync.

---

## 6. RTL & localization — NON-NEGOTIABLE

- `<html lang="he" dir="rtl">` is set in `app/layout.tsx`. Do not remove it.
- **Logical Tailwind utilities ONLY** for horizontal spacing/positioning: `ps-*`/`pe-*`, `ms-*`/`me-*`,
  `start-*`/`end-*`, `text-start`/`text-end`, `rounded-s-*`/`rounded-e-*`, `border-s-*`/`border-e-*`.
  **BANNED:** `pl-* pr-* ml-* mr-* left-* right-* text-left text-right`. The only exception is a
  genuinely direction-agnostic case, which must carry an explanatory comment.
  **The repo currently has zero violations — keep it that way.**
- Prefer `gap-*` on flex/grid over `space-x-*`. If you must use `space-x-*`, add `space-x-reverse`.
- Let `dir="rtl"` mirror flex/grid — don't force `flex-row-reverse` except to wrap an LTR island.
- **LTR islands use `dir="ltr"` on the element.** There is **no `.ltr` CSS helper** in this repo; the
  attribute is the whole mechanism. Apply it to phone numbers, emails, URLs and prices.
- Directional icons must point correctly for RTL — "next" points **left** (`ArrowLeft`).
- Hebrew punctuation: גרש `׳` and גרשיים `״` in abbreviations (`דו״ח`, `ק״מ`, `בע״מ`), never ASCII
  quotes. The repo is consistent about this; match it exactly.
- **Israeli formats:** currency `₪350` (symbol first — the existing convention), phones `0XX-XXX-XXXX`
  (`tel:` uses `+972…`), dates `dd/mm/yyyy`, ranges with an en dash.

See the `hebrew-rtl` skill for the full rule set.

---

## 7. Code style

- **Strict TypeScript.** No `any` (use `unknown` + narrowing). No non-null `!` to silence the compiler —
  handle the null case, as `getService()` + `notFound()` already do.
- **Explicit function declarations:** `export default function Hero() {…}`. Type every prop with an
  explicit `interface`/`type`.
- **RSC by default.** Add `"use client"` only for state, effects or browser APIs, kept leaf-level.
  Currently client: **`ContactForm`**, **`Navbar`**, **`ThankYouContent`** (sessionStorage) and
  **`ConsentBanner`** (the Consent Mode v2 choice, in `localStorage`) —
  those four only. (The live surfaces' browser behaviour is the static `public/assets/live.js`,
  not a component — §14.) Note Next 16's lint rejects synchronous `setState` inside `useEffect`
  (`react-hooks/set-state-in-effect`); for client-only reads use `useSyncExternalStore`, as
  `ThankYouContent` does.
- **Mobile-first.** Style the base case first, then layer `sm:`/`md:`/`lg:`.
- **Descriptive Tailwind**, grouped logically (layout → spacing → color → state). Use the `@theme`
  tokens — **never hardcode a brand hex**. The only accepted raw hexes are non-brand colours with no
  token (WhatsApp green `#25D366`, the `accent-strong` hover `#9a3412`).
- Components PascalCase; utilities camelCase; `@/*` alias for `lib/`, relative for sibling components.

---

## 8. Design tokens (defined in `app/globals.css` via `@theme`)

| Token           | Value                    | Use                                                | Contrast on white |
| --------------- | ------------------------ | -------------------------------------------------- | ----------------- |
| `brand`         | `#0B3D5C` deep blue      | primary buttons (white text), heading accents      | ≈11.4:1 ✅        |
| `brand-dark`    | `#082A40`                | hovers, dark sections                              | —                 |
| `brand-light`   | `#1E88A8` teal           | focus ring, secondary accents                      | ≈4.1:1 ⚠️ UI only |
| `accent`        | `#FF6A3D` thermal orange | **decorative highlights, icon accents only**       | ≈2.8:1 ❌ no text |
| `accent-strong` | `#C2410C`                | orange button bg with white text (AA-safe)         | ≈5.2:1 ✅         |
| `ink`           | `#1B2733`                | body text (`ink/70` ≈5.7:1 ✅, `ink/50` ≈3.1:1 ❌) | ≈14:1 ✅          |
| `paper`         | `#F7F9FB`                | light section backgrounds                          | —                 |

The split between `accent` (decoration) and `accent-strong` (text-bearing) is deliberate and is what
keeps the CTAs AA-compliant. Don't collapse it.

Fonts: **Heebo** (headings, `font-heading`) + **Assistant** (body, `font-sans`) via `next/font/google`.

---

## 9. SEO, schema & accessibility

- Each route exports `metadata` (or `generateMetadata`) with `alternates.canonical` including a
  **trailing slash**. `metadataBase` is set once in the root layout.
- **Titles:** the root `template` appends `| טרמוליק`, so a page writes the bare subject — with one
  standing exception: **`app/page.tsx` must write a COMPLETE title including the brand**, because a
  layout's template does not apply to its own page. Both historical bugs (brandless homepage,
  double-branded `/about/`) were fixed 2026-08-17. See the `seo-metadata` skill and backlog §2.1.
- **JSON-LD** lives in `lib/jsonld.ts`, injected via `<JsonLd>`: **LocalBusiness + WebSite** globally,
  **Service + FAQPage** on service pages, and **`BreadcrumbList` emitted by `PageHero` itself** from
  the same `crumbs` array the visible trail renders — pages must never call `breadcrumbJsonLd`
  directly (double emission). Target graph: [docs/schema-graph.md](docs/schema-graph.md).
  `Review`/`AggregateRating` ship **only** when sourced — enforced since 2026-08-17.
- **Accessibility: WCAG 2.0 AA + IS 5568**, and a statement is published at `/accessibility/`. Semantic
  landmarks, one `<h1>` per page, visible `:focus-visible` rings, labelled fields with
  `aria-describedby`/`aria-invalid`, a skip link, ≥4.5:1 text contrast. **A contrast regression also
  makes a published statement false** — treat it as more than a pixel.

---

## 10. Deploy — read this before shipping

**Production is Cloudflare Pages (project `thermoleak`), direct upload via wrangler. Pushing to
`main` deploys nothing** — `.github/workflows/deploy.yml` is build-only CI.

```powershell
# preview — safe, changes nothing
powershell -File "c:/Users/robiu/antigravity/Projects/Israeli services sites/ops/deploy-site.ps1" -Domain thermoleak.co.il -DryRun
# execute — only after the user asks
powershell -File "c:/Users/robiu/antigravity/Projects/Israeli services sites/ops/deploy-site.ps1" -Domain thermoleak.co.il -Confirm
```

The ops script resolves the Pages project from the fleet roster, runs a **drift check** (asks the
Cloudflare API whether the project actually serves this domain), busts the npm/`.next` staleness
traps, builds, gates `out/`, preserves `out.prev/` for rollback, deploys, and appends a row to the
**fleet hub's** deploy log — `Israeli services sites/logs/deploys.csv`, one directory above the ops
script. **That log is outside this repo; there is no `logs/` here** and creating one logs nothing.
Credentials come from the Sys Admin control plane, never this repo.

**The cautionary tale (2026-08-02 → 2026-08-17):** the DNS was cut over to Pages on 2026-08-02, but
this repo's rsync workflow kept running — green — against the retired cPanel server for fifteen
days. Every "successful deploy" in that window never reached production. That is why the drift
check exists and why this section must never be edited from memory: **verify the origin, then
believe it.**

- **Rollback:** `out.prev/` + `npx wrangler pages deploy .\out.prev --project-name thermoleak
--branch main`, or the Pages dashboard's previous-deployment rollback. `out.prev/` lacks the newest
  build's chunks, so carry them in first: `robocopy out\_next\static out.prev\_next\static /E /XC /XN /XO`.
- HTML is served `DYNAMIC` by Pages; assets are content-hashed and cached immutable via
  `public/_headers`. There is nothing to purge on deploy.
- **A deploy must not delete chunks that already-crawled HTML still needs.** Google renders crawled
  HTML later, from a queue, and a Pages deploy replaces every file — the 2026-10-12 build's chunks
  answered 404 the day after the 2026-10-13 deploy. On gagoline.co.il (same stack, same script) such a
  late render most likely gave Google Next's "Application error" page, and Google filed that homepage
  under an unrelated site's canonical. `scripts/keep-previous-assets.mjs` (postbuild, since
  2026-10-19, ported from gagoline) keeps every build's `/_next/static` in the gitignored
  `.static-archive/` and carries it into each export for 60 days after that build stopped being live.
  Never delete `.static-archive/` — a fresh clone or another machine starts it empty. `-DeployOnly`
  skips postbuild, so it carries nothing; and a local build that was never deployed is archived and
  shipped too (harmless JS/CSS — to purge one, delete its files from `.static-archive/`, `out/` and
  `out.prev/`).

Run `/qa-build-gate` before shipping. **Deploying is a production mutation — always ask first.**
See the `deploy-thermoleak` skill.

---

## 11. Commands

| Task             | Command                                                       |
| ---------------- | ------------------------------------------------------------- |
| Dev server       | `npm run dev`                                                 |
| Production build | `npm run build`                                               |
| Serve the build  | `npm run start`                                               |
| Lint             | `npm run lint`                                                |
| Type-check       | `npx tsc --noEmit`                                            |
| Sitemap parity   | `npm run check:sitemap` (reads `out/` — build first)          |
| Live draft build | `LIVE_DRAFT=1 npm run build` — local preview only (§14)       |
| Live reminder    | `npm run live:remind` (prints; pushes only with `NTFY_TOPIC`) |

There is no `typecheck` or `format` script. **Build gate: `npm run lint && npm run build`** — `next
build` type-checks the whole app. Always run it before declaring work done. `npm run build` also
runs the live-kit gates (§14) in `prebuild` and `postbuild`, then carries earlier builds' chunks into
`out/` (`scripts/keep-previous-assets.mjs`, §10). The live-kit gates fail on unapproved live wording, so
a draft can only be previewed with `LIVE_DRAFT=1 npm run build` — and a draft `out/` (it carries
`out/.live-draft`) must never be deployed. `ops/deploy-site.ps1` refuses it, `-DeployOnly` included
(fixed 2026-10-12), and discards a draft `out/` instead of rotating it into `out.prev/`, the
rollback copy.

A `Stop` hook at `.claude/hooks/format-changed.ps1` formats changed files with Prettier — it is a
**no-op until `prettier` is added as a devDependency**, by design (`--no-install` never downloads one).

---

## 12. Scope guardrails

- Implement real UI, sections, or content only when asked. Don't opportunistically redesign.
- **Don't build the 12 location pages.** Build 3–5 that pass the doorway test, or none. See `/new-city`.
- Don't add dependencies without a reason that survives "can the platform already do this?" The runtime
  dependency list is four packages; keep it that way.
- **No PII in tracking — and the `href` counts as tracking.** Never push a visitor's name, phone,
  address or message text into the `dataLayer`; the contact form has all of them in scope at submit
  time. The same ban covers **any element carrying `data-cta`**: GTM's built-in Click URL variable
  copies the whole `href` into `gtm.elementUrl` and GA4's `link_url`, so a WhatsApp link prefilled
  with the lead's details leaks them to analytics just by being clicked. Build the personalised URL
  in an `onClick` and keep the tagged `href` generic. **Finding SEC-3 — fixed 2026-09-17 in
  `components/ThankYouContent.tsx`**, which now renders the generic `whatsappHref()` and opens the
  prefilled conversation from its click handler. That file is the worked example; copy its shape.
- Cloudflare zone settings (AI crawler policy, Scrape Shield, cache rules) are **the owner's to
  change**. Document the exact toggle; never assume it was done.

---

## 13. The environment in `.claude/`

**Agents** (`.claude/agents/`) — `seo-auditor`, `schema-auditor`, `eeat-trust-auditor`,
`local-seo-strategist`, `aeo-geo-strategist`, `perf-a11y-auditor`, `security-auditor`,
`ts-react-reviewer`, `cro-conversion-auditor` (all read-only), plus `rtl-frontend-engineer` and `hebrew-copywriter` (which edit).

**Skills** (`.claude/skills/`) — start with `thermoleak-architecture`. Then `seo-metadata`,
`schema-structured-data`, `hebrew-rtl`, `local-seo-il`, `aeo-answer-content`, `internal-linking`,
`conversion-cro`, `tracking-analytics`, `performance-web-vitals`, `responsive-accessibility`,
`web-security-headers`, `i18n-bilingual`, `new-service`, `new-city`, `new-article`, `qa-build-gate`,
`deploy-thermoleak`.

**The acceptance bars** live in `docs/` — start at [docs/README.md](docs/README.md), which maps them.
Every agent cites them by section number.

_State_ — what is true now: [optimization-backlog.md](docs/optimization-backlog.md) (the ranked
register — **keep its numbering stable**) · [business-facts.md](docs/business-facts.md) (**the one
file an agent may not fill in**) · [implementation-roadmap.md](docs/implementation-roadmap.md) (the
sprint sequence and what each is blocked on).

_Specification_ — the concrete target: [content-standards.md](docs/content-standards.md) ·
[keyword-map.md](docs/keyword-map.md) · [schema-graph.md](docs/schema-graph.md).

_Strategy_ — why and in what order: [seo-geo-aeo-strategy.md](docs/seo-geo-aeo-strategy.md) ·
[eeat-and-trust.md](docs/eeat-and-trust.md) · [ux-cro-security.md](docs/ux-cro-security.md) ·
[performance-guidelines.md](docs/performance-guidelines.md) ·
[accessibility-and-i18n.md](docs/accessibility-and-i18n.md) ·
[mobile-ux-and-personalization.md](docs/mobile-ux-and-personalization.md) ·
[data-tracking-infrastructure.md](docs/data-tracking-infrastructure.md).

---

## 14. Live surfaces — the announcement bar, the seasonal card, the updates strip

Fleet live-kit (owner decision 2026-10-11: every fleet site gets the bar, the card and the strip,
the card overriding any no-popup rule, under the 3locksmiths pilot's rules). Canonical in
`../3locksmiths.co.il/fleet/live-kit/` — read its README. Every page carries a thin announcement bar
above the sticky header (in flow, **not** sticky) whose line is chosen before first paint by the
Israeli calendar — memorial days and fasts silence it, Shabbat and chag silence the seasonal lines —
and by the fleet status switch (`https://imgquarry.com/status/fleet.json`: quiet / reduced / off).
One seasonal card: a native `<dialog>` — 2nd page of a visit (after 4 s) or 20 s plus a scroll on
the first, never from a search engine, once per 14 days, never on calm or no-card pages, never while
a form field has focus, the mobile menu is open or the consent question is unanswered — and at any
hour the calendar allows, evenings included (owner, fleet decision 2026-10-12). The homepage
shows an updates strip after the method explainer; it hides itself 45 days after the newest item.

- **Edit here:** `content/live/_campaigns.mjs` (the lines, their windows, the card) and
  `content/live/_updates.mjs` — wording only from sentences the site already shows, each quoted in
  `source` (a `lib/articles.ts` / `lib/services.ts` quote must link to the page that shows it — the
  gate checks the slug it sits under); nothing 🔶, no hours, availability, emergency, speed, price,
  the guarantee's slogan, coverage, credentials, counts or reviews — the business is closed on
  Shabbat and its out-of-hours service is unconfirmed. Calm / no-card pages, the NAP and this site's
  own ⛔ claim stems: `live.config.mjs`. Both registers need the owner's
  `approved: "YYYY-MM-DD — who, how"`, or the build fails (`LIVE_DRAFT=1 npm run build` previews a
  draft locally only — never deploy that output).
- **This is the one exception to §5's "wording lives in lib/":** the registers are fleet data
  checked by their own gates. The markup comes from `lib/live/render.mjs` through
  `components/live/Live.tsx` (server components; no new client component — the behaviour is the
  static `public/assets/live.js`).
- **NAP:** there is no `site.config.json` here, so `live.config.mjs` restates the phone and WhatsApp
  numbers for the kit's gates; `lib/site.ts` stays the one source — `Live.tsx` refuses to build
  when the two disagree. A number change is two edits, and the build says so.
- **Never edit:** `lib/live/**`, `scripts/live/**`, `public/assets/live.js`,
  `content/live/_calendar*.json`, `live-kit.lock.json` — byte-locked kit copies;
  `scripts/live/check-live-copy.mjs` fails the build if they change. Fix the kit upstream and re-sync.
- **Wiring:** `<LiveHead/>` first in the explicit `<head>`, `<LiveTopBar/>` after the skip link and
  before `<Navbar/>`, `<LiveDialogs/>` last in `<body>`, `suppressHydrationWarning` on `<html>`,
  `<LiveUpdates/>` after `<MethodExplainer/>`, the 404 page marks itself calm
  (`data-live-calm-page`). `--live-*` colours and the 768–991 px override (this site's mobile layout
  ends at Tailwind `md`, the kit's at 992 px — the band gets the kit's desktop rules) at the end of
  `app/globals.css`. `data-live-block` on the open mobile menu (`components/Navbar.tsx`), on the
  consent banner while it asks, and on `<html>` from before first paint for a visitor with no
  stored consent answer — the inline `live-consent-block` script after `<LiveHead/>` in
  `app/layout.tsx` (the server cannot know who answered, so a returning visitor who did is never
  held back); `ConsentBanner` lifts it when the visitor answers (the kit README, step 5).
- **Gates:** `prebuild` = check-live-copy → check-live-register → check-live-schedule;
  `postbuild` = check-live-out (the built pages must carry exactly what the registers say), then
  keep-previous-assets (§10), which must run after it. CI
  (`deploy.yml`) runs `npm run build`, so it goes red whenever a register lacks the owner's
  `approved` stamp (both carry it since 2026-10-12). The orphan
  recipes in the `qa-build-gate` and `internal-linking` skills strip the bar and the cards as chrome.
  `.github/workflows/remind.yml` reads production weekly and pushes to the owner's phone (ntfy)
  only when THIS site needs something (the switch unreadable from its origin, deploy drift, the
  strip's age, the runway); the switch's mode, quiet days and the calendar's end are pushed once
  for the fleet by the 3locksmiths reminder. Red on GitHub without the `NTFY_TOPIC` secret.
- **Popups:** this site had no written no-popup rule; the nearest rules are
  [performance-guidelines.md](docs/performance-guidelines.md) §2 rule 5 (no late, layout-shifting
  content), [data-tracking-infrastructure.md](docs/data-tracking-infrastructure.md) §5 (CLS 0) and
  [eeat-and-trust.md](docs/eeat-and-trust.md) §7 (no urgency or scarcity). The card keeps all three:
  pre-rendered, in the top layer, no shift, no urgency wording (the claim gate enforces it). The owner's
  2026-10-11 decision is recorded there and in
  [mobile-ux-and-personalization.md](docs/mobile-ux-and-personalization.md).
- **Before the first deploy — answered by the owner 2026-10-12** (fleet wording sign-off page;
  business-facts §G): the wording is **approved** (fingerprint `86e30fc91128`, stamped in both
  registers), the wartime line is **confirmed** for this business, and the export budget is
  **raised from 6 MB to 7.5 MB** ([performance-guidelines.md](docs/performance-guidelines.md) §1 —
  the live surfaces take `out/` to ≈6.93 MB). The kit is synced from a committed 3locksmiths
  (`live-kit.lock.json` names `cf3a5460aa8b`, no `+dirty`). **Still to do, outside this repo
  (fleet ops):** add the three origins (apex, www, `.pages.dev`) to the status switch's CORS list —
  without it the switch is unreadable here, every seasonal line and the card stay off, and a phone
  visitor sees a seasonal bar open and then close; widen the GTM trigger
  `CE - popup events (3locksmiths)` so its hostname condition matches this site — **one shared
  trigger for the whole fleet** (owner decision 2026-10-12), not a trigger per site; and set
  `NTFY_TOPIC`. Order and commands: the kit README, "Before a site's first deploy".
