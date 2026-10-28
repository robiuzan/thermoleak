---
name: qa-build-gate
description: The release gate before any push to main — an out/ freshness guard, clean build and lint, route-count and sitemap parity via npm run check:sitemap, title/canonical/OG/H1/JSON-LD greps, the orphan check, a no-PII-in-tagged-hrefs check, the fabrication stop-ship, and the auditor sweep. Use before every commit to main or when asked whether the site is ready to ship. Triggers "run the build gate", "is this ready to ship", "pre-deploy check", "QA the site", "verify the build".
---

# Build gate

Everything here runs against `out/` — the artifact that actually ships. A passing `npm run build` is the
start of this gate, not the end of it.

Run the sections **in order**. §1 establishes that `out/` is the build you think it is; every
assertion after it is worthless if that one is skipped. Numbers below were measured 2026-09-06 on a
clean build at `d712419`, except the route counts, parity output and export weight, re-measured
2026-10-28 on the local build that added nine city pages. A section that says "expect N" means N
passed that day — if yours differs, reconcile it, don't quietly adopt it.

Pushing to `main` does **not** deploy (build-only CI); production ships via `/deploy-thermoleak`
(wrangler → Cloudflare Pages). Run this gate before every deploy — and still before commits, since
CI runs the same build.

## 1. Freshness — is `out/` the build you think it is?

`out/` is gitignored and routinely stale. CLAUDE.md rule 10 forbids auditing it without checking, and
every assertion below reads it, so this runs **first** — before any grep, not after a surprising one.

```bash
newest=$(find out -type f -printf '%T@\n' | sort -n | tail -1)
head_ts=$(git log -1 --format=%ct)
dirty=$(git status --porcelain -- app components lib public next.config.ts | wc -l)
if [ "${newest%.*}" -ge "$head_ts" ] && [ "$dirty" -eq 0 ]; then
  echo "FRESH — out/ is newer than HEAD and no source file is uncommitted"
else
  echo "STALE — rebuild before asserting anything (newest=$newest head=$head_ts dirty=$dirty)"
fi
```

`STALE` is not a finding about the site — it is a finding about your evidence. Rebuild (§2) and start
again. Reporting a defect measured on a stale export is how a gate loses its authority, which is the
same failure shape as the 15-day rsync incident: a green signal that was never looking at the artifact
it claimed to be checking.

## 2. Clean build

```bash
rm -rf .next out
npm run lint && npm run build && npm run check:sitemap
```

There is no `typecheck` or `format:check` script — `next build` type-checks the whole app, and it is the
only gate. Add `npx tsc --noEmit` if you want the type errors faster than a full build.

`npm run check:sitemap` (`scripts/check-sitemap-parity.mjs`) belongs in the same breath as the build.
It is cited all over this repo and is cheap; run it every time rather than assuming it passed. It
currently prints `sitemap parity OK — 31 routes emitted, 28 indexed, 3 deliberately excluded; llms.txt 29 URL(s), all live.`

The build can also fail on the city graph: since 2026-10-28 a module-scope check in
`lib/locations.ts` rejects an unknown or one-way `nearby` slug. Fix the edge on both cities; never
remove the check.

**The `rm -rf .next` matters.** A polluted `.next/` from a `next dev` session can leak dev-only chunks
into the export. The 2026-09-06 clean build measured **5,910,433 bytes (5.64 MiB), largest JS chunk
226 KB** (2026-10-28: 11,212,389 B raw, §12) — if you see multi-megabyte `main.js` or `fallback/*`
files, that's the cause, and deleting files from `out/` afterwards is not the fix.

## 3. Route count

```bash
find out -name index.html | wc -l          # expect 31 (28 indexable + /thank-you/ + /404/ + /_not-found/)
grep -c '<url>' out/sitemap.xml            # expect 28 (/thank-you/ is noindex and excluded)
test -f out/robots.txt && echo ok
test -f out/llms.txt && echo ok
test -f out/404.html && echo ok            # Cloudflare Pages serves this as the custom 404
test -f out/_headers && test -f out/_redirects && echo ok   # Pages headers/redirects shipped
```

The 28 indexed routes, in full — anything else in the sitemap is new and wants explaining:

