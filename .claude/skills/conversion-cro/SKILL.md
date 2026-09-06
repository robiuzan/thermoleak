---
name: conversion-cro
description: Lead conversion on thermoleak — click-to-call above the fold, the sticky mobile bar and the footer row it currently covers, the WhatsApp-only contact form and its /thank-you/ handoff, data-cta hooks that exist but that nothing consumes, focus management, the shipped consent line, and the honest-trust-signal gate. Use when conversions are weak, a page is missing its CTAs, or the form needs work. Triggers "improve conversions", "CRO pass", "form validation", "thank you page", "add click-to-call", "why aren't leads tracked".
---

# Conversion

Three actions, in priority order: **phone call → WhatsApp → contact form.** The structural basics are
right, and the form's old failure path is closed. What is left is one mobile layout defect, one PII
defect, and the fact that **nothing measures any of it yet** — the container ships but no conversion
event fires (`/tracking-analytics`, finding AN-1).

Mobile-specific rules — thumb zone, tap targets, bar height — come from
`docs/mobile-ux-and-personalization.md`; this skill is the funnel, that doc is the ergonomics.

## What already works — don't regress it

- `StickyContact` is a fixed bottom bar with call + WhatsApp, mobile-only.
- Click-to-call is above the fold on every page (navbar + hero), and the service pages carry a sticky
  sidebar with call + form CTAs.
- `ContactForm` validation is genuinely good: per-field errors, `aria-invalid`, `aria-describedby`,
  an Israeli phone pattern (`/^0\d{8,9}$/` after stripping dashes and spaces) that accepts what real
  customers type, **and** focus moves to the first invalid field with a `role="status"` error count
  announced politely.
- The form's WhatsApp handoff can no longer fail silently — see gap 1.
- `/thank-you/` is a real route: `noindex`, out of the sitemap, focus moved to its heading, with a
  re-open control and a phone CTA.
- `ContactCTA` ships on the homepage, both hubs, and every service, guide and location page.
- The FAQ answers ship in the DOM — a visitor never has to wait for JS to read them.

## Gap 1 — the form's failure path: CLOSED 2026-08-24, keep it that way

`ContactForm.handleSubmit` no longer renders an unconditional success state. It now:

```ts
const win = window.open(whatsappHref(message), "_blank");
if (win) win.opener = null;
sessionStorage.setItem(
  LEAD_HANDOFF_KEY,
  JSON.stringify({ message, opened: win !== null }),
);
router.push("/thank-you/");
```

`ThankYouContent` reads that handoff back and, when `opened` is false, renders an explicit
popup-blocked panel with a manual re-open button. So a blocked popup can no longer lose the lead
(backlog §8.1).

**Two things to preserve if you touch this:** the `opened` flag is the only observation of whether
the handoff happened — it is not in `dataLayer`, so any event that reports handoff success must be
pushed from this component (see `/tracking-analytics`). And the site still has **no server-side
record of a lead**; the roster records `formAccessKey: null` **by design**, so adding a real
endpoint is a decision for the owner, not a bug fix.

## Gap 2 — the consent line: SHIPPED, but its promise is currently false

`ContactForm.tsx:220-226` renders the line under the button, in `text-ink/70` (the contrast floor —
see `/responsive-accessibility`), and it links to `/privacy/`. That part is done.

**The problem is the claim, not the markup.** It tells the visitor
"הם אינם נשמרים אצלנו" while `/thank-you/` renders the lead's name and phone inside a link href that
analytics can capture (findings **SEC-3 / AN-2**, open). Until that href is fixed, the line
overstates. Do not soften the line to cover the defect — fix the defect.

Separately, `/privacy/` still says the site "ייתכן" (may) use Google Analytics. GA4 definitively
ships. That page is not this skill's to edit, but do not cite it as accurate.

## Gap 3 — /thank-you/: SHIPPED

`app/thank-you/page.tsx` exists, is `robots: { index: false, follow: true }`, and is deliberately
absent from `app/sitemap.ts`. It states what happens next, offers a call as the immediate second
touch, and handles the popup-blocked case.

**The conversion it was built for still does not fire.** `/thank-you/` is reached only by
`router.push` — a client-side navigation with no document load — so a page-load trigger records
nothing. See `/tracking-analytics` §"Client-side routing is real here".

## Gap 4 — focus management: SHIPPED

Focus moves to the first invalid field on a failed submit (`ContactForm.tsx:64-67`) and to the
`/thank-you/` heading after navigation (`ThankYouContent.tsx:49-53`, `tabIndex={-1}` on the `<h1>`).
Both matter more on a phone than on a desktop. Don't remove either.

## Gap 5 — the sticky bar covers the footer's legal row on mobile (OPEN, finding cro-1)

`app/layout.tsx:88` puts `pb-20 md:pb-0` on `<main>` — but `<Footer />` is a **sibling of `<main>`,
not inside it** (`:91`), so that padding ends before the footer begins and does nothing at the end of
the document. `StickyContact` is `fixed inset-x-0 bottom-0`, so on mobile it sits on top of the
footer's bottom row — the הצהרת נגישות and מדיניות פרטיות links — which become unreadable and
untappable, because a tap there hits the call/WhatsApp buttons instead.

