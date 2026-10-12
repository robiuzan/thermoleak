---
name: responsive-accessibility
description: WCAG 2.0 AA and Israeli IS 5568 compliance for thermoleak — the computed contrast table, the seven live SC 1.4.3 failures at ink/55, ink/60 and the ink/40 placeholder (one on /accessibility/ itself, one on /privacy/), the ink/70 house floor, 44px tap targets, the shipped mobile-menu focus trap you must not regress, semantic landmarks and one H1, form labelling, reduced motion, and keeping /accessibility/ truthful. Use before shipping or when auditing accessibility. Triggers "accessibility pass", "WCAG", "contrast check", "tap targets", "keyboard navigation", "נגישות", "IS 5568".
---

# Accessibility — WCAG 2.0 AA + IS 5568

This site **publishes an accessibility statement** at `/accessibility/` claiming conformance with
תקנות שוויון זכויות התשע״ג–2013 and **level AA of ת״י 5568** (based on WCAG 2.0). That raises the
stakes: a failure here isn't just a bug, it makes a published statement false. Keep the statement and
the site in sync in both directions.

Note the bar is **WCAG 2.0 AA**, which is what the statement claims. Don't silently audit against 2.1
without saying so — several 2.1 criteria (e.g. 1.4.11 non-text contrast) are good practice here but are
not what was published.

## The contrast table — computed, not eyeballed

Tokens from `app/globals.css`, all recomputed **2026-09-06** rather than carried forward:

| Pair                              | Ratio       | Verdict                                                                         |
| --------------------------------- | ----------- | ------------------------------------------------------------------------------- |
| `brand` `#0B3D5C` on white        | **11.44:1** | ✅ excellent                                                                    |
| `brand-dark` `#082A40` on white   | **14.84:1** | ✅                                                                              |
| `ink` `#1B2733` on white          | **15.17:1** | ✅ (CLAUDE.md §8 rounds this to ≈14:1 — either reading clears the bar by miles) |
| `accent-strong` `#C2410C` + white | **5.18:1**  | ✅ — this is why it is the CTA colour                                           |
| `brand-light` `#1E88A8` + white   | **4.08:1**  | ❌ normal text · ✅ focus ring on a **light** surface only (see Keyboard)       |
| `accent` `#FF6A3D` on white       | **2.85:1**  | ❌ **decorative only — never text**                                             |

Tailwind v4 emits `color-mix(in oklab, var(--color-ink) N%, transparent)` for `ink/N`, which is plain
alpha over the backdrop. The alpha ladder, computed on white and on `bg-paper` `#F7F9FB`:

| Step     | on white | on paper | Verdict                                                         |
| -------- | -------- | -------- | --------------------------------------------------------------- |
| `ink/80` | 7.93     | 7.67     | ✅                                                              |
| `ink/75` | 6.70     | 6.50     | ✅                                                              |
| `ink/70` | **5.68** | **5.53** | ✅ **the floor — use this for any secondary or `text-sm` copy** |
| `ink/65` | 4.84     | 4.73     | ✅ arithmetically, but with no margin — don't introduce it      |
| `ink/60` | 4.15     | 4.07     | ❌ **fails 4.5:1 — live, see below**                            |
| `ink/55` | 3.58     | 3.52     | ❌ **fails — live, see below**                                  |
| `ink/50` | 3.10     | 3.06     | ❌ zero occurrences today; keep it that way                     |
| `ink/40` | 2.38     | 2.36     | ❌ **live as `placeholder:text-ink/40`**                        |

**`ink/70` is the hard floor for text, and `ink/55`/`ink/60` are the trap.** Both read like safe
midpoints and both fail 4.5:1. If a proposed contrast _fix_ lands on `/55` or `/60`, the arithmetic is
wrong — recompute before you write it down.

The token set itself is deliberately and correctly split — `accent` for decoration, `accent-strong` for
anything carrying white text, and `CLAUDE.md` §8 documents that split. **The failures are not in the
tokens; they are in the opacity step chosen at each call site.**

### The six live SC 1.4.3 failures (finding A11Y-1 — OPEN)

All are 14px (`text-sm`) normal weight, so no large-text exemption applies:

