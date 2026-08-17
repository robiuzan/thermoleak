# Optimization backlog — thermoleak.co.il

The single ranked register of what is wrong, what is missing, and what is already right. Every agent
and skill in `.claude/` cites section numbers from this file, so **keep the numbering stable** — add
sub-items rather than renumbering.

**Audited:** 2026-08-16, against the repo at commit `04c0b9d` and the export in `out/` (which was
**stale** — built 2026-07-30, three days behind the last commit; see §1.6).

**Severity:** 🔴 Critical (stop-ship) · 🟠 High · 🟡 Medium · 🔵 Low · ✅ verified good

---

## Executive summary

This is a **well-built small site with one disqualifying content problem.**

The engineering is genuinely clean: zero RTL utility violations, zero hardcoded NAP literals, zero
orphan pages, one `<h1>` and one canonical on every page, a 3.9 MB export with no oversized chunks, only
two client components, and a form with proper per-field `aria-invalid` / `aria-describedby` wiring.
Most sites audited at this size are worse on every one of those axes.

Against that: **the site ships six invented customer testimonials and publishes a 4.9 star rating
computed from them as `aggregateRating` on all 13 pages.** That is a Google policy violation, and it
sits on top of a second tier of unsourced claims (a 97% success rate, a 3,000+ job count, an
uncredentialed certification, a guarantee with no stated scope) and two social links that point at
`facebook.com` and `instagram.com`.

Everything else is depth and measurement: service pages ~30% under their word floor, no location or
article silo, no answer blocks, and **zero analytics of any kind**.

**The three things that matter most:** (1) resolve the fabricated reviews — §7.1/§4.1; (2) install
analytics so any of this can be measured — §13.1; (3) take the four service pages to their depth floor
and open with answer blocks — §3.2/§6.2.

---

## Phase 1–2 + Phase 3 content — shipped 2026-08-17 (built and gated, not yet deployed)

Resolved in the working tree; each item keeps its section number below for history. **Now
resolved:** §2.1 (both title bugs), §4.1/§7.1 (fabricated rating + testimonials removed; `/reviews/`
301s to `/about/`), §4.2/§7.6 (`sameAs` + footer socials removed), §4.3 (breadcrumbs emitted from
`PageHero`, 10/10 parity), §4.4 (`geo` removed), §7.2 (TrustBar rebuilt on verified figures),
§8.1 (form failure path + `/thank-you/` handoff), §8.3 (18 `data-cta` attributes), §8.4 (consent
link), §8.5 (focus management), §9.3 (in-copy cross-links on all four service pages), §9.5
(trailing slashes), §10.3 (logo `priority` dropped), §11.1/§11.2 (`ink/50` → `ink/70`; the
statement is true again), §11.3 partial (Escape + focus return; focus trap/scroll lock still open),
§12.1 (baseline headers via `public/_headers`, verified live), §1.3 (real `lastModified` dates),
§13.4 pre-wired.
**New surfaces:** `/pricing/` (targets כמה עולה איתור נזילות), `/thank-you/` (noindex conversion
URL), answer blocks + honest-limits sections on all four service pages, homepage method explainer,
generalFaqs 6 → 9. Emitted routes 13 → 14; sitemap stays 11.

**Deployed 2026-08-17 to Cloudflare Pages** — which surfaced the biggest infrastructure finding of
the audit: the repo's rsync-on-push pipeline had been retired by a 2026-08-02 DNS cutover to Pages
(project `thermoleak`) and ran **green against a dead server for 15 days**. The workflow is now
build-only CI, headers/redirects moved to `public/_headers`/`public/_redirects`, `.htaccess` is
deleted, and the deploy path is the fleet ops script with its Pages-API drift check (CLAUDE.md §10).
The earlier "HTML not edge-cached / TTFB 1.3–15.2 s" concern is withdrawn: Pages serves from the
edge, and those TTFB samples were polluted by local network flakiness.

