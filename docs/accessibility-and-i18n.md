# Accessibility (WCAG 2.0 AA published · 2.1 AA targeted) and the bilingual architecture

Two subjects in one file because they share a root: both are about the document being _correctly
described_ — `lang`, `dir`, roles, names — so that assistive tech and search engines can parse it.
`perf-a11y-auditor` audits section A; `/hebrew-rtl` and `/i18n-bilingual` implement section B.

---

# Part A — Accessibility

## A0. The legal position, and a trap

The site **publishes an accessibility statement** at `/accessibility/` claiming conformance with
תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג–2013 and **level AA of
ת״י 5568** — the Israeli standard, which is based on **WCAG 2.0 AA**.

> ⚠️ **Do not change that statement to claim WCAG 2.1 until 2.1 actually passes.**
>
> IS 5568 is a _legal_ requirement in Israel, and the statement is a public compliance declaration.
> Targeting 2.1 internally is correct and encouraged. **Publishing** a 2.1 claim before the twelve
> additional criteria in §A1 are verified converts an engineering gap into a false legal statement.
>
> The sequence is: pass 2.1 → verify → _then_ update the statement. Never the reverse.

The same logic applies in the other direction: **any contrast or semantics regression makes the
existing statement false.** That is why a11y defects here rank above cosmetic bugs — one of them
was found live (`text-ink/50` at ≈3.1:1) and fixed 2026-08-17.

> 🔴 **The statement is false again right now.** `app/accessibility/page.tsx` asserts
> "שמירה על ניגודיות צבעים תקינה בין הטקסט לרקע", and **seven live text values sit below 4.5:1** —
> including the "last updated" line of the accessibility statement itself and the equivalent line on
> `/privacy/`. They are enumerated in §A2 and they are **open**: this pass is documentation only, so
> the swap has not been made. **SC 1.4.3 is WCAG 2.0**, so this is a defect against the _published_
> declaration, not against the 2.1 target — the most serious class of a11y defect this project has.
>
> The lesson, worth more than the fix: the 2026-08-17 pass swapped the one literal the backlog named
> and declared the criterion restored. **A targeted literal swap is not a palette audit.** §A2 below
> only ever enumerated `ink` at full strength, `ink/70` and `ink/50` — so `ink/40`, `ink/55` and
> `ink/60` were never computed and walked straight through review for three sprints.
>
> Sequencing, per the rule above: fix the values → verify → _then_ re-date the statement. Never the
> reverse.

**While re-dating it, two other things on that page are stale or missing** (both code changes, both
outside this pass): its "last updated" line still reads יוני 2026 although the a11y posture changed
twice since; and it says nothing about there being **no public premises**, which is the single most
relevant fact a service-provider statement can state and is already available as `site.address.note`
— import it, never retype it. The page also routes accessibility complaints to "רכז הנגישות"
without naming anyone; if the owner wants a named coordinator that is an owner-supplied fact for
[business-facts.md](business-facts.md), not something to invent.

## A1. What WCAG 2.1 AA adds over 2.0 — the working list

Twelve criteria. These are the delta to audit, since 2.0 AA is the current published baseline.
**The sprint-1 commit `ff2545c` worked this list**; the State column records what it actually did,
so the next pass starts from the residue rather than re-auditing all twelve.

| SC                               | Level | What it demands                               | State                                                                                                                                                                                       |
| -------------------------------- | ----- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.3.4 Orientation                | AA    | Works in both portrait and landscape          | ✅ no orientation lock                                                                                                                                                                      |
| **1.3.5 Identify Input Purpose** | AA    | `autocomplete` on fields collecting user data | ✅ `name`, `tel`, `address-level2` set on the three collecting fields                                                                                                                       |
| **1.4.10 Reflow**                | AA    | No horizontal scroll at 320 px / 400% zoom    | ✅ audited in `ff2545c`, no change needed — no tables, no min-widths, no `nowrap`, no fixed-width containers                                                                                |
| **1.4.11 Non-text Contrast**     | AA    | UI components + focus indicators ≥ 3:1        | 🔴 **two open items** — see below                                                                                                                                                           |
| **1.4.12 Text Spacing**          | AA    | No loss when line-height/spacing overridden   | ✅ audited in `ff2545c`, no change needed — the one fixed height is a nav bar that cannot clip                                                                                              |
| 1.4.13 Content on Hover/Focus    | AA    | Dismissible, hoverable, persistent            | ✅ N/A — no tooltips today                                                                                                                                                                  |
| 2.1.4 Character Key Shortcuts    | A     | Single-key shortcuts remappable               | ✅ N/A — none                                                                                                                                                                               |
| 2.5.1 Pointer Gestures           | A     | No path-based/multipoint-only gestures        | ✅ today; **applies to a future before/after slider**                                                                                                                                       |
| 2.5.2 Pointer Cancellation       | A     | Action on up-event, not down                  | ✅ native controls only                                                                                                                                                                     |
| **2.5.3 Label in Name**          | A     | Visible label text is in the accessible name  | ✅ fixed in `ff2545c` — two real violations found and closed                                                                                                                                |
| 2.5.4 Motion Actuation           | A     | No motion-only triggers                       | ✅ N/A                                                                                                                                                                                      |
| **4.1.3 Status Messages**        | AA    | Status announced without focus change         | ✅ shipped — polite live region announcing the error count. One residue: a **repeat submit with identical errors re-writes identical text, and an unchanged live region announces nothing** |

