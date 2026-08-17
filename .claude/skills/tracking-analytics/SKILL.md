---
name: tracking-analytics
description: GTM, GA4 and conversion events for thermoleak — the site currently ships ZERO analytics, the shared Israeli fleet container GTM-KWGGH438 and whether to join it, head placement, the data-cta inventory to build first, lead events without PII, thank-you-URL conversions, Search Console, and the mandatory gtm.js 200-check whenever a container id is set. Use when turning on analytics or when conversions are not being recorded. Triggers "set up GTM", "GA4", "track calls", "conversion tracking not firing", "Search Console", "container id".
---

# Tracking & analytics

## Start here: there is no analytics on this site

**Zero.** No GTM snippet, no GA4, no pixel, no third-party script of any kind. `app/layout.tsx` injects
JSON-LD and nothing else. The roster manifest states it outright:

> `analytics.gtmId is null` — this site carries **NO GTM snippet at all** and collects zero analytics,
> unlike the rest of the fleet (shared container `GTM-KWGGH438`). **Deliberate gap, not yet closed.**

So every question that starts "why isn't this conversion firing" has the same answer until the gap is
closed: nothing is measuring anything. Say that plainly rather than debugging a trigger that doesn't
exist.

The one measurement surface that **does** exist: `app/layout.tsx:32` carries a Google **Search Console**
verification token (`verification: { google: "BxQI2a7…" }`) while the roster records
`googleSiteVerification: null`. The tag is real and public by design; the roster is stale. Record the
token in `docs/business-facts.md` §F.

## Decision one: join the fleet container, or stand alone?

`GTM-KWGGH438` is **one container for ~10 Israeli fleet domains**, with GA4 resolved _inside_ the
container by a RegEx table on `{{Page Hostname}}`. Joining it means:

- **Pro:** zero container setup, consistent event names across the fleet, one place to maintain.
- **Con:** a broken trigger is a **fleet-wide** outage. Never edit a shared trigger or variable to fix
  one site — add a hostname condition.
- Either way thermoleak needs **its own GA4 property**; the container resolves it by hostname.

This is an owner decision, not an agent decision. Record it in `docs/business-facts.md` §F before
writing any code.

## The 200-check — non-negotiable

**A GTM snippet in the HTML proves nothing.** A wrong id renders identical markup and silently collects
nothing.

```bash
curl -o /dev/null -w '%{http_code}\n' "https://www.googletagmanager.com/gtm.js?id=GTM-KWGGH438"
```

**200 or the id is wrong.** Two fabricated container ids in a row previously cost the Israeli fleet
**18 days of zero analytics across every site**, with the snippet sitting in the HTML looking correct
the whole time. Run this check when the id is first set, and again after deploy.

## Where the snippet goes

Google's install requires the container script in `<head>`. This layout has no explicit `<head>` element
today — Next builds one — so adding the snippet means adding a `<head>` block or using the documented
Next 16 script placement. **Check `node_modules/next/dist/docs/` before choosing**; `AGENTS.md` warns
that this is not the Next.js you know, and script placement is one of the areas that has moved.

The `<noscript>` iframe belongs in `<body>`. Whatever inline script you add becomes the thing a future
CSP must accommodate — see `/web-security-headers`, and note that **today the site has no inline
third-party script at all**, which makes a strict CSP unusually cheap. Installing GTM spends that.

## Build the `data-cta` inventory first

Call and WhatsApp conversions are tracked in GTM by click triggers reading a `data-cta` attribute — **no
JS ships for them**, which is why the attribute is load-bearing. **Not one CTA on this site has one
today.**

Add them before the container exists, following `{location}-{action}`:

`header-call` · `hero-call` · `hero-whatsapp` · `sticky-call` · `sticky-whatsapp` · `finalcta-call` ·
`finalcta-whatsapp` · `finalcta-email` · `service-call` · `form-whatsapp` · `footer-call` ·
`footer-whatsapp` · `footer-email`

Audit with:

```bash
grep -rn 'telHref\|whatsappHref(\|mailHref' components app | grep -v 'data-cta'
```

Adding an attribute is free; a missing one makes the click permanently invisible.

## Events

- **The form does not POST.** `ContactForm` opens a WhatsApp deep link and immediately renders success
  (see `/conversion-cro` gap 1). So a `lead_submit` event here can only mean "the user clicked submit
  and we attempted a handoff" — **not** "a lead was received". Name it accordingly
  (`lead_whatsapp_open`) rather than inflating a conversion count with a step that may have failed.
- Add a thank-you page view as a second, cleaner signal once `/thank-you/` exists. A URL-based
  conversion is the best Google Ads target.
- **Never put PII in `dataLayer`** — no name, phone, email or message text. The form has all four in
  scope at submit time, so this is a real risk here, not a theoretical one.

## GA4 and Search Console

- **GA4 property** for thermoleak.co.il: blocked on `docs/business-facts.md` §F.
- Mark the call clicks, WhatsApp clicks and the lead event as **Key events** in GA4, or they won't
  appear as conversions.
- **Search Console:** the verification tag already ships. Confirm the property is verified, then submit
  `https://thermoleak.co.il/sitemap.xml` (11 URLs) and watch Coverage for the `/404/` +
  `/_not-found/` duplication (backlog §1.1).

## Verifying a deploy

1. Live page source contains `googletagmanager.com/gtm.js?id=` **inside `<head>`**.
2. `curl` the `gtm.js` URL → 200.
3. GTM Preview mode on the live domain: fire a call click, a WhatsApp click and a form submit; confirm
   each trigger fires **once**.
4. GA4 Realtime shows the events with hostname `thermoleak.co.il`.
5. Confirm no PII appears in any `dataLayer` push.

## Checklist

- [ ] Container decision recorded (fleet container vs standalone) in business-facts §F.
- [ ] GTM script in `<head>`; `<noscript>` iframe in `<body>`.
- [ ] `gtm.js?id=…` returns 200.
- [ ] Every CTA has a `data-cta` following `{location}-{action}`.
- [ ] The lead event name reflects what actually happened (a WhatsApp handoff attempt).
- [ ] No PII in `dataLayer`.
- [ ] Container edits are hostname-scoped so other fleet sites are unaffected.
- [ ] GA4 key events marked; Search Console verified and sitemap submitted.

## Gotchas

- A shared container means a broken trigger is a fleet-wide outage. Test in Preview first.
- Client-side route changes don't apply here (static export, full page loads), so a History Change
  trigger is not needed and will not fire.
- Installing analytics adds the first third-party script to a site that has none. Do the CSP work in the
  same pass (`/web-security-headers`) rather than leaving it to a later audit.
