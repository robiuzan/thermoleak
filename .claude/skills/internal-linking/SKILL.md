---
name: internal-linking
description: Build the link mesh on thermoleak — a header that reaches all four services in one hop, lib/links.ts as the one build-checked home of every cross-file link (service → city, service → guide, guide → service and /pricing/), the shared LinkLead / LinkedText / CityChips renderers, the /services/ hub prose and the city mesh (both shipped 2026-11-13, closing backlog §9.4 and LOC-2), related-service relevance, breadcrumbs emitted by PageHero itself, and a zero-orphan check. Use when wiring related links, fixing orphans, or auditing navigation. Triggers "internal linking", "orphan pages", "navigation", "related links", "footer links", "breadcrumbs", "anchor text".
---

# Internal linking

Twenty-nine indexable routes (32 emitted, 2026-11-01 build; unchanged on the 2026-11-13 build of
`3492fb8`), and the graph is **orphan-free** — the only unlinked emitted files are `/404/`,
`/_not-found/` and `/thank-you/`, all three deliberate. That is genuinely better than most sites this
size. The gap was never reachability; it was **anchor-text depth and the direction of the location
edges** — and since release 1 (2026-11-13) the location edges run both ways and the service ↔ guide
edges exist. What is left: a header that stops at the hubs (§1), and the electrical service, which
features no guide yet (its guide is the next wave).

## Current state (backlog §9)

| Aspect                    | State                                                                                                            |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Orphans                   | **zero** ✅ (`/404/`, `/_not-found/`, `/thank-you/` are intentional)                                             |
| Header                    | 7 nav links (`navLinks`) — services, pricing, locations and guides indexes; individual services **no**           |
| Footer                    | all 4 services + all 7 nav links + `/gallery/` + both legal pages + all 12 cities (`אזורי שירות`, 2026-10-19) ✅ |
| Related services          | `services.filter(s => s.slug !== current)` → all 3 others. Correct at 4 services; revisit at 8+                  |
| Contextual in-copy links  | ✅ shipped — a `related` block per service (`lib/services.ts`, 2 descriptive anchors each), rendered by `LinkLead` |
| Service → guide           | ✅ 2026-11-13 — `featuredGuides`: water → 3 guides, moisture → 1, insurance → 2, electrical none (next wave)      |
| Price sidebar → `/pricing/` | ✅ 2026-11-13 — `priceLink` per service (`#visit-scope` on water, `#price-factors` on moisture)                |
| Hub prose on `/services/` | ✅ 2026-11-13 — `servicesHub` (`lib/hubs.ts`) via `LinkedText`: all 4 services, `/pricing/`, `/guides/`, 12 cities |
| Breadcrumbs               | ✅ `PageHero` renders the trail **and** emits `BreadcrumbList` from the same array — 28 pages                    |
| Location silo             | 12 cities — each links out to all 4 services; in: hub, footer, `nearby`, `/services/`, water + moisture (all 12), electrical (3) |

## 1. Header

