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

**Tier 2 — local.** `{service} ב{city}` — איתור נזילות בתל אביב, איתור רטיבות ברמת גן. **Currently
unexpressed.** `site.serviceAreas` names 12 cities as plain text with no routes behind them, so the
entire local layer is absent. This is the largest structural opportunity on the site and, if done
badly, its largest risk — see §6.

**Tier 3 — long-tail / problem-led.** The questions people actually type, and where this business's real
expertise pays:

- כמה עולה איתור נזילות · מחיר איתור נזילות
- איך מאתרים נזילה בקיר בלי לשבור
- מה מצלמה תרמית רואה — ומה היא לא רואה
- למה יש כתם רטיבות בתקרה
- איתור נזילה מתחת לריצוף
- דו״ח תרמוגרפי לביטוח — מה חייב להיות בו
- כל כמה זמן בודקים לוח חשמל תרמית
- רטיבות בקיר חיצוני — נזילה או עיבוי?
- הבדל בין איתור אקוסטי לתרמוגרפי

These are the highest-value AEO targets, far less contested than Tier 1, and the natural spine of a
`/guides/` hub (see `/new-article`). **The site has no page targeting any of them.**

**Tier 4 — commercial modifiers.** מחיר, מומלץ, אחריות, דחוף, ללא הרס, 24 שעות, ליד הבית. Fold into
titles and descriptions rather than building pages for them.

**Tier 5 — audience modifiers.** ועד בית, מנהל נכסים, שמאי, לפני קניית דירה, עסק/מפעל. These map onto
`forWho` in `lib/services.ts` and are worth a heading on the relevant service page — especially
"בדיקה לפני קניית דירה", which is a distinct, high-intent job the site mentions once and never targets.

---

## 3. Title formulas

The root `template` in `app/layout.tsx` appends `| טרמוליק`. **A page's own `title` must therefore not
append the brand again.** Two live exceptions, in opposite directions (backlog §2.1):

| Route type     | `title` you write                    | Renders as                                             |
| -------------- | ------------------------------------ | ------------------------------------------------------ |
| Home           | a **complete** title incl. the brand | the template does **not** apply to the root page       |
| Service        | `service.h1`                         | `איתור נזילות מים במצלמה תרמית \| טרמוליק`             |
| Services index | `שירותים — איתור נזילות, רטיבות ותרמוגרפיה` | `… \| טרמוליק`                                  |
| Location       | `איתור נזילות ב{prefixed}`           | `איתור נזילות בתל אביב \| טרמוליק`                     |
| About          | `אודות` — **not** `אודות טרמוליק`    | currently doubles the brand ❌                          |
| Contact        | `צור קשר`                            | `צור קשר \| טרמוליק`                                   |
| Article        | the question verbatim                | `מה מצלמה תרמית באמת רואה? \| טרמוליק`                 |

Keep the **rendered** title under ~60 characters. Hebrew is compact; the only route close to the limit
today is `/about/`, and it gets there by doubling the brand.

**Why the homepage is different:** a `title.template` declared in a layout applies to titles from child
segments, not to that layout's own `page.tsx`. `app/page.tsx` therefore renders its title verbatim, with
no brand. Write the brand into it, or use `title: { absolute: … }`.

**Region entries.** If a region is ever added (השרון, השפלה, צפון), a bare `ב{name}` is wrong Hebrew.
Use a `prefixed` field: `באזור השרון`, `בצפון הארץ`.

---

## 4. H1 formulas

The H1 restates the title's intent in natural Hebrew — it is not a copy of the title.

| Route type | H1                                                      |
| ---------- | ------------------------------------------------------- |
| Home       | the hero headline — currently the tagline               |
| Service    | `service.h1` — e.g. `איתור נזילות מים במצלמה תרמית`     |
| Location   | `איתור נזילות ב{prefixed}`                              |
| Article    | the question itself, verbatim                           |

Exactly one `<h1>` per page — currently correct on all 13. Everything below is `<h2>`/`<h3>` with no
skipped levels.

---

## 5. Description formulas

150–160 characters, unique per route. Lead with **what it is + where**, add **one true**
differentiator, close with an action. Never reuse a description across two routes. All 11 content
routes are currently unique.

- **Service:** `{what it is in one clause}. {method or duration}. {one true differentiator}. חייגו {phone}.`
- **Location:** `איתור נזילות ב{prefixed} — {method}, {speed}. שירות ל{audience}. חייגו {phone}.`
- **Article:** answer the question in the first clause, then say what the page covers.

`service.summary` doubles as the meta description, so write it to 150–160 characters and make it work
both as a card blurb and as a SERP snippet.

Only claim what [business-facts.md](business-facts.md) confirms. The 97% figure, the 3,000+ count, the
4.9 rating and the certification claims are all 🔶.

---

## 6. The service × location matrix

4 services × 12 service areas = 48 possible cells. **Do not build them.**

The site currently has **zero** location pages, which is an advantage worth protecting: sibling sites in
this fleet generated one page per city from a shared paragraph and all of them now fail the doorway
test in [content-standards.md](content-standards.md) §2. The penalty lands on the domain.

**The expansion order:**

1. Deepen the four service pages to their 450-word floor first — they are the pages with commercial
   intent and they are currently short.
2. Build location pages **only** for cities where three true, specific things can be said
   (content-standards §2). Realistically 3–5, not 12.
3. Each earns its depth before the next starts. Wire its inbound links before it ships.
4. Only then consider a service × location second tier, and only for services with genuine local demand
   — `water-leak-detection` and `moisture-detection`. Not `insurance-reports`, which is a document, not
   a place.

A cell exists when there is something true and specific to say in it. Not before.

---

## 7. Route → primary keyword

| Route                                    | Primary target                          | Tier |
| ---------------------------------------- | --------------------------------------- | ---- |
| `/`                                      | איתור נזילות · איתור נזילות תרמי        | 1    |
| `/services/`                             | שירותי איתור נזילות ורטיבות             | 1    |
| `/services/water-leak-detection/`        | איתור נזילות מים · נזילה בקיר           | 1    |
| `/services/moisture-detection/`          | איתור רטיבות · בדיקת רטיבות בקיר        | 1    |
| `/services/electrical-thermography/`     | בדיקה תרמוגרפית ללוח חשמל               | 2    |
| `/services/insurance-reports/`           | דו״ח תרמוגרפי לביטוח                    | 2    |
| `/about/`                                | brand + entity terms                    | —    |
| `/reviews/`                              | המלצות + brand                          | —    |
| `/contact/`                              | brand + "איתור נזילות טלפון"            | —    |
| `/locations/{city}/` _(doesn't exist)_   | איתור נזילות ב{city}                    | 2    |
| `/guides/{slug}/` _(doesn't exist)_      | one Tier-3 question each                | 3    |

**Slug rule:** every route on this site uses **ASCII English path segments** with Hebrew content. Keep
it that way — introducing Hebrew slugs now would split the taxonomy and add a percent-encoding matcher
requirement for no gain. Renaming an existing slug requires a 301 in `public/_redirects` (Cloudflare
Pages), or the ranking signal is discarded.
