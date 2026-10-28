# Schema graph — target JSON-LD

What every route should emit. `schema-auditor` validates against this file;
`schema-structured-data` implements it. Builders live in **`lib/jsonld.ts`** (hand-written in this repo,
no external SEO kit): `localBusinessJsonLd` · `webSiteJsonLd` · `serviceJsonLd` ·
`locationServiceJsonLd` · `articleJsonLd` · `faqPageJsonLd` · `aboutPageJsonLd` ·
`contactPageJsonLd` · `collectionPageJsonLd` (the last three share the private `pageNode` helper) ·
`breadcrumbJsonLd`, rendered through `components/JsonLd.tsx`.

**Status verified against the build of 2026-09-06** — 22 `index.html` files, 19 of them in
`sitemap.xml`; route counts are re-stated for the 2026-10-28 build — 31 `index.html` files, 28 in
`sitemap.xml`. Every ✅/❌ below was read out of `out/`, not inferred from the source. When this file
and a fresh `out/` disagree, `out/` wins and this file gets fixed in the same commit.

---

## 1. `@id` scheme

Stable `@id`s let nodes reference each other instead of repeating themselves.

| Node                 | `@id`                                                | Status                                                                             |
| -------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------- |
| The business         | `https://thermoleak.co.il/#business`                 | ✅ emitted on all 31 pages                                                         |
| The website          | `https://thermoleak.co.il/#website`                  | ✅ emitted on all 31 pages                                                         |
| A service            | `https://thermoleak.co.il/services/{slug}/#service`  | ✅ `lib/jsonld.ts:69`                                                              |
| A location's service | `https://thermoleak.co.il/locations/{slug}/#service` | ✅ `lib/jsonld.ts:94`                                                              |
| An article           | `https://thermoleak.co.il/guides/{slug}/#article`    | ✅ `lib/jsonld.ts:172`                                                             |
| A page / hub node    | `{pageUrl}#page`                                     | ✅ `lib/jsonld.ts:135` — see §2 for which pages                                    |
| The founder          | `https://thermoleak.co.il/about/#founder`            | ✅ on `LocalBusiness.founder` **and** on `Article.author` (SD-5 closed 2026-10-28) |
| A page's breadcrumb  | `{pageUrl}#breadcrumb`                               | ❌ breadcrumbs still have no `@id`                                                 |

`about/#founder` resolves to a real on-page anchor (`app/about/page.tsx` renders `id="founder"`,
with `scroll-mt-20` so a jump clears the sticky header), and since 2026-10-28 the guide bylines link
to it — the anchor is reachable by a human, not only by a parser. `Article.author` carries the same
`@id` **when the byline is the founder**; a guest author gets a bare `Person` with no `@id` on
purpose, because they are not that entity. The paragraph below describes the state before that fix,
when `Article.author` emitted a bare
`{"@type":"Person","name":…}` on the three guides — the same real human as `LocalBusiness.founder`,
described twice as two unlinked entities. Fixing that is a one-line code change (SD-5, §7b) and needs
no new business fact, since the name is already confirmed (business-facts §A).

All URLs are built through `canonicalUrl()` in `lib/site.ts`, which applies `withTrailingSlash()` — so
`@id`, `url`, the page canonical and the sitemap `<loc>` are the same string. Keep using it rather than
concatenating URLs by hand.

---

## 2. Node per route type

Required = what this spec demands. Emitted = what the 2026-09-06 build actually contains.

