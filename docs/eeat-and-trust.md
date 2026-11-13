# E-E-A-T and trust — how authority gets earned and displayed

**Guidelines**, not a register. What is currently unconfirmed lives in
[business-facts.md](business-facts.md); which claims may be stated at all lives in
[content-standards.md](content-standards.md) §6. This file says _how to build the trust surface_
once the facts exist. `eeat-trust-auditor` audits against it.

---

## 0. The rule that outranks every technique below

> **Absent beats fabricated. Always. Without exception.**

This project has already paid for breaking that rule. Until 2026-08-17 the site shipped **six
invented customer testimonials** with full names and cities, and a **4.9 `aggregateRating`**
computed from them, emitted in JSON-LD on **every page**. The file containing them said
"PLACEHOLDER" in its own header comment.

That is not a content gap — it is a Google policy violation, a consumer-protection exposure, and a
lie told to someone standing in a flooded bathroom. It also _blocked_ legitimate star results,
because real reviews cannot be added on top of fake ones.

Everything below assumes that lesson holds. No "sample" testimonial, no "typical for the industry"
statistic, no placeholder byline, no rounded-up job count — not even temporarily, not even behind a
TODO.

---

## 1. The four letters, mapped to this business

| Letter                | What it means here                                                                                                                | Current state                                                                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Experience**        | Someone has personally scanned thousands of walls. Show the work: thermal images, real jobs, what went wrong and how it was found | Founded 2015 (verified); founder in the trade since ~2005 (§A, 2026-09-17). No case studies, no real job photos — the renderings carry no weight (§5a) |
| **Expertise**         | Thermography is a _credentialed_ discipline. A certificate number and issuing body is worth more than any adjective               | **No certificate exists** (❌, §B, 2026-09-17) — the claimed one was deleted. FLIR E8 confirmed; an electrician licence is stated in text on the panel page only, never as a badge (§H) |
| **Authoritativeness** | Other sources corroborate the entity: GBP, reviews, professional bodies, press, insurers who accept the reports                   | **Zero** off-site corroboration. `sameAs` empty                                                                                                  |
| **Trustworthiness**   | Prices, guarantee scope, a named accountable human, an honest statement of what the method cannot do                              | Limits sections ✅, bounded guarantee ✅, named founder ✅ (all 2026-08-24); ₪350, ביטוח צד ג׳ and tax invoices ✅ (2026-09-17). ח.פ. and certification ❌ — confirmed absent, not open. Still open: payment methods, the insurer's name and amount |

**The weakest link is now Authoritativeness: there is still zero off-site corroboration.** A visitor
can read who runs this business and exactly what the guarantee covers — but every one of those
statements is sourced to the site making them. Nothing outside `thermoleak.co.il` confirms a single
claim. That is what §2 (reviews) and the GBP exist to fix, and it is why they sit at the top of the
ranked asks in §3.

**Renderings carry zero Experience weight (§5a).** The images on the site show how the method works;
they prove nothing about any job, and an audit must not count them.

---

## 2. The review engine — the highest-ROI work available

The fabricated reviews are gone; the _absence_ they left is now the weakest point in the whole trust
surface (§1). Ten real reviews would simultaneously: give the entity its first off-site
corroboration, unlock legitimate star rich results, feed the map pack, give the copywriter quotable
material, and give an AI assistant something to cross-reference. Nothing else on this project does
five things at once — and everything here is blocked on the GBP existing first (business-facts §B).

### Acquisition — build it into the job, not a campaign

1. **Ask at peak gratitude**: the moment the source is found and the customer can see it on the
   camera screen. Not days later.
2. **Same-evening WhatsApp follow-up** with the direct GBP review link (`/review/...` short link,
   not the profile homepage — one tap, no searching).
3. **Make it specific**: "if the scan found it, mentioning your city helps neighbours find us."
   City-mentioning reviews are disproportionately valuable for local ranking.
4. **Velocity beats volume.** A steady trickle reads as a living business; 15 reviews in one week
   reads as a campaign to both Google and humans. Target ~2-4/month, sustained.
