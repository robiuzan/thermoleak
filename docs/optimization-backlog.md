# Optimization backlog — thermoleak.co.il

The single ranked register of what is wrong, what is missing, and what is already right. Every agent
and skill in `.claude/` cites section numbers from this file, so **keep the numbering stable** — add
sub-items rather than renumbering.

**Audited:** 2026-08-16, against the repo at commit `04c0b9d` and the export in `out/` (which was
**stale** — built 2026-07-30, three days behind the last commit; see §1.6).

**Reconciled:** 2026-09-06, against commit `d712419` and a **fresh** `out/` (built after HEAD —
checked, per §1.6), following an 11-dimension audit with adversarial verification. Sprints 1–3
shipped between the two dates, so items below carry inline `✅ (date)` annotations and several are
reopened or restated. **This file is a dated snapshot. Where it and a fresh `out/` disagree, `out/`
wins — and fix this file in the same commit (§14).**

**Severity:** 🔴 Critical (stop-ship) · 🟠 High · 🟡 Medium · 🔵 Low · ✅ verified good

---

## Executive summary — as first audited (2026-08-16)

> ⚠️ **Historical. Every number and every present tense in this block describes 2026-08-16.** The
> fabrications named here were purged 2026-08-17; the measurements were superseded 2026-09-06. Read
> "Where it stands now" underneath before quoting anything from it.

This is a **well-built small site with one disqualifying content problem.**

The engineering is genuinely clean: zero RTL utility violations, zero hardcoded NAP literals, zero
orphan pages, one `<h1>` and one canonical on every page, a 3.9 MB export with no oversized chunks, only
two client components, and a form with proper per-field `aria-invalid` / `aria-describedby` wiring.
Most sites audited at this size are worse on every one of those axes.

Against that: **the site ships six invented customer testimonials and publishes a 4.9 star rating
computed from them as `aggregateRating` on all 13 pages.** That is a Google policy violation, and it
sits on top of a second tier of unsourced claims (a 97% success rate, a 3,000+ job count, an
uncredentialed certification, a guarantee with no stated scope) and two social links that point at
`facebook.com` and `instagram.com`.

Everything else is depth and measurement: service pages ~30% under their word floor, no location or
article silo, no answer blocks, and **zero analytics of any kind**.

**The three things that matter most:** (1) resolve the fabricated reviews — §7.1/§4.1; (2) install
analytics so any of this can be measured — §13.1; (3) take the four service pages to their depth floor
and open with answer blocks — §3.2/§6.2.

---

## Where it stands now (2026-09-06)

All three of those are done. The fabrications are gone and have stayed gone; analytics ships; the
service pages carry answer blocks and honest-limits sections. `npm run lint` and `npm run build` are
both clean.

**Measured, not asserted:** 22 emitted `index.html` files · 19 URLs in `sitemap.xml` (`/thank-you/`
is deliberately noindex and excluded; the two 404 artifacts are not content) · `out/` is
**5,910,433 bytes** across 220 files · exactly **four** client components (`ContactForm`, `Navbar`,
`ThankYouContent`, `ConsentBanner`) · **zero** banned RTL utilities · **zero** `aggregateRating`, `Review`, `sameAs`
and `GeoCoordinates` nodes.

**Updated 2026-09-17 — Sprint 4 shipped.** Items 2 and 3 below are **resolved**; item 1 stands.

1. **§13.5 — the conversion layer is still wired to nothing.** GTM ships on every route and
   `page_view` flows, but no repo code pushes an event and the container holds no event tag, so all
   seven documented conversion events fire zero times. **This is now the single largest open gap**,
   and it is Sprint 6.
2. ✅ **§13.6 and §8.6 — both fixed 2026-09-17.** The tagged `/thank-you/` href is generic and the
   prefilled chat opens from `onClick`, so no lead PII can reach the dataLayer; and the
   StickyContact spacer moved from `<main>` to `<footer>`, so the footer's only links to
   `/accessibility/` and `/privacy/` are reachable on mobile.
3. ✅ **§11.2 — fixed 2026-09-17.** All seven sub-`ink/70` values raised, input borders to
   `border-ink/55`, focus ring switched to white on dark surfaces via `.on-dark`, and
   `/accessibility/` re-dated **after** the fix.

**Also shipped 2026-09-17:** Consent Mode v2 (analytics denied until opt-in) with a truthful
`/privacy/`; the owner's fact batch (₪350, FLIR E8, two-person team, ~20 years, insurance, national
service) and the **removal** of three false claims (`בע״מ`, the thermography certificate, the
accessibility coordinator); `og:image` restored on all 19 indexed routes with self-referencing
`og:url`; authored location meta descriptions; `/images/*` cache headers.

**Still owner-blocked and unchanged:** §5.3 (Google Business Profile), §7.3 (certifications,
insurance, ח.פ.), §7.7 (prices). Never fill these in yourself — see
[business-facts.md](business-facts.md).

---

## Phase 1–2 + Phase 3 content — shipped and deployed 2026-08-17

Resolved in the working tree; each item keeps its section number below for history. **Now
resolved:** §2.1 (both title bugs), §4.1/§7.1 (fabricated rating + testimonials removed; `/reviews/`
301s to `/about/`), §4.2/§7.6 (`sameAs` + footer socials removed), §4.3 (breadcrumbs emitted from
`PageHero`, 10/10 parity), §4.4 (`geo` removed), §7.2 (TrustBar rebuilt on verified figures),
§8.1 (form failure path + `/thank-you/` handoff), §8.3 (18 `data-cta` attributes), §8.4 (consent
link), §8.5 (focus management), §9.3 (in-copy cross-links on all four service pages), §9.5
(trailing slashes), §10.3 (logo `priority` dropped), §11.1/§11.2 (`ink/50` → `ink/70`; the
statement is true again), §11.3 partial (Escape + focus return; focus trap/scroll lock still open),
§12.1 (baseline headers via `public/_headers`, verified live), §1.3 (real `lastModified` dates),
§13.4 pre-wired.
**New surfaces:** `/pricing/` (targets כמה עולה איתור נזילות), `/thank-you/` (noindex conversion
URL), answer blocks + honest-limits sections on all four service pages, homepage method explainer,
generalFaqs 6 → 9. Emitted routes 13 → 14; sitemap stays 11.

**Deployed 2026-08-17 to Cloudflare Pages** — which surfaced the biggest infrastructure finding of
the audit: the repo's rsync-on-push pipeline had been retired by a 2026-08-02 DNS cutover to Pages
(project `thermoleak`) and ran **green against a dead server for 15 days**. The workflow is now
build-only CI, headers/redirects moved to `public/_headers`/`public/_redirects`, `.htaccess` is
deleted, and the deploy path is the fleet ops script with its Pages-API drift check (CLAUDE.md §10).
The earlier "HTML not edge-cached / TTFB 1.3–15.2 s" concern is withdrawn: Pages serves from the
edge, and those TTFB samples were polluted by local network flakiness.

**Still open and owner-blocked** — _as written 2026-08-17; superseded by the block below:_
§5.3 (GBP), §7.3/§7.5 (credentials, named person), §13.1
(analytics decision), §6.1 (Cloudflare AI-crawler toggle — **confirmed live-blocking on
2026-08-17**: the managed robots.txt Disallows ClaudeBot, GPTBot, Google-Extended, CCBot and
others). Still open,
not blocked: §3 depth floors (service pages now ~450+, homepage larger, `/about/` and `/contact/`
still short), §9.2 (header dropdown), §10.2/§10.4 (image variants, font preload), §3.4/§3.5
(location + guides silos).

