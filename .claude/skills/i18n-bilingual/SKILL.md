---
name: i18n-bilingual
description: Add or maintain the English (LTR) tree alongside Hebrew (RTL) on a static export — the two-root-layout route-group architecture that keeps Hebrew at the URL root, the locale-keyed content model, reciprocal hreflang and sitemap alternates, per-locale formatting, and the decision gate for whether to build it at all. Use when adding English, auditing hreflang, or changing anything touching lang/dir. Triggers "add English", "i18n", "hreflang", "multilingual", "LTR", "translate the site", "locale".
---

# Bilingual architecture — Hebrew (RTL) + English (LTR)

Full rationale in [docs/accessibility-and-i18n.md](../../../docs/accessibility-and-i18n.md) Part B.
This skill is the mechanics. `/hebrew-rtl` remains authoritative for RTL discipline.

## 0. The decision gate — do not skip it

**English is a permanent maintenance cost, not a feature flag.** Every content change doubles, every
depth floor doubles, every audit doubles.

Build it only if there is a real audience: olim and expat homeowners in גוש דן, English-speaking
property managers, international insurers receiving reports. Do **not** build it for completeness.

If you build it, **start with a subset** — home, four service pages, pricing, contact. A
half-translated site with `hreflang` pointing at missing pages is worse than a monolingual one.
Legal pages stay **Hebrew-authoritative**: `/accessibility/` is a legal declaration under Israeli
regulation, and a translation is not the declaration.

## 1. What is already done (protect it)

The repo has **zero physical-direction Tailwind utilities** — everything is logical
(`ps/pe`, `ms/me`, `start/end`, `text-start/text-end`, `rounded-s/e`, `border-s/e`). Flipping `dir`
mirrors the whole layout with no CSS work.

That is the expensive half of an RTL/LTR build, already paid for. A single `pl-4` merged today is a
latent bug that only surfaces when English ships. Verify before starting:

```bash
grep -rnE '\b(pl|pr|ml|mr)-[0-9]|\b(left|right)-[0-9]|text-(left|right)\b|\brounded-(l|r)-|\bborder-(l|r)-' components app
```

Expect no output.

## 2. URL architecture — Hebrew stays at the root

| Locale | Prefix | Example |
| --- | --- | --- |
| Hebrew (default) | **none** | `/services/water-leak-detection/` |
| English | `/en/` | `/en/services/water-leak-detection/` |

**Never move Hebrew to `/he/`.** Every existing URL carries ranking signal; re-prefixing means
301-ing the entire site to gain nothing. Slugs stay ASCII English in both trees — only content
differs.

## 3. Implementation — two root layouts via route groups

`output: "export"` forbids middleware, so there is no locale redirect at the edge. Use route groups
(they do not affect the URL) so each tree owns its `<html>`:

```
app/
  (he)/                     → URLs at /            <html lang="he" dir="rtl">
    layout.tsx
    page.tsx  services/  pricing/  about/  contact/ …
  (en)/
    en/                     → URLs at /en/         <html lang="en" dir="ltr">
      layout.tsx
      page.tsx  services/  pricing/  about/  contact/ …
```

**Why not `app/[locale]/`:** it forces Hebrew to `/he/` (§2 forbids it) or needs an optional
catch-all whose static-export behaviour is fiddly. **Only a root layout can render `<html lang dir>`**
— which is the entire point.

Accepted trade-off: navigating *between* locales is a full page load. Irrelevant on a static export
where every navigation already is.

Both trees need their own `generateStaticParams` for `[slug]` routes, and `metadataBase` stays set
once per root layout.

## 4. Content model — duplicate data, share markup

```ts
// lib/i18n.ts
export const locales = ["he", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "he";
export const dir: Record<Locale, "rtl" | "ltr"> = { he: "rtl", en: "ltr" };

// lib/content/{he,en}.ts — identical shape, both locales
export const content: Record<Locale, SiteContent> = { he, en };
```

Identity (phone, WhatsApp, email, hours, service areas, founding year) is **locale-independent** and
stays in `lib/site.ts`. Only *wording* is keyed by locale.

**Never duplicate a page component per locale.** Duplicate the data, share the markup — pass
`locale` as a prop. Two copies of a page drift within a sprint.

## 5. hreflang, canonicals, sitemap

```ts
alternates: {
  canonical: "/services/water-leak-detection/",
  languages: {
    "he-IL": "/services/water-leak-detection/",
    "en":    "/en/services/water-leak-detection/",
    "x-default": "/services/water-leak-detection/",
  },
}
```

Validity rules:

- **Reciprocal** — if HE points at EN, EN must point back. One-way annotations are ignored entirely.
- **Self-referencing** — every page lists itself.
- **`x-default` → Hebrew**, the default locale.
- **Only annotate pages that exist in both.** No English twin = no `languages` block.
- `app/sitemap.ts` emits both trees, each entry carrying its `alternates`.
- Canonicals stay **self-referencing per locale** — an English page never canonicalises to Hebrew.

## 6. Per-locale formatting

| Concern | Hebrew | English |
| --- | --- | --- |
| Fonts | Heebo + Assistant | **Reuse both** — each has Latin coverage. A third family breaks the font budget |
| Phone | `055-660-1006` in a `dir="ltr"` island | `+972 55-660-1006` — international form |
| Currency | `₪450` (symbol first — existing convention) | `₪450` or `450 NIS`, consistently |
| Dates | `dd/mm/yyyy` | `dd/mm/yyyy` — **never** switch to US order in an IL context |
| Punctuation | גרש `׳` / גרשיים `״` | ASCII |
| Ranges | En dash, no spaces | En dash |

`dir="ltr"` on phone/email elements is a **no-op inside an LTR document**, so the existing island
pattern is safe to share across both trees unchanged.

## 7. Accessibility ties in

`lang` is WCAG **3.1.1 Language of Page** — screen readers switch voice and pronunciation from it.
Wrong `lang`/`dir` per tree is simultaneously a 3.1.1 failure and an `hreflang` failure. An inline
language switch (an English brand or equipment name inside Hebrew prose) needs `lang="en"` on that
span (**3.1.2 Language of Parts**).

## 8. Checklist

- [ ] The §0 decision gate was actually applied — there is a named audience.
- [ ] Ban-list grep still returns nothing.
- [ ] Hebrew URLs unchanged; English under `/en/`.
- [ ] `<html lang>` and `dir` correct on both trees — **verified in view-source**, not devtools.
- [ ] Every EN page has a real HE twin; `hreflang` reciprocal, self-referencing, with `x-default`.
- [ ] Both trees in `sitemap.xml` with `alternates`.
- [ ] Titles carry the brand exactly once in both locales.
- [ ] JSON-LD `inLanguage` matches the page; `Service`/`FAQPage` text matches the **visible** text
      in that locale.
- [ ] Not machine-translated. A bad translation damages E-E-A-T in both languages.
- [ ] Legal pages Hebrew-authoritative; any English version marked a convenience translation.
- [ ] `npm run lint && npm run build`; route count roughly doubles — update
      `/qa-build-gate` expectations in the same commit.

## Gotchas

- Adding English **doubles the route count**, which changes every assertion in `/qa-build-gate`.
  Update the gate in the same commit or the next audit reports false failures.
- `metadataBase` is per root layout — set it in both, or English URLs resolve relative to nothing.
- A missing English page with a live `hreflang` annotation is worse than no annotation.
- Do not translate `data-cta` values. They are analytics identifiers, not copy.