**Still open and owner-blocked:** §5.3 (GBP), §7.3/§7.5 (credentials, named person), §13.1
(analytics decision), §6.1 (Cloudflare AI-crawler toggle — **confirmed live-blocking on
2026-08-17**: the managed robots.txt Disallows ClaudeBot, GPTBot, Google-Extended, CCBot and
others). Still open,
not blocked: §3 depth floors (service pages now ~450+, homepage larger, `/about/` and `/contact/`
still short), §9.2 (header dropdown), §10.2/§10.4 (image variants, font preload), §3.4/§3.5
(location + guides silos).

---

## §1 Technical SEO

**1.1 🟡 The 404 route emits twice.** `out/` contains `/404/index.html`, `/_not-found/index.html` **and**
`/404.html` — three artifacts for one route. Cloudflare Pages serves the root `/404.html` natively as
the custom 404, so the served behaviour is correct, but the two directory variants are crawlable URLs
with identical thin content. Confirm they stay excluded from the sitemap (they are) and consider a
`public/_redirects` 301 for the directory forms.

**1.2 🟠 `staticRoutes` in `app/sitemap.ts` is a hand-maintained array of 7.** Service entries derive
from `serviceSlugs` automatically; static pages don't. Add a route and it builds fine while being
silently absent from `sitemap.xml`. Fix: export one `staticRoutes` const the pages themselves reference,
or derive from the filesystem at build time.

**1.3 🟡 `lastModified: new Date()` stamps build time on all 11 URLs.** Every deploy tells search engines
every page changed. The signal is worthless — worse than omitting it. Use a real per-route date.

**1.4 🔵 `app/robots.ts` emits a `host` directive.** A Yandex extension, ignored by Google. Harmless;
drop it or keep it deliberately.

**1.5 🟡 No `public/llms.txt`.** See §6.5.

**1.6 🟠 `out/` on disk is routinely stale.** At audit time it was built 2026-07-30 against a repo last
committed 2026-08-02. Any audit, grep or word count run against it measures an artifact nobody is
serving. **Always compare `out/` mtime to `git log -1` and rebuild first.**

**✅ Verified good:** every page has exactly one self-referencing canonical with a trailing slash;
`sitemap.xml` lists 11 URLs matching the 11 content routes exactly; `robots.txt` is emitted;
`trailingSlash: true` is consistent; `export const dynamic = "force-static"` is correctly set on both
`sitemap.ts` and `robots.ts`.

---

## §2 On-page SEO

**2.1 🟠 Brand tokens in `<title>` are wrong on two routes, in opposite directions.**
The root layout sets `template: "%s | טרמוליק"`.

- **`/` renders with no brand at all:** `איתור נזילות תרמי, רטיבות ובדיקות תרמוגרפיה`. A `template`
  declared in a layout applies to child segments, **not to that layout's own `page.tsx`** — so the
  homepage title is used verbatim. This is documented Next behaviour, not a bug, and the fix is to write
  a complete title in `app/page.tsx`.
- **`/about/` renders it twice:** `אודות טרמוליק — מומחים לאיתור נזילות תרמי | טרמוליק`, because the
  page title already contains the brand.

The other nine routes are correct.

**2.2 🔵 Redundant homepage canonical.** `app/page.tsx` sets `alternates: { canonical: "/" }` while
`app/layout.tsx` already does. Harmless duplication.

**2.3 🔵 `/about/` title length.** At 47 Hebrew characters plus the doubled suffix it is the only route
at risk of SERP truncation. Fixing 2.1 fixes this.

**✅ Verified good:** all 11 content descriptions are unique and present; exactly one `<h1>` on all 13
emitted pages; heading order unbroken; OG and Twitter tags present with a 1200×630 image; Search Console
verification tag live.

---

## §3 Content depth

Floors are in [content-standards.md](content-standards.md) §1. Chrome is **~110 words** per page —
subtract it from the raw counts below.