---

## Sprints 2–3 + analytics — shipped 2026-08-24 → 2026-08-30

**Also now resolved, with their bodies annotated in place:** §3.4 (three location pages), §3.5
(three guides — **with real, sourced bylines**), §4.6 (`Service` `@id`), §6.2 (answer blocks), §6.4
(freshness + authorship), §6.6 (the honest-limits material), §7.4 (guarantee scope, exclusions and
the no-call-out-fee term — confirmed, business-facts §C), §7.5 partially (founder רונן דהן
confirmed), §9.3 (in-copy cross-links), §12.2 partially (a Report-Only CSP, widened for the tag in
the same commit), §13.1 partially (GTM-KWGGH438 and GA4 `G-5YWLZ07PEC` ship on every route), §13.2
(the `data-cta` inventory), §13.3 (the roster's verification token).

**Corrected 2026-09-06 — items this file wrongly carried as open:** §10.4 was never a real task at
all (`next/font/google` preloads by default; four `<link rel="preload" as="font">` tags ship on
every route); §1.3's mechanism was replaced weeks ago while its body still described the old one;
and §1.5, §8.1–§8.5, §9.5, §10.3 and §11.4 all shipped without their bodies ever being annotated.

**Reopened or newly opened 2026-09-06:** §2.4 (ten routes emit no `og:image`) · §6.7 (the unwritten
Gate-3 topics) · §7.8 (the guarantee's published scope reaches one page in eight) · §8.6 (the sticky
bar covers the footer's legal row) · §9.6 (nothing links into the location silo) · §11.2 (seven
contrast failures, in values nobody had enumerated) · §12.7 (the CSP reports nowhere, so it can
never be promoted) · §13.5 (no conversion event fires) · §13.6 (PII in a tagged href) · §13.7 (the
privacy page hedges about analytics that definitively ship, and there is no consent mechanism) ·
§14 (nothing keeps the instruction files true).

---

## §1 Technical SEO

**1.1 ✅ (2026-08-24) Resolved.** `/404/` and `/_not-found/` now 301 to `/` via
`public/_redirects`; `/404.html` is untouched because Cloudflare Pages serves it natively as the
custom 404. The two thin crawlable duplicates are gone.

**1.2 ✅ (2026-08-24) Closed by assertion rather than derivation.** `scripts/check-sitemap-parity.mjs`
(`npm run check:sitemap`) fails the build gate if any emitted route is absent from `sitemap.xml`
without sitting on an explicit, reasoned exclusion list. Filesystem-walking to auto-derive the array
was rejected as fragile for an 11-route site; the assertion catches the actual failure mode — a page
added and the sitemap forgotten.

**1.3 🟡 Restated 2026-09-06 — the mechanism was fixed; the dates have now gone stale the other
way.** `lastModified: new Date()` is long gone: `app/sitemap.ts` carries hand-written per-route
dates and a comment recording why. But nothing bumps them. The newest date in the array is
2026-08-24, while `app/about/page.tsx`, `app/pricing/page.tsx` and `lib/services.ts` last changed
2026-08-30 — so those routes now **under**-report. `/accessibility/` and `/privacy/` carry
2026-08-02 against files last touched 2026-07-30, so they **over**-report. The three guides are the
honest exception: `app/sitemap.ts` reads `article.dateModified` straight from `lib/articles.ts`, and
that derivation is the pattern to generalise. A stale hand-maintained date is a smaller lie than a
build-time stamp, but it is still a lie.

**1.4 🔵 `app/robots.ts` still emits a `host` directive** — `host: site.domain`, unchanged through
four sprints. Yandex deprecated `Host` in 2018, so no crawler reads it either way: this is register
hygiene, not SEO. Close it by actually taking one of the two branches — delete the line, or keep it
with a one-line comment in the style of the `AI_CRAWLERS` block above it. Leaving it undecided is
what has kept a 🔵 in the register for a month.

**1.5 ✅ (2026-08-17) `public/llms.txt` written.** See §6.5 — and note it has not been updated since
the `/guides/` and `/locations/` silos shipped, so it no longer lists everything in the sitemap.

**1.6 🟠 `out/` on disk is routinely stale.** At the first audit it was built 2026-07-30 against a
repo last committed 2026-08-02. Any audit, grep or word count run against it measures an artifact
nobody is serving. **Always compare `out/` mtime to `git log -1` and rebuild first.** The 2026-09-06
pass did check — `out/` was built after HEAD `d712419` — which is the only reason its numbers are
usable. This item stays open because the discipline is the deliverable, not any one result.

**✅ Verified good (re-verified 2026-09-06):** every page has exactly one self-referencing canonical
with a trailing slash; `sitemap.xml` lists **19** URLs matching the 19 indexable routes exactly, and
`npm run check:sitemap` now asserts it; `robots.txt` is emitted; `trailingSlash: true` is
consistent; `export const dynamic = "force-static"` is correctly set on both `sitemap.ts` and
`robots.ts`.

---

## §2 On-page SEO

**2.1 ✅ (2026-08-17) Both fixed. Kept as a regression trap, not a live defect.** `app/page.tsx` now
writes the complete title including the brand, and `app/about/page.tsx` writes the bare subject
`אודות`; both carry a comment saying why. Every route is correct today. What follows is the
mechanism that will reintroduce them — check both whenever a title changes.

The root layout sets `template: "%s | טרמוליק"`.

- **A bare subject in `app/page.tsx` ships with no brand at all.** A `template` declared in a layout
  applies to child segments, **not to that layout's own `page.tsx`**, so the homepage title is used
  verbatim. Documented Next behaviour, not a bug.
- **A brand inside a child page's own title ships it twice**, as `/about/` once did:
  `אודות טרמוליק — מומחים לאיתור נזילות תרמי | טרמוליק`.

**2.2 🔵 Redundant homepage canonical.** `app/page.tsx` sets `alternates: { canonical: "/" }` while
`app/layout.tsx` already does. Harmless duplication.

**2.3 🔵 `/about/` title length.** At 47 Hebrew characters plus the doubled suffix it is the only route
at risk of SERP truncation. Fixing 2.1 fixes this.

**2.4 🟠 (opened 2026-09-06) Ten routes emit no `og:image`; eight more claim the homepage as their
`og:url`.** Next shallow-merges metadata at the top-level key only, so a page's `openGraph` object
**replaces** the layout's rather than deep-merging into it. `app/services/[slug]/page.tsx`,
`app/guides/[slug]/page.tsx` and `app/locations/[city]/page.tsx` each declare an `openGraph` with no
`images` — so all four service pages, all three guides and all three city pages lose `og:image`,
`og:type`, `og:locale` and `og:site_name`. Verified in a fresh `out/`: those ten emit only
`og:title`, `og:description` and `og:url`. They never override `twitter` either, so their
`twitter:title` disagrees with their own `og:title`. Conversely, the eight indexed routes that
declare no `openGraph` at all inherit the layout's absolute `url` and assert `og:url` = the
homepage.

Rank it by what it actually costs: **a link shared to WhatsApp or Facebook renders as a bare text
row with no preview card, across the site's entire commercial and topical surface.** The `og:url`
half is a weak hint already overridden — all 19 indexed routes carry a correct self-referencing
canonical — so that half is tidiness, not a ranking risk.

Fix: a shared `pageOpenGraph()` helper in `lib/site.ts`, spread into the three dynamic routes and
the eight static ones, and drop the layout's absolute `url` (a layout-level `og:url` can only ever
be right on one route). Then add the assertion to the build gate. This class of bug is invisible to
a gate that greps only for canonical, title and H1 — which is exactly why the line below survived
three sprints past the point it stopped being true.

