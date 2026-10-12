# Business facts — intake sheet

**This is the one file an AI agent may not fill in.** Everything below is a claim the site either makes
without proof, or needs and doesn't have. Fill in the `Value` column, flip `Status` to ✅, and the
matching agent or skill will wire it into the right place.

**Status key:** 🔶 unconfirmed (never state as fact) · ✅ confirmed · ❌ not applicable / decided against

**Where confirmed values land:**

- **`lib/site.ts`** — NAP, hours, service areas, stats, `credentials` (renamed from `certifications` 2026-09-17), social. This is the source of
  truth for this repo; nothing syncs into it automatically.
- **`lib/services.ts` / `lib/faqs.ts`** — wording, per-service claims, FAQ answers.
- **`lib/reviews.ts`** — does not exist. Deleted 2026-08-17 with the fabricated testimonials; recreate only when real sourced reviews arrive. See §B.
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
| Legal name          | **טרמוליק** — NOT `בע״מ`. Corrected 2026-09-17: no company registration exists. The roster still says `טרמוליק בע״מ` and is **wrong**; this file wins | owner, 2026-09-17 |
| Year founded        | **2015** — the business is 11 years old. The founder's field experience is separate: ~2005 → "20+ בשטח" | roster `foundedYear` + owner |
| Service area (text) | גוש דן והמרכז                                              | roster `schema.areaServed`      |
| Search Console tag  | `BxQI2a7Ich4zF5TWYlTsXPCi7iAueoYlddQLGxW62p0`              | `app/layout.tsx:32` (live, public) |

> ⚠️ **The roster manifest is now behind this file on two facts** — it still carries
> `טרמוליק בע״מ` as the legal name and has no record of the ₪350 price. The roster is a reference,
> not a build input, so nothing breaks; but per CLAUDE.md §5 the two should be reconciled by hand.
> **This file wins.**

---

## A. Identity & people — founder confirmed, credentials still open

**Resolved 2026-08-24: the founder is רונן דהן.** **Resolved 2026-09-17 (owner, in conversation):**
years in the trade, team size — and, importantly, two **negative** answers. There is **no company
registration and no ח.פ.**, so `site.legalName` dropped `בע״מ`; and there is **no accessibility
coordinator**, so `/accessibility/` no longer asserts one.

> ⚠️ **A ❌ row is an answer, not a gap.** Three rows below are confirmed ABSENT. Do not re-open
> them as "missing facts to chase", and never let a future agent refill them.

| Field                          | Why it's needed                                             | Lands in                  | Value                              | Status |
| ------------------------------ | ----------------------------------------------------------- | ------------------------- | ---------------------------------- | ------ |
| Owner / founder name           | `Person` schema, author bylines, the About story            | `lib/site.ts` + `/about/` | **רונן דהן**                       | ✅     |
| Owner's years in the trade     | The "experience" half of E-E-A-T                            | `lib/site.ts`             | **in the trade since ~2005** (10 years before founding in 2015) | ✅ |
| Technician count / team shape  | "צוות" was implied but never quantified                     | `lib/site.ts`             | **2 people**                       | ✅     |
| ח.פ. / ע.מ. number             | Was claimed via `בע״מ` with no number behind it             | `lib/site.ts`             | **none — not a registered company** | ❌    |
| Permission to publish a photo  | A named face is the strongest single trust signal available | `public/images/`          |                                    | 🔶     |

> **On the two experience numbers.** The BUSINESS was founded 2015 (11 years). The FOUNDER has been
> in the trade ~20 years. `site.stats.years` says "20+ שנות ניסיון **בשטח**" — the word בשטח is
> load-bearing. Writing "20 years in business" would be false.

## B. Proof & authority — fabrications purged, real proof still missing

**Resolved 2026-08-17:** the six invented testimonials, the `/reviews/` page (now a 301 to
`/about/`), the 4.9/6 `aggregateRating`, and the facebook.com/instagram.com `sameAs`/footer links
were all **removed**. The site no longer fabricates proof — but it now has **none**, which keeps
this section the highest-priority ask. The rows below are what replaces them legitimately.

