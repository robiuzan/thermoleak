---
name: schema-structured-data
description: Emit the JSON-LD graph with the lib/jsonld.ts builders — LocalBusiness + WebSite globally, Service per service page, BreadcrumbList wherever PageHero renders a trail, FAQPage matched to visible FAQs, Offer for the pricing claims, and the fabricated AggregateRating that must come out before launch. Use when wiring or auditing structured data, or before a Rich Results Test. Triggers "add schema", "JSON-LD", "BreadcrumbList", "structured data", "rich results", "aggregateRating".
---

# Structured data

Target graph: `docs/schema-graph.md`. This skill is how to emit it.

## The builders

```ts
import {
  localBusinessJsonLd,
  webSiteJsonLd,
  serviceJsonLd,
  faqPageJsonLd,
  breadcrumbJsonLd,
} from "@/lib/jsonld";
import JsonLd from "@/components/JsonLd";
```

They are hand-written in this repo (no site-kit dependency), they all read from `lib/site.ts`, and they
all build URLs through `canonicalUrl()` so `@id`, `url`, the canonical and the sitemap `<loc>` agree.
Never hand-assemble a node a builder covers, and never hardcode a value `lib/site.ts` already carries.

`<JsonLd data={…} />` renders the `<script type="application/ld+json">` block.

## Stop-ship first: the fabricated `AggregateRating`

`localBusinessJsonLd()` emits:

```ts
aggregateRating: {
  "@type": "AggregateRating",
  ratingValue: String(averageRating),   // 4.9
  reviewCount: String(reviewCount),     // 6
  bestRating: "5",
}
```

`averageRating` and `reviewCount` are computed in `lib/reviews.ts` from **six invented testimonials**,
in a file whose own header says: _"PLACEHOLDER — replace with real, verifiable reviews… Do not publish
an aggregate rating that isn't backed by genuine reviews."_ Because the business node ships from the
root layout, **the fabricated rating is on all 13 pages.**

This is a Google policy violation and a Rich Results failure, not a style issue. Two acceptable
resolutions, and no third:

1. Replace `lib/reviews.ts` with real, publicly verifiable reviews (a Google Business Profile is the
   natural source) — then the rating is legitimate; or
2. Remove `aggregateRating` from the builder and the testimonials from the site until (1) happens.

Blocked on `docs/business-facts.md` §B. Do not "seed" sample data to test the markup.

## The second fabrication: `sameAs`

```ts
sameAs: [site.social.facebook, site.social.instagram];
// → ["https://www.facebook.com/", "https://www.instagram.com/"]
```

Those are the platforms' homepages, not profiles. A `sameAs` that resolves to facebook.com asserts an
entity link that doesn't exist and is weaker than an empty array. The footer renders the same two URLs
as social icons. Either supply real profile URLs (business-facts §B) or drop both from `site.social` —
the builders and the footer both read from there, so one edit fixes both surfaces.

## Per route type

| Route                       | Emit                                                                 | Today                  |
| --------------------------- | -------------------------------------------------------------------- | ---------------------- |
| every page (root layout)    | `LocalBusiness`/`HomeAndConstructionBusiness` + `WebSite`            | ✅                     |
| `/`                         | + `FAQPage` from `generalFaqs`                                       | ✅                     |
| `/services/{slug}/` ×4      | `Service` + `FAQPage` + `BreadcrumbList`                             | ✅                     |
| `/services/`                | `BreadcrumbList` (+ `CollectionPage`)                                | breadcrumb ✅          |
| `/about/`                   | `BreadcrumbList` (+ `AboutPage`, `Person[]`)                         | breadcrumb ✅          |
| `/contact/`                 | `BreadcrumbList` (+ `ContactPage`)                                   | breadcrumb ✅          |
| `/reviews/`                 | `BreadcrumbList` (+ `Review[]` **only when real**)                   | breadcrumb ✅          |
| `/accessibility/` `/privacy/` | `BreadcrumbList`                                                   | ❌ **missing**         |
| `/404/`                     | none                                                                 | —                      |

## The breadcrumb drift — the biggest wiring gap

`components/PageHero.tsx` renders a visible breadcrumb trail on **7** pages. `breadcrumbJsonLd` is
called on only **5** — `about`, `contact`, `reviews`, `services`, `services/[slug]`. So
`/accessibility/` and `/privacy/` show a trail to a human and nothing to a crawler (§4.3).

Worse, the two are declared separately on every page that does have both — the same crumbs typed twice,
once as `crumbs` for `PageHero` and once as an array for `breadcrumbJsonLd`, with different key names
(`href` vs `url`). That is drift waiting to happen. The fix is to emit from `PageHero` itself:

```tsx
// components/PageHero.tsx — one array, both consumers
<JsonLd data={breadcrumbJsonLd(crumbs.map(({ name, href }) => ({ name, url: href })))} />
```

Then every page using `PageHero` gets the markup automatically, and the trail and the graph cannot
disagree. Target: **7 pages** carrying `BreadcrumbList` — everything except `/` and the 404s.

## Service nodes

```ts
serviceJsonLd(service);
// name: service.title, serviceType: service.h1, provider: { "@id": "…/#business" },
// areaServed: { "@type": "AdministrativeArea", name: "גוש דן והמרכז" }
```

`AdministrativeArea` is correct for a region. Use `City` only for a genuine city — relevant when the
location silo lands (`/new-city`). **Never emit a `LocalBusiness` node per city.** This business has no
premises at all; one node is the honest count, and a node per city is a recognised local-spam pattern.

## The gating rules — correctness, not preference

1. **`Review` / `AggregateRating` ship only with a verifiable public source.** Currently violated. See
   above.
2. **Schema must match visible content.** A `FAQPage` question not rendered on the page is a violation.
   Any `Offer` price must equal the visible price text. Never mark up hidden content.
3. **`FAQPage` only where FAQs are visible.** The homepage and all four service pages qualify because
   the FAQs use native `<details>/<summary>` — every answer ships in the DOM. Keep that property in any
   new accordion; a client-state accordion that conditionally renders answers breaks this rule.
4. **No dangling `@id`s.** `serviceJsonLd` wires `provider` to `${site.domain}/#business`, which the
   root layout always emits. Don't invent refs.
5. **`geo` must be real or absent.** `site.geo` is `32.0853, 34.7818` — Tel Aviv city centre, a
   placeholder for a business with no premises. For a service-area business, drop it or set the real
   operating base. Blocked on business-facts §E.

## Missing nodes and what each is blocked on

`Offer` / `PriceSpecification` (the ₪450 entry price and the four `priceModel` strings — blocked on
business-facts §C), `AboutPage` + `Person` (no one is named — §A), `ContactPage`, `CollectionPage`,
`Article` (no editorial route — see `/new-article`). Add the row; don't fill the value.

## Checklist

- [ ] No `aggregateRating` or `Review` without a verifiable public source URL.
- [ ] `sameAs` points at real profiles, or is empty.
- [ ] Every page that renders a breadcrumb trail also emits `BreadcrumbList`, from the same array.
- [ ] Every `FAQPage` question is visible on the page.
- [ ] `Service` nodes carry `provider` and the right `areaServed` type.
- [ ] `@id` and `url` values come from `canonicalUrl()` and match the canonical.

## Verify

```bash
grep -rL 'application/ld+json' out --include=index.html          # pages with no schema
grep -rl 'BreadcrumbList' out --include=index.html | wc -l       # target 7
grep -rl 'aggregateRating' out --include=index.html | wc -l      # target 0 until sourced
```

Then run Google's Rich Results Test on the homepage, one service page, and `/reviews/`. Zero errors is
the bar.
