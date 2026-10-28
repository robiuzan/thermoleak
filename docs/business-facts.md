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

| Fact                | Value                                                                                                                                                 | Source                             |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Phone (display)     | `055-660-1006`                                                                                                                                        | roster — **real fleet number**     |
| Phone (E.164 / tel) | `+972556601006`                                                                                                                                       | roster                             |
| WhatsApp            | `972556601006` (same number)                                                                                                                          | roster                             |
| Email               | `info@thermoleak.co.il`                                                                                                                               | roster                             |
| Brand name (he/en)  | טרמוליק / ThermoLeak                                                                                                                                  | roster                             |
| Legal name          | **טרמוליק** — NOT `בע״מ`. Corrected 2026-09-17: no company registration exists. The roster still says `טרמוליק בע״מ` and is **wrong**; this file wins | owner, 2026-09-17                  |
| Year founded        | **2015** — the business is 11 years old. The founder's field experience is separate: ~2005 → "20+ בשטח"                                               | roster `foundedYear` + owner       |
| Service area (text) | גוש דן והמרכז                                                                                                                                         | roster `schema.areaServed`         |
| Search Console tag  | `BxQI2a7Ich4zF5TWYlTsXPCi7iAueoYlddQLGxW62p0`                                                                                                         | `app/layout.tsx:32` (live, public) |

> ⚠️ **The roster manifest is now behind this file on two facts** — it still carries
> `טרמוליק בע״מ` as the legal name and has no record of the ₪350 price. The roster is a reference,
> not a build input, so nothing breaks; but per CLAUDE.md §5 the two should be reconciled by hand.
> **This file wins.**

---

## A. Identity & people — founder confirmed, credentials still open

**Resolved 2026-08-24: the founder is רונן דהן.** **Resolved 2026-09-17 (owner, in conversation):**
years in the trade, team size — and, importantly, two **negative** answers. There is **no company
registration and no ח.פ.**, so `site.legalName` dropped `בע״מ`; and there is **no accessibility
coordinator**, so `/accessibility/` no longer asserts one. **Resolved 2026-10-22 (in conversation):**
the AI images of the team (`lib/gallery.ts`) may be published. They show עומר, the second
technician, not the founder (named 2026-10-26; first name only, because this repo is public).
**Changed 2026-10-26 (in conversation):** they ship with no label at all — no visible note or tags,
no הדמיה in the alt text, no AI marker in the files. עומר agreed himself, including to the
unlabelled version (confirmed 2026-10-26, in conversation).

> ⚠️ **A ❌ row is an answer, not a gap.** Three rows below are confirmed ABSENT. Do not re-open
> them as "missing facts to chase", and never let a future agent refill them.

| Field                         | Why it's needed                                             | Lands in                  | Value                                                           | Status |
| ----------------------------- | ----------------------------------------------------------- | ------------------------- | --------------------------------------------------------------- | ------ |
| Owner / founder name          | `Person` schema, author bylines, the About story            | `lib/site.ts` + `/about/` | **רונן דהן**                                                    | ✅     |
| Owner's years in the trade    | The "experience" half of E-E-A-T                            | `lib/site.ts`             | **in the trade since ~2005** (10 years before founding in 2015) | ✅     |
| Technician count / team shape | "צוות" was implied but never quantified                     | `lib/site.ts`             | **2 people**                                                    | ✅     |
| ח.פ. / ע.מ. number            | Was claimed via `בע״מ` with no number behind it             | `lib/site.ts`             | **none — not a registered company**                             | ❌     |
| Permission to publish a photo | A named face is the strongest single trust signal available | `public/images/`          |                                                                 | 🔶     |
| AI images of the team         | 11 on the homepage; need the depicted person's OK           | `lib/gallery.ts`          | **עומר** (2nd tech) — agreed himself; no label (2026-10-26)     | ✅     |

> **On the two experience numbers.** The BUSINESS was founded 2015 (11 years). The FOUNDER has been
> in the trade ~20 years. `site.stats.years` says "20+ שנות ניסיון **בשטח**" — the word בשטח is
> load-bearing. Writing "20 years in business" would be false.

## B. Proof & authority — fabrications purged, real proof still missing