**1.4.11 — the one criterion still open, in two places.** It was on the roadmap's sprint-1 list and
is absent from `ff2545c`'s body; nothing was falsely closed (this table never claimed it), but it
was glossed at the sprint gate. Both are open and both need a code change:

1. **The focus ring fails on every `bg-brand` surface.** `app/globals.css` sets
   `outline: 3px solid var(--color-brand-light)` with `outline-offset: 2px`. Because the offset puts
   _both_ edges of the ring against the section background, there is no light edge to rescue it:
   `brand-light #1E88A8` on `brand #0B3D5C` is **2.80:1** against the 3:1 requirement. It hits the
   footer (where the accessibility and privacy links live), the breadcrumb trail on every subpage,
   the hero CTAs, the pricing banner and the mobile sticky call button — the highest-traffic
   keyboard targets on the site. On light surfaces the same ring is 4.08:1 ✅. **The dark-surface
   pair is a white ring (11.44:1 on `brand`)**, scoped to those sections.
2. **Input borders are invisible.** `border-ink/20` in all five resting field states is **1.49:1**
   on the white field interior, against a `bg-paper` card only ~1.03:1 different from the field — so
   nothing implicitly bounds the input either. The error state is fine (`border-red-500`, 3.76:1);
   only the state every user sees first fails. `ink/55` computes to 3.58:1 on white / 3.52:1 on
   paper and is the safe step.

**2.5.3 is the one most often broken here**, so keep the rule in view when adding a CTA:
`aria-label="התקשרו אלינו: 055-660-1006"` on a button whose visible text is "חייגו עכשיו" is a
_violation_ — the accessible name must contain the visible label. `ff2545c` fixed exactly this on
the hero (label dropped; its visible text is already a complete name) and the sticky bar (label now
leads with the visible words). The navbar button keeps its label legitimately: its visible text is
the phone number, which the label contains.

## A2. The contrast table — computed, never eyeballed

**Every `ink` opacity step actually in use, computed 2026-09-06.** The table used to list four steps
and the palette used seven; the three it omitted are exactly the three that shipped failing. Add a
row here _before_ using a new step, not after.

| Pair                                   | Ratio (on white) | Verdict                                                                                |
| -------------------------------------- | ---------------- | -------------------------------------------------------------------------------------- |
| `brand` `#0B3D5C` on white             | ≈ 11.4:1         | ✅                                                                                     |
| `ink` `#1B2733` on white               | ≈ 14:1           | ✅                                                                                     |
| `accent-strong` `#C2410C` + white text | ≈ 5.2:1          | ✅ — the CTA colour                                                                    |
| **`text-ink/70`**                      | **≈ 5.7:1**      | ✅ **the hard floor for text. Anything below it is a bug**                             |
| `brand-light` `#1E88A8` + white text   | ≈ 4.1:1          | ❌ normal text · ✅ focus ring on **light** surfaces only (2.80:1 on `bg-brand` — §A1) |
| `text-ink/60`                          | ≈ 4.15:1         | ❌ **live in 4 places** — `components/ContactCTA.tsx` :38, :56, :71, :106              |
| `text-ink/55`                          | ≈ 3.58:1         | ❌ **live in 2 places** — `app/accessibility/page.tsx:69`, `app/privacy/page.tsx:82`   |
| `text-ink/50`                          | ≈ 3.10:1         | ❌ was live; fixed 2026-08-17. Zero occurrences today                                  |
| `text-ink/40`                          | ≈ 2.38:1         | ❌ **live** as `placeholder:text-ink/40` — `components/ContactForm.tsx:45`             |
| `accent` `#FF6A3D` on white            | ≈ 2.8:1          | ❌ **decorative only — never text**                                                    |
| `border-ink/20` on white               | ≈ 1.49:1         | ❌ SC 1.4.11, not 1.4.3 — §A1 item 2                                                   |

