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
- **Service area:** גוש דן והמרכז, up to ~60 km, with 12 named cities. **No location pages exist.**
- **Founded:** 2015 — so "10+ שנות ניסיון" is defensible.
- **Audience:** homeowners mid-crisis (a damp stain, a jumped water bill), ועדי בתים, property managers,
  loss adjusters, businesses needing electrical-panel scans.
- **Core promise:** find the **source**, not the symptom — without breaking walls — and hand over a
  report an insurer accepts.
- **Conversion goals, in order:** (1) phone call, (2) WhatsApp, (3) contact form. Every page keeps a
  call/WhatsApp action within reach; `StickyContact` is a mobile-only fixed bottom bar.

> ⚠️ **What is still placeholder.** Phone, WhatsApp and email are **real**. Still unverified:
> **prices** (₪450), the **certifications**, and the **guarantee's scope**. Purged 2026-08-17 and
> not to be reintroduced without sources: the six fabricated testimonials and their 4.9 rating, the
> 3,000+/97% stats, the placeholder `geo`, and the facebook.com/instagram.com `sameAs` links. See
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
  thank-you/              # noindex post-form conversion page; absent from the sitemap on purpose
  about/ contact/ accessibility/ privacy/
components/               # FLAT — one component per file, PascalCase, no subfolders
  Navbar Footer StickyContact          # chrome
  Container CtaButton SectionHeading PageHero Breadcrumbs Logo JsonLd
  Hero TrustBar MethodExplainer ServicePillars ServiceCard Process Faq ContactCTA
  ContactForm ThankYouContent          # the form + its post-submit page
  EmailOff                             # Cloudflare Scrape Shield workaround
  WhatsappIcon
lib/
  site.ts       # ⭐ NAP, hours, service areas, trust stats, helpers (telHref, whatsappHref, canonicalUrl)
  services.ts   # ⭐ the 4 services — copy, answer blocks, limits, steps, FAQs, keywords
  faqs.ts       # the general FAQ
  pricing.ts    # /pricing/ copy — per-service prices stay in services.ts, never restated here
  jsonld.ts     # every JSON-LD builder
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
        ├─► lib/services.ts · lib/faqs.ts · lib/reviews.ts
        ├─► lib/jsonld.ts     (reads all of the above)
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
- **Israeli formats:** currency `₪450` (symbol first — the existing convention), phones `0XX-XXX-XXXX`
  (`tel:` uses `+972…`), dates `dd/mm/yyyy`, ranges with an en dash.

See the `hebrew-rtl` skill for the full rule set.

---

## 7. Code style

- **Strict TypeScript.** No `any` (use `unknown` + narrowing). No non-null `!` to silence the compiler —
  handle the null case, as `getService()` + `notFound()` already do.
- **Explicit function declarations:** `export default function Hero() {…}`. Type every prop with an
  explicit `interface`/`type`.
- **RSC by default.** Add `"use client"` only for state, effects or browser APIs, kept leaf-level.
  Currently client: **`ContactForm`**, **`Navbar`** and **`ThankYouContent`** (sessionStorage) —
  those three only. Note Next 16's lint rejects synchronous `setState` inside `useEffect`
  (`react-hooks/set-state-in-effect`); for client-only reads use `useSyncExternalStore`, as
  `ThankYouContent` does.
- **Mobile-first.** Style the base case first, then layer `sm:`/`md:`/`lg:`.
- **Descriptive Tailwind**, grouped logically (layout → spacing → color → state). Use the `@theme`
  tokens — **never hardcode a brand hex**. The only accepted raw hexes are non-brand colours with no
  token (WhatsApp green `#25D366`, the `accent-strong` hover `#9a3412`).
- Components PascalCase; utilities camelCase; `@/*` alias for `lib/`, relative for sibling components.

---

## 8. Design tokens (defined in `app/globals.css` via `@theme`)