| Route                         | Required                                                | Emitted today                                                                               |
| ----------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| every page (root layout)      | `LocalBusiness` + `WebSite`                             | ✅ both, 31/31 pages                                                                        |
| `/`                           | + `FAQPage` from `generalFaqs`                          | ✅ **10** questions (the 10th is the guarantee, added 2026-10-28); no breadcrumb, by design |
| `/services/`                  | `CollectionPage` + `BreadcrumbList`                     | ✅ both                                                                                     |
| `/services/{slug}/` ×4        | `Service` + `FAQPage` + `BreadcrumbList`                | ✅ all three (FAQPage = `answer` + 3 `faqs`)                                                |
| `/guides/`                    | `CollectionPage` + `BreadcrumbList`                     | ✅ both                                                                                     |
| `/guides/{slug}/` ×3          | `Article` + `FAQPage` + `BreadcrumbList`                | ✅ all three; `Article.image` ❌ (SD-6, §7b)                                                |
| `/locations/`                 | `CollectionPage` + `BreadcrumbList`                     | ✅ both                                                                                     |
| `/locations/{city}/` ×12      | `Service` + `areaServed` + `FAQPage` + `BreadcrumbList` | ✅ all four — see §5                                                                        |
| `/pricing/`                   | `FAQPage` + `BreadcrumbList`                            | ✅ both (FAQPage = `answer` + 4 `faqs`)                                                     |
| `/about/`                     | `AboutPage` + `BreadcrumbList`                          | ✅ both; the `Person` is the global `founder`                                               |
| `/contact/`                   | `ContactPage` + `BreadcrumbList`                        | ✅ both                                                                                     |
| `/accessibility/` `/privacy/` | `BreadcrumbList`                                        | ✅ — no `#page` node, and none is required                                                  |
| `/thank-you/`                 | nothing beyond the global pair                          | ✅ — noindex, absent from the sitemap on purpose                                            |
| `/404/` `/_not-found/`        | nothing beyond the global pair                          | ✅                                                                                          |

`/reviews/` is **gone** — the route and `lib/reviews.ts` were removed 2026-08-17 and the URL 301s to
`/about/` via `public/_redirects`. It has no row here and must not get one back without real,
sourced reviews (§4.1).

### 2a. The page-node convention

A page gets a `#page` node (`AboutPage` / `ContactPage` / `CollectionPage`, all built by the private
`pageNode` helper at `lib/jsonld.ts:131`) **only when it has no other content node to carry it**. Hub
and narrative pages qualify; a page already emitting `Service`, `Article` or `FAQPage` does not.

So `/pricing/` carrying `FAQPage` and no `#page` node is a **decision, not a gap** — the same reason
`/services/{slug}/`, `/guides/{slug}/` and `/locations/{city}/` have none. `/accessibility/` and
`/privacy/` carry neither, which is accepted: a `WebPage` node adds nothing a crawler cannot read from
the document itself, and one node per concept per page (§4.6) is the value being protected.

`CollectionPage.mainEntity` (an `ItemList` of what each hub collects) is **deliberately not required**.
The three hubs already expose their members as crawlable links, no search feature consumes the
property, and adding it would widen the builder surface for no measurable return.

### 2b. Breadcrumbs: emitted once, by `PageHero`

`components/PageHero.tsx` emits the `BreadcrumbList` itself, from the same `crumbs` array the visible
trail renders. One array, one truth — the markup and the schema cannot drift apart.

**Pages must never call `breadcrumbJsonLd` directly.** Doing so double-emits the node on that page.
The only legitimate caller is `PageHero`; the builder stays exported for it alone.

Target and actual: **27 pages** carry `BreadcrumbList` — every page except `/`, `/thank-you/` and the
two 404 artifacts, none of which render a `PageHero` trail. Verified: `grep -rl 'BreadcrumbList' out
--include=index.html | wc -l` → 27 (18 before the nine cities).

The one thing still missing is the `@id` (§1): the node ships without `{pageUrl}#breadcrumb`, so it
cannot be referenced from elsewhere in the graph. Low value, still open.

---

## 3. The business node

Built by `localBusinessJsonLd()` in `lib/jsonld.ts`, reading entirely from `lib/site.ts`. Never
hand-assemble it and never hardcode a value `site` already carries.

**Present and correct today:** `@type: ["LocalBusiness", "HomeAndConstructionBusiness"]`, `@id`, `name`,
`alternateName`, `description`, `url`, `telephone`, `email`, `image`, `logo`, `priceRange`,
`foundingDate` (`2015`, matching the roster), `PostalAddress` (region + country), `areaServed` (12
`City` nodes), two `OpeningHoursSpecification` entries, and `founder` — a `Person` carrying
`@id` `about/#founder` and the **confirmed** name (business-facts §A). All 31 pages carry it.

**Absent, and staying absent until sourced.** The first three below were emitted until 2026-08-17 and
were removed as a deliberate anti-fabrication measure; `hasMap` never shipped. The export confirms all
four at **zero files**. Restoring any of them without the source named below is a stop-ship, not a
judgement call:

| Field             | Why it was removed                                                                               | Unblocked by      |
| ----------------- | ------------------------------------------------------------------------------------------------ | ----------------- |
| `aggregateRating` | Was 4.9/6, computed from six invented testimonials. See §4.1                                     | business-facts §B |
| `sameAs`          | Pointed at `facebook.com` and `instagram.com` — platform homepages, not profiles                 | business-facts §B |
| `geo`             | Was `32.0853, 34.7818` = Tel Aviv city centre, a placeholder for a business with **no premises** | business-facts §E |
| `hasMap`          | Never shipped — appropriate while there is no premises                                           | business-facts §E |

