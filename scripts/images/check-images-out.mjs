/**
 * check-images-out.mjs — the images gate. Runs after `next build` (postbuild: after check-live-out,
 * which owns out/.live-draft, and before keep-previous-assets, which must stay last), in CI's build
 * and in `npm run gate`, and proves the export carries exactly the images
 * content/images/manifest.json says, and nothing else.
 *
 * WHAT IT ENFORCES (contract §4, CLAUDE.md §15):
 *   - the manifest obeys every rule in scripts/images/lib/manifest-rules.mjs — the same module
 *     lib/images.ts throws on, so the two can never disagree about what a valid manifest is;
 *   - every approved file exists in public/ AND out/ with the HEADER dimensions, bytes and sha256
 *     the manifest records (read with lib/imageinfo.mjs, never trusted from the JSON); candidates
 *     only in draft mode; rejected files nowhere; retired files kept ≥ 60 days;
 *   - every <img> on every page carries numeric width/height and a non-empty alt (unless
 *     aria-hidden, or a NON_CONTENT_IMAGES file: the logo and the decorative service art); every
 *     other /images/ reference resolves to a visible manifest entry; no /images/_candidates/
 *     reference survives a production build (the folder is pruned from out/);
 *   - every file under out/images/ is referenced by the manifest or is a NON_CONTENT_IMAGES file
 *     (a stray file is a leak);
 *   - per content page: ≥ gates.minPerContentPage content images (0 until coverage, then 2) and
 *     summed bytes ≤ the page budget (gates.pageBudgets[route] ?? gates.maxPageImageBytes);
 *     out/images/ in total ≤ gates.maxTotalBytes;
 *   - exactly one fetchpriority="high" on an image-bearing page, and it is the FIRST content image
 *     in DOM order (lazy-loading an in-viewport LCP image is the known regression); every other
 *     content image is lazy;
 *   - every rendered alt and figcaption passes the text rules (Hebrew, no claim stems, no area name,
 *     no ASCII quote touching Hebrew; a technician's first name only in /about/ captions), and
 *     so does every other <figcaption> on a content page (the homepage's scene captions);
 *   - the LCP image of a page in LCP_SLOTS fits its tighter cap;
 *   - every visible placement renders on its route and every rendered content image is placed
 *     there; excluded routes carry none;
 *   - no /images/ path inside any application/ld+json or og:image — renderings are illustrations,
 *     never evidence;
 *   - the disclosure markers: `data-images-notice="gallery"` on /gallery/ always, `"footer"` on
 *     every page exactly when notice.json carries its `approved` stamp and an approved image
 *     exists, `"about"` on /about/ exactly when the team figure renders — each with the text of
 *     content/images/notice.json verbatim.
 *
 * DRAFT MODE (`IMAGES_DRAFT=1`): candidates render from /images/_candidates/, so the candidate
 * assertions are skipped and the export is marked with out/.images-draft AND out/.live-draft, so
 * the hub's deploy-site.ps1 refuses it and no later step ever archives it.
 *
 * Usage: node scripts/images/check-images-out.mjs [outDir]      (default: out; exit 1 on failure)
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { inspect } from "./lib/imageinfo.mjs";
import {
  ABOUT_ROUTE,
  ABOUT_TEAM_SLOT,
  ARTIFACT_ROUTES,
  EXCLUDED_ROUTES,
  GALLERY_ROUTE,
  LCP_SLOTS,
  LISTS,
  NON_CONTENT_IMAGES,
} from "./lib/images.config.mjs";
import {
  RETIRED_KEEP_DAYS,
  REVOKED_REMOVE_DAYS,
  isVisible,
  manifestProblems,
  noticeIsLive,
  srcOf,
  textProblems,
  thumbSrcOf,
} from "./lib/manifest-rules.mjs";
import { objectStrings, topLevelObjects, tsArray } from "./lib/ts-scan.mjs";

process.chdir(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".."),
);

// Positional arg only — flags must not be mistaken for the output directory.
const OUT = process.argv.slice(2).find((a) => !a.startsWith("-")) ?? "out";
const DRAFT = process.env.IMAGES_DRAFT === "1";
const MANIFEST = "content/images/manifest.json";
const NOTICE_FILE = "content/images/notice.json";
const PUBLIC = "public";

if (!fs.existsSync(OUT)) {
  console.error(
    `check-images-out: '${OUT}' does not exist — run \`npm run build\` first.`,
  );
  process.exit(1);
}
for (const f of [MANIFEST, NOTICE_FILE]) {
  if (!fs.existsSync(f)) {
    console.error(`check-images-out: ${f} is missing.`);
    process.exit(1);
  }
}

const failures = [];
const notes = [];
function check(label, offenders, hint) {
  const list = [...offenders];
  if (list.length) failures.push({ label, offenders: list, hint });
  console.log(
    `  ${list.length ? "FAIL" : "ok  "}  ${label}${list.length ? `  (${list.length})` : ""}`,
  );
}

const isObj = (x) => typeof x === "object" && x !== null && !Array.isArray(x);
const count = (hay, needle) => hay.split(needle).length - 1;
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const decode = (s) =>
  String(s ?? "").replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e) =>
    e[0] === "#"
      ? String.fromCodePoint(
          e[1].toLowerCase() === "x"
            ? parseInt(e.slice(2), 16)
            : Number(e.slice(1)),
        )
      : (ENT[e.toLowerCase()] ?? m),
  );
/** Visible text: tags (and React's `<!-- -->` text separators) removed without adding spaces. */
const textOf = (html) =>
  decode(html.replace(/<[^>]+>/g, ""))
    .replace(/\s+/g, " ")
    .trim();

