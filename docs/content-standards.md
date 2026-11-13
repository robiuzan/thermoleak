# Content standards — the acceptance bar for Hebrew copy

`hebrew-copywriter`, `new-city`, `new-service` and `new-article` all write against this file.
`seo-auditor` and `eeat-trust-auditor` audit against it.

---

## 1. The depth bar

Measured 2026-09-06 from a clean `out/`. Two numbers per row: `<main>` is everything inside the
content landmark; **Unique** subtracts the shared `ContactCTA` block, which contributes **112 words**
to every page that renders it. The floor is judged against **Unique**.

| Page type                      | Floor | `<main>`  | Unique  | vs floor                                                              |
| ------------------------------ | ----- | --------- | ------- | --------------------------------------------------------------------- |
| Homepage                       | 800   | 972       | 860     | ✅                                                                    |
| Service page                   | 450   | 475–571   | 363–459 | ⚠️ only `water-leak-detection` clears; all four on 2026-11-13 (below) |
| Location page                  | 350   | 696–766   | 584–654 | ✅ all three; all 12 on 2026-10-28 (below)                            |
| Article                        | 900   | 798–936   | 686–824 | ❌ all three short — see the note below                               |
| Hub `/services/`               | 250   | 367       | 255     | ✅ on the line                                                        |
| Hub `/locations/`              | 250   | 357       | 245     | ⚠️ on the line                                                        |
| Hub `/guides/`                 | 250   | 267       | 155     | ❌ thin — a one-line subtitle and three cards                         |
| `/pricing/`                    | 450   | 552       | 440     | ⚠️ on the line (money-intent → service floor)                         |
| About                          | 500   | 610       | 498     | ⚠️ on the line                                                        |
| Contact                        | 200   | 275       | n/a     | ✅ the CTA **is** the page here, so no deduction                      |
| Legal (privacy, accessibility) | none  | 171 / 154 | —       | fine as-is                                                            |
| `/gallery/`                    | none  | —         | —       | a picture page: its words are the note and the captions               |

**Location pages, 2026-10-28.** The row above is the first three on 2026-09-06. On the build that
added the other nine, those nine carry 446–469 unique non-chrome words (949–997 raw, chrome
included) and the first three 409–461 — all twelve clear the 350 floor.

**GEO release 1, 2026-11-13.** Re-measured on a fresh build of `3492fb8` with the recipe below
(`data-shared-block` lists stripped, then 112 subtracted). **All four service pages now clear 450:**
`water-leak-detection` 708, `moisture-detection` 616, `electrical-thermography` 565,
`insurance-reports` 562. Also: `/services/` 438 (its hub prose shipped), `/pricing/` 556, the homepage
1,180. Still short: the `/guides/` hub at **150** (release 2 adds its prose with the new guides) and
the three guides at 753–861 — the note below stands. On this build `ContactCTA` itself counts 105
words, so subtracting 112 under-counts every row by 7; it is left at 112 so the rows stay comparable.

**On the article shortfall.** All three guides carry real substance — an answer block, tables, an
honest-limits section, a real byline. The gap is depth, not padding: close it with a section that
says something new (a worked example, a decision table), never by restating. Until then the floor
stands as written; do not lower it to make the table green.

**"Unique" excludes site chrome and any block rendered identically on another route.** The navbar,
footer and sticky CTA bar sit outside `<main>`, so the `<main>` extraction below excludes them by
construction — there is no magic constant to subtract any more. The shared block _inside_ `<main>`
behind the second column is `ContactCTA` (112 words). Since 2026-11-13 two more render the same list
on several routes — `TrustRow` and `CityChips` — and each marks its list `data-shared-block`, which
the recipe strips before counting.

Measure with tags **and scripts** stripped (a naive `sed` that eats everything between the first
`<script>` and the last `</script>` will report zero):

```bash
# <main> word count for one route, data-shared-block lists stripped
perl -0777 -ne 's{<script.*?</script>}{}gs; s{<style.*?</style>}{}gs;
  s{<ul\b[^>]*data-shared-block[^>]*>.*?</ul>}{}gs;
  if (/<main\b.*?>(.*)<\/main>/s) { $m = $1; $m =~ s{<[^>]*>}{ }gs; print $m }' \
  out/services/water-leak-detection/index.html \
  | tr -s " \t\n" "\n" | grep -c '[^[:space:]]'
```

