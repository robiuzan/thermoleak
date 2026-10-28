# Implementation roadmap — sequenced sprints

**The register** of what is wrong lives in [optimization-backlog.md](optimization-backlog.md).
**This file is the sequencing**: what order we fix it in, what "done" means, and what each sprint is
blocked on. Every task cites a backlog section and, where it came from the 2026-09-06 audit, a
finding id.

**Measured baseline: 2026-09-06**, against a clean build (`npm run lint && npm run build` both
green) with a freshly rebuilt `out/`. Every number below was measured, not estimated.

| Measure                     | Value                                                   |
| --------------------------- | ------------------------------------------------------- |
| Routes in the build table   | 26                                                      |
| `index.html` files emitted  | 22                                                      |
| URLs in `sitemap.xml`       | 19                                                      |
| Export size                 | 5,910,433 B (5.64 MiB)                                  |
| — RSC payloads (`**/*.txt`) | 2,769,645 B — **46.9%**                                 |
| — HTML                      | 1,984,248 B — 33.6%                                     |
| — JS                        | 722,262 B — 12.2%                                       |
| — all of `_next`            | 936,350 B — 15.8% (JS + CSS + fonts)                    |
| Client components           | 4 (ContactForm, Navbar, ThankYouContent, ConsentBanner) |
| Banned RTL utilities        | 0                                                       |
| `data-cta` attributes       | 13                                                      |
| Custom `dataLayer` pushes   | **0**                                                   |

> **On the RSC payload class.** Next 16 emits each route's flight payload **twice** — `index.txt`
> and `__next._full.txt`, byte-identical — 158 files, ~1.38 MB of pure duplication. It is
> navigation prefetch, not first paint, so **it does not affect LCP**. It is deploy weight, and it
> is the reason the export is 5.9 MB rather than the ~4 MB
> [performance-guidelines.md](performance-guidelines.md) assumed. Budget it; do not panic about it.

---

## Sprint numbering — read this before citing a sprint

