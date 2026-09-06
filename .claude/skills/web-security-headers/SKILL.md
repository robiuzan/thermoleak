---
name: web-security-headers
description: Security posture for a static export on Cloudflare Pages — public/_headers for HSTS, X-Frame-Options and Permissions-Policy, the shipped Report-Only CSP that already allows the live GTM and what promoting it to enforcing would take, public/_redirects, the WhatsApp-only form and its PII surface, the EmailOff markers, and secret hygiene in a PUBLIC repo. Use when adding headers, planning a CSP, or auditing security. Triggers "security headers", "CSP", "HSTS", "_headers", "is the form safe", "clickjacking".
---

# Security headers & posture

`output: "export"` means Next's `headers()` is unavailable. **Cloudflare Pages is the origin**
(since the 2026-08-02 cutover) and reads **`public/_headers`**, so headers are one file.

> ⚠️ There is no `.htaccess` — the Apache/cPanel origin is retired. An `.htaccess` in `public/`
> would deploy as a plain downloadable file and do nothing. The old rsync pipeline ran green
> against the retired server for 15 days (see `/deploy-thermoleak`), so **always verify headers
> against the live response, never against the repo's intent.**

## What ships today (`public/_headers`, verified against the live response 2026-09-06)

```
/*
  Strict-Transport-Security: max-age=31536000
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com; img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; font-src 'self'; object-src 'none'; frame-src https://www.googletagmanager.com; base-uri 'self'; form-action 'self'; frame-ancestors 'self'

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
```

That is the entire file, comment header aside — **including a CSP**. A `curl` of the live site
returned exactly these six `/*` headers on 2026-09-06.

Notes on the choices:

- **HSTS is deliberately without `includeSubDomains`** (mail/webmail service subdomains are not
  guaranteed HTTPS) and **without `preload`** (near-irreversible — owner's call, business-facts §F).
- `SAMEORIGIN` over `DENY` leaves room for a future embed of the site itself.
- Cloudflare Pages merges `_headers` with its own defaults (`nosniff`, `referrer-policy`); it does
  not replace them. Duplicates are harmless.
- ⚠️ **The comment header inside `public/_headers` (lines 6–9) is itself stale.** It says the CSP
  was shipped "BEFORE any analytics lands" and that the site "currently has zero third-party
  scripts" — untrue since `f06aab8`. Lines 10–11, the promote-to-enforcing gate, are still accurate.
  Correcting that comment is a `public/_headers` edit; it changes no served header.
- ⚠️ **`interest-cohort=()` is a dead directive.** FLoC was withdrawn; the successor it was meant to
  block is the Topics API, gated by `browsing-topics=()`. Nothing breaks today — the header simply
  opts out of nothing. Adding `browsing-topics=()` is a one-token change to `public/_headers`;
  it is open, not done.

Verify after any deploy:

```bash
curl -sSI https://thermoleak.co.il/ | grep -iE 'strict-transport|content-security|x-frame|permissions|x-content-type|referrer'
```

## CSP — shipped, Report-Only, and already widened for GTM

**This site ships analytics.** Container **GTM-KWGGH438** (the shared Israeli-fleet container, id at
`lib/site.ts:111`) renders from `components/Analytics.tsx`, mounted in `app/layout.tsx`, on every
route. The CSP was widened for it **in the same commit as the tag** (`f06aab8`) — that is the rule
this repo follows, and it was followed. **Do not "restore" a `script-src 'self'` policy.** There is
no version of this site that can serve one.

**`'unsafe-inline'` in `script-src` is structural, not laziness.** `output: "export"` emits the RSC
flight payload as inline `<script>` blocks: `out/index.html` carries 31 inline scripts, 30 of them
`self.__next_f.push(...)`, plus the GTM bootstrap. A nonce needs a per-response server and there
isn't one; hashes would have to be recomputed from `out/` on every build by a step that does not
exist. `'unsafe-inline'` would still be required here **even if GTM were removed tomorrow**.

**So read `script-src` as a host allowlist, not as an XSS control.** The directives doing real work
in this policy are `object-src 'none'`, `base-uri 'self'`, `form-action 'self'` and
`frame-ancestors 'self'`. What compensates for the weak `script-src` is that **no user-generated
content is ever rendered as HTML** — `components/EmailOff.tsx:20-21` is the only
`dangerouslySetInnerHTML` in the repo and it takes two build-time constant comment strings. Keep it
that way: the day a component interpolates visitor input into HTML, this policy stops covering you.

`form-action 'self'` is still accurate — the form posts nowhere, so no `api.web3forms.com` is
needed, unlike the fleet siblings.

### The one remaining task: promote Report-Only to enforcing

Mechanically it is one edit — drop `-Report-Only` from the directive name, nothing else changes.
Three things have to be settled first, and none of them is a code change:

1. **There is no report channel.** The header carries no `report-uri` and no `report-to`, so
   violations surface only in the console of whoever has DevTools open. "Observe a week of real
   traffic" is not something this site can currently do. Either wire a collector (a static export
   cannot receive reports itself — it needs an external endpoint or a Cloudflare Worker, so this is
   an owner/infra decision, business-facts §F), or accept that observation means a human walking
   every route and submitting the form with the console open — and record that you accepted it.
