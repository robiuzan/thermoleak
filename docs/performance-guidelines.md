# Performance guidelines — hard budgets

Enforceable numbers, not aspirations. A change that breaks a budget here does not ship.
`perf-a11y-auditor` audits against this file; `/performance-web-vitals` holds the technique.

**Measure before optimising.** The user-facing baseline is genuinely healthy — static HTML on a
global edge, one 33 KB raster, four SVGs — so do not manufacture findings to fill a report. But
"healthy" is not the same as "inside every budget": as of the 2026-09-06 re-baseline the export sits
at **98.5% of its size budget**, one JS chunk is over, and the tag budget is knowingly breached.
Those three are real and are stated as such in §1. Everything else here is fine.

---

## 1. The budgets

### Core Web Vitals — field targets (p75, mobile)

| Metric   | Target   | Fail     | Notes                                                                                                       |
| -------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| **LCP**  | ≤ 2.0 s  | > 2.5 s  | Stricter than Google's 2.5 s "good": we are static HTML on a global edge, so 2.5 s means something is wrong |
| **INP**  | ≤ 150 ms | > 200 ms | Three client components ship, plus GTM after hydration; anything approaching 200 ms means new JS arrived    |
| **CLS**  | ≤ 0.05   | > 0.1    | Every image is dimensioned and the sticky bar has a spacer; 0.1 means a reserve was dropped                 |
| **TTFB** | ≤ 300 ms | > 600 ms | Edge-served HTML. A sustained regression means an origin/config change                                      |

Lab (Lighthouse mobile, throttled): **Performance ≥ 95, Accessibility 100, Best Practices ≥ 95,
SEO 100.** Anything below is a defect, not a nice-to-have.

### Byte budgets — measured, not estimated

**Baseline re-measured 2026-09-06** against a clean build (22 routes: 22 `index.html` + `404.html`;
19 URLs in `sitemap.xml`). Every "Current" figure below is a byte count from that export, not an
estimate. Where a row is over budget it says so — an honest breach is worth more than a green tick
measured against the wrong yardstick, which is how the previous version of this table hid two of
these.

| Asset class                             | Budget                      | Current (2026-09-06)                                                                                                                |
| --------------------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Total `out/`                            | ≤ 6,000,000 B               | **5,910,433 B — 98.5% of budget** ⚠️ 220 files                                                                                      |
| ├ RSC segment payloads (`out/**/*.txt`) | _no budget — set one_       | **2,769,645 B / 158 files = 46.9% of the export**                                                                                   |
| ├ HTML                                  | —                           | 1,984,248 B / 23 files                                                                                                              |
| └ `out/_next` (JS, CSS, fonts)          | —                           | 936,350 B                                                                                                                           |
| Any single JS chunk                     | ≤ 200 KB (204,800 B)        | **226,355 B** (`3j9pm5otqxm82.js`, the React/Next runtime) ⚠️ breached                                                              |
| JS per route — framework floor          | _irreducible; not a target_ | 688,193 B across 9 chunks · 575,599 B modern-only (one 112,594 B chunk is `noModule`) · **168,200 B brotli on the wire**            |
| JS per route — **delta**                | **+0 B**                    | ✅ every route loads the identical 9 chunks                                                                                         |
| LCP image                               | ≤ 150 KB                    | `hero.webp` 33,210 B (828×670) ✅                                                                                                   |
| Any single image                        | ≤ 250 KB                    | `og.png` 128,363 B (never rendered on-page) ✅                                                                                      |
| Fonts preloaded per page                | ≤ 80 KB                     | 71,540 B — 4 faces ✅ (135,576 B on disk; the rest is `unicode-range`-gated, §4)                                                    |
| Client components                       | ≤ 4                         | 4 (`ContactForm`, `Navbar`, `ThankYouContent`, `ConsentBanner` — re-counted 2026-10-12; the live surfaces add none) ✅ at the limit |
| Runtime dependencies                    | ≤ 6                         | 4 ✅                                                                                                                                |
| Third-party JS                          | ≤ 50 KB gzipped             | ⚠️ ~90 KB (GTM) — **breached by an accepted decision**, see [data-tracking-infrastructure.md](data-tracking-infrastructure.md) §2   |

