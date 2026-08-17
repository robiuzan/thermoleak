---
name: qa-build-gate
description: The release gate before any push to main — clean build and lint, a route-count assertion, title/canonical/H1/JSON-LD greps, sitemap parity with the emitted tree, the orphan check, the fabricated-rating stop-ship, and the auditor sweep. Use before every commit to main or when asked whether the site is ready to ship. Triggers "run the build gate", "is this ready to ship", "pre-deploy check", "QA the site", "verify the build".
---

# Build gate

Everything here runs against `out/` — the artifact that actually ships. A passing `npm run build` is the
start of this gate, not the end of it.

**On this repo the gate matters more than usual: pushing to `main` deploys to production.** There is no
staging environment and no manual approval step. Run this *before* you commit.

## 1. Clean build

```bash
rm -rf .next out
npm run lint && npm run build
```

There is no `typecheck` or `format:check` script — `next build` type-checks the whole app, and it is the
only gate. Add `npx tsc --noEmit` if you want the type errors faster than a full build.

**The `rm -rf .next` matters.** A polluted `.next/` from a `next dev` session can leak dev-only chunks
into the export. The last clean build measured **3.9 MB with no JS chunk over 500 KB** — if you see
multi-megabyte `main.js` or `fallback/*` files, that's the cause, and deleting files from `out/`
afterwards is not the fix.

## 2. Route count

```bash
find out -name index.html | wc -l          # expect 14 (11 indexable + /thank-you/ + /404/ + /_not-found/)
grep -c '<url>' out/sitemap.xml            # expect 11 (/thank-you/ is noindex and excluded)
test -f out/robots.txt && echo ok
test -f out/404.html && echo ok            # .htaccess ErrorDocument points here
```

If the counts move, something was added or dropped. Reconcile before shipping — `staticRoutes` in
`app/sitemap.ts` is hand-maintained, so a new page can build fine and be silently absent from the
sitemap (backlog §1.2).

## 3. Titles — the brand-token check

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

Also confirm no two content routes share a `<title>` or a `<meta name="description">`.

## 4. Canonicals

```bash
grep -rL 'rel="canonical"' out --include=index.html
# expect exactly: /404/, /_not-found/, /thank-you/ (noindex pages carry no canonical on purpose)
```

Every indexable page needs exactly one self-referencing canonical with a trailing slash.

## 5. One H1

```bash
for f in $(find out -name index.html); do
  n=$(grep -o '<h1' "$f" | wc -l); [ "$n" -ne 1 ] && echo "$f: $n";
done
```

Expect no output. Currently clean on all 13 pages.

## 6. Structured data — including the stop-ship

```bash
grep -rL 'application/ld+json' out --include=index.html      # pages with no schema — expect none
grep -rl 'BreadcrumbList' out --include=index.html | wc -l   # expect 10 (every PageHero page)
grep -rl 'aggregateRating' out --include=index.html | wc -l  # MUST be 0 until sourced (removed 2026-08-17)
grep -rl 'sameAs\|GeoCoordinates' out --include=index.html | wc -l  # MUST be 0 until real values exist
```

**A non-zero on either of the last two is a stop-ship.** The fabricated 4.9 rating, the placeholder
`sameAs` and the placeholder `geo` were all removed 2026-08-17 (`docs/schema-graph.md` §4); they
return only with real, verifiable values from `docs/business-facts.md` §B/§E.

Breadcrumb parity is structural now: `PageHero` itself emits `BreadcrumbList` from the same
`crumbs` array it renders, so the count equals the number of pages using `PageHero` with crumbs.
A page calling `breadcrumbJsonLd` directly is a double-emission bug.

## 7. Sitemap parity

```bash
find out -name index.html | sed 's|^out||; s|index.html$||' | sort > /tmp/emitted.txt
grep -o '<loc>[^<]*</loc>' out/sitemap.xml | sed 's|</\?loc>||g; s|https://thermoleak.co.il||' \
  | sort > /tmp/sitemap.txt
diff /tmp/emitted.txt /tmp/sitemap.txt
```

`/404/`, `/_not-found/` and `/thank-you/` are expected to differ — all three are correctly excluded
from the sitemap (`/thank-you/` because it is noindex). Nothing else should.

## 8. Orphans

```bash
grep -rho 'href="/[^"]*"' out --include=index.html | sed 's|href="||; s|"$||' | sort -u > /tmp/linked.txt
comm -23 /tmp/emitted.txt /tmp/linked.txt
```

Expected output: exactly `/404/`, `/_not-found/` and `/thank-you/` (reached only via the form's
post-submit navigation, by design). Anything else is a new orphan.

## 9. Output weight

```bash
du -sh out                                            # ~3.9 MB
find out -name '*.js' -size +500k -exec ls -lh {} \;  # expect nothing
```

## 10. Content floors

Spot-check that no page regressed below `docs/content-standards.md` §1. Strip tags **and scripts**,
subtract ~110 words of chrome:

```bash
for f in $(find out -name index.html | sort); do
  w=$(perl -0777 -pe 's{<script.*?</script>}{}gs; s{<style.*?</style>}{}gs; s{<[^>]*>}{ }gs' "$f" \
      | tr -s " \t\n" "\n" | grep -c '[^[:space:]]')
  printf "%5s  %s\n" "$w" "${f#out}"
done
```

Baseline totals (chrome included, measured 2026-08-17): `/` 814 · services 559–655 ·
`/pricing/` 516 · `/services/` 452 · `/about/` 382 (still under floor — blocked on business-facts
§A) · `/privacy/` 252 · `/accessibility/` 235 · `/contact/` 231. A route dropping below its
2026-08-17 number is a content regression.

## 11. Auditor sweep

For a substantive change, run the relevant agents against the fresh `out/`:

| Changed                     | Run                  |
| --------------------------- | -------------------- |
| metadata, routes, sitemap   | `seo-auditor`        |
| JSON-LD                     | `schema-auditor`     |
| copy, claims, reviews       | `eeat-trust-auditor` |
| components, images, colours | `perf-a11y-auditor`  |
| headers, form, deps         | `security-auditor`   |
| any TS/React                | `ts-react-reviewer`  |

## Stop-ship list

- **`aggregateRating` or `Review` in the export without a verifiable public source.**
- A `<title>` with the brand zero times or twice.
- A missing or non-self-referencing canonical.
- Zero or multiple `<h1>` on any page.
- A route in `out/` missing from `sitemap.xml`.
- A new orphan beyond the two 404 artifacts.
- Any unreferenced file over 1 MB under `out/`.
- `lint` or `build` failing.
- A live claim that `docs/business-facts.md` marks 🔶.
- A contrast regression that makes `/accessibility/` untrue.

## Then

`/deploy-thermoleak` — and remember the deploy **is** the push. Nothing else stands between this gate
and production.
