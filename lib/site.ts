// Central business configuration & site-wide content.
// Phone, WhatsApp and email are REAL (confirmed fleet values — see the roster manifest and
// docs/business-facts.md).
//
// A large batch of facts was CONFIRMED BY THE OWNER on 2026-09-17 (docs/business-facts.md records
// each with that date): the ₪350 starting price, the FLIR E8 camera, a two-person team, ~20 years
// in the trade, third-party insurance, national service by prior arrangement, and that tax
// invoices are issued.
//
// That same batch REMOVED three claims, and the removals matter more than the additions:
//   • There is NO company registration — the business is not a בע״מ and has no ח.פ.
//   • There is NO thermography certificate. "Thermography Level 1" was an unbacked claim.
//   • There is NO accessibility coordinator. /accessibility/ no longer asserts one.
// Do not reintroduce any of the three. A removed false claim is not a gap to be refilled.
//
// STILL unverified: accepted payment METHODS, and the insurer's name and coverage amount. What the
// ₪350 visit includes/excludes and the 3-day report turnaround were CONFIRMED 2026-09-17 and are
// published (visitScope on /pricing/, the turnaround in the homepage FAQ) — do not re-gate them.
// Never present an unconfirmed value as fact — mark it `// 🔶 confirm` and add a row to
// docs/business-facts.md.

export interface NavLink {
  href: string;
  label: string;
}

export interface BusinessHours {
  days: string;
  time: string;
}

export interface TrustStat {
  value: string;
  label: string;
}

export interface StaticRoute {
  path: string;
  lastModified: string;
  priority: number;
  freq: "weekly" | "monthly" | "yearly";
}

