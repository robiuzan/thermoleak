# Accessibility (WCAG 2.1 AA) and the bilingual architecture

Two subjects in one file because they share a root: both are about the document being *correctly
described* — `lang`, `dir`, roles, names — so that assistive tech and search engines can parse it.
`perf-a11y-auditor` audits section A; `/hebrew-rtl` and `/i18n-bilingual` implement section B.

---

# Part A — Accessibility

## A0. The legal position, and a trap

The site **publishes an accessibility statement** at `/accessibility/` claiming conformance with
תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג–2013 and **level AA of
ת״י 5568** — the Israeli standard, which is based on **WCAG 2.0 AA**.

> ⚠️ **Do not change that statement to claim WCAG 2.1 until 2.1 actually passes.**
>
> IS 5568 is a *legal* requirement in Israel, and the statement is a public compliance declaration.
> Targeting 2.1 internally is correct and encouraged. **Publishing** a 2.1 claim before the twelve
> additional criteria in §A1 are verified converts an engineering gap into a false legal statement.
>
> The sequence is: pass 2.1 → verify → *then* update the statement. Never the reverse.

The same logic applies in the other direction: **any contrast or semantics regression makes the
existing statement false.** That is why a11y defects here rank above cosmetic bugs — one of them
was found live (`text-ink/50` at ≈3.1:1) and fixed 2026-08-17.

## A1. What WCAG 2.1 AA adds over 2.0 — the working list

Twelve criteria. These are the delta to audit, since 2.0 AA is the current published baseline.

| SC | Level | What it demands | Risk here |
| --- | --- | --- | --- |
| 1.3.4 Orientation | AA | Works in both portrait and landscape | Low — no orientation lock |
| **1.3.5 Identify Input Purpose** | AA | `autocomplete` on fields collecting user data | ✅ `name`, `tel`, `address-level2` set |
| **1.4.10 Reflow** | AA | No horizontal scroll at 320 px / 400% zoom | **Audit** — tables and the pricing grid |
| **1.4.11 Non-text Contrast** | AA | UI components + focus indicators ≥ 3:1 | ✅ focus ring `brand-light` clears it; audit input borders (`ink/20`) |
| **1.4.12 Text Spacing** | AA | No loss when line-height/spacing overridden | **Audit** — fixed-height buttons and chips |
| 1.4.13 Content on Hover/Focus | AA | Dismissible, hoverable, persistent | Low — no tooltips today |
| 2.1.4 Character Key Shortcuts | A | Single-key shortcuts remappable | N/A — none |
| 2.5.1 Pointer Gestures | A | No path-based/multipoint-only gestures | **Applies to a future before/after slider** |
| 2.5.2 Pointer Cancellation | A | Action on up-event, not down | Low |
| **2.5.3 Label in Name** | A | Visible label text is in the accessible name | **Audit** — `aria-label` on CTAs must *contain* the visible text |
| 2.5.4 Motion Actuation | A | No motion-only triggers | N/A |
| **4.1.3 Status Messages** | AA | Status announced without focus change | **Audit** — form errors and the `/thank-you/` confirmation |

**2.5.3 is the one most often broken here.** `aria-label="התקשרו אלינו: 055-660-1006"` on a button
whose visible text is "חייגו עכשיו" is a *violation* — the accessible name must contain the visible
label. Either make the visible text part of the label or drop the label.

## A2. The contrast table — computed, never eyeballed

| Pair | Ratio | Verdict |
| --- | --- | --- |
| `brand` `#0B3D5C` on white | ≈ 11.4:1 | ✅ |
| `ink` `#1B2733` on white | ≈ 14:1 | ✅ |
| `accent-strong` `#C2410C` + white text | ≈ 5.2:1 | ✅ — the CTA colour |
| `text-ink/70` on white | ≈ 5.7:1 | ✅ the safe secondary step |
| `brand-light` `#1E88A8` + white text | ≈ 4.1:1 | ❌ normal text · ✅ focus ring (UI, 3:1) |
| `accent` `#FF6A3D` on white | ≈ 2.8:1 | ❌ **decorative only — never text** |
| `text-ink/50` on white | ≈ 3.1:1 | ❌ **was live; fixed 2026-08-17** |

The `accent` / `accent-strong` split is deliberate and load-bearing. **Do not collapse it.** Always
recompute against the *real* background — the footer is `bg-brand`, so `text-white/70` there is a
different calculation.