**✅ Verified good (re-verified 2026-09-06):** all 19 indexed descriptions are unique and present;
exactly one `<h1>` on all 22 emitted pages; heading order unbroken; Search Console verification tag
live. ~~OG and Twitter tags present with a 1200×630 image~~ — **that was false for 10 of the 19
indexed routes; see §2.4.** The homepage, `/pricing/` and the hub pages do carry the 1200×630
`og.png`.

---

## §3 Content depth

Floors are in [content-standards.md](content-standards.md) §1. Chrome is **~110 words** per page —
subtract it from the raw counts below.

**3.1 ✅ (2026-08-24) Floor cleared — 949 unique (floor 800).** Added the MethodExplainer and a
symptom-first ServiceChooser that maps what the visitor actually arrives with (a recurring stain, a
jumped water bill, an insurer asking for proof) to the right service — including an honest "this
might not be us" route to /contact/.

**3.2 ✅ (2026-08-17) Floor cleared.** All four service pages gained exactly the four things this
item said were missing: what the method **cannot** detect (the `limits` block), what the visit
includes, what changes the price, and what happens after the leak is found — all in
`lib/services.ts` — plus an answer block (§6.2) and in-copy cross-links (§9.3). **The 432–469
figures above are pre-rewrite and must not be quoted.** Re-measure against the baseline table in the
`qa-build-gate` skill, which is derived from the current `out/`.

**3.3 ✅ (2026-08-24) Both floors cleared.** `/about/` 552 unique (floor 500) — added how-we-work
sections covering method, the deliberate detect-but-do-not-repair separation, and service-area
reality. `/contact/` 248 unique (floor 200) — what happens after you make contact, and what to have
ready. Note `/about/` remains short of its POTENTIAL until §7.3/§7.5 land: it was thin because
nobody is named on it.

**3.4 🟠 Location silo — 3 of 12 shipped (2026-08-24).** `/locations/` is live with תל אביב,
חולון and בת ים. Gated by an adversarially-verified assessment (49 agents) that found ALL 12 areas
have qualifying claims — the cap to three is a deliberate depth/doorway decision, not a claim
shortage. Each page: 674–745 unique words (floor 350), a 40–60 word answer block, 6–7 city-specific
claims, 2 local FAQs, bidirectional `nearby`, and `Service` + `City` areaServed (never a
per-city `LocalBusiness`). Doorway test verified in the export — the three pages share no proper
nouns. The other 9 are queued with claims intact in business-facts §E.

**3.5 🟠 Shipped, two of three under floor (2026-08-24).** `/guides/` is live with three articles
built on a typed block model (`lib/articles.ts`) so `FAQPage` is DERIVED from the copy and cannot
drift. Word counts: what-a-thermal-camera-sees **912 ✅**, find-leak-without-breaking **819**,
leak-detection-cost **744** — against a 900 floor. Deliberately NOT padded further: the honest way
to close the remaining gap is real case-study material (worked jobs, thermal image pairs), which is
blocked on imagery + consent, not more prose. **✅ Bylines are real (2026-08-24).** All three
articles carry `author: "רונן דהן"` — the confirmed founder, business-facts §A — and the `Article`
node emits a `Person`. `author` stays **optional** in the type so a future article by someone
unknown publishes unattributed rather than borrowing a name. **Do not strip these bylines as
fabrications; they are sourced.** And still: never invent one.

**✅ Verified good:** `/services/` at 450 raw ≈ 340 unique clears its 250 floor; the legal pages are
substantive and well written; no page is a template clone of another.

---

## §4 Structured data

**4.1 ✅ RESOLVED 2026-08-17 — kept verbatim as the record of what this cost.** `lib/reviews.ts` is
deleted, `/reviews/` 301s to `/about/`, and every re-check since has found zero `aggregateRating`
and zero `Review` in the export. **The paragraph below describes 2026-08-16 and is not live.** The
standing rule it leaves behind: a rating or review may only ship with a verifiable public source
(business-facts §B), and reintroducing one without it — including as "sample data" — is a stop-ship.

_As first audited:_ **🔴 STOP-SHIP — `aggregateRating` is fabricated and ships on all 13 pages.**
`localBusinessJsonLd()` emits `ratingValue: "4.9"`, `reviewCount: "6"`, computed by `lib/reviews.ts`
from six invented testimonials in a file whose own header reads _"PLACEHOLDER — replace with real,
verifiable reviews… Do not publish an aggregate rating that isn't backed by genuine reviews."_ Because
the business node is injected from the root layout, it is on every page including the 404s. Google
policy violation and a Rich Results failure. Resolution: real sourced reviews, or remove both.
Blocked on business-facts §B.

**4.2 ✅ RESOLVED 2026-08-17.** `site.social` no longer exists, `sameAs` is absent from the graph,
and the footer's social icons are gone. Restore either only with real profile URLs from
business-facts §B. _As first audited:_ 🟠 `sameAs` points at platform homepages — `["https://www.facebook.com/",
"https://www.instagram.com/"]` from `site.social`. These are also the footer's social icon links. A
`sameAs` that resolves to facebook.com asserts an entity link that doesn't exist — weaker than an empty
array. Fix the data or remove both surfaces (one edit does both).

**4.3 ✅ RESOLVED 2026-08-17.** `PageHero` now emits `BreadcrumbList` itself from the same `crumbs`
array the visible trail renders, so the two cannot drift. **No page may call `breadcrumbJsonLd`
directly** — that double-emits. _As first audited:_ 🟠 markup and visible trail have drifted —
`PageHero` renders crumbs on 7 routes;
`breadcrumbJsonLd` is called on 5. `/accessibility/` and `/privacy/` show a trail and mark up nothing.
On the 5 that do both, the trail is typed twice in two different shapes (`href` vs `url`). Fix: emit
from `PageHero` using the array it already receives. Target 7.

**4.4 ✅ RESOLVED 2026-08-17.** There is no `geo` key in `lib/site.ts` and no `GeoCoordinates` in the
export. Absent by design; a real value is gated on business-facts. _As first audited:_ 🟡 `geo` is a
placeholder — `32.0853, 34.7818` is Tel Aviv city centre, emitted as
`GeoCoordinates` for a business with no premises. Set the real base or drop the field.

**4.5 🟠 Partially shipped (2026-08-24).** `AboutPage`, `ContactPage` and `CollectionPage` now emit
via `pageNode()` in `lib/jsonld.ts`, each tied to the business node with `about` and to the site with
`isPartOf`. **Still open:** `Offer`/`PriceSpecification` — deliberately withheld, blocked on price
confirmation (business-facts §C). Never ship a guessed price in schema.

**4.6 ✅ (2026-08-24) Shipped.** `Service` nodes carry an `@id` — `{canonical}#service` on the four
service pages and `{url}#service` on the location Services, both built in `lib/jsonld.ts` — so other
nodes can now reference them.

**✅ Verified good:** every page carries valid, parseable JSON-LD; `LocalBusiness` and `WebSite` both
ship globally and cross-reference correctly; `foundingDate: "2015"` matches the roster; `Service` nodes
correctly use `AdministrativeArea` for the region and wire `provider` to the business `@id`; `FAQPage`
questions all match visible rendered text.

