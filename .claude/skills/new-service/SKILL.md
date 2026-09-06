---
name: new-service
description: Add or deepen a service page the data-driven way — append to the services array in lib/services.ts so the route, the grid, the footer column, the pricing table, the form select, cross-links, schema and the sitemap all update automatically, and fill every depth field the shipped four already carry. Use when adding a service or deepening an existing one. Triggers "add a service", "new service page", "deepen the service copy", "per-service FAQ", "service page is thin".
---

# Add or deepen a service page

**Read this first: the four shipped service pages already carry the full depth model.** Each has its
own `answer` block, `intro`, `benefits`, `steps`, an honest-`limits` section and contextual `related`
links — the retrofit that this skill used to prescribe was completed in sprint 2. A fifth service is a
legitimate ask; **the job is to match that bar, not to invent it.**

Measured 2026-09-06 with the `docs/content-standards.md` §1 command, the four pages emit 565–661 raw
words each (site chrome measures 116 words on `out/404.html`, and the shared `ContactCTA` roughly 113
more — subtract before comparing to the 450 floor). Re-measure rather than quoting a number from any
doc, including this one.

## The data model — one array drives everything

This is the shipped interface — copy it from `lib/services.ts`, not from memory. Every field is
required:

```ts
// lib/services.ts
export interface Service {
  slug: string; // ASCII, kebab-case — matches the /services/{slug}/ route
  icon: LucideIcon; // imported from lucide-react at the top of the file
  image: string; // path in /public — all four shipped services use an SVG illustration
  title: string; // short, for nav/cards/footer/form select
  h1: string; // the page heading AND the metadata title
  tagline: string; // one-line value statement, shown under the H1
  summary: string; // card description AND the meta description
  answer: ServiceFaq; // ⚠️ a { q, a } OBJECT, not a string — the AEO block, 40–60 words
  intro: string[]; // page intro paragraphs
  forWho: string; // audience sentence
  benefits: string[]; // the "היתרונות עבורכם" grid
  steps: ServiceStep[]; // the numbered "איך התהליך עובד" list
  limits: ServiceLimits; // the honest "what this method cannot do" block
  related: ServiceRelated; // the in-copy cross-link sentence
  priceModel: string; // the sidebar price paragraph
  faqs: ServiceFaq[]; // 3+ — rendered as <details> AND emitted as FAQPage
  keywords: string[]; // metadata keywords
}

export interface ServiceStep {
  title: string;
  desc: string;
}
export interface ServiceFaq {
  q: string;
  a: string;
}
export interface ServiceLimits {
  title: string;
  intro?: string;
  items: string[];
  outro?: string;
}
export interface ServiceRelated {
  lead: string;
  links: { label: string; href: string }[];
}
```

**`answer` is `ServiceFaq`, not `string`.** `app/services/[slug]/page.tsx` renders `answer.q` as the
heading and `answer.a` as the body, then folds the whole object into `faqEntities` for the `FAQPage`
graph. Writing `answer: "…"` is a type error the build will catch, but it is a wasted cycle.

Note `h1` doubles as the metadata `title` and `summary` doubles as the meta `description`. Write both to
serve both jobs — `h1` under ~60 rendered characters with the brand appended, `summary` at 150–160
characters. See `/seo-metadata`.

`icon` must be a real `LucideIcon` imported at the top of the file; `getService()` and `serviceSlugs`
are derived from the array, so nothing else needs registering.

## What follows automatically

Adding an entry gives you, with no other edits: the `/services/{slug}/` route via
`generateStaticParams` · the card on `/` (`ServicePillars`) and on `/services/` · the row on
`/pricing/`, which renders `priceModel` · the footer services column · the `<select>` in `ContactForm`
· the related-services strip on every other service page · the sitemap entry via `serviceSlugs` ·
`Service` + `FAQPage` + `BreadcrumbList` JSON-LD.

That is a well-built data layer. Use it rather than adding a bespoke page.

**What does NOT follow automatically** — two hand-maintained lists a fifth service is silently absent
from until you edit them:

- `serviceChooser.cases` in the same file. It is the homepage symptom-to-service decision aid, and each
  case is a hand-written symptom with a literal `href`. A new service needs its own case, written from
  the symptom the customer arrives with — not from the service name.
- `public/llms.txt`, which lists the four `/services/` URLs by hand under `## שירותים / Services`.

## The depth bar

450 unique words, and the doorway test applies: **swap the service name — does the page still read
correctly?** If yes, it isn't a service page, it's a template.

What creates depth in this category — and what every competitor omits. The four shipped pages already
do these; read one before writing, and match it:

- **What the method detects and what it cannot.** A thermal camera images **surface temperature**, not
  water. Say what that means in practice: it finds a leak by the thermal pattern moisture creates, so a
  deep slab leak under thick screed, a well-insulated wall, or a wall already at ambient temperature can
  hide one. This is the `limits` field, and it is filled on all four — see
  `lib/services.ts` → `limits.title` `מה מצלמה תרמית לא רואה` for the model.
- **What the visit actually includes** — how long, what gets scanned, what the customer needs to do
  beforehand (e.g. run the system, avoid direct sun on the facade), what they receive at the end.
- **What changes the price** — property size, number of suspected sources, access, whether a report is
  needed. This lives in `priceModel`.
- **What happens next** — the site is explicit that it locates rather than repairs. Saying who does the
  repair, and how the handover works, removes a real purchase objection.
- **Failure modes** — when a first visit is inconclusive, and what happens then. The
  `לא מצאנו — לא שילמתם` guarantee now has **confirmed** scope, exclusions and a no-call-out-fee term,
  published 2026-08-24 (business-facts §C) and rendered on `/pricing/` by
  `components/GuaranteeTerms.tsx`. Use the approved wording; do not paraphrase it into something
  broader.

## Steps

1. Add the entry to `services` (new service) — array order drives grid and footer order, so put it
   where it belongs commercially.
2. Fill every field. `summary` and `h1` do double duty as metadata; write them for both.
3. Write the `answer` block: **40–60 words under a question-form `q`** (`docs/content-standards.md`
   §5). The route already renders it first in the DOM, above `intro`, and folds it into the `FAQPage`
   graph — so the `q` has to be a question a person would actually type, and the `a` has to be complete
   in its first sentence.
4. Write **3–5 service-specific FAQs**. They render in native `<details>/<summary>` and are emitted as
   `FAQPage`, so the copy and the schema come from one place — keep it that way.
5. Add a new image to `public/images/services/`. Match the existing style (SVG illustration). It is
   rendered decorative with `alt=""` on purpose — an `alt` repeating the H1 made a screen reader
   announce the heading twice (backlog §11.5) — so the illustration must carry no information the copy
   lacks.
6. Fill `related`: a `lead` sentence plus 2–3 links to sibling services with descriptive Hebrew anchors
   (`/internal-linking`). All four shipped services do this; a bare "see also" list is not the pattern.
7. Confirm the metadata: `h1` as the title with **no second brand token** (the layout template appends
   it), `summary` as the description, `alternates.canonical` with a trailing slash.
8. Add the `serviceChooser` case and the `public/llms.txt` line — the two lists that do not derive.
9. `npm run lint && npm run build`, then `npm run check:sitemap`.
10. Verify the route exists in `out/` **and** in `out/sitemap.xml`, and that `<title>` carries the brand
    exactly once.

## Gotchas

- **`params` is a Promise in Next 16.** `app/services/[slug]/page.tsx` already handles it; don't
  hand-write a new dynamic route from memory. Check `node_modules/next/dist/docs/`.
- A new service changes `services.length`, which changes the related-services strip on **every** service
  page — currently `filter(s => s.slug !== current)` returns all others. At 4 that's a 3-card row; at 8
  it needs a relevance map and a slice.
- `ContactForm`'s `initialState` uses `services[0].title`, so reordering the array changes the form's
  default selection.
- **Never restate a price as a literal.** `priceModel` on two shipped services hardcodes `₪450` instead
  of interpolating `site.priceFrom` the way `lib/pricing.ts` does — a live golden-rule-2 defect, not the
  pattern to copy. Interpolate, and remember the number itself is still 🔶 unconfirmed
  (`docs/business-facts.md` §C).
- Never invent durations, materials, certifications, equipment models or prices. Unverified →
  `// 🔶 confirm` + `docs/business-facts.md`.
- Four services with genuine depth beat eight that paraphrase each other.

## Checklist

- [ ] Entry complete — every field including `answer`, `limits` and `related` — with a valid
      `LucideIcon` and an SVG in `public/images/services/`.
- [ ] `answer` is a `{ q, a }` object, 40–60 words, complete in the first sentence.
- [ ] ≥450 unique body words, re-measured rather than assumed.
- [ ] `limits` states what the method cannot detect, not only what it can.
- [ ] 3–5 service-specific FAQs, all rendered on the page.
- [ ] Price language interpolates `site.priceFrom`; no literal.
- [ ] `related` carries a lead sentence and 2–3 descriptive in-copy anchors.
- [ ] Passes the service-name substitution test.
- [ ] `Service` + `FAQPage` + `BreadcrumbList` emitted.
- [ ] `serviceChooser` case added; `public/llms.txt` updated.
- [ ] Present in `out/` and `out/sitemap.xml`; `npm run check:sitemap` passes; `<title>` carries the
      brand exactly once.