5. **Never gate, filter, or incentivise.** Review gating (asking happy customers only) violates
   Google policy and is detectable.

### Display — three surfaces, one source

| Surface                              | Rule                                                                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `/reviews/` page                     | Currently 301s to `/about/`. Restore it **only** when reviews are real, each with author, date, and a link to the public source |
| `Review` / `AggregateRating` JSON-LD | Ships **only** with verifiable public reviews. See [schema-graph.md](schema-graph.md) §4.1                                      |
| Inline quotes on service pages       | Only real quotes, attributed, with the service they relate to                                                                   |

### Responding is part of the signal

Respond to every review, positive and negative, within days. A calm, specific reply to a complaint
is a stronger trust signal than a five-star average — it demonstrates the business is present and
accountable.

---

## 3. The named human — three unlocks landed, the fourth is half-built

**The founder is named.** רונן דהן was confirmed by the owner on 2026-08-24 (business-facts §A) and
lives in `lib/site.ts`, which means three of the four things this section used to be waiting for
have happened: a `Person` node ships in the graph, all three guides carry a real byline, and
`/about/` cleared its depth floor with a founder block at `#founder`. The fourth — the human trust
decision a visitor makes at the door — is only half made, because a name with nothing behind it is
still just a name.

**Two defects stood between the name and the trust it should buy.** One is closed; the other is now
a copy gap, no longer an owner block:

- **The byline resolves to nobody** — ✅ **closed 2026-10-28** (EEAT-5 / AEO-6). Each `Article`
  used to emit its own anonymous `Person` with no `@id` while `/about/` emitted the founder at
  `about/#founder`, and the byline was plain text pointing nowhere. Now every `Article.author`
  carries that `@id`, and all three visible bylines link to `/about/#founder` (verified on the
  2026-11-13 build).
- **The credential line is empty.** The bio pattern below has three slots — role and years,
  certification, equipment. Two are answered (since ~2005, FLIR E8 — 2026-09-17) but not yet shown
  on the founder block or the bylines. The certification slot stays empty for good: there is none
  (❌).

**What was owed on the person** (business-facts §A/§B — record the ask, never the answer). Answered
2026-09-17 unless marked:

- Role and years in the trade — ✅ in the trade since ~2005 (§A)
- Thermography certification — ❌ **none held** (§B). An answer, not a gap: never ask again, never
  fill the slot
- Equipment actually used — ✅ FLIR E8 (§B)
- Insurance (ביטוח צד ג׳) and ח.פ. — insurance ✅ held (insurer and amount not supplied); ח.פ. ❌
  none, so `legalName` is `טרמוליק`, without בע״מ (§A)
- One real photograph, with permission — 🔶 **still open** (§A)

**Author bio pattern** (for guides):

```
[Photo] {Name} — {role}, טרמוליק
{One sentence of concrete experience: years + what they actually do.}
{Credential with number.} {Equipment.}
→ links to /about/#founder
```

`{Credential with number.}` stays out on this site: no certificate exists (§B ❌), and the
electrician licence has no holder, level or number on file (§H 🔶). Never fill the slot with an
adjective.

Bylines must resolve to a `Person` node with a stable `@id` — here that is the shipped
`about/#founder` — referenced from each `Article`, and the visible byline should link to the same
anchor. A byline that links nowhere is decoration. All three guides have met this rule since
2026-10-28.

### The remaining asks, ranked by value per unit of owner effort

Everything below is an **ask**, not a fact. The intake sheet is
[business-facts.md](business-facts.md), and only the owner may answer it — no agent fills these in,
and none of them may appear on the site before it is answered there. The ranking is a sequencing
aid: it puts the items that buy the most trust for the least of the owner's time first.

**Status 2026-11-13: eight of the eleven are answered** (all on 2026-09-17). Two of them, 3 and 8,
came back ❌ (confirmed absent), and that is an answer, not a gap. **Still open: 1, 2 and 10.** The
numbering is kept so older references still resolve.