**Resolved 2026-08-17:** the six invented testimonials, the `/reviews/` page (now a 301 to
`/about/`), the 4.9/6 `aggregateRating`, and the facebook.com/instagram.com `sameAs`/footer links
were all **removed**. The site no longer fabricates proof — but it now has **none**, which keeps
this section the highest-priority ask. The rows below are what replaces them legitimately.

| Field                                                  | Why it's needed                                                                 | Lands in               | Value                                                                         | Status |
| ------------------------------------------------------ | ------------------------------------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------- | ------ |
| **Google Business Profile URL** (service-area profile) | The top local lever; `sameAs`; the only legitimate source for `aggregateRating` | `lib/site.ts` `social` | **does not exist yet** — owner will open one                                  | 🔶     |
| Facebook page URL                                      | `sameAs`; entity corroboration                                                  | `lib/site.ts` `social` |                                                                               | 🔶     |
| Instagram URL                                          | `sameAs`; thermal imagery is a natural fit                                      | `lib/site.ts` `social` |                                                                               | 🔶     |
| 5–10 real reviews (author, date, text, **source URL**) | Replaces the six fabricated ones                                                | a new `lib/reviews.ts` |                                                                               | 🔶     |
| Real review count + average rating                     | `AggregateRating`. **Ships only with a verifiable public source**               | derived from the above |                                                                               | 🔶     |
| Equipment — which thermal camera?                      | A specific model is a genuine expertise signal                                  | `lib/site.ts`          | **FLIR E8**                                                                   | ✅     |
| Insurance (ביטוח צד ג׳)                                | Standard trade trust signal                                                     | `lib/site.ts`          | **yes — held** (insurer and coverage amount not supplied, so no figure ships) | ✅     |
| Thermography certification — issuing body + number     | Was claimed as "Thermography Level 1" with no certificate behind it             | `lib/site.ts`          | **none — no certificate held**                                                | ❌     |
| Trade association membership                           | Authority signal                                                                | `lib/site.ts`          | **none**                                                                      | ❌     |

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

**On pricing:** keeping a stated _starting_ price with the factors that move it published (as
`/pricing/` already does) beats "call for a quote" — price opacity is a conversion tax on a crisis
purchase. **The owner confirmed ₪350 on 2026-09-17** (the site had been showing an unverified ₪350,
so this was a real correction, not a rubber stamp).

| Field                                  | Why it's needed                                         | Lands in                             | Value                                                     | Status |
| -------------------------------------- | ------------------------------------------------------- | ------------------------------------ | --------------------------------------------------------- | ------ |
| Starting price                         | Stated on the homepage, `/pricing/` and two services    | `lib/site.ts` `priceFrom`            | **₪350**                                                  | ✅     |
| Guarantee: what counts as "מצאנו"      | Defines the entire promise                              | `lib/site.ts` + services             | ✅ published                                              | ✅     |
| Guarantee: exclusions and call-out fee | Reduces post-sale disputes                              | `lib/services.ts`                    | ✅ no call-out fee                                        | ✅     |
| Issues a חשבונית מס?                   | Conversion friction; ועדי בתים and businesses need it   | `lib/site.ts`                        | **yes**                                                   | ✅     |
| What the ₪350 visit includes/excludes  | The #1 pre-purchase question; AEO answer-block material | `lib/site.ts` `visitScope`           | **approved verbatim 2026-09-17** — renders on `/pricing/` | ✅     |
| Report turnaround                      | Was only a vague "מספר ימי עסקים"                       | `lib/site.ts` `reportTurnaroundDays` | **3 business days**                                       | ✅     |
| Accepted payment methods               | Card / transfer / Bit — none confirmed                  | `lib/site.ts`                        |                                                           | 🔶     |

> ✅ **Both resolved the same day, and the route there is the point.** Asked what a visit includes
> and how long a report takes, the owner first answered "use your experience" and "the standard".
> That is **not an answer a site may publish** — they are facts about _this_ business, and a
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