**3.1 🟡 Homepage: 704 raw ≈ 594 unique, floor 800.** The composition is right (Hero → TrustBar →
ServicePillars → Process → Testimonials → Faq → ContactCTA); it is the per-section copy that is short.

**3.2 🟠 Service pages: 432–469 raw ≈ 322–359 unique, floor 450.** The four pages **pass the doorway
test** — each has its own `intro`, `benefits`, `steps` and FAQs, which is better than most competitors —
but they stop before the depth that ranks. Missing from all four: what the method **cannot** detect,
what the visit includes, what changes the price, and what happens after the leak is found.

**3.3 🟡 `/about/` 383 raw ≈ 273 unique (floor 500); `/contact/` 229 raw ≈ 119 unique (floor 200).**
`/about/` is the natural home for the credentials, the named owner and the company history that §7
says are missing — so its word count and its trust gap are the same problem.

**3.4 🟠 No location silo.** `site.serviceAreas` names 12 cities rendered as plain text chips with no
routes. The entire Tier-2 local layer is unexpressed. **This is an opportunity, not yet a defect** —
and building it badly (12 find-and-replace pages) would be far worse than leaving it. Gate:
content-standards §2, procedure: `/new-city`.

**3.5 🟠 No editorial silo.** No blog, no guides, no route. Every Tier-3 question in
[keyword-map.md](keyword-map.md) §2 — including the ones this business is uniquely able to answer — has
no page. Procedure: `/new-article`.

**✅ Verified good:** `/services/` at 450 raw ≈ 340 unique clears its 250 floor; the legal pages are
substantive and well written; no page is a template clone of another.

---

## §4 Structured data

**4.1 🔴 STOP-SHIP — `aggregateRating` is fabricated and ships on all 13 pages.**
`localBusinessJsonLd()` emits `ratingValue: "4.9"`, `reviewCount: "6"`, computed by `lib/reviews.ts`
from six invented testimonials in a file whose own header reads _"PLACEHOLDER — replace with real,
verifiable reviews… Do not publish an aggregate rating that isn't backed by genuine reviews."_ Because
the business node is injected from the root layout, it is on every page including the 404s. Google
policy violation and a Rich Results failure. Resolution: real sourced reviews, or remove both.
Blocked on business-facts §B.

**4.2 🟠 `sameAs` points at platform homepages.** `["https://www.facebook.com/",
"https://www.instagram.com/"]` from `site.social`. These are also the footer's social icon links. A
`sameAs` that resolves to facebook.com asserts an entity link that doesn't exist — weaker than an empty
array. Fix the data or remove both surfaces (one edit does both).

**4.3 🟠 Breadcrumb markup and visible trail have drifted.** `PageHero` renders crumbs on 7 routes;
`breadcrumbJsonLd` is called on 5. `/accessibility/` and `/privacy/` show a trail and mark up nothing.
On the 5 that do both, the trail is typed twice in two different shapes (`href` vs `url`). Fix: emit
from `PageHero` using the array it already receives. Target 7.

**4.4 🟡 `geo` is a placeholder.** `32.0853, 34.7818` is Tel Aviv city centre, emitted as
`GeoCoordinates` for a business with no premises. Set the real base or drop the field.

**4.5 🟡 Missing node types.** `Offer`/`PriceSpecification` (blocked on business-facts §C),
`AboutPage` + `Person` (§A), `ContactPage` and `CollectionPage` (**not blocked — ship them**).

**4.6 🔵 `Service` nodes have no `@id`.** Prevents anything referencing them later.

**✅ Verified good:** every page carries valid, parseable JSON-LD; `LocalBusiness` and `WebSite` both
ship globally and cross-reference correctly; `foundingDate: "2015"` matches the roster; `Service` nodes
correctly use `AdministrativeArea` for the region and wire `provider` to the business `@id`; `FAQPage`
questions all match visible rendered text.

---

## §5 Local SEO

**5.1 ✅ NAP is consistent and correct.** Phone, WhatsApp and email are **real fleet values** (per the
roster) and appear only via `lib/site.ts` — no literals anywhere. The address-free `PostalAddress`
(region + country) is the right shape for a service-area business.

