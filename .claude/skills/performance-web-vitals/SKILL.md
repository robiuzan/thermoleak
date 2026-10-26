---
name: performance-web-vitals
description: Core Web Vitals for a static export on Cloudflare Pages — the measured 5.91 MB export and why nearly half of it is duplicated RSC .txt payloads that never touch first paint, what images.unoptimized actually costs on a site whose service art is all SVG, the shipped hero and font preloads, the CLS reserve that does not actually cover the footer, and the four-client-component JS budget now that GTM ships. Use before shipping or when LCP, CLS or INP regress. Triggers "perf pass", "Core Web Vitals", "LCP slow", "image optimization", "bundle size", "srcset".
---

# Core Web Vitals

Static HTML served from **Cloudflare Pages** (edge-served worldwide), with immutable caching on
fingerprinted assets via `public/_headers`. **The baseline here is genuinely healthy** — measure before
you optimise, and don't manufacture findings to fill a section.

## The measured baseline

Measured 2026-09-06 from a fresh export:

| Metric                       | Value                                                    |
| ---------------------------- | -------------------------------------------------------- |
| Total `out/`                 | **5,910,433 B** (5.64 MiB)                               |
| — RSC flight payloads (.txt) | 2,769,645 B — **46.9%**, 158 files                       |
| — HTML                       | 1,984,248 B (33.6%)                                      |
| — JS                         | 722,262 B (12.2%); all of `out/_next` is 936,350 B       |
| — fonts / og.png / css / ico | 135,576 / 128,363 / 52,022 / 51,862 B                    |
| Largest JS chunk             | **226 KB** — over the 200 KB budget below                |
| Client components            | **3** (`ContactForm`, `Navbar`, `ThankYouContent`)       |
| Dependencies                 | 4 runtime (`next`, `react`, `react-dom`, `lucide-react`) |
| Dev-only artifacts in `out/` | none                                                     |

**Read the 5.91 MB before reacting to it.** Nearly half the export is RSC flight payloads — 158 `.txt`
files, five or more per route. Next 16 writes each route's full payload **twice**, as `index.txt` and
`__next._full.txt`, byte-identical: 21 of each, **923,969 B apiece**, so ~0.92 MB of the export is exact
duplication. All of it is fetched on **client-side navigation prefetch**, never on first paint, so none
of it touches LCP on any route. It is deploy weight and cache footprint, not a Core Web Vitals problem.
Do not "fix" it by disabling prefetch; measure a real navigation first.

The budgets that do matter: **no JS chunk over 200 KB** (one is at 226 KB today), and no unreferenced
file over 1 MB.

This site does **not** have the multi-megabyte dev-chunk problem some fleet siblings carry. If you see
one, the cause is a polluted `.next/` — `rm -rf .next out` and rebuild before investigating further.

**Check freshness first.** `out/` on disk has repeatedly been older than the last commit. Compare its
mtime against `git log -1` and rebuild before measuring anything, or you are optimising an artifact
nobody is serving.

## Images

`next.config.ts` sets `images: { unoptimized: true }`, so every `next/image` renders a bare `<img>`
with **no srcset**. On most sites that is the headline finding. Here it is close to irrelevant: **all
four** service illustrations are SVGs (`/images/services/*.svg`, ~1.2 KB each), where srcset is
meaningless, and `public/images/` was about **80 KB** until the homepage gallery added four lazy
720×1200 WebP files below the fold (185,682 B, 2026-10-22).

What actually matters:

- `public/images/hero.webp` — the one raster hero, **33 KB**. It is preloaded (`<link rel="preload"
as="image">` is emitted) and `Hero` is the only component claiming `priority`. There is no LCP-blocking
  download here; leave it alone unless the art changes.
- `public/images/thermoleak_logo.webp` — 18 KB, rendered by `Logo` in `Navbar` **without** `priority`.
  `components/Navbar.tsx` carries a comment recording that decision (the hero is the LCP candidate).
  Don't hand the logo `priority` back.