## A3. Semantics and ARIA

**First rule of ARIA: don't.** A native `<button>`, `<a href>`, `<details>`, `<label>` or `<nav>`
beats any `role=` reconstruction. Current code follows this — the FAQ is native `<details>`, the
nav is `<nav aria-label>`, the form uses real labels.

| Pattern | Rule |
| --- | --- |
| Landmarks | `header` / `nav[aria-label]` / `main#main` / `footer`, one each. Multiple `nav` need distinct labels ✅ |
| Headings | Exactly one `<h1>`; no skipped levels. Headings describe structure, not styling |
| Interactive | Real `<button>` / `<a>`. Never a clickable `<div>` |
| Icon-only controls | `aria-label` — and it must satisfy 2.5.3 if visible text exists |
| Decorative icons | `aria-hidden="true"` ✅ consistently applied |
| Lists | No wrapper element between `<ol>`/`<ul>` and its `<li>` — it breaks list semantics |
| Disclosure | `aria-expanded` + `aria-controls`, Escape closes, focus returns ✅ shipped |
| Form errors | Per-field, `aria-invalid` + `aria-describedby`, focus to first invalid ✅ shipped |
| Status messages | `role="status"` (polite) for confirmations; `role="alert"` only for genuine errors |
| Skip link | Visible on focus, first in DOM ✅ shipped |

**Open items:** the mobile menu still lacks a focus trap and scroll lock; the service-page image
uses the `h1` as `alt` (redundant announcement); tap-target measurement on the menu button (`p-2`
around a 24 px icon sits near the 44 px floor).

## A4. Keyboard and focus

- `:focus-visible` is styled globally (3 px `brand-light`, 2 px offset). **Never remove it**, and
  never replace it with `outline: none` without an equivalent.
- Tab order follows DOM order. In RTL that is still correct — never reorder visually with CSS.
- Every interactive element reachable and operable by keyboard alone.
- Focus must be *managed* on route-like transitions: the form moves focus to the first invalid
  field on error, and `/thank-you/` moves focus to its heading ✅.

## A5. Motion

`app/globals.css` carries a global `prefers-reduced-motion` block neutralising animation and
transition durations and disabling smooth scroll. Any new animation must respect it, and no content
may be *only* reachable through motion. There are no scroll-triggered reveals — content is never
stranded at `opacity: 0`, which is correct progressive enhancement and also protects crawlability.

---

# Part B — The bilingual architecture (Hebrew RTL + English LTR)

## B0. Decide whether to build this at all

**This is a business decision with a permanent maintenance cost, and it should not be made by
default.** Every content change doubles. Every page floor doubles. Every audit doubles.

Build it if there is a real audience: olim and expat homeowners in גוש דן, English-speaking property
managers, international insurers or loss adjusters receiving reports. Do **not** build it for
"completeness" or because the framework supports it.

**If you build it, start with a subset** — home, the four service pages, pricing, contact — not the
whole site. A half-translated site with `hreflang` pointing at missing pages is worse than a
monolingual one. Legal pages (`/privacy/`, `/accessibility/`) should stay Hebrew-authoritative: the
accessibility statement is a *legal* declaration under Israeli regulation, and a translation is not
the declaration.

## B1. The good news: the CSS is already bilingual-ready

The repo has **zero** physical-direction Tailwind utilities — verified across `components/` and
`app/`. Everything uses logical properties (`ps/pe`, `ms/me`, `start/end`, `text-start/text-end`,
`rounded-s/e`, `border-s/e`). Flipping `dir` therefore mirrors the entire layout correctly with no
CSS work. That is the expensive half of an RTL/LTR build, and it is already done.

**Protect it.** The ban list in `/hebrew-rtl` is what makes this true; a single `pl-4` merged today
is a bug that only surfaces when English ships.

## B2. URL architecture — Hebrew stays at the root

| Locale | Prefix | Example |
| --- | --- | --- |
| Hebrew (default) | **none** | `/services/water-leak-detection/` |
| English | `/en/` | `/en/services/water-leak-detection/` |

**Hebrew must not move to `/he/`.** Every existing URL carries ranking signal; re-prefixing them
means 301-ing the entire site to gain nothing. The as-needed prefix is the correct pattern for a
site with an established default locale.

Slugs stay **ASCII English** in both trees (they already are), so only the content differs.

## B3. Implementation under `output: "export"` — multiple root layouts

