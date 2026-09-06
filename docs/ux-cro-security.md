# UX · CRO · Security

Navigation architecture, the conversion funnel, form design, and the security posture of a static
export on Cloudflare Pages. Mechanics live in the `/conversion-cro` and `/web-security-headers`
skills; this file is the design contract they implement. Accessibility has its own file:
[accessibility-and-i18n.md](accessibility-and-i18n.md).

---

## 1. The funnel, in priority order

**Phone call → WhatsApp → contact form.** That order is not a preference; it reflects a buyer who is
mid-crisis and wants a human now. Every design decision defers to it.

```
   ENTRY                    DECIDE                     ACT
   organic / map pack  →   answer block            →   tel: (primary)
   AI citation             honest limits               WhatsApp (secondary)
   direct                  /pricing/ transparency      form → /thank-you/ (tertiary)
                           guarantee terms
```

**The DECIDE column is now built.** Answer blocks and honest-limits sections ship on every service
page; `/pricing/` states the entry price and what moves it; the confirmed guarantee scope,
exclusions and no-call-out-fee rule are published at the foot of it. The one proof type still
missing — **real reviews — stays missing** until a Google Business Profile provides sourced ones
(business-facts §B). Do not draft placeholder proof to fill the slot; that is the fabrication this
project has already paid for once.

**Design implication:** a visitor must be able to act from _any_ scroll position on _any_ page
without hunting. That is why the sticky mobile bar exists and why it must never be removed to
"clean up" a layout. (It has one open defect of its own — on mobile it overlays the last rows of
the footer, where the only link to `/accessibility/` lives. That belongs to
[mobile-ux-and-personalization.md](mobile-ux-and-personalization.md); do not "fix" it by deleting
the bar.)

### Conversion inventory — every page, every state

**The `data-cta` list is maintained in one place:**
[data-tracking-infrastructure.md](data-tracking-infrastructure.md) §4, which carries all **19**
values. Do not keep a second copy here — this table drifted to 15 and became the list auditors
checked pages against. It is now a map of _surfaces_, and the attribute names are the other file's.

| Surface                   | Call               | WhatsApp               | Email               | Form              | Status                                                                                |
| ------------------------- | ------------------ | ---------------------- | ------------------- | ----------------- | ------------------------------------------------------------------------------------- |
| Navbar (desktop)          | ✅ `header-call`   | —                      | —                   | —                 | shipped                                                                               |
| Navbar (open mobile menu) | ✅ `menu-call`     | —                      | —                   | —                 | shipped                                                                               |
| Hero                      | ✅ `hero-call`     | ✅ `hero-whatsapp`     | —                   | —                 | shipped                                                                               |
| Sticky bar (mobile)       | ✅ `sticky-call`   | ✅ `sticky-whatsapp`   | —                   | —                 | shipped                                                                               |
| Service sidebar           | ✅ `service-call`  | —                      | —                   | ✅ `service-form` | shipped                                                                               |
| Pricing CTA band          | ✅ `pricing-call`  | ✅ `pricing-whatsapp`  | —                   | —                 | shipped                                                                               |
| ContactCTA (page foot)    | ✅ `finalcta-call` | ✅ `finalcta-whatsapp` | ✅ `finalcta-email` | ✅                | shipped                                                                               |
| The form's submit         | —                  | ✅ `form-whatsapp`     | —                   | ✅                | shipped — but see §3: it fires **before** validation                                  |
| Footer                    | ✅ `footer-call`   | ✅ `footer-whatsapp`   | ✅ `footer-email`   | —                 | shipped                                                                               |
| `/thank-you/`             | ✅ `thankyou-call` | ✅ `thankyou-whatsapp` | —                   | —                 | shipped — **PII in the WhatsApp href, §3**                                            |
| Guarantee terms           | —                  | —                      | —                   | —                 | 🔶 rendered **once**, at the foot of `/pricing/`, with no `id` to link to — see below |

The silos reuse `ContactCTA`, so `/guides/` and `/locations/` introduce no new attributes and need
no rows.

Every CTA carries a `data-cta="{location}-{action}"` attribute. Adding one is free; omitting one
makes the click permanently invisible. Any new CTA without one is an incomplete CTA.

