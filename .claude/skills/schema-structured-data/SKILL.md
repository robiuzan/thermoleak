---
name: schema-structured-data
description: Emit the JSON-LD graph with the lib/jsonld.ts builders — LocalBusiness + WebSite globally, Service per service and per location page, Article per guide, page nodes on the hubs, BreadcrumbList emitted by PageHero itself, FAQPage matched to visible FAQs, and the standing fabrication gate that keeps aggregateRating, Review, sameAs and geo at zero. Use when wiring or auditing structured data, or before a Rich Results Test. Triggers "add schema", "JSON-LD", "BreadcrumbList", "structured data", "rich results", "aggregateRating".
---

# Structured data

Target graph: `docs/schema-graph.md`. This skill is how to emit it.

## The builders

```ts
import {
  localBusinessJsonLd, // root layout — the business node
  webSiteJsonLd, // root layout — the site node
  serviceJsonLd, // /services/{slug}/
  locationServiceJsonLd, // /locations/{city}/ — a Service, never a LocalBusiness
  articleJsonLd, // /guides/{slug}/
  aboutPageJsonLd, // /about/
  contactPageJsonLd, // /contact/
  collectionPageJsonLd, // the three hubs
  faqPageJsonLd, // anywhere FAQs are visible
  breadcrumbJsonLd, // PageHero ONLY — never call this from a page
} from "@/lib/jsonld";
import JsonLd from "@/components/JsonLd";
```

They are hand-written in this repo (no site-kit dependency), they all read from `lib/site.ts`, and they
all build URLs through `canonicalUrl()` so `@id`, `url`, the canonical and the sitemap `<loc>` agree.
Never hand-assemble a node a builder covers, and never hardcode a value `lib/site.ts` already carries.

`<JsonLd data={…} />` renders the `<script type="application/ld+json">` block.

## The standing gate — it currently PASSES, keep it that way

Three fabrications were **removed 2026-08-17** and the export has been clean of them ever since:

| What was there                                   | Where it came from                           | Status                                  |
| ------------------------------------------------ | -------------------------------------------- | --------------------------------------- |
| `aggregateRating` 4.9 / 6 reviews                | `lib/reviews.ts` — six invented testimonials | removed; `lib/reviews.ts` deleted       |
| `sameAs` → facebook.com, instagram.com homepages | `site.social`                                | removed; the field is gone              |
| `geo` → 32.0853, 34.7818 (Tel Aviv city centre)  | `site.geo`                                   | removed; `lib/site.ts` has no `geo` key |

`/reviews/` is gone with them and 301s to `/about/` via `public/_redirects`.

**This is a gate, not a defect to find.** Run it, expect zero, and move on:

```bash
grep -rl 'aggregateRating\|"@type":"Review"\|sameAs\|GeoCoordinates' out --include=index.html   # expect: nothing
```

Anything that makes it return a file is **Critical and a stop-ship** — a Google policy violation, not
a style issue — including "sample data to test the markup". The only legitimate way back in:

1. **Rating / reviews** — real, publicly verifiable reviews behind them (a Google Business Profile is
   the natural source). Blocked on `docs/business-facts.md` §B.
2. **`sameAs`** — real profile URLs, not platform homepages. A `sameAs` resolving to facebook.com
   asserts an entity link that doesn't exist and is weaker than nothing. Blocked on business-facts §B.
3. **`geo`** — the real operating base, never a city-centre placeholder. For a service-area business
   with no premises, absent is the honest value. Blocked on business-facts §E.

The builders enforce this at the source: read the header comment at the top of `lib/jsonld.ts` before
adding any field to `localBusinessJsonLd()`.

## Per route type

Every row below is what the export actually carries — verified against `out/**/index.html`, not
aspirational. The two globals are on top of everything else on every row.