Word count is a floor, not a goal. A 500-word page that says five specific true things beats a
900-word page that says one thing five ways.

---

## 2. The doorway test — mandatory for every service and location page

> Take the page. Replace the service or city name with a different one. Is it now a correct, publishable
> page for that other subject?
>
> **If yes, it is a doorway page and must not ship.**

The four service pages **currently pass** — each has its own `intro`, `benefits`, `steps`, answer
block, honest-limits section and FAQs. That is genuinely better than the fleet siblings, and it is the
property to protect when adding a fifth.

**All twelve service areas have a location page** — תל אביב, חולון and בת ים since 2026-08-30 (gate
run 2026-08-24), the other nine added 2026-10-28 at the owner's request. Each passed this gate on
typed, per-city `claims` (see `LocationClaim` in `lib/locations.ts`, whose `category` field exists
precisely so an auditor can re-check _why_ each claim counted as city-specific). The nine were
researched afresh — the 2026-08-24 claim texts were never saved — and each had two independent
fact-checks, one against the cited live pages and one blind; an editor then read all twelve side by
side for this test. Every statement's source is in
[location-sources/](location-sources/README.md) — the first three have no register yet.

**Why it stopped at three until 2026-10-28, when an adversarially-verified assessment had found all
twelve could qualify:** the claims are public research, not job history; many pages launched from
one research pass _is_ the doorway pattern even where each page is individually defensible; and depth
has to be sustained. The owner lifted the cap knowingly, and the header of `lib/locations.ts` keeps
those reasons as the risk accepted — required reading before changing an entry or adding an area
beyond the twelve (`/new-city`). Sibling sites in this fleet generated one page per city from a
shared paragraph and all of them now fail.

To pass, a location page needs at least **three** of these, and they must be true:

- Named neighbourhoods, streets or landmarks within the city.
- **Housing-stock reality** — the richest seam for this trade: 1960s שיכונים with original galvanised
  plumbing; towers with pressurised systems and shared risers where one leak affects three flats;
  ground-floor units where the leak is in the slab; renovated flats with new plumbing in old walls.
- A real job reference from that city (with permission), or a photo.
- Travel and response reality — how far, whether same-day genuinely applies at that distance.
- A city-specific FAQ that would read oddly anywhere else.
- Local pricing reality if it differs.

If none of those can be said truthfully about a city, **that city does not warrant a page.** Say so in
[business-facts.md](business-facts.md) §E rather than padding.

---

## 3. Required blocks per page type

**Service page** — every block ships on all four pages, except where items 11–12 say otherwise;
this is now a regression checklist, not a to-do list. Items 3, 6, 11 and 12 were added 2026-11-13.

1. H1 = `service.h1`.
2. **Answer block (§5)** — what this service is, under a question-form heading. `service.answer`,
   rendered first in the DOM at `app/services/[slug]/page.tsx`, and it also joins the `FAQPage` graph
   because it is genuine on-page Q&A. **Keep it first in the DOM.** Since 2026-11-13 it names the
   brand (`site.nameHe`), the service and the region (`site.address.regionPrefixed`, «בגוש דן
   והמרכז»), then what it includes, the price (`site.priceFrom`) or the per-job cost model, and the
   timeframe **where one is confirmed** — about an hour on the water page, the written report in
   `site.reportTurnaroundDays` business days on the panel and insurance pages, none on moisture.
   Every fact is interpolated, never retyped. Moisture's first sentence is the definition, so its
   brand and region sit in the second; the first sentence still answers completely.
3. **Trust row** — `components/TrustRow.tsx`, directly under the answer block: «20+ שנות ניסיון
   בשטח», `site.credentials` and the tax invoice. Confirmed facts only. It **never** renders
   `site.guarantee` (EEAT-6), and never the electrician licence, which is stated in text on the panel
   page only (business-facts §H).
4. What it involves, concretely: what gets scanned, how long, what the customer prepares, what they
   receive.
5. **What the method cannot detect** — `service.limits`. Non-negotiable for this category; see §7.
6. **Buyer's checklist** — `service.checklist`, after the limits: what to check before booking, four
   items on each page today, under a heading that differs per service (one shared heading would fail
   the §2 doorway test). Advice to the buyer, never a credential the business lacks.
7. Benefits and process (`benefits`, `steps`) — specific per service.
8. Price language for this service (`service.priceModel`), from one source; never a second literal.
   The sidebar links it into `/pricing/` (`service.priceLink`: water-leak → `#visit-scope`, moisture
   → `#price-factors`, the two per-job services → `/pricing/`).