**Six live SC 1.4.3 failures (A11Y-1), all open, all 14 px normal weight — no large-text
exemption:** the four `ink/60` and the two `ink/55` above. On `bg-paper` each is ~0.08 worse. The
seventh sub-floor value is the form's `placeholder:text-ink/40` at 2.38:1 — **SC 1.4.3 has no
placeholder exemption**, so it fails on the same terms. `ink/70` clears all seven cases and is the
one-step fix.

> Two of the six are on `/accessibility/` and `/privacy/` themselves. That is not irony worth
> enjoying — it is why §A0 rates this above cosmetic work.

A build-gate grep belongs beside `scripts/check-sitemap-parity.mjs`, failing on any
`text-ink/` below 70 and any `placeholder:text-ink/` below 70, so the next one cannot ship. (Not
added in this pass — documentation only.)

The `accent` / `accent-strong` split is deliberate and load-bearing. **Do not collapse it.** Always
recompute against the _real_ background — the footer is `bg-brand`, so `text-white/70` there is a
different calculation, and it is the reason the focus-ring row above needs two verdicts rather
than one.

## A3. Semantics and ARIA

**First rule of ARIA: don't.** A native `<button>`, `<a href>`, `<details>`, `<label>` or `<nav>`
beats any `role=` reconstruction. Current code follows this — the FAQ is native `<details>`, the
nav is `<nav aria-label>`, the form uses real labels.

| Pattern            | Rule                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| Landmarks          | `header` / `nav[aria-label]` / `main#main` / `footer`, one each. Multiple `nav` need distinct labels ✅ |
| Headings           | Exactly one `<h1>`; no skipped levels. Headings describe structure, not styling                         |
| Interactive        | Real `<button>` / `<a>`. Never a clickable `<div>`                                                      |
| Icon-only controls | `aria-label` — and it must satisfy 2.5.3 if visible text exists                                         |
| Decorative icons   | `aria-hidden="true"` ✅ consistently applied                                                            |
| Lists              | No wrapper element between `<ol>`/`<ul>` and its `<li>` — it breaks list semantics                      |
| Disclosure         | `aria-expanded` + `aria-controls`, Escape closes, focus returns ✅ shipped                              |
| Form errors        | Per-field, `aria-invalid` + `aria-describedby`, focus to first invalid ✅ shipped                       |
| Status messages    | `role="status"` (polite) for confirmations; `role="alert"` only for genuine errors                      |
| Skip link          | Visible on focus, first in DOM ✅ shipped                                                               |

**Closed since this section was written** (all in `ff2545c`, all verified in the current code): the
mobile menu now has a **focus trap and scroll lock** — `Navbar` moves focus into the panel on open,
cycles Tab inside it, restores focus to the trigger on close and locks `body` overflow; the
service-page illustration is now `alt=""` (it sat beside an `h1` that already named the service, so
the `h1`-as-`alt` was a duplicate announcement); the menu button is `size-11` = **exactly 44 px**.
**Do not regress any of these** — the focus trap in particular is the pattern any new disclosure
should copy.

**Open items — all small, all needing a code change this pass did not make:**