// ── inputs ───────────────────────────────────────────────────────────────────────────────────
const manifest = JSON.parse(
  fs.readFileSync(MANIFEST, "utf8").replace(/^﻿/, ""),
);
/** The disclosure texts, asserted verbatim where their markers render (lib/images.ts imagesNote). */
const NOTICE = JSON.parse(
  fs.readFileSync(NOTICE_FILE, "utf8").replace(/^﻿/, ""),
);

/**
 * Service and city names come from the data files through the toolkit's scanner: this script cannot
 * import them (they pull in lucide-react and extensionless paths), and typing the lists here would
 * be a second copy that drifts. A count that differs from LISTS is itself a failure.
 */
const rowsOf = ({ file, const: name }) =>
  topLevelObjects(tsArray(fs.readFileSync(file, "utf8"), name) ?? "[]").map(
    objectStrings,
  );
const services = rowsOf(LISTS.services).filter((r) => r.slug);
const locations = rowsOf(LISTS.locations).filter((r) => r.slug);
const articles = rowsOf(LISTS.articles).filter((r) => r.slug);

function pages(dir = OUT, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== "_next") pages(p, acc);
    } else if (e.name === "index.html") {
      const rel = path.relative(OUT, dir).split(path.sep).join("/");
      acc.push({
        route: rel ? `/${rel}/` : "/",
        file: p,
        html: fs.readFileSync(p, "utf8"),
      });
    }
  }
  return acc;
}
const all = pages();
const NOT_CONTENT = new Set([...EXCLUDED_ROUTES, ...ARTIFACT_ROUTES]);
const content = all.filter((p) => !NOT_CONTENT.has(p.route));
const contentRoutes = content.map((p) => p.route);

console.log(
  `check-images-out: ${all.length} emitted routes in ${OUT}/, ${content.length} content routes` +
    (DRAFT ? " — IMAGES_DRAFT=1 (candidates render)" : "") +
    "\n",
);

