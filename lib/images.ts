/**
 * images.ts — the site's accessors for content/images/manifest.json.
 *
 * The manifest is WRITTEN by the fleet toolkit (Media Studio/page-images `stage` / `install`) and
 * only READ here. It is validated at module init against the rules in
 * scripts/images/lib/manifest-rules.mjs — the same module `scripts/images/check-images-out.mjs`
 * runs on the export — so a manifest that breaks a rule cannot render a page, let alone ship.
 *
 * WHAT A PAGE MAY SHOW. `approved` entries always. `candidate` entries only when the build or dev
 * server runs with `IMAGES_DRAFT=1` (they are served from /images/_candidates/, which the gate
 * prunes from a non-draft export). `rejected` and `retired` entries never render. Nothing in this
 * file decides WHICH image goes where — that is the manifest's `placements`, authored upstream from
 * content/images/plan.json — it only answers "what renders at (route, slot) right now".
 *
 * Renderings are illustrations, never evidence (CLAUDE.md §15): nothing exported here feeds JSON-LD
 * or og:image, and `check-images-out.mjs` fails the build if an /images/ path ever appears in one.
 *
 * `imagesNote` lives here and not in lib/site.ts on purpose: lib/site.ts reaches the client
 * components, and the disclosure texts have no business in their bundles.
 */
import { articles } from "@/lib/articles";
import { locations } from "@/lib/locations";
import { services } from "@/lib/services";
import { staticRoutes, withTrailingSlash } from "@/lib/site";
import manifestJson from "@/content/images/manifest.json";
import noticeJson from "@/content/images/notice.json";
import { EXCLUDED_ROUTES } from "@/scripts/images/lib/images.config.mjs";
import {
  isVisible,
  manifestProblems,
  noticeIsLive,
  srcOf as srcOfEntry,
  thumbSrcOf,
} from "@/scripts/images/lib/manifest-rules.mjs";

export type ImageStatus = "candidate" | "approved" | "rejected" | "retired";
export type SlotId =
  | "main"
  | "detail"
  | "work"
  | "strip-1"
  | "strip-2"
  | "strip-3"
  | "pair-1"
  | "pair-2"
  | "team"
  | "story"
  | "survey"
  | "layers"
  | "lead"
  | "mid"
  | "end"
  | "supplied"
  | "generated";
export type SizeClass = "large" | "half" | "tile" | "thumb";
export type Phase = "done" | "in-progress" | "diagnosis" | "materials";
export type PersonId = "omer" | "yoav";

export interface Placement {
  route: string;
  slot: SlotId;
  order: number;
}

export type Provenance =
  | {
      kind: "ai-generated";
      tool: string;
      model: string;
      created: string;
      prompt: string;
      promptSha: string;
      masterSha?: string | null;
      refs: readonly string[];
    }
  | {
      kind: "owner-supplied";
      received: string;
      /** Always false: a supplied image is never asserted to be a record of a job. */
      originAsserted: false;
      note?: string | null;
    };

export interface Watermark {
  logo: "white" | "navy";
  corner: "bottom-right";
  widthPct: number;
}

export interface AutomatedReview {
  verdict: "pass" | "pass-with-note" | "regenerate" | "reject";
  codes: readonly unknown[];
  judges?: Record<string, string>;
  checkedAt: string;
}

export interface OwnerReview {
  decision: "approved" | "rejected" | "regenerate";
  by: string;
  at: string;
  note?: string | null;
}

export interface ImageThumb {
  file: string;
  width: number;
  height: number;
  bytes?: number;
  sha256?: string;
}

export interface ImageEntry {
  id: string;
  file: string;
  legacySrc: string | null;
  width: number;
  height: number;
  bytes: number;
  sha256: string;
  sizeClass: SizeClass;
  alt: string;
  caption: string | null;
  altEn: string | null;
  thumb: ImageThumb | null;
  placements: readonly Placement[];
  status: ImageStatus;
  people: readonly PersonId[];
  phase: Phase | null;
  service: string | null;
  /** A location slug (lib/locations.ts) — never in a file name, an alt or a caption. */
  city: string | null;
  provenance: Provenance;
  watermark: Watermark | null;
  review: { automated: AutomatedReview | null; owner: OwnerReview | null };
  approved: string | null;
  retired: string | null;
}

export interface ImageGates {
  minPerContentPage: number;
  maxImageBytes: number;
  maxPageImageBytes: number;
  maxTotalBytes: number;
  /** A route that is allowed more image bytes than `maxPageImageBytes`. */
  pageBudgets?: Record<string, number>;
}

export interface ImageManifest {
  version: 1;
  site: string;
  gates: ImageGates;
  images: readonly ImageEntry[];
}

/** What a component receives: resolved src, the text, and enough to decide the markup. */
export interface PlacedImage {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string | null;
  status: ImageStatus;
  service: string | null;
  people: readonly PersonId[];
  /** The route the image was made for (its first placement) — the gallery links back to it. */
  route: string;
  /** The placement's order — the homepage gallery groups its scenes by it (lib/gallery.ts). */
  order: number;
  /** The derived 480-px thumbnail (the guides index cards), when the toolkit produced one. */
  thumb?: { src: string; width: number; height: number };
}

