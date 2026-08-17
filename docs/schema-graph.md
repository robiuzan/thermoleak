# Schema graph — target JSON-LD

What every route should emit. `schema-auditor` validates against this file;
`schema-structured-data` implements it. Builders live in **`lib/jsonld.ts`** (hand-written in this repo,
no external SEO kit): `localBusinessJsonLd` · `webSiteJsonLd` · `serviceJsonLd` · `faqPageJsonLd` ·
`breadcrumbJsonLd`, rendered through `components/JsonLd.tsx`.

---

## 1. `@id` scheme

Stable `@id`s let nodes reference each other instead of repeating themselves.

| Node                | `@id`                                        | Status                       |
| ------------------- | -------------------------------------------- | ---------------------------- |
| The business        | `https://thermoleak.co.il/#business`         | ✅ emitted                   |
| The website         | `https://thermoleak.co.il/#website`          | ✅ emitted                   |
| A service           | `https://thermoleak.co.il/services/{slug}/#service` | ❌ `Service` has no `@id` |
| A person            | `https://thermoleak.co.il/about/#person-{n}` | ❌ no person exists          |
| A page's breadcrumb | `{pageUrl}#breadcrumb`                       | ❌ breadcrumbs have no `@id` |

All URLs are built through `canonicalUrl()` in `lib/site.ts`, which applies `withTrailingSlash()` — so
`@id`, `url`, the page canonical and the sitemap `<loc>` are the same string. Keep using it rather than
concatenating URLs by hand.

---

## 2. Node per route type

| Route                         | Required                                                    | Currently                        |
| ----------------------------- | ----------------------------------------------------------- | -------------------------------- |
| every page (root layout)      | `LocalBusiness` + `WebSite`                                 | ✅ both                          |
| `/`                           | + `FAQPage` from `generalFaqs`                              | ✅                               |
| `/services/{slug}/` ×4        | `Service` + `FAQPage` + `BreadcrumbList`                    | ✅ all three                     |
| `/services/`                  | `BreadcrumbList` + `CollectionPage`                         | breadcrumb ✅, collection ❌     |
| `/about/`                     | `BreadcrumbList` + `AboutPage` + `Person[]`                 | breadcrumb ✅, rest ❌           |
| `/contact/`                   | `BreadcrumbList` + `ContactPage`                            | breadcrumb ✅, contact ❌        |
| `/reviews/`                   | `BreadcrumbList` + `Review[]` **only when real**            | breadcrumb ✅, reviews ⚠️ §4.1   |
| `/accessibility/` `/privacy/` | `BreadcrumbList`                                            | ❌ **missing — see §2a**         |
| `/locations/{city}/`          | `Service` + `areaServed` + `BreadcrumbList`                 | route doesn't exist              |
| `/guides/{slug}/`             | `Article` + `BreadcrumbList` + `FAQPage`                    | route doesn't exist              |
| `/404/`                       | none                                                        | —                                |

### 2a. The breadcrumb drift

`components/PageHero.tsx` renders a visible breadcrumb trail on **7** routes. `breadcrumbJsonLd` is
called on only **5** — `about`, `contact`, `reviews`, `services`, `services/[slug]`. So
`/accessibility/` and `/privacy/` show a trail to a human and emit nothing for a crawler.

Worse, on the five routes that do both, the same trail is typed **twice** — once as `crumbs` for
`PageHero` (`{ name, href }`) and once as an array for `breadcrumbJsonLd` (`{ name, url }`). Two shapes,
one truth, guaranteed to drift.

**The fix:** emit from `PageHero` itself, from the array it already receives. Then every page using the
component gets the markup for free and the two can't disagree. Target: **7 pages** carrying
`BreadcrumbList` — everything except `/` and the two 404 artifacts.

---

## 3. The business node

Built by `localBusinessJsonLd()` in `lib/jsonld.ts`, reading entirely from `lib/site.ts`. Never
hand-assemble it and never hardcode a value `site` already carries.

**Present and correct today:** `@type: ["LocalBusiness", "HomeAndConstructionBusiness"]`, `@id`, `name`,
`alternateName`, `description`, `url`, `telephone`, `email`, `image`, `logo`, `priceRange`,
`foundingDate` (`2015`, matching the roster), `PostalAddress` (region + country), `areaServed` (12
`City` nodes), two `OpeningHoursSpecification` entries.

**Wrong or blocked:**

| Field             | Problem                                                                                                  | Blocked on         |
| ----------------- | -------------------------------------------------------------------------------------------------------- | ------------------ |
| `aggregateRating` | **Fabricated** — 4.9/6 computed from six invented testimonials. See §4.1                                | business-facts §B  |
| `sameAs`          | Points at `https://www.facebook.com/` and `https://www.instagram.com/` — platform homepages, not profiles | business-facts §B  |
| `geo`             | `32.0853, 34.7818` = Tel Aviv city centre, a placeholder for a business with **no premises**             | business-facts §E  |
| `founder`         | Absent — no person is named anywhere on the site                                                         | business-facts §A  |
| `hasMap`          | Absent — appropriate while there is no premises                                                          | business-facts §E  |

