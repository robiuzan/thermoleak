---
name: performance-web-vitals
description: Core Web Vitals for a static export on Cloudflare Pages — the healthy ~4 MB baseline, what images.unoptimized actually costs on a site whose service art is SVG, the hero preload, font preloads, CLS reserves, and the lean client-JS budget. Use before shipping or when LCP, CLS or INP regress. Triggers "perf pass", "Core Web Vitals", "LCP slow", "image optimization", "bundle size", "srcset".
---

# Core Web Vitals

Static HTML served from **Cloudflare Pages** (edge-served worldwide), with immutable caching on
fingerprinted assets via `public/_headers`. **The baseline here is genuinely healthy** — measure before
you optimise, and don't manufacture findings to fill a section.

## The measured baseline

From the last audited export:

| Metric                     | Value                                  |
| -------------------------- | -------------------------------------- |
| Total `out/`               | **3.9 MB**                             |
| JS chunks over 500 KB      | **none**                               |
| Client components          | **2** (`ContactForm`, `Navbar`)        |
| Dependencies               | 4 runtime (`next`, `react`, `react-dom`, `lucide-react`) |
| Dev-only artifacts in `out/` | none                                 |

This site does **not** have the multi-megabyte dev-chunk problem some fleet siblings carry. If you see
one, the cause is a polluted `.next/` — `rm -rf .next out` and rebuild before investigating further.

**Check freshness first.** `out/` on disk has repeatedly been older than the last commit. Compare its
mtime against `git log -1` and rebuild before measuring anything, or you are optimising an artifact
nobody is serving.

## Images

`next.config.ts` sets `images: { unoptimized: true }`, so every `next/image` renders a bare `<img>`
with **no srcset**. On most sites that is the headline finding. Here it is smaller than it looks,
because three of the four service illustrations are **SVGs** (`/images/services/*.svg`), where srcset is
meaningless.

What actually matters:

- `public/images/hero.webp` — the one raster hero. Measure it. If it is materially larger than a phone
  viewport needs, that is the LCP-blocking download.
- `public/images/thermoleak_logo.webp` — rendered by `Logo` with `priority` in `Navbar`, so it is
  **preloaded on every page**. A logo that renders at ~40px tall competing with the hero for early
  bandwidth is a bad trade. Check whether the `priority` is earning anything.
- `public/og.png` — never rendered on-page; it is only a meta reference. Its weight doesn't affect CWV.

Two viable routes if the hero needs work — pick one deliberately, don't mix:

1. **Pre-generate width variants** and hand-write `srcset`/`sizes`. No config change, no host
   dependency, works with `unoptimized: true`.
2. **Use Cloudflare Image Resizing** (`/cdn-cgi/image/...`) since the zone is already proxied. Requires
   the feature to be enabled on the zone — an owner action, not a repo change.

The one thing to avoid is passing `sizes` to an unoptimized `next/image`: it looks correct in review and
does nothing.

## LCP

Identify the real LCP element **per route type** — it differs:

- `/` — almost certainly the hero image or the `<h1>` inside it.
- `/services/{slug}/` — the `PageHero` heading, or the service image below it.
- `/contact/`, `/privacy/` — text; there is no image to blame.

At most **one** `priority` image per page. Today `Logo` claims it on every page.

## Fonts

Heebo (headings) + Assistant (body) are self-hosted through `next/font/google` in `app/fonts.ts` and
exposed as CSS variables consumed by the `@theme` block. That is the right setup. Check whether a
`<link rel="preload">` is emitted for the subsets used above the fold — without it both families FOUT
on first paint on every page, which is cheap to fix and visible on a slow connection.

## JS budget (INP)

Only two client components exist and both need to be:

- `components/ContactForm.tsx` — form state, validation, submit handling.
- `components/Navbar.tsx` — the mobile menu boolean.

Everything else is a Server Component. In particular `components/Faq.tsx` and the per-service FAQ use
native `<details>/<summary>` with **zero JS**, which is simultaneously the fastest option, the most
accessible one, and what keeps every answer in the DOM for `FAQPage` schema and answer engines.

**Do not convert the FAQ to client state**, and flag any new `"use client"` that isn't justified by
state, effects or a browser API.

## CLS

Currently sound:

- Images pass explicit `width`/`height` (e.g. the service image at 600×400) or are sized by their
  container.
- `app/layout.tsx` gives `<main>` a `pb-20 md:pb-0` spacer so the fixed `StickyContact` bar never
  overlaps the footer.
- `Navbar` is `sticky` rather than `fixed`, so it occupies layout space and shifts nothing.

Preserve all three when adding sections. Any new above-the-fold image needs its box reserved.

## Caching

`public/_headers` sets `Cache-Control: public, max-age=31536000, immutable` on `/_next/static/*`,
which is safe because those filenames are content-hashed. Pages serves HTML `DYNAMIC` from the edge —
a fresh copy per deploy, nothing to purge, deploys land immediately. Don't add per-request caching
for HTML; a stale page after a deploy costs more than the milliseconds saved.

## Measuring

The auditor reads the artifact; it does not measure a browser. For real numbers run Lighthouse or PSI
against the **live** URL on a mobile profile, and check field data in Search Console where available.
Test a service page as well as the homepage — they have different LCP elements.

## Checklist

- [ ] `out/` is newer than the last commit before you measure anything.
- [ ] The LCP element per route type is identified and sized for the viewport.
- [ ] At most one `priority` image per page.
- [ ] Fonts preloaded for above-the-fold subsets.
- [ ] `out/` contains no unreferenced file over 1 MB.
- [ ] No `"use client"` without a stated reason; the FAQ is still `<details>`-based.
- [ ] CLS reserves intact for every new block.

```bash
du -sh out
find out -name '*.js' -size +500k -exec ls -lh {} \;
ls -lh public/images/*
grep -c 'srcset' out/index.html
```
