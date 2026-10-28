# Data and tracking infrastructure

The measurement architecture and its contracts, for a site where the plumbing is installed and
almost nothing runs through it yet. `/tracking-analytics` holds the operational steps; this file is
the architecture and the contracts.

---

## 1. Current state: `page_view` plus the three events the container cannot see

**GTM-KWGGH438 ships on every page.** `components/Analytics.tsx` is mounted from the root layout,
so every emitted HTML file carries the container (23 when this was verified in the fresh export and
against the live origin; 32 in the 2026-10-28 build), and the container resolves `thermoleak.co.il`
→ GA4 **G-5YWLZ07PEC** through its hostname RegEx table. Installed in `f06aab8`, 2026-08-30.

**Container-side, exactly one event still flows: `page_view`.** The container holds a single tag —
the GA4 config tag, firing on `gtm.init`. There are no click triggers and no event tags, and nothing
in this repo can add one.

**Repo-side, three events now reach the data layer** (shipped 2026-10-28, Sprint 6 task 2).
`lib/analytics.ts` exports a typed `pushEvent`, and it is called from exactly two components:

| Event                  | Pushed from                                  | Parameters              |
| ---------------------- | -------------------------------------------- | ----------------------- |
| `lead_whatsapp_open`   | `components/ContactForm.tsx` submit handler  | `service`, `handoff_ok` |
| `lead_handoff_blocked` | the same handler, when `window.open` is null | `service`               |
| `thank_you_view`       | `components/ThankYouContent.tsx` on mount    | `service` (optional)    |

Those three live in code **because no container configuration can produce them**: the handoff's
outcome exists only inside the submit handler, and `/thank-you/` is reached only by `router.push`
from that handler, so an All Pages trigger never fires there (§6). The other four — `cta_click`,
`call_click`, `whatsapp_click`, `pricing_view` — are click and route triggers that belong in the
container and are deliberately **not** duplicated in code: two sources for one click produce two
numbers. **They still fire zero times.** That includes `call_click`, the site's primary conversion
goal, and one GA4 cannot recover on its own because Enhanced Measurement never tracks `tel:` links.

**A push is not a measurement.** Until the container carries a Custom Event trigger and tag for each
of the three, they sit in `window.dataLayer` and go nowhere — the same shape of gap as the
`data-cta` attributes in §4, one step further along. The container work is a fleet-ops ask.

**The property-side shortcut, and its catch.** `thank_you_view` and `pricing_view` can be created as
**GA4-property-side** Key events from `page_path` conditions, with no container edit. **But a
property-side condition can only match an event GA4 already receives**, and both routes are reached
by client-side navigation (§6) — so this works only if the GA4 data stream has Enhanced Measurement's
**"Page changes based on browser history events"** switched on. **Check that switch before relying on
it.** With it off, the Key event matches only reloads and direct hits — precisely the arrivals that
are _not_ leads — and would report zero while looking configured. The durable answer for
`thank_you_view` is a Custom Event trigger on the event name this repo now pushes.

> **Triage rule.** The old answer to "why isn't this conversion firing?" was "nothing is measuring
> anything." That answer is now wrong and it stops the investigation one step short. Work §9's
> order instead: is the event pushed in code → is there a trigger in the container → is it a Key
> event in GA4?

Search Console: the verification token ships in `app/layout.tsx` and is recorded in the roster.
Confirm the property is verified and the sitemap submitted — free signal, already paid for.

---

## 2. Decision record: the shared fleet container

Decided and shipped 2026-08-30 (`f06aab8`); recorded in business-facts §F. **This is a record, not
an open question.** The comparison table and the "my recommendation: Zaraz" verdict that used to
fill this section were deleted for a reason: read cold, months after the install, they send the next
agent to rip out working instrumentation.

- **Chosen: the shared fleet container `GTM-KWGGH438`**, with GA4 `G-5YWLZ07PEC` resolved inside it
  by hostname. Rationale: 10 of the 12 fleet sites carry it, and fleet-wide tag changes would
  otherwise skip this domain. The rationale is restated at `components/Analytics.tsx:5-14`.
- **Accepted cost:** classic GTM is ~90 KB gzipped, which is over the 50 KB tag budget in §5. That
  is an explicit, accepted trade — not an oversight to "fix" later.
- **Retained fallback: Cloudflare Zaraz** (edge tag manager, ~0 KB client JS), if that budget is
  ever enforced strictly or if the fleet-wide blast radius of a shared container becomes a problem.