- `public/og.png` — 128 KB, the single largest non-text asset, but **never rendered on-page**; it is only
  a meta reference. Its weight doesn't affect CWV.

So image work on this site is almost always the wrong lever. Say so rather than filling the section.

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

At most **one** `priority` image per page — currently satisfied: `Hero` claims it on `/`, and nothing
else claims it anywhere.

## Fonts

Heebo (headings) + Assistant (body) are self-hosted through `next/font/google` in `app/fonts.ts` and
exposed as CSS variables consumed by the `@theme` block. That is the right setup, and the preloads are
there: the emitted HTML carries four `<link rel="preload" … as="font" type="font/woff2">` tags plus the
hero image preload, 135,576 B of woff2 in total. Nothing to do here — verify rather than re-fix:

```bash
grep -o 'rel="preload"[^>]*' out/index.html
```

## JS budget (INP)

Exactly four client components exist and each needs to be:

- `components/ContactForm.tsx` — form state, validation, submit handling.
- `components/Navbar.tsx` — the mobile menu boolean.
- `components/ThankYouContent.tsx` — reads the `sessionStorage` handoff the form writes.
- `components/ConsentBanner.tsx` — reads the stored consent choice and calls `gtag("consent","update")`.

Everything else is a Server Component — including `components/Analytics.tsx` and
`components/ServiceChooser.tsx`, whose names suggest otherwise. `components/Faq.tsx` and the per-service
FAQ use native `<details>/<summary>` with **zero JS**, which is simultaneously the fastest option, the
most accessible one, and what keeps every answer in the DOM for `FAQPage` schema and answer engines.

The one third-party script on the site is the **GTM container** (`GTM-KWGGH438`), injected by
`components/Analytics.tsx` on every route. It is the only external request that can move INP, so measure
it against the live URL rather than against `out/` — and route any new tag through the container, never
as a second `<script>` in the layout.

**Do not convert the FAQ to client state**, and flag any new `"use client"` that isn't justified by
state, effects or a browser API.

## CLS

Currently sound:

- Images pass explicit `width`/`height` (e.g. the service image at 600×400) or are sized by their
  container.
- `Navbar` is `sticky` rather than `fixed`, so it occupies layout space and shifts nothing.

Preserve both when adding sections. Any new above-the-fold image needs its box reserved.

> ⚠️ **The sticky-bar spacer does not do what this file used to claim (A1 — open).** `app/layout.tsx`
> puts `pb-20 md:pb-0` on `<main>`, but `<Footer>` and `<StickyContact>` are **siblings after** `<main>`,
> not inside it. So the spacer adds 80px between the main content and the footer and adds nothing at the
> end of the document — on mobile the fixed bar covers the footer's bottom row, which is the only link to
> `/accessibility/`. This is a code fix (move the padding onto the body/footer and add
> `env(safe-area-inset-bottom)`), not a doc fix. Do not repeat the old "never overlaps the footer" claim.

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
- [ ] `out/` contains no unreferenced file over 1 MB, and no JS chunk over 200 KB.
- [ ] The export total is explained, not just reported — nearly half of it is duplicated RSC `.txt`
      payloads that never load at first paint.
- [ ] No `"use client"` without a stated reason; still exactly four; the FAQ is `<details>`-based.
- [ ] No third-party script added outside the GTM container.
- [ ] CLS reserves intact for every new block.

```bash
find out -type f -printf '%s\n' | awk '{s+=$1} END {print s" bytes total"}'
find out -name '*.js' -printf '%s %p\n' | sort -rn | head -5      # budget: none over 200 KB
find out -name '*.txt' -printf '%s\n' | awk '{s+=$1} END {print s" bytes of RSC payload"}'
ls -lh public/images/* public/og.png
grep -o 'rel="preload"[^>]*' out/index.html
grep -c 'srcset' out/index.html
```