Static export forbids middleware, so locale detection/redirect at the edge is unavailable. The
correct Next App Router pattern is **route groups with two root layouts** — groups do not affect the
URL:

```
app/
  (he)/                     → URLs at /            <html lang="he" dir="rtl">
    layout.tsx                (root layout for Hebrew)
    page.tsx  services/  pricing/  about/  contact/ …
  (en)/                     → URLs at /en/         <html lang="en" dir="ltr">
    en/
      layout.tsx              (root layout for English)
      page.tsx  services/  pricing/  about/  contact/ …
```

Why this and not `app/[locale]/`: a `[locale]` segment forces Hebrew to `/he/` (B2 forbids that) or
requires an optional catch-all whose static-export behaviour is fiddly. Two root layouts is
explicit, statically exportable, and lets each tree set its own `<html>` attributes — which is the
whole point, since **only a root layout can render `<html lang dir>`**.

Trade-off to accept knowingly: navigating *between* locales triggers a full page load. Irrelevant
here — every navigation in a static export is a full load anyway.

### Content model

`lib/site.ts` is currently Hebrew-only. Restructure so identity (phone, email, hours, areas) stays
locale-independent and only *wording* is keyed:

```ts
// lib/i18n.ts
export const locales = ["he", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "he";
export const dir: Record<Locale, "rtl" | "ltr"> = { he: "rtl", en: "ltr" };

// lib/content/{he,en}.ts  — same shape, both locales
export const content: Record<Locale, SiteContent> = { he, en };
```

Page components take `locale` and read from that map. **Never** duplicate a page component per
locale — duplicate the *data*, share the *markup*, or the two trees drift within a sprint.

## B4. hreflang, canonicals and the sitemap

Each page declares the full set, including itself, plus `x-default`:

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

Rules that make it valid:
- **Reciprocal.** If HE points at EN, EN must point back. One-way annotations are ignored.
- **Self-referencing.** Every page lists itself.
- **Absolute URLs** in the emitted sitemap; `canonicalUrl()` already normalises trailing slashes.
- **`x-default` → Hebrew**, the default locale.
- **Only annotate pages that exist in both.** A page with no English twin gets no `languages` block.
- `app/sitemap.ts` must emit both trees with `alternates.languages` per entry.

## B5. Typography and formatting per locale

| Concern | Hebrew | English |
| --- | --- | --- |
| Fonts | Heebo (headings) + Assistant (body) | **Reuse both** — each has Latin coverage. A third family breaks the font budget |
| Numerals | Always LTR inside RTL text | Native |
| Phone | `055-660-1006`, `dir="ltr"` island | `+972 55-660-1006` — international form for an international reader |
| Currency | `₪450` (symbol first — existing convention) | `₪450` or `450 NIS`; be consistent |
| Dates | `dd/mm/yyyy` | `dd/mm/yyyy` (IL context) — do **not** switch to US order |
| Punctuation | גרש `׳` / גרשיים `״` in abbreviations | ASCII apostrophes/quotes |
| Ranges | En dash, no spaces | En dash |

**LTR islands are harmless in English pages** — `dir="ltr"` inside an LTR document is a no-op, so
the existing pattern is safe to share across both trees.

## B6. What must be verified before English ships

- [ ] Every EN page has a real HE twin and reciprocal `hreflang`.
- [ ] `<html lang>` and `dir` correct on **both** trees (view source, not devtools).
- [ ] Zero physical-direction utilities anywhere (the ban list still passes).
- [ ] Both trees in `sitemap.xml`, each with `alternates`.
- [ ] Titles carry the brand exactly once in both locales.
- [ ] JSON-LD emits `inLanguage` matching the page, and `Service`/`FAQPage` text matches the
      *visible* text in that locale.
- [ ] The English tree is not a machine translation of Hebrew. A bad translation damages E-E-A-T in
      both languages; either it is written properly or it does not ship.
- [ ] Legal pages remain Hebrew-authoritative, with any English version clearly marked as a
      convenience translation.

## B7. Accessibility ties back in

`lang` is an accessibility requirement (WCAG 3.1.1 Language of Page), not just an SEO one — screen
readers switch voice and pronunciation from it. Getting `lang`/`dir` wrong per tree is
simultaneously a 3.1.1 failure and an `hreflang` failure. Any inline language switch (an English
brand name inside Hebrew prose) needs `lang="en"` on that span (WCAG 3.1.2).
