# Implementation roadmap — sequenced sprints

**The register** of what is wrong lives in [optimization-backlog.md](optimization-backlog.md)
(§1–§13). **This file is the sequencing**: what order we fix it in, what "done" means, and what each
sprint is blocked on. Every task cites its backlog section.

**Measured baseline: 2026-08-24**, against a clean build. Word counts are raw; subtract ~110 words
of chrome for the unique-body figure that [content-standards.md](content-standards.md) §1 gates on.

| Route | Raw | Unique | Floor | Status |
| --- | --- | --- | --- | --- |
| `/` | 814 | ~704 | 800 | ❌ short ~96 |
| `/services/water-leak-detection/` | 655 | ~545 | 450 | ✅ |
| `/services/moisture-detection/` | 591 | ~481 | 450 | ✅ |
| `/services/electrical-thermography/` | 579 | ~469 | 450 | ✅ |
| `/services/insurance-reports/` | 559 | ~449 | 450 | ⚠️ at the line |
| `/pricing/` | 516 | ~406 | 400 | ✅ |
| `/services/` | 452 | ~342 | 250 | ✅ |
| `/about/` | 382 | ~272 | 500 | ❌ short ~228 |
| `/contact/` | 231 | ~121 | 200 | ❌ short ~79 |

14 routes emitted · 11 in the sitemap · 0 location pages · 0 guides.

---

## Sprint 0 — Owner unlocks (runs in parallel with everything, starts now)

**Not engineering work.** Four facts gate more downstream value than any sprint below, and each has
a long lead time. Start them today; they mature while Sprints 1–2 run.

| Unlock | Unblocks | Backlog |
| --- | --- | --- |
| **Google Business Profile** (service-area, address hidden) | Map pack · review hosting · `sameAs` · legitimate `AggregateRating` | §5.3 |
| **Review acquisition running** — WhatsApp ask the evening of each job, target 10 in 60 days | `/reviews/` restoration · `Review` schema · social proof · CRO | §7.1 |
| **A named human + credentials** — name, role, cert body + number, insurance, ח.פ. | `Person` schema · every guide byline · `/about/` depth · basic trust | §7.3, §7.5 |
| **Analytics decision** — Zaraz vs shared GTM (see [data-tracking-infrastructure.md](data-tracking-infrastructure.md) §2) | All of Sprint 1 | §13.1 |
| **Guarantee scope + price confirmation** | `Offer` schema · honest pricing copy | §7.4, §7.7 |

**Definition of done:** rows filled and flipped to ✅ in [business-facts.md](business-facts.md).

> The analytics decision is a five-minute call and blocks an entire sprint. Make it first.

---

## Sprint 1 — Measurement, schema completion, and the a11y delta

**Goal:** make every subsequent sprint verifiable, and close the cheap correctness gaps.
**Why first:** shipping content you cannot measure is how you end up guessing. Everything here is
small, unblocked (except the analytics decision), and compounds.

### 1.1 Analytics + CSP — one commit, never two
- Install the chosen tagger (Zaraz recommended — edge-executed, ~0 KB client).
- Assert `gtm.js?id=…` returns **200** if GTM is chosen — §13.3 is a hard rule, not advice.
- Wire the event schema from [data-tracking-infrastructure.md](data-tracking-infrastructure.md) §4:
  `call_click`, `whatsapp_click`, `lead_whatsapp_open`, `lead_handoff_blocked`, `thank_you_view`,
  `faq_open`, `pricing_view`.
- **Ship the CSP in the same commit.** The site has zero third-party JS today; that advantage is
  spent the moment a tag lands, and retrofitting a CSP afterwards is strictly harder.
- Mark Key events in GA4. Verify no PII on the wire — inspect the request, not the config.

### 1.2 Complete the schema graph — §4.5
- `ContactPage` on `/contact/`, `AboutPage` on `/about/`, `CollectionPage` on `/services/`
  (all unblocked, ~1 hour).
- `Offer` / `PriceSpecification` on service nodes — **blocked on price confirmation** (§7.7).
- Confirm the fabrication gate still holds: `aggregateRating`, `sameAs`, `GeoCoordinates` must
  return **zero** files.

### 1.3 WCAG 2.1 AA delta — [accessibility-and-i18n.md](accessibility-and-i18n.md) §A1
Audit and fix the twelve criteria 2.1 adds over the published 2.0 baseline. Priority order:
- **2.5.3 Label in Name** — `aria-label="התקשרו אלינו: 055-660-1006"` on a button reading
  "חייגו עכשיו" is a violation; the accessible name must contain the visible text.
