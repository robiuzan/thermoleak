---
name: internal-linking
description: Build the link mesh on thermoleak — a header that reaches all four services in one hop, the shipped in-copy links on the service pages, hub prose still missing on /services/, related-service relevance, the location silo's one-way mesh (nothing links INTO the three city pages with a descriptive anchor), breadcrumbs emitted by PageHero itself, and a zero-orphan check. Use when wiring related links, fixing orphans, or auditing navigation. Triggers "internal linking", "orphan pages", "navigation", "related links", "footer links", "breadcrumbs", "anchor text".
---

# Internal linking

Nineteen indexable routes (22 emitted), and the graph is **orphan-free** — the only unlinked emitted
files are `/404/`, `/_not-found/` and `/thank-you/`, all three deliberate. That is genuinely better
than most sites this size. The gap is not reachability; it is **anchor-text depth and the direction of
the location edges**.

## Current state (backlog §9)

| Aspect                    | State                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| Orphans                   | **zero** ✅ (`/404/`, `/_not-found/`, `/thank-you/` are intentional)                                   |
| Header                    | 7 nav links (`navLinks`) — services, pricing, locations and guides indexes; individual services **no** |
| Footer                    | all 4 services + all 7 nav links + both legal pages ✅ — but **no locations column**                   |
| Related services          | `services.filter(s => s.slug !== current)` → all 3 others. Correct at 4 services; revisit at 8+        |
| Contextual in-copy links  | ✅ shipped — a `links` array per service (`lib/services.ts`), 2 descriptive anchors each               |
| Hub prose on `/services/` | **still none** — the index is a card grid plus the PageHero subtitle                                   |
| Breadcrumbs               | ✅ `PageHero` renders the trail **and** emits `BreadcrumbList` from the same array — 18 pages          |
| Location silo             | ships (3 cities) — the mesh is **one-way**: cities link out to all 4 services, nothing links in        |

## 1. Header

`navLinks` in `lib/site.ts` reaches `/`, `/services/`, `/pricing/`, `/locations/`, `/guides/`,
`/about/`, `/contact/` — seven links, every hub but no leaf. Individual services are two hops away.
With only four services, a dropdown exposing them is cheap and worth it. (`/reviews/` is **not** a nav
link and must not become one — the route was removed 2026-08-17 and 301s to `/about/`.)

Constraints if you build one:

- `Navbar.tsx` is already `"use client"` for the mobile toggle; keep any new state in the same leaf and
  don't push more of the tree client-side.
- Keyboard-operable: `aria-expanded`, `aria-controls`, **Escape closes**, focus returns to the trigger.
  The existing mobile menu has `aria-expanded` and `aria-controls` but **no Escape handler, no focus
  trap, no scroll lock** — fix that in the same pass rather than copying it.
- On mobile, nest the service list inside the existing disclosure rather than adding a second pattern.

## 2. Footer

Already renders every service, every nav link and both legal pages — **no `slice()`, no truncation**.
Don't add one. Two notes:

- **There is no locations column.** Adding one (`אזורי שירות`, mapping `locations` to
  `/locations/{slug}/`) is the cheapest half of the LOC-2 fix below. The social icons that used to sit
  here were removed 2026-08-17 along with the fabricated reviews; `components/Footer.tsx` carries a
  comment saying they come back only with real profile URLs from `docs/business-facts.md` §B. Don't
  restore them from memory.
- There is no NAP block beyond the region name. Phone, email and hours are all there; the service area
  is text. That is appropriate for a business with no address — just keep it rendered from `lib/site.ts`.

## 3. Contextual in-copy links — shipped on the services, missing into the cities

Each of the four services carries a `links` array in `lib/services.ts` rendered inside the prose, with
descriptive Hebrew anchors — e.g. water-leak-detection → `דו״ח תרמוגרפי לחברות הביטוח` and
`איתור רטיבות וכשלי בידוד`. **Match that pattern; don't invent a second one.** The three city pages
link out to all four services the same way.

The remaining gap is the reverse edge: **no commercial page links into a city page with a descriptive
anchor** (LOC-2). `/locations/` itself is in the header and the footer, so the cities are two hops from
every page and nothing is orphaned — but the four pages that monetise a local query send no relevance
signal to the page targeting it.

The anchor-text rules, wherever the link lives:

