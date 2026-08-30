# E-E-A-T and trust — how authority gets earned and displayed

**Guidelines**, not a register. What is currently unconfirmed lives in
[business-facts.md](business-facts.md); which claims may be stated at all lives in
[content-standards.md](content-standards.md) §6. This file says *how to build the trust surface*
once the facts exist. `eeat-trust-auditor` audits against it.

---

## 0. The rule that outranks every technique below

> **Absent beats fabricated. Always. Without exception.**

This project has already paid for breaking that rule. Until 2026-08-17 the site shipped **six
invented customer testimonials** with full names and cities, and a **4.9 `aggregateRating`**
computed from them, emitted in JSON-LD on **every page**. The file containing them said
"PLACEHOLDER" in its own header comment.

That is not a content gap — it is a Google policy violation, a consumer-protection exposure, and a
lie told to someone standing in a flooded bathroom. It also *blocked* legitimate star results,
because real reviews cannot be added on top of fake ones.

Everything below assumes that lesson holds. No "sample" testimonial, no "typical for the industry"
statistic, no placeholder byline, no rounded-up job count — not even temporarily, not even behind a
TODO.

---

## 1. The four letters, mapped to this business

| Letter | What it means here | Current state |
| --- | --- | --- |
| **Experience** | Someone has personally scanned thousands of walls. Show the work: thermal images, real jobs, what went wrong and how it was found | Founded 2015 (verified). No case studies, no work imagery |
| **Expertise** | Thermography is a *credentialed* discipline. A certificate number and issuing body is worth more than any adjective | Certification claimed, uncredentialed (§B) |
| **Authoritativeness** | Other sources corroborate the entity: GBP, reviews, professional bodies, press, insurers who accept the reports | **Zero** off-site corroboration. `sameAs` empty |
| **Trustworthiness** | Prices, guarantee scope, a named accountable human, an honest statement of what the method cannot do | Limits sections shipped ✅. Guarantee scope, prices, named human all open |

**The weakest link is Trustworthiness-by-proxy: nobody is named.** A visitor letting a stranger into
their home mid-crisis is making a trust decision, and there is currently no person to trust.

---

## 2. The review engine — the highest-ROI work available

Ten real reviews would simultaneously: close the policy violation, unlock legitimate star rich
results, feed the map pack, give the copywriter quotable material, and give an AI assistant
something to corroborate the entity with. Nothing else on this project does five things at once.

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

| Surface | Rule |
| --- | --- |
| `/reviews/` page | Currently 301s to `/about/`. Restore it **only** when reviews are real, each with author, date, and a link to the public source |
| `Review` / `AggregateRating` JSON-LD | Ships **only** with verifiable public reviews. See [schema-graph.md](schema-graph.md) §4.1 |
| Inline quotes on service pages | Only real quotes, attributed, with the service they relate to |

### Responding is part of the signal
Respond to every review, positive and negative, within days. A calm, specific reply to a complaint
is a stronger trust signal than a five-star average — it demonstrates the business is present and
accountable.

---

## 3. The named human — unblocks four things at once

No owner, founder or technician is named anywhere. Naming one person unblocks: `Person` schema,
every guide byline (AEO requires attribution), the `/about/` depth floor, and the basic human trust
decision.

**What to publish** (business-facts §A):

- Full name, role, years in the trade
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
→ links to /about/#{person-anchor}
```

Bylines must resolve to a `Person` node with a stable `@id` (`/about/#person-1`), referenced from
each `Article`. A byline that links nowhere is decoration.

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

- **Pair every image**: ordinary photo ↔ thermal image of the *same* frame. The pair is the proof;
  a thermal image alone is abstract.
- **Caption with the finding**, not with adjectives: "נזילה בצנרת מים חמים מאחורי הקיר, קומה 2,
  רמת גן" beats "איתור מדויק".
- **Real jobs only.** Never stock, never AI-generated, never a demo scan staged for the camera. A
  sibling site in this fleet shipped AI-generated "after" photos carrying a generative watermark;
  that is a permanent credibility liability once noticed.
- **Provenance record**: keep a note per image of job date, city, permission status. If provenance
  cannot be established, the image does not ship.
- **Accessibility**: thermal images need real `alt` describing the *finding*, since colour is the
  entire information channel and a colourblind or screen-reader user gets nothing from it otherwise.

---

## 6. Credentials, badges and the guarantee

### What a trust badge must be
A badge is a **claim with a verifiable referent**. Acceptable: certification body logo *with*
certificate number, insurance confirmation, association membership with a member ID, a real payment
processor mark. Unacceptable: generic "100% מקצועי" seals, self-designed shields, star graphics not
backed by real reviews, "as seen in" without a link.

### The guarantee needs a scope before it needs prominence
`לא מצאנו — לא שילמתם` is the strongest commercial promise on the site and currently has **no
definition of "found", no exclusions, and no stated call-out fee.** Undefined, it is both a
conversion asset and a dispute waiting to happen.

Publish, in plain Hebrew: what counts as a successful location; what happens on an inconclusive
visit; whether a call-out fee applies; what is excluded (e.g. inaccessible areas). **A precisely
defined guarantee converts better than a vague one** — it removes the suspicion of a catch.

### Transparency surface (the boring items that matter)
Company number, insurance, a clear complaints path, cancellation terms, and honest hours. The
privacy policy and accessibility statement are already real and substantive — that is a genuine
credit and should be maintained, not diluted.

---

## 7. The trust gate on all CRO work

Before adding urgency copy, badges, counters or scarcity to any page, check business-facts.

- Conversion pressure without proof makes a page **worse**, not better.
- **Banned outright**: countdown timers, "X customers this month", invented scarcity, fake "live
  visitor" counts, and any statistic without a source.
- The highest-value CRO change available here is not a button colour. It is real reviews (§2) and a
  named human (§3). Escalate rather than substituting a fabricated signal.

---

## 8. Audit checklist

- [ ] Every quantified claim on the site traces to `lib/site.ts`, the roster, or business-facts.
- [ ] Zero `Review` / `AggregateRating` in the export without a verifiable public source URL.
- [ ] `sameAs` contains real profile URLs, or is empty — never a platform homepage.
- [ ] A named person with a credential number appears on `/about/` and backs every byline.
- [ ] Every image has known provenance and permission.
- [ ] The guarantee states scope, exclusions and call-out policy.
- [ ] Every published case study has written consent on file.
- [ ] No badge without a verifiable referent.