**On the RSC `.txt` payloads — the row that did not exist, which is how it grew unbudgeted.**
Next 16 emits each route's flight payload for `<Link>` prefetching, and it emits it **twice**:
`out/index.txt` and `out/__next._full.txt` are byte-identical (70,789 B each), and the `__next*.txt`
set alone is 1,415,029 B, so roughly 1.38 MB of the export is pure duplication. **This is navigation
prefetch, not first paint — it does not touch LCP** and should never be "optimised" by deleting
files from `out/`. It is deploy weight and a per-navigation origin fetch (§5), and it grows with
every route, which is why the export moved from ~3.9 MB to 5.91 MB when `/guides/` and `/locations/`
landed. **The 6 MB budget is now 98.5% consumed: the next silo breaches it.** Treat that as the
trigger to decide whether to raise the budget deliberately or to constrain route growth — not as
something to discover mid-sprint.

**Re-measured 2026-10-12 (fleet live-kit review, CLAUDE.md §14) — the budget is breached, and
raising it is the owner's decision.** The export deployed 2026-09-17 (`b954357`) is already
**6,014,717 B / 220 files** — over by 14,717 B since that deploy, unrecorded until now. The live
surfaces take a build to **6,927,304 B (115.5% of budget, +912,587 B; re-measured after the kit's
fixes of 2026-10-12 and the consent-mark script)**: HTML +389,655 B (≈16.9 KB per page — the calm,
head and consent-mark scripts, the bar carrying every line, and the card, each printed inline and
again in the page's own flight data), RSC payloads +500,274 B (≈7.9 KB in each of `index.txt`,
`__next._full.txt` and `__next._index.txt`, per route; 9.0 KB on the homepage, which adds the
strip), CSS +5,138 B and `assets/live.js` 17,052 B. A page's first load grows by ≈5 KB gzipped. Every line ships on every page by the kit's design (a static export
has no clock), so the adapter cannot trim it. Under this file's own rule the live surfaces do not
ship until the owner raises this budget deliberately.

**On the JS rows.** The old "≤ 120 KB per route, well under ✅" was never measured and is 4.7×
wrong against its own stated unit. The framework floor is what Next 16.2.9 + React 19.2.4 cost on
any route; it is not something this site can tune. So the enforceable budget is the **delta**: a new
dependency or a new client component is the only JS regression this site can realistically have, and
that is exactly what the +0 B row catches.

**A new dependency must survive "can the platform already do this?"** The answer is usually yes.

---

## 2. Non-negotiable architectural rules

1. **RSC by default.** `"use client"` only for state, effects or browser APIs, kept leaf-level and
   justified in a comment. Three client components exist and each is defensible.
2. **The FAQ stays `<details>`-based.** Native disclosure = zero JS, every answer in the DOM at
   first paint. It is simultaneously the fastest option, the most accessible, and what makes
   `FAQPage` schema honest and the content extractable by answer engines. Converting it to client
   state breaks all four.
3. **At most one `priority` image per page**, and it must be the LCP element — **and an
   above-the-fold image that is _not_ the LCP element must still be `loading="eager"`.** The second
   clause exists because the first one was over-applied: dropping the navbar logo's `priority`
   (correctly — it was preloading a ~40 px wordmark in competition with the hero) left it on
   `next/image`'s default, so the emitted markup is `loading="lazy"` on the topmost element of all
   22 routes. Lazy-loading an in-viewport image hides it from the preload scanner and the wordmark
   pops in after first paint. There is no CLS (the box is reserved), so this is a polish defect, not
   a budget breach — but it is the swing the rule now names. Open: `components/Logo.tsx` needs a
   `loading` pass-through, `components/Navbar.tsx` an eager instance; the footer copy stays lazy.
4. **Every image reserves its box.** Explicit `width`/`height`, or `fill` with a sized parent.
5. **No layout-shifting late content.** No client-injected banners, no post-hydration content swaps
   above the fold. See [mobile-ux-and-personalization.md](mobile-ux-and-personalization.md) §4 for
   why geo-personalisation must respect this.
   _The live surfaces (owner decision 2026-10-11, fleet live-kit — CLAUDE.md §14) keep to it: the
   announcement bar is in the HTML and its line is chosen by an inline `<head>` script **before**
   first paint (35 px, in flow, above the sticky header, not sticky); the seasonal card is a native
   `<dialog>` in the top layer, reserving no space; the homepage updates strip is server-rendered
   and, once stale, hidden before first paint. The one after-paint change is the fleet status
   switch removing the bar (`off`, `quiet` on a phone, or an unreadable switch) — a single shift
   that the next page applies before paint from a cached answer. Until the switch's CORS list
   includes this site's three origins the switch IS unreadable here: during a season a phone
   visitor would see the bar appear and then go (again every 5 minutes, when the cached
   "unreadable" expires), which is why the CORS step is part of the first deploy. **And a readable
   switch that answers later than 1.5 s** (a slow phone connection) costs TWO shifts, on every page
   view: in season the bar closes at the 1.5 s timeout and reopens when the late "normal" arrives —
   measured 2026-10-12 at 390×844, 0.0383 each (CLS ≈ 0.077 from the bar alone). "normal" is never
   cached, so the next page repeats it. That is the kit's timeout design (live.js), not this
   site's to change here — reported upstream._