`lib/jsonld.ts:3-7` carries the same gate as a header comment. Do not "tidy it up".

**On the address:** carrying only `addressRegion` + `addressCountry` is **correct** here. This is a
service-area business (`site.address.note`: "שירות עד בית הלקוח"). Don't invent a street address to
"complete" the node — but do make sure the Google Business Profile is a service-area profile with the
address hidden, or the two will contradict each other.

---

## 4. Gating rules

These are correctness rules, not preferences. Getting them wrong is worse than emitting nothing.

1. **`Review` and `AggregateRating` ship only when the reviews are real and publicly verifiable.**
   This is a standing prohibition, and **the gate currently passes** — `aggregateRating`, `Review`,
   `sameAs` and `GeoCoordinates` each return **zero files** across the 31-page export. It did not
   always: until 2026-08-17 the business node carried a 4.9/6 `aggregateRating` computed from six
   invented testimonials in a `lib/reviews.ts` that no longer exists. An invented rating is a Google
   policy violation and a Rich Results failure. The only thing that unblocks the node is real, sourced
   reviews on a public profile (business-facts §B). **Do not seed sample data "to test the markup",
   and do not treat the historical breach as precedent.**
2. **Schema must match what the user sees.** A `FAQPage` question that isn't rendered is a violation.
   Any `Offer` price must equal the visible price text. Never mark up hidden content.
3. **`FAQPage` only where FAQs are visible, and always derived from the same array the page renders.**
   Twenty-one pages qualify: `/`, the 4 services, the 3 guides, the 12 locations and `/pricing/`. Each
   builds `mainEntity` from the same typed data the DOM renders — `generalFaqs`, `service.answer` +
   `service.faqs`, `articleFaqs(article)`, `location.faqs`, `pricing.answer` + `pricing.faqs` — so the
   schema cannot drift from the copy. The service, pricing and homepage FAQs use native
   `<details>/<summary>`, which keeps every answer in the DOM, merely collapsed; a client-state
   accordion that conditionally renders answers would break this rule. Keep the `<details>` pattern.
4. **Never emit an empty `FAQPage`.** `faqPageJsonLd` has no empty guard, so an empty array ships
   `{"@type":"FAQPage","mainEntity":[]}` — a page type the page is not, and a Rich Results failure.
   `/locations/{city}/` gates the call on `location.faqs.length > 0`; `/guides/{slug}/` does **not**,
   so a future article with neither an `answer` nor a `faq` block would ship one (SD-8, §7b). Not live
   today — all three guides carry both blocks.
5. **No dangling `@id`s.** `serviceJsonLd` wires `provider` to `${site.domain}/#business`, which the
   root layout always emits; `articleJsonLd` wires `publisher` to the same node; the `pageNode` helper
   wires `isPartOf` → `#website` and `about` → `#business`. Every reference in the graph resolves.
   Don't invent references.
6. **One node per concept per page.** Two `LocalBusiness` blocks on one page is worse than one — which
   is also why breadcrumbs are emitted only by `PageHero` (§2b) and why content pages get no second
   `#page` node (§2a).
7. **`geo` must be real or absent.** It is never approximated to the nearest city centre.

---

## 5. Location-page schema — shipped 2026-08-24

The silo exists: `/locations/` plus **twelve** city pages, one per service area — תל אביב, חולון and
בת ים since 2026-08-30, the other nine added 2026-10-28 with their sources in
`location-sources/{slug}.md`. Built by `locationServiceJsonLd` (`lib/jsonld.ts:83`).

Each location page emits, and every new one must:

- **`Service`** — `@id` `{url}#service`, `name: "איתור נזילות {prefixed}"`,
  `serviceType: "איתור נזילות"`, `description: location.answer.a`, `url`,
  `provider: { "@id": ".../#business" }`,
  `areaServed: { "@type": "City" | "AdministrativeArea", name }`. ✅ all twelve.
