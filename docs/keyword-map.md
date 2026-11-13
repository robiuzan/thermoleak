# Keyword map — טרמוליק

The intent model behind every route, and the Hebrew title/H1/description formulas that express it.
`seo-metadata`, `local-seo-il` and `hebrew-copywriter` all resolve against this file.

---

## 1. The head term

**איתור נזילות** is the flagship. It is the first service, the homepage's primary target, and the term
any location page would target. Everything else is a modifier on it or an adjacent job.

The differentiating qualifier is **תרמי / מצלמה תרמית / תרמוגרפיה** — the method. That matters
commercially: a searcher who types "איתור נזילות" is comparison-shopping across plumbers, acoustic
detectors and thermographers, while "איתור נזילות במצלמה תרמית" is already sold on the method and is
choosing a provider. The site should win both, with different pages.

Cluster around it: איתור רטיבות · בדיקה תרמוגרפית · דו״ח תרמוגרפי · צילום תרמי. The four services are
genuinely distinct jobs (not synonyms), which is why they don't cannibalise each other the way
synonym-split service pages usually do.

---

## 2. Keyword tiers

**Tier 1 — generic head terms.** איתור נזילות · איתור רטיבות · בדיקה תרמוגרפית. High volume, high
competition, commercial intent. Target: homepage + the matching service page. Won with authority and
depth, not with more pages.

**Tier 2 — local.** `{service} ב{city}` — איתור נזילות בתל אביב, איתור רטיבות ברמת גן. **Expressed for all 12 service areas since 2026-10-28:** תל אביב, חולון and בת ים have had pages
since 2026-08-30; the other nine were added 2026-10-28. Each page must pass the doorway test on its
own — see §6.

**Tier 3 — long-tail / problem-led.** The questions people actually type, and where this business's real
expertise pays:

- כמה עולה איתור נזילות · מחיר איתור נזילות ✅ `/guides/leak-detection-cost/` + `/pricing/`
- איך מאתרים נזילה בקיר בלי לשבור ✅ `/guides/find-leak-without-breaking/`
- מה מצלמה תרמית רואה — ומה היא לא רואה ✅ `/guides/what-a-thermal-camera-sees/`
- למה יש כתם רטיבות בתקרה
- איתור נזילה מתחת לריצוף
- דו״ח תרמוגרפי לביטוח — מה חייב להיות בו
- כל כמה זמן בודקים לוח חשמל תרמית
- רטיבות בקיר חיצוני — נזילה או עיבוי?
- הבדל בין איתור אקוסטי לתרמוגרפי

These are the highest-value AEO targets, far less contested than Tier 1, and the natural spine of a
`/guides/` hub (see `/new-article`). **Three now ship** — what a thermal camera sees · finding a
leak without breaking · what detection costs. The rest of the Tier-3 list is still open.

**Tier 4 — commercial modifiers.** מחיר, מומלץ, אחריות, דחוף, ללא הרס, 24 שעות, ליד הבית. Fold into
titles and descriptions rather than building pages for them.

**Tier 5 — audience modifiers.** ועד בית, מנהל נכסים, שמאי, לפני קניית דירה, עסק/מפעל. These map onto
`forWho` in `lib/services.ts` and are worth a heading on the relevant service page — especially
"בדיקה לפני קניית דירה", a distinct, high-intent job that currently surfaces only as a general FAQ
answer and two `lib/services.ts` fields (a `symptom` and a `forWho` line). No page, heading or title
targets it. That is the biggest untargeted intent left in the map.

---

## 3. Title formulas

The root `template` in `app/layout.tsx` appends `| טרמוליק`. **A page's own `title` must therefore not
append the brand again.** There is **one** standing structural exception — the homepage. Both of the
brand-token bugs this section used to describe (brandless home, double-branded `/about/`) were fixed
2026-08-17 and are verified clean in the current export; backlog §2.1.