The container is **shared and edited by ten other fleet sites**, and nothing in this repo controls
its configuration. Two consequences that matter downstream: a container change can break or leak
here without a commit landing (§4), and any enforcing CSP on this domain is a standing dependency
on a config this repo cannot see (see [ux-cro-security.md](ux-cro-security.md) §5).

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
is load-bearing. **This list is the single inventory**; [ux-cro-security.md](ux-cro-security.md) §1
points here rather than keeping a second copy. Nineteen distinct values ship — eleven written
literally in `components/`, eight passed through `CtaButton`'s `dataCta` prop:

`header-call` · `menu-call` · `hero-call` · `hero-whatsapp` · `sticky-call` · `sticky-whatsapp` ·
`service-call` · `service-form` · `pricing-call` · `pricing-whatsapp` · `finalcta-call` ·
`finalcta-whatsapp` · `finalcta-email` · `form-whatsapp` · `footer-call` · `footer-whatsapp` ·
`footer-email` · `thankyou-call` · `thankyou-whatsapp`

Any new CTA without one is an incomplete CTA — the click becomes permanently invisible.

**The live surfaces add six more (owner decision 2026-10-11, fleet live-kit — CLAUDE.md §14)**,
printed by the byte-locked `lib/live/render.mjs` from the registers rather than written in
`components/`, so a grep of `components/` does not find them; the values are the same on every fleet
site: `topbar-whatsapp` (the evergreen line) · `topbar-link` (a seasonal line's page) ·
`popup-call` · `popup-whatsapp` · `popup-link` (the seasonal card) · `update-link` (the homepage
strip). `topbar-call` exists in the kit too, used only by a line carrying the `{phone}` token — none
of this site's lines does today. Their hrefs are generic (`tel:` and a bare `wa.me` link — no
prefilled text), so the PII rule below holds.