| Claim                                                                   | Status                                                                                                                                                                                                                                                                                                                                                                                                    | Lands in                                                                                | Value        | Status |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------ | ------ |
| `20+ שנות ניסיון בשטח`                                                  | **Confirmed 2026-09-17** — founder in the trade since ~2005. Raised from `10+`, which had been derived from the 2015 founding year. The label says **בשטח** because this is the founder's experience, not the company's age                                                                                                                                                                               | `lib/site.ts` stats                                                                     | ~2005        | ✅     |
| `3,000+ בתים ועסקים`                                                    | **Removed from the site 2026-08-17.** Returns only with a record behind it                                                                                                                                                                                                                                                                                                                                | `lib/site.ts` stats                                                                     |              | 🔶     |
| `97% איתור כבר בביקור הראשון`                                           | **Removed from the site 2026-08-17.** Returns only if actually measured                                                                                                                                                                                                                                                                                                                                   | `lib/site.ts` stats                                                                     |              | 🔶     |
| `4.9 דירוג לקוחות ממוצע`                                                | **Removed 2026-08-17 with the fabricated reviews** — see §B                                                                                                                                                                                                                                                                                                                                               | —                                                                                       |              | ❌     |
| Emergency availability                                                  | `emergencyNote` — `שירות חירום לנזילות פעילות — זמינים גם מעבר לשעות הפעילות`. **Confirmed true by the owner 2026-10-28** (asked in a Claude Code session whether the business answers active-leak calls outside opening hours: "yes"). This confirms the sentence as written — not a response time and not a same-day radius (§E). The live surfaces still carry no emergency wording (fleet rule, §G)   | `lib/site.ts`                                                                           | as published | ✅     |
| `זמינות מהירה` · `זמינות מהירה גם למקרי חירום` · `ונחזור אליכם במהירות` | **Confirmed true by the owner 2026-10-12** (fleet wording sign-off page: "Yes, they are true — keep them"). They ship in the hero, `site.description`, `/about/` and `ContactCTA`. This confirms the three phrases as written — **not** the out-of-hours promise above and **not** a same-day radius (§E). The live surfaces still carry no availability, emergency or speed wording (the fleet rule, §G) | `components/Hero.tsx`, `lib/site.ts`, `app/about/page.tsx`, `components/ContactCTA.tsx` | as published | ✅     |

## E. Coverage & geo

The placeholder `geo` (Tel Aviv city centre, for a business with **no public premises**) was removed
2026-08-17. `site.serviceAreas` names 12 cities; all 12 have pages since 2026-10-28.

**Resolved 2026-09-17:** the national clause is **true**, and the real reach is **about two hours'
drive from Tel Aviv** — which is most of the country and far beyond the "עד 60 ק״מ" the site had
been claiming. That figure was never confirmed and has been removed from `serviceAreaText`,
`lib/faqs.ts`, `/about/` and `/locations/`.

> **Roadmap consequence:** Sprint 7's location batch 4 (כפר סבא 23 km, ראש העין 25 km) was gated on
> this exact answer. **That gate is now lifted on distance.** Each city still has to clear the
> doorway test on its own content — distance was never the only gate.

| Field                                               | Why it's needed                                                                                                                                                                                                                        | Lands in                        | Value                                      | Status |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------ | ------ |
| Real operating base (or: drop `geo` entirely)       | A placeholder coordinate is worse than none for a service-area business                                                                                                                                                                | `lib/site.ts` `geo`             | `geo` removed 2026-08-17; no base supplied | 🔶     |
| Is "שירות ארצי בתיאום מראש" true?                   | It's a coverage claim; a false `areaServed` is a liability                                                                                                                                                                             | `lib/site.ts`                   | **yes — true**                             | ✅     |
| Realistic travel reach                              | Gates which cities can honestly be claimed                                                                                                                                                                                             | `lib/site.ts` `serviceAreaText` | **up to ~2 hours' drive from Tel Aviv**    | ✅     |
| Which of the 12 cities have real job history?       | All 12 have a page since 2026-10-28, built on public research; a real job reference is the strongest doorway-test item for each                                                                                                        | `lib/locations.ts`              |                                            | 🔶     |
| Realistic **same-day** radius                       | "זמינות מהירה" is claimed sitewide — the phrase itself was confirmed true by the owner 2026-10-12 (§D), but no radius was given. Distinct from travel reach: two hours' drive is what he _will_ travel, not what he can reach same-day | `lib/site.ts`                   |                                            | 🔶     |
| Is there a Google Business Profile address to hide? | Service-area profiles must not contradict the site                                                                                                                                                                                     | GBP                             | no profile exists yet                      | 🔶     |

### 🔶 Location silo — all 12 built (3 on 2026-08-30, 9 on 2026-10-28)

