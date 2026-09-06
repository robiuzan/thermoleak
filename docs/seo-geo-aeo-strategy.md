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

**Strategic thesis:** win the _method_ conversation (Tier 3), convert it into _service_ rankings
(Tier 1), and use the GBP plus a small number of genuinely local pages to take the _map pack_
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
   4 pages, commercial   3 shipped, 9 gated   3 shipped, 3 topics open
        |                     |                     |
        +--------- every guide links down to the service that monetises it,
                   every location links across to all four services,
                   every service links out to 2-3 guides + its best locations
```

**The rule that makes it a cluster and not a pile:** every page in the outer ring links _up_ to the
pillar with a descriptive Hebrew anchor, and the pillar links _down_ to its strongest children. A
page with no inbound contextual link is not in the cluster — it is an orphan with a URL.

**Where that stands after sprint 3.** The guide ring is wired both ways, and every city links across
to all four services. The missing edge is the return leg on the local ring: **no service page
carries a descriptive anchor into any city**, so the cities' only inbound links are the header and
footer nav (open — LOC-2). Nav links keep them out of orphan status; they do not carry the topical
relevance that an `איתור נזילות בתל אביב` anchor from `/services/water-leak-detection/` would. Close
this before widening the silo, not after.

### Cluster ownership — one page per intent, no overlap

| Intent                   | Owner                                | Never also targeted by                             |
| ------------------------ | ------------------------------------ | -------------------------------------------------- |
| איתור נזילות (generic)   | `/` + `/services/`                   | any single service page                            |
| איתור נזילות מים         | `/services/water-leak-detection/`    | the homepage                                       |
| איתור רטיבות             | `/services/moisture-detection/`      | the water-leak page                                |
| בדיקה תרמוגרפית לוח חשמל | `/services/electrical-thermography/` | —                                                  |
| דו״ח לביטוח              | `/services/insurance-reports/`       | —                                                  |
| כמה עולה                 | `/pricing/`                          | every service page (they _link_ to it)             |
| `{service} ב{city}`      | `/locations/{city}/`                 | service pages                                      |
| method questions         | `/guides/{slug}/`                    | service pages (they _summarise_, guides _explain_) |

**Cannibalisation test before any new page:** name the one query it owns that no existing page
owns. If you cannot, you are splitting equity, not adding it.

---

## 3. The three keyword classes, and how each is actually won

### 3a. Generic / head terms — won with authority, not pages

`איתור נזילות` · `איתור רטיבות` · `בדיקה תרמוגרפית`. High competition. Won by: depth on the pillar,
a real entity (GBP + reviews + a named human), internal link equity flowing up, and external
citations. **Adding pages does not help here.** The levers are §4 (entity) and the guide cluster
feeding authority upward.

Of the three entity ingredients, only the named human has landed (רונן דהן, confirmed 2026-08-24).
The GBP and the reviews are still owner-blocked in business-facts §B, and they are the two that
carry off-site corroboration — see [eeat-and-trust.md](eeat-and-trust.md) §1.

### 3b. Service terms — won with depth and specificity

Each of the four service pages must clear the 450-word floor with material a competitor cannot
paste: materials and substrates scanned, what the visit includes, what changes the price, what
happens after the source is found, and **the honest-limits section**. Status: shipped 2026-08-17
with answer blocks and limits blocks. Next increment is per-service case evidence
(see [eeat-and-trust.md](eeat-and-trust.md)).

### 3c. Location terms — won with **few** pages that are actually local

See §4. The failure mode is fatal and common: 12 templated city pages is a doorway cluster, and the
penalty lands on the **domain**, not the page.

Status: **three cities shipped 2026-08-24** — תל אביב, חולון, בת ים — through the §4 gate, with nine
still gated. The restraint is the achievement here. Read §4 as the standard the next batch has to
match, not as a plan still waiting to be executed.

---

## 4. Local SEO (GEO) architecture

### NAP consistency — a service-area business with no premises

The business is **service-area, no public office** (`site.address.note`). Legitimate, but it must
be expressed consistently in three places or Google resolves the conflict against us:

| Surface                 | Correct state                                                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Site                    | Phone/WhatsApp/email from `lib/site.ts` only; no street address anywhere; `serviceAreaText` describes coverage                                          |
| JSON-LD                 | `PostalAddress` with `addressRegion` + `addressCountry` only; `areaServed` enumerating the 12 cities; **no `geo`** unless it is the real operating base |
| Google Business Profile | **Service-area profile with the address hidden**, same phone, same 12 areas                                                                             |

**Never** invent a coordinate to complete the schema. A city-centre placeholder was removed
2026-08-17 for exactly this reason.

### The Google Business Profile is the highest-leverage asset on this project

For a service-area trade business the GBP outranks nearly everything on-page: it owns the map pack
(which renders _above_ organic for `{service} ב{city}`), it hosts reviews, and it is the entity
anchor that makes `sameAs` meaningful. It is currently **absent** — blocked on business-facts §B.

Once it exists, the profile URL is added to `lib/site.ts` and flows to the footer and to JSON-LD
`sameAs` from there. Note the `social` key **no longer exists** — it was removed 2026-08-17 with the
facebook.com / instagram.com placeholders it held, so restoring it is a deliberate act that requires
a real profile URL, never a platform homepage.

### The local silo — 3 shipped, 9 gated

`/locations/` plus תל אביב, חולון and בת ים went live 2026-08-24 (`lib/locations.ts`). All twelve
areas were found to have three or more true city-specific claims available — the cap to three was a
deliberate "should we", not a "could we", and the reasoning is recorded in that file's header.

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
service×location.** The first three have run; the fourth stays shut. The 4×12 = 48 cell matrix is a
trap; see [keyword-map.md](keyword-map.md) §6.

**Two preconditions on batch 2, in this order.**

1. **Re-run the research gate.** The nine deferred cities were carried forward as **one truncated
   angle each**, not as the intact claim sets the sprint-3 note describes — so batch 2 is a research
   pass, not a data edit, and it must be costed that way (open — LOC-1).
2. **Wire the inbound mesh for the three cities that already exist** before adding a fourth (open —
   LOC-2, §2 above). Widening a silo whose pages receive no contextual equity multiplies the
   weakness instead of the coverage.

### Hebrew grammar is a ranking detail here

`ב{city}` is not universally correct. `תל אביב-יפו` reads wrong as `בתל אביב-יפו` in a title; any
region entry (`השרון`, `צפון`) needs `באזור השרון` or `בצפון הארץ`. This is modelled in data, as it
had to be: the `Location` interface in `lib/locations.ts` carries `kind: "city" | "region"` and a
hand-written `prefixed`, and no template may ever guess it. Every new entry fills both.

One residue: the visible name and the schema name can diverge. `lib/locations.ts` says `תל אביב`
while `site.serviceAreas` says `תל אביב-יפו`, so the same page emits both spellings in two
`areaServed` nodes (open — LOC-11). Minor, but it works against §5 "Entity clarity" below, which
asks for byte-identical strings.

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

**Status of the six.** Topics 1, 2 and 6 shipped as the first guide triplet on 2026-08-24 —
`/guides/what-a-thermal-camera-sees/`, `/guides/find-leak-without-breaking/` and
`/guides/leak-detection-cost/`. Topics 3, 4 and 5 are unwritten as guides. Two of them are not
starting from nothing: topic 4 already has an answer block and a limits section on
`/services/insurance-reports/`, and topic 5 has the under-load explanation in the limits section of
`/services/electrical-thermography/` — a guide would deepen existing coverage. **Topic 3 has no
dedicated treatment anywhere** (the closest is a single city FAQ on `/locations/tel-aviv/`), which
makes it both the widest gap and the most quotable of the three. The order above is the publishing
order; the sprint assignment lives in
[implementation-roadmap.md](implementation-roadmap.md).

### Entity clarity

An assistant resolves טרמוליק by cross-referencing sources. With `sameAs` empty there are none —
which is still better than the previous state (links to facebook.com and instagram.com homepages,
asserting corroboration that did not exist). Name, phone, service area and description must be
byte-identical across schema, visible copy and every off-site profile once they exist.

**While `sameAs` is legitimately empty, the internal graph is the only corroboration available.**
That raises the value of one cheap move that needs no new business fact: making the guide byline
resolve to the founder node. `/about/` already emits a `Person` at `about/#founder`, but each
`Article` emits a second, anonymous `Person` with the same name and no `@id`, so a parser cannot
tell they are one human (open — EEAT-5 / AEO-6). Consolidating them is the highest-value
entity work that is not blocked on the owner.