**5.2 🟠 No local landing pages.** See §3.4. Largest local opportunity on the site.

**5.3 🔴 No Google Business Profile link anywhere.** For a service-area trade business this is the top
local lever: the map pack, the review surface, and the only legitimate source for the rating in §4.1.
Blocked on business-facts §B — this is an owner action, not a code task.

**5.4 🟡 Coverage claim is broader than the schema.** `serviceAreaText` claims
"שירות ארצי בתיאום מראש" while `areaServed` enumerates 12 cities and `Service` nodes claim
גוש דן והמרכז. Confirm the national claim before using it as a keyword.

**5.5 🟡 GBP address visibility.** If a Business Profile exists with a visible address, it contradicts a
site that shows none. It must be a service-area profile with the address hidden.

---

## §6 AEO / GEO

**6.1 🟠 The live AI-crawler stance is unverified.** `app/robots.ts` emits a blanket allow, but the zone
is behind Cloudflare, which can prepend a managed `robots.txt` that `Disallow: /`s every major AI bot —
as it currently does on a sibling fleet zone. **No repo change overrides that.** Fetch
`https://thermoleak.co.il/robots.txt` and diff it against `out/robots.txt` before any other AEO work.
Verify; do not inherit the sibling's finding.

**6.2 🟠 No answer blocks anywhere.** Every service page opens with two narrative `intro` paragraphs
that set context before answering. The information is often present — just in the third sentence.
Spec: content-standards §5.

**6.3 ✅ FAQs are fully extractable.** Both the homepage `Faq` component and the per-service FAQ blocks
use native `<details>/<summary>`, so every answer ships in the DOM at first paint with **zero
JavaScript**. This is the site's strongest AEO asset. Protect it — a client-state accordion would break
both this and §4 rule 3.

**6.4 🟡 No freshness or authorship signals.** No `datePublished`, `dateModified` or author anywhere.

**6.5 🟡 No `public/llms.txt`.**

**6.6 🟠 Nothing uniquely citable.** The site explains what it does but never what the method's limits
are. A thermal camera images surface temperature, not water — so it cannot see a deep slab leak under
thick screed, or a wall already at ambient. Publishing that honestly is the highest-value AEO change
available, and no competitor does it. Full list: `/aeo-answer-content` Gate 3.

---

## §7 E-E-A-T & trust

**7.1 🔴 STOP-SHIP — six invented testimonials.** `lib/reviews.ts` ships six fabricated reviews with
full names, cities and service attributions. They render on `/` and fill `/reviews/` entirely, and feed
the rating in §4.1. Fabricated reviews are a Google policy violation and a consumer-protection exposure,
and they are indistinguishable from real ones in the rendered HTML.

**7.2 🟠 Three unverified statistics rendered as the primary trust block.** `TrustBar` shows
`3,000+ בתים ועסקים` and `97% איתור כבר בביקור הראשון` with no source, plus the `4.9` from §7.1. The
fourth — `10+ שנות ניסיון` — **is** defensible (`foundedYear: 2015` in the roster). 97% in particular
reads as measured and nothing measures it.

**7.3 🟠 Uncredentialed certification claims.** `site.certifications` claims a certified thermography
technician (Level 1) and professional FLIR equipment. No certificate number, no issuing body, no
insurance, no association membership, no ח.פ. — while `legalName` claims `בע״מ`.

**7.4 🟠 The guarantee has no scope.** `לא מצאנו — לא שילמתם` is the site's strongest commercial promise
and its most undefined: no definition of "found", no exclusions, no call-out fee. Defining it precisely
would raise conversion **and** reduce disputes.

**7.5 🟠 No named human anywhere.** No owner, founder or technician. Blocks `Person` schema, article
bylines, and the About page's depth problem (§3.3) simultaneously.