- **`BreadcrumbList`** — `בית › אזורי שירות › {city}`, emitted by `PageHero` (§2b). ✅ all twelve.
- **`FAQPage`** from `[location.answer, ...location.faqs]` (changed 2026-10-28). ✅ all twelve, **3
  questions each**. The empty-array gate moved INTO `faqPageJsonLd`, which returns `null` for an
  empty list while `<JsonLd>` renders nothing for `null` — so the guard is central and a
  `"mainEntity":[]` node is now a regression rather than a thing a caller has to remember to prevent.

Note the `name` takes `prefixed` **as-is** — `איתור נזילות בתל אביב` — because the location model
carries the preposition. No template should ever glue a bare `ב` onto `name`.

**The visible answer block on a location page IS folded into its `FAQPage`, as of 2026-10-28** —
the same pattern as `/services/{slug}/` and `/pricing/`. This REVERSES the instruction that stood
here before ("that asymmetry is deliberate … don't harmonise them"), so the reasoning is worth
keeping rather than deleting:

- **The old objection was real.** The location answer also serves as `Service.description`, so it is
  now asserted twice on one page — once as that description and once as `mainEntity[0]`'s answer
  text. **That duplication was weighed and accepted.** No Google policy forbids restating a page's
  own text across two nodes, and a `Service.description` and a `Question`/`Answer` pair are read for
  different purposes.
- **What it was costing.** Locations were the ONLY page type whose visible answer block never
  reached the FAQ graph (finding AEO-5), which made the silo the weakest of the three for answer
  engines while being the one most likely to be asked a direct local question.
- **The alternative considered and rejected:** giving `Service.description` the authored
  `metaDescription` instead, which would have removed the duplication outright. Rejected because
  `metaDescription` ends in a call to action with the phone number — correct for a SERP snippet,
  wrong inside a schema `description`.
- **`Location.answer` is now `{ q, a }`**, matching services and articles, and `q` is the string
  rendered as the visible H2 — which is what guarantees the `Question` is visible on the page, as
  Google requires. Do not reintroduce a template that builds the heading separately from the data.

Use `City` for real cities and `AdministrativeArea` for regions — the `kind` field on the location model
drives this (`/new-city`). Marking a region as a `City` is a factual error in the graph. All twelve
cities are `kind: "city"`, so `AdministrativeArea` is currently untested on this route.

**Do not** emit a `LocalBusiness` node per location. This business has **no physical premises at all**;
one node is the honest count, and a node per city implies premises that don't exist — a well-known
local-spam pattern.

Note the existing `serviceJsonLd` already uses `AdministrativeArea` with `site.address.region` for the
four service pages, which is correct.

---

## 6. Article schema — shipped 2026-08-24

`/guides/` plus **three** articles. Built by `articleJsonLd` (`lib/jsonld.ts:160`).

| Property           | Required | Emitted today                                                         |
| ------------------ | -------- | --------------------------------------------------------------------- |
| `@id`              | yes      | ✅ `{url}#article`                                                    |
| `headline`         | yes      | ✅                                                                    |
| `description`      | yes      | ✅                                                                    |
| `url`              | yes      | ✅                                                                    |
| `datePublished`    | yes      | ✅ ISO date from `lib/articles.ts`                                    |
| `dateModified`     | yes      | ✅ ISO date from `lib/articles.ts`                                    |
| `author`           | yes      | ✅ `Person` with the **confirmed** founder name — but no `@id` (SD-5) |
| `publisher`        | yes      | ✅ `@id` → `#business`                                                |
| `mainEntityOfPage` | yes      | ✅                                                                    |
| `inLanguage`       | yes      | ✅ (in-domain here — `Article` is a `CreativeWork`)                   |
| `image`            | yes      | ❌ **open — SD-6, §7b**                                               |

**On `author`.** The builder makes it optional and omits the property entirely when no name is on
file. That stays: an absent author costs an `Article` rich result, an invented one is a fabricated
E-E-A-T signal this project has already paid for once. Absent wins. The three shipped guides all carry
the real, confirmed byline (business-facts §A) — do not strip it as a suspected fabrication.

**On `image`.** This spec requires it and the builder omits it, which is the one place §2's table shows
a required property missing. The resolution is `image: "${site.domain}/og.png"` — the site's own
existing 1200×630 asset, so nothing is fabricated — paired with the same `/og.png` being restored to
each guide's `openGraph.images`, which the page-level `generateMetadata` currently drops. Until real
job photography exists, `/og.png` is the honest source; do **not** reference a photo the site does not
own. This needs a code change (§7b).

