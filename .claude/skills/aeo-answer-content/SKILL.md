---
name: aeo-answer-content
description: Answer-engine and LLM-citability layer for thermoleak — question-form H2s with a 40–60 word extractable answer first (on all four services, all 12 city pages, /pricing/ and three guides), definition and comparison blocks, the hand-maintained llms.txt and the parity check that keeps it inside the sitemap, verifying the live Cloudflare-served robots.txt rather than trusting app/robots.ts, and the freshness signals the guides now carry. Use when optimizing a page to be quoted by AI Overviews, ChatGPT or Perplexity. Triggers "AEO", "GEO", "AI Overviews", "llms.txt", "will an LLM cite this", "answer block", "AI crawlers".
---

# Answer-engine optimization

The question is not "does this rank" but **"can an assistant reach this page, parse it, and prefer to
quote it?"** Three separate gates, in that order.

## Gate 1 — reachability. Verify, don't assume.

`app/robots.ts` emits a blanket allow. **That is not proof of what serves.** The zone is proxied by
Cloudflare, which can prepend a **managed robots.txt** at the edge:

```
User-agent: *
Content-Signal: search=yes, ai-train=no, use=reference
ClaudeBot: Disallow: /        GPTBot: Disallow: /
Google-Extended: Disallow: /  CCBot: Disallow: /
Bytespider, Amazonbot, Applebot-Extended, meta-externalagent: Disallow: /
```

**No repo change overrides that** — it is injected at the edge. **Status here: the block was live
until 2026-08-17, when the owner turned the toggle off; the live file now serves the repo's blanket
allow (verified against production).** Gate 1 is open — but it is a dashboard toggle that can flip
back without any deploy, so re-verify at the start of every AEO pass:

```bash
curl -sS https://thermoleak.co.il/robots.txt
diff <(curl -sS https://thermoleak.co.il/robots.txt) out/robots.txt
```

If a managed block ever reappears, every AEO recommendation below is capped until the zone setting
changes again (Cloudflare dashboard → the zone → AI Crawl Control / managed robots.txt). It is the
owner's call and the owner's action — document it, never assume.

Understand the three permissions separately, because they have different consequences:

- **`ai-train`** — may the content train a model.
- **Retrieval bots** (OAI-SearchBot, PerplexityBot, ClaudeBot) — may an assistant fetch the page to
  answer a live question. **This is the one that produces citations.**
- **`use=reference`** — may the content be referenced with attribution.

Blocking training while allowing retrieval is a coherent position. Blocking everything means the site
cannot be cited at all.

## Gate 2 — extractability

An answer engine lifts a **contiguous, self-contained span**. Structure for that.

**The answer block** — every service page, location page and article opens with one:

- Directly under a **question-form heading** (`<h2>כמה זמן לוקחת בדיקת איתור נזילות?`).
- **40–60 words.** Shorter reads thin; longer stops being liftable.
- **Complete in the first sentence.** No "there are several factors" preamble.
- Self-contained — no pronouns pointing outside the block, because that is how it gets quoted.
- Contains the concrete number, range or duration where one exists.

```
## כמה זמן לוקחת בדיקת איתור נזילות?
ברוב הדירות הבדיקה אורכת כשעה, ובסיומה תדעו מהיכן מגיעה הנזילה. הסריקה מתבצעת במצלמה תרמית ואינה
דורשת שבירת קירות או ריצוף. בנכסים גדולים או כשיש כמה מוקדים חשודים הבדיקה עשויה להימשך זמן נוסף.
```

**This shipped 2026-08-17 and 2026-08-24.** Every service page, every city page, `/pricing/` and every
guide opens with an answer block: `answer: ServiceFaq` on `Service` (`lib/services.ts`), `answer:
{ q, a }` on `Location` (`lib/locations.ts`), `pricing.answer` (`lib/pricing.ts`) and a
`{ kind: "answer" }` block on each `Article` (`lib/articles.ts`). On every one of them the same q/a also
feeds the page's `FAQPage` node — city pages last, in Sprint 6 (`e6d4111`, 2026-10-28, closing AEO-5),
so each city page emits 3 `Question`s — and the visible answer and the marked-up answer are the same
string by construction.

So the job here is **matching the shipped pattern, not introducing it** — and holding the 40–60 word
band, which is the part that drifts. Measure the words; don't eyeball it.

Other liftable shapes worth using: a **definition** ("בדיקה תרמוגרפית היא…"), a **comparison table**
(תרמוגרפיה מול איתור אקוסטי מול מד לחות — what each detects, cost, when it fails), and a **spec list**
(which wall and floor types the method works on).

**Rendering rules:** the answer must be in the HTML at first paint — not behind a tab, not
client-fetched. This site already passes on FAQs: both `components/Faq.tsx` and the per-service FAQ
blocks use native `<details>/<summary>`, so every answer ships in the DOM with **zero JavaScript**.
That is the strongest AEO asset the site has. Keep that property in anything new.