---

## §5 Local SEO

**5.1 ✅ NAP is consistent and correct.** Phone, WhatsApp and email are **real fleet values** (per the
roster) and appear only via `lib/site.ts` — no literals anywhere. The address-free `PostalAddress`
(region + country) is the right shape for a service-area business.

**5.2 🟠 Tier-2 layer opened (2026-08-24).** Three location pages ship, replacing the plain-text
chips that previously left every `{service} ב{city}` query unexpressed. Expansion is gated on
depth being sustained, and on the one thing research cannot supply: a real job reference per city.

**5.3 🔴 No Google Business Profile link anywhere.** For a service-area trade business this is the top
local lever: the map pack, the review surface, and the only legitimate source for the rating in §4.1.
Blocked on business-facts §B — this is an owner action, not a code task.

**5.4 🟡 Coverage claim is broader than the schema.** `serviceAreaText` claims
"שירות ארצי בתיאום מראש" while `areaServed` enumerates 12 cities and `Service` nodes claim
גוש דן והמרכז. Confirm the national claim before using it as a keyword. Note where it renders: it
comes from `lib/site.ts` into the footer on every page, plus `/about/` and `/locations/`. So it is
sitewide and one data edit fixes it everywhere — and it is **not** a regression the location silo
introduced.

**5.5 🟡 GBP address visibility.** If a Business Profile exists with a visible address, it contradicts a
site that shows none. It must be a service-area profile with the address hidden.

---

## §6 AEO / GEO

**6.1 ✅ (2026-08-17) AI crawlers unblocked.** The Cloudflare managed `robots.txt` was confirmed
live-blocking in the morning (Disallow for ClaudeBot, GPTBot, Google-Extended, CCBot, Bytespider,
Amazonbot, Applebot-Extended, meta-externalagent + `ai-train=no`); the owner turned the toggle off
the same day, and the live file now serves the repo's blanket allow — **verified against
production**. Gate 1 of the AEO work is open. Standing rule: re-fetch the live `robots.txt` at the
start of any AEO audit — it is edge state a dashboard change can flip back without a deploy.

**6.2 ✅ (2026-08-17 → 2026-08-24) Answer blocks ship.** All four service pages, all three location
pages, `/pricing/` and all three guides now open with a question-form heading and a short
extractable answer, held in `lib/services.ts`, `lib/locations.ts`, `lib/pricing.ts` and
`lib/articles.ts`. Services, `/pricing/` and the guides fold theirs into the `FAQPage` graph, so the
markup and the visible text cannot drift. The spec is still the bar for anything new:
content-standards §5.

**6.3 ✅ FAQs are fully extractable.** Both the homepage `Faq` component and the per-service FAQ blocks
use native `<details>/<summary>`, so every answer ships in the DOM at first paint with **zero
JavaScript**. This is the site's strongest AEO asset. Protect it — a client-state accordion would break
both this and §4 rule 3.

**6.4 ✅ (2026-08-24) Shipped on the guides.** Each article in `lib/articles.ts` carries
`datePublished`, `dateModified` and a real `author`; all three are emitted in the `Article` node, and
`app/sitemap.ts` derives the guides' `lastModified` from `article.dateModified`. The remaining gap is
not authorship but **maintenance** — nothing bumps `dateModified` when an existing article is
edited (see §1.3).

**6.5 ✅ (2026-08-17) `public/llms.txt` written** — a short factual pointer map (services, key
answers, contact, service area), added the moment §6.1 opened. Live on the next deploy.

**6.6 ✅ (2026-08-17 → 2026-08-24) The citable material shipped.** The site now publishes what the
method **cannot** do: an honest-limits section on all four service pages (the `limits` field in
`lib/services.ts`) and the same honesty running through all three guides — a thermal camera images
surface temperature, not water, so it cannot see a deep slab leak under thick screed, or a wall
already at ambient. No competitor publishes this. **Protect it.** The temptation in any future
rewrite is to soften it into marketing, which destroys the exact property that makes it quotable.

**6.7 🟡 (opened 2026-09-06) The rest of the Gate-3 list is still unwritten.** §6.6 closed on the
topics that shipped, not on the whole list. Take the remaining topics from the `aeo-answer-content`
skill's Gate 3 rather than inventing new ones, and hold each to the content-standards §5
answer-block spec.

---

## §7 E-E-A-T & trust

**7.1 ✅ RESOLVED 2026-08-17 — kept verbatim as the record.** The file and the page are gone; see
§4.1 for the standing rule. **The paragraph below describes 2026-08-16 and is not live.**
_As first audited:_ 🔴 STOP-SHIP — six invented testimonials. `lib/reviews.ts` ships six fabricated reviews with
full names, cities and service attributions. They render on `/` and fill `/reviews/` entirely, and feed
the rating in §4.1. Fabricated reviews are a Google policy violation and a consumer-protection exposure,
and they are indistinguishable from real ones in the rendered HTML.

**7.2 ✅ RESOLVED 2026-08-17.** `TrustBar` was rebuilt on verified figures only; the 3,000+, the 97%
and the 4.9 are gone and must not return. _As first audited:_ 🟠 three unverified statistics
rendered as the primary trust block — `TrustBar` shows
`3,000+ בתים ועסקים` and `97% איתור כבר בביקור הראשון` with no source, plus the `4.9` from §7.1. The
fourth — `10+ שנות ניסיון` — **is** defensible (`foundedYear: 2015` in the roster). 97% in particular
reads as measured and nothing measures it.

**7.3 🟠 Uncredentialed certification claims.** `site.certifications` claims a certified thermography
technician (Level 1) and professional FLIR equipment. No certificate number, no issuing body, no
insurance, no association membership, no ח.פ. — while `legalName` claims `בע״מ`.

**7.4 ✅ (2026-08-30) The guarantee has a published scope.** `לא מצאנו — לא שילמתם` now has a
confirmed definition of "found", a stated exclusion list and an explicit no-call-out-fee term
(business-facts §C), held in `site.guaranteeTerms` in `lib/site.ts` and rendered by
`components/GuaranteeTerms.tsx`. **One sub-item remains: those terms reach only one of the eight
pages that make the promise — see §7.8.**

**7.5 🟠 → partly resolved (2026-08-24).** The founder **רונן דהן** is confirmed (business-facts §A)
and now carries real weight: a `Person` node as the business's `founder` in `lib/jsonld.ts`,
resolving to a real `#founder` anchor on `/about/`, plus the byline on all three guides. **Still
open:** no technician is named; the credentials behind the name are still unconfirmed (§7.3); and
the byline `Person` has no `@id` of its own, so to a parser the article author and the business
founder are two unconnected people with the same name.

**7.6 ✅ RESOLVED 2026-08-17.** The footer social icons were removed with `site.social`; there is no
such link on the site. See §4.2. The original point still governs the decision to restore them: a
link that lands on a platform homepage actively demonstrates there is no profile.

**7.7 🟡 Prices unverified.** `priceFrom: 450` and the per-service `priceModel` strings. Roster marks
them unconfirmed.

**7.8 🟠 (opened 2026-09-06) The confirmed guarantee reaches one page in eight.** Eight emitted pages
make the promise `לא מצאנו — לא שילמתם` — the homepage, `/about/`, `/pricing/`, all four service
pages and one guide. `components/GuaranteeTerms.tsx` renders on `/pricing/` only. Three problems
compound it: the component has no `id`, so no page can even deep-link to the terms; the general FAQ
set that powers the homepage `FAQPage` has no guarantee question, so answer engines see the promise
and never the scope; and `lib/articles.ts` restates the terms as hand-typed prose instead of
deriving them from `site.guaranteeTerms`, which is drift waiting to happen. This is worse than the
old §7.4, not better: an undefined promise is vague, but a promise whose published scope is
unreachable from seven of the eight places it is made is a dispute.

