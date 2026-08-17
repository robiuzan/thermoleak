---
name: new-article
description: Publish a Hebrew knowledge-hub article under /guides/[slug]/ — the typed block model, author attribution and dates, Article + BreadcrumbList + FAQPage schema derived from the blocks, the answer-block opening, and internal links into the services. Use when adding editorial content for topical authority and AEO. Triggers "write an article", "blog post", "knowledge hub", "מדריך", "topical authority", "guide".
---

# Publish an article

The site has **no editorial surface at all** — no blog, no guides, no route. That is the whole
topical-authority and AEO gap in one line. A `/guides/` hub is where the Tier-3 questions in
`docs/keyword-map.md` §2 get answered properly.

This category is unusually well suited to it: leak detection is a subject where the honest technical
answer is genuinely useful, genuinely hard to find, and genuinely convincing. A correct explanation of
what a thermal camera **cannot** see will out-convert a page of reassurance.

## Route

`/guides/` (index) and `/guides/[slug]/` (detail). English path segment with Hebrew content, consistent
with `/services/` and `/about/` — this site does **not** use Hebrew URL segments, so don't introduce
them here.

Fully static-export compatible: `generateStaticParams` + the `notFound()` narrowing pattern. **Params
are a Promise in Next 16** — copy the signature from `app/services/[slug]/page.tsx`:

```ts
interface PageProps { params: Promise<{ slug: string }> }
const { slug } = await params;
```

Check `node_modules/next/dist/docs/` before reaching for any other framework API; `AGENTS.md` warns
this is not the Next.js you know.

## Typed blocks, not MDX

Articles live in `lib/articles/<slug>.ts` as typed data, matching how every other content type in this
repo works (`lib/services.ts`, `lib/faqs.ts`, `lib/reviews.ts` are all typed arrays):

```ts
export type Block =
  | { kind: "paragraph"; text: string }
  | { kind: "heading"; level: 2 | 3; text: string }
  | { kind: "list"; ordered?: boolean; items: string[] }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "answer"; q: string; a: string }            // → the AEO block
  | { kind: "faq"; items: { q: string; a: string }[] }  // → FAQPage
  | { kind: "image"; src: string; alt: string; caption?: string }
  | { kind: "callout"; tone: "note" | "warn"; text: string }
  | { kind: "cta"; text: string };

export interface Article {
  slug: string;
  title: string;
  description: string;
  datePublished: string;   // ISO
  dateModified: string;    // ISO
  author: string;          // a real named person — business-facts §A
  heroImage?: { src: string; alt: string };
  blocks: Block[];
  relatedServices: readonly string[];   // service slugs
}
```

Why typed blocks rather than MDX: no new dependency and no second build step in a repo whose build is
already the release gate (and whose deploy is a git push); strict TS stays meaningful; and — the real
reason — **`FAQPage` and the answer block are derived from the `faq` and `answer` blocks**, so the
schema cannot drift from the copy as it is edited. That is the same property the `<details>`-based FAQs
already give the service pages.

## Structure

1. `<h1>` = the question, verbatim.
2. **An `answer` block within the first 60 words** — the complete answer before any preamble
   (`docs/content-standards.md` §5).
3. Body with **question-form `<h2>`s**. Each section answerable on its own.
4. At least one `table` or `list` a reader would screenshot — a method-comparison matrix, a cost
   breakdown, a "what the camera sees vs what it can't" table. This is what makes the page citable
   rather than merely correct.
5. A `faq` block, 3–5 questions.
6. Author byline, `datePublished`, `dateModified`.
7. 2–3 in-copy links to services with descriptive Hebrew anchors — the site currently has **zero**
   contextual internal links, so every article is an opportunity to fix that.
8. A `cta` block.

**900-word floor.** Depth is the point; a 900-word article that repeats a service page is worse than no
article, because it cannibalises the page that converts.

## Schema

`Article` with `headline`, `description`, `image`, `datePublished`, `dateModified`, `author`
(a `Person` with a **real** name), `publisher` (`@id` → the business node
`https://thermoleak.co.il/#business`), `mainEntityOfPage`. Plus `BreadcrumbList`
(`בית › מדריכים › {title}`) and `FAQPage` derived from the `faq` blocks. See `docs/schema-graph.md` §6.

Add the builders to `lib/jsonld.ts` alongside the existing ones and render them with
`<JsonLd data={…} />` — don't hand-assemble a `<script>` tag.

**The author must be a real named person** — blocked on `docs/business-facts.md` §A. **Never invent a
byline.** A fabricated author is a worse trust signal than no author, and this site already carries the
cost of six fabricated customers.

## Topic selection

Start from `docs/keyword-map.md` §2 Tier 3 — the questions people actually type. High-value openers,
each of which the site can answer better than a competitor:

- מה מצלמה תרמית באמת רואה — ומה היא לא יכולה לאתר (the flagship; nobody publishes this honestly)
- איך מאתרים נזילה בקיר בלי לשבור — השיטות והמגבלות שלהן
- כמה עולה איתור נזילות ומה משפיע על המחיר
- למה כתם הרטיבות כמעט אף פעם לא נמצא מעל הנזילה
- מה חברת הביטוח באמת דורשת בדו״ח נזקי מים
- כל כמה זמן צריך בדיקה תרמוגרפית ללוח חשמל — ולמה היא נעשית תחת עומס

Each should answer the question **better than the service page does**, then link to the service page for
the commercial action.

## Steps

1. Pick a Tier-3 question; confirm no existing page already targets it.
2. Create `lib/articles/<slug>.ts` and register it in an index array.
3. Build `app/guides/page.tsx` and `app/guides/[slug]/page.tsx` (first article only).
4. Write to the structure above; every claim either free or 🔶 (`docs/content-standards.md` §6).
5. Wire `Article` + `BreadcrumbList` + `FAQPage` in `lib/jsonld.ts`.
6. Add the routes to `app/sitemap.ts` — `staticRoutes` is hand-maintained, so a new silo is silently
   missing otherwise (backlog §1.2).
7. Add inbound links from the related service pages, and a nav or footer entry for the hub.
8. `npm run lint && npm run build`; verify the route and the sitemap entry.

## Checklist

- [ ] ≥900 unique words; answers the question better than any existing page.
- [ ] `answer` block in the first 60 words, complete in the first sentence.
- [ ] Question-form `<h2>`s; exactly one `<h1>`.
- [ ] At least one table or comparison worth citing.
- [ ] Real author, real dates — never invented.
- [ ] `Article` + `BreadcrumbList` + `FAQPage` emitted, FAQ derived from the blocks.
- [ ] 3+ contextual internal links with descriptive anchors; inbound links added from related pages.
- [ ] Added to `app/sitemap.ts`; present in `out/` and `out/sitemap.xml`.
- [ ] Title carries the brand exactly once.