| Route                         | Emits, on top of the two globals                                      | Today         |
| ----------------------------- | --------------------------------------------------------------------- | ------------- |
| every page (root layout)      | `LocalBusiness`/`HomeAndConstructionBusiness` + `WebSite`             | ✅            |
| `/`                           | `FAQPage` from `generalFaqs` (no breadcrumb — it _is_ home)           | ✅            |
| `/services/`                  | `CollectionPage` + `BreadcrumbList`                                   | ✅            |
| `/services/{slug}/` ×4        | `Service` + `FAQPage` + `BreadcrumbList`                              | ✅            |
| `/guides/`                    | `CollectionPage` + `BreadcrumbList`                                   | ✅            |
| `/guides/{slug}/` ×3          | `Article` + `FAQPage` + `BreadcrumbList`                              | ✅            |
| `/locations/`                 | `CollectionPage` + `BreadcrumbList`                                   | ✅            |
| `/locations/{city}/` ×3       | `Service` + `FAQPage` + `BreadcrumbList`                              | ✅            |
| `/pricing/`                   | `FAQPage` + `BreadcrumbList`                                          | ✅            |
| `/about/`                     | `AboutPage` + `BreadcrumbList` (the `Person` is on the business node) | ✅            |
| `/contact/`                   | `ContactPage` + `BreadcrumbList`                                      | ✅            |
| `/accessibility/` `/privacy/` | `BreadcrumbList`                                                      | ✅            |
| `/thank-you/`                 | globals only — noindex, no crumbs, absent from the sitemap            | ✅ deliberate |
| `/404/` `/_not-found/`        | globals only                                                          | —             |

**The page-node convention, so you can tell a gap from a decision:** a route that already carries a
_content_ node (`Service`, `Article`) or is the site root gets no separate `#page` node. Hub and
utility pages that have no content node get one — `CollectionPage` on the three hubs, `AboutPage`,
`ContactPage`. `/pricing/`, `/accessibility/` and `/privacy/` carry none by the same rule; that is a
decision, not an omission. `/reviews/` is not in this table because the route was deleted — it 301s
to `/about/`.

## Breadcrumbs — `PageHero` emits them, a page never does

The old double-typing bug (the same crumbs written once as `crumbs` for `PageHero` and again as an
array for `breadcrumbJsonLd`, with different key names) is **closed**. `components/PageHero.tsx` now
renders the visible trail and emits `BreadcrumbList` from the same array, so the two cannot disagree:

```tsx
// components/PageHero.tsx — one array, both consumers
{
  crumbs && crumbs.length > 0 ? (
    <JsonLd
      data={breadcrumbJsonLd(
        crumbs.map((crumb) => ({ name: crumb.name, url: crumb.href })),
      )}
    />
  ) : null;
}
```

Two rules follow, and they are the whole of the breadcrumb work now:

1. **No page may call `breadcrumbJsonLd`.** `PageHero` already did; a second call double-emits. The
   only importer outside `lib/jsonld.ts` is `PageHero` itself — keep it that way.
2. **A page with a visible trail uses `PageHero`.** Hand-rolled crumbs get a trail with no schema.

**18 of the 22 emitted `index.html` files carry `BreadcrumbList`.** The four without it are `/` (the
root has no trail), `/thank-you/` and the two 404 artifacts. That is the expected number, not a gap.

## Service nodes

```ts
serviceJsonLd(service);
// name: service.title, serviceType: service.h1, provider: { "@id": "…/#business" },
// areaServed: { "@type": "AdministrativeArea", name: "גוש דן והמרכז" }
```

`AdministrativeArea` is correct for a region. The location silo has landed, and
`locationServiceJsonLd` derives the type from `location.kind` — `City` for a genuine city,
`AdministrativeArea` for a region. All three shipped locations are `kind: "city"`, so all three emit
`City`; typing a region as a `City` is a factual error in the graph, which is the entire reason the
field exists (`/new-city`).

**Never emit a `LocalBusiness` node per city.** This business has no premises at all; one node is the
honest count, and a node per city is a recognised local-spam pattern.

## The gating rules — correctness, not preference

1. **`Review` / `AggregateRating` ship only with a verifiable public source.** Currently satisfied —
   the gate above returns zero files. Keep it that way; see the three re-entry routes above.
2. **Schema must match visible content.** A `FAQPage` question not rendered on the page is a violation.
   Any `Offer` price must equal the visible price text. Never mark up hidden content.
