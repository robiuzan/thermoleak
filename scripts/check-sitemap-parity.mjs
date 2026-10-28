#!/usr/bin/env node
/**
 * Sitemap parity check — closes docs/optimization-backlog.md §1.2.
 *
 * The failure mode this exists to catch: `staticRoutes` in app/sitemap.ts is hand-maintained, so a
 * new page builds green and is SILENTLY absent from sitemap.xml. Nobody notices until it fails to
 * rank.
 *
 * Rather than fragile filesystem-walking to auto-derive the list, this asserts the invariant that
 * actually matters: every emitted route is either IN the sitemap or on an explicit exclusion list.
 * Adding a page therefore forces a deliberate choice — index it, or state why not.
 *
 * It ALSO asserts `public/llms.txt` ⊆ `sitemap.xml`. CLAUDE.md §3 has always stated that rule, and
 * the roadmap claimed this script enforced it — it did not, and nothing else read llms.txt either.
 * The cost showed up on 2026-10-28, when nine `/locations/` URLs for pages that were not built sat
 * in llms.txt and passed every check green. llms.txt is hand-maintained **because `output: "export"`
 * forbids the route handler that would generate it**, so it is the one file in the repo with no
 * mechanical link to reality — which is exactly why it needs a gate rather than a convention.
 * A dead URL here is worse than a dead URL anywhere else: this file exists to be read by answer
 * engines, so every entry is a promise that the page is there.
 *
 * Run after `npm run build`. Exits non-zero on drift.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = "out";
const ORIGIN = "https://thermoleak.co.il";

/** Routes that are emitted but deliberately NOT in the sitemap. Each needs a stated reason. */
const INTENTIONALLY_EXCLUDED = new Map([
  ["/thank-you/", "noindex post-form conversion page (app/thank-you/page.tsx)"],
  ["/404/", "404 artifact — 301s to / via public/_redirects (backlog §1.1)"],
  ["/_not-found/", "404 artifact — 301s to / via public/_redirects (backlog §1.1)"],
]);

function emittedRoutes(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      emittedRoutes(full, acc);
    } else if (entry === "index.html") {
      const rel = relative(OUT, full).split(sep).slice(0, -1).join("/");
      acc.push(rel === "" ? "/" : `/${rel}/`);
    }
  }
  return acc;
}

let sitemapXml;
try {
  sitemapXml = readFileSync(join(OUT, "sitemap.xml"), "utf8");
} catch {
  console.error("FAIL: out/sitemap.xml not found. Run `npm run build` first.");
  process.exit(1);
}

const inSitemap = new Set(
  [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(ORIGIN, "") || "/"),
);
const emitted = emittedRoutes(OUT).sort();

const missing = emitted.filter((r) => !inSitemap.has(r) && !INTENTIONALLY_EXCLUDED.has(r));
const stale = [...inSitemap].filter((r) => !emitted.includes(r));

for (const route of missing) {
  console.error(
    `FAIL: ${route} is emitted but missing from sitemap.xml.\n` +
      `      Add it to staticRoutes in app/sitemap.ts, or to INTENTIONALLY_EXCLUDED here with a reason.`,
  );
}
for (const route of stale) {
  console.error(`FAIL: ${route} is in sitemap.xml but no longer emitted — remove it from app/sitemap.ts.`);
}

// public/llms.txt ⊆ sitemap.xml (CLAUDE.md §3). Read from out/ so it is the SHIPPED copy that is
// checked, not the source — they are the same file today, but out/ is what Pages serves.
let llmsDead = [];
let llmsCount = 0;
try {
  const llms = readFileSync(join(OUT, "llms.txt"), "utf8");
  const urls = [...new Set([...llms.matchAll(/https?:\/\/thermoleak\.co\.il(\/[^\s)\]>,"']*)/g)].map((m) => m[1]))];
  llmsCount = urls.length;
  llmsDead = urls.filter((u) => {
    const route = u.endsWith("/") ? u : `${u}/`;
    // A file reference (sitemap.xml, robots.txt, llms.txt itself) is not a route — check it exists.
    if (/\.[a-z0-9]+$/i.test(u)) {
      try { statSync(join(OUT, u.replace(/^\//, ""))); return false; } catch { return true; }
    }
    return !inSitemap.has(route);
  });
} catch {
  console.error("FAIL: out/llms.txt not found. It is hand-maintained in public/ and must ship.");
  process.exit(1);
}

for (const url of llmsDead) {
  console.error(
    `FAIL: llms.txt advertises ${url}, which is not in sitemap.xml and not a shipped file.\n` +
      `      Answer engines read this file as a promise that the page exists. Either ship the page\n` +
      `      (and index it) or remove the line — CLAUDE.md §3: llms.txt must stay a SUBSET of the sitemap.`,
  );
}

if (missing.length || stale.length || llmsDead.length) process.exit(1);

console.log(
  `sitemap parity OK — ${emitted.length} routes emitted, ${inSitemap.size} indexed, ` +
    `${INTENTIONALLY_EXCLUDED.size} deliberately excluded; llms.txt ${llmsCount} URL(s), all live.`,
);