| Call site                                    | Class                               | Ratio |
| -------------------------------------------- | ----------------------------------- | ----- |
| `app/accessibility/page.tsx:69`              | `text-sm text-ink/55`               | 3.58  |
| `app/privacy/page.tsx:82`                    | `text-sm text-ink/55`               | 3.58  |
| `components/ContactCTA.tsx:38`, `:56`, `:71` | `text-sm text-ink/60`               | 4.15  |
| `components/ContactCTA.tsx:106`              | `text-sm text-ink/60` on `bg-paper` | 4.07  |

Plus a seventh, related literal: `components/ContactForm.tsx:45` sets `placeholder:text-ink/40` at
**2.38:1**. SC 1.4.3 has no placeholder exemption. Note that jumping it straight to `ink/70` makes
placeholder text nearly indistinguishable from entered `text-ink` values — that one deserves a design
beat, not a blind swap.

Sprint 1 swapped the single literal the backlog named (`ink/50` in `ContactForm`) and declared the
criterion restored. It was a targeted replacement, not a palette audit, so `ink/40`, `ink/55` and
`ink/60` were never computed and passed straight through. **Audit the whole ladder, not the one value
someone wrote down.**

**The statement conflict.** `/accessibility/` explicitly claims
"שמירה על ניגודיות צבעים תקינה בין הטקסט לרקע" (`app/accessibility/page.tsx:41`). While the six above
stand, that sentence is false — and the worst-placed instance is the "last updated" line of the
statement itself. Fix the contrast; never edit the statement down to match a defect. And keep the
sequence: **fix first, then re-date the statement** — never re-date a page whose claims you have not
yet made true.

Recompute against the **real background**, not against white by default — the footer is `bg-brand`, so
`text-white/70` there is a different calculation (**6.45:1**, passes comfortably).

## Semantics

- **One `<h1>` per page** — verified correct on all **22 emitted pages** (19 of them in the sitemap;
  `/thank-you/` is deliberately noindex, plus the two 404 forms). Heading order unbroken.
- Landmarks: `header`, `nav` (with `aria-label`), `main#main`, `footer` — all present. The footer has
  two labelled `<nav>` regions (`שירותים`, `ניווט`), which is the right pattern.
- A **skip link** ships in `app/layout.tsx` (`דלג לתוכן המרכזי`), visible on focus. Don't remove it.
- Real `<button>` / `<a>`, never a clickable `div`.
- Watch for wrapper components interposed between a list and its `<li>`s — it breaks list semantics.
  The service page's `<ol>` of steps is currently correct.

## Keyboard

- **Focus is styled globally** in `app/globals.css:45-49`: `:focus-visible` gets a 3px `brand-light`
  outline with a 2px offset. Don't remove or override it away. Note `components/CtaButton.tsx:8`
  carries `focus-visible:outline-none`, which does **not** win — the `globals.css` rule is unlayered
  and beats every `@layer utilities` declaration, so the ring does render on the CTAs. Verify that in
  a browser before you "fix" either side.
- **The ring's dark-surface gap** (finding A11Y-2 — OPEN). `outline-offset: 2px` puts the ring outside
  the element, so both its edges sit on the _section_ background. On a `bg-brand` surface that is
  `brand-light` on `brand` = **2.80:1**, under the 3:1 that SC 1.4.11 wants. It affects the hero CTAs,
  every `PageHero` breadcrumb, the whole footer, the pricing banner and the sticky call button. 1.4.11
  is a WCAG **2.1** criterion and the site publishes 2.0, so this does **not** falsify `/accessibility/` —
  but it is a stated internal target. The pair that works is a white ring on brand (**11.44:1**), and a
  fix must match `.on-dark:focus-visible, .on-dark :focus-visible` — the descendant selector alone
  misses the CTAs, where the class would land on the focusable element itself.
- **The mobile menu** (`components/Navbar.tsx`) is now complete, and that is a property to preserve, not
  a gap to re-report: `aria-expanded`, `aria-controls="mobile-menu"` and a state-dependent `aria-label`
  (`פתיחת/סגירת תפריט הניווט`) at `:109-111`, a **scroll lock** at `:20-27` that restores the previous
  `overflow` rather than assuming `""`, and at `:32-66` focus-into-panel on open, a **two-directional
  Tab trap**, an **Escape handler**, and **focus return to the trigger**. If you touch the header, keep
  all four — and copy this pattern into any new dropdown rather than inventing a thinner one.
- Tab order follows DOM order; in RTL that is still correct — don't reorder visually with CSS.

## Forms

`components/ContactForm.tsx` is the strongest part of the site's accessibility:

- Every field has a `<label htmlFor>`, and required fields are marked with a visible `*`.
- Errors are **per-field**, wired with `aria-invalid` and `aria-describedby`, and rendered next to the
  input.
- The phone field carries `dir="ltr"`, `inputMode="tel"` and `text-start` so the caret behaves in RTL.
- `noValidate` with custom Hebrew messages — the right call, and here the custom messages actually are
  per-field.
- **Focus moves to the first invalid field** on a failed submit (`:63-68`, with refs declared at
  `:51-53`). This shipped in Sprint 1 — don't re-report it as a gap.
- A polite live region (`role="status" aria-live="polite"`, `:100-103`) announces the error **count**
  without stealing focus, which is the SC 4.1.3 half that focus movement alone cannot cover.

What's still open here is narrow (finding A11Y-6): the live region's text is a pure function of
`errorCount`, so submitting twice with the same two errors writes identical content and an unchanged
live region announces nothing. Focus still moves, so nothing is lost — only the count is not repeated.
A submit counter folded into the announcement fixes it.

The one genuine contrast defect in this component is `placeholder:text-ink/40` at `:45` — see the
contrast section. `border-ink/20` on the five field states (`:119`, `:145`, `:169`, `:187`, `:208`) is
**1.49:1** against the white field interior, and the card behind it is `bg-paper` — a ~1.03:1
difference, so there is no implicit boundary to fall back on (finding A11Y-3, OPEN). That is SC
**1.4.11**, i.e. WCAG 2.1 only, so it does not falsify the published 2.0 statement; `border-ink/55`
(3.58 on white, 3.52 on paper) is the passing step **for a border**, where the bar is 3:1. Do not carry
that number back to text, where 4.5:1 applies and `/55` fails.

## Images and alt

- Meaningful Hebrew `alt` on content images; `alt=""` only for decorative.
- Icon-only links carry `aria-label`. **There are no social icons in the footer** — the `sameAs` links
  were purged 2026-08-17 and the footer is two labelled `<nav>` regions plus contact links. Don't cite
  Facebook/Instagram icons as an example; they do not exist.
- Decorative `lucide` icons carry `aria-hidden="true"` consistently — good, keep it.
- The old `alt={service.h1}` redundancy on service pages is **fixed**: `app/services/[slug]/page.tsx:81`
  now ships `alt=""` with a comment explaining why the illustration is decorative next to a heading that
  already names the service.
- Still open (finding A11Y-6): three decorative text nodes are announced because they carry no
  `aria-hidden` — the watermark numeral at `components/Process.tsx:52` (also `text-brand/10` ≈1.2:1,
  which cannot claim the decoration exemption while unmarked), and the bare `+` disclosure markers at
  `app/pricing/page.tsx:114` and `components/ArticleBody.tsx:122-125`. `components/Faq.tsx:29` shows the
  correct pattern.

## Tap targets and mobile

- 44×44px minimum for anything tappable, with adequate spacing. **Measure against the emitted CSS**
  (`--spacing: .25rem`, and the `text-*` line-height), never by eye.
- Already measured and passing: the menu trigger is `size-11` = exactly 44px (`Navbar.tsx:115`), the
  mobile menu links are 44px (`:139`), the sticky bar halves are 56px (`StickyContact.tsx`), the
  `size="lg"` CTAs are 52px, and the FAQ summaries are 64px.
- Still open (finding A11Y-4): the shared `md` size token at `components/CtaButton.tsx:11`
  (`px-5 py-2.5 text-sm`) measures **40px** — 10px + 10px padding around a 20px line box. It is visible
  on mobile at `Navbar.tsx:144`, `app/pricing/page.tsx:94`/`:97` and `app/not-found.tsx:14`/`:17`.
  44px is SC 2.5.5 (AAA in 2.1) and the AA bar in 2.2 is 2.5.8 at 24×24, which 40px clears — so this is
  drift against **our own** documented bar in `docs/mobile-ux-and-personalization.md` §"tap target", not
  a conformance break. `py-3` on that one token fixes all five call sites at once.
- **Test at 390×844** (the reference viewport for this site) and at 360px. The sticky bottom bar plus a
  sticky header eats vertical space on small phones — check that a form field is never trapped between
  them when the keyboard opens, and that `StickyContact` does not cover the footer's `/accessibility/`
  and `/privacy/` links.