**✅ Verified good:** the privacy policy and accessibility statement are real, substantive documents,
not boilerplate stubs. Hours, service area and contact routes are clear and consistent.

---

## §8 Conversion

**8.1 ✅ RESOLVED 2026-08-17.** The failure path is handled and the success state no longer
misreports; the handoff goes to `/thank-you/`. _As first audited:_ 🟠 the contact form can lose a
lead silently — `ContactForm.handleSubmit` calls
`window.open(whatsappHref(...))` and then sets the success state **unconditionally**. `window.open`
returns `null` when a popup blocker intervenes, and many desktop visitors have no WhatsApp client. In
both cases the visitor sees "הפנייה מוכנה לשליחה בוואטסאפ" and the lead is gone. The success copy does
mention the phone number, which softens it, but the state still misreports what happened.

**8.2 ✅ RESOLVED 2026-08-17.** `/thank-you/` exists, is deliberately `noindex` and is deliberately
absent from the sitemap. **But it is reached by a client-side `router.push`, not a document load** —
so a GTM All Pages trigger will never see it. Any `thank_you_view` conversion must be built on a
History Change trigger; see §13.5.

**8.3 ✅ RESOLVED 2026-08-17 → 2026-08-24.** The `{location}-{action}` inventory shipped; see §13.2
for what exists and §13.5 for the fact that nothing consumes it yet. Any new CTA must carry one.

**8.4 ✅ RESOLVED 2026-08-17 — for the link, not for consent.** The form now links to `/privacy/`
rather than only asserting. That is a disclosure link, **not** a consent mechanism: there is still
no consent state anywhere in the codebase, and the privacy page it links to is itself now inaccurate
about analytics. See §13.7.

**8.5 ✅ RESOLVED 2026-08-17.** `ContactForm` moves focus to the first invalid field on submit (with
a comment saying why), and the success path hands off to `/thank-you/` rather than an inline swap.

**8.6 🟠 (opened 2026-09-06) The mobile sticky bar permanently covers the footer's legal links — the
spacer is on the wrong element.** `app/layout.tsx` puts `pb-20 md:pb-0` on `<main>`, but `<Footer>`
and `<StickyContact>` are **siblings after it**, so those 80px are inserted _before_ the footer and
add nothing at the end of the document. `StickyContact` is `fixed inset-x-0 bottom-0` and about
57px tall (`py-4` + 16px text + border), so at the bottom of the page it sits over the footer's
bottom padding and its entire legal-links row. On mobile, הצהרת נגישות and מדיניות פרטיות are
hidden and untappable — a tap there hits the call/WhatsApp buttons instead.

**This is a compliance problem, not a cosmetic one.** The footer holds the **only** link to
`/accessibility/` anywhere on the site — it is not in `navLinks` — and the site publishes an IS 5568
statement. Fix: move the spacer onto the `<footer>` (or its bottom-bar container) and off `<main>`.
While there, give the sticky bar `pb-[env(safe-area-inset-bottom)]`; it has none today, so on a
notched iPhone the home-indicator strip eats into the two primary CTAs as well.

**8.7 🟡 (opened 2026-10-12) Between 768 and 820 px the header's call button wraps onto two
lines — live in production.** Found during the fleet live-kit review. The owner approved the fix on
2026-10-12 (fleet wording sign-off page) **as a separate change, after the live surfaces ship** — it
is deliberately not part of the live-kit port (business-facts §G).

**✅ Verified good (re-verified 2026-09-06):** click-to-call above the fold on every page; a sticky
call/CTA sidebar on service pages; per-field validation with `aria-invalid` + `aria-describedby`;
focus moved to the first invalid field on submit (`ContactForm`, with a comment saying why); an
Israeli phone pattern that accepts what real customers type. ~~`StickyContact` mobile bar with a
matching `pb-20 md:pb-0` spacer so it never covers the footer~~ — **the spacer does not do that;
see §8.6.**

---

## §9 Navigation & internal linking

**9.1 ✅ Zero orphans.** Every content route has an inbound internal link. The only unlinked emitted
files are the two 404 artifacts, which is correct. The footer renders **every** service, **every** nav
link and both legal pages with no truncation.

**9.2 🟡 Individual services are two hops from the header.** `navLinks` reaches `/services/` but not the
four detail pages. With only four services a dropdown is cheap.

**9.3 ✅ RESOLVED 2026-08-17.** All four service pages carry in-copy `related.links` with real
anchor text, including the two edges this item named. The remaining mesh gap is a different one —
nothing links _into_ the location silo; see §9.6.

**9.4 🟡 `/services/` has no hub prose** — still true, re-verified 2026-09-06. `app/services/page.tsx`
goes straight from `PageHero` to the card grid. An intro explaining how the four services relate —
one camera, one visit, four different questions — would add both depth and anchor text, and is the
natural place to put the descriptive links into `/locations/` that §9.6 says are missing.

**9.5 ✅ (2026-08-17) Fixed.** The `related.links` hrefs in `lib/services.ts` now carry the trailing
slash, so no internal link costs a redirect hop under `trailingSlash: true`. Standing rule: write
internal hrefs with the trailing slash, always.

**9.6 🟡 (opened 2026-09-06) Nothing links _into_ the location silo with a descriptive anchor.**
§9.1's "zero orphans" is still true — `/locations/` is reachable sitewide from the footer — but the
four service pages' in-copy `related.links` arrays in `lib/services.ts` point only at other
services. So the three city pages, the newest and most expensively gated silo on the site, receive
no descriptive-anchor link from the pages that are topically closest to them. This is a mesh-depth
gap, not an orphan; the `internal-linking` skill's own pre-ship requirement for the silo asked for
these edges and they were never added.

---

## §10 Performance

**10.1 🟡 Re-baselined 2026-09-06 — the export is at 98.5% of its budget.** `out/` measures
**5,910,433 bytes across 220 files**, not the "3.9 MB" this line claimed for three sprints, against
the 6 MB budget in [performance-guidelines.md](performance-guidelines.md). The delta is almost
exactly the two new silos: `out/guides` and `out/locations` are about 1.87 MB together. _(2026-10-12:
the owner raised that budget to 7.5 MB — the live surfaces take a build to ≈6.93 MB; see
performance-guidelines.md §1.)_

Composition matters here, because 47% of the export is a class neither budget table has a row for.
**RSC segment payloads — the `.txt` files — are 2,769,645 B across 158 files, 46.9% of the whole
export**, larger than all the HTML (1,984,248 B). Next 16 emits each route's payload **twice**,
byte-identical: `out/index.txt` and `out/__next._full.txt` `cmp` clean at 70,789 B each. `out/_next`
is 936,350 B; `out/og.png` is 128,363 B.

**These payloads are `<Link>` navigation prefetch, not first paint** — so this costs no LCP, and the
old "healthy" verdict was not wrong about user-facing speed. What it is: deploy weight and origin
round trips, since Pages serves them `DYNAMIC` with `max-age=0` and no prefetch policy is set
anywhere in the codebase.

