---
name: seo-metadata
description: Per-route metadata for thermoleak — the Hebrew title and description formulas, the layout template rule and the two brand-token traps it sets (both fixed 2026-08-17, both easy to reintroduce), self-referencing trailing-slash canonicals, the openGraph shallow-merge trap that costs ten routes their og:image, Search Console verification, and the hand-maintained staticRoutes array in sitemap.ts. Use when writing metadata for a route, fixing duplicate or malformed titles, or auditing on-page SEO. Triggers "set the metadata", "titles and descriptions", "canonical", "brand suffix", "sitemap", "one H1".
---

# Per-route SEO metadata

Formulas live in `docs/keyword-map.md` §3–§5. This skill is the mechanics.

## The template rule — and the two traps it sets

Both traps below **shipped as live bugs and were fixed 2026-08-17** (backlog §2.1). They are documented
here as regression traps, not as open defects: `app/page.tsx` now carries a complete title and
`app/about/page.tsx` a bare `"אודות"`, each with a comment recording why. Verify before reporting one.

`app/layout.tsx` sets:

```ts
title: {
  default: `${site.nameHe} | איתור נזילות תרמי בגוש דן והמרכז`,
  template: `%s | ${site.nameHe}`,
}
```

The template **already appends the brand**, so a page writes the bare subject. The two ways that goes
wrong, in opposite directions:

```ts
// ✅ correct — renders "איתור נזילות מים במצלמה תרמית | טרמוליק"
export const metadata = { title: service.h1 };

// ❌ trap 1 — /about/ shipped this until 2026-08-17: the title already contains the brand,
//    then the template appends it again
title: "אודות טרמוליק — מומחים לאיתור נזילות תרמי";
// would render "אודות טרמוליק — מומחים לאיתור נזילות תרמי | טרמוליק"

// ❌ trap 2 — the homepage shipped this until 2026-08-17: renders with NO brand at all,
//    because the root template does not apply to the root layout's own page
title: "איתור נזילות תרמי, רטיבות ובדיקות תרמוגרפיה";
```

**Why the homepage loses the brand:** a `template` declared in a layout applies to titles from **child
segments**, not to that same segment's own `page.tsx`. `app/page.tsx` is the root layout's own page, so
its title is used verbatim. This is not a bug in Next — it is the documented behaviour, and the reason
`app/page.tsx` writes a complete title including the brand (`title.absolute` would work too).

Every route currently renders the brand exactly once. Copy any of them — and when you add a route,
check the **rendered** `<title>` in `out/`, not the source string.

## Titles

| Route          | What you write                                                               |
| -------------- | ---------------------------------------------------------------------------- |
| Home           | a complete title including the brand — the template will not add it          |
| Service        | `service.h1` — e.g. `איתור נזילות מים במצלמה תרמית`                          |
| Services index | `שירותים — איתור נזילות, רטיבות ותרמוגרפיה`                                  |
| Static         | the page name — `צור קשר`, `אודות`, `הצהרת נגישות`                           |
| Location       | `איתור נזילות ב{prefixed}` — shipped on the three gated cities (`/new-city`) |
| Article        | the question verbatim — `article.title` (`/new-article`)                     |

Keep the **rendered** title under ~60 characters. Hebrew is compact, and no route is close to the limit
today — a title that gets there is usually trap 1 coming back.

## Descriptions

150–160 chars, unique per route, following keyword-map §5: what it is + where, one **true**
differentiator, then an action with the phone. All 19 indexable routes are currently unique — verify
that still holds after any change.

Two live gaps against that spec, both **code** defects, both open:

- The four service descriptions come straight from `service.summary`, a field `lib/services.ts` comments
  as the **card blurb** — so they run well short of 150 chars and carry no phone CTA (SEO-03). Most
  other routes are short too, so this is a site-wide convention rather than a regression; fixing it
  properly means a separate `metaDescription` field, the way `lib/articles.ts` already splits it.
- The three location descriptions are a raw `location.answer.slice(0, 155)`, which cuts mid-word on all
  three pages and disagrees with the untruncated `og:description` beside it (SEO-02). The keyword-map
  §5 Location formula is not implemented at all.

Only claim what `docs/business-facts.md` confirms. Still 🔶 and unusable in a description: the ₪450
price, the certifications, the equipment model, the report turnaround. The guarantee scope and the
no-call-out-fee terms **are** confirmed — `site.guaranteeTerms` is the only permitted source for them.
The purged claims (a rating, a job count, a success rate) must never come back in any field.

## Canonicals

Every route sets its own via `alternates.canonical`, with a **trailing slash**:

```ts
alternates: {
  canonical: `/services/${slug}/`;
}
```

All 19 indexable routes carry a correct self-referencing one — verified in `out/`. `/thank-you/`
deliberately has none: it is `robots: { index: false }` and absent from the sitemap. Two notes:

- `app/page.tsx` sets `alternates: { canonical: "/" }` while `app/layout.tsx` already does — redundant,
  harmless, and worth leaving alone unless you're touching that file anyway (§2.2).