> ⚠️ **A complete inventory is not measurement.** GTM ships, but the container has no click trigger
> and the repo makes no `dataLayer` push, so **every one of these attributes is currently inert and
> every documented conversion event fires zero times.** "All CTAs are tagged ✅" has been read as
> "clicks are tracked" for three sprints. They are hooks awaiting a consumer —
> [data-tracking-infrastructure.md](data-tracking-infrastructure.md) §1.

**The guarantee is the strongest confirmed fact on the site and it does almost no work.** The bare
promise renders on the homepage hero, all four service sidebars, `/about/` and `/pricing/`; the
_terms_ that make it credible render in exactly one place — the bottom of `/pricing/` — in a section
with no `id`, so nothing can even link to them. A homeowner reading "לא מצאנו — לא שילמתם" in a
service sidebar has no route to what "מצאנו" means, and service pages do not link to `/pricing/` at
all. A vague promise reads as a catch; a bounded one converts. Fix (code, not made here): give the
section an `id`, link the promise to it, or render the terms component on the service pages — the
copy already comes from `site.guaranteeTerms`, so it costs nothing new.

---

## 2. Navigation architecture

### Principles

- **Depth ≤ 2 clicks from home to any commercial page.** Currently `/services/{slug}/` is 2 hops
  (home → services → detail). A header dropdown exposing all four services makes it 1.
- **Breadcrumbs on every inner page**, rendered by `PageHero` and emitting `BreadcrumbList` from the
  same array — the markup and the graph cannot drift.
- **The nav is a promise about the site's shape.** `navLinks` now reads בית · שירותים · מחירון ·
  אזורי שירות · מדריכים · אודות · צור קשר — both new silos joined it as they landed, which is the
  rule working. A silo the nav does not acknowledge will not be crawled or used. Seven items is the
  practical ceiling for a single-row Hebrew nav; the next silo takes a slot from something else
  rather than adding an eighth.
- **No mega-menu.** Four services and a handful of locations do not justify one, and it would push
  more of the tree client-side.

### The mobile menu contract

`Navbar` is `"use client"` for one boolean. That is justified. What it must do:

- `aria-expanded` + `aria-controls` ✅ shipped
- **Escape closes and returns focus to the trigger** ✅ shipped
- Focus trap while open ✅ shipped — focus moves into the panel on open and Tab cycles inside it
- Scroll lock while open ✅ shipped — `body` overflow is locked and restored on close
- Close on route change ✅ (each link's `onClick`)
- Trigger tap target ✅ `size-11` = exactly 44 px

**The contract is now fully met.** Copy _this_ pattern into any new disclosure, and do not regress
it — the focus trap and the scroll lock were the last two open rows and they closed in `ff2545c`.
One residue, in the CTA _inside_ the open menu rather than the menu itself: the shared `md` button
token is 40 px tall (see [accessibility-and-i18n.md](accessibility-and-i18n.md) §A3).

---

## 3. The form — a WhatsApp-first funnel with no backend

`ContactForm` does **not POST anywhere.** It composes a Hebrew message and hands it to the visitor's
own WhatsApp client, then routes to `/thank-you/`. The roster records `formAccessKey: null` **by
design** — this site is deliberately not on Web3Forms like its fleet siblings.

### The failure mode that used to lose leads silently

`window.open` returns `null` when a popup blocker intervenes, and many desktop visitors have no
WhatsApp client. The form previously showed success unconditionally. **Fixed 2026-08-17**: the
return value is checked, the composed message is stored in `sessionStorage`, and `/thank-you/`
offers a manual re-open plus a phone fallback when the handoff did not happen.

**Rule:** never render a success state for an outcome you did not observe.

### Form design rules

| Rule                                                   | Why                                                                                      | State                      |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------- | -------------------------- |
| Every field has a real `<label htmlFor>`               | Placeholder-as-label fails a11y and disappears on input                                  | ✅                         |
| Per-field errors, `aria-invalid` + `aria-describedby`  | A single generic error is not announced usefully                                         | ✅                         |
| Focus moves to the first invalid field on submit       | Otherwise the error is off-screen on mobile                                              | ✅                         |
| Israeli phone validation that accepts what people type | `05X-XXXXXXX`, `05XXXXXXXX`, `+9725XXXXXXXX`                                             | ✅                         |
| `noValidate` + custom Hebrew messages                  | Browser defaults are English and generic                                                 | ✅                         |
| Consent line linking `/privacy/`                       | Collects name + phone + free text                                                        | ✅ shipped — but see below |
| Minimum fields                                         | Every field costs conversions. Name, phone, area, service, optional message is the floor | ✅                         |

### The consent line is a promise, and two things currently undercut it

The form tells the visitor their details "אינם נשמרים אצלנו" and links to `/privacy/`. Both halves
of that need work, and neither is fixed in this pass:

1. **The `/thank-you/` re-open link carries the lead in its `href`.** After a submit,
   `components/ThankYouContent.tsx:57` renders `whatsappHref(handoff?.message)` into a real anchor
   tagged `data-cta="thankyou-whatsapp"` — an href containing the visitor's **name, phone, area and
   free text**, on a page GTM runs on. GTM's Click URL variable and GA4's outbound-click `link_url`
   both capture complete hrefs, so this can put personal data into an analytics property nobody here
   controls. The static HTML is clean, so it only appears in a real post-submit session. Full
   treatment and the fix in
   [data-tracking-infrastructure.md](data-tracking-infrastructure.md) §4.
2. **`/privacy/` does not describe the analytics that actually ship** — it still says the site
   _may_ use Google Analytics, written before GTM and GA4 went live on every route. There is no
   consent mechanism of any kind in the codebase. See
   [data-tracking-infrastructure.md](data-tracking-infrastructure.md) §8 for what the page must say.

A consent line the site cannot honour is worse than none: it is a specific promise to a named
visitor, on the page where they hand over a phone number.

### Validation is UX _and_ security

Client-side validation is a courtesy, never a control — there is no server to protect, but the
WhatsApp deep link is built from user input, so values must be URL-encoded (`whatsappHref` does
this) and never interpolated into markup.

One measurement consequence worth knowing before anyone builds a lead trigger: `data-cta`
`form-whatsapp` sits on the submit button, and the validation gate returns _after_ the click. A
click trigger on that attribute therefore counts failed submits as leads. **The lead signal has to
come from a `dataLayer` push after validation passes, not from the button.**

---

## 4. Page-level conversion patterns

### Above the fold

Answer the visitor's question and offer the action. On a service page that means: H1, one-line
value statement, the **40-60 word answer block**, and a visible call affordance — before any
narrative.

### Price transparency converts

`/pricing/` ships because "כמה עולה איתור נזילות" is a top commercial query _and_ because hiding
price is a conversion tax on a crisis purchase. It states the entry price, what moves it, and that
the final number is given before the visit; the guarantee terms sit at its foot. Vagueness reads as
a trap. Note the entry price itself is **still unconfirmed** (business-facts) — it is published, so
confirming it is a live obligation, not a tidy-up.

One structural gap: **no service page links to `/pricing/`.** The only route there is the navbar,
which means the money-intent page is reached by navigation rather than by the pages that create the
intent.

### Honest limits convert

Counter-intuitive but reliable: the honest-limits section on each service page ("what a thermal
camera cannot see") **increases** trust and **reduces** wasted call-outs. It also pre-qualifies —
a caller who read it arrives with correct expectations.

### The thank-you page is a conversion surface, not a dead end

`/thank-you/` ships. It is `noindex` and deliberately absent from the sitemap (thin; a stray SERP
entry would inflate conversion counts), it confirms what happened, offers the re-open/phone fallback
when the handoff did not fire, sets expectations and moves focus to its heading on arrival.

Two things about it that are easy to get wrong:

- **It is reached only by client-side navigation.** `router.push("/thank-you/")` in `ContactForm` is
  its single inbound path — nothing links to it. So a GTM All Pages trigger never sees it, and the
  conversion this page exists to record counts **zero**. It needs a History Change trigger; see
  [data-tracking-infrastructure.md](data-tracking-infrastructure.md) §6 before configuring anything.
- **Its WhatsApp re-open link currently carries the visitor's name and phone in the href** (§3).
  That must be resolved before this page is used as an Ads conversion target, because the
  measurement and the leak arrive through the same click.

---

## 5. Security posture

Static export, no server, no API routes, no database, **no form backend**. The attack surface is
therefore narrow and specific: response headers, **one third-party tag**, the deploy chain, and
secret hygiene. That third item is new since this section was written — the site is no longer
script-free, and several of the claims below used to depend on it being so.

### Headers — `public/_headers` (Cloudflare Pages)

> There is **no `.htaccess`**. The Apache/cPanel origin was retired at the 2026-08-02 cutover; an
> `.htaccess` in `public/` would deploy as a downloadable file and do nothing.

Shipped and verified live (the file also carries a report-only CSP — see below):

```
Strict-Transport-Security: max-age=31536000
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
```

Deliberate omissions, both requiring owner sign-off (business-facts §F): **`includeSubDomains`**
(mail/webmail subdomains are not guaranteed HTTPS) and **`preload`** (near-irreversible).

Two things the header file is now behind on, both open:

- **`interest-cohort=()` is dead.** It targeted FLoC, which Chrome removed. Its live successor is
  `browsing-topics=()` — and Topics is an advertising signal **a Google tag can read**, which
  stopped being academic the day GTM landed here. Denying it by default is the right posture for a
  site whose privacy story is "we don't keep your details". While editing, the list is also thin for
  2026: `payment`, `usb`, `midi`, `display-capture`, `accelerometer` and `autoplay` are all unused
  here and free to deny.
- **No `/images/*` cache rule**, so a Cloudflare zone default owns the policy for the LCP hero and
  the every-page logo — see [performance-guidelines.md](performance-guidelines.md) §5.

`out.prev/_headers` is the rollback snapshot. **Never hand-edit it.**

⚠️ **A header change is inert until the site is redeployed.** And always verify against the live
response — Pages merges its own defaults:

```bash
curl -sSI https://thermoleak.co.il/ | grep -iE "strict-transport|x-frame|content-security"
```

### CSP — what actually ships, and what `script-src` is really doing

**GTM ships on every route.** The CSP was widened for it in the _same commit_ as the tag install
(`f06aab8`), which is the rule working. `public/_headers` currently carries, report-only:

```
default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
connect-src 'self' https://www.google-analytics.com https://*.analytics.google.com
  https://*.googletagmanager.com;
img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com;
style-src 'self' 'unsafe-inline'; font-src 'self'; object-src 'none';
frame-src https://www.googletagmanager.com; base-uri 'self'; form-action 'self';
frame-ancestors 'self'
```

> ⛔ **Do not "restore" `script-src 'self'`.** An earlier version of this section printed that as the
> target. It would block the live container and silently zero every analytics signal — and it was
> never achievable anyway, for a reason that has nothing to do with GTM.

**`'unsafe-inline'` in `script-src` is structural, not a concession to the tag manager.**
`output: "export"` means there is no server and therefore no per-request nonce, while each page
ships the RSC flight payload as **31 bare inline `<script>` blocks**. Enforce `script-src 'self'`
and the static HTML still renders but hydration dies — taking `ContactForm`, the only lead-capture
surface, and the mobile menu with it. That is precisely the revenue bug this section warns about,
sitting inside the policy it used to recommend.

So be honest about which directives are doing the work here: **`object-src 'none'`,
`base-uri 'self'`, `form-action 'self'` and `frame-ancestors 'self'`.** `script-src` is a host
allowlist, not an XSS control. What compensates: there is no user-generated HTML anywhere, and
`EmailOff` is the sole `dangerouslySetInnerHTML`, taking build-time constant strings only.

**Promotion to enforcing — the documented process is currently unexecutable.** "Report-only →
observe a week of real traffic → enforce" assumes reports are being collected. They are not: the
policy has **no `report-uri` and no `report-to`**, so it prints to each visitor's own console and
nothing else. (Cloudflare's `Report-To: {"group":"cf-nel"…}` in the live response is Network Error
Logging and cannot receive CSP reports — an easy misread from `curl` output.) Replace the gate with
something deterministic: **deploy the policy as enforcing to a Pages preview branch, walk every
route plus a real form submit through to `/thank-you/` with the console open, and promote only if
zero violations appear.** Before that walk, widen `connect-src` — a CSP host wildcard requires at
least one label, so `*.analytics.google.com` matches neither the `analytics.google.com` apex nor
GA4's regional `region1.google-analytics.com` endpoint, and today those show up as "noise" in a
report nobody receives.

One standing caveat: the container is shared with ten other fleet sites and is not configured from
this repo, so **an enforcing CSP here is a permanent dependency on a config this repo cannot see.**
A fleet-wide tag change could start requesting an origin the policy does not allow. Weigh that
before dropping `-Report-Only`.

### The EmailOff pattern (do not "clean this up")

Cloudflare Scrape Shield rewrites `mailto:` links into `/cdn-cgi/l/email-protection#…`, which
**404s** for crawlers and for anyone without JS. `EmailOff` wraps addresses in real
`<!--email_off-->` markers via `dangerouslySetInnerHTML` — build-time constant strings, never user
input. Every visible email must be wrapped.

### Secret hygiene — the repo is PUBLIC

- The only key-shaped string in the repo is the Google Search Console verification token — **public
  by design**.
- Deploy credentials live in the Sys Admin control plane, consumed by the fleet ops script.
  **Neither this repo nor its CI holds a credential**; the old SSH Actions secrets were deleted
  2026-08-17.
- Any credential appearing in the repo or a workflow is Critical.

### Deploy chain

`.github/workflows/deploy.yml` is **build-only CI**. Production ships via the fleet ops script
(wrangler → Cloudflare Pages) with a Pages-API drift check, an output gate, `out.prev/` rollback and
a deploy log. Any PR reintroducing a deploy step, a secret, or an rsync path is a regression — that
pattern caused 15 days of silent deploy failure.

⚠️ **`logs/deploys.csv` does not exist in this repo** — there is no `logs/` directory at all, so
deploy provenance cannot be checked locally, which is exactly the check the 15-day incident argues
for. Either the ops script writes it elsewhere or nothing writes it; find out and correct whichever
statement is wrong. Until then, verify a deploy against the **live response**, never against a log.

Two hardening items in the workflow itself, unowned by any dimension so far: `actions/checkout` and
`actions/setup-node` are float-tagged rather than SHA-pinned, and `npm ci` runs lifecycle scripts —
the one place third-party code executes with repo context.

### Dependency posture

Four runtime dependencies. Every new dependency must survive "can the platform already do this?"

**Triage on the right axis: runtime-shipped vs build-only, not prod-tree vs dev-tree.** The old rule
("a devDependency advisory does not ship to users") gives the wrong answer here, because the open
advisories are all in the _production_ tree — they are `next`'s own dependencies — and none of them
reaches a visitor. Under `output: "export"` plus `images: { unoptimized: true }`, Next's server,
middleware, Server Actions, rewrites and Image Optimization API never run in production, and `sharp`
is never invoked. So report both `npm audit --omit=dev` and `npm audit`, then classify each
advisory by whether its code path can execute on a static export. **Re-triage on every Next bump**,
and write the conclusion down — otherwise every future auditor re-derives it from scratch. A
non-blocking `npm audit --omit=dev --audit-level=high || true` in CI would at least make a new
advisory visible.

---

## 6. Checklist

**Conversion**

- [ ] Call and WhatsApp reachable without scrolling, every page, mobile and desktop.
- [ ] Every CTA carries `data-cta="{location}-{action}"` — against the 19-value inventory in
      [data-tracking-infrastructure.md](data-tracking-infrastructure.md) §4, not against §1's
      surface map.
- [ ] **A tagged CTA is not a tracked CTA.** Confirm something actually consumes the attribute
      before reporting conversion coverage.
- [ ] No success state rendered for an unobserved outcome.
- [ ] Focus moves to the first invalid field; consent line present, linked, and **true**.
- [ ] No trust signal that business-facts does not confirm; no urgency mechanics.
- [ ] No PII in any tagged `href` — check `/thank-you/` after a real submit, not the static HTML.

**Security**

- [ ] Headers verified against the **live** response after deploy.
- [ ] HSTS without `preload`/`includeSubDomains` unless signed off.
- [ ] CSP: never propose `script-src 'self'` on this build; widen in the same commit as any new
      third party; promote to enforcing only via an enforcing preview-branch walk.
- [ ] `Permissions-Policy` denies `browsing-topics`, not the retired `interest-cohort`.
- [ ] Every visible email wrapped in `EmailOff`.
- [ ] No credential in the repo or CI; no deploy step in the workflow.
- [ ] Advisories triaged by "can this code path run on a static export?", with the conclusion
      written down.