check(
  "the service, city and guide lists were read from their data files",
  [
    [services, LISTS.services],
    [locations, LISTS.locations],
    [articles, LISTS.articles],
  ]
    .filter(([rows, cfg]) => rows.length !== cfg.expect)
    .map(
      ([rows, cfg]) =>
        `${cfg.file}: ${rows.length} row(s), images.config.mjs expects ${cfg.expect}`,
    ),
  "the gate needs the names to ban them from alt/captions; a new page moves `expect` in the same commit",
);

// ── 1. the manifest itself (shared rules) ───────────────────────────────────────────────────
const ctx = {
  contentRoutes,
  cityNames: locations.map((l) => l.name),
  citySlugs: locations.map((l) => l.slug),
  serviceSlugs: services.map((s) => s.slug),
};
check(
  "content/images/manifest.json obeys every rule in scripts/images/lib/manifest-rules.mjs",
  manifestProblems(manifest, ctx),
  "lib/images.ts throws on the same rules — the toolkit writes the manifest, fix it there",
);

const images = Array.isArray(manifest.images)
  ? manifest.images.filter(isObj)
  : [];
const gates = isObj(manifest.gates) ? manifest.gates : {};
const visible = images.filter((e) => isVisible(e, DRAFT));
const byId = new Map(images.map((e) => [e.id, e]));
const noticeLive = noticeIsLive(NOTICE, images);
const isNonContent = (src) =>
  NON_CONTENT_IMAGES.some((f) =>
    f.endsWith("/") ? src.startsWith(f) : src === f,
  );

// ── 2. a production export carries no candidate, and no stale draft mark ────────────────────
function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}
const candidatesDir = path.join(OUT, "images", "_candidates");
// The draft state follows the pages, not the environment. A standalone run on a draft export must
// neither erase the mark that stops it being deployed nor prune the files its pages point at: the
// candidate check below fails it instead, and the mark stays.
const pagesUseCandidates = walk(OUT)
  .filter((f) => f.endsWith(".html"))
  .some((f) => fs.readFileSync(f, "utf8").includes("/images/_candidates/"));
if (!DRAFT && !pagesUseCandidates) {
  if (fs.existsSync(candidatesDir)) {
    const n = walk(candidatesDir).length;
    fs.rmSync(candidatesDir, { recursive: true, force: true });
    notes.push(
      `pruned ${OUT}/images/_candidates/ (${n} file(s)) — a production export ships no candidate`,
    );
  }
  const mark = path.join(OUT, ".images-draft");
  if (fs.existsSync(mark)) fs.rmSync(mark);
}

// ── 3. files: where each status says, with the manifest's header facts ──────────────────────
const under = (root, src) =>
  path.join(root, ...String(src).split("/").filter(Boolean));
const fileProblems = [];
function expectFile(label, src, want) {
  for (const file of [under(PUBLIC, src), under(OUT, src)]) {
    if (!fs.existsSync(file)) {
      fileProblems.push(`${label}: ${file} is missing`);
      continue;
    }
    const bytes = fs.readFileSync(file);
    let info;
    try {
      info = inspect(bytes);
    } catch (err) {
      fileProblems.push(`${label}: ${file}: ${err.message}`);
      continue;
    }
    if (info.width !== want.width || info.height !== want.height)
      fileProblems.push(
        `${label}: ${file} is ${info.width}×${info.height}, the manifest says ${want.width}×${want.height}`,
      );
    if (Number.isInteger(want.bytes) && bytes.length !== want.bytes)
      fileProblems.push(
        `${label}: ${file} is ${bytes.length} bytes, the manifest says ${want.bytes}`,
      );
    if (typeof want.sha256 === "string") {
      const sha = crypto.createHash("sha256").update(bytes).digest("hex");
      if (sha !== want.sha256)
        fileProblems.push(`${label}: ${file} sha256 differs from the manifest`);
    }
  }
}
const exists = (src) =>
  fs.existsSync(under(PUBLIC, src)) || fs.existsSync(under(OUT, src));
