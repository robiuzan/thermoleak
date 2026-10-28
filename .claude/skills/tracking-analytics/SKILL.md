---
name: tracking-analytics
description: GTM, GA4 and conversion events for thermoleak — the shared fleet container GTM-KWGGH438 ships on every route and only page_view is MEASURED, though lib/analytics.ts now pushes the three events no container trigger can observe (lead_whatsapp_open, lead_handoff_blocked, thank_you_view) and the container still has no tag for them, the triage order for a dead event, the data-cta hooks nothing consumes, the PII ban that covers hrefs as well as pushes, thank-you conversions across client-side navigation, Search Console, and the mandatory gtm.js 200-check. Use when wiring conversion events or when conversions are not being recorded. Triggers "set up GTM", "GA4", "track calls", "conversion tracking not firing", "Search Console", "container id".
---

# Tracking & analytics

## Start here: the container ships, `page_view` flows, nothing else does

Analytics landed on **2026-08-24**. What is true today (measured 2026-09-06):

- **`GTM-KWGGH438`** — the shared Israeli-fleet container — ships on **every route**. Id at
  `lib/site.ts:111`, snippet in `components/Analytics.tsx`, mounted from `app/layout.tsx:86`.
- GA4 is resolved **inside the container** by a RegEx table on `{{Page Hostname}}`; the row for
  `thermoleak.co.il` points at **`G-5YWLZ07PEC`**. That id lives in the container, **not in this
  repo** — grepping the repo for it returns nothing, and that is correct.
- The live container holds **one tag** (`__googtag`, firing on `gtm.init`). **Zero click triggers,
  zero event tags.**
- **(Corrected 2026-10-28.)** The repo contains **three** custom `dataLayer` pushes, all routed
  through `lib/analytics.ts`'s typed `pushEvent()`: `lead_whatsapp_open` and
  `lead_handoff_blocked` from `ContactForm`'s submit handler, and `thank_you_view` from
  `ThankYouContent` on mount. Those three are in code **because no container trigger can observe
  them**; the other four events are click/route triggers and must NOT be duplicated here. **The
  container still holds no tag for any of them**, so they are pushed and not measured — which is the
  next step, not a bug in the push. The paragraph below describes the state before that change:
- The repo contained **zero custom `dataLayer` pushes**. The only `dataLayer` reference anywhere in
  `app/`, `components/` and `lib/` is the GTM bootstrap at `components/Analytics.tsx:33`.

**Consequence — say this plainly when asked:** `page_view` is the only thing being measured. Every
event in the schema at `docs/data-tracking-infrastructure.md` §"Event schema" — `cta_click`,
`call_click`, `whatsapp_click`, `lead_whatsapp_open`, `lead_handoff_blocked`, `thank_you_view`,
`faq_open`, `pricing_view` — fires **zero times** (finding AN-1, open). The site's number-one
conversion goal, the phone call, is 100% invisible: GA4 Enhanced Measurement never tracks `tel:`
links, only http(s) outbound ones.

**This is an open defect, not a closed sprint.** Do not tell the user tracking works because the
container is installed — and do not tell them nothing is installed either.

## ⚠️ Read before you tag anything: the /thank-you/ link carries the lead's name and phone

This is the most dangerous thing in this area of the codebase (findings **SEC-3 / AN-2**, both open
as of 2026-09-06).

- `components/ContactForm.tsx:71-79` composes the handoff message as `שם: {name}` + `טלפון: {phone}`
  - `אזור: {area}` + service + free text, and stores it in `sessionStorage`.
- `components/ThankYouContent.tsx:57` reads it back into `const waHref = whatsappHref(handoff?.message)`,
  and `:84-93` renders it as a real anchor — `href={waHref}` … `data-cta="thankyou-whatsapp"`.
- `lib/site.ts:133-135` appends the message as `?text=<urlencoded>`. So after a real submit the DOM
  holds a link whose URL contains a customer's full name and mobile number.

GTM's built-in **Click URL** variable (`gtm.elementUrl`, already defined in the live container)
captures the whole href on any click trigger, and GA4 Enhanced Measurement's outbound-click event
sends it as `link_url` — query string included — to a container this repo does not control.