| #   | Ask                                                          | Sheet | Why it ranks here                                                                                                                                                             |
| --- | ------------------------------------------------------------ | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Google Business Profile URL                                  | §B    | 🔶 **Open.** One paste. It is the first non-zero `sameAs`, the map-pack entry, and the precondition for every review-derived asset. Nothing else this cheap moves Authoritativeness at all |
| 2   | 5–10 real reviews, each with author, date and **source URL** | §B    | 🔶 **Open.** Blocked on 1. The only item that does five things at once (§2), and the only legitimate route to star results                                                    |
| 3   | Certification: issuing body + level + certificate number     | §B    | ❌ **Answered: none held.** The unbacked "Level 1" badge was deleted. Never re-ask, never fill                                                                                 |
| 4   | Owner's role and years in the trade                          | §A    | ✅ **Answered: in the trade since ~2005.** Not yet shown in the founder block or the bylines (above)                                                                         |
| 5   | Is ₪350 still the starting price?                            | §C    | ✅ **Answered: yes.** The `Offer` shipped 2026-11-13 on the water-leak and moisture `Service` nodes ([schema-graph.md](schema-graph.md) §7a)                                  |
| 6   | Camera make and model                                        | §B    | ✅ **Answered: FLIR E8**                                                                                                                                                      |
| 7   | Report turnaround, as a number of business days              | §C    | ✅ **Answered: 3 business days** (`site.reportTurnaroundDays`)                                                                                                               |
| 8   | ח.פ. / ע.מ. number                                           | §A    | ❌ **Answered: none — not a registered company.** `legalName` dropped בע״מ                                                                                                    |
| 9   | Insurance (ביטוח צד ג׳)                                      | §B    | ✅ **Answered: held.** The insurer's name and the coverage amount were not supplied, so no figure ships                                                                       |
| 10  | Permission to publish a photograph of the founder            | §A    | 🔶 **Open.** High trust value, but it costs the owner a decision about their own face — hence below the one-line items                                                        |
| 11  | Technician count / team shape                                | §A    | ✅ **Answered: two people**                                                                                                                                                   |

Items 1 and 2 are the whole of Authoritativeness. If only one thing gets asked for this quarter,
ask for the GBP URL.

This is the trust view of the intake sheet, not all of it — business-facts also carries open
coverage, geo and payment-terms rows that belong to other dimensions. **The ranking is a sequencing
aid and nothing more: it never licenses filling a row in.**

---

## 4. Case studies — the highest-value content type this business can produce

A real job write-up solves **four** problems simultaneously, which nothing else does:

1. **Experience** — evidence of work, not claims about it
2. **The doorway test** — nothing is more genuinely city-specific than a real job in that city
3. **AEO** — concrete detail (property type, symptom, what the scan showed, what it was) is exactly
   what gets cited
4. **Conversion** — a prospect recognising their own symptom in a case study is pre-sold

### Template

```
כותרת: {symptom} ב{city} — {what it turned out to be}
- הרקע: property type, age, what the customer saw and for how long
- מה חשדנו: the plausible wrong answers, and why
- מה הסריקה הראתה: the thermal finding, with the image
- המקור: what it actually was
- התוצאה: what was repaired, by whom, what it cost the customer to fix
- מה אפשר ללמוד: the generalisable lesson
```

**Consent is mandatory and specific.** Written permission to publish, covering the images and any
identifying detail. No apartment numbers, no full street addresses, no family names. "דירה בת 40
שנה בשכונת X" is specific enough to be credible and vague enough to be safe.

---

## 5. Before/after thermal galleries — the unfair advantage

This business produces **inherently compelling visual evidence** that no competitor in an adjacent
trade can fake: a normal photo and its thermal twin, side by side, with the leak glowing.

- **Pair every image**: ordinary photo ↔ thermal image of the _same_ frame. The pair is the proof;
  a thermal image alone is abstract.
- **Caption with the finding**, not with adjectives: "נזילה בצנרת מים חמים מאחורי הקיר, קומה 2,
  רמת גן" beats "איתור מדויק".
