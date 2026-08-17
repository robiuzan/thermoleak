---
name: new-service
description: Add or deepen a service page the data-driven way — append to the services array in lib/services.ts so the route, the grid, the footer column, the form select, cross-links, schema and the sitemap all update automatically, and fill the depth fields that take a page past the 450-word floor. Use when adding a service or retrofitting one of the four thin ones. Triggers "add a service", "new service page", "deepen the service copy", "per-service FAQ", "service page is thin".
---

# Add or deepen a service page

**Read this first: all four existing service pages sit at roughly 320–360 unique body words against a
450 floor** (`docs/content-standards.md` §1). They are not templated clones — each has its own `intro`,
`benefits`, `steps` and FAQs, which already puts them ahead of most competitors — but they stop short of
the depth that makes a page rank and get cited. **Deepening the four that exist matters more than adding
a fifth.**

## The data model — one array drives everything

```ts
// lib/services.ts
export interface Service {
  slug: string;          // ASCII, kebab-case — matches the /services/{slug}/ route
  icon: LucideIcon;      // imported from lucide-react at the top of the file
  image: string;         // path in /public — SVG for the three illustrated ones
  title: string;         // short, for nav/cards/footer/form select
  h1: string;            // the page heading AND the metadata title
  tagline: string;       // one-line value statement, shown under the H1
  summary: string;       // card description AND the meta description
  intro: string[];       // page intro paragraphs
  forWho: string;        // audience sentence
  benefits: string[];    // the "היתרונות עבורכם" grid
  steps: ServiceStep[];  // the numbered "איך התהליך עובד" list
  priceModel: string;    // the sidebar price paragraph
  faqs: ServiceFaq[];    // 3+ — rendered as <details> AND emitted as FAQPage
  keywords: string[];    // metadata keywords
}
```

Note `h1` doubles as the metadata `title` and `summary` doubles as the meta `description`. Write both to
serve both jobs — `h1` under ~60 rendered characters with the brand appended, `summary` at 150–160
characters. See `/seo-metadata`.

`icon` must be a real `LucideIcon` imported at the top of the file; `getService()` and `serviceSlugs`
are derived from the array, so nothing else needs registering.

## What follows automatically

Adding an entry gives you, with no other edits: the `/services/{slug}/` route via
`generateStaticParams` · the card on `/` (`ServicePillars`) and on `/services/` · the footer services
column · the `<select>` in `ContactForm` · the related-services strip on every other service page ·
the sitemap entry via `serviceSlugs` · `Service` + `FAQPage` + `BreadcrumbList` JSON-LD.

That is a well-built data layer. Use it rather than adding a bespoke page.

## The depth bar

450 unique words, and the doorway test applies: **swap the service name — does the page still read
correctly?** If yes, it isn't a service page, it's a template.

The current pages are honest but general. What actually creates depth in this category — and what every
competitor omits:

- **What the method detects and what it cannot.** A thermal camera images **surface temperature**, not
  water. Say what that means in practice: it finds a leak by the thermal pattern moisture creates, so a
  deep slab leak under thick screed, a well-insulated wall, or a wall already at ambient temperature can
  hide one. This is the single most valuable paragraph the site could add, and it is missing from all
  four pages.
- **What the visit actually includes** — how long, what gets scanned, what the customer needs to do
  beforehand (e.g. run the system, avoid direct sun on the facade), what they receive at the end.
- **What changes the price** — property size, number of suspected sources, access, whether a report is
  needed.
- **What happens next** — the site is explicit that it locates rather than repairs. Saying who does the
  repair, and how the handover works, removes a real purchase objection.
- **Failure modes** — when a first visit is inconclusive, and what happens then. This is where the
  `לא מצאנו — לא שילמתם` guarantee needs its scope stated (business-facts §C).

## Steps

1. Add the entry to `services` (new service) — array order drives grid and footer order, so put it
   where it belongs commercially.
2. Fill every field. `summary` and `h1` do double duty as metadata; write them for both.
3. Open the rendered page with a **40–60 word answer block** under a question-form heading
   (`docs/content-standards.md` §5). Today every service page opens with narrative `intro` paragraphs
   instead — the fix is a new `answer: string` field on `Service`, rendered above `intro`.
4. Write **3–5 service-specific FAQs**. They render in native `<details>/<summary>` and are emitted as
   `FAQPage`, so the copy and the schema come from one place — keep it that way.
5. Add a new image to `public/images/services/`. Match the existing style (SVG illustration).
6. Add 2–3 contextual in-copy links to sibling services with descriptive Hebrew anchors
   (`/internal-linking` §3) — there are currently **zero** on the site.
7. Confirm the metadata: `h1` as the title with **no second brand token** (the layout template appends
   it), `summary` as the description, `alternates.canonical` with a trailing slash.
8. `npm run lint && npm run build`.
9. Verify the route exists in `out/` **and** in `out/sitemap.xml`, and that `<title>` carries the brand
   exactly once.

## Gotchas

- **`params` is a Promise in Next 16.** `app/services/[slug]/page.tsx` already handles it; don't
  hand-write a new dynamic route from memory. Check `node_modules/next/dist/docs/`.
- A new service changes `services.length`, which changes the related-services strip on **every** service
  page — currently `filter(s => s.slug !== current)` returns all others. At 4 that's a 3-card row; at 8
  it needs a relevance map and a slice.
- `ContactForm`'s `initialState` uses `services[0].title`, so reordering the array changes the form's
  default selection.
- Never invent durations, materials, certifications or prices. Unverified → `// 🔶 confirm` +
  `docs/business-facts.md`.
- Four services with genuine depth beat eight that paraphrase each other.

## Checklist

- [ ] Entry complete, with a valid `LucideIcon` and an image in `public/images/services/`.
- [ ] ≥450 unique body words.
- [ ] Opens with a 40–60 word answer block under a question heading.
- [ ] States what the method cannot detect, not only what it can.
- [ ] 3–5 service-specific FAQs, all rendered on the page.
- [ ] Price language interpolates from one source; no second literal.
- [ ] 2–3 contextual in-copy links with descriptive anchors.
- [ ] Passes the service-name substitution test.
- [ ] `Service` + `FAQPage` + `BreadcrumbList` emitted.
- [ ] Present in `out/` and `out/sitemap.xml`; `<title>` carries the brand exactly once.
