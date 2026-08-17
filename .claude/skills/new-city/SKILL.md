---
name: new-city
description: Build the location-page silo that does not exist yet — the lib/locations.ts data model with kind and prefixed, the doorway gate that decides which of the 12 service areas earn a page at all, the route, the link mesh, the schema, and the sitemap. Use when expanding local coverage. Triggers "add a city", "new location page", "cover <city>", "local landing page", "doorway".
---

# Add a location page

**Read this first: this site has no location pages, and that is currently an advantage.**

`site.serviceAreas` names twelve cities — תל אביב-יפו, רמת גן, גבעתיים, הרצליה, פתח תקווה, ראשון לציון,
חולון, בת ים, רעננה, כפר סבא, ראש העין, מודיעין — rendered as plain text chips with no route behind
them. So the entire Tier-2 `{service} ב{city}` layer is unexpressed.

Sibling sites in this fleet answered that by generating a page per city from one shared paragraph. All
of them now fail the doorway test, and the penalty for a doorway cluster lands on the **domain**, not
the page. **Do not repeat that here.** Build few, build deep.

## The gate — before you write any code

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

**If none of those can be said truthfully about a city, that city does not warrant a page.** Record that
in `docs/business-facts.md` §E rather than padding. Realistically this yields **3–5 cities**, not 12 —
start with the ones where the business actually works most.

## The data model — define it before the first page

There is no `lib/locations.ts` yet. Create it in the shape the schema and the copy will both need,
rather than discovering the fields on page three:

```ts
// lib/locations.ts
export interface Location {
  slug: string;          // ASCII kebab-case, matching the /services/ convention: "tel-aviv"
  name: string;          // תל אביב
  kind: "city" | "region";
  prefixed: string;      // בתל אביב  — carries the preposition so no template guesses
  answer: string;        // 40–60 words, the AEO block
  intro: string[];       // 2–3 paragraphs, genuinely city-specific
  localNotes: string[];  // the substance — three or more items from the gate above
  neighborhoods?: string[];
  travel?: string;       // realistic scheduling for this distance
  faqs: { q: string; a: string }[];   // 2–3, city-specific
  nearby: readonly string[];          // 2–4 adjacent location slugs
}
```

`kind` drives `City` vs `AdministrativeArea` in the schema. `prefixed` exists because `בתל אביב-יפו`
reads badly and any future region (`השרון`, `צפון`) needs `באזור השרון` / `בצפון הארץ`, not a bare
preposition.

**Keep slugs ASCII.** Every existing route on this site is ASCII (`/services/water-leak-detection/`).
If you choose Hebrew slugs instead, the dynamic route **must** match with
`decodeURIComponent(param).normalize("NFC")` — params arrive percent-encoded during static export, and
a route that skips this works in dev and 404s in production.

## Steps

1. **Apply the gate.** Decide which cities have three true, specific items. Write them down before
   writing prose.
2. Create `lib/locations.ts` with the model above and the first 3–5 entries.
3. Create `app/locations/[city]/page.tsx`. Copy the structure of
   `app/services/[slug]/page.tsx` — including `generateStaticParams`, the **`params: Promise<…>`**
   signature (Next 16), `notFound()` narrowing, `PageHero` with crumbs, and `ContactCTA` at the end.
4. Create `app/locations/page.tsx` as the index, with real hub prose — not just a list of chips.
5. Render in this order: answer block → intro → local notes → the full service list with links →
   nearby locations → city FAQ → CTA.
6. Meet the **350-word floor** (`docs/content-standards.md` §1) with genuine local substance.
7. Set `nearby` from real geography, and add the new city to the `nearby` of its neighbours — **the
   edge is bidirectional**; a one-way link is a modelling error.
8. Wire the mesh **before shipping**: footer column, links from `/services/`, links from each service
   page. Do not ship a page nothing links to — the site currently has zero orphans.
9. Add the routes to `app/sitemap.ts`. `staticRoutes` there is hand-maintained (backlog §1.2), so a new
   silo is silently absent from the sitemap unless you add it — derive it instead if you're touching
   that file.
10. Emit `Service` with `areaServed` (`City` or `AdministrativeArea` per `kind`) plus `BreadcrumbList`.
    **Never a `LocalBusiness` node per city** — this business has no premises at all.
11. Metadata per `docs/keyword-map.md` §3: `איתור נזילות ב{prefixed}`, **no second brand token**,
    canonical with a trailing slash.
12. `npm run lint && npm run build`, then verify each route exists in `out/` **and** in
    `out/sitemap.xml`.

## Checklist

- [ ] Every city that ships passes the doorway substitution test.
- [ ] `kind` and `prefixed` set; no template interpolates a bare `ב${name}`.
- [ ] ≥350 unique words; three or more genuinely local items.
- [ ] Opens with a 40–60 word answer block.
- [ ] `nearby` set on both sides.
- [ ] Inbound links exist from the footer, `/services/` and at least one service page.
- [ ] Added to `app/sitemap.ts`.
- [ ] `Service` + `areaServed` + `BreadcrumbList` emitted; no per-city `LocalBusiness`.
- [ ] Title carries the brand exactly once; canonical has a trailing slash.
- [ ] Present in `out/` and `out/sitemap.xml`.

## Gotchas

- **Every push to `main` deploys.** A doorway cluster committed here is live within minutes — there is
  no staging gate. Get the gate right before you commit, not after.
- Never invent a neighbourhood, a landmark, or a local job. Unverified → `// 🔶 confirm` +
  `docs/business-facts.md` §E.
- Twelve pages in one commit is not a coverage strategy. Three good ones beat twelve thin ones, and the
  thin twelve can cost you the three.
- Adding links to a thin page doesn't fix the thin page. Depth first, then the mesh.
