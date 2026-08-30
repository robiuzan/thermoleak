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

if (missing.length || stale.length) process.exit(1);

console.log(
  `sitemap parity OK — ${emitted.length} routes emitted, ${inSitemap.size} indexed, ` +
    `${INTENTIONALLY_EXCLUDED.size} deliberately excluded.`,
);