**Owner decision, 2026-10-28:** "build new city pages to the all other 9 cities left". Every
service area now has a page. This overrides the earlier "build 3–5 that pass the doorway test, or
none" guardrail. The risk the owner accepted is written into the header of `lib/locations.ts`:
the claims are public research, not job history, and nine pages landing together is the doorway
pattern even when each page passes on its own.

**How the first three were chosen (2026-08-24).** An adversarially-verified gate (49 agents) found
that all 12 areas had 3+ true, city-specific public claims. Three were built as a contiguous
cluster: תל אביב-יפו, חולון, בת ים. The other nine were queued here with one truncated line each,
and their full claim texts were never saved.

**How the nine were built (2026-10-28).** Each city was researched afresh, given two independent
fact-checks (one against the cited live pages, one blind), and read side by side with the other
eleven for the doorway test. Every statement and its source is in
[location-sources/](location-sources/README.md). The re-check overturned two of the old queued
leads. הרצליה's "about 94 בנייני רכבת in יד התשעה" has no source and is not on the page. רעננה's
"קריית שרת, a 1950s immigrant neighbourhood of railway buildings" is refuted: it is mostly private
houses. Three distances in the old table were wrong or unsourced. The pages say what the sources
support: פתח תקווה about 11 km, הרצליה about 10 km north, מודיעין about 35 km. ראשון לציון states
no distance.

**Corrected on the three first pages, the same day:** sentences that described our call history
or job mix in a city were removed. These were חולון intro[1] and claims[5], בת ים faqs[1] and
claims[5], and תל אביב faqs[1]. They were job history we do not have (golden rule 1). Three meta
descriptions promised a same-day arrival ("נגיע באותו יום", "הגעה באותו יום"); they now say
"נשתדל", like the rest of each page.

**Availability on the twelve pages.** Only the four nearest cities (תל אביב, חולון, בת ים, רמת גן)
say "לנזילה פעילה נשתדל להגיע באותו יום". Every other city schedules the visit in advance, with
no time promised. The real same-day radius is still the open row in the table above.

**⚠️ Every claim on all twelve pages still needs owner confirmation.** Public sources are not
someone who has worked in those buildings. Start with the weakest, each resting on a single source:

| City        | Confirm first                                                                                       |
| ----------- | --------------------------------------------------------------------------------------------------- |
| רמת גן      | Railway buildings in רמת עמידר (one source); the January 2026 flood on רחוב התפוצות (one source)    |
| גבעתיים     | The four- and six-flat buildings in the בראשית compound (one trade site)                            |
| הרצליה      | גליל ים's start year and flat counts (one real-estate site)                                         |
| פתח תקווה   | About 5,900 flats in אם המושבות החדשה, the hub-card claim (one source)                              |
| ראשון לציון | כצנלסון's building ages (a style description, not a date)                                           |
| רעננה       | קריית שרת as mainly private houses (one article, written with a developer)                          |
| כפר סבא     | The stepped houses on רחוב ויצמן and their flat layout (FAQ 1 depends on it)                        |
| ראש העין    | The +73% housing growth 2015–2020, the hub-card claim (one Calcalist sentence)                      |
| מודיעין     | Two-family houses in השבטים and מוריה (FAQ 1 and the travel note depend on it; mainly he.wikipedia) |

**The one thing that would most strengthen every page** is still a real job reference per city.
It is the strongest doorway-test item, and the only one research cannot supply.

## F. Infrastructure — owner-only changes

| Field                     | Why it's needed                                                                                                                                                                                                                                                                                  | Lands in          | Value          | Status |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- | -------------- | ------ |
| **Analytics decision**    | ✅ RESOLVED 2026-08-24 — join the shared fleet container. 10 of 12 fleet sites carry it; id verified HTTP 200. Installed via `components/Analytics.tsx` (`afterInteractive`). Accepted trade: ~90 KB exceeds the 50 KB tag budget; Zaraz stays the lighter option if that is ever enforced       | `app/layout.tsx`  | `GTM-KWGGH438` | ✅     |
| GA4 measurement ID        | Needed either way once the decision is made                                                                                                                                                                                                                                                      | container / repo  |                | 🔶     |
| **AI-crawler stance**     | **✅ RESOLVED 2026-08-17.** The managed block (ClaudeBot/GPTBot/Google-Extended/CCBot Disallow) was confirmed live in the morning, the owner turned the toggle off, and the live `robots.txt` now serves the repo's blanket allow — verified. Re-verify after any Cloudflare plan/setting change | Cloudflare        | open           | ✅     |
| Security headers approval | HSTS shipped 2026-08-17 without `preload`/`includeSubDomains`; escalating either needs sign-off (near-irreversible)                                                                                                                                                                              | `public/_headers` |                | 🔶     |
| Roster sync               | `thermoleak.json` records `googleSiteVerification: null` while the site ships a real token — update the roster                                                                                                                                                                                   | roster            |                | 🔶     |