9. **Per-service FAQ**, 3–5 questions, rendered in native `<details>` and feeding `FAQPage`.
10. 2–3 contextual in-copy links to sibling services with descriptive anchors — `service.related`,
    which is prose with inline links, not a card row. The card row below it is _additional_.
11. **Guide links** — `service.featuredGuides` (0–3 slugs, resolved and checked in `lib/links.ts`)
    under `service.guides`, which is required exactly when the list is non-empty. Water-leak links
    all three guides, moisture the thermal-camera guide, insurance the cost and find-a-leak guides;
    electrical has none until the panel guide exists.
12. **City links** — `service.cityLinks`. Water-leak and moisture link all twelve city pages as
    `CityChips`, each anchored by the city page's own title (`locationTitle()`, «איתור נזילות ב…»).
    Electrical links `holon`, `ramat-gan` and `raanana` in a sentence, anchored by a place inside
    each city (the three whose pages discuss panel scans). Insurance links none.
13. CTA.

**Location page** — all seven ship on all twelve cities.

1. H1 = `איתור נזילות ב{prefixed}`.
2. Answer block — `answer: { q, a }`; `q` is the visible H2 and a `FAQPage` `Question`. Do we serve
   this city, how soon, at what cost. "How soon" must be honest for the distance: only תל אביב, חולון,
   בת ים and רמת גן say "לנזילה פעילה נשתדל להגיע באותו יום"; the other eight schedule the visit in
   advance with no time promised.
3. Local substance — at least three items from §2, each sourced in the city's
   [location-sources](location-sources/README.md) register (the first three cities have none yet).
4. Full service list with links.
5. Nearby locations — real adjacent areas only, 0–4 links, bidirectional (the build fails on a
   one-way or unknown edge). מודיעין has none, and that is correct.
6. City-specific FAQ, 2–3 questions.
7. CTA.

**Article** — all seven ship on all three guides.

1. H1 = the question, verbatim.
2. Answer block first — the whole answer, before any preamble. In `lib/articles.ts` this is a
   `kind: "answer"` block, and the `FAQPage` schema is **derived** from it, so the two cannot drift.
3. Body with question-form `<h2>`s.
4. At least one table, list or comparison a reader would screenshot.
5. Author byline + `datePublished` / `dateModified` — a **real** name. Satisfied since 2026-08-24:
   `author: "רונן דהן"`, confirmed in business-facts §A. The field stays **optional** in the type on
   purpose — an article by someone else sets its own, and an article with no known author publishes
   unattributed rather than borrowing a name. **Never invent a byline.**
6. Links to 2–3 services, in-copy with descriptive anchors (`relatedServices`).
7. CTA.

**Freshness.** `dateModified` feeds `app/sitemap.ts`. If you materially edit an article, bump it. If
you only fix a typo, do not — a `lastmod` that moves without the content moving is noise.

---

## 4. Brand voice

- **Tone:** מקצועי · אמין · רגוע · ברור · ענייני. Confident without hype.
- **Person:** "אנחנו" / טרמוליק. Address the reader as "אתם" (plural formal).
- **Reading level:** clear for a homeowner aged 30–70, with real technical depth where it builds trust.
  This audience is often mid-crisis — a damp wall, a water bill that jumped — so lead with the answer.
- **Favour:** בלי לשבור קירות · אבחון מדויק · ללא הרס · דו״ח מסודר · שקיפות מחירים · זמינות מהירה ·
  מאתרים את המקור, לא את הסימפטום.
- **Avoid:** "זול", superlatives without evidence, exclamation spam, unnecessary jargon, "פתרון קסם",
  "המובילים בישראל" (unprovable).
- **Emoji:** a `✓` inside a UI element is fine. Never in body copy.
- **Reference line for the register:** _"מאתרים את מקור הנזילה במדויק — בלי לשבור קירות, ומסבירים
  לכם במקום מה נמצא."_ (Until 2026-11-13 this line ended «עם דו״ח שמתקבל בחברות הביטוח», which claimed
  both a report with every visit and insurer acceptance; neither is true — business-facts §H.)

---

## 5. The answer block (AEO)

Every service page, location page and article opens with one. This is the unit an AI assistant or a
featured snippet lifts.

