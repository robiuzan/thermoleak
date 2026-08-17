---
name: web-security-headers
description: Security posture for a static export on cPanel behind Cloudflare — public/.htaccess for HSTS, X-Frame-Options and Permissions-Policy, why the CSP is unusually cheap on a site with no third-party scripts, the no-origin-redirect rule, the WhatsApp-only form and its PII surface, the EmailOff markers, and secret hygiene in a PUBLIC repo. Use when adding headers, planning a CSP, or auditing security. Triggers "security headers", "CSP", "HSTS", ".htaccess", "is the form safe", "clickjacking".
---

# Security headers & posture

`output: "export"` means Next's `headers()` is unavailable. Headers here come from
**`public/.htaccess`**, read by Apache on the cPanel origin, with Cloudflare proxying in front.

> ⚠️ This is **not** a Cloudflare Pages site. There is no `public/_headers` file and adding one does
> nothing. The fleet's Pages sites use `_headers`; this one uses `.htaccess`.

## What `public/.htaccess` currently does

```apache
ErrorDocument 404 /404.html
# mod_expires rules for css/js/svg/webp/woff2
# Cache-Control: public, max-age=31536000, immutable  on (css|js|woff2|svg)
```

That's all. **No HSTS, no X-Frame-Options, no Permissions-Policy, no X-Content-Type-Options, no
Referrer-Policy, no CSP.** Some of these may be supplied by Cloudflare — **verify against the live
response before declaring anything missing:**

```bash
curl -sSI https://thermoleak.co.il/ | grep -iE 'strict-transport|content-security|x-frame|permissions|x-content-type|referrer|access-control'
```

## The rule that must not be broken

`public/.htaccess` opens with its own warning:

> HTTPS redirect is handled by Cloudflare ("Always Use HTTPS"); do **NOT** add one here or it can loop.

Any header work must preserve that. An origin-side HTTPS rewrite behind an orange-cloud proxy is a
classic redirect loop.

## The `.htaccess` baseline to propose

```apache
<IfModule mod_headers.c>
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), interest-cohort=()"
</IfModule>
```

Notes before shipping this:

- **HSTS `preload` is close to irreversible.** Ship `max-age` first, without the `preload` token, and
  only add it if the owner accepts that the domain and every subdomain must stay HTTPS indefinitely.
- `SAMEORIGIN` over `DENY` leaves room for a future Business Profile or map embed of the site itself.
- Wrap everything in `<IfModule mod_headers.c>` — the existing file already does, because a missing
  module on a shared host turns a bare `Header` directive into a 500.
- Cloudflare may already add some of these. Adding a duplicate is usually harmless but check for
  conflicting values, not just presence.

## CSP — unusually cheap here, so don't waste it

Most sites can't ship a tight CSP because an inline analytics snippet needs a nonce a static export
can't generate. **This site has no analytics, no GTM, and no third-party script of any kind.** The only
`dangerouslySetInnerHTML` is `components/EmailOff.tsx`, injecting two build-time constant HTML comments
(`<!--email_off-->` / `<!--email_on-->`) — never user input, and comments carry no script.

So a genuinely strict policy is achievable:

```apache
Header always set Content-Security-Policy-Report-Only "default-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'"
```

- `'unsafe-inline'` in `style-src` stays — Next emits inline styles, and removing it costs more than
  it's worth here.
- No `script-src` allowlist is needed **today**. The moment GTM is installed (`/tracking-analytics`)
  this needs `https://www.googletagmanager.com`, `https://www.google-analytics.com`, a `frame-src` for
  the `<noscript>` iframe, and either a hash or `'unsafe-inline'` for the bootstrap snippet. Do that
  work in the same pass as the install, not as a later audit.
- The form posts nowhere, so `form-action 'self'` is accurate — it does not need `api.web3forms.com`
  like the fleet siblings.

**Process:** ship report-only → observe real traffic for at least a week → then tighten and enforce.
Shipping an enforcing CSP untested breaks something silently, and on a lead-gen site that is a revenue
bug.

## The lead form

- `components/ContactForm.tsx` **does not POST anywhere.** It builds a Hebrew message from the field
  values and hands it to `window.open(whatsappHref(...))` — the visitor's own data going to the
  visitor's own WhatsApp client. No endpoint, no access key, no server-side store.
- The roster records `formAccessKey: null` **by design** — this site is deliberately not on Web3Forms
  like its nine fleet siblings. Don't "fix" that without a decision.
- There is **no honeypot** and no rate limiting, which matters far less with no endpoint to abuse.
- **Consent:** the form collects name, phone, area and free text. `/privacy/` exists and is substantive
  but the form never links to it. Add the link (see `/conversion-cro`).
- **No PII anywhere else.** There is no `dataLayer` today; when analytics lands, keep it that way — the
  form has name and phone in scope at submit time, so this is a real risk, not a theoretical one.

## Secret hygiene — the repo is PUBLIC

`.github/workflows/deploy.yml` states it outright and warns against reusing the fleet-wide Sys Admin
token here. Two things that look like secrets and are not:

- The Google Search Console verification token in `app/layout.tsx:32` — **public by design**.
- There is no form access key at all.

The real secrets live in GitHub Actions: `SSH_PRIVATE_KEY`, `SSH_HOST`, `SSH_USER`. They are never
echoed by the workflow. Verify that stays true of any workflow edit.

```bash
npm audit --omit=dev    # runtime — matters
npm audit               # includes dev — usually informational for a static export
```

Report the two separately. A devDependency advisory does not ship to users here.

## The deploy chain as attack surface

Every push to `main` builds and rsyncs `./out/` to the docroot with `--delete` over SSH. Assess honestly:

- `--delete` makes the docroot exactly match the build; `.well-known` is excluded so cPanel AutoSSL
  keeps working. Both correct.
- `StrictHostKeyChecking=accept-new` trusts the host on first contact — acceptable for a fixed known
  host, worth noting.
- **There is no manual gate.** A bad merge or a compromised branch ships straight to production. That is
  the single most consequential security property of this repo, and it is a process control, not a code
  fix.
- The workflow deliberately has **no Cloudflare cache-purge step**, and its comment block explains why
  (HTML is served uncached; a purge that could only ever fail was masking real failures). Don't
  reinstate it without a caching rule to justify it, and if you do, mint a token scoped to
  Zone → Cache Purge on this zone alone.

## Checklist

- [ ] Headers verified with `curl -sSI` against the **live** site, before and after any change.
- [ ] `public/.htaccess` additions wrapped in `<IfModule mod_headers.c>`.
- [ ] **No** origin-side HTTPS redirect added.
- [ ] HSTS without `preload` unless the owner has explicitly accepted it.
- [ ] CSP is **report-only** and has been observed for a full week including a real form submit.
- [ ] Form links to `/privacy/`.
- [ ] No PII in any future `dataLayer`.
- [ ] `npm audit --omit=dev` clean or triaged.
- [ ] No secrets in a public repo; workflow never echoes them.

## Gotchas

- Never verify a header from the repo. Cloudflare adds, merges and sometimes overrides.
- `_headers` files do nothing here. This is Apache, not Cloudflare Pages.
- Zone-level settings (Scrape Shield, AI Crawl Control, cache rules) are the **owner's** to change.
  Document the toggle; never assume it was flipped. Note that Scrape Shield's email obfuscation **is**
  active on this zone — that's what `EmailOff` exists to work around.
