/**
 * images-status.mjs — plan vs manifest, per route. A status report, not a gate: exit 0 always.
 *
 * content/images/plan.json (authored by the art-director agent; the toolkit only reads it) says
 * which slots each route SHOULD carry; content/images/manifest.json (written by the toolkit) says
 * what exists and in which status. This prints, for every content route, the planned slots, what
 * is approved, what is still a candidate, and what is missing — the list the next batch is built
 * from. A missing plan.json is tolerated (manifest-only view), so the report works on day one.
 *
 * Usage: node scripts/images/images-status.mjs   (= npm run images:status)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { EXCLUDED_ROUTES, LISTS } from "./lib/images.config.mjs";
import { objectStrings, topLevelObjects, tsArray } from "./lib/ts-scan.mjs";

process.chdir(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".."),
);

const read = (f) =>
  fs.existsSync(f)
    ? JSON.parse(fs.readFileSync(f, "utf8").replace(/^﻿/, ""))
    : null;
const plan = read("content/images/plan.json");
const manifest = read("content/images/manifest.json");
if (!manifest) {
  console.error("images-status: content/images/manifest.json is missing");
  process.exit(1);
}

/** Content routes, derived the way lib/images.ts derives them (scanned: this script cannot import TS). */
const rowsOf = ({ file, const: name }) =>
  topLevelObjects(tsArray(fs.readFileSync(file, "utf8"), name) ?? "[]").map(
    objectStrings,
  );
const fill = (pattern, row) => pattern.replace("{slug}", row.slug);
const staticRoutes = rowsOf(LISTS.staticRoutes)
  .filter((r) => typeof r.path === "string")
  .map((r) => (r.path === "" ? "/" : `${r.path}/`));
const listRoutes = [LISTS.services, LISTS.articles, LISTS.locations].flatMap(
  (cfg) =>
    rowsOf(cfg)
      .filter((r) => r.slug)
      .map((r) => fill(cfg.route, r)),
);
const contentRoutes = [...new Set([...staticRoutes, ...listRoutes])].filter(
  (r) => !EXCLUDED_ROUTES.includes(r),
);

if (!staticRoutes.length || !listRoutes.length)
  console.warn(
    `images-status: WARNING — read ${staticRoutes.length} static and ${listRoutes.length} list routes; the scanner found no rows`,
  );

const planned = new Map(); // route → [{ slot, id }]
if (plan) {
  for (const s of plan.slots ?? [])
    planned.set(s.route, [
      ...(planned.get(s.route) ?? []),
      { slot: s.slot, id: s.id },
    ]);
  for (const r of plan.reuse ?? [])
    planned.set(r.route, [
      ...(planned.get(r.route) ?? []),
      { slot: r.slot, id: `reuse ${r.of}` },
    ]);
}
const have = new Map(); // route → { slot → [status] }
for (const e of manifest.images ?? [])
  for (const pl of e.placements ?? []) {
    const slots = have.get(pl.route) ?? new Map();
    slots.set(pl.slot, [...(slots.get(pl.slot) ?? []), e.status]);
    have.set(pl.route, slots);
  }

const routes = [
  ...new Set([...contentRoutes, ...planned.keys(), ...have.keys()]),
].sort();
const totals = { planned: 0, approved: 0, candidate: 0, missing: 0 };
console.log(
  `images-status: ${plan ? `plan ${(plan.slots ?? []).length} slots + ${(plan.reuse ?? []).length} reuse` : "no content/images/plan.json yet"}; manifest ${(manifest.images ?? []).length} entries; ${contentRoutes.length} content routes\n`,
);
console.log(
  "  route                                            approved  candidate  missing (planned slot)",
);
for (const route of routes) {
  const slots = have.get(route) ?? new Map();
  const approved = [...slots]
    .filter(([, st]) => st.includes("approved"))
    .map(([s]) => s);
  const candidate = [...slots]
    .filter(([, st]) => st.includes("candidate") && !st.includes("approved"))
    .map(([s]) => s);
  const want = planned.get(route) ?? [];
  const missing = want
    .filter((w) => !approved.includes(w.slot) && !candidate.includes(w.slot))
    .map((w) => w.slot);
  totals.planned += want.length;
  totals.approved += approved.length;
  totals.candidate += candidate.length;
  totals.missing += missing.length;
  const flag = !contentRoutes.includes(route) ? "  ⚠ not a content route" : "";
  console.log(
    `  ${route.padEnd(48)} ${String(approved.length).padStart(8)} ${String(candidate.length).padStart(10)}  ${missing.join(", ") || (want.length ? "—" : plan ? "(unplanned)" : "")}${flag}`,
  );
}
console.log(
  `\n  planned ${totals.planned} · approved ${totals.approved} · candidate ${totals.candidate} · missing ${totals.missing}` +
    (plan ? "" : " (no plan: nothing can be missing yet)"),
);