**7.6 🟡 Social links go nowhere.** See §4.2. A visitor who clicks lands on facebook.com — the link
actively demonstrates there is no profile.

**7.7 🟡 Prices unverified.** `priceFrom: 450` and the per-service `priceModel` strings. Roster marks
them unconfirmed.

**✅ Verified good:** the privacy policy and accessibility statement are real, substantive documents,
not boilerplate stubs. Hours, service area and contact routes are clear and consistent.

---

## §8 Conversion

**8.1 🟠 The contact form can lose a lead silently.** `ContactForm.handleSubmit` calls
`window.open(whatsappHref(...))` and then sets the success state **unconditionally**. `window.open`
returns `null` when a popup blocker intervenes, and many desktop visitors have no WhatsApp client. In
both cases the visitor sees "הפנייה מוכנה לשליחה בוואטסאפ" and the lead is gone. The success copy does
mention the phone number, which softens it, but the state still misreports what happened.

**8.2 🟡 No thank-you URL.** Success is an inline swap, so there is no URL-based conversion to count and
no clean Google Ads target — relevant the moment §13.1 is closed.

**8.3 🟠 Zero `data-cta` attributes.** Not one CTA on the site carries one, because there is no
container to consume it. Add them now (`{location}-{action}`) so analytics can be wired without a
refactor. Inventory: `/tracking-analytics`.

**8.4 🟡 No consent link.** The form collects name, phone, area and free text; `/privacy/` exists and is
never linked from it. The helper line makes a claim ("לא נשמור פרטים ללא הסכמתכם") instead of linking.

**8.5 🟡 No focus management.** Focus never moves to the first invalid field on error, nor to the
confirmation panel on success.

**✅ Verified good:** `StickyContact` mobile bar with a matching `pb-20 md:pb-0` spacer so it never
covers the footer; click-to-call above the fold on every page; a sticky call/CTA sidebar on service
pages; per-field validation with `aria-invalid` + `aria-describedby`; an Israeli phone pattern that
accepts what real customers type.

---

## §9 Navigation & internal linking

**9.1 ✅ Zero orphans.** Every content route has an inbound internal link. The only unlinked emitted
files are the two 404 artifacts, which is correct. The footer renders **every** service, **every** nav
link and both legal pages with no truncation.

**9.2 🟡 Individual services are two hops from the header.** `navLinks` reaches `/services/` but not the
four detail pages. With only four services a dropdown is cheap.

**9.3 🟠 Zero contextual in-copy links.** Every internal link on the site is a nav label, card title,
chip or footer item, so the entire internal anchor-text signal is boilerplate. Natural missing edges:
water-leak-detection → insurance-reports, moisture-detection → water-leak-detection.

**9.4 🟡 `/services/` has no hub prose.** It is a card grid. An intro explaining how the four services
relate — one camera, one visit, four different questions — would add both depth and anchor text.

**9.5 🔵 Related-service links omit the trailing slash.** `app/services/[slug]/page.tsx` emits
`href="/services/{slug}"`. Next normalises it, but the emitted `href` is what a crawler follows and it
costs a redirect hop under `trailingSlash: true`.

---

## §10 Performance

**10.1 ✅ The baseline is healthy.** `out/` measures **3.9 MB** with **no JS chunk over 500 KB** and no
dev-only artifacts. Only two client components (`ContactForm`, `Navbar`), four runtime dependencies, and
a FAQ built on `<details>` with zero JS. `public/_headers` sets a one-year immutable `Cache-Control` on
`/_next/static/*` and Cloudflare Pages serves everything from the edge.

**10.2 🟡 `images: { unoptimized: true }` means no `srcset`.** Smaller than it looks here — three of the
four service illustrations are SVGs. What matters is `public/images/hero.webp`. Either pre-generate
width variants and hand-write `srcset`, or enable Cloudflare Image Resizing (an owner action). Don't
pass `sizes` to an unoptimized image: it looks correct and does nothing.

