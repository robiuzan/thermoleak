# SEO · Local (GEO) · AEO strategy

The **strategy layer**: what we are trying to win and in what order. The mechanics live elsewhere —
title/description formulas in [keyword-map.md](keyword-map.md), the JSON-LD target in
[schema-graph.md](schema-graph.md), depth rules in [content-standards.md](content-standards.md).
`local-seo-strategist`, `aeo-geo-strategist` and `seo-auditor` all resolve against this file.

---

## 1. The competitive read

טרמוליק sells **diagnosis, not repair**. That single fact shapes the whole strategy:

- The buyer is **mid-crisis** — a damp stain, a ceiling drip, a water bill that jumped. Intent is
  urgent and commercial, not research-y. Pages must answer in the first sentence.
- The category is **method-confused**. Buyers do not know whether they need a plumber, an acoustic
  detector, a thermographer, or a moisture meter. Competitors exploit that confusion with vague
  reassurance. **We win by resolving it honestly** — including saying when thermography is the
  wrong tool. That is the moat: genuinely useful, genuinely hard to copy from a brochure, and
  exactly what an AI assistant prefers to cite.
- The service area is a **dense metro** (גוש דן והמרכז) with real per-city search volume and no
  premises. Local visibility therefore rests on the Google Business Profile far more than on the
  site — see §4.

**Strategic thesis:** win the *method* conversation (Tier 3), convert it into *service* rankings
(Tier 1), and use the GBP plus a small number of genuinely local pages to take the *map pack*
(Tier 2). Do not try to win Tier 2 by volume of pages.

---

## 2. Keyword clustering — the pillar/cluster architecture

Five tiers, defined in [keyword-map.md](keyword-map.md) §2. This section says **how they connect**.

```
                    PILLAR: איתור נזילות (the head term)
                              |  home + /services/
        +---------------------+---------------------+
        |                     |                     |
   SERVICE CLUSTER       LOCAL CLUSTER        ANSWER CLUSTER
   /services/{slug}/     /locations/{city}/   /guides/{question}/
   4 pages, commercial   3-5 pages, gated     6+ pages, informational
        |                     |                     |
        +--------- every guide links down to the service that monetises it,
                   every location links across to all four services,
                   every service links out to 2-3 guides + its best locations
```

**The rule that makes it a cluster and not a pile:** every page in the outer ring links *up* to the
pillar with a descriptive Hebrew anchor, and the pillar links *down* to its strongest children. A
page with no inbound contextual link is not in the cluster — it is an orphan with a URL.

### Cluster ownership — one page per intent, no overlap

| Intent | Owner | Never also targeted by |
| --- | --- | --- |
| איתור נזילות (generic) | `/` + `/services/` | any single service page |
| איתור נזילות מים | `/services/water-leak-detection/` | the homepage |
| איתור רטיבות | `/services/moisture-detection/` | the water-leak page |
| בדיקה תרמוגרפית לוח חשמל | `/services/electrical-thermography/` | — |
| דו״ח לביטוח | `/services/insurance-reports/` | — |
| כמה עולה | `/pricing/` | every service page (they *link* to it) |
| `{service} ב{city}` | `/locations/{city}/` | service pages |
| method questions | `/guides/{slug}/` | service pages (they *summarise*, guides *explain*) |

**Cannibalisation test before any new page:** name the one query it owns that no existing page
owns. If you cannot, you are splitting equity, not adding it.

---

## 3. The three keyword classes, and how each is actually won

### 3a. Generic / head terms — won with authority, not pages

`איתור נזילות` · `איתור רטיבות` · `בדיקה תרמוגרפית`. High competition. Won by: depth on the pillar,
a real entity (GBP + reviews + a named human), internal link equity flowing up, and external
citations. **Adding pages does not help here.** The levers are §4 (entity) and the guide cluster
feeding authority upward.

### 3b. Service terms — won with depth and specificity

Each of the four service pages must clear the 450-word floor with material a competitor cannot
paste: materials and substrates scanned, what the visit includes, what changes the price, what
happens after the source is found, and **the honest-limits section**. Status: shipped 2026-08-17
with answer blocks and limits blocks. Next increment is per-service case evidence
(see [eeat-and-trust.md](eeat-and-trust.md)).

### 3c. Location terms — won with **few** pages that are actually local

See §4. The failure mode is fatal and common: 12 templated city pages is a doorway cluster, and the
penalty lands on the **domain**, not the page.

---

## 4. Local SEO (GEO) architecture

### NAP consistency — a service-area business with no premises

The business is **service-area, no public office** (`site.address.note`). Legitimate, but it must
be expressed consistently in three places or Google resolves the conflict against us:

| Surface | Correct state |
| --- | --- |
| Site | Phone/WhatsApp/email from `lib/site.ts` only; no street address anywhere; `serviceAreaText` describes coverage |
| JSON-LD | `PostalAddress` with `addressRegion` + `addressCountry` only; `areaServed` enumerating the 12 cities; **no `geo`** unless it is the real operating base |
| Google Business Profile | **Service-area profile with the address hidden**, same phone, same 12 areas |

**Never** invent a coordinate to complete the schema. A city-centre placeholder was removed
2026-08-17 for exactly this reason.

### The Google Business Profile is the highest-leverage asset on this project

For a service-area trade business the GBP outranks nearly everything on-page: it owns the map pack
(which renders *above* organic for `{service} ב{city}`), it hosts reviews, and it is the entity
anchor that makes `sameAs` meaningful. It is currently **absent** — blocked on business-facts §B.

Once it exists: profile URL goes to `lib/site.ts` `social`, and flows to both the footer and
JSON-LD `sameAs` from that one edit.

### The local silo — build 3-5, not 12

