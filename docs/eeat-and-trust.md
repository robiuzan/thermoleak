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
| **Experience**        | Someone has personally scanned thousands of walls. Show the work: thermal images, real jobs, what went wrong and how it was found | Founded 2015 (verified). No case studies, no work imagery                                                                                        |
| **Expertise**         | Thermography is a _credentialed_ discipline. A certificate number and issuing body is worth more than any adjective               | Certification claimed, uncredentialed (§B)                                                                                                       |
| **Authoritativeness** | Other sources corroborate the entity: GBP, reviews, professional bodies, press, insurers who accept the reports                   | **Zero** off-site corroboration. `sameAs` empty                                                                                                  |
| **Trustworthiness**   | Prices, guarantee scope, a named accountable human, an honest statement of what the method cannot do                              | Limits sections ✅, bounded guarantee ✅, named founder ✅ (all 2026-08-24). Certification number, insurance, ח.פ. and the ₪350 price still open |

**The weakest link is now Authoritativeness: there is still zero off-site corroboration.** A visitor
can read who runs this business and exactly what the guarantee covers — but every one of those
statements is sourced to the site making them. Nothing outside `thermoleak.co.il` confirms a single
claim. That is what §2 (reviews) and the GBP exist to fix, and it is why they sit at the top of the
ranked asks in §3.

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

**Two defects stand between the name and the trust it should buy.** Both are code, both are open:

- **The byline resolves to nobody** (open — EEAT-5 / AEO-6). Each `Article` emits its own anonymous
  `Person` with no `@id`, while `/about/` emits the founder at a stable `about/#founder`. Two nodes,
  one human, no link between them — and on the page the byline is plain text pointing nowhere. This
  is the rule below being broken by the very pages that introduced it.
- **The credential line is empty.** The bio pattern below has three slots — role and years,
  certification, equipment — and every one of them is still owner-blocked.

**What is still owed on the person** (business-facts §A/§B — record the ask, never the answer):

- Role and years in the trade
- Thermography certification: **issuing body + level + certificate number**, not just "certified"
- Equipment actually used (camera make/model) — specificity is expertise
- Insurance (ביטוח צד ג׳) and ח.פ. — standard Israeli trade trust signals, currently absent while
  `legalName` claims בע״מ
- One real photograph, with permission

**Author bio pattern** (for guides):

```
[Photo] {Name} — {role}, טרמוליק
{One sentence of concrete experience: years + what they actually do.}
{Credential with number.} {Equipment.}
→ links to /about/#founder
```

Bylines must resolve to a `Person` node with a stable `@id` — here that is the shipped
`about/#founder` — referenced from each `Article`, and the visible byline should link to the same
anchor. A byline that links nowhere is decoration. All three guides currently ship decoration.

### The remaining asks, ranked by value per unit of owner effort

Everything below is an **ask**, not a fact. The intake sheet is
[business-facts.md](business-facts.md), and only the owner may answer it — no agent fills these in,
and none of them may appear on the site before it is answered there. The ranking is a sequencing
aid: it puts the items that buy the most trust for the least of the owner's time first.

| #   | Ask                                                          | Sheet | Why it ranks here                                                                                                                                                             |
| --- | ------------------------------------------------------------ | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Google Business Profile URL                                  | §B    | One paste. It is the first non-zero `sameAs`, the map-pack entry, and the precondition for every review-derived asset. Nothing else this cheap moves Authoritativeness at all |
| 2   | 5–10 real reviews, each with author, date and **source URL** | §B    | Blocked on 1. The only item that does five things at once (§2), and the only legitimate route to star results                                                                 |
| 3   | Certification: issuing body + level + certificate number     | §B    | Turns an adjective into a verifiable referent (§6), fills the bio's credential line, and is the difference between Expertise claimed and Expertise shown                      |
| 4   | Owner's role and years in the trade                          | §A    | One sentence, and it completes the author bio the three guides already need. Pairs with 3 — ask for both in the same message                                                  |
| 5   | Is ₪350 still the starting price?                            | §C    | A yes/no. It either releases the `Offer` node deliberately withheld in `lib/jsonld.ts` or corrects a number already published on five pages                                   |
| 6   | Camera make and model                                        | §B    | One line, and specificity reads as expertise everywhere it appears                                                                                                            |
| 7   | Report turnaround, as a number of business days              | §C    | Already promised vaguely in the insurance-reports FAQ; a number is both more useful and more citable                                                                          |
| 8   | ח.פ. / ע.מ. number                                           | §A    | Standard Israeli trade signal, and `legalName` already claims בע״מ without one                                                                                                |
| 9   | Insurance (ביטוח צד ג׳)                                      | §B    | Standard trade signal; matters most to ועדי בתים and property managers                                                                                                        |
| 10  | Permission to publish a photograph of the founder            | §A    | High trust value, but it costs the owner a decision about their own face — hence below the one-line items                                                                     |
| 11  | Technician count / team shape                                | §A    | Lowest value of the set; "צוות" is implied sitewide and nothing depends on the number                                                                                         |

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
- **Real jobs only.** Never stock, never AI-generated, never a demo scan staged for the camera. A
  sibling site in this fleet shipped AI-generated "after" photos carrying a generative watermark;
  that is a permanent credibility liability once noticed.