| Route type      | `title` you write                           | Renders as                                       |
| --------------- | ------------------------------------------- | ------------------------------------------------ |
| Home            | a **complete** title incl. the brand        | the template does **not** apply to the root page |
| Service         | `service.h1`                                | `איתור נזילות מים במצלמה תרמית \| טרמוליק`       |
| Services index  | `שירותים — איתור נזילות, רטיבות ותרמוגרפיה` | `… \| טרמוליק`                                   |
| Guides index    | `מדריכים — איתור נזילות ורטיבות`            | `… \| טרמוליק`                                   |
| Locations index | `אזורי שירות — איתור נזילות בגוש דן והמרכז` | `… \| טרמוליק`                                   |
| Pricing         | `מחירון איתור נזילות`                       | `מחירון איתור נזילות \| טרמוליק`                 |
| Location        | `איתור נזילות ב{prefixed}`                  | `איתור נזילות בתל אביב \| טרמוליק`               |
| About           | `אודות` — **not** `אודות טרמוליק`           | `אודות \| טרמוליק` ✅ fixed 2026-08-17           |
| Contact         | `צור קשר`                                   | `צור קשר \| טרמוליק`                             |
| Gallery         | `גלריה — כך נראית בדיקה תרמית בבית`         | `גלריה — כך נראית בדיקה תרמית בבית \| טרמוליק`   |
| Article         | the question verbatim                       | `מה מצלמה תרמית באמת רואה? \| טרמוליק`           |

Keep the **rendered** title under ~60 characters. Hebrew is compact and 28 of the 29 indexed routes
sit at 15–59 (the twelve city titles at 29–35). The one over is `/guides/find-leak-without-breaking/` at **64**, because §4 requires
the article title to be the question verbatim and that question is long. Two rules genuinely collide
there; prefer the verbatim question and shorten the _question_ in `lib/articles.ts` if it ever needs
to come down — never bolt a truncation onto the title.

**Why the homepage is different:** a `title.template` declared in a layout applies to titles from child
segments, not to that layout's own `page.tsx`. `app/page.tsx` therefore renders its title verbatim, with
no brand. Write the brand into it, or use `title: { absolute: … }`.

**Region entries.** If a region is ever added (השרון, השפלה, צפון), a bare `ב{name}` is wrong Hebrew.
Use a `prefixed` field: `באזור השרון`, `בצפון הארץ`.

---

## 4. H1 formulas

The H1 restates the title's intent in natural Hebrew — it is not a copy of the title.

| Route type  | H1                                                                               |
| ----------- | -------------------------------------------------------------------------------- |
| Home        | the hero headline — `מאתרים את הנזילה. בלי לשבור קירות.`                         |
| Service     | `service.h1` — e.g. `איתור נזילות מים במצלמה תרמית`                              |
| Location    | `איתור נזילות ב{prefixed}`                                                       |
| Article     | the question itself, verbatim                                                    |
| Hub / index | the short human label, not the title — `השירותים שלנו`, `מדריכים`, `אזורי שירות` |

Note the deliberate asymmetry on hubs and indexes: the `<title>` carries the keyword phrase (`מדריכים
— איתור נזילות ורטיבות`) because that is what a SERP shows, while the `<h1>` stays a short label
because that is what a visitor reads at the top of the page. Don't "fix" one to match the other.

Exactly one `<h1>` per page — verified correct on all 32 emitted routes. Everything below is `<h2>`/`<h3>` with no
skipped levels.

---

## 5. Description formulas

150–160 characters, unique per route. Lead with **what it is + where**, add **one true**
differentiator, close with an action. Never reuse a description across two routes. All 29 indexed
routes are currently unique.

- **Service:** `{what it is in one clause}. {method or duration}. {one true differentiator}. חייגו {phone}.`
- **Location:** `איתור נזילות ב{prefixed} — {method}, {availability}. שירות ל{audience}. חייגו {phone}.`
  `{availability}` is only what that page itself says: `לנזילה פעילה נשתדל להגיע באותו יום` on
  תל אביב, חולון, בת ים and רמת גן alone; the other eight schedule the visit in advance with no time
  promised. Never a firm same-day promise.
- **Article:** answer the question in the first clause, then say what the page covers.

### Where the code does not yet implement these formulas

**The formulas above are the spec. Both route types that diverged from them are fixed (the last on
2026-11-13); the record stays so nobody regresses them.** Do not "reconcile" this section downwards
to match what ships.