- Sits **directly under** a question-form heading.
- **≈35–60 Hebrew words**, and the count is a guide-rail, not a gate. Shorter than ~30 reads as thin;
  past ~60 it stops being extractable. Stated in _Hebrew_ words and recalibrated 2026-09-06 from
  "40–60": Hebrew fuses prepositions and articles onto the following word, so a 36-word Hebrew answer
  is already a full English 50. Shipped at that recalibration: services 45–48, locations 43–46 (the
  first three; the nine added 2026-10-28 were not measured here), guides 36–41; the
  model answer below is 32 and is fine, because it is **complete**. Completeness decides, length only
  advises — **never pad an answer to reach a number.**
- Answers the question **completely in the first sentence.** No "יש כמה גורמים שמשפיעים" preamble.
- Self-contained — comprehensible with zero surrounding context, because that is how it will be quoted.
- Contains the concrete number, duration or price range where one exists.
- No pronouns referring outside the block.

**Good:**

> **כמה זמן לוקחת בדיקת איתור נזילות?**
> ברוב הדירות הבדיקה אורכת כשעה, ובסיומה תדעו מהיכן מגיעה הנזילה. הסריקה מתבצעת במצלמה תרמית ואינה
> דורשת שבירת קירות או ריצוף. בנכסים גדולים או כשיש כמה מוקדים חשודים הבדיקה עשויה להימשך זמן נוסף.

**Bad:**

> משך הבדיקה משתנה בהתאם למספר גורמים. צוות מקצועי כמו שלנו יידע להעריך את משך העבודה בביקור באתר.

**Rendering rule:** the answer must be in the HTML at first paint. The site's FAQs already satisfy this
using native `<details>/<summary>` — every answer ships in the DOM with zero JS. Keep that property.

---

## 6. Claims — what may be stated as fact

**Free to state** (verified in `lib/site.ts` or the roster): the phone number, WhatsApp, email, the
opening hours, the four services, the 12 service areas, the גוש דן והמרכז coverage, the 2015 founding
year, the founder's «20+ שנות ניסיון בשטח» (never "20 years in business"), the non-destructive method,
"בלי לשבור קירות".

Two facts moved onto this list after the owner confirmed them 2026-08-24:

- **The founder's name and role — רונן דהן** (business-facts §A). He appears on `/about/` and as the
  byline on all three guides. His _name and role_ are free; anything further about him — years in the
  trade, credentials, a photo, a personal claim — is still gated below.
- **The `לא מצאנו — לא שילמתם` guarantee: its scope, its exclusions and the no-call-out-fee term**
  (business-facts §C, published via `components/GuaranteeTerms.tsx`). **`site.guaranteeTerms` is the
  only permitted source.** Restating the terms in your own words anywhere else re-opens exactly the
  gap the confirmation closed — link or render, never paraphrase.

**Also free since 2026-09-17** (business-facts §A–§E): the ₪350 starting price and what the visit
includes (`site.visitScope`), the FLIR E8 camera, «ביטוח צד ג׳» (no insurer, no amount), a team of
two, «20+ שנות ניסיון בשטח» (always with בשטח), tax invoices, the 3-business-day report turnaround,
and «שירות ארצי בתיאום מראש». **Since 2026-11-13** (§H): the electrician licence, in text on the
panel page only. Two things are **never** stated: that a written report comes with every visit (the
findings are verbal; a report is ordered separately), and that insurers accept the report.

**Gated on [business-facts.md](business-facts.md)** — mark `// 🔶 confirm` and never state as fact
until confirmed:

- Any rating, review count, or customer quote (§B)
- Certifications and association membership — confirmed **absent**, never refill (§B ❌), and a
  ח.פ. (§A ❌)
- Any person other than the confirmed founder — and any claim about the founder beyond his name,
  role and field experience (§A). The two technicians appear by first name in the note on `/about/`
  and nowhere else
- Payment methods, an arrival time or a same-day radius (§C, §E), and the open rows of §H
- Superlatives: "המובילים", "הטובים ביותר", "מספר 1"

**Never permitted:** an invented customer name or quote; a rating without a public source; a
certification the business doesn't hold; a picture presented as a record of a job that isn't one.
Illustrations of the method are allowed on every content page under the site-wide note and the word
rules of [eeat-and-trust.md](eeat-and-trust.md) §5a: an alt or a caption names an activity or a method,
never a finding, a result, a place or a customer.