| Token           | Value                   | Use                                              | Contrast on white |
| --------------- | ----------------------- | ------------------------------------------------ | ----------------- |
| `brand`         | `#0B3D5C` deep blue     | primary buttons (white text), heading accents    | ≈11.4:1 ✅        |
| `brand-dark`    | `#082A40`               | hovers, dark sections                            | —                 |
| `brand-light`   | `#1E88A8` teal          | focus ring, secondary accents                    | ≈4.1:1 ⚠️ UI only |
| `accent`        | `#FF6A3D` thermal orange | **decorative highlights, icon accents only**    | ≈2.8:1 ❌ no text |
| `accent-strong` | `#C2410C`               | orange button bg with white text (AA-safe)       | ≈5.2:1 ✅         |
| `ink`           | `#1B2733`               | body text (`ink/70` ≈5.7:1 ✅, `ink/50` ≈3.1:1 ❌) | ≈14:1 ✅        |
| `paper`         | `#F7F9FB`               | light section backgrounds                        | —                 |

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
traps, builds, gates `out/`, preserves `out.prev/` for rollback, deploys, and logs to
`logs/deploys.csv`. Credentials come from the Sys Admin control plane, never this repo.

**The cautionary tale (2026-08-02 → 2026-08-17):** the DNS was cut over to Pages on 2026-08-02, but
this repo's rsync workflow kept running — green — against the retired cPanel server for fifteen
days. Every "successful deploy" in that window never reached production. That is why the drift
check exists and why this section must never be edited from memory: **verify the origin, then
believe it.**

- **Rollback:** `out.prev/` + `npx wrangler pages deploy .\out.prev --project-name thermoleak
  --branch main`, or the Pages dashboard's previous-deployment rollback.
- HTML is served `DYNAMIC` by Pages; assets are content-hashed and cached immutable via
  `public/_headers`. There is nothing to purge on deploy.

Run `/qa-build-gate` before shipping. **Deploying is a production mutation — always ask first.**
See the `deploy-thermoleak` skill.

---

## 11. Commands

| Task             | Command             |
| ---------------- | ------------------- |
| Dev server       | `npm run dev`       |
| Production build | `npm run build`     |
| Serve the build  | `npm run start`     |
| Lint             | `npm run lint`      |
| Type-check       | `npx tsc --noEmit`  |

There is no `typecheck` or `format` script. **Build gate: `npm run lint && npm run build`** — `next
build` type-checks the whole app. Always run it before declaring work done.

A `Stop` hook at `.claude/hooks/format-changed.ps1` formats changed files with Prettier — it is a
**no-op until `prettier` is added as a devDependency**, by design (`--no-install` never downloads one).

---

## 12. Scope guardrails

- Implement real UI, sections, or content only when asked. Don't opportunistically redesign.
- **Don't build the 12 location pages.** Build 3–5 that pass the doorway test, or none. See `/new-city`.
- Don't add dependencies without a reason that survives "can the platform already do this?" The runtime
  dependency list is four packages; keep it that way.
- Don't put PII in any future `dataLayer` — the contact form has name and phone in scope at submit time.
- Cloudflare zone settings (AI crawler policy, Scrape Shield, cache rules) are **the owner's to
  change**. Document the exact toggle; never assume it was done.

---

## 13. The environment in `.claude/`

**Agents** (`.claude/agents/`) — `seo-auditor`, `schema-auditor`, `eeat-trust-auditor`,
`local-seo-strategist`, `aeo-geo-strategist`, `perf-a11y-auditor`, `security-auditor`,
`ts-react-reviewer` (all read-only), plus `rtl-frontend-engineer` and `hebrew-copywriter` (which edit).

**Skills** (`.claude/skills/`) — start with `thermoleak-architecture`. Then `seo-metadata`,
`schema-structured-data`, `hebrew-rtl`, `local-seo-il`, `aeo-answer-content`, `internal-linking`,
`conversion-cro`, `tracking-analytics`, `performance-web-vitals`, `responsive-accessibility`,
`web-security-headers`, `new-service`, `new-city`, `new-article`, `qa-build-gate`, `deploy-thermoleak`.

**The acceptance bars** live in `docs/` and every agent cites them by section number:
[optimization-backlog.md](docs/optimization-backlog.md) (the ranked register — **keep its numbering
stable**), [content-standards.md](docs/content-standards.md),
[keyword-map.md](docs/keyword-map.md), [schema-graph.md](docs/schema-graph.md),
[business-facts.md](docs/business-facts.md) (**the one file an agent may not fill in**).