| Field                                                  | Why it's needed                                                                 | Lands in               | Value                              | Status |
| ------------------------------------------------------ | ------------------------------------------------------------------------------- | ---------------------- | ---------------------------------- | ------ |
| **Google Business Profile URL** (service-area profile) | The top local lever; `sameAs`; the only legitimate source for `aggregateRating` | `lib/site.ts` `social` | **does not exist yet** — owner will open one | 🔶 |
| Facebook page URL                                      | `sameAs`; entity corroboration                                                  | `lib/site.ts` `social` |                                    | 🔶     |
| Instagram URL                                          | `sameAs`; thermal imagery is a natural fit                                      | `lib/site.ts` `social` |                                    | 🔶     |
| 5–10 real reviews (author, date, text, **source URL**) | Replaces the six fabricated ones                                                | a new `lib/reviews.ts` |                                    | 🔶     |
| Real review count + average rating                     | `AggregateRating`. **Ships only with a verifiable public source**               | derived from the above |                                    | 🔶     |
| Equipment — which thermal camera?                      | A specific model is a genuine expertise signal                                  | `lib/site.ts`          | **FLIR E8**                        | ✅     |
| Insurance (ביטוח צד ג׳)                                | Standard trade trust signal                                                     | `lib/site.ts`          | **yes — held** (insurer and coverage amount not supplied, so no figure ships) | ✅ |
| Thermography certification — issuing body + number     | Was claimed as "Thermography Level 1" with no certificate behind it             | `lib/site.ts`          | **none — no certificate held**     | ❌     |
| Trade association membership                           | Authority signal                                                                | `lib/site.ts`          | **none**                           | ❌     |

> ⚠️ **The certification row is ❌, not 🔶.** The owner confirmed 2026-09-17 there is no
> thermography certificate, and the unbacked "Level 1" line was deleted from `site.credentials` on
> his instruction. `site.certifications` no longer exists — the field is now `credentials`, and it
> holds only concrete capabilities. **Never reintroduce a certification claim**, and do not treat
> this as an open ask.

## C. Commercial terms — the guarantee has no scope

`site.guarantee` is **"לא מצאנו — לא שילמתם"**, rendered as a headline promise on every service page,
with **no definition of "found", no exclusions, and no stated call-out fee**. It is simultaneously the
strongest conversion asset on the site and its largest undefined liability.

`site.priceFrom` is `450` and three of the four services state "החל מ-₪350"; the fourth
(`insurance-reports`) and `electrical-thermography` quote per job. The roster marks prices unverified.

### ✅ APPROVED guarantee wording — confirmed by the owner 2026-08-24, now PUBLISHED

**All three decisions below were confirmed and this is now live** on `/pricing/` via
`components/GuaranteeTerms.tsx`, sourced from `site.guaranteeTerms`. It also resolved the 🔶 in the
pricing guide FAQ. The recommendation is to
**define the guarantee narrowly and state the exclusions plainly** — a precisely bounded promise
converts better than a vague one, because it removes the suspicion of a catch, and it is the
boundary that prevents disputes.

> **לא מצאנו — לא שילמתם**
>
> **מה נחשב איתור:** זיהוי וסימון של מקור הרטיבות או הנזילה, מאומת במדידה משלימה ולא בממצא תרמי
> בלבד. איתור הוא קביעת המקור — לא ביצוע התיקון.
>
> **אם לא אותר מקור:** לא תחויבו על הביקור.
>
> **מה לא נכלל:** תיקון, פתיחת קירות או ריצוף, ועבודות איטום. אלה מבוצעים על ידי בעל מקצוע
> ומתומחרים בנפרד.
>
> **מתי האחריות אינה חלה:** כאשר לא ניתנה גישה לאזור הנדרש; כאשר התבקשנו שלא להפעיל מערכת שנדרשה
> לבדיקה; וכאשר הנזילה אינה פעילה במועד הבדיקה ולא ניתן היה לתאם מועד חלופי.

