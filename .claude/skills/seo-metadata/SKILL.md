---
name: seo-metadata
description: Per-route metadata for thermoleak — the Hebrew title and description formulas, the layout template rule and the two live brand-token bugs (homepage has none, /about/ has two), self-referencing trailing-slash canonicals, OG/Twitter, Search Console verification, and deriving sitemap.ts from the data arrays instead of a hand-maintained list. Use when writing metadata for a route, fixing duplicate or malformed titles, or auditing on-page SEO. Triggers "set the metadata", "titles and descriptions", "canonical", "brand suffix", "sitemap", "one H1".
---

# Per-route SEO metadata

Formulas live in `docs/keyword-map.md` §3–§5. This skill is the mechanics.

## The template rule — and both ways it currently breaks

`app/layout.tsx` sets:

```ts
title: {
  default: `${site.nameHe} | איתור נזילות תרמי בגוש דן והמרכז`,
  template: `%s | ${site.nameHe}`,
}
```

The template **already appends the brand**, so a page writes the bare subject. Two routes get it wrong,
in opposite directions (backlog §2.1):

```ts
// ✅ correct — renders "איתור נזילות מים במצלמה תרמית | טרמוליק"
export const metadata = { title: service.h1 };

// ❌ /about/ — the title already contains the brand, then the template appends it again
title: "אודות טרמוליק — מומחים לאיתור נזילות תרמי";
// renders "אודות טרמוליק — מומחים לאיתור נזילות תרמי | טרמוליק"

// ❌ / — renders with NO brand at all
title: "איתור נזילות תרמי, רטיבות ובדיקות תרמוגרפיה";
```

**Why the homepage loses the brand:** a `template` declared in a layout applies to titles from **child
segments**, not to that same segment's own `page.tsx`. `app/page.tsx` is the root layout's own page, so
its title is used verbatim. This is not a bug in Next — it is the documented behaviour, and the fix is
to write the homepage title as a complete title including the brand (or to use `title.absolute`).

The other nine routes are correct. Copy them.

## Titles

| Route          | What you write                                                     |
| -------------- | ------------------------------------------------------------------ |
| Home           | a complete title including the brand — the template will not add it |
| Service        | `service.h1` — e.g. `איתור נזילות מים במצלמה תרמית`                |
| Services index | `שירותים — איתור נזילות, רטיבות ותרמוגרפיה`                        |
| Static         | the page name — `צור קשר`, `המלצות לקוחות`, `הצהרת נגישות`         |
| Location       | `איתור נזילות ב{prefixed}` (silo doesn't exist yet — see `/new-city`) |
| Article        | the question verbatim                                              |

Keep the **rendered** title under ~60 characters. Hebrew is compact; the only route close to the limit
today is `/about/`, and it gets there by doubling the brand.

## Descriptions

150–160 chars, unique per route, following keyword-map §5: what it is + where, one **true**
differentiator, then an action with the phone. All 11 content routes are currently unique — verify that
still holds after any change.

Only claim what `docs/business-facts.md` confirms. The 97% first-visit figure, the 3,000+ job count, the
4.9 rating and the certification claims are all 🔶.

## Canonicals

Every route sets its own via `alternates.canonical`, with a **trailing slash**:

```ts
alternates: { canonical: `/services/${slug}/` }
```

All 13 emitted pages currently carry one. Two notes:

- `app/page.tsx` sets `alternates: { canonical: "/" }` while `app/layout.tsx` already does — redundant,
  harmless, and worth leaving alone unless you're touching that file anyway (§2.2).
- `lib/site.ts` exports `withTrailingSlash()` and `canonicalUrl()` precisely so canonicals, sitemap
  `<loc>`s and JSON-LD `url`s are byte-identical. Use them; don't hand-build a URL string.

## Sitemap

`app/sitemap.ts` builds service entries from `serviceSlugs` automatically, but `staticRoutes` is a
**hand-maintained array of 7** (backlog §1.2) — add a page and it is silently missing from the sitemap
while building fine. Derive it from one exported const that the routes themselves reference.

`lastModified: new Date()` (§1.3) stamps build time on all 11 URLs, so every URL looks freshly changed
on every deploy and the signal is worthless. Use a real per-route date.

Never hand-maintain a second URL list anywhere.

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

- **Search Console:** `app/layout.tsx:32` hardcodes `verification: { google: "BxQI2a7…" }` while the
  roster manifest carries `googleSiteVerification: null`. The tag is real and public by design; the
  divergence is a documentation gap, not a leak. Record the token in `docs/business-facts.md` §F.
- OG images come from `/og.png` (1200×630, in `public/`). Twitter tags are set explicitly in the layout
  rather than derived — keep both in sync if you change one.
- `viewport.themeColor` is `#0b3d5c`, the brand token, hardcoded as a literal. Acceptable (Next needs a
  static value there), but if the brand colour changes, this is the second place to update.

## One H1 per page

Exactly one `<h1>`, matching the title's intent. Everything else `<h2>`/`<h3>`, no skipped levels.
Currently correct on all 13 pages — keep it that way.

## Checklist

- [ ] Title renders with the brand **exactly once** — check the rendered output, not the source string.
- [ ] Description is unique, 150–160 chars, and claims nothing 🔶.
- [ ] `alternates.canonical` set, with a trailing slash, built via `canonicalUrl()` / a literal path.
- [ ] The route is reachable from `app/sitemap.ts` without editing an array by hand.
- [ ] Exactly one `<h1>`; heading order unbroken.
- [ ] `npm run build`, then `grep -rho '<title>[^<]*</title>' out --include=index.html` and read them.

## Gotchas

- The root `template` does not apply to `app/page.tsx`. This surprises everyone once.
- Forgetting the trailing slash in `canonical` splits signals against the exported directory URL.
- Don't set `metadataBase` per page — it's set once in `app/layout.tsx`.
- `out/` on disk is often older than the last commit. Rebuild before you grep it.