The seasonal card also pushes the site's only custom events, from the static `public/assets/live.js`
(a fleet file, not a component): `surface_view` (`surface: "dialog"`, `variant`: the line's id) when
it opens and `surface_dismiss` (+ `method`: `button` | `backdrop` | `esc` | `expired` | `action` |
`nav`) when it closes. Ids only — never personal data. **Fleet-ops step before the first deploy:**
the container's trigger `CE - popup events (3locksmiths)` is hostname-scoped to 3locksmiths.co.il;
it must include `thermoleak.co.il`, or these two events reach the dataLayer and go nowhere. **Owner
decision 2026-10-12 (fleet wording sign-off page): one shared trigger for the whole fleet** — that
trigger keeps a hostname condition, widened to match every fleet site, rather than a trigger per
site; the blast-radius rule (optimization-backlog §13.1) still holds, because the edit stays
hostname-scoped. The card
never opens before the consent question is answered (`data-live-block` — set on `<html>` before
first paint by `app/layout.tsx` when no answer is stored, lifted by `ConsentBanner` on a choice); for
a visitor who declined, the events go out cookieless under Consent Mode, so the counts under-read.

⚠️ **Nothing consumes these attributes yet.** They are hooks with no consumer: the container has no
click trigger, so GTM does not even attach its click listeners. A complete `data-cta` inventory is
therefore _not_ evidence that clicks are measured — it is evidence that they _could_ be.

### Event schema

**Three of these rows now describe shipped behaviour; the rest are still specification.**
`lead_whatsapp_open`, `lead_handoff_blocked` and `thank_you_view` are pushed by `lib/analytics.ts`
(§1) — though a push with no container trigger behind it is still not a measurement. Every other row
**fires zero times**. Keep that in mind when reading the "Fires when" column.

| Event                  | Fires when                               | Parameters              | Notes                                                                                                                            |
| ---------------------- | ---------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `cta_click`            | Any `[data-cta]` clicked                 | `cta_id`, `page_type`   | Generic click capture                                                                                                            |
| `call_click`           | `tel:` link clicked                      | `cta_id`, `page_type`   | **Key event** in GA4. GA4 alone never sees `tel:` clicks — this needs a container trigger                                        |
| `whatsapp_click`       | `wa.me` link clicked                     | `cta_id`, `page_type`   | **Key event.** Must not read Click URL on `/thank-you/` — see the PII boundary below                                             |
| `lead_whatsapp_open`   | Form submitted **and** handoff attempted | `service`, `handoff_ok` | ✅ **Pushed** (`ContactForm`). The lead event — and the only one of the three to mark a Key event                                |
| `lead_handoff_blocked` | `window.open` returned `null`            | `service`               | ✅ **Pushed**. Diagnostic ONLY: it fires _alongside_ the row above, so marking both double-counts every blocked lead             |
| `thank_you_view`       | `/thank-you/` reached                    | `service`               | ✅ **Pushed** (`ThankYouContent`, on mount). Cleanest Ads conversion target. **Reached only by client-side navigation — see §6** |
| `faq_open`             | A `<details>` opened                     | `question_id`           | Reveals real objections. Costs a fourth client component if pushed in code — weigh it                                            |
| `pricing_view`         | `/pricing/` reached                      | `referrer_page`         | Buying-intent signal. Also mostly client-side navigation (§6)                                                                    |

Note the `area` parameter has been dropped from `lead_whatsapp_open`: the field is free text, and
the PII boundary below forbids forwarding it.

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

Allowed: the selected `service` (a fixed enum). The `area` field is **free text** and must not be
forwarded — it is user-typed and may contain anything, including a full street address. If a coarse
area is ever wanted, it has to be normalised against a known city list first.

#### No PII in the data layer **and** no PII in any `href`

**Click URL is a data-layer variable.** GTM's built-in `gtm.elementUrl` is populated with the
clicked element's complete href, and GA4 Enhanced Measurement's outbound-click event sends that
whole URL — query string included — as `link_url`. So an href is not a safe hiding place: putting
personal data in one is the same violation as pushing it, with the added problem that it happens
without anyone writing a push.

**The live case — `SEC-3` / `AN-2`, FIXED 2026-09-17 in `components/ThankYouContent.tsx`.** Keep
reading anyway: this is the worked example, and the shape of the bug is easy to reintroduce.

The thank-you page used to build `whatsappHref(handoff?.message)` and render it as
`<a href={waHref} … data-cta="thankyou-whatsapp">`. After a real submit that href was
`https://wa.me/…?text=` + the URL-encoded lead — **full name, phone number, area and free text** —
sitting in the DOM of a page the container runs on, on an element tagged as a deliberate trigger
target. The static HTML was clean (the fallback href is a generic prefill), so it appeared only in a
real post-submit session. That is why it survived review, and why **reading the markup is not a
sufficient check — the request on the wire is.**

It also contradicted what the form promises the visitor ("הם אינם נשמרים אצלנו").

**The fix, which is the pattern to copy:** the rendered `href` is the generic `whatsappHref()`, and
the prefilled conversation is opened from an `onClick` handler via `window.open`, so the personal
URL never enters the DOM. A no-JS visitor gets a blank chat — a working fallback. If the popup is
blocked the handler navigates the current tab instead: the address bar then carries the message, but
the href, the only thing a tag manager reads, stays clean.

**The rule for anyone wiring `whatsapp_click`:** do not read Click URL. Read `data-cta`. Any new
control that needs personal data in a URL builds it at click time — never in an attribute. The same
rule is why `lead_whatsapp_open` carries only `service`: `area` is free text and homeowners type
street addresses into it.

---

## 5. The performance contract for tags

Tags are the single highest-risk change to Core Web Vitals on this project. Budgets from
[performance-guidelines.md](performance-guidelines.md), applied to tagging:

| Rule                   | Threshold                                             | State                                                                                                                       |
| ---------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Added JS from all tags | **≤ 50 KB gzipped**                                   | ⚠️ **breached by design** — classic GTM is ~90 KB. Accepted in §2                                                           |
| Added INP              | ≤ 20 ms                                               | Unmeasured — no field data yet                                                                                              |
| CLS from tags          | **0** — no tag may inject visible DOM                 | ✅ nothing visible is injected                                                                                              |
| Load timing            | After paint, `async`/`defer`. Never render-blocking   | ✅ `afterInteractive`                                                                                                       |
| Consent dialogs        | Must reserve space or overlay without shifting layout | ✅ `ConsentBanner` is fixed-position; the seasonal card (2026-10-11, CLAUDE.md §14) is a native `<dialog>` in the top layer |

**The 50 KB row is over budget and stays over budget.** That was decided knowingly (§2). It is
recorded here so a later audit reads it as an accepted trade rather than a fresh discovery — and so
that the _next_ tag is weighed against a budget already spent, not against a clean sheet.

**Actual placement — not what an earlier draft of this file prescribed.** `components/Analytics.tsx`
wraps the bootstrap in `next/script` with `strategy="afterInteractive"`, and on a static export that
means the initializer is **not serialized into the HTML at all**: `out/index.html` contains zero
`<script id="gtm-init">` markup, and the snippet appears only inside the RSC flight payload. React
creates it after hydration. The `<noscript>` iframe _is_ real markup in `<body>`.

The cost of that, stated plainly: the container fetch cannot begin until the route's JS has
downloaded and hydrated, so **a visitor who taps a call or WhatsApp button before hydration
completes is not measured**. On this site that is a small population and it protects LCP, which is
why the trade was taken (`components/Analytics.tsx:12-14`). If early-tap measurement ever matters
more than the LCP margin, the alternative is a plain inline `<script>` in the layout body — decide
it deliberately, do not drift into it.

---

## 6. Client-side routing — the trap that zeroes the conversion

> ⚠️ **An earlier version of this section said the opposite of what follows, and following it makes
> the site's only URL-based conversion record zero. Read this before configuring any page-based
> trigger.**

**A static export is still the App Router.** `output: "export"` removes the server; it does not
remove client-side navigation. Every `<Link>` and every `router.push()` does a `pushState`
navigation and fetches an RSC payload — no document load, no `gtm.js` re-run, **no `page_view`**.
The 158 `.txt` payload files in `out/` are that mechanism's on-disk footprint.

Two direct consequences:

1. **`/thank-you/` is reached _only_ by client-side navigation.** It has exactly one inbound path in
   the entire repo — `components/ContactForm.tsx:91`, `router.push("/thank-you/")` — and no link
   anywhere points at it. So **100% of legitimate thank-you views are pushState navigations.** A GTM
   All Pages / initial-load trigger sees none of them, and `thank_you_view` — this file's own
   "cleanest Ads conversion target" — records zero.
2. **Internal navigation is undercounted everywhere else too.** A visitor who lands on
   `/guides/leak-detection-cost/`, clicks through to `/pricing/` and then to a service page
   registers **one** `page_view`, not three. `pricing_view` is unreliable for the same reason, and
   so is every landing-page and path report built on `page_view`.

**What to configure instead:**

- Drive GA4 `page_view` from a **History Change trigger** (or an explicit `page_view` push on route
  change) **in addition to** the initial container load. Guard against the double-fire on first
  load — History Change must not also fire for the initial page.
- `thank_you_view` **no longer needs a trigger at all** — `components/ThankYouContent.tsx` pushes
  it on mount (§1), which is strictly more reliable than matching a URL and survives any container
  edit. Wire a Custom Event trigger on the event name. Do **not** also build a History Change
  trigger for `/thank-you/`: that would count every arrival twice.
- `pricing_view` still needs a **History Change matching `/pricing/`**, never an All Pages trigger —
  or, cheaper and with no container edit, a GA4-property-side Key event on a `page_path` condition.
- Anything that depends on knowing _why_ a route changed — the handoff outcome, for instance —
  cannot be recovered from a history event at all. That belongs in a `dataLayer` push from the code
  that observed it (§4).

### Server-side / edge tagging, if it ever comes back

The goal would be fewer bytes and less main-thread work, plus resilience to ad blockers. The shared
container (§2) is what ships; these remain the alternatives if that decision is ever reopened.

**Option A — Cloudflare Zaraz.** Tags execute at the edge; the browser gets a tiny loader. Native
to the existing platform, no extra vendor, no server to run. The retained fallback per §2.

**Option B — GA4 Measurement Protocol from a Pages Function.** Full control, but it puts a function
on the request path and requires managing an API secret. Only justified if a CRM handoff needs
server-side reliability.

**Option C — classic client-side GTM.** Fleet-consistent, heaviest, most ad-blocked. **This is what
ships.**

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

> 🔴 **Open, and nobody else's file owns it.** `/privacy/` was written before analytics shipped and
> still hedges. `app/privacy/page.tsx` says the site _"ייתכן"_ (may) use cookies and analytics tools
> "כגון Google Analytics". Since `f06aab8` that is not a maybe: GTM and GA4 load on every route, on
> every visitor, with no consent gate anywhere — `grep -rn "consent" app components lib` returns
> **zero hits**. A hedge that has become a fact is a false privacy notice, and this is an Israeli
> site under Privacy Protection Law Amendment 13.
>
> **What to do (code change, not made in this pass):** rewrite that paragraph to state definitively
> that the site uses Google Analytics 4 via Google Tag Manager, name what it collects (usage and
> device data, not the form's contents), and give a real opt-out route (browser settings plus the
> Google opt-out add-on). Keep it truthful about the form: its contents go to the visitor's own
> WhatsApp client, not to a server here. Do not write a retention period, a data-processor name or a
> legal basis that nobody has confirmed — see [business-facts.md](business-facts.md).

- **Israeli Privacy Protection Law Amendment 13** materially raised obligations around personal data
  handling. The form collects name, phone, area and free text. `/privacy/` must accurately describe
  what is collected, where it goes (currently: the visitor's own WhatsApp client, not our servers),
  and retention. The form links to it ✅.
- **Google Consent Mode v2** is required for EEA traffic. Traffic here is overwhelmingly Israeli, so
  the pragmatic position is: implement Consent Mode defaults if any measurable EEA traffic exists;
  do not bolt a full CMP onto an Israeli local-services site by reflex. **Decide this before the
  event layer lands, not after** — retrofitting consent onto live conversion tags is how a signal
  gets silently dropped, and the tags are the next thing due to ship.
- **A cookie banner is not free.** It costs conversions and risks CLS. Only ship one if a legal
  obligation actually applies.
- Any IP-derived geo (see [mobile-ux-and-personalization.md](mobile-ux-and-personalization.md) §4)
  needs a privacy-policy line before it ships.

---

## 9. Verification protocol

1. The container loads on the live page (it is created at hydration, so check the network panel, not
   `view-source` — see §5).
2. `gtm.js?id=…` returns **200** (§3).
3. Preview/debug mode on the live domain: fire a call click, a WhatsApp click, a form submit, and a
   FAQ open — each trigger fires **exactly once**.
4. **Walk a client-side navigation** (`/guides/…` → `/pricing/` → a service page, then a real form
   submit through to `/thank-you/`) and confirm a `page_view` for **each** step and exactly one
   `thank_you_view`. This is the check that catches the §6 trap; an initial-load-only test passes
   while the conversion records zero.
5. GA4 Realtime shows the events with hostname `thermoleak.co.il`.
6. **No PII in any payload** — inspect the actual network request, not the config. Specifically: on
   `/thank-you/` after a **real submit**, confirm no `click` event carries a `link_url` containing
   `text=`, and no `/g/collect` request carries the submitted name or phone (§4).
7. Re-run Lighthouse and compare against the pre-tag baseline. A regression beyond §5 is a rollback,
   not a follow-up ticket.
8. Mark `call_click`, `whatsapp_click` and `thank_you_view` as **Key events** in GA4, or they never
   appear as conversions.

**Before promoting the CSP from report-only to enforcing** (see
[ux-cro-security.md](ux-cro-security.md) §5): check the violation reports for
`google-analytics.com` specifically — **fixed 2026-10-28**: `connect-src` listed only
`https://www.google-analytics.com` and `https://*.analytics.google.com`, and a CSP host wildcard
requires at least one label, so it covered neither the `analytics.google.com` apex nor GA4's
regional `regionN.google-analytics.com` collect hosts. `https://*.google-analytics.com` now
covers the regional hosts. The `analytics.google.com` apex is still uncovered — it is a
reporting host, not a collect host, so nothing requests it from the page. Then confirm a GA4 Realtime hit from a browser
**after** the switch, not only before it. The policy has no `report-uri` and no `report-to`, so
today "check the reports" means a DevTools console on a preview deploy, not a collector.

---

## 10. Checklist

- [x] Container decision recorded (§2 + business-facts §F), with the CWV trade-off stated.
- [x] GA4 property exists for this domain — resolved inside the container by hostname.
- [x] `gtm.js` verified 200.
- [x] Every CTA carries `data-cta`; no orphan CTAs — 19 values, §4.
- [x] **At least one event beyond `page_view` is pushed from code** — three are: `lead_whatsapp_open`,
      `lead_handoff_blocked`, `thank_you_view` (§1, `lib/analytics.ts`).
- [ ] **At least one of them reaches GA4.** A push with no container trigger behind it is not a
      measurement, and the container still holds only the config tag (§1).
- [ ] `page_view` driven by History Change in addition to the container load, verified across a real
      client-side navigation (§6). `thank_you_view` no longer depends on this.
- [x] Event names describe what was **observed** — `lead_whatsapp_open`, never `lead_submit`, on a
      handoff the site cannot confirm was sent.
- [x] Zero PII in the data layer **and in every tagged `href`** — `service` is the only form field
      forwarded, and the thank-you href is generic (SEC-3 fixed 2026-09-17). ⏳ Still to be
      confirmed **on the wire** from a real phone submit; it has never actually been run.
- [x] CSP updated in the same commit as the tag install (`f06aab8`).
- [x] `connect-src` covers GA4's regional collect hosts before enforcing — `*.google-analytics.com`
      added 2026-10-28 (§9). The `analytics.google.com` apex is deliberately still absent.
- [ ] `/privacy/` states the analytics that actually ship (§8).
- [ ] Search Console verified; sitemap submitted; Key events marked.