2. **The GA4 host list is probably incomplete.** `connect-src` allows `www.google-analytics.com` and
   `*.analytics.google.com` but **not** `*.google-analytics.com` — GA4 regional collection uses
   `region1.google-analytics.com`, and Google Signals uses `stats.g.doubleclick.net`. Neither is
   allowed today. Under Report-Only that is a console warning; under enforcement it is silently lost
   analytics. Confirm the real hosts from real traffic before flipping; do not extend the list from
   this paragraph.
3. **The container is shared and this repo does not control it.** GTM-KWGGH438 serves ten fleet
   sites. A tag someone adds fleet-wide can call a host this CSP has never heard of, and enforcement
   would block it on this domain only. That is the strongest argument for leaving Report-Only in
   place until item 1 exists.

Tightening `'unsafe-inline'` further (`'strict-dynamic'` plus per-build hashes) is a genuine option,
but it costs a build step that extracts the hashes from `out/`. Price that before proposing it.

## `public/_redirects`

Four rules ship, all of them fixed same-origin paths:

- `/reviews` and `/reviews/*` → `/about/` 301 — the page was removed 2026-08-17 with the fabricated
  testimonials, and returns only when verifiable reviews exist.
- `/404/` and `/_not-found/` → `/` 301 — the two crawlable directory forms of the 404 route.
  **`/404.html` is deliberately NOT redirected**; Pages needs it to serve real 404 responses.

Any future slug rename needs its 301 here — Pages format, one rule per line. **Never add a rule
whose destination is an absolute off-site URL, and never one that interpolates a captured path
segment into a destination host.** That is an open redirect, and on a domain visitors are being
asked to trust with a leak emergency it is a ready-made phishing lever. Every rule here today is a
literal same-origin path — keep the pattern, and treat a splat in a destination as a review stop.

## The lead form

- `components/ContactForm.tsx` **does not POST anywhere.** It hands the visitor's own data to the
  visitor's own WhatsApp client via a deep link, then routes to `/thank-you/`. No endpoint, no
  access key, no server-side store.
- The roster records `formAccessKey: null` **by design** — this site is deliberately not on
  Web3Forms like its fleet siblings. Don't "fix" that without a decision.
- **Consent:** the form links to `/privacy/` and states the data isn't stored — keep both true.
- **No PII in `dataLayer`** — the form has name and phone in scope at submit time. This is no longer
  a "future" concern: GTM is live on every route, `/thank-you/` included.

### 🔴 OPEN — PII sits in a clickable `href` on `/thank-you/` (finding SEC-3)

After a real submit, `components/ThankYouContent.tsx:57` builds `whatsappHref(handoff?.message)` and
puts the result straight into the `href` of an anchor tagged `data-cta="thankyou-whatsapp"`
(:84-93). That href therefore carries the lead's **full name and mobile number**, URL-encoded
(`lib/site.ts:133-135` appends the message as `?text=`). GTM's built-in Click URL variable captures
an element's whole href, and GA4 Enhanced Measurement's outbound-click event sends it as `link_url`
— into a shared container this repo does not control. That breaks the prohibition this codebase
states three times (`components/Analytics.tsx:23-24`, backlog §13.4, CLAUDE.md §12), and it makes
the form's own consent line — ״הם אינם נשמרים אצלנו״ — false.

**The static HTML is clean.** The fallback href in `out/thank-you/index.html` is a generic prefill,
so this only exists in a real post-submit session. Grepping the build will not find it, and neither
will reading the container config. The check is: submit the form, open the Network tab, confirm no
`/g/collect` request carries the name or the phone.

Closing it is a code change in `components/ThankYouContent.tsx` — keep the generic
`whatsappHref()` in the attribute and open the prefilled link from an `onClick` that calls
`preventDefault()`. The no-JS fallback and the `data-cta` trigger both survive. **Do not mark this
resolved from the markup — resolve it from the request.**