export const site = {
  name: "ThermoLeak",
  nameHe: "טרמוליק",
  // NOT "טרמוליק בע״מ". The owner confirmed 2026-09-17 there is no company registration and no
  // ח.פ., so "בע״מ" was a false legal claim. It must not come back without a registration number.
  legalName: "טרמוליק",
  domain: "https://thermoleak.co.il",
  locale: "he_IL",

  tagline: "מאתרים את הנזילה. בלי לשבור קירות.",
  pitch:
    "איתור נזילות מים ורטיבות בעזרת מצלמה תרמית — אבחון מדויק, ללא הרס מיותר, עם דו״ח מסודר שמתקבל בחברות הביטוח.",
  description:
    "טרמוליק מתמחים באיתור נזילות תרמי בגוש דן והמרכז. מאתרים את מקור הנזילה במצלמה תרמית, ללא שבירת קירות, עם אחריות מלאה ודו״ח מקצועי לחברות הביטוח. זמינות מהירה ושירות אמין.",

  phone: { display: "055-660-1006", tel: "+972556601006" },
  whatsapp: { intl: "972556601006", display: "055-660-1006" },
  email: "info@thermoleak.co.il",

  address: {
    region: "גוש דן והמרכז",
    country: "IL",
    note: "שירות עד בית הלקוח — אין צורך להגיע למשרד",
  },
  // The national clause is CONFIRMED (owner, 2026-09-17) — he travels up to about two hours from
  // Tel Aviv, which covers most of the country. The old "עד 60 ק״מ" understated the real reach and
  // was never confirmed, so it is gone. גוש דן stays named first because it is the core area; since
  // 2026-10-28 all 12 service areas have a location page, inside גוש דן and beyond it.
  serviceAreaText: "גוש דן והמרכז · שירות ארצי בתיאום מראש",
  serviceAreas: [
    "תל אביב-יפו",
    "רמת גן",
    "גבעתיים",
    "הרצליה",
    "פתח תקווה",
    "ראשון לציון",
    "חולון",
    "בת ים",
    "רעננה",
    "כפר סבא",
    "ראש העין",
    "מודיעין",
  ],

  hours: [
    { days: "ראשון–חמישי", time: "08:00–18:00" },
    { days: "שישי", time: "08:00–13:00" },
  ] as BusinessHours[],
  emergencyNote: "שירות חירום לנזילות פעילות — זמינים גם מעבר לשעות הפעילות",

  founded: 2015,
  // Owner/founder. Confirmed 2026-08-24 (docs/business-facts.md §A). This unlocks Person schema
  // and article bylines. There is no certification number and no ח.פ. — see the header.
  founder: "רונן דהן",
  // Owner confirmed 2026-09-17: ten years in the trade BEFORE founding in 2015, so field
  // experience runs from ~2005. Keep the two numbers distinct — the BUSINESS is 11 years old, the
  // FOUNDER has ~20 years of experience. Conflating them would overstate the company.
  founderInTradeSince: 2005,
  teamSize: 2,
  // Third-party cover confirmed 2026-09-17. Insurer and coverage amount were not supplied, so no
  // figure may be stated — the fact of cover is all that ships.
  insurance: "ביטוח צד ג׳",
  // Tax invoices confirmed 2026-09-17. Accepted payment METHODS were not specified — do not list
  // credit cards, Bit, bank transfer or anything else until the owner names them.
  issuesTaxInvoice: true,

  // ₪350 CONFIRMED by the owner 2026-09-17 (was an unverified ₪450).
  priceFrom: 350,
  // What the ₪350 visit covers. APPROVED VERBATIM by the owner 2026-09-17 — it was drafted from
  // claims already published (guaranteeTerms.excluded, and the "מתומחרים בנפרד" line on the
  // reports and panel services) and then confirmed, rather than invented. Treat it exactly like
  // guaranteeTerms: these are terms, not marketing copy. Do not soften, extend or reorder them.
  visitScope: {
    includes: [
      "הגעה לנכס",
      "סריקה תרמית של המוקדים החשודים",
      "אימות הממצא במדידה משלימה",
      "מסירת הממצאים בעל פה במקום",
    ],
    excludes: [
      "תיקון, פתיחת קירות או ריצוף, ועבודות איטום",
      "דו״ח כתוב לחברת ביטוח",
      "בדיקת לוח חשמל",
    ],
  },
  // CONFIRMED 2026-09-17: three business days. The site previously said only "מספר ימי עסקים",
  // which was deliberately vague because no number was on file. Now that one is, state it.
  reportTurnaroundDays: 3,
  currency: "₪",
  guarantee: "לא מצאנו — לא שילמתם",
  // Scope CONFIRMED 2026-08-24 (docs/business-facts.md §C). A precisely bounded promise converts
  // better than a vague one — it removes the suspicion of a catch — and the boundary is what
  // prevents disputes. Do not soften these into marketing copy; they are the terms.
  guaranteeTerms: {
    whatCounts:
      "איתור נחשב זיהוי וסימון של מקור הרטיבות או הנזילה, מאומת במדידה משלימה ולא בממצא תרמי בלבד. איתור הוא קביעת המקור — לא ביצוע התיקון.",
    ifNotFound: "אם לא אותר מקור — לא תחויבו על הביקור. אין דמי ביקור.",
    excluded:
      "לא נכללים: תיקון, פתיחת קירות או ריצוף, ועבודות איטום. אלה מבוצעים על ידי בעל מקצוע ומתומחרים בנפרד.",
    exceptions:
      "האחריות אינה חלה כאשר לא ניתנה גישה לאזור הנדרש, כאשר התבקשנו שלא להפעיל מערכת שנדרשה לבדיקה, או כאשר הנזילה אינה פעילה במועד הבדיקה ולא ניתן היה לתאם מועד חלופי.",
  },

  // Trust figures shown in TrustBar and the hero. Only values that are verified (founded 2015 →
  // the roster) or that restate claims already made elsewhere on the site. The previous
  // "3,000+ jobs / 97% first-visit / 4.9 rating" figures were unverifiable and were removed
  // 2026-08-17 — do not reintroduce a number without a source (docs/business-facts.md §D).
  stats: {
    // "20+" is the FOUNDER's field experience (in the trade since ~2005, confirmed 2026-09-17),
    // not the company's age — which is why the label says "בשטח". The business itself was founded
    // in 2015; never write "20 years in business".
    years: { value: "20+", label: "שנות ניסיון בשטח" },
    duration: { value: "כשעה", label: "משך בדיקה ברוב הדירות" },
    method: { value: "ללא הרס", label: "איתור במצלמה תרמית, בלי לשבור" },
    report: { value: "דו״ח", label: "מסודר ומקובל בחברות הביטוח" },
  } satisfies Record<string, TrustStat>,

  // Renamed from `certifications` on 2026-09-17, because none of these is a certification.
  // The owner confirmed there is NO thermography certificate, so "Thermography Level 1" was
  // removed outright. "אחריות מלאה ושקיפות מחירים" was removed too — a guarantee rendered with a
  // BadgeCheck alongside real credentials borrows their authority (finding EEAT-6); the guarantee
  // has its own bounded terms on /pricing/ and does not need a badge.
  //
  // Everything in this array must be a concrete, owner-confirmed capability. Never a credential
  // without a number behind it.
  credentials: ["מצלמה תרמית FLIR E8", "ביטוח צד ג׳", "צוות של שני טכנאים"],

  // Shared Israeli-fleet GTM container (10 of 12 fleet sites carry it). Verified HTTP 200 on
  // 2026-08-24 — a snippet in the HTML proves nothing, so re-assert with:
  //   curl -o /dev/null -w '%{http_code}' "https://www.googletagmanager.com/gtm.js?id=GTM-KWGGH438"
  // ⚠️ GA4 for this domain is resolved INSIDE the container by a hostname RegEx table. The snippet
  // alone does not route thermoleak.co.il to a GA4 property — that needs a container-side entry.
  analytics: { gtmId: "GTM-KWGGH438" },

  // Social profiles were removed 2026-08-17: the previous values were the platforms' homepages
  // (facebook.com / instagram.com), which asserted entity links that don't exist — in the footer
  // AND in JSON-LD sameAs. Restore only with real profile URLs (docs/business-facts.md §B).
};