const now = Date.now();
for (const e of images) {
  const approvedSrc = `/images/${e.file}`;
  const candidateSrc = `/images/_candidates/${e.file}`;
  switch (e.status) {
    case "approved":
      expectFile(e.id, srcOf(e), e);
      if (isObj(e.thumb)) expectFile(`${e.id} thumb`, thumbSrcOf(e), e.thumb);
      break;
    case "candidate":
      if (DRAFT) {
        expectFile(e.id, candidateSrc, e);
        if (isObj(e.thumb))
          expectFile(
            `${e.id} thumb`,
            `/images/_candidates/${e.thumb.file}`,
            e.thumb,
          );
      }
      if (fs.existsSync(under(PUBLIC, approvedSrc)))
        fileProblems.push(
          `${e.id}: a candidate must not sit in public/images/ (found ${approvedSrc})`,
        );
      break;
    case "rejected":
      for (const src of [approvedSrc, candidateSrc])
        if (exists(src))
          fileProblems.push(`${e.id}: rejected, but ${src} still exists`);
      break;
    case "retired": {
      const days = Math.floor((now - Date.parse(e.retired)) / 864e5);
      const keptSrc = e.legacySrc ?? approvedSrc;
      const kept =
        fs.existsSync(under(PUBLIC, keptSrc)) &&
        fs.existsSync(under(OUT, keptSrc));
      // A revoked consent overrides the keep: the person's image leaves the site.
      if (e.consentRevoked) {
        const since = Math.floor((now - Date.parse(e.consentRevoked)) / 864e5);
        if (kept && since > REVOKED_REMOVE_DAYS)
          fileProblems.push(
            `${e.id}: consent revoked ${since} days ago — ${keptSrc} must be gone within ${REVOKED_REMOVE_DAYS} days`,
          );
        break;
      }
      if (days < RETIRED_KEEP_DAYS && !kept)
        fileProblems.push(
          `${e.id}: retired ${days} day(s) ago but ${keptSrc} is gone — the file stays ≥ ${RETIRED_KEEP_DAYS} days`,
        );
      if (days >= RETIRED_KEEP_DAYS && kept)
        notes.push(
          `${e.id}: retired ${days} days ago — removing ${keptSrc} is now the owner's decision`,
        );
      break;
    }
    default:
      break;
  }
}
check(
  "every manifest file is where its status says, with the manifest's dimensions, bytes and sha256",
  fileProblems,
  "approved → public/images/<file>; candidate → _candidates/ in draft mode only; rejected → nowhere; retired → kept 60 days",
);

// ── 4. nothing under out/images/ that the manifest does not vouch for ───────────────────────
const allowed = new Set();
for (const e of images) {
  const files = [e.file, isObj(e.thumb) ? e.thumb.file : null].filter(Boolean);
  if (e.status === "approved" && !e.legacySrc)
    for (const f of files) allowed.add(`/images/${f}`);
  if (e.status === "retired")
    for (const f of files) allowed.add(`/images/${f}`);
  // This site's untouched originals live under /images/ themselves.
  if (e.legacySrc && ["approved", "retired"].includes(e.status))
    allowed.add(e.legacySrc);
  if (DRAFT && e.status === "candidate")
    for (const f of files) allowed.add(`/images/_candidates/${f}`);
}
const imagesDir = path.join(OUT, "images");
const shipped = fs.existsSync(imagesDir)
  ? walk(imagesDir).map(
      (f) => "/" + path.relative(OUT, f).split(path.sep).join("/"),
    )
  : [];
check(
  "every file under out/images/ is an approved (or retired) manifest entry, or non-content",
  shipped.filter((s) => !allowed.has(s) && !isNonContent(s)),
  "a file nothing references is a leak — add it through the toolkit; a stray file that never deployed may go",
);
const totalBytes = shipped.reduce(
  (n, s) => n + fs.statSync(under(OUT, s)).size,
  0,
);
check(
  `out/images/ totals ≤ ${(gates.maxTotalBytes / 1048576).toFixed(0)} MB`,
  totalBytes <= gates.maxTotalBytes
    ? []
    : [`${(totalBytes / 1048576).toFixed(1)} MB`],
  "re-encode, or ask the owner — a deployed file is never removed without the owner's word",
);

