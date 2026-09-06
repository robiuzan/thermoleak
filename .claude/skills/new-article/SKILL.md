---
name: new-article
description: Add a Hebrew guide to the knowledge hub at /guides/[slug]/ — appending to the typed block model in lib/articles.ts, the confirmed byline and real dates, Article + BreadcrumbList + FAQPage derived from the blocks, the answer-block opening, and the links into the services. Use when adding editorial content for topical authority and AEO. Triggers "write an article", "blog post", "knowledge hub", "מדריך", "topical authority", "guide".
---

# Publish an article

**Read this first: `/guides/` ships. Three articles are live — `what-a-thermal-camera-sees`,
`find-leak-without-breaking` and `leak-detection-cost`, from sprint 2. Your task is to append a fourth
entry to the `articles` array in `lib/articles.ts`. The hub, the dynamic route, the block renderer, the
schema builders and the sitemap entry all exist and pick up a new entry automatically.**

This category is unusually well suited to editorial: leak detection is a subject where the honest
technical answer is genuinely useful, genuinely hard to find, and genuinely convincing. A correct
explanation of what a thermal camera **cannot** see will out-convert a page of reassurance — which is
exactly the position the three shipped guides take, and the one a fourth has to keep.

## Route

`/guides/` (index) and `/guides/[slug]/` (detail), both built. English path segment with Hebrew content,
consistent with `/services/` and `/locations/` — this site does **not** use Hebrew URL segments, so
don't introduce them here.

**You do not write a route for a new article.** `app/guides/[slug]/page.tsx` derives
`generateStaticParams()` from `articleSlugs`, resolves the entry with `getArticle()` + `notFound()`,
and generates its own metadata from `title` and `description`. The Next 16 `params: Promise<…>`
signature matters only if you are editing that file, which adding an article does not require. If you
ever do, check `node_modules/next/dist/docs/` first — `AGENTS.md` warns this is not the Next.js you
know.

## Typed blocks, not MDX

Articles live in **one file, `lib/articles.ts`** — a single typed array, matching how every other
content type in this repo works (`lib/services.ts`, `lib/faqs.ts`, `lib/locations.ts`). There is no
`lib/articles/` directory; do not create one.

```ts
export type Block =
  | { kind: "paragraph"; text: string }
  | { kind: "heading"; text: string } // always renders as <h2> — no level field
  | { kind: "list"; ordered?: boolean; items: string[] }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "answer"; q: string; a: string } // → the AEO block, and the FAQPage
  | { kind: "faq"; items: { q: string; a: string }[] } // → the rest of the FAQPage
  | { kind: "callout"; tone: "note" | "warn"; text: string };

export interface Article {
  slug: string;
  title: string; // the <h1> AND the metadata title — a question, verbatim
  description: string; // meta description, 150–160 chars
  datePublished: string; // ISO
  dateModified: string; // ISO
  author?: string; // רונן דהן — confirmed, business-facts §A. Optional by design; never invented.
  blocks: Block[];
  relatedServices: string[]; // service slugs
}
```

**Only these seven kinds render.** `components/ArticleBody.tsx` switches on `kind` and returns `null`
for anything else, so an invented kind disappears silently and the build stays green. There is no
`image` block and no `cta` block — the route appends the related-services strip and `ContactCTA`
itself.

Why typed blocks rather than MDX: no new dependency and no second build step in a repo whose build is
the release gate; strict TS stays meaningful; and — the real reason — **`FAQPage` and the answer block
are derived from the `answer` and `faq` blocks** by `articleFaqs()`, so the schema cannot drift from
the copy as it is edited. That is the same property the `<details>`-based FAQs give the service pages.

## Structure

1. `title` = the question, verbatim. It renders as the `<h1>` and as the metadata title.
2. An **`answer` block first in the `blocks` array** — the complete answer before any preamble, 40–60
   words (`docs/content-standards.md` §5). It is the first thing in the DOM and the first thing an
   answer engine lifts.
3. Body in question-form `heading` blocks. Each section answerable on its own.
4. At least one `table` or `list` a reader would screenshot — a method-comparison matrix, a cost
   breakdown, a "what the camera sees vs what it can't" table. This is what makes the page citable
   rather than merely correct.
5. A `faq` block, 3–5 questions. **`articleFaqs()` reads the first `answer` block and the first `faq`
   block only** — a second of either renders on the page but never reaches the schema.
6. `author`, `datePublished`, `dateModified` — real values, and `dateModified` is a live signal (see
   Steps 5).
7. Links into the services via `relatedServices`. See the Gotchas: the block model has **no inline-link
   kind**, so a true contextual link inside a paragraph is not something you can author today.

**900-word floor.** Depth is the point; a 900-word article that repeats a service page is worse than no
article, because it cannibalises the page that converts. For calibration, measured 2026-09-06 with the
`docs/content-standards.md` §1 command: the three shipped guides emit 891, 939 and 1,032 raw words;
site chrome measures 116 words (from `out/404.html`) and the shared `ContactCTA` roughly 113 more. Net
of both, **none of the three clears 900** — so write the fourth to clear the floor on its own body
copy, and don't cite the shipped three as proof the bar is already met.

## Schema