- Text must reflow to 320px without horizontal scroll; zoom to 200% without loss of content.
- `docs/mobile-ux-and-personalization.md` is the source for the tap-target and thumb-zone bars; cite it
  by section rather than restating a number here.

## Motion

`app/globals.css` has a global `prefers-reduced-motion` block that neutralises animation and transition
durations and disables smooth scrolling. Confirm nothing bypasses it. There are no scroll-triggered
reveal animations on this site — content is never stranded at `opacity: 0`, which is correct progressive
enhancement and worth preserving.

## RTL

`<html lang="he" dir="rtl">`; LTR islands isolated with `dir="ltr"` on the element (there is no `.ltr`
helper class here). Full rules: `/hebrew-rtl`.

## Verify it in a browser — arithmetic is not a pass

Every contrast, focus-ring and tap-target number in this file was computed from CSS, and every keyboard
claim was read from source. **Nothing here has been rendered or tabbed through.** Colour maths cannot
see a ring clipped by `overflow: hidden`, a trap that breaks when the panel is empty, or a bar that
covers the footer. So before you sign off an accessibility pass:

1. Load `/`, `/contact/`, `/privacy/` and `/accessibility/` at **390×844** in a real browser (the `run`
   skill will start the dev server).
2. Tab through the header on mobile width: open the menu, Tab to the end, Shift+Tab back past the
   start, press Escape, confirm focus lands back on the trigger.
3. Submit the contact form empty and confirm focus lands in the first invalid field and the error count
   is announced. Submit it again unchanged and note whether anything is announced the second time.
4. With `StickyContact` rendered, scroll to the footer and confirm the `/accessibility/` and `/privacy/`
   links are both visible and tappable.
5. Zoom to 200% and reflow to 320px; confirm no horizontal scroll and nothing clipped.

Say in the report which of these you actually did. "Computed" and "verified" are different words.

## Checklist

- [ ] Every text/background pair computed at ≥4.5:1 (≥3:1 for large text and UI boundaries).
- [ ] No `text-ink/` step below **70** on text; no `placeholder:text-ink/` below 70 without a
      deliberate, recorded design decision.
- [ ] The six A11Y-1 call sites checked — `/accessibility/` and `/privacy/` first, since those two make
      the published statement false.
- [ ] One `<h1>`; heading order unbroken; landmarks present; skip link intact.
- [ ] No wrapper `<div>` between a list and its `<li>`s.
- [ ] Every interactive element keyboard-reachable with visible focus — including on `bg-brand`
      surfaces, where the `brand-light` ring is only 2.80:1.
- [ ] Menus: Escape closes, focus returns, `aria-expanded` + `aria-controls` set, scroll locked —
      all four already ship in `Navbar.tsx`; confirm you did not regress them.
- [ ] Form errors tied via `aria-describedby` + `aria-invalid`, focus moved to the first invalid field
      (both already ship), and the error-count live region still announces.
- [ ] Meaningful `alt`; icon-only controls have `aria-label`; decorative text nodes `aria-hidden`.
- [ ] 44px tap targets; 390×844 and 360px layouts clean; 200% zoom usable.
- [ ] `/accessibility/` still describes reality — and was re-dated only _after_ the fixes landed.
- [ ] The browser pass above actually ran, and the report says so.

## Gotchas

- The published statement claims correct contrast. Any contrast regression makes a legal-ish document
  false, which is a bigger problem than the pixel. Six such failures are live right now (A11Y-1).
- `accent` (`#FF6A3D`) is a decoration token. If you find yourself putting text on it, you want
  `accent-strong`. One place already breaks that rule and is worth a look before you touch the palette:
  `app/globals.css:51-54` sets `::selection` to white on `accent` — **2.85:1**. It is a selection
  highlight rather than page content, so triage it deliberately; don't quietly copy the pattern.
- Contrast bars differ by criterion. Text is 4.5:1 (SC 1.4.3, WCAG 2.0 — what we publish). Borders,
  focus rings and other non-text UI are 3:1 (SC 1.4.11, WCAG **2.1** — an internal target only). Never
  reuse a value that passed one bar to satisfy the other.
- Fixing contrast can change the visual brand. Flag it before shipping rather than after — and note that
  shipping here is the wrangler upload via `/deploy-thermoleak`, **not** a push to `main`. Pushing to
  `main` deploys nothing (CLAUDE.md §10).
