// Central business configuration & site-wide content.
// ⚠️ PLACEHOLDER DATA — phone, whatsapp, email, prices, stats and addresses are invented
// (see docs/thermoleak-brief.md). Replace with the real business details before launch.

export interface NavLink {
  href: string;
  label: string;
}

export interface BusinessHours {
  days: string;
  time: string;
}

export const site = {
  name: "ThermoLeak",
  nameHe: "תרמולק",
  legalName: "תרמולק בע״מ",
  domain: "https://thermoleak.co.il",
  locale: "he_IL",

  tagline: "מאתרים את הנזילה. בלי לשבור קירות.",
  pitch:
    "איתור נזילות מים ורטיבות בעזרת מצלמה תרמית — אבחון מדויק, ללא הרס מיותר, עם דו״ח מסודר שמתקבל בחברות הביטוח.",
  description:
    "תרמולק מתמחים באיתור נזילות תרמי בגוש דן והמרכז. מאתרים את מקור הנזילה במצלמה תרמית, ללא שבירת קירות, עם אחריות מלאה ודו״ח מקצועי לחברות הביטוח. זמינות מהירה ושירות אמין.",

  phone: { display: "050-000-0000", tel: "+972500000000" },
  whatsapp: { intl: "972500000000", display: "050-000-0000" },
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
  geo: { lat: 32.0853, lng: 34.7818 },

  priceFrom: 450,
  currency: "₪",
  guarantee: "לא מצאנו — לא שילמתם",

  stats: {
    years: { value: "10+", label: "שנות ניסיון בשטח" },
    jobs: { value: "3,000+", label: "בתים ועסקים" },
    firstVisit: { value: "97%", label: "איתור כבר בביקור הראשון" },
    rating: { value: "4.9", label: "דירוג לקוחות ממוצע" },
  },

  certifications: [
    "טכנאי תרמוגרפיה מוסמך (Thermography Level 1)",
    "עבודה עם מצלמות תרמיות מקצועיות מסוג FLIR",
    "אחריות מלאה ושקיפות מחירים",
  ],

  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
  },
};

export const navLinks: NavLink[] = [
  { href: "/", label: "בית" },
  { href: "/services", label: "שירותים" },
  { href: "/about", label: "אודות" },
  { href: "/reviews", label: "המלצות" },
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