`articleJsonLd()` emits `Article` with `headline`, `description`, `url`, `datePublished`,
`dateModified`, `inLanguage`, `mainEntityOfPage`, `publisher` (`@id` → the business node
`https://thermoleak.co.il/#business`) and `author` as a `Person` **only when `author` is set**. It
emits no `image` — the model carries no hero-image field. `BreadcrumbList` comes from `PageHero`
(`בית › מדריכים › {title}`), and `FAQPage` from `articleFaqs()`. See `docs/schema-graph.md` §6.

Both `<JsonLd>` calls are already in `app/guides/[slug]/page.tsx`. **A new article adds no schema
code.** If you find yourself hand-assembling a `<script>` tag, stop.

**The byline is confirmed.** רונן דהן is on file (`docs/business-facts.md` §A) and is the author of all
three shipped guides. `author` stays optional on purpose: an article by someone else must set its own,
and an article with no known author publishes **unattributed rather than borrowing a name**. **Never
invent a byline.** A fabricated author is a worse trust signal than no author, and this site already
carries the cost of six fabricated customers.

## Topic selection

Three of the six high-value openers are written. **Shipped — do not rewrite:**

- מה מצלמה תרמית באמת רואה — ומה היא לא יכולה לראות (`what-a-thermal-camera-sees`)
- איך מאתרים נזילה בקיר בלי לשבור — השיטות והמגבלות שלהן (`find-leak-without-breaking`)
- כמה עולה איתור נזילות ומה משפיע על המחיר (`leak-detection-cost`)

**The queue**, from `docs/keyword-map.md` §2 Tier 3 and `docs/seo-geo-aeo-strategy.md`:

- למה כתם הרטיבות כמעט אף פעם לא נמצא מעל הנזילה — no page treats this today; it appears only as a
  single location claim.
- מה חברת הביטוח באמת דורשת בדו״ח נזקי מים → links down to `/services/insurance-reports/`.
- כל כמה זמן צריך בדיקה תרמוגרפית ללוח חשמל — ולמה היא נעשית תחת עומס → links down to
  `/services/electrical-thermography/`.

The last two already have **compressed** coverage in the corresponding service's `answer` and `limits`
blocks. The guide must go materially deeper than that, not restate it — otherwise it cannibalises the
page that converts. Each should answer the question **better than the service page does**, then link to
the service page for the commercial action.

## Steps

1. Pick a topic from the queue; confirm no existing page already targets it (grep `lib/services.ts`,
   `lib/articles.ts` and `lib/locations.ts`).
2. **Append the entry to the `articles` array in `lib/articles.ts`.** Nothing to register —
   `articleSlugs` and `getArticle()` both derive from the array.
3. Write to the structure above; every claim either free to state or 🔶 (`docs/content-standards.md`
   §6). Prices, certifications, turnaround times and job counts are **not** free to state.
4. Set `relatedServices` to real service slugs. `getService()` drops an unknown slug silently, so a
   typo costs you the link with no error.
5. **No sitemap edit.** `app/sitemap.ts` maps over `articles` and uses each article's own
   `dateModified` — which is why that date has to be honest. Bump it when the content meaningfully
   changes, never on a cosmetic edit.
6. Add an inbound link from a related page. The hub lists the article automatically and `/guides/` is
   in `navLinks` (so it is in the header and the footer on every route), but **no service page links
   into a guide today** — that is the mesh gap worth closing while you are here (`/internal-linking`).
7. `npm run lint && npm run build`, then `npm run check:sitemap`; verify the route exists in `out/` and
   in `out/sitemap.xml`.

## Gotchas

- **Never restate a price as a literal.** `lib/articles.ts` hardcodes `₪450` in the
  `leak-detection-cost` FAQ where `lib/pricing.ts` interpolates `site.priceFrom` for the same sentence.
  That is a live golden-rule-2 defect, **not** the pattern to copy — interpolate from `lib/site.ts`.
  (And the number itself is still 🔶 unconfirmed: `docs/business-facts.md` §C.)
- **There is no inline-link block.** `paragraph` renders plain text, so an anchor inside prose is not
  authorable in the current model. The only links a guide emits are the `relatedServices` strip and the
  auto-generated "מדריכים נוספים" list. If contextual in-copy links are the goal, that is a renderer
  change to propose — not something to fake with a bare URL in a `paragraph`.
- **The "מדריכים נוספים" list is every other article, unfiltered.** At three that is a two-item list;
  as the hub grows it needs relevance and a slice, the same way the service related-strip will.
- An unrecognised block `kind` renders nothing and the build stays green. If a section vanished from
  the page, check the `kind` spelling before anything else.

## Checklist

- [ ] ≥900 unique words; answers the question better than any existing page.
- [ ] `answer` block first in `blocks`, 40–60 words, complete in the first sentence.
- [ ] Question-form `heading` blocks; exactly one `<h1>` (it comes from `title`).
- [ ] At least one table or comparison worth citing.
- [ ] Real author, real dates — never invented; `dateModified` reflects actual content change.
- [ ] One `answer` block and one `faq` block, so the whole FAQ reaches `FAQPage`.
- [ ] `relatedServices` slugs all resolve; an inbound link added from a related page.
- [ ] No price, certification or turnaround literal — interpolated or 🔶.
- [ ] Present in `out/` and `out/sitemap.xml`; `npm run check:sitemap` passes.
- [ ] Title carries the brand exactly once (the layout template appends it — don't write it).