Sprints **0–3 shipped** (2026-08-17 → 2026-08-30). The old Sprint 4 ("Performance, conversion and
proof") and old Sprint 5 ("Bilingual") were never started; their content is redistributed below.
**Bilingual keeps its conditional status and is no longer numbered** — it is gated on a business
decision, not on a sprint.

| Sprint                                        | State                                                |
| --------------------------------------------- | ---------------------------------------------------- |
| 0 — Owner unlocks                             | Partly delivered; the remainder is **Track O** below |
| 1 — Measurement, schema, a11y delta           | ✅ shipped `ff2545c` (with gaps — see Sprint 4)      |
| 2 — Content depth + `/guides/`                | ✅ shipped `047180c`                                 |
| 3 — The local silo (3 of 12 cities)           | ✅ shipped `7c9bbda`                                 |
| **4 — Stop the bleeding**                     | **next, fully unblocked**                            |
| **5 — Re-arm the instruments**                | ✅ **shipped 2026-09-06** (see below)                |
| **6 — Make the funnel measurable**            | after 4                                              |
| **7 — Repair the location silo, then extend** | after 6                                              |
| **8 — The second guide triplet**              | after 7                                              |
| **9 — Owner-gated upside**                    | a queue, not a sequence                              |

---

## Track O — owner unlocks (parallel; never on a sprint's critical path)

Not engineering work. Each row is a fact only the owner can supply. **No sprint gate below depends
on any row here** — that is a design constraint of this roadmap, and it is enforced: where a
verification genuinely needs owner-held access, it is split out into an explicitly owner-gated step
rather than hidden inside a sprint's "done when".

> ### ✅ Answered 2026-09-17 — rows 3, 4, 5, 7, 8, 9, 10 are closed
>
> The owner answered a large batch. **Shipped:** the starting price is **₪350** (it had been showing
> an unverified ₪350), the camera is a **FLIR E8**, the team is **2 people**, the founder has been
> in the trade since **~2005**, **third-party insurance** is held, **national service by prior
> arrangement is true**, reach is **~2 hours' drive from Tel Aviv**, and **tax invoices are issued**.
>
> **Three answers were negative, and they removed claims rather than adding any:** there is **no
> ח.פ.** (so `בע״מ` is gone from `legalName`), **no thermography certificate** (so the "Level 1"
> badge is gone), and **no accessibility coordinator** (so `/accessibility/` no longer asserts one).
> Rows 3, 9 and 11 are therefore **❌ closed, not outstanding** — do not re-ask them.
>
> **Still genuinely open:** GBP (#1 — none exists yet, owner will open one), reviews (#2), photo
> (#12), job references (#13), imagery (#14) — plus two new ones: **what the ₪350 visit
> includes/excludes**, and **report turnaround as a number**. Both were asked and came back as "use
> your judgement", which is not an answer a site may publish. See business-facts §C.

| #   | Ask                                         | Status                                                                             | Unlocks                                                                   | Backlog |
| --- | ------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------- |
| 1   | **Google Business Profile URL**             | 🔶 **open** — none exists yet; owner will open one                                 | first non-empty `sameAs`; map pack; the only legitimate route to a rating | §5.3    |
| 2   | **Real reviews with source URLs**           | 🔶 **open** — ask at the job; ~10 over 60 days                                     | retires the `/reviews/` 301; `Review` + honest `AggregateRating`          | §7.1    |
| 3   | **Thermography certificate**                | ❌ **closed — none held.** The "Level 1" badge was removed                         | nothing. Do not re-ask; do not reintroduce a certification claim          | §7.3    |
| 4   | **Starting price**                          | ✅ **₪350** (was an unverified ₪350)                                               | `Offer`/`PriceSpecification` once inclusions are known too                | §7.7    |
| 5   | **Thermal camera model**                    | ✅ **FLIR E8**                                                                     | model-level specificity; shipped in `site.credentials`                    | §7.3    |
| 6   | **Report turnaround as a number**           | 🔶 **open** — answered "use the standard", which is not a fact about this business | a concrete answer block on `/services/insurance-reports/`                 | §7.7    |
| 7   | **Travel reach**                            | ✅ **~2 hours' drive from Tel Aviv** — lifts the batch-4 distance gate             | location batches 4–5 on distance                                          | §5.4    |
| 8   | **Is "שירות ארצי בתיאום מראש" true?**       | ✅ **yes**                                                                         | the clause it renders in 6 places is now backed                           | §5.4    |
| 9   | **ח.פ. number**                             | ❌ **closed — not a registered company.** `בע״מ` removed from `legalName`          | nothing. Do not re-ask                                                    | §7.3    |
| 10  | **Third-party insurance (ביטוח צד ג׳)**     | ✅ **held** — insurer and amount not supplied, so no figure ships                  | the signal ועדי בתים and property managers ask for                        | §7.3    |
| 11  | **Accessibility coordinator name**          | ❌ **closed — none appointed.** `/accessibility/` no longer asserts one            | nothing. Do not re-ask                                                    | §11.2   |
| 12  | **Owner photo + permission**                | 🔶 **open**                                                                        | author bio block; strongest single trust element on `/about/`             | §7.5    |
| 13  | **One real job reference per city**         | 🔶 **open** — operational                                                          | the only doorway-test item research cannot supply                         | §3.4    |
| 14  | **Before/after thermal pairs with consent** | 🔶 **open** — operational                                                          | the E-E-A-T unfair advantage                                              | §7.1    |
| 15  | **What the ₪350 visit includes / excludes** | 🔶 **open** — answered "use your judgement"; a draft awaits approval               | the #1 pre-purchase question; `Offer` schema; AEO answer block            | §7.7    |
| 16  | **Accepted payment methods**                | 🔶 **open** — only "issues a חשבונית מס" is confirmed                              | removes a conversion objection for ועדי בתים                              | §7.7    |

**Two asks are fleet decisions, not facts:**

- **GTM-KWGGH438 container edits.** The container is shared across the Israeli fleet. Any click
  trigger must be hostname-scoped — that is a fleet-ops change, not a repo change.
- **Cloudflare zone toggles** (Scrape Shield, cache TTL, AI-crawler policy). Document the exact
  toggle; never assume it was done (CLAUDE.md §12).

---

## Sprint 4 — Stop the bleeding ✅ shipped 2026-09-17

**Goal:** fix everything a visitor, a crawler or a regulator experiences as wrong today.

**Why first:** these are the only findings with a _live_ consequence — a privacy policy that
understates actual tracking, customer PII in a tracked link, a legal link no mobile user can reach,
contrast failures on the accessibility statement itself, and ten pages with no link-preview card.
None is owner-blocked. None depends on another sprint.

**Scope:** 9 tasks across `app/`, `components/`, `lib/`, `public/_headers`. All small or trivial
individually; the sprint is wide, not deep.

### Tasks

1. **Make the privacy policy true, and decide on consent.** [critic §2 · new §12.4]
   `app/privacy/page.tsx` says the site _"ייתכן"_ (may) use Google Analytics. GTM-KWGGH438 and GA4
   `G-5YWLZ07PEC` have shipped on **every route** since 2026-08-30, and `grep -rn "consent" app
components lib` returns **zero**. Rewrite the section to state GA4 definitively, name what is
   collected, and give an opt-out. **Then take the Consent Mode v2 decision explicitly** — under
   Israeli Privacy Protection Law Amendment 13 this is the owner's call, and it must be taken
   _before_ Sprint 6 adds event tags on top. Record the decision in
   [ux-cro-security.md](ux-cro-security.md); do not leave it implicit.
   _This is the one item on the site where a published statement is currently false._

2. **Get the lead's name and phone out of the DOM.** [SEC-3 / AN-2 · §12.3, new §13.6]
   `components/ContactForm.tsx:73-79` composes `שם: {name}` / `טלפון: {phone}` into the handoff
   message; `components/ThankYouContent.tsx:85` renders it as `href={waHref}` on a `data-cta`
   element. GTM's Click URL variable and GA4 outbound-link measurement capture that href verbatim.
   Change to a generic `href={whatsappHref()}` (still a valid no-JS fallback) plus an `onClick` that
   `preventDefault()`s and calls `window.open(whatsappHref(handoff.message), "_blank", "noopener")`.
   **Hard prerequisite for Sprint 6** — adding any click trigger first converts a latent exposure
   into a live one. The form also tells the visitor "הם אינם נשמרים אצלנו", so this is a
   truthfulness problem as well as a privacy one.

3. **Un-cover the footer's legal links on mobile.** [cro-1 · §11.6/§8] The sticky bar's spacer is on
   the wrong element, so the bar permanently covers the footer. `components/Footer.tsx` holds the
   **only** link to `/accessibility/` on the site — it is not in `navLinks` — so this is a
   compliance defect, not a layout nit. Move `pb-20 md:pb-0` from `<main>` in `app/layout.tsx` onto
   the `<footer>`, and add `pb-[env(safe-area-inset-bottom)]` to the `StickyContact` wrapper.

4. **Close the live SC 1.4.3 contrast failures — using the measured table, not a guess.**
   [A11Y-1 · §11.1/§11.2] Contrast ratios computed against `ink #1B2733` on `white` and
   `paper #F7F9FB`:

   | token        | on white | on paper | body text (4.5:1)     | non-text (3:1) |
   | ------------ | -------- | -------- | --------------------- | -------------- |
   | `ink/40`     | 2.37     | 2.36     | ❌                    | ❌             |
   | `ink/50`     | 3.10     | 3.06     | ❌                    | ✅             |
   | `ink/55`     | 3.58     | 3.50     | ❌                    | ✅             |
   | `ink/60`     | 4.16     | 4.07     | ❌                    | ✅             |
   | **`ink/65`** | **4.82** | **4.71** | ✅ **lowest passing** | ✅             |
   | `ink/70`     | 5.67     | 5.53     | ✅                    | ✅             |

   **`ink/65` is the true WCAG minimum; `ink/70` is the enforced house floor.** Earlier drafts of
   this plan proposed `ink/55` and `ink/60` — both fail 4.5:1 and neither may ship. We enforce
   `/70` rather than `/65` because it is already the site-wide convention, it clears the threshold
   with margin on both backgrounds, and a single floor makes the build-gate grep trivial; adopting
   `/65` would buy one barely-perceptible shade at the cost of a second token to police. The
   placeholder at `ContactForm.tsx:45` goes to `/70` with the rest — against full-opacity `ink`
   entered text that is still an obvious affordance difference. Fill the missing rows of the
   contrast table in
   [accessibility-and-i18n.md](accessibility-and-i18n.md) §A2 with the figures above — `ink/40`,
   `/55` and `/60` went uncomputed for three sprints precisely because the table only ever
   enumerated `/50`, `/70`, `/80`, `/100`.

5. **Raise the input borders to 3:1.** [A11Y-3 · §11] Five `border-ink/20` (1.49:1) in
   `components/ContactForm.tsx` → `border-ink/55` (3.58:1 white / 3.50:1 paper — passes the
   non-text threshold). This was an explicit Sprint 1 task that never landed in `ff2545c`; record
   that here so the sprint history stays honest.

6. **Fix the focus ring on dark surfaces.** [A11Y-2 · §11] `brand-light #1E88A8` on `brand #0B3D5C`
   measures **2.80:1** against a 3:1 target. Add an `.on-dark` rule setting `outline-color:#fff`,
   applied to both the container and the focusable element (on Hero, `/pricing/` and StickyContact
   the class lands on the focusable element itself). Correct the claim in
   [accessibility-and-i18n.md](accessibility-and-i18n.md) that the ring clears 3:1 — it does, **on
   light surfaces only**.

7. **Restore `og:image` on the ten dynamic routes; give the eight static ones their own `og:url`.**
   [SEO-01 · §2] Next shallow-merges metadata at the top-level key, so a page's `openGraph` object
   **replaces** the layout's rather than merging into it. Result: all 4 service pages, 3 guides and
   3 city pages emit **no `og:image` at all** — every commercial and topical page on the site
   renders as a bare text row when shared to WhatsApp, which is conversion goal #2. Meanwhile 8
   static routes inherit `url: site.domain` and claim to _be_ the homepage. Add a
   `pageOpenGraph()` helper to `lib/site.ts`, spread it in the three dynamic routes, drop
   `url: site.domain` from the layout, and give the static routes their own. Set per-page
   `twitter.title`/`twitter.description` from the same values — today
   `/services/water-leak-detection/` has a `twitter:title` that disagrees with its own `og:title`.

   > Backlog §2 currently records "✅ OG and Twitter tags present with a 1200×630 image". That line
   > has been false since the dynamic routes shipped. Correct it in the same commit.

8. **Write real location meta descriptions.** [SEO-02 · §2/§3.4]
   `app/locations/[city]/page.tsx:30` does `location.answer.slice(0, 155)`, hard-truncating all
   three city descriptions mid-word — בת ים's page cuts inside its own city name. Add a typed
   `metaDescription` field to the `Location` interface, written to the formula already specified in
   [keyword-map.md](keyword-map.md) §Location, and delete the slice. The spec was right; the code
   never implemented it.

9. **Two cheap performance wins.** [PERF-5, PERF-6 · §10.1/§10.3] Add `/images/*` →
   `Cache-Control: public, max-age=2592000` to `public/_headers` (30 days, **no `immutable`** —
   these filenames are not content-hashed). Today `hero.webp` and the every-page logo revalidate off
   a zone default nobody in the repo controls. And stop lazy-loading the above-the-fold navbar logo.

### Blocked on

Nothing. Every task is code or config against facts already in the repo. **Task 1's consent
_decision_ is the owner's**, but making the privacy text match reality is not — do that regardless.

### Done when — verifiable from the repo and an unprivileged `curl`

- `grep -rnE 'text-ink/([0-9]|[1-6][0-9])\b' app components` → 0. Match on the **range**, not on an
  enumerated list of four values — enumerating is exactly how `/40`, `/55` and `/60` went uncomputed
  for three sprints.
- For all 19 indexed routes in a fresh `out/`: `og:image` count = 1 **and** `og:url` equals that
  route's own `rel=canonical`. Asserted in the gate, not checked by eye.
- All three `out/locations/*/index.html` meta descriptions are 150–160 chars and end on a word
  boundary.
- `app/privacy/page.tsx` states GA4 as fact, with an opt-out, and no `ייתכן` hedge remains.
- After a real form submit, `document.querySelector('[data-cta="thankyou-whatsapp"]').href` contains
  no `?text=`.
- At 390×844 in a real browser, the footer's `/accessibility/` and `/privacy/` links are visible and
  tappable with the sticky bar rendered.

> **Two of those require a browser and a real submit.** Every a11y and CRO finding in the 2026-09-06
> audit was CSS arithmetic and code reading — nothing was rendered, tabbed through, or submitted.
> Do not mark this sprint done on greps alone.

### Owner-gated verification (separate step, after deploy)

- `curl -sI https://thermoleak.co.il/images/hero.webp | grep -i cache-control` → `max-age=2592000`.
- Deploying is a production mutation — **ask first** (CLAUDE.md §10).

---

## Sprint 5 — Re-arm the instruments ✅ shipped 2026-09-06

**Goal was:** make the acceptance bars and the agent environment describe the site that actually
exists, so every sprint after this is graded against reality.

**Why it mattered:** every audit dimension is downstream of these files, and stale instructions do
not merely waste tokens — they cause damage. `/web-security-headers` prescribed `script-src 'self'`,
which would have silently killed analytics on a live site. `schema-auditor` was tasked with
reporting "the fabricated AggregateRating that currently ships on all 13 pages", purged in August.
`/new-city` and `/new-article` instructed an agent to create files that already exist.

**Measured before the pass:** **17 of 29** instruction files (11 agents + 18 skills) carried at
least one stale-state marker — `does not exist yet`, `zero analytics`, `ink/50`, `lib/reviews.ts`,
`aggregateRating that currently ships`, `4.9`, `3,000`, `97%`.

**What was reconciled:** `docs/schema-graph.md` (had no nodes for `/guides/`, `/locations/` or
`/pricing/`), `docs/keyword-map.md`, `docs/content-standards.md`, `docs/README.md`,
`docs/optimization-backlog.md`, the seven strategy docs, `CLAUDE.md`, `public/llms.txt`, all 11
agents and all 18 skills.

> **`public/llms.txt` stays a static file.** An earlier draft proposed generating it at build time
> from `lib/site.ts` via a route handler. `output: "export"` forbids route handlers (CLAUDE.md §3),
> so that would not have built. Hand-maintain it and assert parity in the gate instead.

---

## Sprint 6 — Make the funnel measurable, and the promise reachable ✅ shipped 2026-10-28

**Goal:** turn `page_view` into a real conversion signal, and put the confirmed guarantee in front of
the visitor at the moment they ask for it.

**Why third:** Sprints 7 and 8 both need a way to be judged, and today the site's **number-one stated
conversion goal fires zero times**. Three content sprints have already shipped with nothing
measuring them. The guarantee work rides along because it is the same shape of problem — a confirmed
asset that does no work — and it touches overlapping files.

**Ordering within the sprint: Sprint 4 task 2 (the PII fix) must be deployed before any click
trigger exists.** Do not compress that.

### Tasks

1. **Correct the client-routing premise before anyone builds a trigger.** [cro-2 · §13.1]
   [data-tracking-infrastructure.md](data-tracking-infrastructure.md) states that a static export
   has no client-side routing, so a History Change trigger "is unnecessary and will not fire". That
   is **false** for an App Router export — `<Link>` and `router.push` do pushState navigation, and
   `/thank-you/` is reached _only_ from the form handler, so 100% of legitimate thank-you views are
   client-side. An agent following that sentence guarantees the doc's own "cleanest conversion
   target" records zero. This gates everything below it.

2. **Add `lib/analytics.ts` and push the three events a container cannot see.** [AN-1 · new §13.5]
   A typed `pushEvent(name, params)` guarding `window.dataLayer`, called from the form handler
   (`lead_whatsapp_open` / `lead_handoff_blocked` with `{ service, handoff_ok }`) and from
   `ThankYouContent` (`thank_you_view`). **Pass `service` only — never `area`.** The area field is
   free text and homeowners type street addresses into it. Add a comment at the
   `data-cta="form-whatsapp"` element recording that it fires **pre-validation** and must never be
   used as the lead trigger — a naive click trigger there counts three mistyped phone numbers as
   three leads. Skip `faq_open` unless the `"use client"` cost on `Faq.tsx` is worth it; the
   three-client-component budget is deliberate and native `<details>` is golden rule 6.

3. **Extend the PII rule to cover hrefs.** [AN-2 · §13.6] The tracking doc's PII section only ever
   warned about the submit handler, so an agent following it would ship the Sprint 4 task 2 leak
   while believing it complied. State it as: _no PII in the dataLayer, **and no PII in any `href`,
   because Click URL is a dataLayer variable**_.

4. **Widen `connect-src` for GA4's real endpoints.** [SEC-4 · §12.2] `public/_headers` allows
   `www.google-analytics.com` (an exact host) and `*.analytics.google.com` (a different registrable
   domain). GA4's regional endpoint for Israeli traffic — `region1.google-analytics.com` — matches
   neither. Add `https://*.google-analytics.com` and keep the exact hosts alongside it; a wildcard
   does not match its own apex. Zero impact today because the header is Report-Only, which is
   exactly why it must be fixed _before_ enforcement.

5. **Replace the unmeetable CSP promotion gate.** [SEC-2 · §12.2] Sprint 1's gate said "CSP is
   report-only and **collecting**". It has no `report-uri` and no `report-to`, so it has never
   collected anything, and the documented "observe a week of real traffic" process is unexecutable
   as written. Replace with something deterministic: deploy the policy as enforcing to a **Pages
   preview branch**, walk all 19 routes plus a real submit through to `/thank-you/` with the console
   open, promote only on zero violations. Note in the same edit that `'unsafe-inline'` in
   `script-src` is **structural** under `output: "export"` — inline RSC flight scripts, no server, no
   nonce — so nobody "tightens" it into a hydration break.

6. **Replace `interest-cohort` with `browsing-topics`.** [SEC-7 · §12.1] FLoC was removed from
   Chrome; that directive is inert. Topics — which the newly-live Google tag can actually read — is
   ungoverned. **Do not edit `out.prev/_headers`**; that is the rollback snapshot.

7. **Give the guarantee an anchor and reach.** [EEAT-4, cro-4 · §7.4] Add `id="guarantee"` to the
   `GuaranteeTerms` section and link the bare promise to `/pricing/#guarantee` from the service-page
   sidebar, the Hero and `/about/`. **No service page links to `/pricing/` at all** today — the only
   route is the navbar. Add a FAQ entry composed from `site.guaranteeTerms` so the homepage
   `FAQPage` carries the site's most load-bearing commercial claim; the wording is already
   owner-approved. Replace the hand-typed terms in `lib/articles.ts` with a value composed from
   `site.guaranteeTerms` so a future correction cannot leave one copy stale.

8. **Stop calling the guarantee a certification.** [EEAT-6 · §7.3] `"אחריות מלאה ושקיפות מחירים"`
   sits in the `certifications` array and renders under `הסמכות וציוד` with a badge per row — the
   exact pattern [eeat-and-trust.md](eeat-and-trust.md) bans, and it inflates the perceived
   verifiability of the rows above it. Remove it from that array and rename the heading to
   `שיטה וציוד` until a certificate number exists. **Do not touch the certification text itself** —
   owner-blocked (Track O #3).

9. **Consolidate the founder entity.** [SD-5, EEAT-5 · §7.5] Emit `"@id": .../about/#founder` on the
   Article author when the author is the founder, and wrap the visible byline in a link to that
   anchor — the anchor exists and nothing on the site links to it. Delete the stale comment in
   `app/guides/[slug]/page.tsx` claiming the byline is "deliberately absent until a real person is
   on file", which sits six lines above the code that renders it.

10. **Fold the location answer block into `FAQPage`, and fix the schema nits.** [AEO-5, SD-8 · §4]
    Locations are the only page type whose answer block never reaches the FAQ graph. Change
    `Location.answer` to the existing `{ q, a }` shape and pass it through `faqPageJsonLd`. Guard
    `faqPageJsonLd` centrally against an empty array so a future article without an answer block
    cannot ship `{"@type":"FAQPage","mainEntity":[]}`. Drop `inLanguage` from the two `Service`
    builders — it is the only out-of-domain property in the graph.

11. **Single-source ₪350.** [TS-1 · §7.7] `lib/services.ts` and `lib/articles.ts` write the literal;
    three other files interpolate `site.priceFrom`. Behaviour-preserving today — the point is that
    `site.priceFrom` is marked 🔶 and **will** change, and the `lib/articles.ts` copy feeds
    `FAQPage` JSON-LD, so a stale copy becomes a price-mismatch signal to Google. After the change
    `grep -rn '₪350' lib app components` returns comments only, and the rebuilt `out/` should be
    byte-identical.

### What actually shipped (2026-10-28)

Nine of the eleven tasks were implemented. **Two were already done and were not redone** — a reading
of the repo, not an assumption:

- **Task 1** (the false client-routing premise) had already been corrected in the Sprint 5 docs
  reconciliation; `docs/data-tracking-infrastructure.md` §6 now states the opposite, correctly.
- **Task 8** (the guarantee sitting in the `certifications` array) was done in Sprint 4's fact
  batch: the array is `site.credentials`, the guarantee is out of it, and the `/about/` heading reads
  `ציוד וכיסוי`. Note the heading differs from this roadmap's suggested `שיטה וציוד` — the shipped
  wording is the owner-era one and was left alone.

Task 3 was narrower than written: the href rule was already in the doc, but the doc still described
the leak as open. It now records the fix as the worked example.

Two things were added that this plan did not ask for, both one-line and both defensible:
`scroll-mt-20` on `ContactCTA`'s long-standing `#contact` anchor (it had the same
hidden-under-the-header defect the new `#guarantee` anchor would have had), and `lib/faqs.ts`'s new
question placed next to the price question rather than at the end, because the two read as a pair.

### Blocked on

- **Container-side triggers** (`call_click`, `whatsapp_click` from `[data-cta]`) are a **fleet-ops
  ask**, not repo work. **This sprint's gate did not depend on them, and they are still not done** —
  so nothing pushed by `lib/analytics.ts` has reached GA4 yet. Cheapest zero-risk interim:
  create `thank_you_view` and `pricing_view` as GA4-property-side Key events from `page_path`
  conditions — that covers two of seven immediately, with no container edit.
- CSP promotion to enforcing was deliberately _not_ in this sprint; task 5 only made the gate
  executable. It is now executable and still unexecuted.

### Done when — verifiable from the repo and an unprivileged `curl`

All five were checked against a fresh export on 2026-10-28. ✅ = verified, with what was measured.

- ✅ `lib/analytics.ts` exists and is called from both the form handler and `ThankYouContent`; all
  three event names appear in the shipped client chunks under `out/_next/static/chunks/`.
- ✅ `grep -rn '₪350' lib app components` → comments only. The "byte-identical `out/`" half of this
  criterion was **not** checkable as written, because the same commit changed copy and markup
  elsewhere; what was verified instead is that every price string renders identically
  (`ביקור איתור החל מ-₪350`, `מתחיל ב-₪350`, and 4 occurrences on the homepage).
- ✅ `out/index.html` emits 10 `"@type":"Question"` nodes (9 + the guarantee FAQ); each of
  `out/locations/{tel-aviv,holon,bat-yam}/index.html` emits 3. No `FAQPage` anywhere has an empty
  `mainEntity`.
- ✅ Every page rendering `site.guarantee` has a path to `/pricing/#guarantee` within one click —
  checked by walking every `.html` file in `out/`, not just the expected seven.
- ⏳ `curl -sI https://thermoleak.co.il/ | grep -i permissions-policy` contains `browsing-topics=()`
  and no `interest-cohort`. **Verified in `out/_headers`; still to be confirmed live after deploy** —
  headers come from Cloudflare Pages, so the repo is not evidence (CLAUDE.md §10).

### Verification after deploy — what is actually runnable, in order

⚠️ **The GA4 Realtime assertion that used to head this list has moved to "Blocked on" below.** It was
not an owner-access problem: there is no GA4 tag listening for these three event names, so a real
submit produces nothing in Realtime and the result is indistinguishable from a broken `pushEvent`.
Asking the owner to run it would have had them conclude the sprint was broken.

1. `curl -sI https://thermoleak.co.il/ | grep -i permissions-policy` → contains `browsing-topics=()`
   and no `interest-cohort`. **Repo evidence does not count** — Pages merges its own headers
   (CLAUDE.md §10).
2. `curl -o /dev/null -w '%{http_code}' "https://www.googletagmanager.com/gtm.js?id=GTM-KWGGH438"`
   → `200`. A snippet in the HTML proves nothing; this fleet lost 18 days of analytics to two
   fabricated container IDs.
3. **A real submit from a phone, with the Network tab or GTM Preview open.** Assert both halves:
   the three pushes appear in `window.dataLayer` carrying `service` and `handoff_ok`, **and** no
   `/g/collect` request contains the tester's name, phone, area or message. **Inspect the request,
   not the config.** Both halves are observable with no container change, and the PII half has been
   specified since Sprint 1 and **has still never actually been run**.
4. Reload `/thank-you/` and press back into it: `thank_you_view` must **not** push again. Submit the
   form a second time: it must push again, with the second lead's `service`.
5. Click a guide byline → it must land on `/about/#founder` with the founder heading **below** the
   sticky header, not behind it.

### Blocked on

- **A GA4 tag for the three pushed events.** Fleet-ops: a Custom Event trigger per event name in the
  shared container, plus confirmation that `thermoleak.co.il` is in the container's GA4 hostname
  RegEx table (`components/Analytics.tsx`). Until then the pushes reach `window.dataLayer` and stop
  there, and **GA4 Realtime will show nothing** — that is the expected state, not a defect.
- **The enforcing-CSP preview walkthrough** (zero console violations across all 19 routes). Needs a
  throwaway branch, because the enforcing policy is an edit to `public/_headers` and
  `ops/deploy-site.ps1` deploys to `--branch main`.

---

## Sprint 7 — Repair the location silo, then extend it

**Goal:** make the three shipped city pages earn their keep, then add only the cities the evidence
supports.

**Why fourth:** the pages themselves are good — 583–653 unique words against a 350 floor, correct
ב+city grammar, clean service-area NAP, and a 5-gram overlap of 22–24% whose shared spans are all
chrome. What is broken is everything _around_ them. **Adding cities before fixing the mesh just
doubles the size of an equity cul-de-sac.**

### Phase A — repair (do not skip; blocks Phase B)

Fix the link mesh, the `nearby` reciprocity, and the `Service.areaServed` type matching
`location.kind`. Add a **Location index** row to the content-standards word table — its absence is
why the `/locations/` hub went unmeasured.

### Phase B — extend, in this order

| Batch           | City                      | km      | Claims | Why here                                                                                                                                                                                      |
| --------------- | ------------------------- | ------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2               | **רמת גן**                | 6       | 13     | Most claims of any deferred city; contiguous with the built cluster so `nearby` stays honest; תמ״א 38 / התחדשות עירונית generates two genuinely distinct call types                           |
| 2               | **גבעתיים**               | 5       | 11     | Nearest deferred city; the four-hills topography (גבעת קוזלובסקי at ~87 m) is a physically distinct leak story no other page can borrow                                                       |
| 3               | **פתח תקווה**             | 12      | 9      | 9–23-storey new-build stock from 2003 on is the **inverse** of the three shipped pages, which all lean on old stock — easy substitution-test pass, and it widens the cluster's topical range  |
| 4               | **כפר סבא**               | 23      | 11     | Water supplied by an agricultural cooperative, not a municipal corporation — a genuinely unique infrastructure angle. **Distance gate LIFTED 2026-09-17** (reach confirmed ~2h from Tel Aviv) |
| 4               | **ראש העין**              | 25      | 11     | 1949–51 permanent housing stock. Same distance gate, also lifted — still must clear the doorway test on its own content                                                                       |
| 5 — at most one | **רעננה** _or_ **הרצליה** | 20 / 14 | 9 / 6  | Both rest on the same בנייני רכבת typology — shipping both is exactly what the substitution test punishes. Prefer רעננה on claim count                                                        |
| Hold            | **ראשון לציון**           | 20      | 4      | 4 claims is no margin, and its urban-renewal angle duplicates בת ים's frame                                                                                                                   |
| Hold            | **מודיעין**               | 40      | 10     | Good claims, but at 40 km it has **no contiguous partner** — its `nearby` block renders empty — and it is outside any plausible same-day radius                                               |

**Every city must clear the doorway gate in [content-standards.md](content-standards.md) §2 before
it ships.** The gate is re-run per city, not inherited from batch 1.

> **Budget note:** at roughly 305 KB of export per location page, the nine remaining cities would
> add ~2.7 MB and breach the export ceiling (6 MB when this was written; 7.5 MB since the owner
> raised it on 2026-10-12, 8 MB since 2026-10-27 — still breached). Add the export-size assertion to the `/new-city`
> gate now, not after it breaks.

### Done when

- Every shipped city passes the substitution test; ≥350 unique words each; zero orphans.
- `Service.areaServed` name matches `LocalBusiness.areaServed` byte-for-byte on every city page.
- `du -sb out` under 6,291,456 bytes.
- Claim research for each new city is recorded with untruncated source text, and business-facts §E
  links to it.

---

## Sprint 8 — The second guide triplet

**Goal:** finish the six gate-3 citable topics and give the two thinnest commercial pages long-form
support.

**Why fifth:** the largest content investment in the plan and the only one with **no defect behind
it** — nothing is broken; three guides are simply unwritten. It also benefits most from everything
above: corrected authoring skills (Sprint 5), working measurement to judge the traffic (Sprint 6),
and a repaired mesh to plug into (Sprint 7).

1. **למה כתם הרטיבות כמעט אף פעם לא נמצא מתחת לנזילה** — water tracking along pipes and slabs. The
   most quotable-verbatim fact the business owns, and the natural inbound-link target from every
   service page. Today it appears only as a single location claim.
2. **מה חברת ביטוח באמת דורשת בדו״ח נזילה — ומה גורם לדחיית תביעה** → links down to
   `/services/insurance-reports/`, the page sitting closest to its word floor. Turnaround as a
   number is Track O #6 — **write around it; do not invent it.**
3. **למה בודקים לוח חשמל תחת עומס — ומה אומרת דרגת חומרה של נקודה חמה** → links down to
   `/services/electrical-thermography/`. Equipment model is Track O #5 — write around it.

Plus: add a **freshness rule** to `/new-article` and the build gate. Nothing in `.claude/` currently
instructs bumping `dateModified` on a _later_ edit, while the sitemap reads it directly — without
this, these guides will advertise a stale date the day someone edits them.

### Done when

- Six `/guides/` routes live, each ≥900 words, each with a 40–60 word answer block under a
  question-form H2, one comparison table, a real byline resolving to `/about/#founder`, and ≥2
  contextual links into the service that monetises it.
- `out/llms.txt` lists all six, asserted by the parity check.
- Each guide's `dateModified` equals its file's last content commit date; the sitemap agrees.
- **Factual review of all six** against [content-standards.md](content-standards.md) §6 "free to
  state". The three _existing_ guides have never had one — ~2,700 words of thermography and
  insurance claims under a real byline, checked for schema and word count but never for accuracy. A
  wrong claim in a bylined guide is the same class of E-E-A-T defect as a fabricated review.

---

## Sprint 9 — Owner-gated upside (a queue, not a sequence)

Start any row the day its fact lands. None blocks another.

| Trigger                                                                         | Work                                                                                                                                                    | Backlog    |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| GBP URL (#1)                                                                    | `sameAs` on the LocalBusiness node; GBP link on `/contact/` and `/about/`                                                                               | §5.3, §4.2 |
| ≥5 sourced reviews (#2)                                                         | Rebuild `/reviews/`, retire the 301, `Review` + honest `AggregateRating`. **Sourced or not at all — golden rule 3.**                                    | §7.1       |
| Certificate number (#3)                                                         | `hasCredential` on the founder; restore `הסמכות` as the heading                                                                                         | §7.3       |
| Price confirmed (#4)                                                            | `Offer`/`PriceSpecification`; clears 🔶 on 5 routes                                                                                                     | §7.7       |
| FLIR model (#5)                                                                 | Replace the generic equipment phrasing; author-bio line                                                                                                 | §7.3       |
| Turnaround (#6)                                                                 | Concrete answer block on `/services/insurance-reports/`                                                                                                 | §7.7       |
| Radius (#7)                                                                     | Unblocks location batch 4                                                                                                                               | §5.4       |
| National claim (#8)                                                             | Restore the clause, or leave it removed permanently                                                                                                     | §5.4       |
| ח.פ. (#9)                                                                       | `legalName` on the business node                                                                                                                        | §7.3       |
| Insurance (#10)                                                                 | The signal ועדי בתים and property managers ask for                                                                                                      | §7.3       |
| Coordinator name (#11)                                                          | `/accessibility/` currently asserts one with no name                                                                                                    | §11.2      |
| Photo + consent (#12)                                                           | Author bio block on all guides                                                                                                                          | §7.5       |
| Job references (#13)                                                            | Strengthens every city page's doorway margin                                                                                                            | §3.4       |
| Imagery + consent (#14)                                                         | Before/after thermal gallery; case studies. Solves E-E-A-T, doorway, AEO and CRO at once. If a slider ships, WCAG 2.5.1 applies — no path-only gestures | §7.1       |
| **CSP promotion** (no owner fact — needs Sprint 6 task 5's walkthrough to pass) | Drop `-Report-Only`                                                                                                                                     | §12.2      |

**Bilingual stays conditional** and gated on [accessibility-and-i18n.md](accessibility-and-i18n.md)
§B0 — build only if a named audience exists. English permanently doubles content, floors and audits.
Nothing above depends on it.

---

## Deliberately not scheduled

Recorded so they are not re-litigated at every audit.

- **`CollectionPage mainEntity`/`ItemList`** — no search feature consumes it; the hubs already expose
  their members as crawlable links. A preference, not a gap.
- **Padding the three sub-40-word answer blocks** — the spec's own **Good** exemplar measures 32
  words by the same tokenizer, so 35–39-word Hebrew blocks cannot be faulted against it. Editing
  them would be padding to hit a number, which the same doc warns against.
- **Reordering the service-page sidebar on mobile** — the page already ships H1 + answer block first
  with a fixed call bar. Revisit only if Sprint 6's event data shows service-page → call conversion
  lagging `/pricing/`.
- **Relaxing CLAUDE.md §6's `dir="ltr"` rule** — nothing misrenders; §6 is NON-NEGOTIABLE and
  narrowing it is the owner's call, not an auditor's.
- **Bumping `next` past the pinned 16.2.9** — would clear the prod-tree advisories, but none is
  reachable under `output: "export"` + `images.unoptimized`, and it changes a version CLAUDE.md §3
  pins. Its own decision. **Do** add a non-blocking `npm audit --omit=dev --audit-level=high || true`
  step to CI, and **do** pin the float-tagged `actions/checkout@v4` / `actions/setup-node@v4` to
  SHAs — that workflow is the one place third-party code runs with repo context.

---

## Standing operating cadence

The single root cause behind most of the 2026-09-06 findings is that **nothing owned freshness** —
not the content's, and not the environment's. The backlog declared itself the shared acceptance bar
for `.claude/` and then tracked only the code.

### Per-commit (automatic)

| What                                                                                                        | Mechanism                                                                                   |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Route counts, sitemap parity, orphans, fabrication greps, `og:image`/`og:url`, `text-ink/<70`, export ≤8 MB | `/qa-build-gate` — **derived assertions, not `# expect N` comments**                        |
| Sitemap ↔ emitted tree ↔ `llms.txt` parity                                                                  | `npm run check:sitemap`                                                                     |
| Sitemap `lastModified` vs `git log -1` on each backing file                                                 | gate line                                                                                   |
| Prettier on changed files                                                                                   | `.claude/hooks/format-changed.ps1` — a deliberate no-op until `prettier` is a devDependency |

### Per-sprint (blocking)

> **Any sprint that changes the route count, the component list, a `lib/*` file, or the status of a
> backlog item must, in the same commit, update every agent and skill that cites the changed state.**
> Not the next sprint. The same commit.

### Recurring re-audits

| Cadence                      | What                                                                                                                   | Who                    |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| **Every deploy**             | Live `robots.txt` fetch; live header check; confirm the change is actually on production                               | `/deploy-thermoleak`   |
| **Weekly**                   | GA4 Realtime smoke: one call, one WhatsApp, one thank-you from a real device                                           | Owner                  |
| **Monthly**                  | AI-citation spot-check — the six gate-3 questions against ChatGPT, Perplexity, AI Overviews                            | `aeo-geo-strategist`   |
| **Monthly**                  | `npm audit --omit=dev`; re-triage on the runtime-shipped axis                                                          | `security-auditor`     |
| **Monthly**                  | GSC coverage + query drift for the location silo and the guides                                                        | `local-seo-strategist` |
| **Quarterly**                | Full perf re-pass; re-baseline [performance-guidelines.md](performance-guidelines.md) §1 against a fresh `out/`        | `perf-a11y-auditor`    |
| **Quarterly**                | Contrast + focus + tap-target sweep; re-date `/accessibility/` **in the same commit as any fix, never before**         | `perf-a11y-auditor`    |
| **Quarterly**                | `schema-auditor` against the rewritten [schema-graph.md](schema-graph.md); Rich Results Test on one route per family   | `schema-auditor`       |
| **Quarterly**                | `.claude/` freshness sweep — route counts, component list, backlog status flags, deploy mechanism, purge-history tense | Any agent              |
| **Semi-annual**              | `docs/` cross-check — every "currently" and "today" claim re-verified against the build                                | Any agent              |
| **On any Cloudflare change** | Re-verify AI-crawler robots policy, Scrape Shield (`EmailOff` depends on it), cache rules                              | Owner + any agent      |

### Two invariants worth writing on the wall

1. **Verify the edge, then believe it.** Never infer a header, a redirect, a robots policy or a
   deploy from the repo. `curl` it. This repo believed the wrong deploy target for fifteen days.
2. **A closure is not closed until the register says so in the same commit.** Every false closure
   found in the 2026-09-06 audit is the same failure: the fix landed and the bar was not updated, or
   the bar was updated and the fix did not land.

---

## Definition of done — applies to every sprint

1. `npm run lint && npm run build` clean from a cold `.next`.
2. `/qa-build-gate` passes end to end, including the fabrication greps, **and**
   `npm run check:sitemap` — a command cited throughout this file that had never actually been run
   before 2026-09-06.
3. No claim shipped that [business-facts.md](business-facts.md) marks 🔶.
4. Relevant auditor agent run against a **fresh** `out/` — compare its mtime to `git log -1` first;
   auditing a stale export measures an artifact nobody serves.
5. [optimization-backlog.md](optimization-backlog.md) updated — sections marked ✅ with the date,
   **numbering left stable**.
6. Deployed via `/deploy-thermoleak` (dry-run → `-Confirm`) and **verified live** by asserting
   content only the new build has — never a status code on an old route. **Deploying is a production
   mutation; ask first.**