**On the address:** carrying only `addressRegion` + `addressCountry` is **correct** here. This is a
service-area business (`site.address.note`: "שירות עד בית הלקוח"). Don't invent a street address to
"complete" the node — but do make sure the Google Business Profile is a service-area profile with the
address hidden, or the two will contradict each other.

---

## 4. Gating rules

These are correctness rules, not preferences. Getting them wrong is worse than emitting nothing.

1. **`Review` and `AggregateRating` ship only when the reviews are real and publicly verifiable.**
   **This site currently violates that rule on every page.** `lib/reviews.ts` holds six invented
   testimonials — its own header says so — and `averageRating` / `reviewCount` derived from them are
   emitted as `aggregateRating` inside the business node, which ships from the root layout. An invented
   rating is a Google policy violation and a Rich Results failure. Two acceptable resolutions and no
   third: replace the reviews with real, sourced ones, or remove the rating and the testimonials until
   you can. **Do not seed sample data "to test the markup".**
2. **Schema must match what the user sees.** A `FAQPage` question that isn't rendered is a violation.
   Any `Offer` price must equal the visible price text. Never mark up hidden content.
3. **`FAQPage` only where FAQs are visible.** The homepage and all four service pages qualify because
   the FAQs use native `<details>/<summary>` — the answers ship in the DOM, merely collapsed. A
   client-state accordion that conditionally renders answers would break this. Keep the `<details>`
   pattern.
4. **No dangling `@id`s.** `serviceJsonLd` wires `provider` to `${site.domain}/#business`, which the
   root layout always emits. Don't invent references.
5. **One node per concept per page.** Two `LocalBusiness` blocks on one page is worse than one.
6. **`geo` must be real or absent.** It is never approximated to the nearest city centre.

---

## 5. Location-page schema (when the silo is built)

Each location page should emit:

- **`Service`** — `name: "איתור נזילות ב{prefixed}"`, `serviceType: "איתור נזילות"`,
  `provider: { "@id": ".../#business" }`,
  `areaServed: { "@type": "City" | "AdministrativeArea", name }`.
- **`BreadcrumbList`** — `בית › אזורי שירות › {city}`.
- **`FAQPage`** once city-specific FAQs exist (content-standards §3).

Use `City` for real cities and `AdministrativeArea` for regions — the `kind` field on the location model
drives this (`/new-city`). Marking a region as a `City` is a factual error in the graph.

**Do not** emit a `LocalBusiness` node per location. This business has **no physical premises at all**;
one node is the honest count, and a node per city implies premises that don't exist — a well-known
local-spam pattern.

Note the existing `serviceJsonLd` already uses `AdministrativeArea` with `site.address.region` for the
four service pages, which is correct.

---

## 6. Article schema (when `/guides/` exists)

`Article` with `headline`, `description`, `image`, `datePublished`, `dateModified`,
`author` (a `Person` with a **real** name — business-facts §A), `publisher` (`@id` → `#business`),
`mainEntityOfPage`. Plus `BreadcrumbList`, plus `FAQPage` derived from the article's `faq` blocks.

Deriving `FAQPage` from the typed blocks rather than authoring it separately is what keeps rule §4.2
from breaking as copy is edited — the same property the `<details>`-based service FAQs already have.

---

## 7. Missing node types worth adding

| Node                          | Where                      | Blocked on                          |
| ----------------------------- | -------------------------- | ----------------------------------- |
| `Offer` / `PriceSpecification` | `Service` nodes            | business-facts §C (is ₪450 current?) |
| `AboutPage` + `Person`         | `/about/`                  | business-facts §A (nobody is named)  |
| `ContactPage`                  | `/contact/`                | nothing — ship it                    |
| `CollectionPage`               | `/services/`               | nothing — ship it                    |
| `@id` on `Service` nodes       | `lib/jsonld.ts`            | nothing — ship it                    |

---

## 8. Verification

```bash
# every page carries JSON-LD
grep -rL 'application/ld+json' out --include=index.html          # expect none

# breadcrumbs everywhere they should be
grep -rl 'BreadcrumbList' out --include=index.html | wc -l       # target 7

# nothing fabricated
grep -rl 'aggregateRating\|"@type": *"Review"' out --include=index.html | wc -l   # target 0
```

Then run Google's **Rich Results Test** on the homepage, one service page, and `/reviews/`. Zero errors
is the bar; warnings get triaged against this file.