/** The disclosure texts. Owner-approved: a wording change needs a new approval (CLAUDE.md §15). */
export interface ImagesNote {
  approved: string;
  gallery: string;
  footer: string;
  footerLinkLabel: string;
  about: string;
  generatedTitle: string;
  galleryIntro: string;
  galleryDescription: string;
}

export const imagesNote: ImagesNote = noticeJson;

/** `IMAGES_DRAFT=1` — read at build/dev time in RSC, like the live-kit's LIVE_DRAFT. */
export const imagesDraftMode = process.env.IMAGES_DRAFT === "1";

/**
 * Every route that may carry a content image, derived from the same arrays the routes are generated
 * from, minus the excluded routes. A placement naming anything else fails validation below.
 */
export function contentRoutes(): readonly string[] {
  const all = [
    ...staticRoutes.map((r) => withTrailingSlash(r.path)),
    ...services.map((s) => `/services/${s.slug}/`),
    ...articles.map((a) => `/guides/${a.slug}/`),
    ...locations.map((l) => `/locations/${l.slug}/`),
  ];
  return all.filter((r) => !EXCLUDED_ROUTES.includes(r));
}

/**
 * Runtime validation of the imported JSON. The assertion signature is what narrows `unknown` to
 * `ImageManifest` — a cast backed by every rule in manifest-rules.mjs, not a bare `as`.
 */
function assertManifest(raw: unknown): asserts raw is ImageManifest {
  const problems = manifestProblems(raw, {
    contentRoutes: contentRoutes(),
    cityNames: locations.map((l) => l.name),
    citySlugs: locations.map((l) => l.slug),
    serviceSlugs: services.map((s) => s.slug),
  });
  if (problems.length > 0) {
    throw new Error(
      `images manifest: ${problems.length} problem(s) in content/images/manifest.json\n  - ${problems.join("\n  - ")}`,
    );
  }
}

const raw: unknown = manifestJson;
assertManifest(raw);

/** The validated manifest. Read-only; the toolkit owns the file. */
export const imageManifest: ImageManifest = raw;
export const imageGates: ImageGates = imageManifest.gates;

/** Public path for an entry: legacySrc wins; approved → /images/<file>; candidate → /images/_candidates/<file>. */
export function srcOf(entry: ImageEntry): string {
  return srcOfEntry(entry);
}

const visible: readonly ImageEntry[] = imageManifest.images.filter((e) =>
  isVisible(e, imagesDraftMode),
);

function place(entry: ImageEntry, order: number): PlacedImage {
  const thumbSrc = thumbSrcOf(entry);
  const placed: PlacedImage = {
    id: entry.id,
    src: srcOf(entry),
    width: entry.width,
    height: entry.height,
    alt: entry.alt,
    caption: entry.caption,
    status: entry.status,
    service: entry.service,
    people: entry.people,
    route: entry.placements[0]?.route ?? "/",
    order,
  };
  if (entry.thumb && thumbSrc) {
    placed.thumb = {
      src: thumbSrc,
      width: entry.thumb.width,
      height: entry.thumb.height,
    };
  }
  return placed;
}

/** Every visible image placed at (route, slot), in placement order. Empty when none. */
export function imagesFor(route: string, slot: SlotId): PlacedImage[] {
  const placed = visible
    .flatMap((e) =>
      e.placements
        .filter((p) => p.route === route && p.slot === slot)
        .map((p) => place(e, p.order)),
    )
    .sort((a, b) => a.order - b.order);
  // Draft mode previews a candidate IN PLACE of the approved image at the same order; production
  // never sees a candidate, so this branch is dead there.
  if (imagesDraftMode && placed.some((x) => x.status === "candidate")) {
    const taken = new Set(
      placed.filter((x) => x.status === "candidate").map((x) => x.order),
    );
    return placed.filter(
      (x) => x.status === "candidate" || !taken.has(x.order),
    );
  }
  return placed;
}

/**
 * The first of `order` (the slots in the page's DOM order) that has a visible image. That slot's
 * figure is the page's single `priority` (LCP) image, so a page whose `main` was rejected still
 * ends up with exactly one eager image — on its next slot — and never with none.
 */
export function leadSlotOf(
  route: string,
  order: readonly SlotId[],
): SlotId | undefined {
  return order.find((slot) => imagesFor(route, slot).length > 0);
}

/** The first visible image at (route, slot), or undefined — the common single-figure case. */
export function imageFor(route: string, slot: SlotId): PlacedImage | undefined {
  return imagesFor(route, slot)[0];
}

/** The tiles of a page's strip or pair, in slot order (strip-1..3, then pair-1..2). */
export function stripFor(route: string): PlacedImage[] {
  const slots: SlotId[] = ["strip-1", "strip-2", "strip-3", "pair-1", "pair-2"];
  return slots.flatMap((slot) => imagesFor(route, slot));
}

/** Whether the footer note renders: its wording is approved and an image it describes is live. */
export function imagesNoteLive(): boolean {
  return noticeIsLive(imagesNote, imageManifest.images);
}