**Rules that follow, and they are absolute:**

1. **Never build a click trigger that matches `data-cta="thankyou-whatsapp"`**, and never let that
   element fall inside a generic `[data-cta]` trigger, while the href still carries the message.
2. **No PII in the data layer AND no PII in any href** — Click URL _is_ a data-layer variable. The
   `docs/data-tracking-infrastructure.md` §4 boundary covers both.
3. The real fix is a **code** change (out of scope for a docs pass): make the re-open control a
   `<button type="button">` that calls `window.open(waHref, "_blank", "noopener")`, or keep an
   anchor pointing at the generic `whatsappHref()` and open the prefilled URL from an `onClick`.
   Either way no PII-bearing URL ever exists in the DOM, the `data-cta` hook survives, and the
   popup-blocked path at `ThankYouContent.tsx:58` still works.
4. Until that lands, the site's own consent line is false: `components/ContactForm.tsx:221` promises
   the visitor "הם אינם נשמרים אצלנו".

**What may go in a push:** `service` (the fixed enum from `lib/services.ts`), `cta_id`, `page_type`,
booleans. **What may never:** `name`, `phone`, `email`, the message body, and **`area`** — the area
field is a free-text `<input>` (`components/ContactForm.tsx:159-166`), not a city select, so it is
user-typed and may contain anything. CLAUDE.md §12 forbids PII in the data layer outright.

## Triage order when "conversions aren't firing"

Work down this list. Do not stop at "GTM is installed", and never answer "nothing is measuring
anything" — both are wrong now.

1. **Does repo code push the event?**
   `grep -rn 'dataLayer' app components lib` — today this returns the bootstrap plus
   `lib/analytics.ts`. If the event you are chasing is one of the three it pushes, the push is not
   your problem; go to the next step. Events that
   depend on in-page state can _only_ come from here (see "the split that matters" below).
2. **Do a trigger and a tag exist in the container?** Don't trust the GTM UI, read the payload:
   `curl -s "https://www.googletagmanager.com/gtm.js?id=GTM-KWGGH438"` and inspect the `var data =`
   object — `resource.tags`, `predicates`, `rules`. Today: one tag, no click triggers.
3. **Is it a Key event in GA4?** An event that arrives but is not marked a Key event never shows up
   as a conversion.
4. **Was it a client-side navigation?** See "Client-side routing is real here" below.
5. **Only then** suspect the container id — and settle that with the 200-check.

## The container decision is made — treat it as a record, not a question

**Decided 2026-08-24: join the shared fleet container.** The rationale is in
`components/Analytics.tsx:6-10` — 10 of 12 fleet sites carry `GTM-KWGGH438`, so standing alone would
skip this domain on every fleet-wide tag change. Accepted trade: classic GTM is ~90 KB gzipped, over
the 50 KB tag budget in `docs/performance-guidelines.md` §1; Cloudflare Zaraz stays the lighter
fallback if that budget is ever enforced. Loaded `afterInteractive` on purpose — never
`beforeInteractive`.

**The consequence you inherit:** a broken trigger is a **fleet-wide** outage. Never edit a shared
trigger or variable to fix one site — **add a hostname condition**. The same holds for the GA4
hostname RegEx table: the row for this domain is one of eleven, and each domain appears exactly once.

## The 200-check — non-negotiable

**A GTM snippet in the HTML proves nothing.** A wrong id renders identical markup and silently collects
nothing.

```bash
curl -o /dev/null -w '%{http_code}\n' "https://www.googletagmanager.com/gtm.js?id=GTM-KWGGH438"
```

**200 or the id is wrong.** Two fabricated container ids in a row previously cost the Israeli fleet
**18 days of zero analytics across every site**, with the snippet sitting in the HTML looking correct
the whole time. Run this check when the id is first set, and again after deploy.

## The `data-cta` hooks exist — nothing consumes them

Click conversions here are meant to be caught by GTM click triggers reading a `data-cta` attribute,
so **no JS ships for them** and the attribute is load-bearing. The attributes were wired on
2026-08-24 and are present across the shared CTA components — `Navbar`, `Hero`, `StickyContact`,
`ContactCTA`, `Footer`, `ContactForm`, `ThankYouContent` — plus the `/pricing/` and service-page call
sites, some as literal attributes and some through `CtaButton`'s `dataCta` prop
(`components/CtaButton.tsx:55,64`).

