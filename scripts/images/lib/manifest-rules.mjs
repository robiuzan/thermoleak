/**
 * manifest-rules.mjs — the rules of content/images/manifest.json, in ONE place.
 *
 * Imported by BOTH `lib/images.ts` (which throws at module init, so a bad manifest cannot build a
 * page) and `scripts/images/check-images-out.mjs` (which proves the export). Two copies of these
 * rules would drift the way the hand-written SEO greps drifted before the build gates existed, so
 * there is one. Pure: no fs, no network — the gate supplies the file-system facts, this module
 * supplies the judgement. JSDoc types are what `tsc` reads at the import boundary (allowJs).
 *
 * The contract: Media Studio/page-images/docs/contract.md §2 (slots) and §4 (manifest + rules),
 * with this site's differences recorded in CLAUDE.md §15. Every site literal is in
 * ./images.config.mjs.
 *
 * Images here are illustrations under one site-wide note, never evidence (owner decision
 * 2026-11-01): the rules below are on the WORDS around a picture — an alt or a caption never
 * claims a job, a finding, a reading, a place, a date, a customer or a name. A thermal screen in a
 * picture is an illustration: words describe its colours, never what it "shows".
 */

import {
  BANNED_NAMES_HE,
  FILE_GROUPS,
  FIRST_NAMES_HE,
  PEOPLE_IDS,
  SIZE_CLASSES,
  extraBanned,
  extraBannedRegex,
} from "./images.config.mjs";

/**
 * Every slot id a placement may name (contract §2), plus `end` — the second position an article's
 * `figure` block may declare (lib/articles.ts).
 */
export const SLOT_IDS = Object.freeze([
  "main",
  "detail",
  "work",
  "strip-1",
  "strip-2",
  "strip-3",
  "pair-1",
  "pair-2",
  "team",
  "story",
  "survey",
  "layers",
  "lead",
  "mid",
  "end",
  "supplied",
  "generated",
]);

export const STATUSES = Object.freeze([
  "candidate",
  "approved",
  "rejected",
  "retired",
]);
export const PHASES = Object.freeze([
  "done",
  "in-progress",
  "diagnosis",
  "materials",
]);

/** A `retired` entry keeps its file at least this long (contract §4). */
export const RETIRED_KEEP_DAYS = 60;

/** A revoked consent overrides that keep: the person's image leaves the site within this many days. */
export const REVOKED_REMOVE_DAYS = 14;

export const GATE_KEYS = Object.freeze([
  "minPerContentPage",
  "maxImageBytes",
  "maxPageImageBytes",
  "maxTotalBytes",
]);

/**
 * @typedef {object} RulesContext
 * @property {readonly string[]} contentRoutes  every route a placement may name
 * @property {readonly string[]} cityNames      the 12 Hebrew city names (lib/locations.ts)
 * @property {readonly string[]} citySlugs      the 12 location slugs — never inside a file name
 * @property {readonly string[]} serviceSlugs   the 4 service slugs
 */

const HEBREW = /[א-ת]/;
const isObj = (x) => typeof x === "object" && x !== null && !Array.isArray(x);
const isPosInt = (x) => Number.isInteger(x) && x > 0;
const isNonNegInt = (x) => Number.isInteger(x) && x >= 0;
const DATE_STAMP = /^\d{4}-\d{2}-\d{2}\s*[—–-]\s*\S/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** @param {string} s */
export function hasHebrew(s) {
  return HEBREW.test(String(s));
}

/** Hebrew word edges — \b is ASCII-only. Up to two prefix letters (ב, ל, מ, ו, ה, ש, כ). */
const hebrewWord = (name) =>
  new RegExp(
    `(?<![\\u05d0-\\u05ea])[ובלמהשכ]{0,2}${escapeRe(name).replace(/ /g, "[\\s\\-־]+")}(?![\\u05d0-\\u05ea])`,
  );