export const navLinks: NavLink[] = [
  { href: "/", label: "בית" },
  { href: "/services", label: "שירותים" },
  { href: "/pricing", label: "מחירון" },
  { href: "/locations", label: "אזורי שירות" },
  { href: "/guides", label: "מדריכים" },
  { href: "/about", label: "אודות" },
  { href: "/contact", label: "צור קשר" },
];

// The footer's ניווט column only. The header row is full: a sixth link beside the call button wraps
// at 768–970 px (backlog §8.7). The footer note links /gallery/ from every page as well.
export const secondaryLinks: NavLink[] = [{ href: "/gallery", label: "גלריה" }];

// Every route that is not generated from a data file — one registry for app/sitemap.ts,
// lib/images.ts and scripts/images/. Per-route content dates: update a route's date when its CONTENT
// meaningfully changes — the previous `new Date()` stamped build time on every URL, telling search
// engines the whole site changed on every deploy, which made the signal worthless (backlog §1.3).
// Google only uses lastmod on a site where it stays accurate, so a content commit bumps its route's
// date in the SAME commit; markup, OG tags and the live-kit strip do not count
// (content/live/_updates.mjs). A new captioned figure counts; re-issuing an existing image with the
// logo does not (CLAUDE.md §15). Re-baselined 2026-10-19 against git and the fleet deploy log: 17 of
// 19 dates had drifted. Services, guides and cities carry their own date in lib/ and are read in
// app/sitemap.ts. /thank-you/ is deliberately absent: it is noindex (see app/thank-you/page.tsx).
export const staticRoutes: StaticRoute[] = [
  // 2026-10-28: a tenth visible FAQ shipped on the homepage (the guarantee question), which is
  // new body copy and a tenth Question node — this comment's own rule says that bumps the date in
  // the same commit. The service pages are deliberately NOT bumped: their visible copy is unchanged,
  // they only gained an internal link and a schema node. The location pages carry their own dates
  // in lib/locations.ts (2026-10-28: nine cities added and the first three's copy corrected).
  { path: "", lastModified: "2026-11-02", priority: 1, freq: "weekly" }, // page images installed 2026-11-02
  {
    path: "/services",
    lastModified: "2026-11-02", // page images installed 2026-11-02
    priority: 0.9,
    freq: "monthly",
  },
  {
    path: "/pricing",
    lastModified: "2026-11-02", // page images installed 2026-11-02
    priority: 0.9,
    freq: "monthly",
  },
  {
    path: "/guides",
    lastModified: "2026-08-30",
    priority: 0.8,
    freq: "weekly",
  },
  // The hub lists every city page: nine more cards on 2026-10-28.
  {
    path: "/locations",
    lastModified: "2026-10-28",
    priority: 0.8,
    freq: "monthly",
  },
  {
    path: "/about",
    lastModified: "2026-11-02", // page images installed 2026-11-02
    priority: 0.7,
    freq: "monthly",
  },
  {
    path: "/contact",
    lastModified: "2026-11-02", // page images installed 2026-11-02
    priority: 0.8,
    freq: "monthly",
  },
  {
    path: "/gallery",
    lastModified: "2026-11-02", // page images installed 2026-11-02
    priority: 0.5,
    freq: "monthly",
  },
  {
    path: "/accessibility",
    lastModified: "2026-09-17",
    priority: 0.3,
    freq: "yearly",
  },
  {
    path: "/privacy",
    lastModified: "2026-09-17",
    priority: 0.3,
    freq: "yearly",
  },
];