- ✅ `<Link href="/services/insurance-reports/">דו״ח תרמוגרפי לחברת הביטוח</Link>`
- ✅ `<Link href="/services/moisture-detection/">איתור מוקד הרטיבות עצמו</Link>`
- ❌ "לחצו כאן", "למידע נוסף", a bare URL

The edges that are still missing, all of them into the location silo: `/services/` → a strip linking
the three cities; each `/services/{slug}/` → the cities it covers. Options for the last one, pick one
and apply it to all four: a shared nearby-locations block rendered from `lib/locations.ts`, or an
optional `locations?: string[]` field on `Service`. Do not hand-write city links into one service page
only — a bespoke shape on one of four is how the mesh rots.

Copy lives in `lib/services.ts` and `lib/locations.ts`; a new link is a data edit, not a JSX edit.

## 4. Hub prose on `/services/`

`/services/` is the natural hub and is still a `PageHero` subtitle above a card grid — no linking
prose. Give it an intro that links contextually into its children and explains **how the four services
relate** — one camera, one visit, four different questions it can answer — and use the same block to
carry the three city links from §3. Content-standards §1 sets a 250-word floor for index pages; the
value here is the anchor text, not the word count. `/locations/` has the same shape of gap: its hub
prose is short and its card blurbs are lifted verbatim from the child pages (LOC-7).

## 5. Breadcrumbs — one array, two consumers, already wired

`components/PageHero.tsx` takes one `crumbs` array and does both jobs from it: it renders the visible
trail through `Breadcrumbs` **and** emits `BreadcrumbList` itself, mapping `href` → `url`. They cannot
drift. 18 emitted pages carry both (every route except `/`, `/thank-you/` and the two 404 artifacts).

**A page must never call `breadcrumbJsonLd` directly** — that double-emits. Pass `crumbs` to
`PageHero` and nothing else. See `/schema-structured-data`.

## 6. The location mesh — half built

Three cities shipped 2026-08-24 (`/new-city`). What the mesh was supposed to have, and where it stands:

- ✅ Every location page links to all 4 services with descriptive anchors.
- ✅ Every location page links to its **nearby** cities from the `nearby` field, and the edges are
  bidirectional — verify that when you add a fourth; a one-way `nearby` is a modelling error.
- ❌ No service page links to any location.
- ❌ The footer has no locations column.

Those two ❌ rows are LOC-2 and are the mesh work outstanding. When a fourth city lands, wire its
inbound links **in the same commit** — the roadmap, `/new-city` and `docs/keyword-map.md` §6 all say
"before it ships", and sprint 3 is the reason that instruction now has a counter-example.

## Zero-orphan check

```bash
find out -name index.html | sed 's|^out||; s|index.html$||' | sort > /tmp/routes.txt
grep -rho 'href="/[^"]*"' out --include=index.html | sed 's|href="||; s|"$||' | sort -u > /tmp/linked.txt
comm -23 /tmp/routes.txt /tmp/linked.txt
```

Expected output: exactly `/404/`, `/_not-found/` and `/thank-you/`. The first two are the double 404
emission (backlog §1.1); `/thank-you/` is reached by `router.push` from the form and is noindex by
design. Anything else printed is a regression.

## Checklist

- [ ] All 4 services reachable within one hop of the header.
- [ ] Footer renders every service and every location — no `slice`.
- [ ] Every service page carries 2–3 contextual in-copy links with descriptive anchors.
- [ ] `/services/` has hub prose that links into its children **and** into the cities.
- [ ] Breadcrumbs come from a single `crumbs` array passed to `PageHero`; no page calls
      `breadcrumbJsonLd` itself.
- [ ] Every new location page has descriptive-anchor inbound links before it ships.
- [ ] The orphan check prints only `/404/`, `/_not-found/` and `/thank-you/`.

## Gotchas

- All internal links need the trailing slash (`trailingSlash: true`), or they redirect and waste a hop.
  Next's `<Link>` normalises a slashless `href` on export — every emitted `href` in `out/` currently
  carries the slash, breadcrumbs included — but write it explicitly anyway, because a raw `<a>` gets no
  such help. Verify with `grep -rho 'href="/[^"]*"' out --include=index.html | sort -u`.
- Adding links to a thin page doesn't fix the thin page. Depth first (`/new-service`), then the mesh.
- Anchor text is a ranking signal; card titles and nav labels are the weakest form of it.
