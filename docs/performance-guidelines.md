# Performance guidelines — hard budgets

Enforceable numbers, not aspirations. A change that breaks a budget here does not ship.
`perf-a11y-auditor` audits against this file; `/performance-web-vitals` holds the technique.

**Measure before optimising.** This site's baseline is genuinely healthy — do not manufacture
findings to fill a report.

---

## 1. The budgets

### Core Web Vitals — field targets (p75, mobile)

| Metric | Target | Fail | Notes |
| --- | --- | --- | --- |
| **LCP** | ≤ 2.0 s | > 2.5 s | Stricter than Google's 2.5 s "good": we are static HTML on a global edge, so 2.5 s means something is wrong |
| **INP** | ≤ 150 ms | > 200 ms | Only two client components ship; anything approaching 200 ms means new JS arrived |
| **CLS** | ≤ 0.05 | > 0.1 | Every image is dimensioned and the sticky bar has a spacer; 0.1 means a reserve was dropped |
| **TTFB** | ≤ 300 ms | > 600 ms | Edge-served HTML. A sustained regression means an origin/config change |

Lab (Lighthouse mobile, throttled): **Performance ≥ 95, Accessibility 100, Best Practices ≥ 95,
SEO 100.** Anything below is a defect, not a nice-to-have.

### Byte budgets — per page, uncompressed

| Asset class | Budget | Current |
| --- | --- | --- |
| Total `out/` | ≤ 6 MB | ~3.9 MB ✅ |
| Any single JS chunk | ≤ 200 KB | none > 500 KB ✅ |
| Total JS per route | ≤ 120 KB | well under ✅ |
| LCP image | ≤ 150 KB | `hero.webp` — measure |
| Any single image | ≤ 250 KB | — |
| Fonts total | ≤ 120 KB | Heebo + Assistant subset |
| Client components | ≤ 4 | 3 (`ContactForm`, `Navbar`, `ThankYouContent`) ✅ |
| Runtime dependencies | ≤ 6 | 4 ✅ |

**A new dependency must survive "can the platform already do this?"** The answer is usually yes.

---

## 2. Non-negotiable architectural rules

1. **RSC by default.** `"use client"` only for state, effects or browser APIs, kept leaf-level and
   justified in a comment. Three client components exist and each is defensible.
2. **The FAQ stays `<details>`-based.** Native disclosure = zero JS, every answer in the DOM at
   first paint. It is simultaneously the fastest option, the most accessible, and what makes
   `FAQPage` schema honest and the content extractable by answer engines. Converting it to client
   state breaks all four.
3. **At most one `priority` image per page**, and it must be the LCP element. The navbar logo's
   `priority` was removed 2026-08-17 — it was preloading a ~40 px logo in competition with the hero.
4. **Every image reserves its box.** Explicit `width`/`height`, or `fill` with a sized parent.
5. **No layout-shifting late content.** No client-injected banners, no post-hydration content swaps
   above the fold. See [mobile-ux-and-personalization.md](mobile-ux-and-personalization.md) §4 for
   why geo-personalisation must respect this.
6. **No render-blocking third-party anything.** Tags load async, after paint. See
   [data-tracking-infrastructure.md](data-tracking-infrastructure.md).

---

## 3. Images

`next.config.ts` sets `images: { unoptimized: true }` — `next/image` emits a bare `<img>` with **no
srcset**. Consequence: passing `sizes` is *misleading*, it does nothing.

Three of four service illustrations are **SVG**, where this costs nothing. What actually matters:

- **`hero.webp`** — the one raster LCP candidate. Measure it; serve a width-appropriate variant.
- **`thermoleak_logo.webp`** — small, but was competing for preload. Fixed.
- **`og.png`** — never rendered on-page; its weight does not affect CWV.

**Two viable paths, pick one deliberately, never mix:**

1. **Pre-generate width variants** and hand-write `srcset`/`sizes`. No config change, no host
   dependency, works with `unoptimized: true`.
2. **Cloudflare Image Resizing** (`/cdn-cgi/image/...`) — the zone is already proxied. Requires the
   feature enabled on the zone (owner action).

**Formats:** AVIF → WebP → JPEG fallback for photographs. Thermal images compress poorly in lossy
formats near the colour-ramp edges — check for banding at quality < 80.

**Every content image needs meaningful Hebrew `alt`**; decorative gets `alt=""`. Thermal images
need `alt` that describes the *finding* — colour carries the entire information channel.

---

## 4. Fonts

Heebo (headings) + Assistant (body), self-hosted via `next/font/google` in `app/fonts.ts`, exposed
as CSS variables consumed by the `@theme` block. Correct setup.

Rules:
- `display: swap` — never `block`.
- **Subset to Hebrew + Latin only.** Full Google Font files carry ranges this site never renders.
- **Preload only above-the-fold subsets.** Without a preload both families FOUT on first paint;
  preloading everything is as bad as preloading nothing.
- Fallback stack must be metric-compatible enough that swap does not shift layout (contributes to
  CLS).
- **Adding a third family requires deleting one.** Two is the budget.

---

## 5. Caching and delivery

Cloudflare Pages, edge-served worldwide.

| Asset | Policy | Where |
| --- | --- | --- |
| `/_next/static/*` | `public, max-age=31536000, immutable` | `public/_headers` — safe: content-hashed filenames |
| HTML | Pages default (`DYNAMIC`, fresh per deploy) | Do not add per-request HTML caching |
| Images in `public/` | Long-lived, but **not** immutable unless hashed | Rename on change |

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

```bash
du -sh out
find out -name "*.js" -size +200k -exec ls -lh {} \;
ls -lh public/images/*
grep -c srcset out/index.html
```

---

## 8. Regression triggers — re-run the full pass when any of these change

- A new `"use client"` component
- A new dependency
- A new above-the-fold image
- Any font change
- Tag manager / analytics installation ← **the highest-risk change on this list**
- Any `_headers` edit
- The i18n build landing (doubles the route count)