**10.3 🟡 The logo claims `priority`.** `Logo` is rendered with `priority` in `Navbar`, so a ~40px-tall
logo is preloaded on every page, competing with the real LCP element. At most one `priority` image per
page.

**10.4 🟡 No font preload.** Heebo + Assistant self-host correctly via `next/font/google`, but without a
`<link rel="preload">` both FOUT on first paint on every page.

**10.5 🟠 Measure the right artifact.** See §1.6 — `out/` is often stale. `rm -rf .next out` and rebuild
before any measurement.

---

## §11 Accessibility (WCAG 2.0 AA + IS 5568)

The site **publishes** an accessibility statement at `/accessibility/` claiming תקנות התשע״ג–2013 and
level AA of ת״י 5568. A failure here also makes a published document false.

**11.1 🟠 One live contrast failure.** `components/ContactForm.tsx:208` — the helper line under the
submit button, `text-xs text-ink/50`, computes to **≈3.1:1** against white. AA requires 4.5:1 and small
text has no large-text exemption. `text-ink/70` (≈5.7:1) is the nearest passing step.

**11.2 🟠 The statement is currently inaccurate.** `/accessibility/` explicitly claims
"שמירה על ניגודיות צבעים תקינה בין הטקסט לרקע". While 11.1 stands, that sentence is false. Fix the
contrast rather than editing the statement down.

**11.3 🟡 Mobile menu is incomplete.** `Navbar.tsx` has `aria-expanded`, `aria-controls` and a
state-dependent `aria-label` — better than most — but **no Escape handler, no focus trap, no scroll
lock, and no focus return** to the trigger.

**11.4 🟡 No form focus management.** See §8.5.

**11.5 🔵 Redundant image alt.** `app/services/[slug]/page.tsx` uses `service.h1` as the image `alt`, so
a screen-reader user hears the heading twice.

**11.6 🔵 Tap-target measurement.** The mobile menu button is `p-2` around a 24px icon — close to the
44px minimum. Measure rather than assume.

**✅ Verified good and worth protecting:** the token palette is deliberately split and correct —
`brand` on white ≈11.4:1, `accent-strong` + white ≈5.2:1 (the CTA colour), with `accent` (≈2.8:1)
reserved for decoration; a global `:focus-visible` ring in `brand-light` (a UI-contrast case it clears);
a skip link; landmarks and labelled `<nav>` regions; consistent `aria-hidden` on decorative icons;
`aria-label` on icon-only links; a global `prefers-reduced-motion` block; **zero** banned
physical-direction Tailwind utilities across the whole repo; correct `dir="ltr"` isolation on every
phone and email.

---

## §12 Security

**12.1 ✅ (2026-08-17) Security headers shipped via `public/_headers`.** HSTS (no
preload/includeSubDomains — deliberate, business-facts §F), `X-Frame-Options: SAMEORIGIN`,
`nosniff`, `Referrer-Policy`, `Permissions-Policy`, plus immutable caching on `/_next/static/*`.
Verified in the live response post-deploy. Still missing: CSP (see 12.2). Historical note: this
item originally targeted `.htaccess`, written when the repo believed Apache was the origin — it
wasn't (see the shipped block above).

**12.2 🟡 No CSP — but it is unusually cheap to add.** The site ships **no analytics and no third-party
script of any kind**, and the only `dangerouslySetInnerHTML` (`EmailOff`) injects build-time constant
HTML comments. A strict report-only policy needs almost no allowlist today. Installing GTM (§13.1)
spends that advantage — do the CSP in the same pass.

**12.3 ✅ Minimal data surface.** The form POSTs nowhere; it hands the user's own data to the user's own
WhatsApp client. No endpoint, no access key, no server-side store. The roster records
`formAccessKey: null` **by design** — this site is deliberately not on Web3Forms like its nine fleet
siblings.