- `lib/site.ts` exports `withTrailingSlash()` and `canonicalUrl()` precisely so canonicals, sitemap
  `<loc>`s and JSON-LD `url`s are byte-identical. Use them; don't hand-build a URL string.

## Sitemap

`app/sitemap.ts` derives service entries from `serviceSlugs`, guide entries from `articles` and the
whole location silo from `locations` — those three cannot go missing. `staticRoutes` is still a
**hand-maintained array of 8** (backlog §1.2): add a top-level page and it builds fine while being
silently absent from the sitemap. `npm run check:sitemap` (`scripts/check-sitemap-parity.mjs`) is the
backstop — run it after adding any route.

`lastModified: new Date()` was replaced with real per-route dates on 2026-08-17 (§1.3), and the comment
at the top of `app/sitemap.ts` records why. The **new** failure mode is the opposite one: those eight
dates are hand-maintained and nobody bumps them, so routes changed in later sprints still advertise an
older date (SEO-04). If you meaningfully change a route's content, bump its date in the same commit.
The guide entries are the honest pattern — they read `article.dateModified` from `lib/articles.ts`.

Never hand-maintain a second URL list anywhere.

## The `openGraph` shallow-merge trap (SEO-01 — open)

Next **replaces** a top-level metadata key rather than deep-merging it: a page that declares its own
`openGraph` object loses **everything** the layout's `openGraph` supplied, `images` included.

That is live today. `app/services/[slug]/page.tsx`, `app/guides/[slug]/page.tsx` and
`app/locations/[city]/page.tsx` each declare `openGraph` without `images`, so **ten routes** (4 services,
3 guides, 3 cities) emit no `og:image`, no `og:type`, no `og:locale` and no `og:site_name` — a link
shared to WhatsApp renders as a bare text row with no preview card. The mirror half: the routes that
declare **no** `openGraph` inherit the layout's `url: site.domain`, so eight indexable pages assert
`og:url` = the homepage. Every one of those pages carries a correct `rel=canonical`, so that half is a
weak duplicate hint, not an indexing problem — fix it for tidiness, rank it below the missing images.

The fix is a shared helper in `lib/site.ts` returning the common block merged with a per-page
title/description/url, spread into every route, plus dropping `url` from the layout (a layout-level
absolute `og:url` can only ever be right on one route). **Whenever you touch a page's `openGraph`,
restate the whole block.** Then check the emitted HTML, which is the only place this is visible:

```bash
grep -o '<meta property="og:[^>]*>' out/services/water-leak-detection/index.html
```

## Robots

`app/robots.ts` emits a blanket allow plus the sitemap and a `host` directive. **Be aware it may not be
what serves** — the zone is behind Cloudflare, which can prepend a managed `robots.txt` at the edge that
blocks AI crawlers, as it does on a sibling fleet zone. **Verify against the live file** before
concluding anything:

```bash
curl -sS https://thermoleak.co.il/robots.txt
```

See `/aeo-answer-content`.

## Verification and OG

- **Search Console:** `app/layout.tsx` hardcodes `verification: { google: "BxQI2a7…" }` while the
  roster manifest carries `googleSiteVerification: null`. The tag is real and public by design; the
  divergence is a documentation gap, not a leak. Record the token in `docs/business-facts.md` §F.
- OG images come from `/og.png` (1200×630, in `public/`). Twitter tags are set **only** in the layout,
  so every route's `twitter:title` is the generic site title even where `og:title` is page-specific.
  Setting a per-page `twitter` block alongside `openGraph` is part of the SEO-01 fix above.
- `viewport.themeColor` is `#0b3d5c`, the brand token, hardcoded as a literal. Acceptable (Next needs a
  static value there), but if the brand colour changes, this is the second place to update.

## One H1 per page

Exactly one `<h1>`, matching the title's intent. Everything else `<h2>`/`<h3>`, no skipped levels.
Currently correct on all 22 emitted pages — keep it that way.

## Checklist

- [ ] Title renders with the brand **exactly once** — check the rendered output, not the source string.
- [ ] Description is unique, 150–160 chars, and claims nothing 🔶.
- [ ] `alternates.canonical` set, with a trailing slash, built via `canonicalUrl()` / a literal path.
- [ ] The route is in the sitemap — derived from a data array, or added to `staticRoutes` by hand with
      a real `lastModified`. Confirm with `npm run check:sitemap`.
- [ ] If the page declares `openGraph`, it restates the **whole** block, `images` included.
- [ ] Exactly one `<h1>`; heading order unbroken.
- [ ] `npm run build`, then `grep -rho '<title>[^<]*</title>' out --include=index.html` and read them.

## Gotchas

- The root `template` does not apply to `app/page.tsx`. This surprises everyone once.
- A page's `openGraph` **replaces** the layout's; it does not merge into it. Same for `twitter`.
- Forgetting the trailing slash in `canonical` splits signals against the exported directory URL.
- Don't set `metadataBase` per page — it's set once in `app/layout.tsx`.
- `out/` on disk is often older than the last commit. Rebuild before you grep it.