**Why it now matters:** the nine remaining cities in the 12-city plan would add roughly 2.7 MB at
the measured ~305 KB per location, taking the export past the budget. Nothing would catch it — the
`qa-build-gate` size check is a bare comment with no assertion, and its JS check greps for chunks
over 500 KB when the documented budget is 200 KB. Kill that 500 KB folklore wherever it appears; it
is not this site's budget.

**Still true and worth protecting:** no dev-only artifacts; four runtime dependencies; exactly four
client components (`ContactForm`, `Navbar`, `ThankYouContent`); a FAQ built on `<details>` with zero
JS; a one-year immutable `Cache-Control` on `/_next/static/*` in `public/_headers`; and Cloudflare
Pages serving from the edge.

**10.2 🔵 (downgraded 2026-09-06) `images: { unoptimized: true }` means no `srcset` — and here that
costs almost nothing.** **All four** service illustrations are SVG, not three. So the only raster
images on the whole site are `public/images/hero.webp` at 33,210 B and the 18,480 B logo, and
`public/images/` is about 80 KB in total. The hero is 828×670 intrinsic and renders at ≤448 CSS px,
which is already correct for a 2× display and comfortably inside the LCP-image budget. The "remove
`sizes` or make it real" half is moot too: there is no `sizes=` anywhere in `app/` or `components/`.

Keep the rule — don't pass `sizes` to an unoptimized image, it looks correct and does nothing — but
do not spend a sprint slot here. §10.1 is where the bytes are.

**10.3 ✅ RESOLVED 2026-08-17.** `Navbar` no longer passes `priority` to `Logo` and carries a comment
explaining that the hero image is the LCP candidate. The rule stands: at most one `priority` image
per page.

**10.4 ✅ Resolved-by-framework — there was never anything to do.** `next/font/google` preloads by
default: the build emits four `<link rel="preload" as="font" type="font/woff2">` tags on every
route. This item was wrong when it was written, not merely outdated. Drop it from any sprint plan
that still schedules it.

**10.5 🟠 Measure the right artifact.** See §1.6 — `out/` is often stale. `rm -rf .next out` and rebuild
before any measurement.

---

## §11 Accessibility (WCAG 2.0 AA + IS 5568)

The site **publishes** an accessibility statement at `/accessibility/` claiming תקנות התשע״ג–2013 and
level AA of ת״י 5568. A failure here also makes a published document false.

**11.1 ✅ (2026-08-17) The named value was fixed.** `text-ink/50` has zero occurrences in the tree,
and `text-ink/70` (≈5.7:1) is the passing step. **But it was a swap of one literal, not an audit of
the palette** — see §11.2. Do not send anyone hunting `text-ink/50`; it is gone.

**11.2 ✅ (2026-09-17) RESOLVED in Sprint 4.** All seven raised to `ink/70`+ and the input borders
to `border-ink/55`; `/accessibility/` re-dated to ספטמבר 2026 after the fix. The gate now greps a
RANGE (`text-ink/` below 70), not a list of values — enumerating is what let `/40`, `/55` and `/60`
through for three sprints. **The history below is kept deliberately.**

**11.2 (historical) 🟠 REOPENED 2026-09-06 — seven live contrast failures, one of them on the
accessibility statement itself and one on `/privacy/`.** The 2026-08-17 pass declared this closed. It was not. `ink` is `#1B2733`; recomputed
against the real backgrounds, the opacity steps actually in use are `ink/70` ≈5.7 ✅ · `ink/60`
≈4.15 ❌ · `ink/55` ≈3.58 ❌ · `ink/50` ≈3.10 ❌ · `ink/40` ≈2.38 ❌. Shipping today, seven
occurrences across three token values:

- `text-sm text-ink/55` on `app/accessibility/page.tsx` and `app/privacy/page.tsx` — the
  "last updated" lines of the two compliance documents themselves.
- `text-sm text-ink/60` ×4 in `components/ContactCTA.tsx`.
- `placeholder:text-ink/40` in `components/ContactForm.tsx`. SC 1.4.3 has no placeholder exemption.

(An earlier count of six covered only `ink/55` ×2 and `ink/60` ×4; seven adds the
`placeholder:text-ink/40` at `components/ContactForm.tsx:45`. All four `ink/60` instances were
always included — do not go hunting a fifth.) All
are 14px normal weight, so no large-text exemption applies. The A2 contrast table in
[accessibility-and-i18n.md](accessibility-and-i18n.md) only ever enumerated `ink/50`, `/70`, `/80`
and `/100` — which is exactly how `/40`, `/55` and `/60` passed through uncomputed.

**`text-ink/70` is the hard floor.** Fix the values, fill in the missing rows of the A2 table, then
add a build-gate grep so the next one cannot ship. And the standing rule holds: `/accessibility/`
claims "שמירה על ניגודיות צבעים תקינה בין הטקסט לרקע", so while any of these ship, that published
declaration is false. Fix the contrast — never edit the statement down to match.

**11.3 ✅ (2026-08-24) Complete.** The menu now has a focus trap (Tab wraps within the panel, both
directions), a scroll lock that restores the previous `overflow` value, focus moved into the panel on
open, and focus returned to the trigger on Escape.

**11.4 ✅ RESOLVED 2026-08-17.** See §8.5 — focus moves to the first invalid field on submit.

**11.5 ✅ (2026-08-24) Fixed.** The service illustration now carries `alt=""`. It is decorative — an
abstract graphic directly under an H1 that already states the service name — so an empty alt is
correct and stops the heading being announced twice.

**11.6 ✅ (2026-08-24) Fixed for the menu button.** It was `p-2` around a 24px icon = 40px, under the
44px floor; now `size-11`, exactly 44px. **Not fixed elsewhere:** the shared `md` size token in
`CtaButton` computes to 40px (`px-5 py-2.5 text-sm`) and is used at mobile widths in `Navbar`, on
`/pricing/` and on the 404 page. That is WCAG 2.5.5 Target Size (AAA), not an AA failure, so it does
not make the published statement false — but it is the same missing 4px, on the site's primary
buttons.

**✅ Verified good and worth protecting:** the token palette is deliberately split and correct —
`brand` on white ≈11.4:1, `accent-strong` + white ≈5.2:1 (the CTA colour), with `accent` (≈2.8:1)
reserved for decoration; a global `:focus-visible` ring in `brand-light` (a UI-contrast case it clears);
a skip link; landmarks and labelled `<nav>` regions; consistent `aria-hidden` on decorative icons;
`aria-label` on icon-only links; a global `prefers-reduced-motion` block; **zero** banned
physical-direction Tailwind utilities across the whole repo; correct `dir="ltr"` isolation on every
phone and email.

---

## §12 Security

**12.1 ✅ (2026-08-17) Security headers shipped via `public/_headers`.** HSTS (no
preload/includeSubDomains — deliberate, business-facts §F), `X-Frame-Options: SAMEORIGIN`,
`nosniff`, `Referrer-Policy`, `Permissions-Policy`, plus immutable caching on `/_next/static/*`.
Verified in the live response post-deploy. Historical note: this item originally targeted
`.htaccess`, written when the repo believed Apache was the origin — it wasn't (see the shipped block
above). **One stale directive, found 2026-09-06:** `Permissions-Policy` still carries
`interest-cohort=()`, which targeted FLoC — a feature Chrome removed. Its live successor,
`browsing-topics=()`, is absent, and a Google tag now runs on this domain, which is precisely the
case the directive exists for.