- **4.1.3 Status Messages** — form errors and the `/thank-you/` confirmation.
- **1.4.10 Reflow** at 320 px — the pricing grid and any table.
- **1.4.12 Text Spacing** — fixed-height buttons and chips.
- **1.4.11 Non-text Contrast** — input borders (`ink/20`).
- Plus the open items from §11.3/§11.5/§11.6: mobile-menu **focus trap + scroll lock**, service
  image `alt` redundancy, and **measuring** the menu button against 44 px.

> **Do not update the published `/accessibility/` statement to claim 2.1** until every criterion
> verifies. That statement is a legal declaration under Israeli regulation.

### 1.4 Housekeeping
- 404 emits three ways (`/404/`, `/_not-found/`, `/404.html`) — §1.1. Add `public/_redirects` 301s
  for the directory forms.
- Derive `staticRoutes` in `app/sitemap.ts` rather than hand-maintaining it — §1.2.

**Sprint 1 done when:** a call click, a WhatsApp click and a form submit each appear exactly once in
realtime analytics; CSP is report-only and collecting; `npm run lint && npm run build` clean; the
a11y delta has no open Critical/High; the fabrication grep returns zero.

---

## Sprint 2 — Content depth and the answer cluster

**Goal:** clear every content floor and build the AEO moat.
**Why now:** this is the largest ranking lever that is *not* owner-blocked, and Sprint 1 made it
measurable.

### 2.1 Close the three failing floors — §3.1, §3.3
- **`/about/` → 500 words.** Its word count and its trust gap are the same problem: it is short
  *because* nobody is named. Partially blocked on Sprint 0 (credentials); the company story,
  method philosophy and service-area reality can be written now.
- **`/contact/` → 200 words.** What to expect on a call, what to prepare, response times,
  out-of-hours policy.
- **`/` → 800 words.** Extend the method explainer and add a "which service do I need?" decision
  aid — genuinely useful, and it captures method-confused searchers (strategy §1).
- **`/services/insurance-reports/`** sits exactly at the 450 line — give it headroom.

### 2.2 Launch `/guides/` — §3.5, strategy §5 gate 3
The AEO moat. Build the route (see `/new-article`), then the first three, in this order:

1. **מה מצלמה תרמית באמת רואה — ומה היא לא** ← the flagship; no competitor publishes it
2. **איך מאתרים נזילה בקיר בלי לשבור — השיטות והמגבלות שלהן** (method comparison table)
3. **כמה עולה איתור נזילות ומה משפיע על המחיר** (feeds `/pricing/`)

Each: 900-word floor, answer block in the first 60 words, question-form `<h2>`s, one
screenshot-worthy table, `Article` + `BreadcrumbList` + `FAQPage` schema derived from the blocks,
2–3 contextual links down to the service that monetises it.

**Bylines are blocked on Sprint 0.** Draft now, publish when there is a real author — never invent
one.

### 2.3 Internal link mesh — §9.3, §9.4
- Hub prose on `/services/` explaining how the four services relate (one camera, one visit, four
  questions).
- 2–3 contextual in-copy links per service page — the site's entire internal anchor signal is
  currently nav boilerplate.
- Header dropdown exposing all four services (§9.2) — makes them 1 hop from home.

**Sprint 2 done when:** every route clears its floor; three guides live with real bylines and dates;
zero orphans; `/services/` has hub prose; the answer-block spec passes on every new page.

---

## Sprint 3 — The local silo

**Goal:** express the Tier-2 layer without creating a doorway cluster.
**Why after Sprint 2:** depth before breadth. Location pages built before the guide cluster exists
have nothing authoritative to link to.

- **Build the data model first**: `lib/locations.ts` with `{ slug, name, kind, prefixed }` —
  before page one, so `בתל אביב` vs `בתל אביב-יפו` and any future region entry are handled in data,
  not in template guesswork.
- **Apply the gate to all 12 candidates** ([content-standards.md](content-standards.md) §2). Expect
  **3–5 to qualify**, not 12. Record the rejected cities and *why* in business-facts §E.
- Build only the qualifying pages: answer block → local substance (≥3 true specifics, housing stock
  is the richest seam) → service list → nearby locations → city FAQ → CTA.