## G. The live surfaces (fleet live-kit, owner decision 2026-10-11)

The announcement bar, the seasonal card and the homepage updates strip (CLAUDE.md §14) print only
sentences this site already shows, quoted in each line's `source`; `live.config.mjs` turns every 🔶
and ❌ row above into a ⛔ stem the build enforces — and keeps doing so for the availability
phrases §D now confirms, because the fleet rule bars availability, emergency and speed wording
from the live surfaces whether or not it is true. Drafted 2026-10-12 and **approved by the owner
the same day** on the fleet wording sign-off page; every answer he gave there is recorded below
(the three availability phrases in §D).

| Fact                                                     | Current value                                                                                                                                                                                                                                  | Source                                                                                                                                                                          | Status                                                                |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| The live wording (bar lines, the card, the updates)      | `content/live/` as approved — six seasonal lines to 31/10/2027, one card (first rains); fingerprint `86e30fc91128`, stamped in both registers' `approved` field                                                                                | owner, fleet wording sign-off page, 2026-10-12                                                                                                                                  | ✅ approved — a wording change needs a new approval                   |
| Wartime line (`reduced` in `_campaigns.mjs`)             | `פועלים בכפוף להנחיות פיקוד העורף`, shown only in the switch's `reduced` mode                                                                                                                                                                  | worded for 3locksmiths (owner-confirmed there 2026-10-04); **confirmed for טרמוליק by the owner 2026-10-12** — the business keeps working under Home Front Command restrictions | ✅ confirmed                                                          |
| The winter "document first" line (15/12/2026–15/01/2027) | the neutral `נזק מים בבית? חשוב לתעד לפני שמתקנים`, not the drafted `נזקי מים מהגשם? …` — beside the link to `/services/insurance-reports/` that could read as "rain damage is claimable" (often it is not covered — the sign-off page's note) | owner's choice, 2026-10-12                                                                                                                                                      | ✅ in the register                                                    |
| The condensation line (15/01–01/03/2027)                 | keeps its link to `/guides/leak-detection-cost/` — the only page with its sentence, so the click lands on the cost guide                                                                                                                       | owner, 2026-10-12 ("keep it")                                                                                                                                                   | ✅                                                                    |
| When the card may open                                   | at any hour the calendar allows — weekday evenings, Friday afternoon and Saturday night included, when nobody may answer the phone; its WhatsApp button still works then. Shabbat, chag and the quiet days still silence it                    | owner, fleet decision 2026-10-12 (every site)                                                                                                                                   | ✅                                                                    |
| Counting the card in GTM                                 | **one shared trigger for the fleet** — `CE - popup events (3locksmiths)` keeps a hostname condition, widened to match every fleet site, this one included; not a trigger per site                                                              | owner, fleet decision 2026-10-12                                                                                                                                                | ✅ decided — the container edit is fleet ops, before the first deploy |
| The homepage updates strip                               | ships as is, no new item (the owner left "anything to add?" empty). Its newest item is 17/09/2026, so it hides itself from 01/11/2026 until a real newer item is added                                                                         | owner, 2026-10-12                                                                                                                                                               | ✅                                                                    |
| Export size budget                                       | raised from 6 MB to 7.5 MB (2026-10-12), to 8 MB (2026-10-27), then to **15 MB** (2026-10-28) — [performance-guidelines.md](performance-guidelines.md) §1                                                                                      | owner, 2026-10-12 ("Raise the cap to 7.5 MB"); owner, 2026-10-27 ("Raise limit to 8 MB"); owner, 2026-10-28 ("increase size limit to 15M")                                      | ✅                                                                    |
| Header call button wraps at 768–820 px (live today)      | fix approved **as a separate change, later** — not part of the live-kit port; [optimization-backlog.md](optimization-backlog.md) §8.7                                                                                                          | owner, 2026-10-12                                                                                                                                                               | ✅ decided — not fixed yet                                            |

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