## Gate 3 — worth citing

An assistant picks the source that answers most precisely. Generic reassurance loses to a competitor
with a number. This category rewards technical honesty. Half of it now ships (backlog §6.6):

✅ **Published:**

- **What a thermal camera actually sees** — it images **surface temperature**, not water. The guide
  `/guides/what-a-thermal-camera-sees/` carries this, and every service page carries a `limits` block
  saying plainly where the method fails. This is the site's strongest citable asset; don't dilute it.
- **תרמוגרפיה מול איתור אקוסטי מול מד לחות** — the three-method comparison table in
  `/guides/find-leak-without-breaking/` (what each suits, what each cannot do).
- **What changes the price of a visit** — `/pricing/` (the factors block) plus
  `/guides/leak-detection-cost/` and its tables.

❌ **Still unwritten** — these are the remaining gate-3 topics, and where a new guide should go:

- **Why the damp stain is usually not directly beneath the leak** — water tracks along pipes, slabs and
  porous walls. Fragments exist inside two existing pages, but no page owns the question.
- **What an insurer actually requires in a report**, and what gets a claim rejected. One sentence in a
  guide today; `/services/insurance-reports/` is the natural home for the full treatment.
- **Electrical thermography intervals.** The "under load" point and hotspot severity are already on
  `/services/electrical-thermography/`; how often a panel should be rescanned is not.

These are also the Tier-3 keyword targets in `docs/keyword-map.md` §2 and the natural spine of the
`/guides/` hub. One genuinely useful comparison table earns more citations than ten reassuring pages.

## Freshness and authorship

Assistants discount undated, unattributed content. The three guides carry all three signals:
`datePublished`, `dateModified` and a **real, confirmed** byline — רונן דהן, approved in
`docs/business-facts.md` §A. `app/sitemap.ts` derives each guide's `lastModified` from
`article.dateModified`, so the dates are a live signal rather than decoration.

Two standing rules:

- **Bump `dateModified` whenever you substantively edit an article.** Nothing enforces it, and the
  sitemap will keep advertising the old date. Same for the hand-maintained per-route dates in
  `app/sitemap.ts`.
- **Never invent an author.** `author` is deliberately **optional** on `Article`, so an article by
  someone unnamed publishes unattributed rather than borrowing a name. A fabricated byline is a worse
  trust signal than an absent one, and this site already paid to remove six fabricated customers.

## Entity consistency

An assistant resolves "טרמוליק" to an entity by cross-referencing sources. **`sameAs` is empty**, and
that is deliberate: the two platform-homepage links that used to sit there looked like corroboration
and provided none, and they were removed 2026-08-17. So there is currently **no off-site source a
visitor or an assistant can check** — that is the top open trust gap, blocked on a real Google Business
Profile URL (`docs/business-facts.md` §B), not a defect to re-report each pass. Name, phone, service
area and description must be identical across the schema, the visible copy, and every off-site profile
once they exist. See `/local-seo-il` §2.

## llms.txt

`public/llms.txt` exists (added 2026-08-17, the day Gate 1 opened) — who the business is, the
service list, canonical URLs for the key answers, contact, and the service area. Keep it short,
factual and in sync with `lib/site.ts` when facts change; it is a pointer file, not a second
website.

It covers both silos: the three guides and all 12 city URLs are listed. `npm run check:sitemap` fails
on any URL it advertises that `sitemap.xml` lacks (2026-10-28: "llms.txt 29 URL(s), all live"), but it
cannot see an omission — so keep it level with `out/sitemap.xml` by hand: every indexable URL should
either appear in `llms.txt` or be excluded on purpose, with the reason written down, edited in the
same commit as the route.

## Checklist

- [ ] Live `robots.txt` **fetched** and the AI-crawler stance recorded, not assumed.
- [ ] Every service, city, guide and `/pricing/` opens with a 40–60 word answer block under a
      question heading — **counted**, not eyeballed.
- [ ] Answers ship in the HTML at first paint (native `<details>`, never client-conditional).
- [ ] Each answer is comprehensible with zero surrounding context.
- [ ] At least one comparison or limits table exists that a competitor doesn't have.
- [ ] Articles carry `datePublished`, `dateModified` and a real named author (or none at all).
- [ ] `dateModified` bumped if the article's content changed in this commit.
- [ ] `public/llms.txt` published, accurate, and covering every silo in `sitemap.xml`.

## Gotchas

- Never fabricate dates, authors or data to look authoritative.
- Never mark up an answer in `FAQPage` that isn't rendered on the page.
- A blocked crawler makes perfect on-page AEO worth nothing. Gate 1 first, always.
- An unsourced `aggregateRating` is an AEO liability too — an assistant that repeats it exposes both
  itself and the business. The site's rating, reviews and stats were removed 2026-08-17 and are at zero
  in the export; that is the correct state, not an outstanding task.