**The three decisions, all CONFIRMED:**

1. **No call-out fee on a no-find.** Simplest to state and strongest commercially. The alternative
   (a reduced fee covering travel) is defensible but weakens the promise — pick one.
2. **"Found" means the source is identified and verified**, not that the customer agrees with the
   finding. Without this line, "we didn't find it" becomes arguable after the fact.
3. **An inconclusive visit where the leak was not running counts as a no-find** (so: not charged),
   unless a return visit was offered and declined. This is the honest reading and it matches what
   the guides already tell readers.

**On pricing:** keeping a stated *starting* price with the factors that move it published (as
`/pricing/` already does) beats "call for a quote" — price opacity is a conversion tax on a crisis
purchase. **The owner confirmed ₪350 on 2026-09-17** (the site had been showing an unverified ₪350,
so this was a real correction, not a rubber stamp).

| Field                                     | Why it's needed                                         | Lands in                  | Value                | Status |
| ----------------------------------------- | ------------------------------------------------------- | ------------------------- | -------------------- | ------ |
| Starting price                            | Stated on the homepage, `/pricing/` and two services    | `lib/site.ts` `priceFrom` | **₪350**             | ✅     |
| Guarantee: what counts as "מצאנו"         | Defines the entire promise                              | `lib/site.ts` + services  | ✅ published         | ✅     |
| Guarantee: exclusions and call-out fee    | Reduces post-sale disputes                              | `lib/services.ts`         | ✅ no call-out fee   | ✅     |
| Issues a חשבונית מס?                      | Conversion friction; ועדי בתים and businesses need it   | `lib/site.ts`             | **yes**              | ✅     |
| What the ₪350 visit includes/excludes      | The #1 pre-purchase question; AEO answer-block material | `lib/site.ts` `visitScope` | **approved verbatim 2026-09-17** — renders on `/pricing/` | ✅ |
| Report turnaround                         | Was only a vague "מספר ימי עסקים"                       | `lib/site.ts` `reportTurnaroundDays` | **3 business days** | ✅ |
| Accepted payment methods                  | Card / transfer / Bit — none confirmed                  | `lib/site.ts`             |                      | 🔶     |

> ✅ **Both resolved the same day, and the route there is the point.** Asked what a visit includes
> and how long a report takes, the owner first answered "use your experience" and "the standard".
> That is **not an answer a site may publish** — they are facts about *this* business, and a
> reasonable-sounding guess is still fabrication under golden rule 1. So a draft was written
> **from claims already published** (`guaranteeTerms.excluded`, and the "מתומחרים בנפרד" lines on
> the reports and panel services), put to the owner, and **approved verbatim**. Turnaround came
> back as **3 business days**.
>
> **Reuse this pattern.** When an owner delegates a factual question back, do not accept the
> delegation and do not invent — draft from what the site already commits to, and get an explicit
> yes. The result is sourced; a guess would not have been.

## D. Performance claims — three numbers with no measurement

`site.stats` renders in `TrustBar` on the homepage as the site's primary proof block.

| Claim                              | Status                                                        | Lands in            | Value | Status |
| ---------------------------------- | ------------------------------------------------------------- | ------------------- | ----- | ------ |
| `20+ שנות ניסיון בשטח`             | **Confirmed 2026-09-17** — founder in the trade since ~2005. Raised from `10+`, which had been derived from the 2015 founding year. The label says **בשטח** because this is the founder's experience, not the company's age | `lib/site.ts` stats | ~2005 | ✅ |
| `3,000+ בתים ועסקים`               | **Removed from the site 2026-08-17.** Returns only with a record behind it | `lib/site.ts` stats |  | 🔶     |
| `97% איתור כבר בביקור הראשון`      | **Removed from the site 2026-08-17.** Returns only if actually measured    | `lib/site.ts` stats |  | 🔶     |
| `4.9 דירוג לקוחות ממוצע`           | **Removed 2026-08-17 with the fabricated reviews** — see §B                | —                   |  | ❌     |
| Emergency availability             | `emergencyNote` claims out-of-hours service for active leaks  | `lib/site.ts`       |       | 🔶     |

