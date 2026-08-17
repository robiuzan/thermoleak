# Business facts — intake sheet

**This is the one file an AI agent may not fill in.** Everything below is a claim the site either makes
without proof, or needs and doesn't have. Fill in the `Value` column, flip `Status` to ✅, and the
matching agent or skill will wire it into the right place.

**Status key:** 🔶 unconfirmed (never state as fact) · ✅ confirmed · ❌ not applicable / decided against

**Where confirmed values land:**

- **`lib/site.ts`** — NAP, hours, service areas, stats, certifications, social. This is the source of
  truth for this repo; nothing syncs into it automatically.
- **`lib/services.ts` / `lib/faqs.ts`** — wording, per-service claims, FAQ answers.
- **`lib/reviews.ts`** — testimonials. Currently fabricated; see §B.
- **Roster** — `Israeli services sites/roster/sites/thermoleak.json` is the fleet's record of this site.
  It is a **reference, not an upstream build input**: editing it changes nothing here. Keep the two in
  sync by hand when a fact is confirmed.
- **Cloudflare / GitHub** — owner-only changes outside the repo.

---

## Already confirmed — do not re-flag these

| Fact                | Value                                                      | Source                          |
| ------------------- | ---------------------------------------------------------- | ------------------------------- |
| Phone (display)     | `055-660-1006`                                             | roster — **real fleet number**  |
| Phone (E.164 / tel) | `+972556601006`                                            | roster                          |
| WhatsApp            | `972556601006` (same number)                               | roster                          |
| Email               | `info@thermoleak.co.il`                                    | roster                          |
| Brand name (he/en)  | טרמוליק / ThermoLeak                                       | roster                          |
| Legal name          | טרמוליק בע״מ                                                | roster                          |
| Year founded        | **2015** — so "10+ שנות ניסיון" is defensible              | roster `foundedYear`            |
| Service area (text) | גוש דן והמרכז                                              | roster `schema.areaServed`      |
| Search Console tag  | `BxQI2a7Ich4zF5TWYlTsXPCi7iAueoYlddQLGxW62p0`              | `app/layout.tsx:32` (live, public) |

> ⚠️ The repo's own `CLAUDE.md` still warns that phone, WhatsApp and email are invented. **That warning
> is stale for those three fields** — they are real. It remains correct for prices, stats, reviews and
> geo. Update the warning when you next touch that file.

---

## A. Identity & people — nobody is named anywhere

No owner, founder or technician is named on the site. The About story is written entirely in the
corporate "we", there is no `Person` in the schema, and no article can carry a byline until this is
filled. `site.legalName` claims a registered company (`בע״מ`) whose number is never given.

| Field                            | Why it's needed                                                     | Lands in                  | Value | Status |
| -------------------------------- | ------------------------------------------------------------------- | ------------------------- | ----- | ------ |
| Owner / founder name             | `Person` schema, author bylines, the About story                    | `lib/site.ts` + `/about/` |       | 🔶     |
| Owner's years in the trade       | The "experience" half of E-E-A-T                                    | `lib/site.ts`             |       | 🔶     |
| ח.פ. / ע.מ. number               | Standard IL trust signal; `בע״מ` is claimed without one             | `lib/site.ts` + `/about/` |       | 🔶     |
| Technician count / team shape    | "צוות" is implied but never quantified                              | `lib/site.ts`             |       | 🔶     |
| Permission to publish a photo    | A named face is the strongest single trust signal available         | `public/images/`          |       | 🔶     |

## B. Proof & authority — fabrications purged, real proof still missing

**Resolved 2026-08-17:** the six invented testimonials, the `/reviews/` page (now a 301 to
`/about/`), the 4.9/6 `aggregateRating`, and the facebook.com/instagram.com `sameAs`/footer links
were all **removed**. The site no longer fabricates proof — but it now has **none**, which keeps
this section the highest-priority ask. The rows below are what replaces them legitimately.