- ✅ **Location pages — fixed 2026-09-17 (SEO-02).** They used to emit
  `location.answer.slice(0, 155)`, cut mid-word on all three cities of the day. `Location` now
  carries a required, authored `metaDescription`; all twelve follow the formula above and end in the
  phone. Do not go back to deriving it from the answer. Still open (not fixed 2026-11-13): the
  phone is typed as a literal in all twelve, not read from `site.phone.display` as the service metas
  now do, so it is a NAP literal outside `lib/site.ts` (golden rule 2).
- ✅ **Service pages — fixed 2026-11-13 (SEO-03).** `app/services/[slug]/page.tsx` used to feed
  `service.summary`, the card blurb, into `description`: **85–92 characters**, no `חייגו` CTA.
  `Service` now carries an authored `metaDescription` that ends in `חייגו` + `site.phone.display`,
  and a check at the bottom of `lib/services.ts` fails the build outside 150–160 characters. The
  four measure **155–157**. `summary` stays the card blurb.

Measured 2026-11-13: **18 of the 29** indexed routes reach 150–160. They are the twelve location
pages (**153–158**), the four service pages (**155–157**), `/` (**156**) and `/services/` (**160**).
The other eleven run **99–138**. Treat 150–160 as the target to write to, not as a description of
what ships.

Only claim what [business-facts.md](business-facts.md) confirms. Prices, certifications, any rating or
review count, and job/success-rate figures are all 🔶 — and the specific fabricated stats this site
once carried are listed there as permanently barred, not merely unconfirmed.

---

## 6. The service × location matrix

4 services × 12 service areas = 48 possible cells. **Do not build them.**

All **12** service areas have a location page since 2026-10-28 — the owner's decision, superseding
the earlier cap of "3–5 that pass the doorway test, or none". The cap was a depth decision rather
than a claim shortage (an adversarially-verified gate on 2026-08-24 found all 12 _could_ qualify):
sibling sites in this fleet generated one page per city from a shared paragraph and all of them now
fail the doorway test in [content-standards.md](content-standards.md) §2. The penalty lands on the
domain — which is why every one of the twelve must still pass that test on its own. The risk the
owner accepted is recorded in the header of `lib/locations.ts`.

**The expansion order:**

1. ✅ **Done.** Deepen the four service pages to their 450-word floor first — they are the pages with
   commercial intent. All four now clear it (content-standards §1), each with an answer block, an
   honest-limits section and its own FAQ.
2. ✅ **Done 2026-10-28 (12 of 12, owner decision).** A location page exists **only** where three
   true, specific things can be said (content-standards §2). תל אביב, חולון and בת ים shipped
   2026-08-30; the other nine were researched afresh on 2026-10-28 (the 2026-08-24 claim texts were
   never saved), fact-checked twice per page and read side by side for the doorway test. Every
   statement's source is in `docs/location-sources/{slug}.md` (the first three have no register
   yet). A new area beyond the 12 goes through `/new-city`.
3. ✅ **Inbound links done 2026-11-13 (LOC-2).** Each earns its depth and its inbound links before
   it ships. The footer lists all 12 cities on every page and the `/locations/` hub shows 12 cards.
   Since 2026-11-13 the water-leak and moisture pages and the `/services/` hub link all twelve with
   descriptive anchors, and the electrical page links three. Counting the hub, each city now has
   in-body links from 4–8 pages.
4. Only then consider a service × location second tier, and only for services with genuine local demand
   — `water-leak-detection` and `moisture-detection`. Not `insurance-reports`, which is a document, not
   a place.

A cell exists when there is something true and specific to say in it. Not before.

---

## 7. Route → primary keyword

All **29 indexed routes**, in sitemap order. This table is the whole indexable surface — if a route is
not here, it is not indexed.