### Freshness and authorship

Shipped 2026-08-24: all three guides carry `datePublished`, `dateModified` and a real byline
(רונן דהן, confirmed — business-facts §A), and the guide entries in `app/sitemap.ts` derive their
`lastModified` from `article.dateModified` so the two cannot drift apart. That closes the signal
itself.

Two things still owed. The visible byline is plain text that links nowhere — the rule in
[eeat-and-trust.md](eeat-and-trust.md) §3 is that a byline which links nowhere is decoration — and
the author has no credential line behind it, which is blocked on business-facts §B. **Never invent a
byline or a date; a fabricated author is a worse trust signal than none.**

### llms.txt

`public/llms.txt` ships (added 2026-08-17 when gate 1 opened): who the business is, the service
list, canonical URLs for key answers, contact, service area. It is a pointer file, not a second
website.

**It is currently stale, and that is a standing failure mode of this file, not a one-off.** It was
written before both silos and still lists only the four services, `/pricing/` and the homepage — no
guide URL, no location URL, and no named human, so the file whose entire job is routing an assistant
to the best answer routes it away from every answer written since (open — AEO-1 / LOC-10 / EEAT-8).
Keep it in sync with `lib/site.ts`, `lib/articles.ts` **and** `lib/locations.ts`: adding a route
means updating this file in the same commit.