Deriving `FAQPage` from the typed blocks via `articleFaqs()` rather than authoring it separately is what
keeps rule §4.2 from breaking as copy is edited — the same property the `<details>`-based service FAQs
already have. Note the missing empty-array guard on this route (§4.4).

---

## 7. What is still missing

### 7a. Node types blocked on a business fact

| Node                           | Where                        | Blocked on                                                   |
| ------------------------------ | ---------------------------- | ------------------------------------------------------------ |
| `Offer` / `PriceSpecification` | `Service` nodes, `/pricing/` | business-facts §C — the ₪350 base is **unconfirmed**         |
| `Review` / `AggregateRating`   | the business node            | business-facts §B — no sourced public reviews exist (§4.1)   |
| `sameAs`                       | the business node            | business-facts §B — no confirmed Google Business Profile URL |
| `geo`                          | the business node            | business-facts §E — no real operating base to state          |

**On the `Offer`.** The ₪350 figure is already visible in the copy (`lib/pricing.ts`,
`lib/services.ts`), carried under a `🔶 confirm` marker. Restating an unconfirmed number in
machine-readable form makes it harder to retract and is exactly what §4.2 warns about, so the node
stays out. **Do not write this node "and confirm the price later"** — the sequence is: owner confirms
in business-facts §C, then the `Offer` ships. `priceRange: "₪₪"` on the business node is the honest
placeholder in the meantime.

### 7b. Open defects in the emitted graph — all need a CODE change

None of these fabricate anything; all four are mechanical.

| #    | Defect                                                                                                                                                                                                                                                                                          | Fix location                                                                              |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| SD-6 | `Article.image` absent, though §6 requires it — and the same `generateMetadata` blocks drop `og:image` from the 10 dynamic routes                                                                                                                                                               | `lib/jsonld.ts` (Article builder) + the three `[slug]`/`[city]` `generateMetadata` blocks |
| SD-5 | `Article.author` has no `@id`, so the founder is two unlinked `Person` nodes                                                                                                                                                                                                                    | `lib/jsonld.ts` (Article builder)                                                         |
| SD-9 | `Service.inLanguage` is outside schema.org's declared domain for `Service` — the schema.org Validator flags it on all 7 `Service` nodes (4 services + 3 locations). Google ignores it silently. Removal is the clean fix; `inLanguage` on the `CreativeWork`-derived nodes is correct and stays | `lib/jsonld.ts` (both `Service` builders)                                                 |
| SD-8 | `/guides/{slug}/` emits `FAQPage` ungated, unlike `/locations/{city}/` (§4.4)                                                                                                                                                                                                                   | `app/guides/[slug]/page.tsx`, or guard centrally in `faqPageJsonLd`                       |

Plus the standing low-value gap from §1: `BreadcrumbList` carries no `{pageUrl}#breadcrumb` `@id`.

---

## 8. Verification

```bash
# every page carries JSON-LD
grep -rL 'application/ld+json' out --include=index.html          # expect none

# the global pair, on every emitted page
find out -name index.html | wc -l                                # expect 31
grep -rl 'LocalBusiness' out --include=index.html | wc -l        # expect 31
grep -rl '"@type":"WebSite"' out --include=index.html | wc -l    # expect 31

# breadcrumbs everywhere they should be — all but /, /thank-you/ and the two 404 artifacts
grep -rl 'BreadcrumbList' out --include=index.html | wc -l       # expect 27

# FAQPage — /, 4 services, 3 guides, 12 locations, /pricing/
grep -rl 'FAQPage' out --include=index.html | wc -l              # expect 21

# the fabrication gate — currently PASSING, all four at zero
grep -rl 'aggregateRating' out --include=index.html | wc -l                  # expect 0
grep -rl '"@type":"Review"' out --include=index.html | wc -l                 # expect 0
grep -rl 'sameAs' out --include=index.html | wc -l                           # expect 0
grep -rl 'GeoCoordinates' out --include=index.html | wc -l                   # expect 0
```

Every count above is re-stated for the 2026-10-28 build (first measured on 2026-09-06). When a route is
added, the counts move — update them here in the same commit rather than letting an operator learn to
wave a mismatch through.

Then run Google's **Rich Results Test** on one page per route family: the homepage, one service page
(`/services/water-leak-detection/`), one guide (`/guides/leak-detection-cost/`) and one location
(`/locations/tel-aviv/`). Zero errors is the bar; warnings get triaged against this file. The
schema.org Validator is the stricter second pass and is the one that surfaces SD-9.