**12.2 🟠 Report-only CSP shipped (2026-08-24), widened for the tag (2026-08-30).** `public/_headers`
carries a `Content-Security-Policy-Report-Only` with `default-src 'self'`, `object-src 'none'`,
`base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'self'`, and a `script-src` /
`connect-src` / `img-src` / `frame-src` allowlist that **already permits googletagmanager**. The
widening landed in the same commit as the tag, exactly as this item required. **Anyone "hardening"
it back to `script-src 'self'` would break the live analytics and would have to undo it before the
policy could ever be enforced.**

Two things to understand before touching it. First, `'unsafe-inline'` in `script-src` is
**structural**: `output: "export"` emits inline RSC flight `<script>` blocks on every page and there
is no nonce mechanism, so it would still be required even with GTM removed. Which means `script-src`
here is a host allowlist, not an XSS control — the directives doing real work are `object-src`,
`base-uri`, `form-action` and `frame-ancestors`, and what compensates for the weak `script-src` is
that this site renders no user-generated content as HTML.

**Still open:** promotion to enforcing — which as written cannot be executed at all. See §12.7.

**12.3 ✅ Minimal data surface.** The form POSTs nowhere; it hands the user's own data to the user's own
WhatsApp client. No endpoint, no access key, no server-side store. The roster records
`formAccessKey: null` **by design** — this site is deliberately not on Web3Forms like its nine fleet
siblings.

**12.4 ✅ (2026-08-17) The deploy chain now has a manual gate.** Pushing to `main` runs build-only
CI; production ships via the fleet ops script (wrangler → Pages) with a Cloudflare-API drift check,
an output gate, `out.prev/` rollback and a deploy log — and it always asks before `-Confirm`. The
prior state (push = unreviewed production rsync) is gone, and so is its silent-drift failure mode.

> 🔶 **Unverified from here (2026-09-06):** CLAUDE.md §10 says the ops script logs to
> `logs/deploys.csv`, and **there is no `logs/` directory in this repo.** Either the script writes it
> outside the repo or it never wrote one. Until that is settled, deploy provenance cannot be checked
> locally — which is the same class of blind spot the 15-day rsync incident lived in. Locate the log
> or retire the claim; do not assume.