---

## 6. Measurement — what proves this is working

| Signal                              | Where                        | Why it is the leading indicator                                                   |
| ----------------------------------- | ---------------------------- | --------------------------------------------------------------------------------- |
| Impressions on Tier-3 queries       | Search Console               | Moves 3-6 weeks **before** rankings do — first proof the guide cluster is landing |
| Map-pack impressions                | GBP dashboard                | The metric most correlated with calls for a service-area business                 |
| Calls + WhatsApp clicks per session | GA4 — **not yet measurable** | Raw sessions are vanity here; the funnel is phone-first                           |
| Citations in AI answers             | Manual spot-check            | Ask the six §5 gate-3 questions in ChatGPT/Perplexity/AI Overviews monthly        |
| Branded search volume               | Search Console               | Evidence the entity is forming                                                    |

**The conversion row is the one that cannot be read yet.** GTM and GA4 ship on every route, so
`page_view` flows — but no click event does: the CTAs carry `data-cta` attributes and nothing reads
them, so calls and WhatsApp taps are invisible. Until that is wired, this strategy is judged on
impressions and rankings, not on leads. The instrumentation plan lives in
[data-tracking-infrastructure.md](data-tracking-infrastructure.md).

---

## 7. Standing prohibitions

- **No doorway clusters.** 12 templated city pages is a domain-level risk, not a coverage strategy.
- **No page without an owned query** (§2 cannibalisation test).
- **No fabricated review, rating, statistic, date or byline**, ever, including sample data.
- **No `LocalBusiness` node per city.** One business with no premises equals one node.
- **No AEO work assumed live** without fetching `robots.txt` first.