| Item                                        | Where                                                                                                                                                                                                                                     | Why it matters                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The shared `md` CTA token is **40 px** tall | `components/CtaButton.tsx:11` (`py-2.5` + `text-sm`)                                                                                                                                                                                      | Its worst instance is the call CTA inside the open mobile menu — the primary action on the primary device, 4 px under this project's own bar. Note the bar: 44 px is SC **2.5.5 (AAA)**; WCAG 2.2's AA criterion is 2.5.8 at 24×24, which 40 px clears. So this is drift against an internal standard, **not** a conformance failure. `py-3` makes it exactly 44 px and fixes all five call sites at once |
| Decorative text nodes are announced         | `components/Process.tsx:52` (the watermark numeral, also 1.2:1 and so unable to claim 1.4.3's decoration exemption while unmarked), `app/pricing/page.tsx:114` and `components/ArticleBody.tsx:122-125` (the bare `+` disclosure markers) | `aria-hidden="true"` fixes all three. `components/Faq.tsx` already does this correctly with its chevron — these are copies of that pattern that dropped the attribute                                                                                                                                                                                                                                     |
| The error live region does not re-announce  | `components/ContactForm.tsx:99-101`                                                                                                                                                                                                       | Its text is a pure function of the error count, so a second submit with the same two errors writes identical content and an unchanged live region emits nothing. 4.1.3 landed and works on first submit; this is the residue                                                                                                                                                                              |

## A4. Keyboard and focus

- `:focus-visible` is styled globally (3 px `brand-light`, 2 px offset). **Never remove it**, and
  never replace it with `outline: none` without an equivalent. Note that the global rule is
  _unlayered_, so it beats the `focus-visible:outline-none` utility that `CtaButton` carries — the
  ring does render on those buttons. **But it is only 2.80:1 on `bg-brand` sections** (§A1); a
  dark-surface scope with a white ring is the open fix.
- Tab order follows DOM order. In RTL that is still correct — never reorder visually with CSS.
- Every interactive element reachable and operable by keyboard alone.
- Focus must be _managed_ on route-like transitions: the form moves focus to the first invalid
  field on error, and `/thank-you/` moves focus to its heading ✅.

## A5. Motion

`app/globals.css` carries a global `prefers-reduced-motion` block neutralising animation and
transition durations and disabling smooth scroll. Any new animation must respect it, and no content
may be _only_ reachable through motion. There are no scroll-triggered reveals — content is never
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
accessibility statement is a _legal_ declaration under Israeli regulation, and a translation is not
the declaration.

## B1. The good news: the CSS is already bilingual-ready

The repo has **zero** physical-direction Tailwind utilities — re-verified across `components/` and
`app/` on 2026-09-06, **including the `/guides/` and `/locations/` silos added after this section
was written**. Everything uses logical properties (`ps/pe`, `ms/me`, `start/end`,
`text-start/text-end`, `rounded-s/e`, `border-s/e`). Flipping `dir` therefore mirrors the entire
layout correctly with no CSS work. That is the expensive half of an RTL/LTR build, and it is already
done — and it has now survived two silos, which is the real test.

**Protect it.** The ban list in `/hebrew-rtl` is what makes this true; a single `pl-4` merged today
is a bug that only surfaces when English ships.

## B2. URL architecture — Hebrew stays at the root

| Locale           | Prefix   | Example                              |
| ---------------- | -------- | ------------------------------------ |
| Hebrew (default) | **none** | `/services/water-leak-detection/`    |
| English          | `/en/`   | `/en/services/water-leak-detection/` |

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

Trade-off to accept knowingly: navigating _between_ locales triggers a full page load. Irrelevant
here — every navigation in a static export is a full load anyway.

### Content model

`lib/site.ts` is currently Hebrew-only. Restructure so identity (phone, email, hours, areas) stays
locale-independent and only _wording_ is keyed:

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
locale — duplicate the _data_, share the _markup_, or the two trees drift within a sprint.

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

| Concern     | Hebrew                                      | English                                                                         |
| ----------- | ------------------------------------------- | ------------------------------------------------------------------------------- |
| Fonts       | Heebo (headings) + Assistant (body)         | **Reuse both** — each has Latin coverage. A third family breaks the font budget |
| Numerals    | Always LTR inside RTL text                  | Native                                                                          |
| Phone       | `055-660-1006`, `dir="ltr"` island          | `+972 55-660-1006` — international form for an international reader             |
| Currency    | `₪350` (symbol first — existing convention) | `₪350` or `450 NIS`; be consistent                                              |
| Dates       | `dd/mm/yyyy`                                | `dd/mm/yyyy` (IL context) — do **not** switch to US order                       |
| Punctuation | גרש `׳` / גרשיים `״` in abbreviations       | ASCII apostrophes/quotes                                                        |
| Ranges      | En dash, no spaces                          | En dash                                                                         |

**LTR islands are harmless in English pages** — `dir="ltr"` inside an LTR document is a no-op, so
the existing pattern is safe to share across both trees.

## B6. What must be verified before English ships

- [ ] Every EN page has a real HE twin and reciprocal `hreflang`.
- [ ] `<html lang>` and `dir` correct on **both** trees (view source, not devtools).
- [ ] Zero physical-direction utilities anywhere (the ban list still passes).
- [ ] Both trees in `sitemap.xml`, each with `alternates`.
- [ ] Titles carry the brand exactly once in both locales.
- [ ] JSON-LD emits `inLanguage` matching the page, and `Service`/`FAQPage` text matches the
      _visible_ text in that locale.
- [ ] The English tree is not a machine translation of Hebrew. A bad translation damages E-E-A-T in
      both languages; either it is written properly or it does not ship.
- [ ] Legal pages remain Hebrew-authoritative, with any English version clearly marked as a
      convenience translation.

## B7. Accessibility ties back in

`lang` is an accessibility requirement (WCAG 3.1.1 Language of Page), not just an SEO one — screen
readers switch voice and pronunciation from it. Getting `lang`/`dir` wrong per tree is
simultaneously a 3.1.1 failure and an `hreflang` failure. Any inline language switch (an English
brand name inside Hebrew prose) needs `lang="en"` on that span (WCAG 3.1.2).