## E. Coverage & geo

The placeholder `geo` (Tel Aviv city centre, for a business with **no public premises**) was removed
2026-08-17. `site.serviceAreas` names 12 cities; 3 have pages.

**Resolved 2026-09-17:** the national clause is **true**, and the real reach is **about two hours'
drive from Tel Aviv** — which is most of the country and far beyond the "עד 60 ק״מ" the site had
been claiming. That figure was never confirmed and has been removed from `serviceAreaText`,
`lib/faqs.ts`, `/about/` and `/locations/`.

> **Roadmap consequence:** Sprint 7's location batch 4 (כפר סבא 23 km, ראש העין 25 km) was gated on
> this exact answer. **That gate is now lifted on distance.** Each city still has to clear the
> doorway test on its own content — distance was never the only gate.

| Field                                              | Why it's needed                                                      | Lands in                | Value | Status |
| -------------------------------------------------- | -------------------------------------------------------------------- | ----------------------- | ----- | ------ |
| Real operating base (or: drop `geo` entirely)      | A placeholder coordinate is worse than none for a service-area business | `lib/site.ts` `geo`   | `geo` removed 2026-08-17; no base supplied | 🔶 |
| Is "שירות ארצי בתיאום מראש" true?                  | It's a coverage claim; a false `areaServed` is a liability            | `lib/site.ts`           | **yes — true** | ✅ |
| Realistic travel reach                             | Gates which cities can honestly be claimed                           | `lib/site.ts` `serviceAreaText` | **up to ~2 hours' drive from Tel Aviv** | ✅ |
| Which of the 12 cities have real job history?      | Decides which earn a location page at all (`/new-city` gate)          | `lib/locations.ts`      |       | 🔶     |
| Realistic **same-day** radius                      | "זמינות מהירה" is claimed sitewide. Distinct from travel reach: two hours' drive is what he *will* travel, not what he can reach same-day | `lib/site.ts` |  | 🔶 |
| Is there a Google Business Profile address to hide? | Service-area profiles must not contradict the site                   | GBP                     | no profile exists yet | 🔶 |

### 🔶 Location silo — 3 built, 9 deferred (gate run 2026-08-24)

An adversarially-verified gate (49 agents: 12 assessments, 36 refutation passes across three
lenses, 1 synthesis) found that **all 12 service areas have 3+ true, publicly verifiable,
city-specific claims available.** That answered *could we* — not *should we*.

**Built:** תל אביב-יפו · חולון · בת ים — chosen as a geographically contiguous cluster (so the
`nearby` edges are honest), zero unverifiable claims each, and the largest combined market in
the core service area.

**Deferred, with verified claims preserved** so the next batch is a data edit, not a re-run.
Order is by strength of verified claim set:

| City | km | Verified claims | Strongest local angle |
| --- | --- | --- | --- |
| רמת גן | 6 | 13 | רמת גן היא מהערים המובילות בישראל בהיקף פרויקטי תמ״א 38 והתחדשות עירונית. זה מייצר כאן שני סוגי קריאות שונים ל… |
| גבעתיים | 5 | 11 | גבעתיים בנויה על ארבע גבעות — בורוכוב, קוזלובסקי, גבעת רמב״ם וגבעת פועלי הרכבת — וגבעת קוזלובסקי מתנשאת לכ-87 … |
| הרצליה | 14 | 6 | בשכונת יד התשעה שבהרצליה עומדים כ-94 ״בנייני רכבת״ ישנים, בני שתיים־שלוש כניסות, שהוקמו ברובם בסוף שנות ה-50. … |
| פתח תקווה | 12 | 9 | אם המושבות החדשה, בצפון-מערב פתח תקווה, החלה להיבנות ב-2003, ואופי הבנייה בה הוא בנייני מגורים בני 9–23 קומות … |
| ראשון לציון | 20 | 4 | רמת אליהו נמצאת בתוך אחת מתכניות הפינוי־בינוי הגדולות בישראל, המשתרעת על כ־633 דונם — כך שבאותה שכונה עומדים ז… |
| רעננה | 20 | 9 | שכונת קריית שרת שבצפון רעננה הוקמה בשנות ה־50 כשכונת עולים, וחלק ניכר ממנה עדיין בנוי מ״בנייני רכבת״ בני שלוש … |
| כפר סבא | 23 | 11 | בכפר סבא המים אינם מסופקים על ידי תאגיד מים עירוני רגיל, אלא על ידי מפעל המים כפר סבא — אגודה חקלאית שיתופית ה… |
| ראש העין | 25 | 11 | ראש העין הוקמה ב-1949 כמעברה לעולי תימן, ובתי הקבע הראשונים נבנו החל מ-1951 — כלומר חלק ניכר מהמלאי הוותיק במע… |
| מודיעין | 40 | 10 | מודיעין היא עיר מתוכננת חדשה: הבנייה בה החלה ב-1994 והאכלוס הראשון היה ביולי 1996. משמעות הדבר היא שכל בנייני … |