- **Evidence comes from real jobs only.** A before/after pair, a case study or anything else offered
  as a record of a job is a real photograph of that job: no stock, no generated picture, no demo scan
  staged for the camera. A sibling site in this fleet shipped AI-generated "after" photos carrying a
  generative watermark; that is a permanent credibility liability once noticed. Illustrations are a
  different thing, and §5a is their rule.
- **Provenance record**: keep a note per image of job date, city, permission status. If provenance
  cannot be established, the image does not ship.
- **Accessibility**: thermal images need real `alt` describing the _finding_, since colour is the
  entire information channel and a colourblind or screen-reader user gets nothing from it otherwise.

## 5a. Illustrations under one note (the user, 2026-11-01)

Every content page carries AI-made illustrations of the method, built on the fleet's `page-images`
toolkit. They show how a thermal check is done. They are **not evidence**, and §5 above still governs
evidence. The rule sits on the words around a picture and not on a label on each picture, because a
label on some images implies that the others are photographs.

- **One site-wide note.** A footer line on every page, the `/gallery/` intro, and a line under the team
  figure on `/about/`. The texts live in `content/images/notice.json`.
- **Words describe an activity or a method.** Never a finding, a result, a promise, the guarantee's
  slogan, a temperature, a number, a city or neighbourhood, a customer, a date, or the camera's model.
- **A screen is an illustration, never a reading.** Alt and caption describe colours and positions.
- **The people are real and consented.** עומר and יואב appear in scenes that never happened, which the
  consent text says in those words. Their first names appear only on `/about/`. The founder is never
  depicted.
- **Never in schema, `og:image` or a Google Business Profile.** A Business Profile asks for real
  photographs, and a rendering there would be a misrepresentation, not an illustration.
- **Retire, never delete.** A replaced file stays at least 60 days, because crawled pages still ask for
  it. A revoked consent overrides that keep: people-free twins at new file names, and the old files gone within 14
  days.
- **Real photographs win.** A real job photo enters the manifest as `owner-supplied` and replaces a
  rendering one for one.

**Accepted risk.** Gemini embeds Google's invisible SynthID watermark, so a visitor can establish that
an image is AI-made. The note already says so, which is why that risk is smaller under this rule than
it was before it.

_History: an owner-scoped exception for the homepage gallery (2026-10-22, changed 2026-10-26) was
superseded 2026-11-01 by this section. Its eleven images are re-issued with the logo under the same
rule._

---

## 6. Credentials, badges and the guarantee

### What a trust badge must be

A badge is a **claim with a verifiable referent**. Acceptable: certification body logo _with_
certificate number, insurance confirmation, association membership with a member ID, a real payment
processor mark. Unacceptable: generic "100% מקצועי" seals, self-designed shields, star graphics not
backed by real reviews, "as seen in" without a link.

**EEAT-6 — ✅ closed, in two steps.** The finding: `אחריות מלאה ושקיפות מחירים` sat inside the
`certifications` array in `lib/site.ts` and rendered on `/about/` under a `הסמכות וציוד` heading with
a verification icon beside it. It is not a certification and has no referent, it borrowed
credibility from the rows beside it, and `מלאה` contradicted the terms the owner signed off as
explicitly bounded.

- **2026-09-17:** the array became `site.credentials`, holding only confirmed capabilities (FLIR E8,
  ביטוח צד ג׳, a two-person team), with the guarantee removed. The `/about/` heading became
  `ציוד וכיסוי`.
- **2026-11-13:** the two remaining «אחריות מלאה» went too. `site.description` (the `LocalBusiness`
  description) dropped it, and the `/about/` values card is now `התחייבות בתנאים כתובים`. That card
  renders the slogan plus `site.guaranteeTerms.ifNotFound` verbatim and links `/pricing/#guarantee`.
  `components/TrustRow.tsx` never renders the guarantee. «אחריות מלאה» is in zero built pages.

### The guarantee has its scope — now it needs reach

`לא מצאנו — לא שילמתם` is the strongest commercial promise on the site, and since 2026-08-24 it is
also a **bounded** one. The owner confirmed and the site publishes what counts as a successful
location, what happens on an inconclusive visit, that there is no call-out fee, and what is excluded
(`lib/site.ts` `guaranteeTerms`, rendered by `components/GuaranteeTerms.tsx`). The argument this
section used to make has been won: **a precisely defined guarantee converts better than a vague
one** — it removes the suspicion of a catch.

