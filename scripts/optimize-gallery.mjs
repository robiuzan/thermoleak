/**
 * optimize-gallery.mjs — builds public/images/gallery/*.webp from the masters in assets/gallery/.
 *
 * WHY MASTERS LIVE OUTSIDE public/
 *
 * public/ is copied verbatim into out/, and every byte of out/ counts against the 7,500,000 B export
 * budget (docs/performance-guidelines.md §1). The masters are 0.2–2.6 MB generator images — the
 * first batch (31 files, 55,195,544 B) was dropped straight into public/images/ on 2026-10-22, which
 * would have shipped 8× the whole site's weight on the next deploy. So masters sit in
 * assets/gallery/ (the fleet's convention — galbath.co.il does the same), and that folder is
 * gitignored because this repo is PUBLIC: an unpublished likeness of the team does not belong in
 * its history. Its README (the one tracked file) lists every master with its verdict.
 *
 * ONE SIZE, ONE FORMAT — measured 2026-10-22, not assumed
 *
 * Every image is cover-cropped to 720×1200 (3:5 — the masters are ~0.59, so the crop trims a few
 * pixels, after the optional `master.crop` that cuts clutter away) and encoded as WebP q85. The
 * gallery's tiles render at most ~345 CSS px wide, so 720 px is right for a 2× screen — the same
 * single-size reasoning as hero.webp (§3); a srcset ladder would double the deploy weight for a few
 * KB per visitor. q85 because thermal colour ramps band below q80 (§3): at q75 the camera screen's
 * purple–yellow ramp blotches visibly, at q85 it is indistinguishable from lossless at ~32 KB. WebP
 * only, like the hero, since AVIF would need a WebP fallback and so twice the files. sharp drops all
 * metadata by default — keep it that way: the owner decided on 2026-10-26 that the files carry no
 * AI marker (docs/eeat-and-trust.md §5).
 *
 * lib/gallery.ts is the single list: this script reads it (Node ≥ 22.18 strips its types natively),
 * so the files that ship and the alt text that describes them cannot drift apart. Changing an
 * image's pixels means a NEW slug — /images/* is cached 30 days without `immutable`, and
 * rename-on-change is the only invalidation path (public/_headers).
 *
 * sharp is not a dependency of this repo: it arrives as an optional dependency of next, so it is
 * present wherever `npm ci` ran on a supported platform. If it is missing, the import below fails
 * with "Cannot find package 'sharp'" — reinstall rather than adding it to package.json.
 *
 * Usage: node scripts/optimize-gallery.mjs   (always works on the repo root)
 * Node prints a MODULE_TYPELESS_PACKAGE_JSON warning as it reads lib/gallery.ts (package.json has
 * no "type"). It is expected and harmless — do not add "type": "module" to silence it.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { galleryImageSize, galleryScenes, gallerySrc } from "../lib/gallery.ts";

process.chdir(path.join(path.dirname(fileURLToPath(import.meta.url)), ".."));

const MASTERS = path.join("assets", "gallery");
const OUT = path.join("public", "images", "gallery");
const QUALITY = 85;
const { width: WIDTH, height: HEIGHT } = galleryImageSize;

const images = galleryScenes.flatMap((scene) => scene.images);

const missing = images.filter(
  (image) => !fs.existsSync(path.join(MASTERS, image.master.file)),
);
if (missing.length > 0) {
  console.error(
    `optimize-gallery: ${missing.length} master(s) not found in ${MASTERS}/:\n` +
      missing
        .map((image) => `  ${image.master.file}  (for ${image.slug})`)
        .join("\n") +
      `\n  The masters are gitignored — copy them in from the original source before re-running.`,
  );
  process.exit(1);
}

const slugs = images.map((image) => image.slug);
const duplicate = slugs.find((slug, i) => slugs.indexOf(slug) !== i);
if (duplicate) {
  console.error(
    `optimize-gallery: slug '${duplicate}' is used twice in lib/gallery.ts.`,
  );
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
let total = 0;

for (const image of images) {
  const master = path.join(MASTERS, image.master.file);
  const target = path.join("public", gallerySrc(image));
  const { crop } = image.master;
  const { width, height } = crop ?? (await sharp(master).metadata());

  // A region far from 3:5 loses real content to the centre crop — say so instead of shipping it.
  const drift = Math.abs(width / height / (WIDTH / HEIGHT) - 1);
  if (drift > 0.05) {
    console.warn(
      `optimize-gallery: ${image.master.file} is ${width}×${height}, ${(drift * 100).toFixed(0)}% away ` +
        `from 3:5 — check that the centre crop keeps the subject.`,
    );
  }

  const source = crop ? sharp(master).extract(crop) : sharp(master);
  await source
    .resize(WIDTH, HEIGHT, {
      fit: "cover",
      position: "centre",
      kernel: "lanczos3",
    })
    .webp({ quality: QUALITY, effort: 6, smartSubsample: true })
    .toFile(target);

  const { size } = fs.statSync(target);
  total += size;
  console.log(
    `  ${image.slug}.webp  ${width}×${height} → ${WIDTH}×${HEIGHT}  ${kb(size)}`,
  );
}

// Anything else in the folder ships too (public/ is copied whole) but nothing references it.
const listed = new Set(slugs.map((slug) => `${slug}.webp`));
const strays = fs.readdirSync(OUT).filter((file) => !listed.has(file));
if (strays.length > 0) {
  console.warn(
    `optimize-gallery: not in lib/gallery.ts, yet shipped by every build — delete or list them:\n` +
      strays.map((file) => `  ${path.join(OUT, file)}`).join("\n"),
  );
}

console.log(
  `optimize-gallery: ${images.length} image(s), ${kb(total)} total in ${OUT}/`,
);