**Measured 2026-09-06: 13 literal `data-cta` occurrences in `app/` + `components/`**, two of which
are `CtaButton`'s pass-through — so the number of _distinct values_ is larger. **Do not trust that
number after any new route lands.** Re-derive it:

```bash
grep -rho 'data-cta="[^"]*"' app components | sort -u        # literal values
grep -rn 'dataCta="' app components                          # values passed via CtaButton
grep -rn 'telHref\|whatsappHref(\|mailHref' app components | grep -v 'data-cta\|dataCta\|import'
```

The third command is the real audit: any call/WhatsApp/email link it returns is a click that can
never be attributed. Two open questions, both answered by re-grepping rather than by trusting a
number in a doc:

- **Coverage of the newer silos.** `/guides/` and `/locations/` shipped _after_ the attributes were
  wired. Their CTAs come from the shared `ContactCTA` and `StickyContact`, which are tagged — but
  that means a click from a location page is **indistinguishable** from a click anywhere else. If
  per-silo attribution matters, that needs `location-*` / `guide-*` values, which do not exist.
- **Informational contact links** on `/accessibility/` and `/privacy/` are deliberately untagged.
  Leave them that way; they are not CTAs.

Adding an attribute is free; a missing one makes the click permanently invisible. But the real
bottleneck today is the other end: **the attributes are already there and nothing reads them.**

## Wiring the events — the split that matters

Two of the documented events **cannot be built container-side at all**, and no amount of GTM work
will change that:

- `lead_whatsapp_open` / `lead_handoff_blocked` depend on whether `window.open` returned `null`.
  That is observed once, at `components/ContactForm.tsx:84-87`, and written to `sessionStorage` as
  `opened` — never to `dataLayer`. GTM cannot see it.

So the fix has two halves and needs both:

- **In-repo (a code change, not this pass):** a small typed `pushEvent(name, params)` helper that
  guards `window.dataLayer`, called from `ContactForm` (handoff attempted / handoff blocked, with
  `service` only) and from `ThankYouContent` (`thank_you_view`). Anything touching `Faq.tsx` would
  make it a client component — weigh that against CLAUDE.md §7's three-client-component budget
  before doing it, or drop `faq_open`.
