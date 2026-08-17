---
name: responsive-accessibility
description: WCAG 2.0 AA and Israeli IS 5568 compliance for thermoleak — the computed contrast table and the one live text-ink/50 failure, 44px tap targets, keyboard and focus order, the mobile menu's missing Escape and focus trap, semantic landmarks and one H1, form labelling and focus management, reduced motion, and keeping /accessibility/ truthful. Use before shipping or when auditing accessibility. Triggers "accessibility pass", "WCAG", "contrast check", "tap targets", "keyboard navigation", "נגישות", "IS 5568".
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

Tokens from `app/globals.css`:

| Pair                                | Ratio      | Verdict                                          |
| ----------------------------------- | ---------- | ------------------------------------------------ |
| `brand` `#0B3D5C` on white          | ≈ **11.4:1** | ✅ excellent                                    |
| `ink` `#1B2733` on white            | ≈ **14:1**   | ✅                                              |
| `accent-strong` `#C2410C` + white   | ≈ **5.2:1**  | ✅ — this is why it is the CTA colour           |
| `text-ink/70` on white              | ≈ **5.7:1**  | ✅ the safe body-secondary step                 |
| `brand-light` `#1E88A8` + white     | ≈ **4.1:1**  | ❌ normal text · ✅ as the focus ring (UI, 3:1) |
| `accent` `#FF6A3D` on white         | ≈ **2.8:1**  | ❌ **decorative only — never text**             |
| `text-ink/50` on white              | ≈ **3.1:1**  | ❌ **live failure**                             |

The token set is deliberately and correctly split — `accent` for decoration, `accent-strong` for
anything carrying white text. `CLAUDE.md` documents that split. The failure is not in the tokens; it is
at one call site.

**The live failure:** `components/ContactForm.tsx:208` — the helper line under the submit button,
`text-center text-xs text-ink/50`. Small text is exactly where AA is strictest. Change it to
`text-ink/70`.

**The statement conflict:** `/accessibility/` explicitly claims
"שמירה על ניגודיות צבעים תקינה בין הטקסט לרקע". While that line above stands, the statement is
inaccurate. Fix the contrast rather than editing the statement down.

Recompute against the **real background**, not against white by default — the footer is `bg-brand`, so
`text-white/70` there is a different calculation (and passes comfortably).

## Semantics

- **One `<h1>` per page** — currently correct on all 13 emitted pages. Heading order unbroken.
- Landmarks: `header`, `nav` (with `aria-label`), `main#main`, `footer` — all present. The footer has
  two labelled `<nav>` regions (`שירותים`, `ניווט`), which is the right pattern.
- A **skip link** ships in `app/layout.tsx` (`דלג לתוכן המרכזי`), visible on focus. Don't remove it.
- Real `<button>` / `<a>`, never a clickable `div`.
- Watch for wrapper components interposed between a list and its `<li>`s — it breaks list semantics.
  The service page's `<ol>` of steps is currently correct.

## Keyboard

- **Focus is styled globally** in `app/globals.css`: `:focus-visible` gets a 3px `brand-light` outline
  with a 2px offset. That is a UI-component contrast case (3:1 required) and `brand-light` clears it.
  Don't remove or override it away.
- **The mobile menu** (`components/Navbar.tsx`) is better than most: it has `aria-expanded`,
  `aria-controls="mobile-menu"`, and a state-dependent `aria-label`
  (`פתיחת/סגירת תפריט הניווט`). What it lacks: **no Escape handler, no focus trap, no scroll lock, and
  no focus return to the trigger** on close. It closes only via each link's `onClick`. Fix these when
  you touch the header — and don't copy the pattern into a new dropdown.
- Tab order follows DOM order; in RTL that is still correct — don't reorder visually with CSS.

## Forms

`components/ContactForm.tsx` is the strongest part of the site's accessibility:

- Every field has a `<label htmlFor>`, and required fields are marked with a visible `*`.
- Errors are **per-field**, wired with `aria-invalid` and `aria-describedby`, and rendered next to the
  input.
- The phone field carries `dir="ltr"`, `inputMode="tel"` and `text-start` so the caret behaves in RTL.
- `noValidate` with custom Hebrew messages — the right call, and here the custom messages actually are
  per-field.

What's missing: **focus never moves to the first invalid field** on a failed submit, and the success
panel (`role="status"`) replaces the form with no focus move either. Both are small additions and both
matter more on a phone.

## Images and alt

- Meaningful Hebrew `alt` on content images; `alt=""` only for decorative.
- Icon-only links carry `aria-label` (the footer's Facebook and Instagram icons do).
- Decorative `lucide` icons carry `aria-hidden="true"` consistently — good, keep it.
- One redundancy worth noting: `app/services/[slug]/page.tsx` uses `service.h1` as the image `alt`, so a
  screen-reader user hears the page heading twice. Not a violation; worth improving to describe the
  image.

## Tap targets and mobile

- 44×44px minimum for anything tappable, with adequate spacing. The mobile menu button is `p-2` around a
  24px icon — measure it rather than assuming; it is close to the line.
- Test at 360px. The sticky bottom bar plus a sticky header eats vertical space on small phones —
  check that a form field is never trapped between them when the keyboard opens.
- Text must reflow to 320px without horizontal scroll; zoom to 200% without loss of content.

## Motion

`app/globals.css` has a global `prefers-reduced-motion` block that neutralises animation and transition
durations and disables smooth scrolling. Confirm nothing bypasses it. There are no scroll-triggered
reveal animations on this site — content is never stranded at `opacity: 0`, which is correct progressive
enhancement and worth preserving.

## RTL

`<html lang="he" dir="rtl">`; LTR islands isolated with `dir="ltr"` on the element (there is no `.ltr`
helper class here). Full rules: `/hebrew-rtl`.

## Checklist

- [ ] Every text/background pair computed at ≥4.5:1 (≥3:1 for large text and UI boundaries).
- [ ] `text-ink/50` no longer used for body or helper text.
- [ ] One `<h1>`; heading order unbroken; landmarks present; skip link intact.
- [ ] No wrapper `<div>` between a list and its `<li>`s.
- [ ] Every interactive element keyboard-reachable with visible focus.
- [ ] Menus: Escape closes, focus returns, `aria-expanded` + `aria-controls` set, scroll locked.
- [ ] Form errors tied via `aria-describedby` + `aria-invalid`, focus moved to the first invalid field.
- [ ] Meaningful `alt`; icon-only controls have `aria-label`.
- [ ] 44px tap targets; 360px layout clean; 200% zoom usable.
- [ ] `/accessibility/` still describes reality.

## Gotchas

- The published statement claims correct contrast. Any contrast regression makes a legal-ish document
  false, which is a bigger problem than the pixel.
- `accent` (`#FF6A3D`) is a decoration token. If you find yourself putting text on it, you want
  `accent-strong`.
- Fixing contrast can change the visual brand. Flag it before shipping rather than after — and remember
  that on this repo, shipping means pushing to `main`.
