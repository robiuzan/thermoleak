# Mobile UX and personalisation

The primary device for this business is a phone held one-handed by someone standing in front of a
damp wall. Design for that person first; the desktop layout is the adaptation, not the origin.

---

## 1. Why mobile-first is literal here

The buying context is unusual and it should drive every layout decision:

- **The visitor is physically at the problem**, often in a bathroom, kitchen or stairwell — poor
  light, poor signal, one hand occupied.
- **Intent is immediate.** They are not comparing five providers; they want someone competent on the
  phone now.
- **The conversion is a phone call**, which the device natively supports. `tel:` is not a fallback
  here, it is the primary product surface.

Consequence: **time-to-first-tap matters more than time-on-page.** A design that increases scroll
depth at the cost of reaching a call button is a worse design.

---

## 2. The thumb zone

On a one-handed grip the screen divides into three reachability bands:

```
┌─────────────────────────┐
│  HARD    (stretch)      │  ← top ~25%: logo, breadcrumbs, H1, hero image
│                         │     never put a primary action here alone
├─────────────────────────┤
│  OK      (natural)      │  ← middle: reading content, secondary links
│                         │
├─────────────────────────┤
│  EASY    (thumb arc)    │  ← bottom ~30%: PRIMARY ACTIONS LIVE HERE
└─────────────────────────┘     the sticky bar occupies exactly this band
```

### Rules

| Rule                             | Value                      | Why                                                                                                                                                                                                                                                                                                                      |
| -------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Primary CTA in the bottom band   | always reachable           | `StickyContact` is fixed bottom, mobile-only ✅ — but see the broken spacer below                                                                                                                                                                                                                                        |
| Minimum tap target               | **44 × 44 px**             | An internal bar, not a conformance line: 44px is WCAG **2.5.5 (AAA)**; the AA criterion is 2.5.8 at 24 × 24. Two things sit under 44: the menu button (`p-2` + 24 px icon) and the shared `CtaButton` `md` size (`px-5 py-2.5 text-sm` ≈ 40 px tall), which is the one that repeats across every page — **measure both** |
| Spacing between adjacent targets | ≥ 8 px                     | Prevents mis-taps on the two-up sticky bar                                                                                                                                                                                                                                                                               |
| Destructive/irreversible actions | **not** in the thumb arc   | Nothing here qualifies today; keep it that way                                                                                                                                                                                                                                                                           |
| Form submit                      | full-width, bottom of form | ✅ shipped                                                                                                                                                                                                                                                                                                               |

### The sticky bar contract — currently broken

`StickyContact` is a 50/50 call/WhatsApp bar, `md:hidden`, fixed bottom. It is supposed to come with
a spacer that keeps it from covering the end of the document.

**The spacer is on the wrong element, and the bar permanently covers the footer's legal links**
(open — cro-1). `pb-20 md:pb-0` sits on `<main>` in `app/layout.tsx`, but `<Footer>` and
`<StickyContact>` are _siblings after_ `<main>` — so the padding opens 80px of whitespace between
the content and the footer and adds nothing at the end of the page. A `position: fixed; bottom: 0`
element always occupies the last band of the viewport, which at full scroll is the last band of the
document: the footer's bottom padding plus its entire legal-links row. On mobile, הצהרת נגישות and
מדיניות פרטיות are therefore hidden behind the bar and untappable — a tap in that region hits the
call button instead.

**This is a compliance problem, not a cosmetic one**, and worse than the original wording assumed:
`components/Footer.tsx` holds the **only** link to `/accessibility/` on the entire site — it is not
in `navLinks` — so the published IS 5568 statement is unreachable on the primary device.

The contract that has to hold: **the reserved space must sit at the end of the document flow**, not
in the middle of it — on the `<footer>` (or its bottom bar), or on `<body>` — never on `<main>`,
which the footer follows. Whoever fixes it should add `env(safe-area-inset-bottom)` in the same
pass; the bar carries none, so on a notched phone the home-indicator strip eats into both CTAs' tap
area too.