function escapeRe(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * The generic claim stems an alt or caption may never carry (contract §4). Disclosure is site-wide,
 * so the words that would label one image ("הדמיה", "AI") are banned too: a label on some images
 * implies the others are photographs. A figure with a unit is a job fact, and so are a price, a
 * warranty and a customer. This trade's own stems — the finding and the reading above all — are
 * `extraBanned` and `extraBannedRegex` in images.config.mjs, which Media Studio's alt writer shares.
 * `ביטוח` alone stays legal: it is the name of a service; the claim to BE insured is not.
 */
const EXTRA_BANNED_RE = extraBannedRegex.map((src) => new RegExp(src));
const CAMERA_EN =
  /(?<![A-Za-z0-9])(?:FLIR|E8|E5|Fluke|Testo|Hikmicro)(?![A-Za-z0-9])/i;
const BANNED = [
  {
    re: /תמונה של/,
    why: "״תמונה של״ — describe what is in frame, not that it is a picture",
  },
  { re: /לפני ואחרי/, why: "״לפני ואחרי״ — no pair exists, so it is a claim" },
  {
    re: /כוכב|דירוג|★|מומל[צץ]/,
    why: "a rating/recommendation stem (כוכב / דירוג / ★ / מומלץ)",
  },
  {
    re: /הדמי|(?<![A-Za-z])AI(?![A-Za-z])|(?<![א-ת])בינה(?![א-ת])/,
    why: "a per-image AI label (הדמיה / AI / בינה) — disclosure is the site-wide note",
  },
  { re: /(?<!\d)\d{4}(?!\d)/, why: "a 4-digit number reads as a year" },
  { re: /\d{1,2}\s*[./]\s*\d{1,2}/, why: "a date-like number pair" },
  {
    re: /\d\s*מ[״"׳']?[רמ](?![א-ת])/,
    why: "digits before מ״ר / מ״מ — an area or thickness is a job fact",
  },
  {
    re: /\d\s*(?:ס[״"׳']?מ|סנטימטר|מטר|מ׳|אינ[׳']?ץ|ק[״"]ג|ליטר|טון)(?![א-ת])/,
    why: "a number with a unit (ס״מ / מטר / אינץ׳ / ק״ג) — a thickness, length or diameter is a job fact",
  },
  { re: /קוטר\s*\d/, why: "a core diameter — a job fact" },
  {
    re: /\d\s*(?:שעות|שעה|ימים|יום|שבועות|שבוע|חודשים|חודש|שנים|שנה|שנות)(?![א-ת])/,
    why: "digits with a duration word — how long a job took is a job fact",
  },
  {
    re: /₪|ש["״]ח|(?<![א-ת])[ובלה]?שקל(?:ים)?(?![א-ת])|מחיר/,
    why: "a price stem (₪ / ש״ח / שקל / מחיר)",
  },
  { re: /אחריות/, why: "a warranty word — a term, not a picture" },
  {
    re: /לקוח|דייר(?:ים|ת)?(?![א-ת])|משפחת\s/,
    why: "a customer stem (לקוח / דייר / משפחת)",
  },
  { re: /מעל\s*\d+\s*שנ/, why: "a count of years — a number needs a source" },
  {
    re: /[א-ת]["']|["'][א-ת]/,
    why: "an ASCII quote touching a Hebrew letter — use גרש ׳ and גרשיים ״",
  },
];

/**
 * Problems with one alt or caption text. Empty array = clean.
 * @param {unknown} text
 * @param {"alt"|"caption"} kind
 * @param {RulesContext} ctx
 * @param {{ firstNamesAllowed?: boolean }} [opts]  captions on /about/ only
 * @returns {string[]}
 */
export function textProblems(text, kind, ctx, opts = {}) {
  const out = [];
  if (typeof text !== "string" || !text.trim()) return [`${kind} is empty`];
  const t = text.trim();
  if (!hasHebrew(t)) out.push(`${kind} has no Hebrew letters`);
  // The site's floor for a caption is lower than the toolkit's, for the short scene captions in lib/gallery.ts.
  const [min, max] = kind === "alt" ? [40, 160] : [20, 200];
  if (t.length < min || t.length > max)
    out.push(`${kind} is ${t.length} chars (${min}–${max} allowed)`);
  for (const b of BANNED)
    if (b.re.test(t)) out.push(`${kind} carries ${b.why}`);
  for (const stem of extraBanned)
    if (t.includes(stem)) out.push(`${kind} carries the banned stem «${stem}»`);
  for (const re of EXTRA_BANNED_RE)
    if (re.test(t))
      out.push(
        `${kind} matches a banned pattern: «${re.exec(t)?.[0]}» (images.config.mjs)`,
      );
  for (const name of ctx.cityNames)
    if (hebrewWord(name).test(t))
      out.push(
        `${kind} names a city (${name}) — the page's own headings supply it`,
      );
  if (!opts.firstNamesAllowed)
    for (const name of FIRST_NAMES_HE)
      if (hebrewWord(name).test(t))
        out.push(
          `${kind} names ${name} — first names only in a caption whose every placement is /about/`,
        );
  for (const name of BANNED_NAMES_HE)
    if (hebrewWord(name).test(t))
      out.push(`${kind} names ${name} — this name never appears in image text`);
  return out;
}

/**
 * The public path an entry renders from. `legacySrc` (an untouched original) wins; an approved
 * file lives under /images/, a candidate under /images/_candidates/.
 * @param {{ file: string, legacySrc?: string | null, status: string }} entry
 * @returns {string}
 */
export function srcOf(entry) {
  if (entry.legacySrc) return entry.legacySrc;
  return entry.status === "candidate"
    ? `/images/_candidates/${entry.file}`
    : `/images/${entry.file}`;
}

/**
 * The public path of an entry's derived thumbnail, or null.
 * @param {{ status: string, thumb?: { file: string } | null }} entry
 * @returns {string | null}
 */
export function thumbSrcOf(entry) {
  if (!entry.thumb) return null;
  return entry.status === "candidate"
    ? `/images/_candidates/${entry.thumb.file}`
    : `/images/${entry.thumb.file}`;
}

/**
 * Whether an entry renders: approved always; a candidate only in draft mode (IMAGES_DRAFT=1).
 * @param {{ status: string }} entry
 * @param {boolean} draft
 */
export function isVisible(entry, draft) {
  return entry.status === "approved" || (draft && entry.status === "candidate");
}

/**
 * Whether the footer note renders: its wording carries the owner's `approved` stamp and an image it
 * describes is live. Shared by lib/images.ts and the gate, so the two cannot disagree.
 * @param {{ approved?: unknown }} notice
 * @param {readonly { status: string }[]} images
 * @returns {boolean}
 */
export function noticeIsLive(notice, images) {
  return (
    DATE_STAMP.test(String(notice?.approved ?? "")) &&
    images.some((e) => e.status === "approved")
  );
}

/**
 * Whether a file slug carries an area token as a dash-separated run ("tel-aviv-wall-01").
 * @param {string} fileSlug
 * @param {readonly string[]} citySlugs
 * @returns {string | null} the offending area slug
 */
export function citySlugInFile(fileSlug, citySlugs) {
  const tokens = fileSlug.split("-");
  for (const slug of citySlugs) {
    const parts = slug.split("-");
    for (let i = 0; i + parts.length <= tokens.length; i++) {
      if (parts.every((p, j) => tokens[i + j] === p)) return slug;
    }
  }
  return null;
}

/** @param {unknown} v */
const provenanceProblems = (v) => {
  if (!isObj(v)) return ["provenance must be an object"];
  const out = [];
  if (v.kind === "ai-generated") {
    for (const k of ["tool", "model", "created", "prompt", "promptSha"])
      if (typeof v[k] !== "string" || !v[k])
        out.push(`provenance.${k} is required`);
    if (!Array.isArray(v.refs)) out.push("provenance.refs must be an array");
  } else if (v.kind === "owner-supplied") {
    if (typeof v.received !== "string" || !ISO_DATE.test(v.received))
      out.push("provenance.received must be an ISO date");
    if (v.originAsserted !== false)
      out.push(
        "provenance.originAsserted must be false — never ״verified real״",
      );
  } else out.push(`provenance.kind must be ai-generated | owner-supplied`);
  return out;
};

/**
 * Problems with one entry (shape + text rules + status consistency). Prefixed by the caller.
 * @param {unknown} e
 * @param {RulesContext} ctx
 * @param {{ maxImageBytes: number }} gates
 * @returns {string[]}
 */
export function entryProblems(e, ctx, gates) {
  if (!isObj(e)) return ["entry is not an object"];
  const out = [];
  const p = (m) => out.push(m);

  if (typeof e.id !== "string" || !/^[a-z0-9-]+$/.test(e.id))
    p("id must match [a-z0-9-]+");
  const fileRe = new RegExp(
    `^(${FILE_GROUPS.join("|")})/([a-z0-9-]+)\\.(webp|jpg|jpeg|png)$`,
  );
  const fm = typeof e.file === "string" ? fileRe.exec(e.file) : null;
  if (!fm)
    p(
      `file must be <group>/<slug>.webp|jpg|png with group in ${FILE_GROUPS.join("|")}`,
    );
  else {
    const city = citySlugInFile(fm[2], ctx.citySlugs);
    if (city)
      p(
        `file names an area (${city}) — file names are subject-based, never a place`,
      );
    for (const n of PEOPLE_IDS)
      if (fm[2].split("-").includes(n)) p(`file names a person (${n})`);
  }
  // Unlike the sibling sites, this site's untouched originals already live under /images/.
  if (e.legacySrc !== null && e.legacySrc !== undefined) {
    if (typeof e.legacySrc !== "string" || !/^\/[^/]/.test(e.legacySrc))
      p("legacySrc must be an absolute /path or null");
  }
  const legacy = Boolean(e.legacySrc);

  if (!isPosInt(e.width) || !isPosInt(e.height))
    p("width/height must be positive integers");
  if (!isPosInt(e.bytes)) p("bytes must be a positive integer");
  if (typeof e.sha256 !== "string" || !/^[0-9a-f]{64}$/.test(e.sha256))
    p("sha256 must be 64 lowercase hex chars");
  const cls =
    typeof e.sizeClass === "string" ? SIZE_CLASSES[e.sizeClass] : undefined;
  if (!cls)
    p(`sizeClass must be one of ${Object.keys(SIZE_CLASSES).join("|")}`);
  else if (!legacy) {
    const cap = Math.min(gates.maxImageBytes, cls.maxBytes);
    if (isPosInt(e.bytes) && e.bytes > cap)
      p(`bytes ${e.bytes} exceed the ${e.sizeClass} budget of ${cap}`);
    if (
      isPosInt(e.width) &&
      isPosInt(e.height) &&
      Math.max(e.width, e.height) !== cls.longEdge
    )
      p(`long edge must be ${cls.longEdge} for sizeClass ${e.sizeClass}`);
  }

  // A retired entry has usually lost its placements to whatever replaced it: only its file stays.
  if (
    !Array.isArray(e.placements) ||
    (e.placements.length === 0 && e.status !== "retired")
  )
    p("placements must be a non-empty array");
  const placements = Array.isArray(e.placements) ? e.placements : [];
  for (const pl of placements) {
    if (!isObj(pl)) {
      p("placement is not an object");
      continue;
    }
    if (typeof pl.route !== "string" || !ctx.contentRoutes.includes(pl.route))
      p(`placement route ${JSON.stringify(pl.route)} is not a content route`);
    if (!SLOT_IDS.includes(pl.slot))
      p(`placement slot ${JSON.stringify(pl.slot)} is not a SlotId`);
    if (!isPosInt(pl.order)) p("placement order must be a positive integer");
  }

  // A retired entry renders nowhere, so a caption that was legal while it was live stays legal.
  const everyAbout =
    e.status === "retired" ||
    (placements.length > 0 &&
      placements.every((pl) => isObj(pl) && pl.route === "/about/"));
  for (const m of textProblems(e.alt, "alt", ctx)) p(m);
  if (e.caption !== null && e.caption !== undefined)
    for (const m of textProblems(e.caption, "caption", ctx, {
      firstNamesAllowed: everyAbout,
    }))
      p(m);
  if (e.altEn !== null && e.altEn !== undefined && typeof e.altEn !== "string")
    p("altEn must be a string or null");
  if (typeof e.altEn === "string") {
    if (e.altEn.length < 30 || e.altEn.length > 160)
      p(`altEn is ${e.altEn.length} chars (30–160 allowed)`);
    if (!/^[\x20-\x7e]+$/.test(e.altEn)) p("altEn must be plain ASCII");
    if (CAMERA_EN.test(e.altEn))
      p(
        "altEn names a camera make or model — the site names it, an image's text never does",
      );
  }

  if (e.consentRevoked !== null && e.consentRevoked !== undefined) {
    if (e.status !== "retired") p("consentRevoked belongs on a retired entry");
    if (!ISO_DATE.test(String(e.consentRevoked)))
      p("consentRevoked must be YYYY-MM-DD");
  }

  if (e.thumb !== null && e.thumb !== undefined) {
    if (
      !isObj(e.thumb) ||
      typeof e.thumb.file !== "string" ||
      !fileRe.test(e.thumb.file)
    )
      p("thumb.file must be <group>/<slug>.<ext>");
    else if (!isPosInt(e.thumb.width) || !isPosInt(e.thumb.height))
      p("thumb.width/height must be positive integers");
    else if (
      Math.max(e.thumb.width, e.thumb.height) !== SIZE_CLASSES.thumb.longEdge
    )
      p(`thumb long edge must be ${SIZE_CLASSES.thumb.longEdge}`);
    if (
      isObj(e.thumb) &&
      isPosInt(e.thumb.bytes) &&
      e.thumb.bytes > SIZE_CLASSES.thumb.maxBytes
    )
      p(`thumb bytes exceed ${SIZE_CLASSES.thumb.maxBytes}`);
  }

  if (!STATUSES.includes(e.status)) p(`status must be ${STATUSES.join("|")}`);
  if (!Array.isArray(e.people) || e.people.some((x) => !PEOPLE_IDS.includes(x)))
    p(`people must list only ${PEOPLE_IDS.join("|")}`);
  if (e.phase !== null && !PHASES.includes(e.phase))
    p(`phase must be null or ${PHASES.join("|")}`);
  if (e.service !== null && !ctx.serviceSlugs.includes(e.service))
    p(`service ${JSON.stringify(e.service)} is not a service slug`);
  if (
    e.city !== null &&
    e.city !== undefined &&
    !ctx.citySlugs.includes(e.city)
  )
    p(`city ${JSON.stringify(e.city)} is not a location slug`);

  for (const m of provenanceProblems(e.provenance)) p(m);
  const kind = isObj(e.provenance) ? e.provenance.kind : undefined;

  if (e.watermark === null || e.watermark === undefined) {
    if (!legacy)
      p(
        "watermark is required on every entry except the untouched legacy originals",
      );
  } else if (
    !isObj(e.watermark) ||
    e.watermark.corner !== "bottom-right" ||
    !["white", "navy"].includes(e.watermark.logo) ||
    !(typeof e.watermark.widthPct === "number" && e.watermark.widthPct > 0)
  )
    p(
      "watermark must be { logo: white|navy, corner: bottom-right, widthPct > 0 }",
    );

  if (!isObj(e.review)) p("review must be an object with automated and owner");
  const automated = isObj(e.review) ? e.review.automated : undefined;
  const owner = isObj(e.review) ? e.review.owner : undefined;
  if (automated !== null && automated !== undefined) {
    if (
      !isObj(automated) ||
      !["pass", "pass-with-note", "regenerate", "reject"].includes(
        automated.verdict,
      )
    )
      p(
        "review.automated.verdict must be pass | pass-with-note | regenerate | reject",
      );
  }
  if (owner !== null && owner !== undefined) {
    if (
      !isObj(owner) ||
      !["approved", "rejected", "regenerate"].includes(owner.decision)
    )
      p("review.owner.decision must be approved | rejected | regenerate");
  }

  if (e.status === "approved") {
    if (typeof e.approved !== "string" || !DATE_STAMP.test(e.approved))
      p('approved must read "YYYY-MM-DD — who" on an approved entry');
    if (!isObj(owner) || owner.decision !== "approved")
      p("an approved entry needs review.owner.decision === approved");
    if (
      kind === "ai-generated" &&
      !(
        isObj(automated) &&
        ["pass", "pass-with-note"].includes(automated.verdict)
      )
    )
      p(
        "an approved rendering needs review.automated.verdict pass | pass-with-note",
      );
  } else if (
    e.status !== "retired" &&
    e.approved !== null &&
    e.approved !== undefined
  )
    p("approved must be null unless status is approved or retired");
  if (e.status === "retired") {
    if (typeof e.retired !== "string" || !ISO_DATE.test(e.retired))
      p("retired must be an ISO date on a retired entry");
  } else if (e.retired !== null && e.retired !== undefined)
    p("retired must be null unless status is retired");

  return out;
}

/**
 * Every problem in a manifest object, each prefixed `images[i] (<id>): `. Empty array = valid.
 * @param {unknown} raw
 * @param {RulesContext} ctx
 * @returns {string[]}
 */
export function manifestProblems(raw, ctx) {
  const out = [];
  const p = (m) => out.push(m);
  if (!isObj(raw)) return ["manifest is not an object"];
  if (raw.version !== 1)
    p(`version must be 1 (got ${JSON.stringify(raw.version)})`);
  if (typeof raw.site !== "string" || !raw.site)
    p("site must be a non-empty string");
  const gates = isObj(raw.gates) ? raw.gates : null;
  if (!gates) p("gates must be an object");
  else {
    for (const k of GATE_KEYS)
      if (!isNonNegInt(gates[k]))
        p(`gates.${k} must be a non-negative integer`);
    if (gates.pageBudgets !== undefined) {
      if (!isObj(gates.pageBudgets))
        p("gates.pageBudgets must be an object (route → bytes)");
      else
        for (const [route, bytes] of Object.entries(gates.pageBudgets))
          if (!ctx.contentRoutes.includes(route) || !isPosInt(bytes))
            p(
              `gates.pageBudgets[${JSON.stringify(route)}] must be a positive integer for a content route`,
            );
    }
  }
  if (!Array.isArray(raw.images)) {
    p("images must be an array");
    return out;
  }
  const maxImageBytes =
    gates && isPosInt(gates.maxImageBytes) ? gates.maxImageBytes : Infinity;
  const ids = new Map();
  const files = new Map();
  const slots = new Map();
  raw.images.forEach((e, i) => {
    const label = `images[${i}]${isObj(e) && typeof e.id === "string" ? ` (${e.id})` : ""}`;
    for (const m of entryProblems(e, ctx, { maxImageBytes }))
      p(`${label}: ${m}`);
    if (!isObj(e)) return;
    if (typeof e.id === "string") {
      if (ids.has(e.id))
        p(`${label}: duplicate id (also images[${ids.get(e.id)}])`);
      ids.set(e.id, i);
    }
    for (const f of [e.file, isObj(e.thumb) ? e.thumb.file : null]) {
      if (typeof f !== "string") continue;
      if (files.has(f))
        p(`${label}: duplicate file ${f} (also images[${files.get(f)}])`);
      files.set(f, i);
    }
    if (e.status === "approved" && Array.isArray(e.placements))
      for (const pl of e.placements) {
        if (!isObj(pl)) continue;
        const key = `${pl.route} ${pl.slot} ${pl.order}`;
        if (slots.has(key))
          p(
            `${label}: two approved entries occupy ${key} (also images[${slots.get(key)}])`,
          );
        slots.set(key, i);
      }
  });
  return out;
}
