---
name: new-city
description: Append a 13th area to the location silo — all twelve named service areas have a page since 2026-10-28 — via the lib/locations.ts data model with kind, prefixed and typed claims, the doorway gate every page must pass on its own, fresh research with a source register in docs/location-sources/, the route and schema that already exist, and the bidirectional nearby edges the build now enforces. Use when expanding local coverage. Triggers "add a city", "new location page", "cover <city>", "local landing page", "doorway".
---

# Add a location page

**Read this first: the silo is complete. All twelve service areas in `site.serviceAreas` have an entry
in `lib/locations.ts` — תל אביב, חולון and בת ים since 2026-08-30 (`7c9bbda`), and the other nine
added 2026-10-28 at the owner's request. Your task is to append a thirteenth entry, not to build a
silo.**

There are no deferred cities left. A new entry is an area **beyond** the twelve — which is itself a
coverage claim, so the owner confirms the area is served before it gets a page (business-facts §E).
It starts from fresh research: §E never kept a reusable claim set (the 2026-08-24 claim texts were
never saved, which is why the nine were researched from scratch on 2026-10-28).

Sibling sites in this fleet answered the same gap by generating a page per city from one shared
paragraph. All of them now fail the doorway test, and the penalty for a doorway cluster lands on the
**domain**, not the page. **Do not repeat that here.** The owner's decision to cover all twelve did
not lower the gate below — every page had to pass it on its own, and a thirteenth does too.

## The gate — before you write any data

> Replace the city name with a different city name. Is the page now correct and publishable for that
> other city? **If yes, it does not ship.**

To pass, a location page needs **three or more** true, specific items:

- Named neighbourhoods, streets or landmarks.
- **Housing-stock reality** — this is the richest seam for this trade: 1960s שיכונים with original
  galvanised plumbing; towers with pressurised systems and shared risers where one leak affects three
  flats; ground-floor units where the leak is in the slab; renovated flats where the new plumbing runs
  through old walls.
- A real job reference from that city (with permission), or a photo.
- **Travel and response reality** — how far it is, whether same-day genuinely applies at that distance.
  Herzliya and Modi'in are not the same trip.
- A city-specific FAQ that would read oddly anywhere else.
- Local pricing reality if it differs.

**A verified claim set is not a decision to publish.** The adversarial gate run on 2026-08-24 found
that **all twelve** service areas have three or more true, publicly verifiable, city-specific claims
available. That answered _could we_ — not _should we_ — and the list stayed at three until the
owner's 2026-10-28 decision. The three reasons it stayed there are kept in the header of
`lib/locations.ts` as the risk that decision accepted: the claims are **research, not job history**;
many pages launched from one research pass is the doorway **pattern** even when each page is
individually defensible; and depth has to be **sustained** — twelve pages are twelve pages to keep
true. Read that header before you decide anything; CLAUDE.md §4 makes it the mandatory pre-flight
for changing an entry.

**Research it the way the nine were researched (2026-10-28).** Every claim traced to a public source
and put through an attempt to refute it; two independent fact-checks per page, one against the cited
live pages and one blind; then the new page read side by side with the other twelve for the
substitution test and for repeated sentence frames. A lead from an old list is not a claim: that
re-check overturned two queued §E leads (הרצליה's "94 בנייני רכבת ביד התשעה" had no source; רעננה's
"קריית שרת 1950s railway buildings" was refuted). Then weigh two more things:

1. **Contiguity** with an area that already has a page, so the `nearby` edges are honest geography and
   not a link ring. Adjacency, not proximity: רמת גן and פתח תקווה do not border each other and carry
   no edge, and מודיעין has none at all.
2. Whether the distance lets you write **honest availability copy**. Only תל אביב, חולון, בת ים and
   רמת גן say "לנזילה פעילה נשתדל להגיע באותו יום"; the other eight schedule the visit in advance with
   no time promised. The realistic same-day radius is still 🔶 in §E; do not promise at 25 km what is
   only true at 6 km.

**If none of the gate items can be said truthfully about a city, that city does not warrant a page.**
Record that in `docs/business-facts.md` §E rather than padding.

## The data model — read it, do not redesign it

`lib/locations.ts` already defines the shape, and every field on it is required:

```ts
export interface LocationClaim {
  text: string; // one specific, true statement
  category: "housing-stock" | "neighbourhood" | "travel" | "infrastructure";
}

export interface Location {
  slug: string; // ASCII kebab-case, matching the /services/ convention: "tel-aviv"
  name: string; // תל אביב
  kind: "city" | "region";
  prefixed: string; // בתל אביב — carries the preposition so no template guesses
  lastModified: string; // ISO date of the last MEANINGFUL change; app/sitemap.ts emits it
  answer: { q: string; a: string }; // the AEO block. `q` IS the rendered H2; `a` is 40–60 words
  metaDescription: string; // 150–160 chars, AUTHORED, ending in a CTA with the phone number
  intro: string[]; // 2–3 paragraphs, genuinely city-specific
  claims: LocationClaim[]; // the substance — three or more, or the city does not ship
  travel: string; // realistic scheduling at this distance
  faqs: { q: string; a: string }[]; // city-specific; should read oddly anywhere else
  nearby: string[]; // adjacent location slugs — the edge is BIDIRECTIONAL
}
```

`kind` drives `City` vs `AdministrativeArea` in the schema. `prefixed` exists because `בתל אביב-יפו`
reads badly and any future region (`השרון`, `צפון`) needs `באזור השרון` / `בצפון הארץ`, not a bare
preposition. `category` on a claim is not decoration: it is there so an auditor can see **why** an item
was considered city-specific. `travel` is required — a city whose travel reality you cannot state
honestly is a city that failed the gate. `nearby` is **build-enforced** since 2026-10-28: a
module-scope check under the array throws on a slug that is not a location or an edge that is
one-way, so every build fails on it (the footer imports the file on every route).

**Keep slugs ASCII.** Every existing route on this site is ASCII (`/services/water-leak-detection/`).
If you choose Hebrew slugs instead, the dynamic route **must** match with
`decodeURIComponent(param).normalize("NFC")` — params arrive percent-encoded during static export, and
a route that skips this works in dev and 404s in production.

## Steps

1. **Apply the gate.** Decide whether this city has three true, specific items you can source. Write
   them down before writing prose. If the answer is no, stop and record it in §E.
2. **Append the entry to the `locations` array in `lib/locations.ts`.** Order the array the way you
   want the hub to list it. Every claim is 🔶 until the owner confirms it — the header says so, and it
   applies to your entry too.
3. **Write its source register in the same commit:** `docs/location-sources/{slug}.md` — the field
   each statement sits in, the source URL, the supporting sentence quoted in its original language,
   and how it was checked — plus a row in `docs/location-sources/README.md`. A statement with no row
   is unsourced and does not ship; a claim that changes later changes in both files together.
4. **Nothing else in the code needs creating.** `app/locations/[city]/page.tsx` builds the page from
   `generateStaticParams()` over `locationSlugs`; `app/locations/page.tsx` lists every entry on the
   hub; `generateMetadata` composes the title from `prefixed`, the description from
   `metaDescription` and the OG description from `answer.a`;
   `locationServiceJsonLd()` emits `Service` with `areaServed` typed off `kind`; `PageHero` emits the
   `BreadcrumbList`; and `faqPageJsonLd()` covers **`[answer, ...faqs]`** — the answer block joins the
   FAQ graph as its first `Question` (2026-10-28), so a city with two FAQs emits three. Adding a
   route by hand duplicates all of it.
5. **Order `claims` deliberately.** `app/locations/page.tsx` renders `claims[0].text` verbatim as the
   city's card blurb on `/locations/`, so the first claim doubles as the hub description and appears on
   two pages.
6. **Write `answer.q` as a real question, and `metaDescription` by hand.** Two traps here, both of
   them former bugs. (a) `answer.q` is rendered verbatim as the page's H2 **and** emitted as a
   `FAQPage` `Question` — Google requires the Q&A be visible, and this shape is what guarantees it,
   so an empty or placeholder `q` ships an invalid node. All twelve cities use
   `מבצעים איתור נזילות {prefixed}?`; a city with a better real question should use it. (b)
   `metaDescription` must be **authored**. The route used to derive it with `answer.slice(0, 155)`,
   which cut all three cities mid-word — בת ים's page severed its own name (finding SEO-02). The
   answer already appears in the first visible paragraph, so reusing it wastes the one field that can
   carry a distinct hook.
7. Set `nearby` from real geography, and add the new city to the `nearby` of its neighbours — **the
   edge is bidirectional**, and the build fails on a one-way or unknown slug. An area with no adjacent
   page keeps `nearby: []`, as מודיעין does; never invent an edge to fill the slot.
8. Meet the **350-word floor** (`docs/content-standards.md` §1) with genuine local substance. For
   calibration, on the 2026-10-28 build the nine new pages carry 446–469 unique non-chrome words
   (949–997 raw, chrome included) and the first three 409–461. (Earlier, 2026-09-06 with the §1
   command: the first three emitted 784–855 raw words; site chrome measured 116 words on
   `out/404.html` and the shared `ContactCTA` a further ~113, so subtract before comparing.)