**12.5 ✅ Secret hygiene is sound — and improved.** The repo is public. The only key-shaped string
in it is the Google Search Console verification token, which is public by design. Deploy
credentials now live solely in the Sys Admin control plane; the old `SSH_PRIVATE_KEY` /
`SSH_HOST` / `SSH_USER` Actions secrets are unused and should be deleted from the GitHub repo
settings (owner action — secrets can't be removed from here).

**12.6 ✅ Obsolete.** The "no origin-side HTTPS redirect in `.htaccess`" rule died with the Apache
origin. `.htaccess` is deleted; redirects live in `public/_redirects`.

**12.7 🟠 (opened 2026-09-06) The CSP reports nowhere, so the documented promotion process is
unexecutable.** §12.2 says "promote to enforcing after a full week of real traffic produces no
legitimate violations". But the header carries **no `report-uri` and no `report-to`**. A Report-Only
policy with no reporting endpoint blocks nothing and reports nothing — the week of observation
collects zero data by construction, and always did. (The `Report-To` header in the live response is
Cloudflare's NEL; it cannot receive CSP reports.) Either add a reporting endpoint, or replace the
criterion with something honest — for example, one manual pass with the browser console open,
through a real form submit, on every route type. While in there, check `connect-src`: it lists
`https://*.analytics.google.com` and `https://www.google-analytics.com`, which match neither the
`analytics.google.com` apex nor `region1.google-analytics.com`.

---

## §13 Analytics & measurement

**13.1 🟠 (2026-08-30) Analytics installed; only `page_view` is measured.** The decision was taken —
**join the shared fleet container** — and it shipped. `GTM-KWGGH438` (from `lib/site.ts`, injected
by `components/Analytics.tsx` in the root layout) runs on every route, and the container resolves
`thermoleak.co.il` to GA4 property **`G-5YWLZ07PEC`** by a hostname RegEx table. Page views flow.

**The 🔴 above is retired — but the real defect is one layer deeper and had no number at all:** the
container holds a single GA4 config tag firing on `gtm.init`, zero click triggers and zero event
tags, and no repo code pushes anything to `dataLayer`. That is §13.5.

The blast-radius rule from the original decision still stands: the container is shared with the rest
of the fleet, so **never edit a shared trigger without a hostname condition.**

**13.2 ✅ (2026-08-17 → 2026-08-24) The `data-cta` inventory shipped.** Thirteen literal `data-cta`
attributes live in `app/` + `components/`, plus the values passed through `CtaButton`'s `dataCta`
prop — 18 distinct values are visible in a fresh `out/` (`hero-*`, `header-call`, `service-*`,
`pricing-*`, `finalcta-*`, `footer-*`, `sticky-*`, `form-whatsapp`, `thankyou-*`), and `menu-call` is
rendered client-side by `Navbar`. **The hooks exist and nothing consumes them** — that is §13.5, not
this item. One real gap remains here: the three `/locations/` pages carry no `location-*` value of
their own, so a city-page conversion is indistinguishable from any other page's.

**13.3 ✅ Roster updated.** The roster now carries the real Search Console verification token, so it
no longer contradicts `app/layout.tsx`.

**13.4 🟡 Name the lead event honestly — analytics has landed, so this is now live guidance.** The
form opens a WhatsApp deep link and cannot confirm delivery, so the event means "handoff attempted",
not "lead received". Name it `lead_whatsapp_open`, and **never put name, phone or message into
`dataLayer`** — a rule §13.6 shows also covers `href` attributes, not just pushes.

**13.5 🔴 (opened 2026-09-06) The event layer is unwired end to end — all seven documented
conversion events fire zero times.** Verified from both ends. Repo side: the only `dataLayer`
reference anywhere in `app/`, `components/` and `lib/` is the GTM bootstrap itself — **zero event
pushes**. Container side: `GTM-KWGGH438` holds one tag, the GA4 config, firing on `gtm.init`; no
click triggers, no event tags.

Trace the site's **number-one stated conversion goal** through that. A visitor taps
`<a href="tel:…" data-cta="header-call">`. No page code listens. GTM attaches its click listeners
only when at least one click trigger exists in the container, and none does. Nothing reaches GA4 —
and there is no fallback, because GA4 Enhanced Measurement never tracks `tel:` links, only http(s)
outbound ones. **Phone calls, the primary lead channel, are 100% invisible.**

Two of the seven events cannot be wired container-side at all: `lead_whatsapp_open` and
`lead_handoff_blocked` depend on whether `window.open` returned `null`, which `ContactForm` observes
and writes only to `sessionStorage`. GTM cannot see it. So the fix has two halves: **(a)** in-repo,
a small typed `pushEvent()` helper called from the few places a container physically cannot reach —
passing the fixed `service` enum, **never** the free-text `area`, and never name, phone or message;
**(b)** container-side, hostname-scoped `[data-cta]` click triggers, which is the owner's call
because the container is shared fleet-wide.

Rated Critical for the same reason §13.1 originally was: three sprints of content and location work
have now shipped with no conversion measurement to judge them by, and the done-criterion that would
have caught it — a call click, a WhatsApp click and a form submit each appearing exactly once in
realtime analytics — was never actually run.

**13.6 🟠 (opened 2026-09-06) The visitor's name and phone sit in a tagged, clickable `href` on
`/thank-you/`.** After a real submit, `ThankYouContent` renders
`<a href={whatsappHref(handoff.message)} … data-cta="thankyou-whatsapp">`, and that message is
`שם: {name}` + `טלפון: {phone}` + area + service + free text, URL-encoded into the query string.
GTM's built-in Click URL variable (`gtm.elementUrl`, already defined in the live container) is
populated with the full href on any click trigger, and GA4 Enhanced Measurement's outbound-click
event sends the complete URL as `link_url`. So a lead's name and mobile number can land in a Google
Analytics property this repo does not control — and it becomes a **certainty** the moment §13.5's
`[data-cta]` click triggers land.

That violates the prohibition this repo states in three separate places (§13.4, the comment block in
`components/Analytics.tsx`, and CLAUDE.md §12), and it makes the form's own consent line
("הם אינם נשמרים אצלנו") false. The static HTML is clean — the fallback href is a generic prefill —
which is exactly why it survived: it only exists in a real post-submit session.

Fix without losing anything: set the anchor's `href` to the generic `whatsappHref()` (still a valid
no-JS fallback) and open the personalised link from an `onClick` handler. `ThankYouContent` is
already a client component reading the handoff from `sessionStorage`, so no capability is lost, the
popup-blocked path still works, and the `data-cta` trigger survives. Then verify it the way the
roadmap always specified and nobody did: submit the form and **inspect the request, not the
config.**

**13.7 🟠 (opened 2026-09-06) The privacy page hedges about analytics that definitively ship, and
there is no consent mechanism anywhere.** `app/privacy/page.tsx` still says
`ייתכן שהאתר עושה שימוש בעוגיות ובכלי ניתוח תנועה (כגון Google Analytics)` — "the site **may** use
cookies and analytics tools". It does, on every route, since 2026-08-30. A hedge that has become a
fact is a false statement in a published privacy policy, on an Israeli site under the Privacy
Protection Law. Separately, `grep -rn "consent" app components lib` returns **zero hits**: no
consent banner, no Consent Mode default state, no opt-out path.

Two decisions, and the second is the owner's. **(a)** Rewrite the privacy copy to state GA4
definitively and name a real opt-out. **(b)** Decide whether a Consent Mode v2 default-deny must
land **before** any further event tags — because every event added on top of §13.5 widens what is
collected without consent. Do not treat (a) as satisfied by adding a cookie banner, and do not treat
(b) as a code task with an obvious answer.

---

## §14 Environment freshness

**14.1 🟠 (opened 2026-09-06) Nothing keeps the instruction files true, and they drifted through
four sprints.** This file declares itself the register every `.claude/` agent and skill cites — but
it tracks only the code. Nothing anywhere fails when the instructions and the code diverge. That is
why the 2026-09-06 pass found agents and skills still describing a deleted file (`lib/reviews.ts`),
fabrications purged a month earlier, silos that now exist as though they did not, and a deploy model
("shipping means pushing to `main`") that this repo paid fifteen days of silent outage to disprove.
Two of the drifted files hold Edit/Write.

**The obligation, in one line: a sprint that changes the world must change the instructions in the
same commit.** Concretely — whenever a change moves the route count, the sitemap URL count, the
component or `lib/` file list, the client-component count, the export size, a `public/_headers`
directive, or the status of any item in this file:

1. Re-derive the facts from a **fresh** build. Never from memory, never from a stale `out/` (§1.6).
2. Grep `.claude/**` and `docs/**` for the stale form of every number you just changed, and for the
   standing denylist of purged strings: `lib/reviews.ts`, `aggregateRating`, `site.social`,
   `site.geo`, `facebook.com`, "doesn't exist yet", "no location pages", "zero analytics",
   "pushing to `main`".
3. Fix every hit **in the same commit**, and flip the corresponding item here.

A frontmatter `description` is the highest-priority fix in any such file: it renders in the
always-visible skill and agent listing, so a false one misroutes work in **every** session, not only
when the file is opened.

---

## Phased roadmap

Phases 1–4 are the original plan, annotated 2026-09-06 with what actually happened. Phase 5 is what
the reconciliation opened. For sequencing and gates, see
[implementation-roadmap.md](implementation-roadmap.md).

**Phase 1 — stop the bleeding** — ✅ complete 2026-08-17

1. ✅ §4.1 / §7.1 — `aggregateRating` and the six fabricated testimonials removed; `/reviews/` 301s
   to `/about/`. The purge has held: still zero on every re-check.
2. ✅ §4.2 / §7.6 — the `sameAs` array and the footer social links are gone.
3. ✅ §2.1 — both title bugs fixed.
4. ✅ §11.1 — `text-ink/50` → `text-ink/70`. **It did not restore §11.2.** Seven other occurrences,
   at `ink/55`, `ink/60` and `ink/40`, were never enumerated. See the reopened §11.2.
5. ✅ §4.3 — `BreadcrumbList` is emitted by `PageHero` itself.

**Phase 2 — make it measurable** — ⏳ half done

6. ⏳ §13.1 — the container ships and §12.2's CSP was widened in the same commit, as required. But
   **nothing beyond `page_view` is measured**; the work moved to §13.5.
7. ✅ §8.3 / §13.2 — the `data-cta` inventory shipped. Nothing consumes it (§13.5).
8. ✅ §8.1 / §8.2 / §8.4 — the form's failure path, `/thank-you/`, and the consent link.
9. ⏳ §5.3 — Google Business Profile. **Owner action, still open**, and still the top local lever.

**Phase 3 — earn the rankings** — ✅ complete except what §7.3 gates

10. ✅ §3.2 / §6.2 / §6.6 — depth, answer blocks and the honest-limits material.
11. ⏳ §3.3 — `/about/` reached its floor, but its potential is still gated on §7.3.
12. ✅ §9.3 — contextual in-copy links on all four service pages. ⏳ §9.4 — `/services/` still goes
    straight from the hero to the card grid with no hub prose.
13. ✅ §1.2 — the sitemap parity assertion. ⏳ §1.3 — the dates are hand-maintained and now stale.

**Phase 4 — expand, carefully** — ✅ shipped

14. ✅ §3.5 — three guides, with real bylines.
15. ✅ §3.4 / §5.2 — three cities, not twelve.
16. ✅ §10.3 (logo `priority` dropped) and §10.4 (never needed at all); §10.2 downgraded to 🔵.
17. ✅ §12.1 — security headers. ⏳ CSP enforcement, blocked by §12.7 rather than by time.

**Phase 5 — close what the 2026-09-06 reconciliation opened**

18. §13.6 / §8.6 — the PII in the `/thank-you/` href, and the sticky bar covering the footer's legal
    row. Both trivial, both live, both landing on real people.
19. §11.2 — the seven contrast values, then the missing rows of the A2 table, then a build-gate grep
    so the next one cannot ship.
20. §13.5 — the event layer. The in-repo half first; the container half is the owner's.
21. §13.7 — the privacy copy, then the consent decision.
22. §2.4 — `pageOpenGraph()`, plus the `og:image`/`og:url` assertion added to the build gate.
23. §12.7 / §7.8 / §9.6 / §10.1 — a CSP reporting endpoint, the guarantee's reach, the
    service → location edges, and a real export-size assertion **before** a fourth city is even
    considered.
24. §14 — and do all of the above with the instruction files updated in the same commit.

**Never:** build 12 thin city pages; invent a review, rating, statistic, credential or byline to
fill a gap; ship a claim whose source is not `lib/site.ts`, the roster or
[business-facts.md](business-facts.md); or believe that pushing to `main` deploys anything
(CLAUDE.md §10).