6. **No render-blocking third-party anything.** Tags load async, after paint. One third party ships
   — GTM, via `next/script` `afterInteractive`, so the container is created after hydration and is
   absent from the static HTML entirely. That protects LCP and costs early-tap measurement; the
   trade is recorded at [data-tracking-infrastructure.md](data-tracking-infrastructure.md) §5.

---

## 3. Images

`next.config.ts` sets `images: { unoptimized: true }` — `next/image` emits a bare `<img>` with **no
srcset**. Consequence: passing `sizes` is _misleading_, it does nothing.

**All four** service illustrations are **SVG**, where this costs nothing. `public/images/` is
80 KB in total. What actually matters:

- **`hero.webp`** — the one raster LCP candidate. Measured: **33,210 B, 828×670 intrinsic**,
  rendered at ≤ 448 CSS px (`max-w-md`) on desktop and ~358 px on mobile, and preloaded. That is
  4.5× inside the LCP-image budget and correct as a single size for DPR 2+. **There is nothing to
  win here** — a width-variant exercise buys a few KB, so do not schedule it as a performance sprint
  item. `grep -rn 'sizes=' app/ components/` returns zero hits, so there is no misleading `sizes`
  to remove either.
- **`thermoleak_logo.webp`** — 18,480 B, fetched on every route. Not a weight problem; see §2 rule 3
  for its `loading` state.
- **`og.png`** — 128,363 B, never rendered on-page; its weight does not affect CWV.

**If a genuinely large raster ever lands, two viable paths — pick one deliberately, never mix:**

1. **Pre-generate width variants** and hand-write `srcset`/`sizes`. No config change, no host
   dependency, works with `unoptimized: true`.
2. **Cloudflare Image Resizing** (`/cdn-cgi/image/...`) — the zone is already proxied. Requires the
   feature enabled on the zone (owner action).

**Formats:** AVIF → WebP → JPEG fallback for photographs. Thermal images compress poorly in lossy
formats near the colour-ramp edges — check for banding at quality < 80.

**Every content image needs meaningful Hebrew `alt`**; decorative gets `alt=""`. Thermal images
need `alt` that describes the _finding_ — colour carries the entire information channel.

---

## 4. Fonts

Heebo (headings) + Assistant (body), self-hosted via `next/font/google` in `app/fonts.ts`, exposed
as CSS variables consumed by the `@theme` block. Correct setup.

Rules:

- `display: swap` — never `block`.
- **Subset to Hebrew + Latin only.** `app/fonts.ts` already declares `["hebrew", "latin"]` — **do
  not "fix" it**. Note what that does _not_ do: `next/font/google` still emits five `unicode-range`
  faces for Heebo (hebrew, latin, latin-ext, **MATH 23,772 B, SYMBOLS 14,244 B**) against
  Assistant's three, so 135,576 B sits on disk while ~38 KB of it is glyph data this site will never
  render. The browser never fetches it — `unicode-range` gates the download — which is why the
  budget is stated per _preloaded_ face (§1) and why this is a note, not a defect. Recorded so the
  next auditor does not chase it.
- **Preload only above-the-fold subsets.** ✅ shipped — the build emits exactly four
  `<link rel="preload" as="font">` tags per route (71,540 B); `next/font/google` does this by
  default, so there was never work owing here. Without a preload both families FOUT on first paint;
  preloading everything is as bad as preloading nothing.
- Fallback stack must be metric-compatible enough that swap does not shift layout (contributes to
  CLS).
- **Adding a third family requires deleting one.** Two is the budget.

---

## 5. Caching and delivery

Cloudflare Pages, edge-served worldwide.

