# Data and tracking infrastructure

A measurement plan for a site that currently measures **nothing**, and a hard constraint that it
must stay fast while it starts. `/tracking-analytics` holds the operational steps; this file is the
architecture and the contracts.

---

## 1. Current state: zero

No GTM, no GA4, no pixel, no third-party script of any kind. The fleet roster records it plainly:

> `analytics.gtmId is null` — this site carries **NO GTM snippet at all** and collects zero
> analytics, unlike the rest of the fleet (shared container `GTM-KWGGH438`). Deliberate gap, not
> yet closed.

**Every other improvement on this project is currently unverifiable.** That is why this ranks as
critical despite breaking nothing.

One measurement surface does exist: a Google **Search Console** verification token ships in
`app/layout.tsx`. Confirm the property is verified and the sitemap submitted — free signal,
already paid for.

---

## 2. The decision that comes first

**Join the shared fleet container, or stand alone?** Owner call, recorded in business-facts §F.

| | Shared `GTM-KWGGH438` | Standalone container | **Cloudflare Zaraz** |
| --- | --- | --- | --- |
| Setup | None — fleet-standard | New container | New config, no GTM |
| Client JS cost | ~90 KB gzipped GTM runtime | Same | **~0 KB** — runs at the edge |
| Blast radius of a mistake | **Fleet-wide outage** | This site only | This site only |
| GA4 routing | Hostname RegEx table inside the container | Direct | Direct |
| Fleet consistency | ✅ | ✗ | ✗ |
| CWV impact | Real (see §5) | Real | **Minimal** |

**My recommendation: Zaraz**, and it is not a close call for *this* site.

Zaraz is Cloudflare's edge tag manager. The zone is already Cloudflare, the site is already Pages,
and Zaraz executes third-party tags **on Cloudflare's edge instead of in the browser** — which
directly satisfies the "lightweight, server-side analytics that does not harm Core Web Vitals"
requirement. The site currently has **no third-party JS at all**, and installing classic GTM would
spend that advantage permanently (see §5 and the CSP note in
[ux-cro-security.md](ux-cro-security.md) §5).

**The counter-argument, stated fairly:** the fleet standardises on GTM-KWGGH438, and one site
diverging costs cross-site consistency and means fleet-wide tag changes skip this domain. If fleet
uniformity outranks this site's performance, use the shared container — but then hold the §5 budget
strictly.

Either way: **thermoleak needs its own GA4 property.**

---

## 3. The `gtm.js` 200-check — a hard rule, not advice

**A tag snippet in the HTML proves nothing.** A wrong container ID renders byte-identical markup and
collects nothing, silently.

```bash
curl -o /dev/null -w '%{http_code}\n' "https://www.googletagmanager.com/gtm.js?id=GTM-KWGGH438"
```

**200, or the ID is wrong.** This fleet lost **18 days of analytics across every site** to two
fabricated container IDs in a row — the snippet looked correct in the HTML the entire time. Run this
whenever an ID is set or changed, and again after deploy.

---

## 4. The data layer contract

### Naming: `{location}-{action}` on `data-cta`

Click tracking reads the `data-cta` attribute — **no JS ships for it**, which is why the attribute
is load-bearing. All CTAs already carry one (shipped 2026-08-17):

`header-call` · `menu-call` · `hero-call` · `hero-whatsapp` · `sticky-call` · `sticky-whatsapp` ·
`service-call` · `service-form` · `pricing-call` · `pricing-whatsapp` · `finalcta-call` ·
`finalcta-whatsapp` · `finalcta-email` · `form-whatsapp` · `footer-call` · `footer-whatsapp` ·
`footer-email` · `thankyou-call` · `thankyou-whatsapp`

Any new CTA without one is an incomplete CTA — the click becomes permanently invisible.

### Event schema

| Event | Fires when | Parameters | Notes |
| --- | --- | --- | --- |
| `cta_click` | Any `[data-cta]` clicked | `cta_id`, `page_type` | Generic click capture |
| `call_click` | `tel:` link clicked | `cta_id`, `page_type` | **Key event** in GA4 |
| `whatsapp_click` | `wa.me` link clicked | `cta_id`, `page_type` | **Key event** |
| `lead_whatsapp_open` | Form submitted **and** handoff attempted | `service`, `area`, `handoff_ok` | See naming rule below |
| `lead_handoff_blocked` | `window.open` returned `null` | `service` | Popup blocked — a real, measurable loss |
| `thank_you_view` | `/thank-you/` page view | `service` | Cleanest Ads conversion target |
| `faq_open` | A `<details>` opened | `question_id` | Reveals real objections |
| `pricing_view` | `/pricing/` reached | `referrer_page` | Buying-intent signal |

### The honest naming rule

**The form does not POST anywhere.** It hands data to the visitor's WhatsApp client and cannot
confirm the message was sent. Therefore:

- ✅ `lead_whatsapp_open` — "a handoff was attempted"
- ❌ `lead_submit` / `conversion` — asserts something unobserved

Naming it a conversion inflates every downstream number and, worse, makes Google Ads bid on a
signal that is not a lead. `lead_handoff_blocked` exists because that failure is now detectable and
is a genuine, fixable loss.

### PII — the hard boundary

**Never put name, phone, email or message text in the data layer.** The form has all four in scope
at submit time, so this is a live risk, not a theoretical one.

