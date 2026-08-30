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
   direct                  price transparency          form → /thank-you/ (tertiary)
                           proof (reviews, cases)
```

**Design implication:** a visitor must be able to act from *any* scroll position on *any* page
without hunting. That is why the sticky mobile bar exists and why it must never be removed to
"clean up" a layout.

### Conversion inventory — every page, every state

| Surface | Call | WhatsApp | Form | Status |
| --- | --- | --- | --- | --- |
| Navbar (desktop) | ✅ `header-call` | — | — | shipped |
| Hero | ✅ `hero-call` | ✅ `hero-whatsapp` | — | shipped |
| Sticky bar (mobile) | ✅ `sticky-call` | ✅ `sticky-whatsapp` | — | shipped |
| Service sidebar | ✅ `service-call` | — | ✅ `service-form` | shipped |
| Pricing CTA band | ✅ `pricing-call` | ✅ `pricing-whatsapp` | — | shipped |
| ContactCTA (page foot) | ✅ `finalcta-call` | ✅ `finalcta-whatsapp` | ✅ | shipped |
| Footer | ✅ `footer-call` | ✅ `footer-whatsapp` | — | shipped |
| `/thank-you/` | ✅ `thankyou-call` | ✅ `thankyou-whatsapp` | — | shipped |

Every CTA carries a `data-cta="{location}-{action}"` attribute. **No JS ships for it** — GTM click
triggers match on the attribute. Adding one is free; omitting one makes the click permanently
invisible. Any new CTA without one is an incomplete CTA.

---

## 2. Navigation architecture

### Principles

- **Depth ≤ 2 clicks from home to any commercial page.** Currently `/services/{slug}/` is 2 hops
  (home → services → detail). A header dropdown exposing all four services makes it 1.
- **Breadcrumbs on every inner page**, rendered by `PageHero` and emitting `BreadcrumbList` from the
  same array — the markup and the graph cannot drift.
- **The nav is a promise about the site's shape.** `navLinks` currently reads בית · שירותים · מחירון ·
  אודות · צור קשר. When `/guides/` and `/locations/` land, they join it — a silo the nav does not
  acknowledge will not be crawled or used.
- **No mega-menu.** Four services and a handful of locations do not justify one, and it would push
  more of the tree client-side.

### The mobile menu contract

`Navbar` is `"use client"` for one boolean. That is justified. What it must do:

- `aria-expanded` + `aria-controls` ✅ shipped
- **Escape closes and returns focus to the trigger** ✅ shipped
- Focus trap while open — **open**
- Scroll lock while open — **open**
- Close on route change ✅ (each link's `onClick`)

Do not copy the pre-2026-08 pattern into any new disclosure.

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

| Rule | Why | State |
| --- | --- | --- |
| Every field has a real `<label htmlFor>` | Placeholder-as-label fails a11y and disappears on input | ✅ |
| Per-field errors, `aria-invalid` + `aria-describedby` | A single generic error is not announced usefully | ✅ |
| Focus moves to the first invalid field on submit | Otherwise the error is off-screen on mobile | ✅ |
| Israeli phone validation that accepts what people type | `05X-XXXXXXX`, `05XXXXXXXX`, `+9725XXXXXXXX` | ✅ |
| `noValidate` + custom Hebrew messages | Browser defaults are English and generic | ✅ |
| Consent line linking `/privacy/` | Collects name + phone + free text | ✅ |
| Minimum fields | Every field costs conversions. Name, phone, area, service, optional message is the floor | ✅ |

### Validation is UX *and* security
Client-side validation is a courtesy, never a control — there is no server to protect, but the
WhatsApp deep link is built from user input, so values must be URL-encoded (`whatsappHref` does
this) and never interpolated into markup.

---

## 4. Page-level conversion patterns

### Above the fold
Answer the visitor's question and offer the action. On a service page that means: H1, one-line
value statement, the **40-60 word answer block**, and a visible call affordance — before any
narrative.

### Price transparency converts
`/pricing/` exists because "כמה עולה איתור נזילות" is a top commercial query *and* because hiding
price is a conversion tax on a crisis purchase. State the entry price, what moves it, and that the
final number is given before the visit. Vagueness reads as a trap.

### Honest limits convert
Counter-intuitive but reliable: the honest-limits section on each service page ("what a thermal
camera cannot see") **increases** trust and **reduces** wasted call-outs. It also pre-qualifies —
a caller who read it arrives with correct expectations.

### The thank-you page is a conversion surface, not a dead end
`/thank-you/` is `noindex` (thin; a stray SERP entry would inflate conversion counts) but it must:
confirm what happened, offer the re-open/phone fallback, set expectations ("we call back within
business hours"), and tell the visitor what to prepare. It is also the cleanest Google Ads
conversion target once analytics land.

---

## 5. Security posture

Static export, no server, no API routes, no database, **no form backend**. The attack surface is
therefore narrow and specific: response headers, the deploy chain, and secret hygiene.

### Headers — `public/_headers` (Cloudflare Pages)

> There is **no `.htaccess`**. The Apache/cPanel origin was retired at the 2026-08-02 cutover; an
> `.htaccess` in `public/` would deploy as a downloadable file and do nothing.

Shipped and verified live 2026-08-17:

```
Strict-Transport-Security: max-age=31536000
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
```

Deliberate omissions, both requiring owner sign-off (business-facts §F): **`includeSubDomains`**
(mail/webmail subdomains are not guaranteed HTTPS) and **`preload`** (near-irreversible).

⚠️ **A header change is inert until the site is redeployed.** And always verify against the live
response — Pages merges its own defaults:

```bash
curl -sSI https://thermoleak.co.il/ | grep -iE "strict-transport|x-frame|content-security"
```

### CSP — unusually cheap here, so do not squander it
The site ships **no analytics and no third-party scripts**. The only `dangerouslySetInnerHTML` is
`EmailOff`, injecting two build-time constant HTML comments. A genuinely strict policy is therefore
achievable today:

```
Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self'; connect-src 'self';
  img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; base-uri 'self';
  form-action 'self'; frame-ancestors 'self'
```

`'unsafe-inline'` stays in `style-src` (Next emits inline styles). **Installing GTM spends this
advantage** — it will need `googletagmanager.com`, `google-analytics.com`, a `frame-src` for the
`<noscript>` iframe, and a hash or `'unsafe-inline'` for the bootstrap. Do the CSP work in the same
commit as the tag install, never as a later cleanup.

**Process: report-only → observe a full week of real traffic including a form submit → enforce.**
An untested enforcing CSP breaks something silently, and on a lead-gen site that is a revenue bug.

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

### Dependency posture
Four runtime dependencies. Report `npm audit --omit=dev` and `npm audit` separately; a
devDependency advisory does not ship to users in a static export. Every new dependency must survive
"can the platform already do this?"

---

## 6. Checklist

**Conversion**
- [ ] Call and WhatsApp reachable without scrolling, every page, mobile and desktop.
- [ ] Every CTA carries `data-cta="{location}-{action}"`.
- [ ] No success state rendered for an unobserved outcome.
- [ ] Focus moves to the first invalid field; consent line present and linked.
- [ ] No trust signal that business-facts does not confirm; no urgency mechanics.

**Security**
- [ ] Headers verified against the **live** response after deploy.
- [ ] HSTS without `preload`/`includeSubDomains` unless signed off.
- [ ] CSP report-only, observed a full week, before enforcing.
- [ ] Every visible email wrapped in `EmailOff`.
- [ ] No credential in the repo or CI; no deploy step in the workflow.