`navLinks` in `lib/site.ts` reaches `/`, `/services/`, `/pricing/`, `/locations/`, `/guides/`,
`/about/`, `/contact/` — seven links, every hub but no leaf. Individual services are two hops away
from the header (the footer and, on `/` only, the hero's «מה הבעיה?» selector reach them in one).
With only four services, a dropdown exposing them is cheap and worth it. (`/reviews/` is **not** a nav
link and must not become one — the route was removed 2026-08-17 and 301s to `/about/`.)

Constraints if you build one:

- `Navbar.tsx` is already `"use client"` for the mobile toggle; keep any new state in the same leaf and
  don't push more of the tree client-side.
- Keyboard-operable: `aria-expanded`, `aria-controls`, **Escape closes**, focus returns to the trigger.
  The mobile menu in `Navbar.tsx` now has all of that plus a Tab trap and a scroll lock — reuse that
  pattern, and don't regress it.
- On mobile, nest the service list inside the existing disclosure rather than adding a second pattern.

## 2. Footer

Already renders every service, every nav link and both legal pages — **no `slice()`, no truncation**.
Don't add one. Two notes:

- **The locations list shipped 2026-10-19** — `אזורי שירות` under the hours column maps every entry
  of `locations` to `/locations/{slug}/` with the anchor `locationTitle(location)` (`איתור נזילות
  {prefixed}`; one helper in `lib/locations.ts` since 2026-11-13), the footer half of
  LOC-2; it lists all twelve since 2026-10-28. Until then the cities' only inbound links were
  `/locations/` and each other, and Google had crawled none of the four (URL Inspection 2026-10-19:
  "URL is unknown to Google"). The social icons that used to sit
  here were removed 2026-08-17 along with the fabricated reviews; `components/Footer.tsx` carries a
  comment saying they come back only with real profile URLs from `docs/business-facts.md` §B. Don't
  restore them from memory.
- There is no NAP block beyond the region name. Phone, email and hours are all there; the service area
  is text. That is appropriate for a business with no address — just keep it rendered from `lib/site.ts`.

## 3. Contextual in-copy links — shipped, and checked at build time

Each of the four services carries a `related` block (`lead` + `links`) in `lib/services.ts`, rendered
inside the prose by `components/LinkLead.tsx`, with descriptive Hebrew anchors — e.g.
water-leak-detection → `דו״ח תרמוגרפי לחברות הביטוח` and `איתור רטיבות וכשלי בידוד`. **Match that
pattern; don't invent a second one.** All twelve city pages link out to all four services the same way.

**The mechanism since 2026-11-13: `lib/links.ts`.** `lib/services.ts`, `lib/articles.ts` and
`lib/locations.ts` never import each other; `lib/links.ts` imports all three and is imported **only by
server routes** (never a client component), so no cycle forms and no copy reaches a client bundle. It
resolves every cross-file edge — `cityLinksOf(service)`, `guidesOf(service)`,
`servicesOfArticle(article)`, `guideLink(slug)`, `allCityLinks()` — and its module-scope checks fail the
build on an unknown service, guide or city slug, on an href that is not a route of the site or lacks its
trailing slash (`knownRoutes`, which also knows `/pricing/#guarantee`, `#visit-scope` and
`#price-factors`), and on a `/services/` or homepage lead whose city count is not
`locations.length`. A new link is a data
edit in `lib/`; the build tells you when its target does not exist.

Three renderers, one per shape — use them, never a hand-written `<Link>` list in a page:

- **`LinkLead`** — a lead sentence, then ` · `-separated anchors (the `LinkLead` type in `lib/site.ts`:
  `lead`, `links`, optional `tail`). Service `related`, the service guides block, the electrical city
  sentence, an article's `related` block, the homepage's `methodExplainer.more` (→ `/guides/`) and
  `servicePillars.areas` (→ `/locations/`), and `/pricing/` → the cost guide.
- **`LinkedText`** — prose with links mid-sentence (`LinkedText` = `(string | NavLink)[]`). The
  `/services/` hub prose only, so far.
- **`CityChips`** — a chip row at `min-h-11` (44 px), its list marked `data-shared-block` so a word
  count can strip it. Water and moisture (all twelve), the `/services/` hub, and each city's
  «אזורים סמוכים».

The edges release 1 added (verified in `out/` on the 2026-11-13 build):

- water-leak and moisture → **all twelve** city pages (`cityLinks: { mode: "all" }`), anchor =
  `locationTitle()` («איתור נזילות ב…»).
- electrical → חולון, רמת גן, רעננה only (`mode: "places"`), the three whose own pages discuss panels,
  under place anchors («אזור התעשייה בחולון») — never «בדיקת לוחות חשמל ב{city}», because no
  service × city page exists (`docs/keyword-map.md` §6). insurance → no city: a document, not a place.
- services → guides (`featuredGuides`): water → find-leak, camera, cost; moisture → camera; insurance →
  cost, find-leak; electrical none.
- price sidebar → `/pricing/` (`priceLink`); `/pricing/` → the cost guide; the cost guide →
  `/pricing/#visit-scope` and `/pricing/#guarantee` (an article `related` block, the guarantee linked by
  its own slogan `site.guarantee`).
- `/pricing/` and `/services/` cards → the service page under `service.h1` (was «על השירות» ×4 and
  «פרטים נוספים»).
- homepage → `/guides/` and `/locations/`, permanently — the updates strip, once the only in-body link,
  hides itself 45 days after its newest item.

The anchor-text rules, wherever the link lives:

- ✅ `<Link href="/services/insurance-reports/">דו״ח תרמוגרפי לחברת הביטוח</Link>`
- ✅ `<Link href="/services/moisture-detection/">איתור מוקד הרטיבות עצמו</Link>`
- ❌ "לחצו כאן", "למידע נוסף", a bare URL

A new service picks its city links in data — a `cityLinks` mode, or none — never city links
hand-written into one page's JSX: a bespoke shape on one of four is how the mesh rots.

Copy lives in `lib/services.ts`, `lib/articles.ts`, `lib/locations.ts` and `lib/hubs.ts`; a new link
is a data edit, not a JSX edit.

## 4. Hub prose on `/services/` — shipped 2026-11-13 (backlog §9.4)

`/services/` now reads: `TrustRow`, then `servicesHub.intro` (`lib/hubs.ts`, rendered by
`LinkedText`) — one camera, four different questions, each linked in-sentence to its service — then
the image strip and the cards, then `servicesHub.more` (→ `/pricing/` and `/guides/`) and the
twelve-city `CityChips`. About 438 unique words on the 2026-11-13 build (`<main>`, shared blocks
stripped, minus `ContactCTA`; floor 250); the value is still the anchor text, not the count.

Still open on the other hubs: `/locations/`'s prose is short and its card blurbs are lifted verbatim
from the child pages (LOC-7), and `/guides/` is about 150 unique words against its 250 floor —
`lib/hubs.ts` is where its prose goes, with the release-2 guides.

## 5. Breadcrumbs — one array, two consumers, already wired

`components/PageHero.tsx` takes one `crumbs` array and does both jobs from it: it renders the visible
trail through `Breadcrumbs` **and** emits `BreadcrumbList` itself, mapping `href` → `url`. They cannot
drift. 28 emitted pages carry both on the 2026-11-01 build and again on the 2026-11-13 build (every
route except `/`, `/thank-you/` and the two 404 artifacts; 18 before the nine cities).

**A page must never call `breadcrumbJsonLd` directly** — that double-emits. Pass `crumbs` to
`PageHero` and nothing else. See `/schema-structured-data`.

## 6. The location mesh — wired both ways (LOC-2 closed 2026-11-13)

Twelve cities: three since 2026-08-30, nine added 2026-10-28 (`/new-city`). What the mesh was
supposed to have, and where it stands:

- ✅ Every location page links to all 4 services with descriptive anchors.
- ✅ Every location page links to its **nearby** cities from the `nearby` field, and the edges are
  bidirectional — build-enforced since 2026-10-28: a module-scope check in `lib/locations.ts` fails
  the build on an unknown or one-way slug. מודיעין has no `nearby` (no adjacent area), and that is
  correct.
- ✅ Service pages link into the silo (2026-11-13, §3): water-leak and moisture all twelve,
  electrical three, and the `/services/` hub all twelve. Counted inside `<main>` on the 2026-11-13
  build, each city page now has descriptive in-body links from **4–8** other pages — מודיעין the
  fewest at 4 (it had 1, the hub), תל אביב and חולון the most at 8.
- ✅ The footer links every location (2026-10-19) — all twelve, so each city page is linked from 30
  other pages. That is chrome; the in-body count above is the relevance signal.

LOC-2 is closed. When a new area lands, wire its inbound links **in the same commit** — the roadmap,
`/new-city` and `docs/keyword-map.md` §6 all say "before it ships", and sprint 3 and the 2026-10-28
batch are the counter-examples. Water, moisture and the hub pick a new city up automatically from
`locations` (`allCityLinks()`, and the hub lead's count is checked); electrical's `places` list is a
decision per city — add one only where the city page itself discusses panels.

Count the in-body inbound links per city (the footer and nav sit outside `<main>`, so they drop out):

```bash
for c in $(ls -d out/locations/*/ | xargs -n1 basename | grep -v '^__'); do
  n=$(for f in $(find out -name index.html ! -path "out/locations/$c/*"); do
        perl -0777 -ne 's{<script.*?</script>}{}gs; print "x\n" if /<main\b.*?>.*href="\/locations\/'"$c"'\/".*<\/main>/s' "$f"
      done | wc -l)
  echo "$n $c"
done | sort -n
```

## Zero-orphan check

```bash
find out -name index.html | sed 's|^out||; s|index.html$||' | sort > /tmp/routes.txt
# The live-kit's bar and seasonal card are sitewide chrome (CLAUDE.md §14): strip them before
# collecting links, or a page linked only from a seasonal line would pass as linked.
find out -name index.html -exec perl -0pe 's/<div class="live-topbar".*?<\/div><\/div>//gs; s/<div class="live-dialogs".*?<\/dialog><\/div>//gs' {} + \
  | grep -o 'href="/[^"]*"' | sed 's|href="||; s|"$||' | sort -u > /tmp/linked.txt
comm -23 /tmp/routes.txt /tmp/linked.txt
```

Expected output: exactly `/404/`, `/_not-found/` and `/thank-you/`. The first two are the double 404
emission (backlog §1.1); `/thank-you/` is reached by `router.push` from the form and is noindex by
design. Anything else printed is a regression.

## Checklist

- [ ] All 4 services reachable within one hop of the header.
- [ ] Footer renders every service and every location — no `slice`.
- [ ] Every service page carries 2–3 contextual in-copy links with descriptive anchors.
- [ ] Every cross-file link is data in `lib/`, rendered by `LinkLead`, `LinkedText` or `CityChips`,
      and the build's `lib/links.ts` checks pass — no hand-written href list in a page.
- [ ] `/services/` has hub prose that links into its children **and** into the cities (shipped
      2026-11-13 — keep it).
- [ ] Each city page has ≥3 in-body inbound links (the count in §6; 4–8 on 2026-11-13).
- [ ] Breadcrumbs come from a single `crumbs` array passed to `PageHero`; no page calls
      `breadcrumbJsonLd` itself.
- [ ] Every new location page has descriptive-anchor inbound links before it ships.
- [ ] The orphan check prints only `/404/`, `/_not-found/` and `/thank-you/`.

## Gotchas

- All internal links need the trailing slash (`trailingSlash: true`), or they redirect and waste a hop.
  Next's `<Link>` normalises a slashless `href` on export — every emitted `href` in `out/` currently
  carries the slash, breadcrumbs included — but write it explicitly anyway, because a raw `<a>` gets no
  such help. Verify with `grep -rho 'href="/[^"]*"' out --include=index.html | sort -u`.
- **Never a `slug:` key inside a link structure in `lib/services.ts`.** `live.config.mjs` reads every
  `slug: "…",` line in that file as a page boundary, which is why `heroPicker` uses `service:` and
  `cityLinks.places` uses `city:`.
- `lib/links.ts` must stay out of client components. Importing it into one would ship every service,
  guide and city string as JavaScript — the bundle cost `51c884d` removed from `ContactForm`.
- Adding links to a thin page doesn't fix the thin page. Depth first (`/new-service`), then the mesh.
- Anchor text is a ranking signal; card titles and nav labels are the weakest form of it.
