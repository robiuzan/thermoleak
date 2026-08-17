---
name: web-security-headers
description: Security posture for a static export on Cloudflare Pages — public/_headers for HSTS, X-Frame-Options and Permissions-Policy, why the CSP is unusually cheap on a site with no third-party scripts, public/_redirects, the WhatsApp-only form and its PII surface, the EmailOff markers, and secret hygiene in a PUBLIC repo. Use when adding headers, planning a CSP, or auditing security. Triggers "security headers", "CSP", "HSTS", "_headers", "is the form safe", "clickjacking".
---

# Security headers & posture

`output: "export"` means Next's `headers()` is unavailable. **Cloudflare Pages is the origin**
(since the 2026-08-02 cutover) and reads **`public/_headers`**, so headers are one file.

> ⚠️ There is no `.htaccess` — the Apache/cPanel origin is retired. An `.htaccess` in `public/`
> would deploy as a plain downloadable file and do nothing. The old rsync pipeline ran green
> against the retired server for 15 days (see `/deploy-thermoleak`), so **always verify headers
> against the live response, never against the repo's intent.**

## What ships today (`public/_headers`, verified live 2026-08-17)

```
/*
  Strict-Transport-Security: max-age=31536000
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
```

Notes on the choices:

- **HSTS is deliberately without `includeSubDomains`** (mail/webmail service subdomains are not
  guaranteed HTTPS) and **without `preload`** (near-irreversible — owner's call, business-facts §F).
- `SAMEORIGIN` over `DENY` leaves room for a future embed of the site itself.
- Cloudflare Pages merges `_headers` with its own defaults (`nosniff`, `referrer-policy`); it does
  not replace them. Duplicates are harmless.

Verify after any deploy:

```bash
curl -sSI https://thermoleak.co.il/ | grep -iE 'strict-transport|content-security|x-frame|permissions|x-content-type|referrer'
```

## CSP — unusually cheap here, so don't waste it

Most sites can't ship a tight CSP because an inline analytics snippet needs a nonce a static export
can't generate. **This site has no analytics, no GTM, and no third-party script of any kind.** The
only `dangerouslySetInnerHTML` is `components/EmailOff.tsx`, injecting two build-time constant HTML
comments — never user input, and comments carry no script.

So a genuinely strict policy is achievable, in `public/_headers`:

```
/*
  Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'
```

- `'unsafe-inline'` in `style-src` stays — Next emits inline styles.
- No `script-src` allowlist is needed **today**. The moment GTM is installed
  (`/tracking-analytics`), this needs `googletagmanager.com`, `google-analytics.com`, a
  `frame-src` for the `<noscript>` iframe, and a hash or `'unsafe-inline'` for the bootstrap
  snippet. Do that work in the same pass as the install.
- The form posts nowhere, so `form-action 'self'` is accurate — no `api.web3forms.com` needed,
  unlike the fleet siblings.

**Process:** ship report-only → observe real traffic for at least a week → then tighten and
enforce. An untested enforcing CSP breaks something silently, and on a lead-gen site that is a
revenue bug.

## `public/_redirects`

Carries the `/reviews/` → `/about/` 301 (the page was removed 2026-08-17 with the fabricated
testimonials). Any future slug rename needs its 301 here — Pages format, one rule per line.

## The lead form

- `components/ContactForm.tsx` **does not POST anywhere.** It hands the visitor's own data to the
  visitor's own WhatsApp client via a deep link, then routes to `/thank-you/`. No endpoint, no
  access key, no server-side store.
- The roster records `formAccessKey: null` **by design** — this site is deliberately not on
  Web3Forms like its fleet siblings. Don't "fix" that without a decision.
- **Consent:** the form links to `/privacy/` and states the data isn't stored — keep both true.
- **No PII in any future `dataLayer`** — the form has name and phone in scope at submit time.

## Secret hygiene — the repo is PUBLIC

- The only key-shaped string in the repo is the Google Search Console verification token in
  `app/layout.tsx` — **public by design**, not a leak.
- Deploy credentials (`CLOUDFLARE_TOKEN_main` / `CLOUDFLARE_ACCOUNT_main`) live in the Sys Admin
  control plane's `secrets/.env`, consumed by the fleet ops script. **Nothing in this repo or its
  CI holds a credential** — the old SSH secrets were removed with the rsync path.

```bash
npm audit --omit=dev    # runtime — matters
npm audit               # includes dev — usually informational for a static export
```

Report the two separately. A devDependency advisory does not ship to users here.

## Checklist

- [ ] `public/_headers` changes verified with `curl -sSI` against the **live** site after deploy —
      a header edit does nothing until the site is redeployed (`/deploy-thermoleak`).
- [ ] HSTS without `preload`/`includeSubDomains` unless the owner has explicitly accepted them.
- [ ] CSP is **report-only** and observed for a full week (including a real form submit) before
      enforcing.
- [ ] No PII in `dataLayer`.
- [ ] `npm audit --omit=dev` clean or triaged.
- [ ] No credentials anywhere in this public repo.

## Gotchas

- Never verify a header from the repo. Pages merges its defaults, and a stale deploy serves stale
  headers.
- A CSP that blocks `googletagmanager.com` after GTM lands silently kills every conversion signal.
- Zone-level settings (Scrape Shield, AI Crawl Control, cache rules) are the **owner's** to change.
  Scrape Shield's email obfuscation applies to Pages responses too — `EmailOff` stays.