- **Provenance record**: keep a note per image of job date, city, permission status. If provenance
  cannot be established, the image does not ship.
- **Accessibility**: thermal images need real `alt` describing the _finding_, since colour is the
  entire information channel and a colourblind or screen-reader user gets nothing from it otherwise.

> **Scoped exception — 2026-10-22, changed 2026-10-26 (owner; business-facts §A).** The homepage
> gallery (`components/Gallery.tsx`, `lib/gallery.ts`) shows eleven AI-generated illustrations of
> עומר (four made 2026-10-22, seven from the 2026-10-27 batch — the owner approved its "maybe"
> frames that day), the second technician — not the founder (business-facts §A) — each scene a wide shot plus one or two
> closer shots of the camera in use. That format is allowed for them only within these limits: no
> label of any kind since the owner's decision of 2026-10-26 (no note or tags on the page, no הדמיה
> in the alt text, no AI marker in the files), so `source.kind` in `lib/gallery.ts` is the only
> record of their provenance; captions name an activity, never a symptom or a finding; a screen is
> never presented as a reading; they are not Experience evidence (§1) and never appear in schema,
> `og:image` or a Google
> Business Profile. The before/after evidence gallery above stays real-jobs-only, and real job
> photos replace the illustrations as they arrive. Accepted risk: Gemini embeds Google's invisible
> SynthID watermark, so a visitor can still find out the images are AI-made — the "credibility
> liability once noticed" this section warns about.

---

## 6. Credentials, badges and the guarantee

### What a trust badge must be

A badge is a **claim with a verifiable referent**. Acceptable: certification body logo _with_
certificate number, insurance confirmation, association membership with a member ID, a real payment
processor mark. Unacceptable: generic "100% מקצועי" seals, self-designed shields, star graphics not
backed by real reviews, "as seen in" without a link.

**There is one live breach of this rule** (open — EEAT-6). `אחריות מלאה ושקיפות מחירים` sits inside
the `certifications` array in `lib/site.ts` and renders on `/about/` under a `הסמכות וציוד` heading
with a verification icon beside it. It is not a certification and has no referent, and it borrows
credibility from the two rows above it. Worse, `מלאה` now contradicts the terms the owner actually
signed off on, which are explicitly bounded. Fixing it is a copy change, not a fact: the bounded
wording already exists.

### The guarantee has its scope — now it needs reach

`לא מצאנו — לא שילמתם` is the strongest commercial promise on the site, and since 2026-08-24 it is
also a **bounded** one. The owner confirmed and the site publishes what counts as a successful
location, what happens on an inconclusive visit, that there is no call-out fee, and what is excluded
(`lib/site.ts` `guaranteeTerms`, rendered by `components/GuaranteeTerms.tsx`). The argument this
section used to make has been won: **a precisely defined guarantee converts better than a vague
one** — it removes the suspicion of a catch.

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
  are the GBP and real reviews (§2). The one that does not is putting the **already-confirmed**
  guarantee terms in front of the visitor at the moment of doubt (§6) — the site has a bounded
  promise and mostly hides it. Escalate rather than substituting a fabricated signal.

---

## 8. Audit checklist

- [ ] Every quantified claim on the site traces to `lib/site.ts`, the roster, or business-facts.
- [ ] Zero `Review` / `AggregateRating` in the export without a verifiable public source URL.
- [ ] `sameAs` contains real profile URLs, or is empty — never a platform homepage.
- [ ] A named person with a credential number appears on `/about/` and backs every byline.
- [ ] Every `Article` author resolves to the `about/#founder` `Person` node, and the visible byline
      links to it.
- [ ] Every image has known provenance and permission.
- [ ] The homepage gallery's AI illustrations stay inside the §5 exception's limits, and no AI
      image ships anywhere else.
- [ ] The guarantee states scope, exclusions and call-out policy — and every page that makes the
      promise puts those terms one tap away.
- [ ] Nothing self-issued renders as a credential (`certifications` holds certifications only).
- [ ] `/privacy/` and `/accessibility/` still describe the site as it is today, not as it was.
- [ ] Every published case study has written consent on file.
- [ ] No badge without a verifiable referent.