That is a compliance problem, not a cosmetic one: the accessibility-statement link exists **only** in
the footer, and the site publishes an IS 5568 statement.

The fix is a code change (move the spacer onto the `<footer>`, and add
`pb-[env(safe-area-inset-bottom)]` to the bar so a notched iPhone's home indicator stops eating the
CTAs' tap area). Until it lands, **do not describe the spacer as working** — several docs did.

## Gap 6 — `data-cta`: the hooks exist, nothing consumes them

The attribute inventory shipped on 2026-08-24 (backlog §13.2). `Navbar`, `Hero`, `StickyContact`,
`ContactCTA`, `Footer`, `ContactForm` and `ThankYouContent` all carry `data-cta` values, some
literal and some via `CtaButton`'s `dataCta` prop, following `{location}-{action}`.

**Do not re-add attributes that already exist, and do not trust any count in a doc.** Re-grep:

```bash
grep -rho 'data-cta="[^"]*"' app components | sort -u
grep -rn 'dataCta="' app components
grep -rn 'telHref\|whatsappHref(\|mailHref' app components | grep -v 'data-cta\|dataCta\|import'
```

Two things are genuinely open:

1. **Nothing reads them.** The container has zero click triggers and the repo has zero `dataLayer`
   pushes, so every CTA click on this site is unmeasured (finding AN-1). That is the real gap — not
   the attributes.
2. **The newer silos have no attribution of their own.** `/guides/` and `/locations/` shipped after
   the inventory, and their CTAs come from the shared components — so a click from a location page is
   indistinguishable from one anywhere else. If per-silo attribution matters, that needs
   `location-*` / `guide-*` values, which do not exist. Whether you need them is a judgement call;
   decide it deliberately rather than assuming coverage is complete.

**One attribute is a trap:** `data-cta="thankyou-whatsapp"` sits on a link whose href contains the
visitor's name and phone. Never put it in a click trigger until that href is fixed
(`/tracking-analytics`, findings SEC-3 / AN-2).

## Gap 7 — page-level CTA coverage

`ContactCTA` ships on `/`, `/services/`, every service page, `/pricing/`, `/guides/` and each guide,
`/locations/` and each location page, `/about/` and `/contact/`. When you add a route, add it there
too — a page a visitor can reach and not act from is a leak.

`/reviews/` no longer exists: it was removed on 2026-08-17 and `public/_redirects` 301s it to
`/about/`. Do not reintroduce it, or plan CTAs for it, until real sourced reviews exist.

## The trust gate — read this before any "urgency" work

Conversion work that adds pressure without adding proof makes the page worse. Before adding urgency
copy, badges or counters, check `docs/business-facts.md`:

- **The fabricated testimonials and the rating computed from them were removed on 2026-08-17**, along
  with the unverifiable job-count and success-rate tiles that used to sit in `TrustBar`. That purge
  is a standing gate, not a one-off cleanup: reintroducing any of it — including as sample or
  placeholder data — is a stop-ship, and a Google policy violation. The legitimate route to review
  content is a Google Business Profile (`docs/business-facts.md` §B).
- **No invented urgency**: no "X customers this month", no countdown timers, no fabricated scarcity.
- **What you may state as trust signals** is exactly what `lib/site.ts` carries: founded 2015 (hence
  10+ years), the typical visit length, the non-destructive method, the report, the founder's name,
  and the guarantee's **confirmed** terms. Nothing else.
- **The guarantee is now your strongest asset — use the published terms.** `לא מצאנו — לא שילמתם`
  has a confirmed scope, exclusions and a no-call-out-fee clause in `site.guaranteeTerms`, rendered
  by `components/GuaranteeTerms.tsx`. A precisely bounded promise converts better than a vague one.
  Render it from that object; never paraphrase it into marketing copy.
- **Still unconfirmed — never present as fact:** the ₪450 starting price (`site.priceFrom` carries a
  `🔶 confirm` marker and is still rendered on `/pricing/`), certifications, insurance, report
  turnaround, and every other row `docs/business-facts.md` leaves open.

## Checklist

- [ ] Call and WhatsApp reachable without scrolling on every page, mobile and desktop.
- [ ] New routes render `ContactCTA` and carry `data-cta` values (re-grep; don't assume).
- [ ] No tagged CTA href can contain a visitor's name, phone or message text.
- [ ] The form still cannot show success when the WhatsApp handoff didn't happen.
- [ ] Focus still moves to the first invalid field on error, and to the heading on `/thank-you/`.
- [ ] The consent line still links to `/privacy/` and stays at the contrast floor.
- [ ] The sticky bar does not cover the footer's accessibility and privacy links on mobile.
- [ ] No trust signal on the page that `docs/business-facts.md` doesn't confirm.
