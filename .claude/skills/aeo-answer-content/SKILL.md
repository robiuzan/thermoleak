---
name: aeo-answer-content
description: Answer-engine and LLM-citability layer for thermoleak — question-form H2s with a 40–60 word extractable answer first, definition and comparison blocks, llms.txt, verifying the live Cloudflare-served robots.txt rather than trusting app/robots.ts, and freshness/authorship signals. Use when optimizing a page to be quoted by AI Overviews, ChatGPT or Perplexity. Triggers "AEO", "GEO", "AI Overviews", "llms.txt", "will an LLM cite this", "answer block", "AI crawlers".
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

**No repo change overrides that** — it is injected at the edge, and it is exactly what a sibling zone in
this fleet is currently serving. Whether it is on **here** is an empirical question:

```bash
curl -sS https://thermoleak.co.il/robots.txt
diff <(curl -sS https://thermoleak.co.il/robots.txt) out/robots.txt
```

If a managed block is present, every AEO recommendation below is capped until the zone setting changes
(Cloudflare dashboard → the zone → AI Crawl Control / managed robots.txt). It is the owner's call and
the owner's action — document it, never assume it was done. If it is **absent**, say so plainly; that
is a real advantage over the fleet siblings and worth knowing before investing in answer content.

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

Today **no service page does this.** Each opens with two narrative `intro` paragraphs from
`lib/services.ts` that set context before answering anything. The information is often there — it is
just in the third sentence instead of the first.

Other liftable shapes worth using: a **definition** ("בדיקה תרמוגרפית היא…"), a **comparison table**
(תרמוגרפיה מול איתור אקוסטי מול מד לחות — what each detects, cost, when it fails), and a **spec list**
(which wall and floor types the method works on).

**Rendering rules:** the answer must be in the HTML at first paint — not behind a tab, not
client-fetched. This site already passes on FAQs: both `components/Faq.tsx` and the per-service FAQ
blocks use native `<details>/<summary>`, so every answer ships in the DOM with **zero JavaScript**.
That is the strongest AEO asset the site has. Keep that property in anything new.

## Gate 3 — worth citing

An assistant picks the source that answers most precisely. Generic reassurance loses to a competitor
with a number. This category rewards technical honesty, and none of it is on the site today
(backlog §6.6):

- **What a thermal camera actually sees.** It images **surface temperature**, not water — so it detects
  a leak by the thermal pattern moisture creates, and it therefore has real limits: deep slab leaks,
  well-insulated walls, a wall already at ambient. Saying this plainly is the single most citable thing
  this site could publish, and every competitor avoids it.
- **תרמוגרפיה מול איתור אקוסטי מול מד לחות** — what each detects, what each costs, when each fails.
- **Why the damp stain is usually not directly beneath the leak** — water tracks along pipes, slabs and
  ceilings.
- **What an insurer actually requires in a report**, and what gets a claim rejected.
- **What changes the price of a visit** — property size, number of suspected sources, access.
- **Electrical thermography intervals** — why the scan is done **under load**, and what a hotspot
  severity rating means.

These are also the Tier-3 keyword targets in `docs/keyword-map.md` §2 and the natural spine of a
`/guides/` hub. One genuinely useful comparison table earns more citations than ten reassuring pages.

## Freshness and authorship

Assistants discount undated, unattributed content. The site has **no** `datePublished`, `dateModified`
or author anywhere. Add all three to articles (see `/new-article`), and put a real named person behind
them — blocked on `docs/business-facts.md` §A. **Never invent an author**; a fabricated byline is a
worse trust signal than an absent one, and this site is already carrying the cost of six fabricated
customers.

## Entity consistency

An assistant resolves "טרמוליק" to an entity by cross-referencing sources. With `sameAs` pointing at
`facebook.com` and `instagram.com` homepages, there are no other sources — worse, there are two links
that look like corroboration and provide none. Name, phone, service area and description must be
identical across the schema, the visible copy, and every off-site profile once they exist. See
`/local-seo-il` §2.

## llms.txt

A plain-language map at `public/llms.txt` — who the business is, what it does, the service list, the
service area, canonical URLs for the key answers, and contact. Keep it short and factual; it is a
pointer file, not a second website. Only useful once Gate 1 is confirmed open.

## Checklist

- [ ] Live `robots.txt` **fetched** and the AI-crawler stance recorded, not assumed.
- [ ] Every service page and article opens with a 40–60 word answer block under a question heading.
- [ ] Answers ship in the HTML at first paint (native `<details>`, never client-conditional).
- [ ] Each answer is comprehensible with zero surrounding context.
- [ ] At least one comparison or limits table exists that a competitor doesn't have.
- [ ] Articles carry `datePublished`, `dateModified` and a real named author.
- [ ] `public/llms.txt` published and accurate.

## Gotchas

- Never fabricate dates, authors or data to look authoritative.
- Never mark up an answer in `FAQPage` that isn't rendered on the page.
- A blocked crawler makes perfect on-page AEO worth nothing. Gate 1 first, always.
- An unsourced `aggregateRating` is an AEO liability too — an assistant that repeats it exposes both
  itself and the business.