3. **`FAQPage` only where FAQs are visible.** Twelve pages qualify today — `/`, the four service
   pages, the three guides, the three location pages and `/pricing/` — because every one renders its
   questions in native `<details>/<summary>`, so all answers ship in the DOM. Keep that property in any
   new accordion; a client-state accordion that conditionally renders answers breaks this rule.
   The safest constructions are the derived ones: guides build their FAQ entities from the article's
   own `answer` and `faq` blocks via `articleFaqs()` (`lib/articles.ts`), and `/pricing/` from
   `[pricing.answer, ...pricing.faqs]` — so schema and page read from one array and cannot drift.
4. **No dangling `@id`s.** `serviceJsonLd`, `locationServiceJsonLd` and `articleJsonLd` all wire back
   to `${site.domain}/#business`, and the page nodes to `${site.domain}/#website` — both of which the
   root layout always emits. Don't invent refs.
5. **`geo` must be real or absent — it is absent, by design.** `lib/site.ts` has no `geo` key at all;
   the Tel Aviv city-centre placeholder went out on 2026-08-17. For a service-area business with no
   premises, absent is the honest value. A real operating base is blocked on business-facts §E.

## Still missing, and what it is blocked on

`AboutPage`, `ContactPage`, `CollectionPage`, `Article` and the `Person` on the business node all
**ship now** — the founder is confirmed (business-facts §A) and the three guides carry a real byline.

**`Offer` / `PriceSpecification` is the only node type still absent.** It is blocked on the ₪450 entry
price and the four per-service `priceModel` strings being confirmed (business-facts §C), and
`lib/jsonld.ts` says so in the comment above the page-node builders. Add the row; never fill the value.

## Open defects in the shipped graph

Real, and none of them a fabrication. Describe them as open; cite the id.

| id   | What                                                                                                                                                                                                                                                               | Where                                    |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| SD-6 | `Article` carries no `image`, which the target graph asks for. The guide pages render no image, and rule 2 above forbids marking up what the reader cannot see — so the fix is a real representative image (`/og.png` is the site's own asset), not an unseen URL. | `articleJsonLd`                          |
| SD-9 | `inLanguage` on a plain `Service` is outside schema.org's declared domain for that type — 7 nodes (4 services + 3 locations). Silent in Google's Rich Results Test, a warning in the schema.org validator.                                                         | `serviceJsonLd`, `locationServiceJsonLd` |
| SD-8 | `/guides/{slug}/` emits `FAQPage` ungated while `/locations/{city}/` gates on `faqs.length > 0`. Latent, not live: an article with no `answer` and no `faq` block would ship an empty `FAQPage`.                                                                   | `app/guides/[slug]/page.tsx`             |
| SD-5 | The article `author` is an anonymous `Person`; the business `founder` is the same real human at `about/#founder`. 22 Person nodes carry that `@id`, the 3 article authors do not — so a consumer can only merge them by string-matching a name.                    | `articleJsonLd`                          |

## Checklist

- [ ] The fabrication gate returns zero files.
- [ ] `sameAs` is absent, or points at real profiles.
- [ ] No page calls `breadcrumbJsonLd` — only `PageHero` does.
- [ ] Every `FAQPage` question is visible on the page, and derived from the same array the page renders.
- [ ] `Service` nodes carry `provider`, and an `areaServed` type that matches reality
      (`AdministrativeArea` for a region, `City` for a city, from `location.kind`).
- [ ] `Article` nodes carry `publisher` and `mainEntityOfPage`, and either a real byline or none.
- [ ] `@id` and `url` values come from `canonicalUrl()` and match the canonical.

## Verify

```bash
grep -rL 'application/ld+json' out --include=index.html          # pages with no schema — expect none
find out -name index.html | wc -l                                # 22 emitted pages
grep -rl 'BreadcrumbList' out --include=index.html | wc -l       # expect 18 of the 22
grep -rl 'aggregateRating\|"@type":"Review"\|sameAs\|GeoCoordinates' out --include=index.html | wc -l  # expect 0
```

Then run Google's Rich Results Test on one URL per route family — the homepage,
`/services/water-leak-detection/`, `/guides/leak-detection-cost/`, `/locations/tel-aviv/` and
`/pricing/`. Zero errors is the bar. **Not `/reviews/`** — that route was deleted and 301s to
`/about/`.