**Both halves stay load-bearing.** Removing the bar removes the primary conversion path on the
primary device; removing (or misplacing) the spacer occludes the footer, as it does today.

It must also: never overlap an open keyboard's input, never trap focus, and stay out of the tab
order's way (it comes last in DOM order — correct).

---

## 3. Mobile layout rules

- **Test at 360 px**, not 375 px. And verify **320 px reflow** (WCAG 1.4.10) — no horizontal scroll.
- **Wide content scrolls in its own container.** Tables (the pricing grid), code blocks and any
  future comparison matrix get `overflow-x: auto` on a wrapper; the page body never scrolls
  sideways.
- **Sticky header + sticky bottom bar eats vertical space.** On a small phone with the keyboard
  open, a mid-form field can be squeezed between them — check that the focused input is always
  scrolled into view.
- **Stack, do not shrink.** Two columns at 360 px is two unreadable columns.
- **Above the fold on mobile = the answer plus an action.** H1, one-line value statement, answer
  block, call affordance. Narrative comes after. The service pages meet this today — H1, tagline,
  answer block, with the sticky bar pinned to the viewport. Moving the price/CTA card above the FAQ
  on those pages is a legitimate **CRO experiment**, not a breach of this rule; treat it as
  something to test, not something to fix.
- **Tap-friendly forms**: `inputMode="tel"` on the phone field (✅), `autocomplete` on every field
  (✅ — also WCAG 1.3.5), and never a placeholder standing in for a label.

---

## 4. Personalisation and geolocation — read this before building it

**Status: none of this is built, nothing here is scheduled, and that is the right answer for now.**
No geo detection, no location-aware UI, no `localStorage` anywhere — the repo's only browser storage
is the `sessionStorage` handoff between the contact form and `/thank-you/`, which is a form flow,
not personalisation.
This section exists to answer the question when it is asked again — and the answer is still no, for
the reasons below, and also because the cheaper wins are not taken yet: the sticky bar covers the
footer (§2), conversions are unmeasured, and three of the six flagship guide topics are unwritten.
Personalisation is what you build when the fundamentals are done; here they are not.

The request is dynamic content swapping by visitor location. **My architectural recommendation is
to do very little of this, and here is the honest reasoning.**

### Why content-level geo personalisation is the wrong tool here

1. **There is no server.** `output: "export"` on Cloudflare Pages means every HTML response is a
   static file. Server-side geo requires either a Pages Function or a Worker on the HTML path,
   which converts a free, edge-cached static asset into a per-request function invocation — a
   direct TTFB and cost regression against
   [performance-guidelines.md](performance-guidelines.md) §1.
2. **It fragments the cache.** Personalised HTML must vary by geo, so one cached page becomes N.
   Both TTFB and cache-hit ratio degrade.
3. **It is cloaking-adjacent.** Serving materially different content to a visitor than to Googlebot
   (which crawls from a US IP) risks the exact "different content for crawlers" pattern search
   engines penalise. The safe version — same content for everyone — is not personalisation.
4. **It undermines the actual local strategy.** Real, indexable `/locations/{city}/` pages win
   `{service} ב{city}` queries. A client-swapped city name in a heading wins nothing: it is invisible
   to the crawler and to the AI assistant, which is where the traffic comes from.
5. **CLS risk.** Any post-hydration content swap above the fold shifts layout — a direct
   Core Web Vitals regression.

**The strategic answer to "make it relevant to their city" is location pages, not string
substitution.** See [seo-geo-aeo-strategy.md](seo-geo-aeo-strategy.md) §4.

### The safe subset — what personalisation _would_ be worth doing, if any of it were

If the case is ever made, it is confined to **non-indexed, below-the-fold, progressively-enhanced UI
affordances**, defaulting to a stable universal state. Nothing in this table is built; each row
would be a new client component, and the repo currently ships exactly four (§5) — that count is a
budget, and every row here spends from it:

| Allowed                                                          | Mechanism                                   | Constraint                                              |
| ---------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------- |
| "We cover your area" confirmation chip                           | Client-side, after paint, in reserved space | Must render a neutral default first; never shift layout |
| Nearest-city link suggestion into the location silo              | Client-side, in a reserved slot             | It is a _link_, not swapped body copy                   |
| Remembering the last-viewed service                              | `localStorage`                              | Convenience only; never gates content                   |
| Business-hours-aware CTA emphasis (call vs WhatsApp after hours) | Client-side clock                           | Both actions always present; only emphasis changes      |
| UTM/referrer-aware messaging                                     | Client-side                                 | Never in `<h1>`, `<title>` or schema                    |

**Hard rules for all of it:**

- **Never** personalise `<title>`, `<h1>`, meta description, canonical, or any JSON-LD.
- **Never** let personalised content be the only path to information.
- **Reserve the space** — the personalised element occupies the same box before and after.
- **Default state must be complete and correct** for a visitor with JS disabled, a bot, or an
  unresolvable location.
- **Geo data is personal data.** Using the browser Geolocation API triggers a permission prompt and
  privacy-policy obligations; IP-derived coarse geo (Cloudflare's `CF-IPCountry` / `request.cf.city`)
  does not prompt but still needs a privacy-policy line. Prefer coarse, or nothing. **Note the
  privacy page is already behind reality** — it still says the site _may_ use analytics tools, while
  GTM and GA4 have shipped on every route since 2026-08-30. Adding a geo signal on top of a
  disclosure that is already understated compounds the problem; fix the page first.
- **Never prompt for precise location on page load.** An unexplained permission dialog is a
  conversion killer and, on this site, unnecessary — the visitor types their area into the form
  anyway.

### If a Pages Function is ever justified

The bar: it must serve a purpose that indexable pages cannot, and it must not sit on the HTML path
for crawlers. Realistic candidate: a lightweight `/api/coverage?city=` endpoint the client calls
_after_ paint to confirm coverage. Not: rendering the homepage per visitor.

---

## 5. Progressive enhancement — the standing principle

This site works with **zero JavaScript** for everything that matters: content renders server-side,
FAQs are native `<details>`, navigation is real links, and the phone number is a plain `tel:`
anchor. Exactly three components ship client JS: `ContactForm`, `Navbar` and `ThankYouContent`.

Two that look like they should be client components are not, and a count taken by eye gets this
wrong: `Analytics` loads the tag through `next/script`, and the homepage's `ServiceChooser` is a
static list of links with no interactivity at all — both are server components. Verify the count by
grepping for `"use client"`, not by intuition.

**That is a competitive asset, not an accident.** It is why the content is extractable by answer
engines, why it is fast on a bad stairwell connection, and why it is robust for assistive tech.

Any personalisation, animation or interaction must be **additive**: remove the JS and the page is
still complete, correct and convertible.

---

## 6. Checklist

- [ ] Primary CTA reachable in the thumb arc on every page, every scroll position.
- [ ] All tap targets ≥ 44 × 44 px with ≥ 8 px separation — measured, not assumed (`CtaButton md`
      is the one that repeats).
- [ ] 360 px layout clean; 320 px reflow with no horizontal scroll; 200% zoom usable.
- [ ] **Currently failing (cro-1):** sticky bar present with its spacer on an element that actually
      ends the document; the footer's הצהרת נגישות and מדיניות פרטיות links visible and tappable at
      full scroll on a 390 px viewport, with no focused input occluded.
- [ ] Wide content scrolls inside its own container.
- [ ] No personalised `<title>`, `<h1>`, meta, canonical or JSON-LD.
- [ ] Every personalised element reserves its box and has a correct default.
- [ ] Page is complete and convertible with JavaScript disabled.
- [ ] Any geo/IP use is disclosed in `/privacy/` — and `/privacy/` describes the analytics that
      actually ship today, which it does not yet.