- **Container-side (the owner's call, because the container is shared):** hostname-scoped click
  triggers on `[data-cta]`, reading the attribute into `cta_id` and splitting on Click URL (`tel:` →
  `call_click`, `wa.me` → `whatsapp_click`) — subject to the PII rule above, which excludes the
  thank-you WhatsApp link until its href is fixed.
- **Cheapest interim, zero container risk:** create `pricing_view` and `thank_you_view` as
  GA4-property-side Key events from `page_path` conditions on `G-5YWLZ07PEC`. That covers the
  URL-based signals immediately. It does **not** cover `call_click`.

### The honest naming rule — still binding

The form does not POST. It hands the data to the visitor's WhatsApp client and cannot confirm
delivery. So the event means **"a handoff was attempted"** — name it `lead_whatsapp_open`, never
`lead_submit` or `conversion`. `lead_handoff_blocked` is the genuinely valuable one: a measurable,
fixable loss.

## Client-side routing is real here — the thank-you conversion depends on it

A common and expensive mistake in this repo's docs: "it's a static export, so every navigation is a
real page load, and a History Change trigger will never fire." **That is false** (finding cro-2).
This is `output: "export"`, but it is still the **App Router**: `<Link>` and `router.push` do
pushState navigation and fetch RSC payloads — no document load, so no GTM All-Pages trigger.

It matters most where it hurts most: `/thank-you/` has **exactly one** inbound path,
`components/ContactForm.tsx:91` (`router.push("/thank-you/")`), so effectively **100% of legitimate
thank-you views are client-side navigations**. The same applies to internal journeys such as
`/guides/…` → `/pricing/`, which is why `pricing_view` cannot be trusted from document loads alone.

- GA4's Enhanced Measurement has a "page changes based on browser history events" setting that may
  make `page_view` fire on those navigations. **Verify it in Realtime; do not assume it.**
- For a deterministic `thank_you_view`, either push it from `ThankYouContent` or build it on a GTM
  History Change trigger matching `/thank-you/`. Do not build it on a page-load trigger.

## GA4 and Search Console

- **GA4 property:** `G-5YWLZ07PEC`, resolved from the container's hostname RegEx table (row 11) and
  verified against the live `gtm.js` payload rather than the GTM UI. `docs/business-facts.md` §F
  still lists the measurement id as unconfirmed — that row is the **owner's** to fill; surface it,
  never write it yourself.
- Mark call clicks, WhatsApp clicks and the lead event as **Key events** in GA4, or they will not
  appear as conversions.
- Ask the owner to confirm **Enhanced Measurement → Outbound clicks** on that property. It is on by
  default and is the setting that turns the thank-you href into a live PII leak.
- **Search Console:** the verification token ships at `app/layout.tsx:34`, and the roster now carries
  the same value — the two agree. Confirm the property is verified, then submit
  `https://thermoleak.co.il/sitemap.xml` (**28 URLs** in the 2026-10-28 build; `/thank-you/` is deliberately noindex and
  excluded) and watch Coverage for the `/404/` + `/_not-found/` duplication (backlog §1.1), which
  `public/_redirects` now collapses onto `/`.

## Verifying a deploy

1. Live page source contains `googletagmanager.com/gtm.js?id=GTM-KWGGH438`.
2. `curl` the `gtm.js` URL → 200.
3. GTM Preview mode on the live domain: fire a call click, a WhatsApp click and a form submit;
   confirm each trigger fires **once**.
4. GA4 Realtime shows the events with hostname `thermoleak.co.il` — Realtime is the proof, the
   container config is not.
5. **Inspect the request, not the config:** submit the form for real, open the Network panel, and
   confirm no `/g/collect` request carries a name, a phone number or a `text=` parameter.

## Checklist

- [ ] `gtm.js?id=GTM-KWGGH438` returns 200 (re-assert after every deploy).
- [ ] `grep -rn 'dataLayer' app components lib` shows the pushes you expect — and nothing else.
      Every push goes through `lib/analytics.ts`; a raw `window.dataLayer.push` in a component is a
      regression, because the typed helper is what keeps PII and free-text fields out.
- [ ] `lead_handoff_blocked` is NOT a GA4 Key event. It fires alongside `lead_whatsapp_open`, so
      marking both double-counts every blocked lead.
- [ ] The live container actually contains the trigger and tag you think you built.
- [ ] No `data-cta` element whose href can contain PII sits inside any click trigger.
- [ ] No PII in any push and none in any href — verified in the Network panel, not the config.
- [ ] The lead event name reflects what actually happened (a WhatsApp handoff attempt).
- [ ] `thank_you_view` is built on a client-side navigation, not a page load.
- [ ] Every CTA that should be attributable carries a `data-cta` (re-grep after new routes).
- [ ] Container edits are hostname-scoped so other fleet sites are unaffected.
- [ ] GA4 Key events marked; Search Console verified and the sitemap submitted — resubmit it whenever routes are added.

## Gotchas

- A shared container means a broken trigger is a fleet-wide outage. Test in Preview first, and scope
  every change by hostname.
- The GA4 measurement id is **not** in this repo. If events vanish, the hostname RegEx row is a
  prime suspect — and it is edited in the container, not here.
- App Router client navigation means a page-load trigger under-counts every internal journey.
- GTM only attaches its click listeners when at least one click trigger exists. With none, not even
  `gtm.linkClick` is pushed — so "I see no click events in Preview" is expected, not a bug to hunt.
- GA4 Enhanced Measurement never tracks `tel:` clicks. Phone calls need an explicit trigger or push.
- The container is the first and only third-party script on the site, and `public/_headers` already
  allows `googletagmanager` in the shipped report-only CSP. Do not "tighten" `script-src` to
  `'self'` — that would have to be undone before the policy could ever be enforced
  (`/web-security-headers`).