### Open question — form abuse was never assessed

There is no honeypot field, no timing check and no rate limit anywhere on the only lead path.
Before anyone "fixes" that, note that the ordinary threat model does not apply here: **there is no
endpoint.** A bot that fills this form only opens WhatsApp in its own browser. Nothing reaches the
business, so there is no inbox to flood and nothing to rate-limit server-side.

What is genuinely open, and unmeasured:

- The WhatsApp number and the `tel:` link are public on every page by design. Whether that is
  producing scraped-number spam is an **owner observation** — this repo cannot measure it. Ask;
  don't assume either way.
- **The moment the form gains a POST endpoint** — Web3Forms like the fleet siblings, a Worker,
  anything — a honeypot and a submission-rate check become mandatory **in the same commit**, exactly
  as the CSP was widened in the same commit as GTM. That is the standing rule, not a follow-up
  ticket to file later.

## Secret hygiene — the repo is PUBLIC

- The only key-shaped string in the repo is the Google Search Console verification token in
  `app/layout.tsx` — **public by design**, not a leak.
- Deploy credentials (`CLOUDFLARE_TOKEN_main` / `CLOUDFLARE_ACCOUNT_main`) live in the Sys Admin
  control plane's `secrets/.env`, consumed by the fleet ops script. **Nothing in this repo or its
  CI holds a credential** — the old SSH secrets were removed with the rsync path.

## Dependency advisories — triage on "does it ship", not "is it a devDependency"

```bash
npm audit --omit=dev    # the production tree
npm audit               # everything
```

Report the two separately — but do **not** stop at the prod/dev split, because it cannot classify
this repo's advisories: the framework itself is a production dependency that here runs almost
entirely at build time. The axis that actually works is **runtime-shipped vs build-only**. With
`output: "export"` there is no server, no middleware, no Server Actions, no API routes and no Image
Optimization API (`images.unoptimized`), so a package that only runs during `next build` cannot be
reached by a visitor at all.

**Standing triage, as of 2026-09-06:** `npm audit --omit=dev` reports **4 high — `next`, `nanoid`,
`postcss`, `sharp`**. Every one is build-time-only under this configuration; the `next` advisories
are Server Actions, middleware, rewrite and image-optimizer paths that do not exist in a static
export. None is visitor-reachable. **Re-run and re-triage on every Next bump** instead of carrying
that sentence forward unchecked, and report the count _with_ the reasoning — never just "clean".

## Checklist

- [ ] `public/_headers` changes verified with `curl -sSI` against the **live** site after deploy —
      a header edit does nothing until the site is redeployed (`/deploy-thermoleak`).
- [ ] HSTS without `preload`/`includeSubDomains` unless the owner has explicitly accepted them.
- [ ] The CSP still allows `googletagmanager.com` in **both** `script-src` and `frame-src` (the
      `<noscript>` iframe). Any narrowing that drops either is a regression, not a hardening.
- [ ] Before promoting the CSP to enforcing: a report channel exists — or manual observation is
      explicitly accepted and written down — and the GA4 hosts were confirmed from real traffic.
- [ ] No PII in `dataLayer` **and none in any `href`, `data-*` value or `document.title`**. GTM reads
      the DOM, not only what you push (SEC-3).
- [ ] `npm audit --omit=dev` reported with its runtime-shipped/build-only triage, not just a count.
- [ ] No credentials anywhere in this public repo.

## Gotchas

- Never verify a header from the repo. Pages merges its defaults, and a stale deploy serves stale
  headers.
- A CSP that blocks `googletagmanager.com` silently kills every conversion signal — and that is not
  hypothetical any more. The policy on disk already allows it, so the realistic failure mode is a
  well-meant "tighten the CSP" pass that takes the allowance back out. **Read the live header before
  you write a new one.**
- **Report-Only blocks nothing.** A wrong policy shipped today produces console warnings, not an
  outage — which is precisely how a wrong policy sits unnoticed until someone promotes it to
  enforcing and the breakage arrives months later, attributed to something else.
- GTM-KWGGH438 is **shared with ten fleet sites** and is not controlled from this repo. Any
  hardening that assumes a fixed set of third-party hosts is assuming something you cannot see.
- Zone-level settings (Scrape Shield, AI Crawl Control, cache rules) are the **owner's** to change.
  Scrape Shield's email obfuscation applies to Pages responses too — `EmailOff` stays.
