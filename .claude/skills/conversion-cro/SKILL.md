---
name: conversion-cro
description: Lead conversion on thermoleak — click-to-call above the fold, the sticky mobile bar, the WhatsApp-only contact form and its silent-failure mode, a real thank-you route, data-cta coverage for the analytics that don't exist yet, form focus management, a consent line, and the honest-trust-signal gate. Use when conversions are weak, a page is missing its CTAs, or the form needs work. Triggers "improve conversions", "CRO pass", "form validation", "thank you page", "add click-to-call", "why aren't leads tracked".
---

# Conversion

Three actions, in priority order: **phone call → WhatsApp → contact form.** The structural basics are
right; the gaps are in the form's failure path and in measurement — of which there is currently none.

## What already works — don't regress it

- `StickyContact` is a fixed bottom bar with call + WhatsApp, mobile-only, and `app/layout.tsx` gives
  `<main>` a `pb-20 md:pb-0` spacer so it never covers the footer.
- Click-to-call is above the fold on every page (navbar + hero), and the service pages carry a sticky
  sidebar with call + form CTAs.
- `ContactForm` validation is genuinely good: per-field errors, `aria-invalid`, `aria-describedby`, and
  an Israeli phone pattern (`/^0\d{8,9}$/` after stripping dashes and spaces) that accepts what real
  customers type.
- Every service page ends with `ContactCTA`, and so does the homepage.
- The FAQ answers ship in the DOM — a visitor never has to wait for JS to read them.

## Gap 1 — the form has no failure path (backlog §8.1)

`ContactForm.handleSubmit` builds a Hebrew message and calls:

```ts
window.open(whatsappHref(lines.join("\n")), "_blank", "noopener,noreferrer");
setSubmitted(true);
```

Then it renders a success state — **unconditionally**. `window.open` returns `null` when a popup
blocker intervenes, and the visitor has no WhatsApp client on many desktops. In both cases the person
sees "הפנייה מוכנה לשליחה בוואטסאפ" and **the lead is gone**. The success copy does mention the phone
number as a fallback, which softens it, but the state is still a lie about what happened.

This is the inverse of the usual arrangement: most lead-gen sites POST and fall back to WhatsApp; this
one has only the fallback. Options, in order of preference:

1. Check the `window.open` return value and render a distinct state when it is `null` — show the
   prefilled message as copyable text plus a `tel:` button.
2. Add a real submission endpoint so the lead exists server-side regardless of what WhatsApp does.
   Note the roster records `formAccessKey: null` **by design** — this site is deliberately not on
   Web3Forms like its nine fleet siblings, so adding one is a decision, not a fix.

Either way, don't leave the success state unconditional.

## Gap 2 — no consent line (backlog §8.4)

The form collects name, phone, area and free text. `/privacy/` exists and is substantive, but the form
never links to it. The helper line under the button says
"לא נשמור פרטים ללא הסכמתכם" — which is a claim, not a link. Add a short line linking to
`/privacy/`. A checkbox adds friction; prefer a clear inline statement unless the owner asks for
explicit opt-in.

That same line is `text-xs text-ink/50` — **≈3.1:1 contrast, an AA failure** (backlog §11.1). Whatever
you write there, write it in `text-ink/70`.

## Gap 3 — no thank-you URL (backlog §8.2)

Success is an inline state swap, so **there is no URL-based conversion to count**, no place to send a
next step, and no clean Google Ads conversion target for when tracking lands.

Add `/thank-you/` as a real route:

- The form navigates there on confirmed success.
- It states what happens next and when.
- It offers a phone call as an immediate second touch.
- `noindex` it — thin, and a stray SERP entry inflates conversion counts.

## Gap 4 — focus management

On a failed submit, errors render correctly but **focus never moves to the first invalid field**. On
success, the `role="status"` panel replaces the form with no focus move either. Both are one `ref` and
one `useEffect` away, and both matter more on a phone than on a desktop.

## Gap 5 — `data-cta` coverage (backlog §13.2)

**Not a single CTA on the site carries a `data-cta` attribute** — because there is no analytics
container to consume one (see `/tracking-analytics`). That is a chicken-and-egg trap: the day GTM is
installed, every click trigger has to be built from CSS selectors that break on the next refactor.

Add the attribute now, following `{location}-{action}`:

| Element                            | Attribute            |
| ---------------------------------- | -------------------- |
| Navbar call button                 | `header-call`        |
| Hero call / WhatsApp               | `hero-call` / `hero-whatsapp` |
| Sticky bar call / WhatsApp         | `sticky-call` / `sticky-whatsapp` |
| `ContactCTA` call / WhatsApp / email | `finalcta-*`       |
| Service sidebar call               | `service-call`       |
| Form submit (WhatsApp)             | `form-whatsapp`      |
| Footer call / WhatsApp / email     | `footer-*`           |

It costs nothing today and saves a full CRO cycle later.

## Gap 6 — page-level CTA coverage

`ContactCTA` ships on the homepage and every service page. Verify `/about/`, `/reviews/` and
`/services/` also offer a call and a WhatsApp action without scrolling back up — `/reviews/` in
particular is a high-intent page (someone reading testimonials is close to calling).

## The trust gate — read this before any "urgency" work

Conversion work that adds pressure without adding proof makes the page worse. Before adding urgency
copy, badges or counters, check `docs/business-facts.md`:

- **The site already ships six invented testimonials and a 4.9 rating computed from them.** That is the
  highest-value CRO problem on the site and it is negative-value right now: it is a Google policy
  violation, and a visitor who suspects a review is fake discounts everything else on the page. The fix
  is real reviews, not better fake ones. Escalate; do not extend.
- **No invented urgency**: no "X customers this month", no countdown timers, no fabricated scarcity.
- `97% איתור כבר בביקור הראשון` and `3,000+ בתים ועסקים` are unverified (§7.2). They are currently
  rendered as trust signals in `TrustBar`. Confirm or soften them.
- The `לא מצאנו — לא שילמתם` guarantee is the strongest conversion asset the site has **and** has no
  stated scope or exclusions. Defining it precisely would raise conversion and reduce disputes at once.

## Checklist

- [ ] Call and WhatsApp reachable without scrolling on every page, mobile and desktop.
- [ ] Every CTA carries a `data-cta` following `{location}-{action}`.
- [ ] The form never shows success when the WhatsApp handoff didn't happen.
- [ ] Focus moves to the first invalid field on error, and to the confirmation on success.
- [ ] Consent line present, linked to `/privacy/`, and in a passing contrast step.
- [ ] `/thank-you/` exists, is `noindex`, and offers a next step.
- [ ] No trust signal on the page that `docs/business-facts.md` doesn't confirm.