Allowed: the selected `service` (a fixed enum) and coarse `area` **only if** normalised to a known
city list. A free-text area field must **not** be forwarded — it is user-typed and may contain
anything.

---

## 5. The performance contract for tags

Tags are the single highest-risk change to Core Web Vitals on this project. Budgets from
[performance-guidelines.md](performance-guidelines.md), applied to tagging:

| Rule | Threshold |
| --- | --- |
| Added JS from all tags | **≤ 50 KB gzipped** (Zaraz ≈ 0; classic GTM alone ≈ 90 KB — over budget) |
| Added INP | ≤ 20 ms |
| CLS from tags | **0** — no tag may inject visible DOM |
| Load timing | After paint, `async`/`defer`. Never render-blocking |
| Consent dialogs | Must reserve space or overlay without shifting layout |

**If classic GTM is chosen, the 50 KB budget is already breached on arrival.** That must be an
explicit, accepted trade — not discovered in a later audit.

Placement: container script in `<head>`, `<noscript>` iframe in `<body>`. Verify the Next 16
script-placement API in `node_modules/next/dist/docs/` before writing it — `AGENTS.md` warns this
is not the Next.js you know.

---

## 6. Server-side / edge tagging

The goal is fewer bytes and less main-thread work in the browser, plus resilience to ad blockers.

**Option A — Cloudflare Zaraz (recommended).** Tags execute at the edge; the browser gets a tiny
loader. Native to the existing platform, no extra vendor, no server to run.

**Option B — GA4 Measurement Protocol from a Pages Function.** Full control, but it puts a function
on the request path and requires managing an API secret. Only justified if a CRM handoff needs
server-side reliability.

**Option C — classic client-side GTM.** Fleet-consistent, heaviest, most ad-blocked.

Whichever is chosen, **`page_view` must not depend on client JS to be correct** — a static export
has no client-side routing, so every navigation is a real page load. A History Change trigger is
unnecessary here and will not fire.

---

## 7. CRM and lead handling

There is **no CRM today**, and the funnel is WhatsApp-first, which means **leads currently live only
in the owner's phone.** That is the real business risk in this section: no pipeline, no follow-up
tracking, no source attribution, no way to know which channel produced revenue.

### The attribution gap

A WhatsApp handoff severs the analytics chain: the click is measurable, the conversation is not.
Mitigations, cheapest first:

1. **Prefilled message tagging.** The composed message already carries structured fields (name,
   phone, area, service). Adding a short source marker — e.g. a trailing `[web]` or a page code —
   makes the origin visible **in the conversation itself**, where the owner actually works. Zero
   infrastructure, and it does not touch the data layer.
2. **WhatsApp Business** (free app): labels, quick replies, away messages, and a catalogue. This is
   the highest-value, lowest-cost step and needs no integration.
3. **WhatsApp Business Platform (API)** + a light CRM if volume ever justifies it. Do not start here.

### If a CRM is added

- **Never** put PII in the data layer to get it into a CRM. Send it server-side (Option B) or via
  the CRM's own form endpoint.
- A CRM script that loads in the browser is a third-party tag and is subject to the §5 budget and
  the CSP.
- Retention and lawful basis must be reflected in `/privacy/` before any storage begins.

---

## 8. Consent and privacy

- **Israeli Privacy Protection Law Amendment 13** materially raised obligations around personal data
  handling. The form collects name, phone, area and free text. `/privacy/` must accurately describe
  what is collected, where it goes (currently: the visitor's own WhatsApp client, not our servers),
  and retention. The form links to it ✅.
- **Google Consent Mode v2** is required for EEA traffic. Traffic here is overwhelmingly Israeli, so
  the pragmatic position is: implement Consent Mode defaults if any measurable EEA traffic exists;
  do not bolt a full CMP onto an Israeli local-services site by reflex.
- **A cookie banner is not free.** It costs conversions and risks CLS. Only ship one if a legal
  obligation actually applies.
- Any IP-derived geo (see [mobile-ux-and-personalization.md](mobile-ux-and-personalization.md) §4)
  needs a privacy-policy line before it ships.

---

## 9. Verification protocol

1. Live source contains the container/loader in `<head>`.
2. `gtm.js?id=…` returns **200** (§3).
3. Preview/debug mode on the live domain: fire a call click, a WhatsApp click, a form submit, and a
   FAQ open — each trigger fires **exactly once**.
4. GA4 Realtime shows the events with hostname `thermoleak.co.il`.
5. **No PII in any payload** — inspect the actual network request, not the config.
6. Re-run Lighthouse and compare against the pre-tag baseline. A regression beyond §5 is a rollback,
   not a follow-up ticket.
7. Mark `call_click`, `whatsapp_click` and `thank_you_view` as **Key events** in GA4, or they never
   appear as conversions.

---

## 10. Checklist

- [ ] Container decision recorded in business-facts §F, with the CWV trade-off stated.
- [ ] GA4 property exists for this domain.
- [ ] `gtm.js` (or Zaraz) verified 200 / loading.
- [ ] Every CTA carries `data-cta`; no orphan CTAs.
- [ ] Event names describe what was **observed** — no `lead_submit` on an unconfirmed handoff.
- [ ] Zero PII in the data layer, verified on the wire.
- [ ] Added JS ≤ 50 KB gzipped; CLS from tags = 0.
- [ ] CSP updated in the **same commit** as the tag install.
- [ ] `/privacy/` accurate before any new collection begins.
- [ ] Search Console verified; sitemap submitted; Key events marked.
