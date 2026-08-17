---
name: internal-linking
description: Build the link mesh on thermoleak — a header that reaches all four services in one hop, contextual in-copy links where currently none exist, hub prose on /services/, related-service relevance, the location silo's mesh planned before it is built, breadcrumbs matched to BreadcrumbList, and a zero-orphan check. Use when wiring related links, fixing orphans, or auditing navigation. Triggers "internal linking", "orphan pages", "navigation", "related links", "footer links", "breadcrumbs", "anchor text".
---

# Internal linking

Eleven content routes, and the graph is already **orphan-free** — the only unlinked emitted files are
`/404/` and `/_not-found/`, which is correct. That is the good news, and it is genuinely better than
most sites this size. The gap is not reachability; it is **anchor-text diversity and depth**.

## Current state (backlog §9)

| Aspect                    | State                                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| Orphans                   | **zero** ✅                                                                                     |
| Header                    | 5 nav links (`navLinks`) — services index yes, individual services **no**                      |
| Footer                    | all 4 services + all 5 nav links + both legal pages ✅ genuinely complete                       |
| Related services          | `services.filter(s => s.slug !== current)` → all 3 others. Correct at 4 services; revisit at 8+ |
| Contextual in-copy links  | **zero** — every internal link is a nav item, card, chip or footer link                        |
| Hub prose on `/services/` | none — the index is a grid of cards with no linking prose                                      |
| Breadcrumbs               | visible on 7 pages, marked up on 5                                                             |
| Location silo             | doesn't exist — plan the mesh before building it                                               |

## 1. Header

`navLinks` in `lib/site.ts` reaches `/`, `/services/`, `/about/`, `/reviews/`, `/contact/`. Individual
services are two hops away. With only four services, a dropdown exposing them is cheap and worth it.

Constraints if you build one:

- `Navbar.tsx` is already `"use client"` for the mobile toggle; keep any new state in the same leaf and
  don't push more of the tree client-side.
- Keyboard-operable: `aria-expanded`, `aria-controls`, **Escape closes**, focus returns to the trigger.
  The existing mobile menu has `aria-expanded` and `aria-controls` but **no Escape handler, no focus
  trap, no scroll lock** — fix that in the same pass rather than copying it.
- On mobile, nest the service list inside the existing disclosure rather than adding a second pattern.

## 2. Footer

Already renders every service, every nav link and both legal pages — **no `slice()`, no truncation**.
Don't add one. The two things worth changing:

- The social icons link to `site.social`, which is `https://www.facebook.com/` and
  `https://www.instagram.com/`. Those are platform homepages. Fix the data or remove the icons
  (`/local-seo-il` §2).
- There is no NAP block beyond the region name. Phone, email and hours are all there; the service area
  is text. That is appropriate for a business with no address — just keep it rendered from `lib/site.ts`.

## 3. Contextual in-copy links — the real gap

**Zero exist today.** Every internal link on the site is a card title, a nav label, a chip or a footer
item, so the entire internal anchor-text signal is nav boilerplate.

As service copy deepens (see `/new-service`), each service page should carry 2–3 links **inside the
prose** with descriptive Hebrew anchor text:

- ✅ `<Link href="/services/insurance-reports/">דו״ח תרמוגרפי לחברת הביטוח</Link>`
- ✅ `<Link href="/services/moisture-detection/">איתור מוקד הרטיבות עצמו</Link>`
- ❌ "לחצו כאן", "למידע נוסף", a bare URL

Natural edges that don't exist yet: water-leak-detection → insurance-reports (every leak claim needs
one); moisture-detection → water-leak-detection (a damp wall is often a pipe); electrical-thermography →
the other three (same camera, same visit, different subject).

Copy lives in `lib/services.ts`, so an in-copy link means either a small `Link`-aware block type or a
dedicated `relatedInline` field — decide once and apply it to all four, rather than one page growing a
bespoke shape.

## 4. Hub prose on `/services/`

`/services/` is the natural hub and currently carries ~340 unique words as a card grid. Give it an
intro that links contextually into its children and explains **how the four services relate** — one
camera, one visit, four different questions it can answer. Content-standards §1 sets a 250-word floor
for index pages; the value here is the anchor text, not the word count.

## 5. Breadcrumbs — one array, two consumers

`components/PageHero.tsx` renders `crumbs` on 7 pages; only 5 pages call `breadcrumbJsonLd`. Worse,
where both exist the same trail is typed **twice** with different key names (`href` for the component,
`url` for the builder). Emit the markup from `PageHero` itself so they cannot drift — see
`/schema-structured-data`.

## 6. Plan the location mesh before building it

When location pages land (`/new-city`), the mesh is part of the page, not a follow-up:

- Every location page links to all 4 services with descriptive anchors.
- Every location page links to 2–4 **nearby** locations, driven by a `nearby` field set from real
  geography — and the edge is **bidirectional**; a one-way link is a modelling error.
- Every service page links to the locations that exist.
- The footer gets a locations column, unsliced.

Do not ship a location page that nothing links to. That is how orphans are born, and this site
currently has none.

## Zero-orphan check

```bash
find out -name index.html | sed 's|^out||; s|index.html$||' | sort > /tmp/routes.txt
grep -rho 'href="/[^"]*"' out --include=index.html | sed 's|href="||; s|"$||' | sort -u > /tmp/linked.txt
comm -23 /tmp/routes.txt /tmp/linked.txt
```

Expected output: exactly `/404/` and `/_not-found/`. Anything else printed is a regression.

## Checklist

- [ ] All 4 services reachable within one hop of the header.
- [ ] Footer renders every service and every location — no `slice`.
- [ ] Every service page carries 2–3 contextual in-copy links with descriptive anchors.
- [ ] `/services/` has hub prose that links into its children.
- [ ] Breadcrumbs render **and** emit `BreadcrumbList` from the same array.
- [ ] Every new location page has inbound links before it ships.
- [ ] The orphan check prints only the two 404 artifacts.

## Gotchas

- All internal links need the trailing slash (`trailingSlash: true`), or they redirect and waste a hop.
  Note `app/services/[slug]/page.tsx` links related services as `/services/${item.slug}` **without** the
  trailing slash — Next normalises it, but the emitted `href` is what a crawler follows. Worth fixing.
- Adding links to a thin page doesn't fix the thin page. Depth first (`/new-service`), then the mesh.
- Anchor text is a ranking signal; card titles and nav labels are the weakest form of it.
