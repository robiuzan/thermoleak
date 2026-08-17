# Content standards — the acceptance bar for Hebrew copy

`hebrew-copywriter`, `new-city`, `new-service` and `new-article` all write against this file.
`seo-auditor` and `eeat-trust-auditor` audit against it.

---

## 1. The depth bar

| Page type                      | Minimum unique body words | Today (measured)  |
| ------------------------------ | ------------------------- | ----------------- |
| Homepage                       | 800                       | ~594 ❌           |
| Service page                   | 450                       | ~322–359 ❌       |
| Location page                  | 350                       | no location pages |
| Article                        | 900                       | no articles exist |
| Index page (`/services/`)      | 250                       | ~340 ✅           |
| About                          | 500                       | ~273 ❌           |
| Reviews                        | 250                       | ~275 ✅ (but see §6) |
| Contact                        | 200                       | ~119 ❌           |
| Legal (privacy, accessibility) | no minimum                | fine as-is        |

**"Unique" excludes site chrome.** The navbar, footer and sticky CTA bar contribute **~110 words** to
every page — measured from the 404 page, which is chrome and nothing else. Subtract it from any raw
count. It also excludes any block rendered identically on another route.

Measure with tags **and scripts** stripped (a naive `sed` that eats everything between the first
`<script>` and the last `</script>` will report zero):

```bash
perl -0777 -pe 's{<script.*?</script>}{}gs; s{<style.*?</style>}{}gs; s{<[^>]*>}{ }gs' out/index.html \
  | tr -s " \t\n" "\n" | grep -c '[^[:space:]]'
```

Word count is a floor, not a goal. A 500-word page that says five specific true things beats a
900-word page that says one thing five ways.

---

## 2. The doorway test — mandatory for every service and location page

> Take the page. Replace the service or city name with a different one. Is it now a correct, publishable
> page for that other subject?
>
> **If yes, it is a doorway page and must not ship.**

The four service pages **currently pass** — each has its own `intro`, `benefits`, `steps` and FAQs. That
is genuinely better than the fleet siblings, and it is the property to protect when adding a fifth.

There are **no location pages**, which is currently an advantage. Sibling sites generated one per city
from a shared paragraph and all of them now fail. To pass, a location page needs at least **three** of
these, and they must be true:

- Named neighbourhoods, streets or landmarks within the city.
- **Housing-stock reality** — the richest seam for this trade: 1960s שיכונים with original galvanised
  plumbing; towers with pressurised systems and shared risers where one leak affects three flats;
  ground-floor units where the leak is in the slab; renovated flats with new plumbing in old walls.
- A real job reference from that city (with permission), or a photo.
- Travel and response reality — how far, whether same-day genuinely applies at that distance.
- A city-specific FAQ that would read oddly anywhere else.
- Local pricing reality if it differs.

If none of those can be said truthfully about a city, **that city does not warrant a page.** Say so in
[business-facts.md](business-facts.md) §E rather than padding.

---

## 3. Required blocks per page type

**Service page**

1. H1 = `service.h1`.
2. **Answer block (§5)** — what this service is, in 40–60 words, under a question-form heading.
   _None of the four pages does this today; each opens with narrative `intro` paragraphs._
3. What it involves, concretely: what gets scanned, how long, what the customer prepares, what they
   receive.
4. **What the method cannot detect.** Non-negotiable for this category — see §7.
5. Benefits and process (`benefits`, `steps`) — already present and specific per service.
6. Price language for this service, from one source; never a second literal.
7. **Per-service FAQ**, 3–5 questions, rendered in native `<details>` and feeding `FAQPage`.
8. 2–3 contextual in-copy links to sibling services with descriptive anchors.
9. CTA.

**Location page** (when the silo is built)

1. H1 = `איתור נזילות ב{prefixed}`.
2. Answer block — do we serve this city, how fast, at what cost.
3. Local substance — at least three items from §2.
4. Full service list with links.
5. Nearby locations (2–4 links, bidirectional).
6. City-specific FAQ, 2–3 questions.
7. CTA.

**Article**

1. H1 = the question, verbatim.
2. Answer block in the first 60 words — the whole answer, before any preamble.
3. Body with question-form `<h2>`s.
4. At least one table, list or comparison a reader would screenshot.
5. Author byline + `datePublished` / `dateModified` — a **real** name (business-facts §A).
6. Links to 2–3 services, in-copy with descriptive anchors.
7. CTA.

---

## 4. Brand voice

- **Tone:** מקצועי · אמין · רגוע · ברור · ענייני. Confident without hype.
- **Person:** "אנחנו" / טרמוליק. Address the reader as "אתם" (plural formal).
- **Reading level:** clear for a homeowner aged 30–70, with real technical depth where it builds trust.
  This audience is often mid-crisis — a damp wall, a water bill that jumped — so lead with the answer.
- **Favour:** בלי לשבור קירות · אבחון מדויק · ללא הרס · דו״ח מסודר · שקיפות מחירים · זמינות מהירה ·
  מאתרים את המקור, לא את הסימפטום.
- **Avoid:** "זול", superlatives without evidence, exclamation spam, unnecessary jargon, "פתרון קסם",
  "המובילים בישראל" (unprovable).