// ── 5. every page ───────────────────────────────────────────────────────────────────────────
const srcToEntry = new Map();
for (const e of visible) {
  srcToEntry.set(srcOf(e), { entry: e, thumb: false });
  const t = thumbSrcOf(e);
  if (t) srcToEntry.set(t, { entry: e, thumb: true });
}
/** A thumbnail on /guides/ is derived from the guide's own `lead`, so it is placed by that lead. */
const placedOn = ({ entry, thumb }, route) =>
  entry.placements.some((pl) => pl.route === route) ||
  (thumb &&
    route === "/guides/" &&
    entry.placements.some((pl) => pl.slot === "lead"));
const stripSlot = (slot) => /^(strip|pair)-\d$/.test(slot);

const IMG_RE = /<img\b[^>]*>/gi;
const attrsOf = (tag) => {
  const o = {};
  for (const m of tag.matchAll(/\s([a-zA-Z][\w-]*)(?:="([^"]*)")?/g))
    o[m[1].toLowerCase()] = m[2] ?? "";
  return o;
};

const problems = {
  attrs: [],
  candidate: [],
  unknown: [],
  excluded: [],
  min: [],
  pageBytes: [],
  priority: [],
  text: [],
  figure: [],
  placement: [],
  schema: [],
  notice: [],
};
const coverage = [];
// In draft a candidate takes the place of the approved image at the same (route, slot, order), the
// way lib/images.ts renders it, so that approved image is not missing from the page.
const shadowed = (e, pl) =>
  DRAFT &&
  e.status === "approved" &&
  visible.some(
    (c) =>
      c.status === "candidate" &&
      c.placements.some(
        (q) =>
          q.route === pl.route && q.slot === pl.slot && q.order === pl.order,
      ),
  );
// The note names the people in the picture, so a people-free twin of the team figure carries none.
const aboutTeamShown = visible.some(
  (e) =>
    e.people?.length > 0 &&
    e.placements.some(
      (pl) => pl.route === ABOUT_ROUTE && pl.slot === ABOUT_TEAM_SLOT,
    ),
);

for (const p of all) {
  const imgs = [...p.html.matchAll(IMG_RE)].map((m) => ({
    at: m.index,
    a: attrsOf(m[0]),
  }));
  for (const i of imgs) {
    const hidden = "aria-hidden" in i.a && i.a["aria-hidden"] !== "false";
    if (!/^\d+$/.test(i.a.width ?? "") || !/^\d+$/.test(i.a.height ?? ""))
      problems.attrs.push(
        `${p.route}: <img src="${i.a.src}"> without numeric width/height`,
      );
    if (
      !("alt" in i.a) ||
      (!hidden && !isNonContent(i.a.src ?? "") && !decode(i.a.alt).trim())
    )
      problems.attrs.push(`${p.route}: <img src="${i.a.src}"> without alt`);
    if (
      /^\/images\//.test(i.a.src ?? "") &&
      !srcToEntry.has(i.a.src) &&
      !isNonContent(i.a.src)
    )
      problems.unknown.push(`${p.route}: ${i.a.src}`);
  }
  if (!DRAFT && p.html.includes("/images/_candidates/"))
    problems.candidate.push(p.route);

  for (const m of p.html.matchAll(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  ))
    if (m[1].includes("/images/"))
      problems.schema.push(`${p.route}: JSON-LD names an /images/ path`);
  for (const m of p.html.matchAll(
    /<meta\b[^>]*property="og:image[^"]*"[^>]*>/gi,
  ))
    if (m[0].includes("/images/"))
      problems.schema.push(`${p.route}: og:image names an /images/ path`);

  const footerNotes = count(p.html, 'data-images-notice="footer"');
  if (noticeLive ? footerNotes !== 1 : footerNotes !== 0)
    problems.notice.push(
      `${p.route}: ${footerNotes} footer notice(s), expected ${noticeLive ? 1 : 0} (${noticeLive ? "the note is approved and an image is live" : "the note is not live yet"})`,
    );
  for (const [key, want] of [
    ["gallery", p.route === GALLERY_ROUTE ? 1 : 0],
    ["about", p.route === ABOUT_ROUTE && aboutTeamShown ? 1 : 0],
  ]) {
    const re = new RegExp(
      `<p\\b[^>]*data-images-notice="${key}"[^>]*>([\\s\\S]*?)</p>`,
      "g",
    );
    const hits = [...p.html.matchAll(re)];
    if (hits.length !== want)
      problems.notice.push(
        `${p.route}: ${hits.length} ${key} notice(s), expected ${want}`,
      );
    for (const h of hits)
      if (textOf(h[1]) !== NOTICE[key])
        problems.notice.push(
          `${p.route}: the ${key} notice is not the text of ${NOTICE_FILE} verbatim`,
        );
  }
  if (footerNotes === 1) {
    const m = /<p\b[^>]*data-images-notice="footer"[^>]*>([\s\S]*?)<\/p>/.exec(
      p.html,
    );
    if (m && textOf(m[1]) !== NOTICE.footer)
      problems.notice.push(
        `${p.route}: the footer notice is not the text of ${NOTICE_FILE} verbatim`,
      );
    if (m && !new RegExp(`<a\\b[^>]*href="${GALLERY_ROUTE}"`).test(m[1]))
      problems.notice.push(
        `${p.route}: the footer notice does not link to ${GALLERY_ROUTE} (plain href)`,
      );
  }

  const contentImgs = imgs.filter((i) => srcToEntry.has(i.a.src));
  const isContent = !NOT_CONTENT.has(p.route);
  if (!isContent) {
    if (contentImgs.length)
      problems.excluded.push(
        `${p.route}: carries ${contentImgs.length} content image(s)`,
      );
    continue;
  }

  const n = contentImgs.length;
  if (n < gates.minPerContentPage)
    problems.min.push(
      `${p.route}: ${n} content image(s), minimum ${gates.minPerContentPage}`,
    );
  // An untouched legacy original pre-dates the budgets (manifest-rules.mjs); everything else counts.
  const bytes = contentImgs.reduce((s, i) => {
    const { entry, thumb } = srcToEntry.get(i.a.src);
    if (entry.legacySrc) return s;
    return s + (thumb ? (entry.thumb.bytes ?? 0) : entry.bytes);
  }, 0);
  const budget = gates.pageBudgets?.[p.route] ?? gates.maxPageImageBytes;
  if (bytes > budget)
    problems.pageBytes.push(
      `${p.route}: ${(bytes / 1024).toFixed(0)} KB of images, budget ${(budget / 1024).toFixed(0)} KB`,
    );
  for (const lcp of LCP_SLOTS.filter((l) => l.route === p.route))
    for (const e of visible)
      if (
        !e.legacySrc &&
        e.bytes > lcp.maxBytes &&
        e.placements.some((pl) => pl.route === p.route && pl.slot === lcp.slot)
      )
        problems.pageBytes.push(
          `${p.route}: the LCP image ${e.id} is ${(e.bytes / 1024).toFixed(0)} KB, cap ${(lcp.maxBytes / 1024).toFixed(0)} KB`,
        );

  const high = imgs.filter(
    (i) => (i.a.fetchpriority ?? "").toLowerCase() === "high",
  );
  let priorityOk = true;
  if (n === 0) {
    if (high.length) {
      priorityOk = false;
      problems.priority.push(
        `${p.route}: fetchpriority="high" on a page with no content image`,
      );
    }
  } else if (high.length !== 1) {
    priorityOk = false;
    problems.priority.push(
      `${p.route}: ${high.length} × fetchpriority="high" (exactly one, on the first content image)`,
    );
  } else {
    const first = contentImgs[0];
    if (high[0].at !== first.at) {
      priorityOk = false;
      problems.priority.push(
        `${p.route}: the priority image is not the first content image in DOM order (${first.a.src})`,
      );
    }
    if (high[0].a.loading === "lazy") {
      priorityOk = false;
      problems.priority.push(
        `${p.route}: the priority image is loading="lazy"`,
      );
    }
    for (const i of contentImgs)
      if (i !== high[0] && i.a.loading !== "lazy") {
        priorityOk = false;
        problems.priority.push(`${p.route}: ${i.a.src} is not loading="lazy"`);
      }
  }

  for (const i of contentImgs)
    for (const m of textProblems(decode(i.a.alt), "alt", ctx))
      problems.text.push(`${p.route}: ${i.a.src}: ${m}`);

  // Every caption on the page: an image's own, and the homepage's scene captions around them.
  for (const c of p.html.matchAll(
    /<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/g,
  )) {
    // The gallery's figcaption also carries a link to the page it illustrates; judge the caption alone.
    const text = textOf(c[1].replace(/<a\b[^>]*>[\s\S]*?<\/a>/g, "")).replace(
      /\s*·\s*$/,
      "",
    );
    if (!text) continue;
    for (const m of textProblems(text, "caption", ctx, {
      firstNamesAllowed: p.route === ABOUT_ROUTE,
    }))
      problems.text.push(`${p.route}: figcaption «${text.slice(0, 40)}»: ${m}`);
  }

  for (const f of p.html.matchAll(
    /<(?:figure|div)\b[^>]*\sdata-image-id="([^"]*)"[^>]*>/g,
  )) {
    const id = f[1];
    const entry = byId.get(id);
    if (!entry) {
      problems.figure.push(`${p.route}: figure for unknown image ${id}`);
      continue;
    }
    if (!isVisible(entry, DRAFT))
      problems.figure.push(`${p.route}: figure ${id} is ${entry.status}`);
    if (!placedOn({ entry, thumb: false }, p.route))
      problems.figure.push(
        `${p.route}: figure ${id} has no placement on this route`,
      );
  }

  const rendered = new Set(contentImgs.map((i) => i.a.src));
  const stripCount = visible.filter((e) =>
    e.placements.some((pl) => pl.route === p.route && stripSlot(pl.slot)),
  ).length;
  for (const e of visible)
    for (const pl of e.placements) {
      // The guides index shows each guide's lead as its 480-px thumbnail: that IS the placement rendering.
      if (
        pl.route !== p.route ||
        shadowed(e, pl) ||
        rendered.has(srcOf(e)) ||
        (e.thumb && rendered.has(thumbSrcOf(e)))
      )
        continue;
      if (stripSlot(pl.slot) && stripCount < 2) {
        notes.push(
          `${p.route}: ${e.id} at ${pl.slot} is hidden — a strip renders only with ≥ 2 images`,
        );
        continue;
      }
      problems.placement.push(
        `${p.route}: ${e.id} is placed at ${pl.slot} but does not render`,
      );
    }
  for (const i of contentImgs) {
    const hit = srcToEntry.get(i.a.src);
    if (!placedOn(hit, p.route))
      problems.placement.push(
        `${p.route}: ${i.a.src} (${hit.entry.id}) renders here without a placement on this route`,
      );
  }

  coverage.push({ route: p.route, n, bytes, priorityOk });
}