// --- contact helpers ---------------------------------------------------------

export const telHref = `tel:${site.phone.tel}`;
export const mailHref = `mailto:${site.email}`;

export function whatsappHref(message?: string): string {
  const base = `https://wa.me/${site.whatsapp.intl}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const defaultWhatsappMessage =
  "היי, הגעתי דרך האתר ואשמח לתאם בדיקת איתור נזילות / רטיבות. מתי אפשר?";

// Normalize a path to a single trailing slash, to match next.config `trailingSlash: true`.
// Root ("" or "/") stays "/". Used for canonicals, sitemap and JSON-LD so URLs match the served pages.
export function withTrailingSlash(path: string): string {
  if (path === "" || path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
}

// Absolute canonical URL for a given path (e.g. "/services" -> "https://thermoleak.co.il/services/").
export function canonicalUrl(path: string): string {
  return `${site.domain}${withTrailingSlash(path)}`;
}

/**
 * Per-page Open Graph + Twitter metadata.
 *
 * WHY THIS EXISTS: Next merges `metadata` shallowly at the TOP-LEVEL KEY. A page that declares its
 * own `openGraph` object **replaces** the layout's rather than merging into it — so every page that
 * set an og:title silently lost the layout's `images`, and every page that set none inherited the
 * layout's absolute `url` and claimed to be the homepage. Both halves shipped for three sprints
 * (finding SEO-01): ten routes — all four services, all three guides, all three cities — had NO
 * og:image at all, so sharing any of them to WhatsApp produced a bare text row.
 *
 * Spread the result into BOTH `openGraph` and `twitter` so the two graphs cannot disagree. Passing
 * `path` is what keeps og:url equal to the page's own canonical.
 */
export function pageOpenGraph({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}) {
  const url = canonicalUrl(path);
  const images = [
    {
      url: "/og.png",
      width: 1200,
      height: 630,
      alt: `${site.nameHe} — ${title}`,
    },
  ];
  return {
    openGraph: {
      type: "website" as const,
      locale: site.locale,
      siteName: site.nameHe,
      url,
      title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: ["/og.png"],
    },
  };
}