- **Emoji:** a `✓` inside a UI element is fine. Never in body copy.
- **Reference line for the register:** _"מאתרים את מקור הנזילה במדויק — בלי לשבור קירות, עם דו״ח
  שמתקבל בחברות הביטוח."_

---

## 5. The answer block (AEO)

Every service page, location page and article opens with one. This is the unit an AI assistant or a
featured snippet lifts.

- Sits **directly under** a question-form heading.
- **40–60 words.** Shorter reads as thin; longer stops being extractable.
- Answers the question **completely in the first sentence.** No "יש כמה גורמים שמשפיעים" preamble.
- Self-contained — comprehensible with zero surrounding context, because that is how it will be quoted.
- Contains the concrete number, duration or price range where one exists.
- No pronouns referring outside the block.

**Good:**

> **כמה זמן לוקחת בדיקת איתור נזילות?**
> ברוב הדירות הבדיקה אורכת כשעה, ובסיומה תדעו מהיכן מגיעה הנזילה. הסריקה מתבצעת במצלמה תרמית ואינה
> דורשת שבירת קירות או ריצוף. בנכסים גדולים או כשיש כמה מוקדים חשודים הבדיקה עשויה להימשך זמן נוסף.

**Bad:**

> משך הבדיקה משתנה בהתאם למספר גורמים. צוות מקצועי כמו שלנו יידע להעריך את משך העבודה בביקור באתר.

**Rendering rule:** the answer must be in the HTML at first paint. The site's FAQs already satisfy this
using native `<details>/<summary>` — every answer ships in the DOM with zero JS. Keep that property.

---

## 6. Claims — what may be stated as fact

**Free to state** (verified in `lib/site.ts` or the roster): the phone number, WhatsApp, email, the
opening hours, the four services, the 12 service areas, the גוש דן והמרכז coverage, the 2015 founding
year and therefore "10+ שנות ניסיון", the non-destructive method, "בלי לשבור קירות".

**Gated on [business-facts.md](business-facts.md)** — mark `// 🔶 confirm` and never state as fact
until confirmed:

- `3,000+ בתים ועסקים` and `97% איתור כבר בביקור הראשון` (§D)
- Any rating, review count, or customer quote (§B)
- The ₪450 starting price and what it includes (§C)
- The `לא מצאנו — לא שילמתם` guarantee's scope and exclusions (§C)
- Certifications, equipment brand, insurance, association membership (§B)
- Any named person (§A)
- "שירות ארצי" as a coverage claim (§E)
- Superlatives: "המובילים", "הטובים ביותר", "מספר 1"

**Never permitted:** an invented customer name or quote; a rating without a public source; a
certification the business doesn't hold; a photo presented as our work that isn't.

> ⚠️ The site is **currently in breach of this section**. `lib/reviews.ts` ships six invented
> testimonials, and the `aggregateRating` computed from them is emitted on all 13 pages. Do not treat
> that as precedent, and do not add a seventh.

---

## 7. Category-specific: say what the method cannot do

This is the single biggest content opportunity on the site, and it is missing from all four service
pages.

A thermal camera images **surface temperature**, not water. It finds a leak by the thermal pattern
moisture creates — which means it has real limits: a deep slab leak under thick screed, a
well-insulated wall, a wall already at ambient temperature, a leak that isn't currently running. Stating
this plainly is:

- **more convincing**, because a reader mid-crisis can tell the difference between a specialist and a
  brochure;
- **more citable**, because it is the honest answer no competitor publishes;
- **fewer wasted call-outs**, which is what the guarantee is currently absorbing.

The same applies to: why the damp stain is rarely directly beneath the leak; why an electrical scan is
performed **under load**; what an insurer actually rejects a report for; and when a moisture meter or
acoustic detection is the better tool.

---

## 8. Hebrew mechanics

- Israeli formats: phone `055-660-1006`, currency written **`₪450`** (symbol first — the repo's existing
  convention; don't switch mid-file), dates `dd/mm/yyyy`.
- Hebrew abbreviations use גרש `׳` and גרשיים `״` — `דו״ח`, `ק״מ`, `בע״מ`, `ת״י`, `רח׳` — not straight
  ASCII quotes. The repo is consistent about this; match it exactly.
- Numerals stay LTR inside RTL text; components add `dir="ltr"` on the element (there is **no `.ltr`
  helper class** in this repo). Write the plain number; don't add markup in `lib/`.
- Ranges use an en dash: `08:00–18:00`, `3–6 שעות`.
- No language mixing mid-sentence. English equipment names (FLIR) get their own clause.
- Copy lives in `lib/site.ts`, `lib/services.ts` and `lib/faqs.ts` — **never in JSX**. Components render
  `{variable}`, which is what keeps `react/no-unescaped-entities` quiet.

---

## 9. Before publishing

- [ ] Meets the §1 word floor with genuinely unique copy.
- [ ] Passes the §2 doorway test.
- [ ] Has every required block from §3.
- [ ] Opens with a §5 answer block.
- [ ] States at least one real limitation of the method (§7).
- [ ] Every claim is either free (§6) or marked 🔶 with a row in `business-facts.md`.
- [ ] Title and description follow [keyword-map.md](keyword-map.md); the brand appears **exactly once**
      in the rendered `<title>`.
- [ ] Exactly one H1; heading order unbroken.
- [ ] Links out to 2+ internal pages with descriptive anchors.
- [ ] Prices come from one source; no second literal.