check(
  "every <img> has numeric width/height and an alt (empty only on non-content images)",
  problems.attrs,
  "components/Figure.tsx emits all three; any other image must too — CLS and a11y",
);
check(
  "no reference to /images/_candidates/ in a production export",
  problems.candidate,
  "a page was rendered with IMAGES_DRAFT=1 — rebuild without it; candidates never ship",
);
check(
  "every /images/ reference resolves to a visible manifest entry",
  problems.unknown,
  "approved only (candidate too under IMAGES_DRAFT=1) — the file may exist, the manifest decides",
);
check(
  "excluded routes carry no content image",
  problems.excluded,
  `${EXCLUDED_ROUTES.join(" ")} — owner decision 2026-11-01, scope`,
);
check(
  `every content page carries ≥ ${gates.minPerContentPage} content image(s)`,
  problems.min,
  "flip gates.minPerContentPage to 2 only once every route is covered",
);
check(
  `image bytes per page ≤ ${(gates.maxPageImageBytes / 1024).toFixed(0)} KB (pageBudgets apart), and the LCP cap`,
  problems.pageBytes,
  "too many or too heavy — re-encode at a smaller class, or move a slot off the page",
);
check(
  "exactly one priority image per image-bearing page — the first content image, eager; all others lazy",
  problems.priority,
  "Figure priority goes to the first rendered figure; FieldStrip tile 1; never two",
);
check(
  "every rendered alt and figcaption passes the text rules",
  problems.text,
  "Hebrew, an alt of 40–160 chars and a caption of 20–200, no claim stems, no finding or reading, no place, no ASCII quote touching Hebrew, a first name on /about/ only",
);
check(
  "every element with data-image-id names a visible entry placed on its route",
  problems.figure,
  "",
);
check(
  "every visible placement renders on its route, and every rendered image is placed there",
  problems.placement,
  "the built page must carry exactly what the manifest says — like the live-kit's out gate",
);
check(
  "no /images/ path inside any application/ld+json or og:image",
  problems.schema,
  "renderings are illustrations, never evidence — /og.png stays the og:image, /icon.svg the schema image",
);
check(
  "the disclosure markers render where the manifest state says, with the notice.json text",
  problems.notice,
  'data-images-notice="gallery" on /gallery/; "footer" on every page once the note is approved and an image is live; "about" under the team figure',
);