**⚠️ EVERY claim in this silo — built and deferred — needs owner confirmation.** They are
adversarially checked against public sources, not sourced by someone who has worked in those
buildings. Verification is not truth. Correct anything wrong.

**The one thing that would most strengthen every page:** a real job reference per city. That is
the strongest doorway-test item and the only one research cannot supply.


## F. Infrastructure — owner-only changes

| Field                              | Why it's needed                                                                                                                                                                        | Lands in         | Value | Status |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ----- | ------ |
| **Analytics decision**             | ✅ RESOLVED 2026-08-24 — join the shared fleet container. 10 of 12 fleet sites carry it; id verified HTTP 200. Installed via `components/Analytics.tsx` (`afterInteractive`). Accepted trade: ~90 KB exceeds the 50 KB tag budget; Zaraz stays the lighter option if that is ever enforced | `app/layout.tsx` | `GTM-KWGGH438` | ✅ |
| GA4 measurement ID                 | Needed either way once the decision is made                                                                                                                                            | container / repo |       | 🔶     |
| **AI-crawler stance**              | **✅ RESOLVED 2026-08-17.** The managed block (ClaudeBot/GPTBot/Google-Extended/CCBot Disallow) was confirmed live in the morning, the owner turned the toggle off, and the live `robots.txt` now serves the repo's blanket allow — verified. Re-verify after any Cloudflare plan/setting change | Cloudflare       | open  | ✅     |
| Security headers approval          | HSTS shipped 2026-08-17 without `preload`/`includeSubDomains`; escalating either needs sign-off (near-irreversible)                                                                     | `public/_headers`  |     | 🔶     |
| Roster sync                        | `thermoleak.json` records `googleSiteVerification: null` while the site ships a real token — update the roster                                                                          | roster           |       | 🔶     |

## G. The live surfaces (fleet live-kit, owner decision 2026-10-11)

The announcement bar, the seasonal card and the homepage updates strip (CLAUDE.md §14) print only
sentences this site already shows, quoted in each line's `source`; `live.config.mjs` turns every 🔶
and ❌ row above into a ⛔ stem the build enforces. Drafted 2026-10-12, not yet shown to the owner.

| Fact                                                | Current value                                                                  | Source                                                         | Status                                                                        |
| --------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| The live wording (bar lines, the card, the updates) | draft of 2026-10-12 in `content/live/` — six seasonal lines to 31/10/2027, one card (first rains) | quoted from `lib/services.ts`, `lib/articles.ts`, `lib/pricing.ts` | 🔶 awaiting the owner's approval (`approved` field in both registers)         |
| Wartime line (`reduced` in `_campaigns.mjs`)        | `פועלים בכפוף להנחיות פיקוד העורף`, shown only in the switch's `reduced` mode  | worded for 3locksmiths, owner-confirmed there 2026-10-04       | 🔶 **does טרמוליק work under Home Front Command restrictions?** If not, the entry is deleted |

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
