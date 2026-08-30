// Central business configuration & site-wide content.
// Phone, WhatsApp and email are REAL (confirmed fleet values — see the roster manifest and
// docs/business-facts.md). Still unverified: prices (₪450), the certifications, the guarantee's
// exact scope, and the trust figures beyond the 2015 founding year. Never present an unconfirmed
// value as fact — mark it `// 🔶 confirm` and add a row to docs/business-facts.md.

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

export const site = {
  name: "ThermoLeak",
  nameHe: "טרמוליק",
  legalName: "טרמוליק בע״מ",
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
  serviceAreaText: "גוש דן והמרכז, ברדיוס של עד 60 ק״מ · שירות ארצי בתיאום מראש",
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
  // and article bylines. Role detail, years in trade, certification number, insurance and ח.פ.
  // remain UNCONFIRMED — do not infer them from the name.
  founder: "רונן דהן",

  priceFrom: 450, // 🔶 confirm — unverified starting price (docs/business-facts.md §C)
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
    years: { value: "10+", label: "שנות ניסיון בשטח" },
    duration: { value: "כשעה", label: "משך בדיקה ברוב הדירות" },
    method: { value: "ללא הרס", label: "איתור במצלמה תרמית, בלי לשבור" },
    report: { value: "דו״ח", label: "מסודר ומקובל בחברות הביטוח" },
  } satisfies Record<string, TrustStat>,

  certifications: [
    // 🔶 confirm — no issuing body or certificate number on file (docs/business-facts.md §B)
    "טכנאי תרמוגרפיה מוסמך (Thermography Level 1)",
    "עבודה עם מצלמות תרמיות מקצועיות מסוג FLIR",
    "אחריות מלאה ושקיפות מחירים",
  ],

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