| Field                                                    | Why it's needed                                                                             | Lands in                | Value | Status |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ----------------------- | ----- | ------ |
| **Google Business Profile URL** (service-area profile)   | The top local lever; `sameAs`; the only legitimate source for `aggregateRating`             | `lib/site.ts` `social`  |       | 🔶     |
| Facebook page URL                                        | `sameAs`; entity corroboration. Currently a link to facebook.com                            | `lib/site.ts` `social`  |       | 🔶     |
| Instagram URL                                            | `sameAs`; thermal imagery is a natural fit                                                  | `lib/site.ts` `social`  |       | 🔶     |
| 5–10 real reviews (author, date, text, **source URL**)   | Replaces the six fabricated ones                                                            | `lib/reviews.ts`        |       | 🔶     |
| Real review count + average rating                       | `AggregateRating`. **Ships only with a verifiable public source**                           | derived from the above  |       | 🔶     |
| Thermography certification — issuing body + number       | `site.certifications` claims "Level 1" with no certificate                                  | `lib/site.ts`           |       | 🔶     |
| Equipment claim — is it FLIR, and which model?           | Claimed in `certifications`; a specific model is a genuine expertise signal                 | `lib/site.ts`           |       | 🔶     |
| Insurance (ביטוח צד ג׳)                                  | Standard trade trust signal; appears nowhere                                                | `lib/site.ts`           |       | 🔶     |
| Trade association membership                             | Authority signal                                                                            | `lib/site.ts`           |       | 🔶     |

## C. Commercial terms — the guarantee has no scope

`site.guarantee` is **"לא מצאנו — לא שילמתם"**, rendered as a headline promise on every service page,
with **no definition of "found", no exclusions, and no stated call-out fee**. It is simultaneously the
strongest conversion asset on the site and its largest undefined liability.

`site.priceFrom` is `450` and three of the four services state "החל מ-₪450"; the fourth
(`insurance-reports`) and `electrical-thermography` quote per job. The roster marks prices unverified.

| Field                                        | Why it's needed                                          | Lands in                    | Value | Status |
| -------------------------------------------- | -------------------------------------------------------- | --------------------------- | ----- | ------ |
| Is ₪450 the current starting price?          | Stated on the homepage and three service pages           | `lib/site.ts` `priceFrom`   |       | 🔶     |
| What the ₪450 visit includes / excludes      | The #1 pre-purchase question; AEO answer-block material  | `lib/services.ts`           |       | 🔶     |
| Guarantee: what counts as "מצאנו"            | Defines the entire promise                               | `lib/site.ts` + services    |       | 🔶     |
| Guarantee: exclusions and call-out fee       | Reduces post-sale disputes                               | `lib/services.ts`           |       | 🔶     |
| Report turnaround ("מספר ימי עסקים")         | Stated in the insurance-reports FAQ                      | `lib/services.ts`           |       | 🔶     |
| Payment methods / invoice terms              | Conversion friction                                      | `lib/site.ts`               |       | 🔶     |

## D. Performance claims — three numbers with no measurement

`site.stats` renders in `TrustBar` on the homepage as the site's primary proof block.

| Claim                              | Status                                                        | Lands in            | Value | Status |
| ---------------------------------- | ------------------------------------------------------------- | ------------------- | ----- | ------ |
| `10+ שנות ניסיון בשטח`             | **Defensible** — `foundedYear: 2015` is in the roster         | `lib/site.ts` stats | 2015  | ✅     |
| `3,000+ בתים ועסקים`               | **Removed from the site 2026-08-17.** Returns only with a record behind it | `lib/site.ts` stats |  | 🔶     |
| `97% איתור כבר בביקור הראשון`      | **Removed from the site 2026-08-17.** Returns only if actually measured    | `lib/site.ts` stats |  | 🔶     |
| `4.9 דירוג לקוחות ממוצע`           | **Removed 2026-08-17 with the fabricated reviews** — see §B                | —                   |  | ❌     |
| Emergency availability             | `emergencyNote` claims out-of-hours service for active leaks  | `lib/site.ts`       |       | 🔶     |

## E. Coverage & geo

`site.geo` is `32.0853, 34.7818` — **Tel Aviv city centre**, emitted as `GeoCoordinates` for a business
with **no public premises**. `site.serviceAreas` names 12 cities, none of which has a page. The national
claim in `serviceAreaText` is broader than `areaServed`.

| Field                                              | Why it's needed                                                      | Lands in                | Value | Status |
| -------------------------------------------------- | -------------------------------------------------------------------- | ----------------------- | ----- | ------ |
| Real operating base (or: drop `geo` entirely)      | A placeholder coordinate is worse than none for a service-area business | `lib/site.ts` `geo`   |       | 🔶     |
| Is "שירות ארצי בתיאום מראש" true?                  | It's a coverage claim; a false `areaServed` is a liability            | `lib/site.ts`           |       | 🔶     |
| Which of the 12 cities have real job history?      | Decides which earn a location page at all (`/new-city` gate)          | `lib/locations.ts` (new) |      | 🔶     |
| Realistic same-day radius                          | "זמינות מהירה" is claimed sitewide                                    | `lib/site.ts`           |       | 🔶     |
| Is there a Google Business Profile address to hide? | Service-area profiles must not contradict the site                   | GBP                     |       | 🔶     |

