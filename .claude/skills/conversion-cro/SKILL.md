---
name: conversion-cro
description: Lead conversion on thermoleak — click-to-call above the fold, the hero's entity line, out-of-hours call link and four-problem selector (2026-11-13), the sticky mobile bar (its footer overlap fixed in Sprint 4), the WhatsApp-only contact form and its /thank-you/ handoff, data-cta hooks that exist but that nothing consumes, focus management, the shipped consent line, and the honest-trust-signal gate — the credentials row, never the guarantee beside it. Use when conversions are weak, a page is missing its CTAs, or the form needs work. Triggers "improve conversions", "CRO pass", "form validation", "thank you page", "add click-to-call", "why aren't leads tracked".
---

# Conversion

Three actions, in priority order: **phone call → WhatsApp → contact form.** The structural basics are
right, and the form's old failure path is closed. **Updated 2026-10-28:** the mobile layout defect
(the sticky bar over the footer's legal row) and the PII defect (SEC-3) were both fixed in Sprint 4,
and Sprint 6 wired the three conversion events a container cannot observe. What is left is that
**the container still measures only `page_view`** — the repo pushes `lead_whatsapp_open`,
`lead_handoff_blocked` and `thank_you_view`, but no GTM tag listens for them, and the four
`[data-cta]` click events have no trigger at all (`/tracking-analytics`, finding §13.5).

Mobile-specific rules — thumb zone, tap targets, bar height — come from
`docs/mobile-ux-and-personalization.md`; this skill is the funnel, that doc is the ergonomics.

## What already works — don't regress it

- `StickyContact` is a fixed bottom bar with call + WhatsApp, mobile-only.
- Click-to-call is above the fold on every page (navbar + hero), and the service pages carry a sticky
  sidebar with call + form CTAs, and since 2026-11-13 a `priceLink` into `/pricing/` under the price.
- **The hero, rebuilt 2026-11-13 (release 1)**, top to bottom: the eyebrow
  `{site.stats.years.value} {site.stats.years.label}` — «20+ שנות ניסיון בשטח», and «בשטח» is
  load-bearing (the founder's field experience; the company was founded 2015) — the slogan H1, the
  **entity line** `site.pitch` (brand + service + region, visible), call + WhatsApp, an
  **out-of-hours call link** (`site.emergencyNote` verbatim, the same `telHref`,
  `data-cta="hero-emergency-call"` — the only wording on file: no response time, no 24/7, no
  dispatch promise), the guarantee link to `/pricing/#guarantee`, and the **«מה הבעיה?» selector** —
  four server-rendered `min-h-11` links to the four service pages (`heroPicker` in `lib/services.ts`,
  `data-cta="hero-pick-{service slug}"`). «זמינות מהירה» and «ללא הרס מיותר» left the hero that day.
- **Trust row** (`components/TrustRow.tsx`): the three `site.credentials` and «מנפיקים חשבונית מס»,
  plus the field experience where no tile already shows it — under the hero as `TrustBar`'s second
  row, under the answer block on every service page, and on `/services/` and `/pricing/`. Plain text
  with a neutral check: no seals, and **never** `site.guarantee` (EEAT-6) or the electrician licence.
- `ContactForm` gets its `<select>` options as a `serviceOptions` prop from `ContactCTA` (`51c884d`):
  a client component no longer imports `lib/services.ts`, so service copy stops shipping as JS. Don't
  re-add that import.
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

## Gap 2 — the consent line: SHIPPED, and its promise holds since 2026-09-17

`ContactForm.tsx` renders the line under the button, in `text-ink/70` (the contrast floor — see
`/responsive-accessibility`), and it links to `/privacy/`. That part is done.

The line tells the visitor "הם אינם נשמרים אצלנו". It overstated while `/thank-you/` put the lead's
name and phone in a tagged href analytics could capture (findings **SEC-3 / AN-2**); that was fixed
2026-09-17 (Gap 6 below), so the claim is true again. Keep it true: never soften the line to cover a
new leak — fix the leak.

`/privacy/` no longer says the site "ייתכן" (may) use Google Analytics: it now names Google Tag
Manager and Google Analytics 4. That page is not this skill's to edit.

## Gap 3 — /thank-you/: SHIPPED

`app/thank-you/page.tsx` exists, is `robots: { index: false, follow: true }`, and is deliberately
absent from `app/sitemap.ts`. It states what happens next, offers a call as the immediate second
touch, and handles the popup-blocked case.

**The conversion it was built for still does not fire.** `/thank-you/` is reached only by
`router.push` — a client-side navigation with no document load — so a page-load trigger records
nothing. See `/tracking-analytics` §"Client-side routing is real here".

## Gap 4 — focus management: SHIPPED

Focus moves to the first invalid field on a failed submit (`ContactForm.tsx`, the `nameRef` /
`phoneRef` / `areaRef` focus calls) and to the `/thank-you/` heading after navigation
(`ThankYouContent.tsx`, `headingRef`, `tabIndex={-1}` on the `<h1>`).
Both matter more on a phone than on a desktop. Don't remove either.

## Gap 5 — the sticky bar over the footer's legal row on mobile: FIXED in Sprint 4 (finding cro-1)

The spacer used to sit on `<main>` (`pb-20 md:pb-0`) while `<Footer />` is a **sibling of `<main>`,
not inside it**, so it did nothing at the end of the document, and the fixed `StickyContact` bar
covered the footer's bottom row — the הצהרת נגישות and מדיניות פרטיות links. That was a compliance
problem, not a cosmetic one: the accessibility-statement link exists **only** in the footer, and the
site publishes an IS 5568 statement.

Now `components/Footer.tsx` carries `pb-20 md:pb-0` on the `<footer>` itself, `app/layout.tsx` has a
comment saying the spacer belongs there, and `StickyContact` adds `pb-[env(safe-area-inset-bottom)]`
so a notched iPhone's home indicator no longer eats the CTAs' tap area. Don't move the spacer back.

## Gap 6 — `data-cta`: the hooks exist, nothing consumes them

The attribute inventory shipped on 2026-08-24 (backlog §13.2). `Navbar`, `Hero`, `StickyContact`,
`ContactCTA`, `Footer`, `ContactForm` and `ThankYouContent` all carry `data-cta` values, some
literal and some via `CtaButton`'s `dataCta` prop, following `{location}-{action}`. Release 1
(2026-11-13) added five, all in the hero: `hero-emergency-call` and
`hero-pick-{water-leak-detection|moisture-detection|electrical-thermography|insurance-reports}` (the
last four built from `heroPicker`, so `grep 'data-cta="'` on the source shows a template literal, not
the four values — read them in `out/index.html`). The new in-copy link blocks (`LinkLead`,
`LinkedText`, `CityChips`) and the hero's guarantee link carry no `data-cta`: they are navigation, not
a contact action.

**Do not re-add attributes that already exist, and do not trust any count in a doc.** Re-grep:

```bash
grep -rho 'data-cta="[^"]*"' app components | sort -u
grep -rn 'dataCta="\|data-cta={' app components
grep -rho 'data-cta="[^"]*"' out --include=index.html | sort -u   # the built set, templates expanded
grep -rn 'telHref\|whatsappHref(\|mailHref' app components | grep -v 'data-cta\|dataCta\|import'
```

Two things are genuinely open:

1. **Nothing reads them.** The container has zero click triggers, so every CTA *click* on this site
   is still unmeasured (finding §13.5) — `call_click`, the number-one conversion goal, included.
   **Note what changed 2026-10-28:** the repo is no longer silent. `lib/analytics.ts` pushes three
   events from code, so "the repo has zero `dataLayer` pushes" is no longer true. Those three are
   deliberately the only ones in code — the click events belong in the container, because two
   sources for one click produce two numbers. The gap is the container, not the attributes.
2. **The newer silos have no attribution of their own.** `/guides/` and `/locations/` shipped after
   the inventory, and their CTAs come from the shared components — so a click from a location page is
   indistinguishable from one anywhere else. If per-silo attribution matters, that needs
   `location-*` / `guide-*` values, which do not exist. Whether you need them is a judgement call;
   decide it deliberately rather than assuming coverage is complete.

**The `thankyou-whatsapp` trap is CLOSED — do not treat it as a blocker (SEC-3 / AN-2, fixed
2026-09-17).** That anchor used to carry the visitor's name and phone in its `href`. It now renders
the generic `whatsappHref()` and opens the prefilled conversation from an `onClick`, so the personal
URL never enters the DOM. **A `[data-cta]` click trigger is safe to build**, and nothing in the repo
is still waiting on this. Two standing rules remain: read `data-cta`, **never** Click URL; and any new
control needing personal data in a URL builds it at click time, never in an attribute.

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
  10+ years — the business's age), «20+ שנות ניסיון בשטח» (the founder's field experience, never the
  company's age), the three `site.credentials` (the FLIR E8 camera, third-party insurance, a team of
  two technicians), tax invoices, the non-destructive method, the ₪350 start with `site.visitScope`,
  the 3-day written-report turnaround, the founder's name, and the guarantee's **confirmed** terms.
  Nothing else. The report is a written report **ordered separately** — a visit gives the findings
  verbally — and it is "organised for submission", never "accepted by insurers" (business-facts §H).
  The electrician licence is stated in text on the panel page only, never as a badge or a trust-row
  item (§H). The typical visit length «כשעה» is published, but its source is still an open §H row.
- **The guarantee is now your strongest asset — use the published terms.** `לא מצאנו — לא שילמתם`
  has a confirmed scope, exclusions and a no-call-out-fee clause in `site.guaranteeTerms`, rendered
  by `components/GuaranteeTerms.tsx`. A precisely bounded promise converts better than a vague one.
  Render it from that object; never paraphrase it into marketing copy.
- **Still unconfirmed — never present as fact:** accepted payment methods, the insurer's name and
  coverage amount, and the open §H rows — the licence's holder, level and number; whether ₪350 is also
  the floor for a panel scan or a report; a return visit's price; «ליווי בהגשה»; and the rest of that
  table. (The ₪350 start, the turnaround and third-party insurance were confirmed 2026-09-17 —
  re-gating them is as wrong as inventing them.) **Confirmed absent**, never to be filled: a ח.פ. or
  company registration, a thermography certificate, an accessibility coordinator.

## Checklist

- [ ] Call and WhatsApp reachable without scrolling on every page, mobile and desktop.
- [ ] The hero keeps its entity line, the out-of-hours link in `site.emergencyNote`'s exact words and
      the four-problem selector, every target ≥44 px; the trust row never shows the guarantee.
- [ ] New routes render `ContactCTA` and carry `data-cta` values (re-grep; don't assume).
- [ ] No tagged CTA href can contain a visitor's name, phone or message text.
- [ ] The form still cannot show success when the WhatsApp handoff didn't happen.
- [ ] Focus still moves to the first invalid field on error, and to the heading on `/thank-you/`.
- [ ] The consent line still links to `/privacy/` and stays at the contrast floor.
- [ ] The sticky bar does not cover the footer's accessibility and privacy links on mobile.
- [ ] No trust signal on the page that `docs/business-facts.md` doesn't confirm.