| Asset                      | Policy                                                             | Where                                              | State                                                                                                                                                                                      |
| -------------------------- | ------------------------------------------------------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/_next/static/*`          | `public, max-age=31536000, immutable`                              | `public/_headers` — safe: content-hashed filenames | ✅ shipped, verified live                                                                                                                                                                  |
| HTML                       | Pages default (`DYNAMIC`, fresh per deploy)                        | Do not add per-request HTML caching                | ✅                                                                                                                                                                                         |
| RSC payloads (`/**/*.txt`) | Pages default (`DYNAMIC`, `max-age=0, must-revalidate`)            | Nothing declares them                              | **Accepted.** Every `<Link>` prefetch is an uncached origin round trip (~10 KB brotli). Correct for freshness; revisit only if prefetch volume ever shows up in the logs                   |
| Images in `public/`        | Long-lived, but **not** immutable unless hashed — rename on change | `public/_headers`                                  | 🔴 **not implemented.** No `/images/*` rule exists, so a Cloudflare **zone default** (`max-age=14400, must-revalidate`) owns the policy for the preloaded LCP hero and the every-page logo |

**The `/images/*` gap is the one actionable row.** The mechanism demonstrably works — the fonts come
back `max-age=31536000, immutable` from the same file — so this is a missing four-line block, not a
platform limit. The fix is an append to `public/_headers` (`Cache-Control: public, max-age=2592000`,
**no** `immutable`, because the filenames are not content-hashed and rename-on-change is the
invalidation path). Header edits are inert until a deploy, and `out.prev/_headers` is the rollback
snapshot — never hand-edit it.

**Do not cache HTML at the edge with a long TTL.** A stale page after a deploy costs more than the
milliseconds saved, and Pages already serves HTML from the edge. There is nothing to purge on
deploy — which is why the deploy pipeline deliberately has no purge step.

---

## 6. Build hygiene

```bash
rm -rf .next out && npm run lint && npm run build
```

The `rm -rf .next` matters: a polluted `.next/` from a `next dev` session can leak dev-only chunks
into the export. If you ever see multi-megabyte `main.js` or `fallback/*` in `out/`, that is the
cause — deleting files from `out/` afterwards is not the fix.

**Always check `out/` is newer than the last commit before measuring anything.** This export has
repeatedly been stale; measuring it means optimising an artifact nobody serves.

---

## 7. Measurement protocol

The auditor reads the artifact; it does not measure a browser. For real numbers:

1. **Lighthouse / PSI against the live URL**, mobile profile, at least 3 runs (take the median).
2. **Test a service page and the homepage separately** — different LCP elements.
3. **Field data in Search Console** (Core Web Vitals report) once traffic supports it — field beats
   lab whenever they disagree.
4. Re-measure **after deploy**, not after build.

The commands that reproduce every number in §1 — run them, do not re-estimate:

```bash
# total export size, and the budget as an assertion (exit 1 = breached)
find out -type f -printf '%s\n' | awk '{s+=$1;n++} END {print s" bytes / "n" files"; exit (s>6000000)}'
# the asset class that is half the export
find out -name '*.txt'    -printf '%s\n' | awk '{s+=$1;n++} END {print "txt   "s" / "n}'
find out -name '*.html'   -printf '%s\n' | awk '{s+=$1;n++} END {print "html  "s" / "n}'
# the duplication: these two must be byte-identical, per route
cmp out/index.txt out/__next._full.txt && echo "payload emitted twice (expected)"
# JS actually loaded by a route, and the single-chunk budget
grep -o '/_next/static/chunks/[a-z0-9_.-]*\.js' out/index.html | sort -u \
  | while read f; do stat -c '%s %n' "out$f"; done | awk '{s+=$1;print} END {print "SUM "s}'
find out -name '*.js' -size +200k -exec ls -lh {} \;
# fonts the browser actually fetches
grep -o 'href="/_next/static/media/[^"]*"' out/index.html | sort -u | wc -l   # expect 4
ls -l public/images/
grep -c srcset out/index.html                                                 # expect 0
```

Live, after a deploy (edge state is verified, never inferred):

```bash
# §5: currently answers with the zone default, max-age=14400
curl -sSI https://thermoleak.co.il/images/hero.webp | grep -i cache-control
# control case — the same _headers file does produce immutable where a rule exists
curl -sSI "https://thermoleak.co.il$(grep -o '/_next/static/media/[^"]*\.woff2' out/index.html | head -1)" | grep -i cache-control
```

---

## 8. Regression triggers — re-run the full pass when any of these change

- A new `"use client"` component
- A new dependency
- A new above-the-fold image
- Any font change
- Tag manager / analytics installation ← **the highest-risk change on this list**
- Any `_headers` edit
- **A new route silo** — `/guides/` and `/locations/` together added ~1.87 MB to the export, almost
  all of it RSC payload (§1). At 98.5% of budget this is now the trigger that matters most
- The i18n build landing (doubles the route count)

> **This list only works if someone runs it.** It did not run once between 2026-08-30 and
> 2026-09-06, while four commits landed that hit three of these triggers at once — the analytics
> install, two new silos and an `_headers` edit — which is how a table of unmeasured estimates
> survived the sprints that invalidated it. **§1's 2026-09-06 re-baseline is the reference point
> now, and every figure in it is a byte count.** When you trip a
> trigger, re-measure with §7's commands and update §1's Current column in the same commit that
> caused the change.