## F. Infrastructure — owner-only changes

| Field                              | Why it's needed                                                                                                                                                                        | Lands in         | Value | Status |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ----- | ------ |
| **Analytics decision**             | The site collects **zero** analytics — no GTM, no GA4. Join the shared fleet container `GTM-KWGGH438` (GA4 resolved by hostname inside it) or stand alone? Owner call, blocks all tracking | `app/layout.tsx` |       | 🔶     |
| GA4 measurement ID                 | Needed either way once the decision is made                                                                                                                                            | container / repo |       | 🔶     |
| **AI-crawler stance**              | **✅ RESOLVED 2026-08-17.** The managed block (ClaudeBot/GPTBot/Google-Extended/CCBot Disallow) was confirmed live in the morning, the owner turned the toggle off, and the live `robots.txt` now serves the repo's blanket allow — verified. Re-verify after any Cloudflare plan/setting change | Cloudflare       | open  | ✅     |
| Security headers approval          | HSTS shipped 2026-08-17 without `preload`/`includeSubDomains`; escalating either needs sign-off (near-irreversible)                                                                     | `public/_headers`  |     | 🔶     |
| Roster sync                        | `thermoleak.json` records `googleSiteVerification: null` while the site ships a real token — update the roster                                                                          | roster           |       | 🔶     |

---

## Shipped 2026-08-17 — Phase 1–2 of the growth plan

- **Removed:** the six fabricated testimonials + `/reviews/` (301 → `/about/`), the 4.9
  `aggregateRating`, the placeholder `sameAs`/social links, the placeholder `geo`, and the
  unverifiable 3,000+/97% trust tiles.
- **Fixed:** the brandless homepage title and double-branded `/about/` title; the `text-ink/50`
  contrast failure (the accessibility statement is accurate again); `BreadcrumbList` now emitted by
  `PageHero` on all 10 trail-bearing pages.
- **Added:** `/pricing/` (money-intent page), `/thank-you/` (noindex conversion URL), answer blocks +
  honest-limits sections on all four service pages, a homepage method explainer, three new general
  FAQs, in-copy cross-links, 18 `data-cta` attributes, form failure-path handling with focus
  management, Navbar Escape/focus-return, security headers in `public/_headers`, real sitemap
  `lastModified` dates, and the logo no longer preloads against the hero.
- **Deployed to production 2026-08-17 via Cloudflare Pages** — which exposed that the repo's
  rsync-on-push pipeline had been retired by the 2026-08-02 DNS cutover and ran green against a
  dead server for 15 days. The workflow is now build-only CI; the deploy path is the fleet ops
  script; `.htaccess` is deleted in favour of `public/_headers` + `public/_redirects`.
- **Still owner-blocked:** GBP + real reviews (§B), named person + credentials (§A), analytics
  decision (§F), AI-crawler toggle and HTML cache rule (Cloudflare, §F), guarantee scope + price
  confirmation (§C).

## Verified during the 2026-08-16 environment build — with one major 2026-08-17 correction

- ~~**Deploy path:** GitHub Actions rsync to cPanel; pushing to `main` is the deploy.~~
  **WRONG — corrected 2026-08-17.** That was the repo's belief, and it had been false since the
  2026-08-02 DNS cutover to **Cloudflare Pages** (project `thermoleak`; apex + www are proxied
  CNAMEs to `thermoleak.pages.dev` — see the Sys Admin `inventory/domains.json`). The rsync
  workflow kept running green against the retired cPanel server for 15 days. Now: pushing to `main`
  is build-only CI; deploys go through the fleet ops script with a Pages-API drift check
  (CLAUDE.md §10). The old SSH Actions secrets are unused — delete them (owner action).
- **No cache purge needed:** Pages serves HTML `DYNAMIC` from the edge, fresh per deploy; assets
  are content-hashed and cached immutable via `public/_headers`.
- **Cloudflare Scrape Shield email obfuscation is ON** for this zone — it rewrites `mailto:` into a
  404-ing `/cdn-cgi/l/email-protection#…`. `components/EmailOff.tsx` works around it with real
  `<!--email_off-->` markers. Do not remove that component.
- **RTL hygiene is clean.** Zero banned physical-direction Tailwind utilities across `components/` and
  `app/`. Hebrew גרש/גרשיים used correctly throughout.
- **No hardcoded NAP literals** anywhere outside `lib/site.ts`.
- **Performance baseline is healthy:** `out/` ≈ 3.9 MB, no JS chunk over 500 KB, only two client
  components.
- **Zero orphan pages** among content routes.
