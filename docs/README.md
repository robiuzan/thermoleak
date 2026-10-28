# docs/ — the acceptance bars

Every agent and skill in `.claude/` cites these by filename and section number. They are the
contract: code that violates a bar here does not ship, regardless of who wrote it.

## How the layers fit together

```
STRATEGY  — what we are trying to win, and why
  seo-geo-aeo-strategy.md      keyword clusters · local silo · AEO/answer architecture
  eeat-and-trust.md            how authority gets earned and displayed
  ux-cro-security.md           funnel design · navigation · security posture
  performance-guidelines.md    hard budgets for Core Web Vitals
  accessibility-and-i18n.md    WCAG 2.0 AA published / 2.1 AA targeted · ARIA · HE/EN bilingual
  mobile-ux-and-personalization.md   thumb-zone · sticky conversion · geo personalization
  data-tracking-infrastructure.md    data layer · server-side tagging · CRM
        │
        ▼
SPECIFICATION — the concrete target for this codebase
  keyword-map.md               intent model + title/H1/description FORMULAS
  schema-graph.md              the exact JSON-LD every route must emit
  content-standards.md         word floors · doorway test · answer-block spec · voice
        │
        ▼
STATE — what is true right now
  optimization-backlog.md      the ranked register (§1–§14). KEEP THE NUMBERING STABLE.
  business-facts.md            the intake sheet. THE ONE FILE AN AGENT MAY NOT FILL IN.
        │
        ▼
SEQUENCE — the order we fix it in
  implementation-roadmap.md    sprints, gates, blockers, definition of done
```

> **On that accessibility line:** the site **publishes** WCAG 2.0 AA / ת״י 5568. 2.1 AA is the
> internal target only. Never let the shorthand talk you into updating the published statement —
> that turns an engineering gap into a false legal declaration. See accessibility-and-i18n.md §A0.

**Reading order for a new agent:** `optimization-backlog.md` (what is broken) → the strategy doc
for your discipline → the specification file it points to.

**But read the backlog knowing what it is.** Three sprints have shipped since it was first written,
so most of §1–§12 is now a resolution record rather than a to-do list — start at its **"Where it
stands now"** block, which is the current picture, and treat the "Executive summary" above it as
history. It is a **dated snapshot** (see its `Audited:` and `Reconciled:` lines): **when it and a
freshly built `out/` disagree, `out/` wins — and fix the backlog in the same commit.** That last
clause is not politeness. Nothing in this repo fails when the docs and the code diverge, which is
how every `.claude/` instruction file drifted through four sprints; §14 is the obligation that
replaces the missing mechanism.

## Which file answers which question

| Question                                                            | File                                        |
| ------------------------------------------------------------------- | ------------------------------------------- |
| What keywords are we going after, and with what pages?              | seo-geo-aeo-strategy.md                     |
| What exact title/description do I write for this route?             | keyword-map.md                              |
| Is this page deep enough to ship?                                   | content-standards.md                        |
| What JSON-LD does this route need?                                  | schema-graph.md                             |
| Can I state this claim as fact?                                     | business-facts.md → content-standards.md §6 |
| Where does a statement on a city page come from?                    | `location-sources/{slug}.md`                |
| How do we earn a review, a byline, a case study?                    | eeat-and-trust.md                           |
| Where do CTAs go and how does the funnel work?                      | ux-cro-security.md                          |
| What is the byte/latency budget?                                    | performance-guidelines.md                   |
| How do I add English without breaking Hebrew?                       | accessibility-and-i18n.md                   |
| What fires into the data layer?                                     | data-tracking-infrastructure.md             |
| Where do CTAs sit on a phone, and what must stay in the thumb zone? | mobile-ux-and-personalization.md            |
| What does an answer engine actually see on this site?               | seo-geo-aeo-strategy.md + `public/llms.txt` |
| What is already known broken?                                       | optimization-backlog.md                     |
| Which instruction files must I update after a sprint?               | optimization-backlog.md §14                 |
| What do we do next, and in what order?                              | implementation-roadmap.md                   |
| What may the announcement bar, the seasonal card or the strip say?  | `content/live/` + `live.config.mjs` (below) |

`location-sources/{slug}.md` exists for the nine city pages added 2026-10-28; the first three have
none yet.

**The live surfaces** — the announcement bar, the seasonal card and the homepage updates strip
(fleet live-kit, owner decision 2026-10-11; CLAUDE.md §14) — keep their wording in
`content/live/_campaigns.mjs` and `_updates.mjs`, and their calm pages and ⛔ claim stems in
`live.config.mjs` at the repo root. Their own gates turn every 🔶 row of `business-facts.md` into
a build failure on any line that states it; the wording itself was approved by the owner on
2026-10-12, and any change to it needs a new approval (`business-facts.md` §G).

## Ground rules that override everything else

1. **Never fabricate a business fact.** Unverified → `// 🔶 confirm` + a row in
   `business-facts.md`. The site already paid this cost once: six invented testimonials and a 4.9
   rating shipped on every page until 2026-08-17.
2. **Absent beats fabricated.** A missing rating, byline or statistic is a gap. An invented one is
   a Google policy violation and a lie to a customer mid-crisis.
3. **Verify edge state, never infer it.** `robots.txt`, response headers and the served origin are
   Cloudflare state. Fetch them. This repo believed the wrong deploy target for 15 days.
4. **Depth before breadth.** No new page type ships until the existing ones clear their floor.
5. **Measure the artifact you are actually serving.** `out/` on disk is routinely stale — compare
   its mtime to `git log -1` and rebuild before you count anything. A word count, a byte total or a
   route count taken from a stale export is worse than no number, because it gets quoted.

## Legacy files — not acceptance bars

`thermoleak-brief.md`, `website-brief-template.md` and `website-kit-README.md` predate this
environment. They are the original build brief and a generic template, kept for provenance only —
**every business value in them is invented placeholder data.** Do not cite them as a source; use
`business-facts.md`. The root `README.md` is likewise a leftover "Website Build Kit" readme that
describes a generic workflow, not this project.