Gate every candidate city on [content-standards.md](content-standards.md) §2. A city earns a page
only if **three or more** of these are true and specific to it:

- named neighbourhoods, streets or landmarks
- **housing-stock reality** — the richest seam for this trade: 1960s שיכונים with original
  galvanised plumbing; towers with shared risers where one leak hits three flats; ground-floor
  units where the leak is in the slab; renovated flats with new plumbing in old walls
- a real job reference from that city (with permission) or a photo
- travel and response reality at that distance (הרצליה and מודיעין are not the same trip)
- a city-specific FAQ that would read oddly anywhere else
- local pricing reality if it differs

Order of operations: **service depth → guides → 3-5 locations → only then consider
service×location.** The 4×12 = 48 cell matrix is a trap; see [keyword-map.md](keyword-map.md) §6.

### Hebrew grammar is a ranking detail here

`ב{city}` is not universally correct. `תל אביב-יפו` reads wrong as `בתל אביב-יפו` in a title; any
region entry (`השרון`, `צפון`) needs `באזור השרון` or `בצפון הארץ`. Model it in data before page
one: `{ slug, name, kind: "city" | "region", prefixed }`.

---

## 5. AEO / answer-engine architecture

Three gates, in strict order. Effort spent on gate 3 is wasted if gate 1 is shut.

### Gate 1 — reachability (edge state, verify every audit)

Cloudflare can prepend a managed `robots.txt` that Disallows every AI crawler. It did across this
fleet until 2026-08. **Currently open** — verified, and `app/robots.ts` now carries an explicit
fleet-wide allow list (declarative; `User-agent: *` already permits them). This is a zone toggle no
repo change can override. Verify, never infer:

```bash
curl -sS -H "Cache-Control: no-cache" "https://thermoleak.co.il/robots.txt?cb=1"
```

Distinguish the three permissions — **training** (`ai-train`), **retrieval** (the bots that produce
citations: OAI-SearchBot, Claude-SearchBot, PerplexityBot), and **`use=reference`**. Blocking
training while allowing retrieval is coherent. Blocking retrieval means we cannot be cited at all.

### Gate 2 — extractability (the Q&A structure)

An answer engine lifts a **contiguous, self-contained span**. Every service page, location page and
guide opens with an **answer block** — spec in [content-standards.md](content-standards.md) §5:

- directly under a **question-form `<h2>`**
- **40-60 words**, complete in the **first sentence**, no "there are several factors" preamble
- self-contained: comprehensible with zero surrounding context, because that is how it gets quoted
- carries the concrete number, duration or range where one exists

**Rendering rule:** the answer must be in the HTML at first paint. Our FAQs use native
`<details>/<summary>`, so every answer ships in the DOM with zero JS. That is the strongest AEO
asset on the site — a client-state accordion would break both this and the `FAQPage` gating rule.

### Gate 3 — worth citing (the moat)

An assistant picks the source that answers most precisely. Generic reassurance loses to a
competitor with a number. The material that wins here — all of it true, none of it published by
competitors:

1. **What a thermal camera actually sees**: surface temperature, not water. It finds a leak by the
   thermal pattern moisture creates — and therefore has real limits (deep slab leaks under thick
   screed, well-insulated walls, a wall already at ambient, a leak not running during the scan).
   **This is the single most citable thing this site can publish.**
2. **Method comparison**: thermography vs acoustic vs moisture meter — what each detects, what each
   costs, when each fails.
3. **Why the damp stain is rarely directly beneath the leak** (water tracks along pipes and slabs).
4. **What an insurer actually requires in a report**, and what gets a claim rejected.
5. **Why an electrical scan runs under load**, and what a hotspot severity rating means.
6. **What changes the price of a visit.**

Each becomes a `/guides/` article (see `/new-article`) and a compressed answer block on the service
page that monetises it.

### Entity clarity

An assistant resolves טרמוליק by cross-referencing sources. With `sameAs` empty there are none —
which is still better than the previous state (links to facebook.com and instagram.com homepages,
asserting corroboration that did not exist). Name, phone, service area and description must be
byte-identical across schema, visible copy and every off-site profile once they exist.

### Freshness and authorship

No `datePublished`, `dateModified` or author anywhere. Assistants discount undated, unattributed
content. Guides must carry all three — with a **real** named person (business-facts §A). Never
invent a byline; a fabricated author is a worse trust signal than none.

### llms.txt

`public/llms.txt` ships (added 2026-08-17 when gate 1 opened): who the business is, the service
list, canonical URLs for key answers, contact, service area. Keep it in sync with `lib/site.ts`.
It is a pointer file, not a second website.

---

## 6. Measurement — what proves this is working

| Signal | Where | Why it is the leading indicator |
| --- | --- | --- |
| Impressions on Tier-3 queries | Search Console | Moves 3-6 weeks **before** rankings do — first proof the guide cluster is landing |
| Map-pack impressions | GBP dashboard | The metric most correlated with calls for a service-area business |
| Calls + WhatsApp clicks per session | GA4 (once installed) | Raw sessions are vanity here; the funnel is phone-first |
| Citations in AI answers | Manual spot-check | Ask the six §5 gate-3 questions in ChatGPT/Perplexity/AI Overviews monthly |
| Branded search volume | Search Console | Evidence the entity is forming |

---

## 7. Standing prohibitions

- **No doorway clusters.** 12 templated city pages is a domain-level risk, not a coverage strategy.
- **No page without an owned query** (§2 cannibalisation test).
- **No fabricated review, rating, statistic, date or byline**, ever, including sample data.
- **No `LocalBusiness` node per city.** One business with no premises equals one node.
- **No AEO work assumed live** without fetching `robots.txt` first.
