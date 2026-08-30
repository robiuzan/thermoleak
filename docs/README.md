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
  accessibility-and-i18n.md    WCAG 2.1 AA · ARIA · the HE/EN bilingual architecture
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
  optimization-backlog.md      the ranked register (§1–§13). KEEP THE NUMBERING STABLE.
  business-facts.md            the intake sheet. THE ONE FILE AN AGENT MAY NOT FILL IN.
        │
        ▼
SEQUENCE — the order we fix it in
  implementation-roadmap.md    sprints, gates, blockers, definition of done
```

**Reading order for a new agent:** `optimization-backlog.md` (what is broken) → the strategy doc
for your discipline → the specification file it points to.

## Which file answers which question

| Question | File |
| --- | --- |
| What keywords are we going after, and with what pages? | seo-geo-aeo-strategy.md |
| What exact title/description do I write for this route? | keyword-map.md |
| Is this page deep enough to ship? | content-standards.md |
| What JSON-LD does this route need? | schema-graph.md |
| Can I state this claim as fact? | business-facts.md → content-standards.md §6 |
| How do we earn a review, a byline, a case study? | eeat-and-trust.md |
| Where do CTAs go and how does the funnel work? | ux-cro-security.md |
| What is the byte/latency budget? | performance-guidelines.md |
| How do I add English without breaking Hebrew? | accessibility-and-i18n.md |
| What fires into the data layer? | data-tracking-infrastructure.md |
| What is already known broken? | optimization-backlog.md |
| What do we do next, and in what order? | implementation-roadmap.md |

## Ground rules that override everything else

1. **Never fabricate a business fact.** Unverified → `// 🔶 confirm` + a row in
   `business-facts.md`. The site already paid this cost once: six invented testimonials and a 4.9
   rating shipped on every page until 2026-08-17.
2. **Absent beats fabricated.** A missing rating, byline or statistic is a gap. An invented one is
   a Google policy violation and a lie to a customer mid-crisis.
3. **Verify edge state, never infer it.** `robots.txt`, response headers and the served origin are
   Cloudflare state. Fetch them. This repo believed the wrong deploy target for 15 days.
4. **Depth before breadth.** No new page type ships until the existing ones clear their floor.

## Legacy files — not acceptance bars

`thermoleak-brief.md`, `website-brief-template.md` and `website-kit-README.md` predate this
environment. They are the original build brief and a generic template, kept for provenance only —
**every business value in them is invented placeholder data.** Do not cite them as a source; use
`business-facts.md`. The root `README.md` is likewise a leftover "Website Build Kit" readme that
describes a generic workflow, not this project.