`/` · `/services/` · `/services/water-leak-detection/` · `/services/moisture-detection/` ·
`/services/electrical-thermography/` · `/services/insurance-reports/` · `/pricing/` · `/guides/` ·
`/guides/what-a-thermal-camera-sees/` · `/guides/find-leak-without-breaking/` ·
`/guides/leak-detection-cost/` · `/locations/` · `/locations/tel-aviv/` · `/locations/holon/` ·
`/locations/bat-yam/` · `/locations/ramat-gan/` · `/locations/givatayim/` · `/locations/herzliya/` ·
`/locations/petah-tikva/` · `/locations/rishon-lezion/` · `/locations/raanana/` ·
`/locations/kfar-saba/` · `/locations/rosh-haayin/` · `/locations/modiin/` · `/about/` ·
`/contact/` · `/accessibility/` · `/privacy/`

If the counts move, something was added or dropped. Reconcile before shipping — `staticRoutes` in
`app/sitemap.ts` is hand-maintained, so a new page can build fine and be silently absent from the
sitemap. That is what `npm run check:sitemap` exists to catch (§9); the raw counts here are the
human-readable cross-check on it, not a substitute.

## 4. Titles — the brand-token check

```bash
grep -rho '<title>[^<]*</title>' out --include=index.html | sort | uniq -c | sort -rn
```

Read them. Each content route's title must contain `טרמוליק` **exactly once**. Both historical
bugs were fixed 2026-08-17 — the regression traps to watch:

- `app/page.tsx` must keep a **complete** title including the brand (the root layout's `template`
  doesn't apply to its own page — a "bare subject" there ships brandless).
- No other page's title may contain the brand (the template appends it).

Note: don't grep for a doubled brand across whole files — the JSON-LD legitimately repeats it.
Check the extracted `<title>` list above, not the raw HTML.

Also confirm no two **indexed** routes share a `<title>` or a `<meta name="description">`. Currently
clean: the only duplicate group is `/404/`, `/_not-found/` and `/thank-you/`, which share the site
defaults and are all excluded from the sitemap.

While you are in the head tags: `twitter:title` used to stay generic on the routes that set their
own `og:title` (part of SEO-01, §6). It was fixed with the rest of SEO-01 on 2026-09-17:
`pageOpenGraph()` returns one block for both `openGraph` and `twitter`, so the two now match. A
generic `twitter:title` on a content route is a regression.

## 5. Canonicals

```bash
grep -rL 'rel="canonical"' out --include=index.html
# expect exactly: /404/, /_not-found/, /thank-you/ (noindex pages carry no canonical on purpose)
```

Every indexable page needs exactly one self-referencing canonical with a trailing slash.

## 6. Open Graph parity — the check that was missing

Next shallow-merges `metadata` at the **top-level key only**: a page that declares its own
`openGraph` object _replaces_ the root layout's rather than merging into it. A page can therefore
build green, pass every check above, and still ship with no share image. Nothing in this gate ever
looked for it, which is how it survived three sprints.

```bash
# a. every page must carry an og:image
grep -rL 'property="og:image"' out --include=index.html

# b. og:url must equal that page's own canonical
for f in $(find out -name index.html); do
  c=$(grep -o '<link rel="canonical" href="[^"]*"' "$f" | sed 's/.*href="//;s/"$//')
  [ -z "$c" ] && continue
  u=$(grep -o '<meta property="og:url" content="[^"]*"' "$f" | sed 's/.*content="//;s/"$//')
  [ "$u" != "$c" ] && echo "${f#out}  og=$u  canon=$c"
done
```

**Both must return empty; a non-empty result is a stop-ship.** This was finding SEO-01, fixed
2026-09-17 (`b954357`): every indexed route except `/` (which keeps the layout's block) builds its
tags with `pageOpenGraph()` in `lib/site.ts`. Both checks return empty on the 2026-10-28 build of 31 routes. Before the fix, check
(a) returned the ten routes that declared their own `openGraph` (four services, three guides, the
three cities of the day), and check (b) eight hub and static routes whose `og:url` was the homepage.
A new route that hand-writes its `openGraph` instead of calling the helper is how it comes back.
Every one of the 28 indexed routes also carries a correct self-referencing `rel=canonical`.

## 7. One H1

```bash
for f in $(find out -name index.html); do
  n=$(grep -o '<h1' "$f" | wc -l); [ "$n" -ne 1 ] && echo "$f: $n";
done
```

Expect no output. Currently clean on all 31 pages.

## 8. Structured data — including the stop-ship

```bash
grep -rL 'application/ld+json' out --include=index.html      # pages with no schema — expect none
grep -rl 'BreadcrumbList' out --include=index.html | wc -l   # expect 27 (every PageHero page — all but /, /thank-you/ and the two 404 artifacts)
grep -rl 'aggregateRating' out --include=index.html | wc -l  # MUST be 0 until sourced (removed 2026-08-17)
grep -rl '"@type":"Review"' out --include=index.html | wc -l # MUST be 0 — same purge
grep -rl 'sameAs\|GeoCoordinates' out --include=index.html | wc -l  # MUST be 0 until real values exist
grep -rl 'facebook\.com\|instagram\.com' out --include=index.html | wc -l  # MUST be 0 — the purged sameAs targets
```

**The four MUST-be-0 greps are the load-bearing part of this gate. They still pass, they were
verified 2026-09-06, and a numeric refresh elsewhere in this file must never sweep them away.** A
non-zero on any of them is a stop-ship. The fabricated 4.9 rating, the six invented testimonials, the placeholder
`sameAs` and the placeholder `geo` were all removed 2026-08-17 (`docs/schema-graph.md` §4); they
return only with real, verifiable values from `docs/business-facts.md` §B/§E.

The purged **statistics** need a text-scoped grep, not a raw one — `4.9` matches SVG path data and
`97%` matches inline CSS on every page, so a naive `grep -rl` reports one false positive per page
(31 on 2026-10-28):

```bash
for f in $(find out -name index.html); do
  hit=$(perl -0777 -pe 's{<(script|style)\b.*?</\1>}{}gsi; s{<[^>]*>}{ }gs' "$f" \
        | grep -oE '4[.,]9|3,?000\+|97%' | sort -u | tr '\n' ' ')
  [ -n "$hit" ] && echo "${f#out}: $hit"
done
```

Expect no output. Any hit means the 4.9 rating, the 3,000+ job count or the 97% success rate has come
back into visible copy.

Breadcrumb parity is structural now: `PageHero` itself emits `BreadcrumbList` from the same
`crumbs` array it renders, so the count equals the number of pages using `PageHero` with crumbs.
A page calling `breadcrumbJsonLd` directly is a double-emission bug.

## 9. Parity — sitemap, then llms.txt

```bash
npm run check:sitemap
# sitemap parity OK — 31 routes emitted, 28 indexed, 3 deliberately excluded; llms.txt 29 URL(s), all live.
```

`scripts/check-sitemap-parity.mjs` is the assertion; it exits non-zero on drift. It does not just
diff two lists — every emitted route must be **either** in the sitemap **or** on its
`INTENTIONALLY_EXCLUDED` map with a stated reason (`/thank-you/`, `/404/`, `/_not-found/`). Adding a
page therefore forces a deliberate choice. Extend that map rather than loosening the check.

Fallback if the script is unavailable, and the way to see the two sets by eye:

```bash
find out -name index.html | sed 's|^out||; s|index.html$||' | sort > /tmp/emitted.txt
grep -o '<loc>[^<]*</loc>' out/sitemap.xml | sed 's|</\?loc>||g; s|https://thermoleak.co.il||' \
  | sort > /tmp/sitemap.txt
diff /tmp/emitted.txt /tmp/sitemap.txt
```

Then the same question for the AEO pointer file, which nothing else checks:

```bash
grep -o '<loc>[^<]*</loc>' out/sitemap.xml | sed 's|</\?loc>||g' | sort \
  | while read -r u; do grep -qF "$u" out/llms.txt || echo "missing from llms.txt: $u"; done
```

`public/llms.txt` is a **pointer file, not a mirror** — the legal pages may legitimately be absent.
The other direction (every llms.txt URL is in the sitemap) is enforced by `npm run check:sitemap`;
this loop is the advisory half. It prints nothing on the 2026-10-28 build: the file lists every
sitemap URL, all 12 city pages included. It once omitted the whole `/guides/` and `/locations/` silo
for two sprints (AEO-1 / SEO-06 / LOC-10) — a new route without an llms.txt line in the same commit
is how that happened.

## 10. Orphans

```bash
find out -name index.html | sed 's|^out||; s|index.html$||' | sort > /tmp/emitted.txt
# The live-kit's announcement bar and seasonal card are on every page (hidden until their season):
# strip them as chrome, or a page linked only from a seasonal line would pass as linked (CLAUDE.md §14).
find out -name index.html -exec perl -0pe 's/<div class="live-topbar".*?<\/div><\/div>//gs; s/<div class="live-dialogs".*?<\/dialog><\/div>//gs' {} + \
  | grep -o 'href="/[^"]*"' | sed 's|href="||; s|"$||' | sort -u > /tmp/linked.txt
comm -23 /tmp/emitted.txt /tmp/linked.txt
```

Expected output: exactly `/404/`, `/_not-found/` and `/thank-you/` (reached only via the form's
post-submit navigation, by design). Anything else is a new orphan.

**Live surfaces (CLAUDE.md §14):** `npm run build` runs their gates in `prebuild`/`postbuild` — an
unapproved register fails the build, and `LIVE_DRAFT=1` (local preview only) leaves
`out/.live-draft`, which `deploy-site.ps1` refuses, `-DeployOnly` included (fixed 2026-10-12).
The next deploy discards a draft `out/` instead of rotating it into `out.prev/`, the rollback copy,
and `check-live-out` keeps the marker while either register lacks `approved` (a standalone re-run
cannot clear it).

## 11. No PII in any tagged href

Every `data-cta` element is a deliberate GTM click-trigger target, and GTM's built-in Click URL
variable captures the element's **full href, query string included**, into a container this repo does
not control. So an href is not a private place to carry a lead's details.

```bash
grep -rhoE '(href="[^"]*"[^>]*data-cta="[^"]*"|data-cta="[^"]*"[^>]*href="[^"]*")' out --include=index.html \
  | grep -E '%D7%A9%D7%9D%3A|%D7%98%D7%9C%D7%A4%D7%95%D7%9F%3A|[?&](name|phone|email|tel)='
```

`%D7%A9%D7%9D%3A` and `%D7%98%D7%9C%D7%A4%D7%95%D7%9F%3A` are `שם:` and `טלפון:` URL-encoded — the
labels `ContactForm` puts in the WhatsApp handoff message. Expect no output; the static export is
clean today.

**A clean grep here is necessary, not sufficient.** The static HTML only ever carries the generic
prefill; the leak in finding **SEC-3** appears _after hydration_, when `/thank-you/` rebuilds the
WhatsApp href from `sessionStorage` and the visitor's name and mobile number land in a live `href`
that is tagged `data-cta="thankyou-whatsapp"`. That is an open code defect. The only check that sees
it is the live one, which `docs/implementation-roadmap.md` already mandates and which has never been
run: **submit the form, land on `/thank-you/`, then inspect the rendered anchor and the Network tab —
the request, not the config** — and confirm no `/g/collect` call carries the name or the phone.

## 12. Output weight

```bash
find out -type f -printf '%s\n' | awk '{s+=$1} END {print s; exit (s>15000000)}'  # 15 MB since 2026-10-28; measured 11,212,389 raw, 10,643,189 minus carried chunks
find out -name '*.js' -size +250k -exec ls -lh {} \;                            # expect nothing
du -sb out/_next                                                                # measured 936,350
```

The shape on 2026-09-06, so a surprise is recognisable: **5,910,433 B total (5.64 MiB)** — `.txt`
2,769,645 B (46.9%), `.html` 1,984,248 B (33.6%), `.js` 722,262 B (12.2%), the rest fonts, `og.png`,
CSS and icons. Largest JS chunk **226,355 B**; `public/images/` was only ~80 KB because the service art
is SVG — since 2026-10-22 the homepage gallery adds WebP files (eleven since 2026-10-27, 540,802 B).

**2026-10-28, with all 12 city pages:** 11,212,389 B raw / 378 files, of which 569,200 B (65 files)
are earlier builds' carried chunks — **10,643,189 B, 71.0% of the 15,000,000 B budget**, leaving
4,356,811 B. Each city page costs 302–308 KB, so that is the unit to budget a new content page at.

That `.txt` figure is not a defect to chase. It is Next 16's RSC flight payloads, emitted **twice per
route** — `index.txt` and `__next._full.txt`, byte-identical, 158 files — so roughly 1.38 MB is pure
duplication. They are navigation **prefetch**, not first paint, so they cost deploy weight and nothing
in LCP. Don't delete them from `out/` to make a number look better.

## 13. Content floors

Spot-check that no page regressed below `docs/content-standards.md` §1. Strip tags **and scripts**,
subtract ~110 words of chrome:

```bash
for f in $(find out -name index.html | sort); do
  w=$(perl -0777 -pe 's{<script.*?</script>}{}gs; s{<style.*?</style>}{}gs; s{<[^>]*>}{ }gs' "$f" \
      | tr -s " \t\n" "\n" | grep -c '[^[:space:]]')
  printf "%5s  %s\n" "$w" "${f#out}"
done
```

Baseline totals, **chrome included**, measured 2026-09-06 on all 19 indexed routes. A route dropping
below its number here is a content regression:

| Route                                 | Words | Route                                | Words |
| ------------------------------------- | ----- | ------------------------------------ | ----- |
| `/`                                   | 1063  | `/about/`                            | 696   |
| `/guides/what-a-thermal-camera-sees/` | 1032  | `/services/water-leak-detection/`    | 661   |
| `/guides/find-leak-without-breaking/` | 939   | `/pricing/`                          | 640   |
| `/guides/leak-detection-cost/`        | 891   | `/services/moisture-detection/`      | 597   |
| `/locations/tel-aviv/`                | 855   | `/services/electrical-thermography/` | 585   |
| `/locations/bat-yam/`                 | 788   | `/services/insurance-reports/`       | 565   |
| `/locations/holon/`                   | 784   | `/services/`                         | 458   |
| `/locations/`                         | 450   | `/contact/`                          | 362   |
| `/guides/`                            | 357   | `/privacy/`                          | 258   |
| `/accessibility/`                     | 241   |                                      |       |

**These are raw counts; the floors in `docs/content-standards.md` §1 are on _unique_ words.** Subtract
the ~110-word chrome constant before comparing. On that arithmetic every route clears its floor
except two guides — `/guides/find-leak-without-breaking/` (~829) and `/guides/leak-detection-cost/`
(~781) against the 900-word article floor. Treat that as _check it_, not _fail it_: the ~110 constant
was measured on the 404 page, which carries no breadcrumb trail and no related-links block, so it
understates chrome on a guide. Verify against `docs/content-standards.md` §1 before shipping a change
to either.

_2026-10-28:_ the table predates the nine new city pages, which measure 949–997 raw (446–469 unique
non-chrome words); the first three now measure 409–461 unique. The footer has listed all 12 cities on
every page since then, so the chrome constant has grown too — re-measure it on `/404/` before
subtracting.

## 14. Auditor sweep

For a substantive change, run the relevant agents against the fresh `out/`:

| Changed                     | Run                      |
| --------------------------- | ------------------------ |
| metadata, routes, sitemap   | `seo-auditor`            |
| JSON-LD                     | `schema-auditor`         |
| copy, claims, reviews       | `eeat-trust-auditor`     |
| components, images, colours | `perf-a11y-auditor`      |
| headers, form, deps         | `security-auditor`       |
| form, CTAs, funnel          | `cro-conversion-auditor` |
| any TS/React                | `ts-react-reviewer`      |

**Verify edge state, never infer it.** An auditor that reasons from what a doc _says_ ships will
confirm whatever the doc claims; run the grep against `out/`.

Last step, and the one that keeps this file honest: if the change made any statement in `CLAUDE.md`,
`docs/`, `.claude/agents/` or `.claude/skills/` false — a route count, a component list, an "it
doesn't exist yet" — fix it in the **same commit**. Every stale assertion in this gate got that way by
someone shipping the code and leaving the sentence.

## Stop-ship list

- **`aggregateRating`, `Review`, `sameAs`, `GeoCoordinates`, or a facebook.com/instagram.com link in
  the export** — any of them without a verifiable public source in `docs/business-facts.md` §B/§E.
- The 4.9 rating, the 3,000+ job count or the 97% success rate back in visible copy (§8).
- A `<title>` with the brand zero times or twice.
- A missing or non-self-referencing canonical.
- A route with no `og:image`, or an `og:url` that is not its own canonical (§6 — SEO-01 regressing).
- Zero or multiple `<h1>` on any page.
- A route in `out/` missing from `sitemap.xml` — i.e. `npm run check:sitemap` exiting non-zero.
- A new orphan beyond `/404/`, `/_not-found/` and `/thank-you/`.
- A `data-cta` href carrying a visitor's name, phone or email (§11).
- `out/` past the 15,000,000 B budget (§12), or any JS chunk over 250 KB.
- Any unreferenced file over 1 MB under `out/`.
- `lint` or `build` failing.
- A live claim that `docs/business-facts.md` marks 🔶.
- A contrast regression that makes `/accessibility/` untrue.
- An article edited without its `dateModified` bumped — `app/sitemap.ts` feeds that date straight to
  the sitemap, so a stale one tells crawlers nothing changed.

Not on this list, deliberately: the **open** defect §11 describes (SEC-3). (SEO-01, which this line
also named, was fixed 2026-09-17 and §6 is a stop-ship now.) It is tracked, it predates your change,
and blocking every release on it would only teach the next agent to skip the gate. Confirm it has not
grown; do not let it stop a shipment it did not cause.

## Then

`/deploy-thermoleak` — dry run first, `-Confirm` only when asked. **Pushing to `main` does not
deploy**; the wrangler upload is the production mutation, and this gate is the last thing that runs
before it.