- Wire the mesh **before shipping**: footer column, links from `/services/`, links from each service
  page, bidirectional `nearby`.
- `Service` + `areaServed` (`City` vs `AdministrativeArea` per `kind`) + `BreadcrumbList`.
  **Never a `LocalBusiness` per city.**
- Add to `app/sitemap.ts`; update `/qa-build-gate` route-count assertions in the same commit.

**Sprint 3 done when:** every shipped city passes the doorway substitution test; ≥350 unique words
each; zero orphans; route counts reconciled in the gate.

---

## Sprint 4 — Performance, conversion and proof

**Goal:** convert the traffic the first three sprints earn.

- **Images — §10.2**: `hero.webp` width variants (or enable Cloudflare Image Resizing). Note
  `sizes` on an unoptimized `next/image` is inert — remove it or make it real.
- **Fonts — §10.4**: preload above-the-fold subsets; subset to Hebrew + Latin only.
- **Before/after thermal gallery** — [eeat-and-trust.md](eeat-and-trust.md) §5. The unfair
  advantage: paired ordinary/thermal frames of real jobs. **Blocked on real imagery + consent.**
  If a slider is built, WCAG 2.5.1 applies (no path-only gestures).
- **Case studies** — §4 of the same doc. Solves E-E-A-T, the doorway test, AEO and conversion at
  once. Blocked on consent.
- **Run `cro-conversion-auditor`** against the live funnel and action its Critical/High.
- **Restore `/reviews/`** once Sprint 0 delivers real reviews — with `Review` schema and source
  links.

**Sprint 4 done when:** Lighthouse mobile ≥95/100/≥95/100; CWV budgets in
[performance-guidelines.md](performance-guidelines.md) §1 met in the field; CRO audit clean.

---

## Sprint 5 — Bilingual (conditional — do not start by default)

**Gate:** [accessibility-and-i18n.md](accessibility-and-i18n.md) §B0. Build only if a named audience
exists (olim/expat homeowners, English-speaking property managers, international insurers). English
**permanently doubles** content, floors and audits.

If approved: two root layouts via route groups, Hebrew stays at the URL root, English under `/en/`,
locale-keyed content model, reciprocal `hreflang` with `x-default` → Hebrew. **Start with a subset**
(home, four services, pricing, contact). Legal pages stay Hebrew-authoritative. Route count roughly
doubles — update `/qa-build-gate` in the same commit. Follow `/i18n-bilingual`.

---

## Continuous tracks (not sprints — habits)

| Track | Cadence | Owner |
| --- | --- | --- |
| Review requests after every job | Per job | Owner |
| GBP posts with thermal imagery | Weekly | Owner |
| Guide publishing | 1–2/month after Sprint 2 | Copywriter + named expert |
| AI-citation spot-check (the six gate-3 questions) | Monthly | Anyone |
| `robots.txt` live verification | Every audit | Any agent |
| Seasonality: winter → roof/facade moisture; summer → A/C condensation + electrical load | Quarterly planning | Owner |

---

## Dependency map — what actually blocks what

```
Sprint 0 (owner facts) ──┬─→ Sprint 1 analytics ─→ everything becomes measurable
                         ├─→ guide bylines (Sprint 2.2)
                         ├─→ /about/ depth (Sprint 2.1)
                         ├─→ Offer schema (Sprint 1.2)
                         └─→ /reviews/ + Review schema (Sprint 4)

Sprint 2 (depth+guides) ──→ Sprint 3 (locations link INTO guides and services)

Sprint 0 imagery/consent ──→ Sprint 4 gallery + case studies

Sprint 5 gated separately on a business decision, not on any sprint above
```

**The critical path runs through Sprint 0.** Every sprint below it has unblocked work, but the
highest-value items in each are waiting on a fact only the owner can supply.

---

## Definition of done — applies to every sprint

1. `npm run lint && npm run build` clean from a cold `.next`.
2. `/qa-build-gate` passes end to end, including the fabrication greps.
3. No claim shipped that [business-facts.md](business-facts.md) marks 🔶.
4. Relevant auditor agent run against the fresh `out/`, Critical/High cleared.
5. [optimization-backlog.md](optimization-backlog.md) updated — sections marked ✅ with the date,
   numbering left stable.
6. Deployed via `/deploy-thermoleak` (dry-run → `-Confirm`) and **verified live** by asserting
   content only the new build has — never a status code on an old route.