**Status: ✅ closed 2026-10-28 (EEAT-4).** On the 2026-11-13 build every page with the promise puts
the terms one tap away. The homepage chip, the four service sidebars, the `/about/` card and the cost
guide all link `/pricing/#guarantee`, and the homepage FAQ answers «מה כוללת ההתחייבות ״לא מצאנו — לא
שילמתם״?», so the terms also reach `FAQPage`. The finding as written:

The problem now is distribution (open — EEAT-4). Eight built pages carry the bare promise; **one**
carries the terms. On the four service pages the promise sits in the conversion sidebar directly
under the call and form CTAs — the exact moment a visitor thinks "and if you don't find it?" — with
no answer and nothing to click, because `GuaranteeTerms` renders no `id` to deep-link to. The terms
are also absent from the FAQ, so they reach neither the visitor scanning questions nor `FAQPage`.
Anywhere the promise appears, the scope must be one tap away.

**Do not re-litigate the wording.** It is confirmed and published; treat it as fixed terms, not as
marketing copy to tighten.

### Transparency surface (the boring items that matter)

Company number, insurance, a clear complaints path, cancellation terms, and honest hours. The
privacy policy and accessibility statement are real and substantive documents — that is a genuine
credit and should be maintained, not diluted.

**Status: fixed 2026-09-06.** `/privacy/` now says the site loads Google Tag Manager and Google
Analytics 4, and that measurement waits for the visitor's consent. The paragraph below is kept as the
finding and as the standing rule.

**Maintained means kept true, and one of them has fallen behind the site.** `/privacy/` still says
the site _may_ use analytics tools "כגון Google Analytics"; GTM and GA4 have shipped on every route
since 2026-08-30, so a hedge has quietly become a false statement on the page whose whole job is
accuracy about data. A privacy page that understates what is actually collected is a trust defect in
this section's own terms, and on an Israeli site it is not only that. Whoever wires the conversion
events owns fixing the sentence in the same pass — and the same rule applies to the accessibility
statement whenever a contrast or keyboard regression lands.

---

## 7. The trust gate on all CRO work

Before adding urgency copy, badges, counters or scarcity to any page, check business-facts.

- Conversion pressure without proof makes a page **worse**, not better.
- **Banned outright**: countdown timers, "X customers this month", invented scarcity, fake "live
  visitor" counts, and any statistic without a source.
- The highest-value CRO change available here is not a button colour. The two that need the owner
  are the GBP and real reviews (§2). The one that did not was putting the **already-confirmed**
  guarantee terms in front of the visitor at the moment of doubt (§6), and that shipped 2026-10-28.
  Escalate rather than substituting a fabricated signal.

---

## 8. Audit checklist

- [ ] Every quantified claim on the site traces to `lib/site.ts`, the roster, or business-facts.
- [ ] Zero `Review` / `AggregateRating` in the export without a verifiable public source URL.
- [ ] `sameAs` contains real profile URLs, or is empty — never a platform homepage.
- [ ] A named person with a credential number appears on `/about/` and backs every byline.
- [ ] Every `Article` author resolves to the `about/#founder` `Person` node, and the visible byline
      links to it.
- [ ] Every image has known provenance and permission.
- [ ] Renderings stay inside §5a: words that describe an activity, the note live, nothing in schema,
      `og:image` or a Google Business Profile, and the founder never depicted.
- [ ] No rendering is counted as Experience evidence, and no per-image label has crept back in.
- [ ] The guarantee states scope, exclusions and call-out policy — and every page that makes the
      promise puts those terms one tap away.
- [ ] Nothing self-issued renders as a credential (`site.credentials` holds confirmed capabilities
      only — never the guarantee, never the electrician licence).
- [ ] `/privacy/` and `/accessibility/` still describe the site as it is today, not as it was.
- [ ] Every published case study has written consent on file.
- [ ] No badge without a verifiable referent.