| Route                                 | Primary target                                 | Tier |
| ------------------------------------- | ---------------------------------------------- | ---- |
| `/`                                   | איתור נזילות · איתור נזילות תרמי · + the region (title since 2026-11-13) | 1    |
| `/services/`                          | שירותי איתור נזילות ורטיבות                    | 1    |
| `/services/water-leak-detection/`     | איתור נזילות מים · נזילה בקיר                  | 1    |
| `/services/moisture-detection/`       | איתור רטיבות · בדיקת רטיבות בקיר               | 1    |
| `/services/electrical-thermography/`  | בדיקה תרמוגרפית ללוח חשמל                      | 2    |
| `/services/insurance-reports/`        | דו״ח תרמוגרפי לביטוח                           | 2    |
| `/pricing/`                           | מחיר איתור נזילות · כמה עולה איתור נזילות      | 3/4  |
| `/guides/`                            | hub — no single term; feeds the Tier-3 cluster | 3    |
| `/guides/what-a-thermal-camera-sees/` | מה מצלמה תרמית רואה — ומה לא                   | 3    |
| `/guides/find-leak-without-breaking/` | איך מאתרים נזילה בקיר בלי לשבור                | 3    |
| `/guides/leak-detection-cost/`        | כמה עולה איתור נזילות (informational)          | 3    |
| `/locations/`                         | אזורי שירות (the index of the 12 city pages; the region term is led by `/` since 2026-11-13) | 2    |
| `/locations/tel-aviv/`                | איתור נזילות בתל אביב                          | 2    |
| `/locations/holon/`                   | איתור נזילות בחולון                            | 2    |
| `/locations/bat-yam/`                 | איתור נזילות בבת ים                            | 2    |
| `/locations/ramat-gan/`               | איתור נזילות ברמת גן                           | 2    |
| `/locations/givatayim/`               | איתור נזילות בגבעתיים                          | 2    |
| `/locations/herzliya/`                | איתור נזילות בהרצליה                           | 2    |
| `/locations/petah-tikva/`             | איתור נזילות בפתח תקווה                        | 2    |
| `/locations/rishon-lezion/`           | איתור נזילות בראשון לציון                      | 2    |
| `/locations/raanana/`                 | איתור נזילות ברעננה                            | 2    |
| `/locations/kfar-saba/`               | איתור נזילות בכפר סבא                          | 2    |
| `/locations/rosh-haayin/`             | איתור נזילות בראש העין                         | 2    |
| `/locations/modiin/`                  | איתור נזילות במודיעין                          | 2    |
| `/about/`                             | brand + entity terms                           | —    |
| `/contact/`                           | brand + "איתור נזילות טלפון"                   | —    |
| `/gallery/`                           | none — a picture page; linked from the footer  | —    |
| `/accessibility/`                     | none — legal, indexed for trust                | —    |
| `/privacy/`                           | none — legal, indexed for trust                | —    |

**Not in the table, on purpose:**

- `/thank-you/` — `noindex`, deliberately excluded from the sitemap. It is a conversion endpoint, not
  a search target.
- `/reviews/` — **deleted 2026-08-17** and 301'd to `/about/` in `public/_redirects`. It used to sit in
  this table targeting `המלצות + brand`; it was removed with the six fabricated testimonials that fed
  it (golden rule 3). **Do not re-add this row.** The route comes back only when real, sourced reviews
  exist — business-facts §B.
- `/404/`, `/_not-found/` — build artifacts, not routes. `out/404.html` is the same content Cloudflare
  Pages serves natively.

**The one deliberate overlap.** `/pricing/` and `/guides/leak-detection-cost/` both target price
intent. That is intended, not cannibalisation: `/pricing/` is the commercial page a ready buyer lands
on, the guide is the informational answer that earns the AI citation. Keep the split — the guide
explains _what drives_ the price, `/pricing/` states it. If either starts restating the other, merge
toward `/pricing/`.

**The gap on that pair is closed (2026-11-13).** The guide used to reach `/pricing/` only through the
chrome anchor `מחירון` (`navLinks` in `lib/site.ts`). `/guides/leak-detection-cost/` now carries an
in-copy `related` block into `/pricing/#visit-scope` («מה כולל ביקור איתור ב-₪350») and
`/pricing/#guarantee` (the guarantee slogan, verbatim). `/pricing/` links back to the guide as
«כמה עולה איתור נזילות ומה משפיע על המחיר». The informational page now hands the ready buyer down to
the commercial one.

**Slug rule:** every route on this site uses **ASCII English path segments** with Hebrew content. Keep
it that way — introducing Hebrew slugs now would split the taxonomy and add a percent-encoding matcher
requirement for no gain. Renaming an existing slug requires a 301 in `public/_redirects` (Cloudflare
Pages), or the ranking signal is discarded.