**12.4 ✅ (2026-08-17) The deploy chain now has a manual gate.** Pushing to `main` runs build-only
CI; production ships via the fleet ops script (wrangler → Pages) with a Cloudflare-API drift check,
an output gate, `out.prev/` rollback and a deploy log — and it always asks before `-Confirm`. The
prior state (push = unreviewed production rsync) is gone, and so is its silent-drift failure mode.

**12.5 ✅ Secret hygiene is sound — and improved.** The repo is public. The only key-shaped string
in it is the Google Search Console verification token, which is public by design. Deploy
credentials now live solely in the Sys Admin control plane; the old `SSH_PRIVATE_KEY` /
`SSH_HOST` / `SSH_USER` Actions secrets are unused and should be deleted from the GitHub repo
settings (owner action — secrets can't be removed from here).

**12.6 ✅ Obsolete.** The "no origin-side HTTPS redirect in `.htaccess`" rule died with the Apache
origin. `.htaccess` is deleted; redirects live in `public/_redirects`.

---

## §13 Analytics & measurement

**13.1 🔴 The site collects zero analytics.** No GTM, no GA4, no pixel, no third-party script. The
roster states it outright: _"analytics.gtmId is null — this site carries NO GTM snippet at all and
collects zero analytics, unlike the rest of the fleet (shared container GTM-KWGGH438). Deliberate gap,
not yet closed."_

Every other item in this backlog is unmeasurable until this is fixed. It is rated Critical not because
it breaks anything, but because it makes improvement unverifiable.

First decision (owner's, business-facts §F): join the shared fleet container — where GA4 is resolved by
a hostname RegEx table and a broken trigger is a fleet-wide outage — or stand alone.

**13.2 🟠 No `data-cta` attributes to trigger on.** See §8.3. Build the inventory before the container
lands, or every click trigger has to be built from fragile CSS selectors.

**13.3 🟡 Roster divergence on Search Console.** `app/layout.tsx:32` ships a real verification token
while the roster records `googleSiteVerification: null`. Update the roster.

**13.4 🟡 When analytics lands, name the lead event honestly.** The form opens a WhatsApp deep link and
cannot confirm delivery, so the event means "handoff attempted", not "lead received". Name it
`lead_whatsapp_open`, and never put name/phone/message into `dataLayer`.

---

## Phased roadmap

**Phase 1 — stop the bleeding (nothing here needs new content or budget)**

1. §4.1 / §7.1 — remove `aggregateRating` and the six fabricated testimonials, or replace them with
   sourced ones. **Stop-ship until resolved.**
2. §4.2 / §7.6 — fix or remove the `sameAs` / footer social links.
3. §2.1 — fix the homepage and `/about/` titles.
4. §11.1 — `text-ink/50` → `text-ink/70`, restoring §11.2.
5. §4.3 — emit `BreadcrumbList` from `PageHero`.

**Phase 2 — make it measurable**

6. §13.1 — analytics decision, then install; §12.2 CSP in the same pass.
7. §8.3 / §13.2 — `data-cta` inventory.
8. §8.1 — the form's failure path; §8.2 `/thank-you/`; §8.4 consent link.
9. §5.3 — Google Business Profile (owner action, unblocks §7.1 permanently).

**Phase 3 — earn the rankings**

10. §3.2 / §6.2 — service pages to 450 words, opening with answer blocks, including what the method
    cannot do (§6.6).
11. §3.3 — `/about/` depth, once §7.3/§7.5 supply the facts.
12. §9.3 / §9.4 — contextual internal links and hub prose.
13. §1.2 / §1.3 — sitemap derivation and real `lastModified`.

**Phase 4 — expand, carefully**

14. §3.5 — the `/guides/` hub, starting with "מה מצלמה תרמית באמת רואה".
15. §3.4 / §5.2 — 3–5 location pages that pass the doorway gate. Not 12.
16. §10.2–§10.4 — image variants, logo priority, font preload.
17. §12.1 — security headers, then enforce the CSP after a report-only week.

**Never:** build 12 thin city pages; invent a review, rating, statistic or byline to fill a gap; push to
`main` with a Phase 1 item outstanding.