// ── 6. draft marks ──────────────────────────────────────────────────────────────────────────
if (DRAFT) {
  const line =
    "This out/ was built with IMAGES_DRAFT=1 and renders candidate images from /images/_candidates/. Never deploy it.\n";
  fs.writeFileSync(path.join(OUT, ".images-draft"), line);
  // check-live-out.mjs owns .live-draft and may have written its own reason first; add ours.
  fs.appendFileSync(path.join(OUT, ".live-draft"), line);
  notes.push(
    `wrote ${OUT}/.images-draft and ${OUT}/.live-draft — ops/deploy-site.ps1 refuses this export`,
  );
}

// ── 7. coverage table ───────────────────────────────────────────────────────────────────────
console.log(
  "\n  route                                            images     KB  priority",
);
for (const c of coverage.sort((a, b) => a.route.localeCompare(b.route)))
  console.log(
    `  ${c.route.padEnd(48)} ${String(c.n).padStart(6)} ${String(Math.round(c.bytes / 1024)).padStart(6)}  ${c.n === 0 ? "—" : c.priorityOk ? "ok" : "FAIL"}`,
  );
const withImages = coverage.filter((c) => c.n > 0).length;
console.log(
  `\n  ${coverage.length} content routes · ${withImages} with images · ${images.length} manifest entries ` +
    `(${images.filter((e) => e.status === "approved").length} approved, ${images.filter((e) => e.status === "candidate").length} candidate) · ` +
    `out/images ${(totalBytes / 1024).toFixed(0)} KB`,
);
for (const n of notes) console.log(`  note  ${n}`);

if (failures.length) {
  console.error(`\ncheck-images-out: ${failures.length} check(s) FAILED\n`);
  for (const f of failures) {
    console.error(`  ✗ ${f.label}`);
    if (f.hint) console.error(`    ${f.hint}`);
    for (const o of f.offenders.slice(0, 25)) console.error(`      ${o}`);
    if (f.offenders.length > 25)
      console.error(`      … and ${f.offenders.length - 25} more`);
    console.error("");
  }
  process.exit(1);
}
console.log("\ncheck-images-out: all checks passed.");
