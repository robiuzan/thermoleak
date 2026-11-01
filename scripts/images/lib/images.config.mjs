/**
 * images.config.mjs — every thermoleak.co.il constant the image kit needs, in one file.
 *
 * The rest of scripts/images/ and lib/images.ts carry no site literal: this file is what changes
 * from one fleet site to the next, which is what lets the Media Studio site template absorb this
 * kit later. Decisions behind these values: CLAUDE.md §15 and docs/business-facts.md §A.
 *
 * THIS REPO IS PUBLIC. The technicians' surnames live only in Media Studio's site.json, whose
 * alt/caption step refuses them. Nothing here may name one.
 */

export const SITE = "thermoleak.co.il";

/** Where the gate and the status report read the route lists from, with lib/ts-scan.mjs. */
export const LISTS = Object.freeze({
  services: {
    file: "lib/services.ts",
    const: "services",
    nameKey: "title",
    route: "/services/{slug}/",
    expect: 4,
  },
  locations: {
    file: "lib/locations.ts",
    const: "locations",
    nameKey: "name",
    route: "/locations/{slug}/",
    expect: 12,
  },
  articles: {
    file: "lib/articles.ts",
    const: "articles",
    nameKey: "title",
    route: "/guides/{slug}/",
    expect: 3,
  },
  staticRoutes: { file: "lib/site.ts", const: "staticRoutes" },
});

/** `public/images/<group>/<file>` — the plan's `group`. City slots use `cities`, the hub `areas`. */
export const FILE_GROUPS = Object.freeze([
  "home",
  "services",
  "guides",
  "areas",
  "cities",
  "about",
  "contact",
  "pricing",
  "gallery",
]);

/**
 * Size classes (contract §2): the long edge the finish step resizes to, and the byte budget.
 * `gates.maxImageBytes` caps every class from above as well. betonplus's numbers: the user asked
 * for trust over resolution, and the export budget (docs/performance-guidelines.md §1) is the
 * constraint that bites here.
 */
export const SIZE_CLASSES = Object.freeze({
  large: { longEdge: 1400, maxBytes: 204800 },
  half: { longEdge: 1200, maxBytes: 174080 },
  tile: { longEdge: 960, maxBytes: 122880 },
  thumb: { longEdge: 480, maxBytes: 46080 },
});

/** The routes that never carry a content image (owner decision 2026-11-01, scope). */
export const EXCLUDED_ROUTES = Object.freeze([
  "/privacy/",
  "/accessibility/",
  "/404/",
  "/thank-you/",
]);

/** Emitted by the export but never a page of the site; the gate skips it as content. */
export const ARTIFACT_ROUTES = Object.freeze(["/_not-found/"]);

/**
 * Files under /images/ that are not content images and so have no manifest entry: the logo the
 * navbar and footer render, and the four decorative service illustrations (alt="" on purpose, see
 * app/services/[slug]/page.tsx). A trailing slash is a folder.
 */
export const NON_CONTENT_IMAGES = Object.freeze([
  "/images/thermoleak_logo.webp",
  "/images/services/",
]);

/** The two technicians (manifest `people` ids). The ids never appear in a file name. */
export const PEOPLE_IDS = Object.freeze(["omer", "yoav"]);

/** May appear ONLY in a caption whose every placement is /about/ — never in an alt. */
export const FIRST_NAMES_HE = Object.freeze(["עומר", "יואב"]);

/**
 * Never in image text at all. The founder is named across the site but is never depicted, so his
 * name beside a technician's face would be a false identification.
 */
export const BANNED_NAMES_HE = Object.freeze(["רונן דהן", "רונן", "דהן"]);

/**
 * The people ids, under the name Media Studio's `doctor` reads: it compares this file with
 * sites/thermoleak/site.json, so the alt writer and this repo's gate refuse the same words.
 */
export const peopleIds = PEOPLE_IDS;

/**
 * Words an alt or a caption may never carry, on top of the generic list in manifest-rules.mjs:
 * findings and results (a diagnosis trade's sharpest claims), the guarantee, the insurance and
 * credential claims, availability. Substrings. VERBATIM in site.json `claims.extraBanned`.
 */
export const extraBanned = Object.freeze([
  "תמונה של",
  "לפני ואחרי",
  "מ״ר",
  'מ"ר',
  "הדמיה",
  "בינה מלאכותית",
  "לא מצאנו",
  "לא שילמתם",
  "מבוטח",
  "צד ג",
  "מוסמך",
  "מורשה",
  "הסמכה",
  "100%",
  "חשבון המים",
  "חיסכון",
  "ממצא",
  "תוצאה",
  "הוכחה",
  "מדויק",
  "באותו יום",
  "תוך שעה",
  "מיידי",
  "24/7",
]);

/**
 * The same, as patterns, because a fixed string cannot catch them without catching ordinary words:
 * a temperature or a percentage (a screen is an illustration, never a reading), a camera make or
 * model, a finding, an insurer's outcome, a size with a unit, a count of jobs, and the named places
 * in lib/locations.ts that are not city names. VERBATIM in site.json `claims.extraBannedRegex`.
 */
export const extraBannedRegex = Object.freeze([
  "\\d\\s*(?:°|מעלות|צלזיוס|אחוז|%)",
  "(?<![A-Za-z0-9])(?:FLIR|Flir|flir|E8|E5|Fluke|Testo|Hikmicro)(?![A-Za-z0-9])|פליר",
  "(?<![א-ת])(?:נמצא|אותר|זוה)[הו]?\\s+(?:ה)?(?:נזיל|מקור|רטיב)|המקור\\s+נמצא|אין\\s+(?:נזילה|רטיבות)",
  "(?<![א-ת])(?:אושר|אושרה|מאושר|פיצוי)(?![א-ת])",
  '\\d\\s*(?:ס[״"׳\']?מ|מטר|מ׳|מ"מ|ליטר)(?![א-ת])',
  "\\d[\\d,]*\\s*(?:בדיקות|נזילות|פרויקט)",
  "(?<![א-ת])[ובלמהשכ]{0,2}(?:נווה צדק|פלורנטין|יפו|ג׳סי כהן|רמת יוסף|רמת עמידר|רמת הנשיא|שיכון עמידר|בורוכוב|קוזלובסקי|הרצליה פיתוח|נוף ים|נווה עמל|אם המושבות|נווה גן|כפר גנים|רמת ורבר|רמת אליהו|נרקיסים|קריית שרת|נווה זמר|יוספטל|סביוני הכפר|פסגות אפק|מכבים|רעות|מורשת|משואה|כרם התימנים|עג׳מי|ג׳בליה|שפירא|כפר שלם|יד אליהו|קריית שלום)(?![א-ת])",
]);

/** The hero is the LCP image: a tighter cap than its size class (docs/performance-guidelines.md §1). */
export const LCP_SLOTS = Object.freeze([
  { route: "/", slot: "main", maxBytes: 153600 },
]);

/** The page the footer note links to and the disclosure markers hang on. */
export const GALLERY_ROUTE = "/gallery/";
export const ABOUT_ROUTE = "/about/";
export const ABOUT_TEAM_SLOT = "team";