**Permanently barred, not merely unconfirmed.** `3,000+ בתים ועסקים`, `97% איתור כבר בביקור הראשון`,
the 4.9 rating, the six testimonials, and the placeholder `facebook.com`/`instagram.com` links were
**fabricated**, not unverified. Confirming them is not on the table; they were removed and stay
removed. See business-facts §B/§D.

> **Status: the gate holds.** The site _was_ in breach of this section until **2026-08-17**, when
> `lib/reviews.ts`, the six invented testimonials, the `aggregateRating` they fed and the `/reviews/`
> route were all removed (`/reviews/` now 301s to `/about/` in `public/_redirects`). Verified in the
> current export: **zero** occurrences of `aggregateRating`, `Review`, `sameAs` or `GeoCoordinates`
> across all 22 emitted pages of that export (31 since 2026-10-28 — `/qa-build-gate` re-runs the
> greps). `lib/reviews.ts` no longer exists — if you are looking for it to
> delete it, stop; the work is done. Reintroducing any of it, **including as sample or seed data**,
> is a stop-ship. The legitimate route to real reviews is a Google Business Profile — business-facts §B.

---

## 7. Category-specific: say what the method cannot do

**This shipped 2026-08-17 and is now a standard to hold, not an opportunity to chase.** All four
service pages carry a `service.limits` block (title, intro, items, outro) rendered under its own
heading, and `/guides/what-a-thermal-camera-sees/` is an entire article built on it. Treat any new
page without one as incomplete, and treat _removing_ one as a content regression, not a tidy-up.

A thermal camera images **surface temperature**, not water. It finds a leak by the thermal pattern
moisture creates — which means it has real limits: a deep slab leak under thick screed, a
well-insulated wall, a wall already at ambient temperature, a leak that isn't currently running. Stating
this plainly is:

- **more convincing**, because a reader mid-crisis can tell the difference between a specialist and a
  brochure;
- **more citable**, because it is the honest answer no competitor publishes;
- **fewer wasted call-outs**, which is what the guarantee is currently absorbing.

The same applies to: why the damp stain is rarely directly beneath the leak; why an electrical scan is
performed **under load**; what an insurer actually rejects a report for; and when a moisture meter or
acoustic detection is the better tool.

---

## 8. Hebrew mechanics

- Israeli formats: phone `055-660-1006`, currency written **symbol first** — `₪350` — (the repo's
  existing convention; don't switch mid-file), dates `dd/mm/yyyy`. That `450` is a **formatting**
  example only: the starting price is still 🔶 unconfirmed (§6), so never lift it from here as a fact.
- Hebrew abbreviations use גרש `׳` and גרשיים `״` — `דו״ח`, `ק״מ`, `בע״מ`, `ת״י`, `רח׳` — not straight
  ASCII quotes. The repo is consistent about this; match it exactly.
- Numerals stay LTR inside RTL text; components add `dir="ltr"` on the element (there is **no `.ltr`
  helper class** in this repo). Write the plain number; don't add markup in `lib/`.
- Ranges use an en dash: `08:00–18:00`, `3–6 שעות`.
- No language mixing mid-sentence. English equipment names (FLIR) get their own clause.
- Copy lives in `lib/` — `site.ts`, `services.ts`, `faqs.ts`, `pricing.ts`, `articles.ts`,
  `locations.ts` — **never in JSX**. Components render `{variable}`, which is what keeps
  `react/no-unescaped-entities` quiet and keeps every claim one grep away.

---

## 9. Before publishing

- [ ] Meets the §1 word floor **net of the shared `ContactCTA`** — measure `<main>` with the
      `data-shared-block` lists stripped, subtract 112.
- [ ] Passes the §2 doorway test.
- [ ] Has every required block from §3.
- [ ] Opens with a §5 answer block, first in the DOM, in the HTML at first paint.
- [ ] States at least one real limitation of the method (§7).
- [ ] Every claim is either free (§6) or marked 🔶 with a row in `business-facts.md` — and none of
      the permanently barred items reappeared, in copy **or** in sample data.
- [ ] Title and description follow [keyword-map.md](keyword-map.md); the brand appears **exactly once**
      in the rendered `<title>`; the description is written, not sliced off another field.
- [ ] Exactly one H1; heading order unbroken.
- [ ] Links out to 2+ internal pages with descriptive anchors.
- [ ] Prices come from one source; no second literal.
- [ ] For an article: `dateModified` bumped if the edit was material, left alone if it was a typo.