9. **The sitemap is derived, not hand-maintained, for this silo.** `app/sitemap.ts` maps over
   `locations`, so a new entry appears automatically — there is nothing to add there. Set the city's
   required `lastModified` to the day it first deploys, and bump it whenever its visible content
   meaningfully changes (a `metaDescription` or OG edit does not count). **`public/llms.txt` is not
   derived**: it lists all twelve city URLs, so add the new one in the same commit (CLAUDE.md §3).
10. `npm run lint && npm run build`, then `npm run check:sitemap`, then confirm the route exists in
    `out/` **and** in `out/sitemap.xml`. The 2026-10-28 baseline it prints is "31 routes emitted, 28
    indexed, 3 deliberately excluded; llms.txt 29 URL(s), all live" — one more city adds one to each
    of the first two numbers and to the llms.txt count. Each city page costs about 302–308 KB of
    export against the 15,000,000 B budget (`docs/performance-guidelines.md` §1).

## Checklist

- [ ] Every city that ships passes the doorway substitution test, and the _should we_ question was
      answered separately from the _could we_ one.
- [ ] `kind` and `prefixed` set; no template interpolates a bare `ב${name}`.
- [ ] ≥350 unique words; three or more genuinely local `claims`, each with a `category`.
- [ ] `answer.a` is 40–60 words; `answer.q` is a real question and renders as the visible H2.
- [ ] `metaDescription` is authored, 150–160 chars, and ends with the phone number — NOT derived.
- [ ] `lastModified` is the day the page first deploys.
- [ ] `claims[0]` is the item you want on the hub card.
- [ ] `travel` states real availability at this distance — no borrowed same-day promise.
- [ ] `nearby` set on both sides (the build fails otherwise), or empty when no area is adjacent.
- [ ] `docs/location-sources/{slug}.md` written and indexed in its `README.md`, in the same commit.
- [ ] `Service` + `areaServed` + `FAQPage` + `BreadcrumbList` emitted; no per-city `LocalBusiness`.
- [ ] Present in `out/`, `out/sitemap.xml` and `public/llms.txt`; `npm run check:sitemap` passes.

## Gotchas

- **A doorway cluster deployed here is a domain-level risk.** Get the content gate right before
  anything ships — `/deploy-thermoleak` is the production mutation, and there is no staging
  environment between the ops script and the live site.
- Never invent a neighbourhood, a landmark, or a local job. Unverified → `// 🔶 confirm` +
  `docs/business-facts.md` §E. Every claim already in the file is adversarially checked against public
  sources, **not** sourced by someone who has worked in those buildings — verification is not truth.
- **Fixed 2026-10-19 — the sitemap no longer stamps one hardcoded date on every city.** `Location`
  now has a required `lastModified`, which `app/sitemap.ts` reads (the first three carried
  2026-08-30, their first deploy, until the 2026-10-28 removal of job-history and same-day wording
  moved them to 2026-10-28). The `/locations/` hub keeps its own date in `app/sitemap.ts`; bump it
  too if the hub's visible content changes.
- **Wire the new city's inbound links in the same commit.** The footer's `אזורי שירות` list maps
  over `locations`, so it links the new city automatically (since 2026-10-19). The service pages
  still do not link to any city (LOC-2, internal-linking skill §3).
- **Open code defect — the same city is named two ways in two schema nodes.** `site.serviceAreas` gives
  the `LocalBusiness` node `areaServed: "תל אביב-יפו"` while `locations[].name` gives the page's
  `Service` node `areaServed: "תל אביב"`, and both ship on the same page (finding LOC-11). If your new
  city's `site.serviceAreas` spelling differs from its `name`, you are adding another instance.
- Nine pages landing together on 2026-10-28 was the owner's call, made knowing it is the doorway
  pattern — not a precedent for batching. Each of the nine was researched, fact-checked and read
  against the others on its own; a thin page can still cost you the eleven others.
- Never write job history or call volume into a city page. On 2026-10-28 such sentences were removed
  from the first three (חולון intro[1]/claims[5], בת ים faqs[1]/claims[5], תל אביב faqs[1]) — we have
  no job record behind them (golden rule 1).
- Adding links to a thin page doesn't fix the thin page. Depth first, then the mesh.
- `/locations/` is already in `navLinks`, so the hub is in the header and the footer on every route —
  but **no service page links into a city page today**. That is an open mesh gap in the silo as a
  whole, not something your entry creates; fixing it is an `/internal-linking` task.
