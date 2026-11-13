// Service pillars data. Rendered across the homepage, /services and /services/[slug].
import type { LucideIcon } from "lucide-react";
import { Droplets, ThermometerSun, Zap, FileCheck2 } from "lucide-react";
// `site` is read here for facts that feed FAQPage JSON-LD through the answer blocks — the price
// (site.priceFrom), the visit's terms (site.visitScope), the report turnaround
// (site.reportTurnaroundDays), the brand (site.nameHe) and the region (site.address.regionPrefixed) —
// and for the phone in metaDescription (golden rule 2: no NAP literal outside lib/site.ts). A retyped
// copy of any of them becomes a mismatch between the visible page and its structured data the first
// time the fact changes (TS-1). CLAUDE.md §5 records this edge; everything else here stays literal.
import { site, type LinkLead, type NavLink } from "./site";

export interface ServiceStep {
  title: string;
  desc: string;
}

export interface ServiceFaq {
  q: string;
  a: string;
}

// The honest-limits block: what the method cannot do, and how we compensate.
// This is deliberate positioning (docs/content-standards.md §7) — do not soften it away.
export interface ServiceLimits {
  title: string;
  intro?: string;
  items: string[];
  outro?: string;
}

// A short in-copy cross-link block with descriptive Hebrew anchors (docs/optimization-backlog.md §9.3).
export type ServiceRelated = LinkLead;

// "What to check before you book" — the framework's buyer's guide. Advice for the buyer, specific to
// this service; never a credential the business lacks (no certificate, no ח.פ. — business-facts §A/§B).
// The four titles differ on purpose: one shared heading would fail the doorway test.
export interface ServiceChecklist {
  title: string;
  items: string[];
}

// Links into the location silo (LOC-2), resolved and checked in lib/links.ts. NEVER a `slug:` key in
// this file: live.config.mjs reads every `slug: "…",` line here as a page boundary.
export type ServiceCityLinks =
  | { mode: "all"; title: string; lead: string } // all twelve, anchor = the city page's own title
  | {
      mode: "places";
      lead: string;
      places: { place: string; city: string }[]; // a place inside the city, e.g. «אזור התעשייה»
    };

export interface Service {
  slug: string;
  // ISO date of the last MEANINGFUL change to what this page shows (a price, a fact, a section) —
  // not to its markup, OG tags or alt text. app/sitemap.ts emits it as <lastmod>, and Google only
  // trusts lastmod on a site where it stays accurate, so bump it in the same commit as the change.
  lastModified: string;
  icon: LucideIcon;
  image: string; // hero image for the service detail page (in /public)
  title: string; // short title (nav / cards)
  h1: string; // page heading
  tagline: string; // one-line value statement
  summary: string; // card description and Service.description in JSON-LD
  metaDescription: string; // SERP snippet, 150–160 chars, ends in the phone (SEO-03; checked below)
  // The AEO answer block — the framework's "GEO snippet": ≈35–60 Hebrew words, complete in the first
  // sentence, naming the brand, the service and the region, then what it includes, the price or cost
  // model and the timeframe where one is confirmed. It joins FAQPage, so every fact is interpolated.
  answer: ServiceFaq;
  intro: string[]; // page intro paragraphs
  forWho: string;
  benefits: string[];
  steps: ServiceStep[];
  limits: ServiceLimits;
  checklist: ServiceChecklist;
  related: ServiceRelated;
  // "from" ⇒ priceModel states ₪{site.priceFrom} and the Service node carries an Offer; "quote" ⇒
  // priced per job, no ₪ figure anywhere (checked below).
  pricing: "from" | "quote";
  priceModel: string;
  priceLink: NavLink; // the in-copy link from the price sidebar to /pricing/
  featuredGuides: string[]; // 0–3 guide slugs, in order (resolved in lib/links.ts)
  guides?: { title: string; lead: string }; // required exactly when featuredGuides is non-empty
  cityLinks?: ServiceCityLinks;
  faqs: ServiceFaq[];
  keywords: string[];
}

// Homepage definition block (AEO): what the method is, and what it honestly is not.
export const methodExplainer = {
  eyebrow: "השיטה",
  title: "מה זה איתור נזילות תרמי?",
  paragraphs: [
    "איתור נזילות תרמי הוא שיטת אבחון לא פולשנית: מצלמה תרמית מצלמת את טמפרטורת פני השטח של קירות, רצפות ותקרות, ומציגה דפוסי חום וקור שהעין אינה רואה. רטיבות משנה את טמפרטורת המשטח — ולכן נזילה נסתרת משאירה חתימה תרמית אופיינית, שמובילה אותנו אל המקור בלי לשבור ולחפש באופן עיוור.",
    "חשוב להבין: המצלמה לא ״רואה מים״ — היא רואה טמפרטורה. לכן ממצא תרמי הוא תחילתו של אבחון, לא סופו. כל מוקד חשוד מאומת אצלנו במכשירי מדידה משלימים לפני שנקבע מקור הנזילה — כך נמנעים גם מהריסה מיותרת וגם מאבחון שגוי.",
  ],
  // A permanent in-body link from the homepage into /guides/ — the updates strip, which used to be the
  // only one, hides itself 45 days after its newest item. Never quoted by a live register.
  more: {
    lead: "פירטנו את ההבדל בין ממצא תרמי לאבחון, ואת המקרים שבהם המצלמה לא מספיקה, במדור",
    links: [{ label: "המדריכים לאיתור נזילות ורטיבות", href: "/guides/" }],
    tail: ".",
  } satisfies LinkLead,
};

// Homepage decision aid — symptom-first, because that is how the visitor arrives. Each entry maps
// a real symptom to the service that addresses it, including the honest "this might not be us" case.
export const serviceChooser = {
  eyebrow: "לא בטוחים מה צריך?",
  title: "מהסימפטום לשירות המתאים",
  intro:
    "רוב הפניות אלינו מתחילות בסימפטום, לא בשם של שירות. כך זה מתורגם — ואם מה שאתם מתארים לא מופיע כאן, פשוט תתקשרו ונכוון אתכם.",
  cases: [
    {
      symptom: "כתם רטיבות שחוזר גם אחרי צביעה",
      explanation:
        "צביעה חוזרת מטפלת בסימפטום. כל עוד מקור הלחות פעיל הכתם יחזור — צריך קודם לקבוע אם מדובר בנזילה מצנרת, בחדירת מים מבחוץ או בעיבוי.",
      serviceLabel: "איתור רטיבות ובידוד",
      href: "/services/moisture-detection/",
    },
    {
      symptom: "חשבון מים שקפץ בלי סיבה",
      explanation:
        "קפיצה בצריכה בלי שינוי בהרגלים מצביעה כמעט תמיד על נזילה נסתרת בצנרת — לרוב מתחת לריצוף או בתוך קיר, במקום שלא רואים.",
      serviceLabel: "איתור נזילות מים",
      href: "/services/water-leak-detection/",
    },
    {
      symptom: "חברת הביטוח מבקשת הוכחה למקור הנזק",
      explanation:
        "תביעה על נזקי מים דורשת תיעוד אובייקטיבי של המקור ושל היקף הנזק. חשוב לתעד לפני שמתקנים — תיקון מוקדם מוחק את הראיות.",
      serviceLabel: "דו״ח תרמוגרפי לביטוח",
      href: "/services/insurance-reports/",
    },
    {
      symptom: "ריח שרוף או מפסק שקופץ בלוח החשמל",
      explanation:
        "חיבור רופף או עומס יתר מתחממים הרבה לפני שנגרמת תקלה. סריקה תרמית של הלוח תחת עומס מזהה את נקודות החום בזמן.",
      serviceLabel: "בדיקת לוחות חשמל",
      href: "/services/electrical-thermography/",
    },
    {
      symptom: "לפני קנייה או שיפוץ של דירה",
      explanation:
        "סריקה לפני רכישה מגלה רטיבות נסתרת, כשלי בידוד וסימנים לנזילות ישנות — מידע שמשפיע על ההחלטה ועל המשא ומתן, בלי לפגוע בנכס.",
      serviceLabel: "איתור רטיבות ובידוד",
      href: "/services/moisture-detection/",
    },
    {
      symptom: "לא בטוחים שזו בכלל נזילה",
      explanation:
        "לפעמים זה עיבוי, ולפעמים אין בעיה בכלל. עדיף לברר בטלפון לפני שמזמינים בדיקה — אם מה שאתם מתארים לא דורש סריקה, נגיד לכם את זה.",
      serviceLabel: "דברו איתנו",
      href: "/contact/",
    },
  ],
  outro:
    "בכל המקרים הבדיקה עצמה זהה בעקרונות שלה: סריקה תרמית לצמצום אזור החשד, ואז אימות נקודתי לפני שנקבע מקור. מה שמשתנה הוא מה מחפשים ואיפה.",
};

// The hero's quick selector (the framework's "service selector"): four problems → four service pages.
// The key is `service:`, NEVER `slug:` — live.config.mjs reads every `slug: "…",` line in this file as
// a page boundary, and four of them here would move every later homepage string under another page.
// The membership check sits after `serviceSlugs` below (reading it here would hit its TDZ).
export const heroPicker = {
  label: "מה הבעיה?",
  items: [
    { label: "נזילה בקיר או בריצוף", service: "water-leak-detection" },
    { label: "רטיבות או עובש", service: "moisture-detection" },
    { label: "חשש לעומס בלוח החשמל", service: "electrical-thermography" },
    { label: "תביעת ביטוח על נזקי מים", service: "insurance-reports" },
  ],
};

// The homepage services section. Its heading copy used to be typed into ServicePillars.tsx. `areas`
// is the homepage's permanent in-body link into /locations/. Never quoted by a live register.
export const servicePillars = {
  eyebrow: "השירותים שלנו",
  title: "פתרונות איתור תרמי לבית ולעסק",
  subtitle:
    "מנזילה נסתרת בצנרת ועד דו״ח לחברת הביטוח — הכול בעזרת מצלמה תרמית, ללא הרס מיותר.",
  areas: {
    lead: "אנחנו עובדים בגוש דן והמרכז, ומחוץ לאזור הזה נותנים שירות ארצי בתיאום מראש. ל-12 ערים באזור השירות יש עמודים משלהן, שמסבירים איך אופי הבנייה בכל עיר משפיע על החיפוש אחר נזילה:",
    links: [{ label: "איתור נזילות לפי אזור", href: "/locations/" }],
  } satisfies LinkLead,
};

// The four-step process on / and /services/ (components/Process.tsx maps the icons by index). Step 4
// says what a visit actually gives: the findings verbally, on site; a written report for the insurer
// is ordered separately (site.visitScope; business-facts §H, 2026-11-13). Never quoted by a register.
export const processSteps = {
  eyebrow: "איך זה עובד",
  title: "ארבעה צעדים פשוטים עד לאיתור המקור",
  subtitle: "תהליך מסודר ושקוף — מהשיחה הראשונה ועד מסירת הממצאים.",
  steps: [
    {
      title: "שיחה ותיאום",
      desc: "מתקשרים או שולחים וואטסאפ, מתארים את הבעיה, ואנחנו מתאמים הגעה בזמן שנוח לכם.",
    },
    {
      title: "בדיקה תרמוגרפית בשטח",
      desc: "סורקים את האזורים החשודים במצלמה תרמית מקצועית ובאמצעי איתור משלימים.",
    },
    {
      title: "איתור מדויק של המקור",
      desc: "מזהים ומסמנים את נקודת הבעיה המדויקת — לא ניחוש, אלא ממצא ברור.",
    },
    {
      title: "ממצאים, ואם צריך — דו״ח",
      desc: "את הממצאים מקבלים בעל פה כבר במקום. דו״ח כתוב לחברת ביטוח אינו כלול בביקור האיתור ומתומחר בנפרד, ואפשר להפיק אותו מאותה בדיקה.",
    },
  ] satisfies ServiceStep[],
};

// The cost-model sentences of the two per-job services, shared by the answer block (FAQPage) and the
// price sidebar, so the two can never say different things.
const panelPriceModel =
  "מחיר בדיקת לוחות חשמל נקבע לפי כמות הלוחות והיקף המתקן.";
const reportPriceModel = "מחיר הדו״ח נקבע לפי היקף הבדיקה והתיעוד הנדרש.";

const { includes, excludes } = site.visitScope;
const region = site.address.regionPrefixed;

export const services: Service[] = [
  {
    slug: "water-leak-detection",
    lastModified: "2026-11-13", // GEO snippet, checklist, city and guide links; the visit's real scope (business-facts §H)
    icon: Droplets,
    image: "/images/services/water-leak-detection.svg",
    title: "איתור נזילות מים",
    h1: "איתור נזילות מים במצלמה תרמית",
    tagline: "מאתרים את מקור הנזילה במדויק — בלי לשבור קירות ורצפות.",
    summary:
      "זיהוי מדויק של נזילות מים נסתרות בצנרת, בקירות וברצפה באמצעות צילום תרמוגרפי לא הרסני.",
    metaDescription: `איתור נזילות מים בקירות, ברצפה ובצנרת ${region}. סריקה במצלמה תרמית ואימות במדידה משלימה, בלי לשבור קירות. ביקור איתור החל מ-₪${site.priceFrom}. חייגו ${site.phone.display}.`,
    answer: {
      q: "מה כוללת בדיקת איתור נזילות מים?",
      // The visit's terms are composed from site.visitScope — approved verbatim by the owner, never
      // reordered — exactly as lib/faqs.ts composes the guarantee from site.guaranteeTerms.
      a: `בדיקת איתור נזילות מים של ${site.nameHe} ${region} נעשית בלי לשבור קירות, וכוללת ${includes[1]}, ${includes[2]} ו${includes[3]}. לא כלולים: ${excludes[0]}, וכן ${excludes[1]}. ביקור איתור מתחיל ב-₪${site.priceFrom}, והמחיר הסופי נמסר מראש לפי גודל הנכס. ברוב הדירות הבדיקה אורכת כשעה.`,
    },
    intro: [
      "נזילת מים נסתרת יכולה להתחבא מאחורי קיר או מתחת לרצפה חודשים שלמים — ולגרום לנזק יקר ומתמשך. בעזרת מצלמה תרמית אנחנו מזהים את הפרשי הטמפרטורה שהמים יוצרים, ומאתרים את מקור הנזילה המדויק מבלי לשבור ולחפור באופן עיוור.",
      "השיטה התרמוגרפית לא פולשנית: היא חוסכת הריסות מיותרות, מקצרת את זמן התיקון וחוסכת לכם כסף. בסיום הבדיקה תקבלו תמונה ברורה של מצב הנכס והמלצה מדויקת להמשך הטיפול.",
    ],
    forWho:
      "בעלי דירות ובתים פרטיים, ועדי בית, מנהלי נכסים ושמאים שצריכים לאתר את מקור הנזילה לפני שמתחילים בתיקון.",
    benefits: [
      "איתור מדויק של מקור הנזילה — לא ניחוש",
      "בדיקה לא הרסנית, ללא שבירת קירות מיותרת",
      "חיסכון בעלויות תיקון ובזמן",
      "אפשרות לדו״ח כתוב עם תמונות תרמיות לחברת הביטוח",
    ],
    steps: [
      {
        title: "פנייה ותיאום",
        desc: "מתקשרים או שולחים וואטסאפ, מתארים את הבעיה ומתאמים מועד הגעה.",
      },
      {
        title: "בדיקה תרמוגרפית",
        desc: "סריקה של האזורים החשודים במצלמה תרמית מקצועית ובאמצעי איתור משלימים.",
      },
      {
        title: "איתור מקור הנזילה",
        desc: "זיהוי הנקודה המדויקת שממנה מגיעה הנזילה, וסימון ברור במקום.",
      },
      {
        title: "ממצאים במקום",
        desc: "מסבירים לכם במקום מה נמצא ומה ההמלצה לתיקון; דו״ח כתוב לחברת ביטוח, כשנדרש, מתומחר בנפרד.",
      },
    ],
    limits: {
      title: "מה מצלמה תרמית לא רואה",
      intro:
        "מצלמה תרמית מצלמת טמפרטורת פני שטח — לא את המים עצמם. היא מאתרת נזילה דרך דפוס החום או הקור שהרטיבות יוצרת. לשקיפות מלאה, אלה המצבים שמקשים על האיתור:",
      items: [
        "נזילה שאינה פעילה בזמן הבדיקה — צנרת שדולפת רק בשימוש מסוים עשויה שלא להשאיר חתימה תרמית. לכן נבקש מכם לעיתים להפעיל את המערכת לפני ההגעה.",
        "נזילה עמוקה מתחת לשכבת מדה עבה — ככל שהמים רחוקים מפני השטח, החתימה חלשה יותר. במקרים כאלה נשלב מד לחות ייעודי ובדיקות משלימות.",
        "קיר שהתייצב בטמפרטורת הסביבה — בלי הפרש טמפרטורה אין תמונה. לעיתים נכוון את מועד הבדיקה בהתאם.",
      ],
      outro:
        "זה בדיוק ההבדל בין סריקה לאבחון: אנחנו לא מסתמכים על תמונה אחת, אלא מצליבים ממצאים עד שמקור הנזילה מאומת.",
    },
    checklist: {
      title: "ארבעה דברים לבדוק לפני איתור נזילות מים",
      items: [
        "שאלו בשיחה אם להפעיל לפני ההגעה מערכת מסוימת, כמו מקלחת או מזגן: נזילה שאינה פעילה בזמן הסריקה עלולה שלא להופיע בה.",
        "ודאו שהסריקה תכלול גם את הרצפה ואת הקירות שסביב הכתם, כי מים נעים, ומקור הנזילה לא תמיד נמצא במקום שבו הופיע הכתם.",
        "אם חשבון המים קפץ ואין כתם בשום מקום, ספרו על כך בשיחה: גם נזילה שלא רואים, מתחת לריצוף או בתוך קיר, אפשר לחפש בסריקה.",
        "שאלו אם הממצא יסומן במקום כנקודה מדויקת, ולא כ״אזור חשוד״, כדי שבעל המקצוע יפתח רק שם.",
      ],
    },
    related: {
      lead: "מגישים תביעה לחברת הביטוח על נזקי המים?",
      links: [
        {
          label: "דו״ח תרמוגרפי לחברות הביטוח",
          href: "/services/insurance-reports/",
        },
        {
          label: "איתור רטיבות וכשלי בידוד",
          href: "/services/moisture-detection/",
        },
      ],
    },
    pricing: "from",
    priceModel: `ביקור איתור החל מ-₪${site.priceFrom}. העלות הסופית נקבעת לפי גודל הנכס והיקף הבדיקה, ותימסר לכם מראש בשקיפות מלאה.`,
    priceLink: {
      label: `מה כולל ביקור איתור ב-₪${site.priceFrom} ומה מתומחר בנפרד`,
      href: "/pricing/#visit-scope",
    },
    featuredGuides: [
      "find-leak-without-breaking",
      "what-a-thermal-camera-sees",
      "leak-detection-cost",
    ],
    guides: {
      title: "מדריכים על איתור נזילות",
      lead: "כאן מסוכם השירות. המדריכים מסבירים לעומק איך השיטה עובדת, איפה היא מוגבלת וממה מורכב המחיר:",
    },
    cityLinks: {
      mode: "all",
      title: "איתור נזילות מים לפי עיר",
      lead: "לכל אחת מהערים האלה יש עמוד משלה, עם מה שאופייני לבנייה המקומית ואיך מתאמים בה ביקור:",
    },
    faqs: [
      {
        q: "כמה זמן לוקחת הבדיקה?",
        a: "ברוב המקרים הבדיקה אורכת כשעה. בנכסים גדולים או במספר מוקדים ייתכן ויידרש זמן נוסף.",
      },
      {
        q: "האם הבדיקה הרסנית?",
        a: "לא. הצילום התרמי לא פולשני — אנחנו מאתרים את מקור הנזילה מבלי לשבור קירות באופן עיוור.",
      },
      {
        q: "האם אתם גם מתקנים את הנזילה?",
        a: "תפקידנו לאתר במדויק את מקור הבעיה ולמסור לכם את הממצאים. אנחנו מלווים אתכם ויכולים להפנות לבעלי מקצוע לתיקון עצמו.",
      },
    ],
    keywords: [
      "איתור נזילות",
      "איתור נזילות מים",
      "מצלמה תרמית נזילה",
      "נזילה בקיר",
      "איתור נזילות תרמי",
      "איתור נזילה ללא הרס",
    ],
  },
  {
    slug: "moisture-detection",
    lastModified: "2026-11-13", // GEO snippet, checklist, city and guide links; the visit's real scope (business-facts §H)
    icon: ThermometerSun,
    image: "/images/services/moisture-detection.svg",
    title: "איתור רטיבות ובידוד",
    h1: "איתור רטיבות, עובש וכשלי בידוד",
    tagline: "מזהים מוקדי רטיבות וגשרי קור לפני שהם הופכים לנזק יקר.",
    summary:
      "זיהוי מוקדי רטיבות, חדירת מים, עובש וכשלי בידוד תרמי במעטפת המבנה — בעזרת מיפוי תרמוגרפי.",
    metaDescription: `איתור רטיבות, עובש וכשלי בידוד ${region}. מיפוי תרמי ומדידת לחות, בלי לשבור קירות. מבחינים בין נזילה מצנרת, חדירת מים מבחוץ ועיבוי. חייגו ${site.phone.display}.`,
    answer: {
      q: "מה מבררים בבדיקת רטיבות בקיר?",
      // «במקום לצבוע שוב על הכתם, מטפלים בגורם עצמו.» is quoted by content/live/_campaigns.mjs
      // (before-pesach) — keep it verbatim, in this answer, and nowhere else in this file.
      a: `בבדיקת רטיבות בקיר מבררים מאיפה מגיעה הלחות: חדירת מים מבחוץ, נזילה מצנרת, עיבוי או כשל בידוד. ${site.nameHe} עושה זאת ${region} במיפוי תרמי של הקירות, התקרות והמעטפת ובמדידת לחות, ומוסרת לכם את הממצאים בעל פה במקום. במקום לצבוע שוב על הכתם, מטפלים בגורם עצמו. בדיקת רטיבות ובידוד מתחילה ב-₪${site.priceFrom}, והמחיר נקבע לפי היקף השטח לבדיקה ונמסר מראש.`,
    },
    intro: [
      "כתמי רטיבות, עובש וקירות קרים הם סימן לבעיה שמתרחשת מתחת לפני השטח. מיפוי תרמוגרפי מאפשר לנו לראות בדיוק היכן חודרת הרטיבות, היכן יש גשר קור והיכן הבידוד כשל — עוד לפני שהנזק מתפשט.",
      "כך תוכלו לטפל בשורש הבעיה במקום לצבוע שוב ושוב על אותו כתם, לשפר את הבידוד התרמי של הבית ולחסוך בעלויות חימום וקירור.",
    ],
    forWho:
      "בעלי בתים שמתמודדים עם כתמי רטיבות ועובש, רוכשי דירות שרוצים בדיקה לפני קנייה, וועדי בית שמטפלים ברטיבות במעטפת הבניין.",
    benefits: [
      "מיפוי מדויק של מוקדי הרטיבות והעובש",
      "זיהוי גשרי קור וכשלי בידוד תרמי",
      "מניעת התפשטות הנזק לפני שהוא מחמיר",
      "תמונה מלאה של מצב הנכס לפני שיפוץ או קנייה",
    ],
    steps: [
      {
        title: "פנייה ותיאום",
        desc: "מספרים לנו היכן מופיעה הרטיבות ומתי, ומתאמים מועד נוח לבדיקה.",
      },
      {
        title: "מיפוי תרמי",
        desc: "סריקת הקירות, התקרות והמעטפת לאיתור הפרשי לחות וטמפרטורה.",
      },
      {
        title: "אבחון המקור",
        desc: "קביעת מקור הרטיבות — חדירת מים, עיבוי, או כשל בידוד — ולא רק הסימפטום.",
      },
      {
        title: "הסבר והמלצות",
        desc: "הממצאים נמסרים לכם בעל פה במקום, יחד עם המלצות מעשיות לטיפול.",
      },
    ],
    limits: {
      title: "מתי הבדיקה דורשת תנאים מתאימים",
      intro: "אבחון רטיבות מדויק תלוי בהפרשי טמפרטורה ולחות. חשוב שתדעו מראש:",
      items: [
        "הבחנה בין עיבוי לנזילה דורשת לעיתים שתי מדידות בתנאים שונים — למשל אחרי גשם ולאחר ימי התייבשות.",
        "קירות עם בידוד עבה מחלישים את החתימה התרמית; שם נעזרים במד לחות ובבדיקה מקומית ממוקדת.",
        "ממצא תרמי לבדו אינו הוכחה — כל מוקד חשוד מאומת במדידת לחות לפני שנקבע מקור הרטיבות.",
      ],
    },
    checklist: {
      title: "מה להכין ומה לשאול לפני בדיקת רטיבות",
      items: [
        "רשמו מתי הכתם מופיע ומתי הוא נעלם, למשל אחרי גשם, אחרי מקלחת או בימים קרים: התזמון מכוון את הבדיקה למקור הנכון.",
        "לפני קניית דירה, קבעו את הבדיקה לפני החתימה על החוזה, כשעוד אפשר להביא את הממצאים למשא ומתן.",
        "אחרי שיפוץ או בבניין חדש, ספרו על כך מראש, כי בטיח ובבטון טריים יש עדיין לחות של בנייה שעלולה להטעות מדידה אחת.",
        "אם יש עובש, שאלו אם הבדיקה תחפש את מקור הלחות שמזינה אותו, ולא רק תתעד את הכתם הגלוי.",
      ],
    },
    related: {
      lead: "חושדים שמאחורי הרטיבות מסתתרת נזילה פעילה?",
      links: [
        {
          label: "איתור נזילות מים במצלמה תרמית",
          href: "/services/water-leak-detection/",
        },
        {
          label: "דו״ח תרמוגרפי לחברות הביטוח",
          href: "/services/insurance-reports/",
        },
      ],
    },
    pricing: "from",
    priceModel: `בדיקת רטיבות ובידוד החל מ-₪${site.priceFrom}. המחיר נקבע לפי היקף השטח לבדיקה ומועבר אליכם מראש.`,
    priceLink: {
      label: "ממה מושפע מחיר בדיקת רטיבות ובידוד",
      href: "/pricing/#price-factors",
    },
    featuredGuides: ["what-a-thermal-camera-sees"],
    guides: {
      title: "לקרוא לפני בדיקת רטיבות",
      lead: "לפני שמזמינים בדיקה כדאי להבין מה מצלמה תרמית רואה — ומה היא לא יכולה לראות:",
    },
    cityLinks: {
      mode: "all",
      title: "בדיקת רטיבות בעיר שלכם",
      lead: "רטיבות בשיכון משנות ה-50, במגדל חדש ובבית על מדרון מתחילה במקומות שונים. בעמוד של כל עיר מפורט מה אופייני לבנייה שבה:",
    },
    faqs: [
      {
        q: "אפשר לאתר את מקור הרטיבות בלי לפרק את הקיר?",
        a: "כן. הבדיקה התרמוגרפית מזהה את מוקד הרטיבות מבלי לפרק — כך מתמקדים בתיקון רק במקום הנכון.",
      },
      {
        q: "מתי כדאי לעשות בדיקת רטיבות?",
        a: "כשמופיעים כתמים, עובש או ריח טחוב, לפני שיפוץ, ובמיוחד לפני רכישת דירה.",
      },
      {
        q: "הבדיקה מתאימה גם לעובש?",
        a: "כן. מוקדי עובש נובעים כמעט תמיד מלחות נסתרת, והמיפוי התרמי עוזר לאתר את המקור.",
      },
    ],
    keywords: [
      "איתור רטיבות",
      "בדיקת רטיבות בקיר",
      "איתור עובש",
      "בדיקת בידוד תרמי",
      "מצלמה תרמית רטיבות",
      "גשר קור",
    ],
  },
  {
    slug: "electrical-thermography",
    lastModified: "2026-11-13", // GEO snippet, the electrician licence (business-facts §H), checklist, city links
    icon: Zap,
    image: "/images/services/electrical-thermography.svg",
    title: "בדיקת לוחות חשמל",
    h1: "בדיקה תרמוגרפית ללוחות חשמל ונקודות חום",
    tagline: "מזהים עומסי יתר וחיבורים לקויים — לפני שהם גורמים לשריפה.",
    summary:
      "סריקה תרמית של לוחות חשמל לאיתור נקודות חום, עומסי יתר וחיבורים לקויים — בדיקת בטיחות מונעת.",
    metaDescription: `בדיקה תרמוגרפית ללוחות חשמל בעסקים ובבנייני מגורים ${region}. סריקה תחת עומס, בלי להפסיק את החשמל. כל נקודת חום מדורגת לפי חומרתה. חייגו ${site.phone.display}.`,
    answer: {
      q: "למה צריך בדיקה תרמוגרפית ללוח חשמל?",
      // The licence sentence is the user's answer of 2026-11-13 (business-facts §H): stated in text,
      // never as a badge, a level or a number. Reg. 15(ג) allows a scan in the licence holder's
      // presence and under his supervision, hence «או בנוכחותו ובהשגחתו».
      a: `בדיקה תרמוגרפית של לוח חשמל, ש${site.nameHe} מבצעת ${region}, מאתרת חיבורים רופפים ועומסי יתר שמתחממים לפני שנגרמת תקלה או שריפה. הסריקה מתבצעת בידי חשמלאי בעל רישיון או בנוכחותו ובהשגחתו, כשהמערכת תחת עומס וללא הפסקת חשמל, וכל נקודת חום מדורגת לפי חומרתה. ${panelPriceModel} דו״ח בטיחות כתוב נמסר תוך ${site.reportTurnaroundDays} ימי עסקים.`,
    },
    intro: [
      "חיבור חשמלי רופף או עומס יתר מתחילים להתחמם הרבה לפני שמשהו נשרף. בדיקה תרמוגרפית של לוח החשמל מזהה את נקודות החום הללו בזמן אמת — בדיוק במקום שבו העין לא רואה דבר.",
      "זוהי בדיקת בטיחות מונעת חיונית לעסקים, בנייני מגורים ומפעלים, שמאפשרת לטפל בכשל לפני שהוא הופך לתקלה יקרה או לסכנת שריפה.",
    ],
    forWho:
      "בעלי עסקים ומפעלים, ועדי בית ומנהלי נכסים, וכל מי שרוצה בדיקת בטיחות מונעת ללוח החשמל.",
    benefits: [
      "זיהוי נקודות חום וחיבורים לקויים בזמן אמת",
      "מניעת תקלות חשמל ושריפות",
      "בדיקה תוך כדי פעילות, ללא הפסקת חשמל",
      "דו״ח בטיחות עם תיעוד תרמי לכל ממצא",
    ],
    steps: [
      {
        title: "תיאום בדיקה",
        desc: "מתאמים מועד נוח לבדיקת הלוח או הלוחות, ללא צורך בהשבתה.",
      },
      {
        title: "סריקה תרמית",
        desc: "צילום תרמי של החיבורים והמפסקים תחת עומס לאיתור התחממות חריגה, בידי חשמלאי בעל רישיון או בנוכחותו.",
      },
      {
        title: "אבחון ממצאים",
        desc: "סימון נקודות החום ודירוג חומרתן לפי רמת הסיכון.",
      },
      {
        title: "דו״ח בטיחות",
        desc: "דו״ח עם תמונות תרמיות והמלצות לטיפול מיידי או מתוכנן.",
      },
    ],
    limits: {
      title: "מה חשוב לדעת לפני בדיקת הלוח",
      items: [
        "הבדיקה מתבצעת כשהמערכת תחת עומס — מעגל כבוי לא מייצר חום. לכן אין צורך להפסיק את החשמל, ולהפך: כדאי שהמערכת תעבוד כרגיל.",
        "המצלמה מזהה התחממות של חיבורים ורכיבים על פני הלוח; היא אינה רואה לתוך רכיבים אטומים.",
        "הדו״ח שלנו הוא כלי אבחון ותחזוקה מונעת — הוא אינו מחליף ביקורת של חשמלאי בודק מוסמך כשזו נדרשת על פי דין.",
      ],
    },
    checklist: {
      title: "על מה להקפיד כשמזמינים בדיקה ללוח החשמל",
      items: [
        "ודאו שהסריקה מתבצעת בידי חשמלאי בעל רישיון מתאים, או בנוכחותו ובהשגחתו: כך קובעות תקנות החשמל לגבי בדיקה תרמוגרפית של מתקן חשמל.",
        "ספרו מראש כמה לוחות יש במתקן ואיפה הם נמצאים, כי לפי זה נקבעים היקף הבדיקה והמחיר.",
        "תאמו את הבדיקה לשעות שבהן העסק או הבניין צורכים חשמל כרגיל, ולא למועד שבו רוב המעגלים כבויים.",
        "שאלו אם כל נקודת חום תקבל דירוג חומרה והמלצה, כדי לדעת מה מחייב טיפול מיידי ומה אפשר לתכנן.",
      ],
    },
    related: {
      lead: "אפשר לשלב באותו ביקור בדיקות נוספות במבנה:",
      links: [
        {
          label: "איתור נזילות מים במצלמה תרמית",
          href: "/services/water-leak-detection/",
        },
        {
          label: "איתור רטיבות וכשלי בידוד",
          href: "/services/moisture-detection/",
        },
      ],
    },
    pricing: "quote",
    priceModel: `${panelPriceModel} צרו קשר לקבלת הצעת מחיר מהירה.`,
    priceLink: {
      label: "למה בדיקת לוח חשמל מתומחרת בנפרד",
      href: "/pricing/",
    },
    featuredGuides: [],
    // Only the three city pages whose own claims discuss panel scans (lib/locations.ts: holon's
    // industrial zone, ramat-gan's Bursa district, raanana's Kiryat Atidim). Never
    // «בדיקת לוחות חשמל ב{city}» as an anchor — no service×city page exists (keyword-map §6).
    cityLinks: {
      mode: "places",
      lead: "בשלושה מעמודי הערים מוסבר גם מתי בדיקת לוח רלוונטית לעסקים ולמשרדים:",
      places: [
        { place: "אזור התעשייה", city: "holon" },
        { place: "מתחם הבורסה", city: "ramat-gan" },
        { place: "קריית אתגרים", city: "raanana" },
      ],
    },
    faqs: [
      {
        q: "צריך להפסיק את החשמל לבדיקה?",
        a: "לא. דווקא להפך — הבדיקה מתבצעת כשהמערכת בעומס, כדי לזהות התחממות אמיתית.",
      },
      {
        q: "לכל כמה זמן מומלץ לבצע בדיקה?",
        a: "לעסקים ומפעלים מומלץ אחת לשנה, וגם לאחר שינויים או הוספת עומסים במערכת.",
      },
      {
        q: "מה מקבלים בסוף הבדיקה?",
        a: "דו״ח בטיחות מסודר עם תמונות תרמיות, דירוג חומרה והמלצות לטיפול.",
      },
    ],
    keywords: [
      "בדיקה תרמוגרפית",
      "בדיקת לוח חשמל",
      "צילום תרמי לוח חשמל",
      "נקודות חום בחשמל",
      "בדיקת בטיחות חשמל",
    ],
  },
  {
    slug: "insurance-reports",
    lastModified: "2026-11-13", // GEO snippet; insurer acceptance removed (business-facts §H); checklist, guide links
    icon: FileCheck2,
    image: "/images/services/insurance-reports.svg",
    title: "דו״ח תרמוגרפי לביטוח",
    h1: "דו״ח תרמוגרפי מקצועי לחברות ביטוח",
    // «מקובל / קביל בחברות הביטוח» was removed 2026-11-13: nothing on file shows an insurer accepting
    // the report, and the decision always sits with the insurer (business-facts §H). Never restore it.
    tagline: "דו״ח מסודר, עם תמונות תרמיות וממצאים — להגשה לחברת הביטוח.",
    summary:
      "דו״ח תרמוגרפי מפורט עם תמונות, ממצאים והמלצות — מסודר להגשה בתביעה מול חברת הביטוח.",
    metaDescription: `דו״ח תרמוגרפי לחברת הביטוח על נזקי מים ורטיבות, ${region}. תיעוד מקור הנזק, היקפו והקשר ביניהם בתמונות תרמיות. נמסר תוך ${site.reportTurnaroundDays} ימי עסקים. חייגו ${site.phone.display}.`,
    answer: {
      q: "מה מקבלים כשמזמינים דו״ח תרמוגרפי לביטוח?",
      a: `כשמזמינים מ${site.nameHe} דו״ח תרמוגרפי לביטוח ${region}, מקבלים מסמך שמתעד את מקור הנזק, את היקפו ואת הקשר ביניהם, עם תמונות תרמיות וממצאים מסודרים. הדו״ח נשען על בדיקה תרמוגרפית בנכס עצמו, ואנחנו מלווים אתכם בהגשתו לחברת הביטוח לפי הצורך. ${reportPriceModel} את הדו״ח הכתוב תקבלו תוך ${site.reportTurnaroundDays} ימי עסקים מסיום הבדיקה.`,
    },
    intro: [
      "כשמגישים תביעת ביטוח על נזקי מים או רטיבות, חברת הביטוח דורשת הוכחה ברורה למקור הנזק והיקפו. דו״ח תרמוגרפי מקצועי מספק בדיוק את זה: תיעוד אובייקטיבי, תמונות תרמיות וממצאים שקל להגיש ולהבין.",
      "הדו״ח שלנו ערוך בצורה מסודרת ומתעד את מקור הנזק, את היקפו ואת הקשר ביניהם — מה שחברת הביטוח צריכה כדי לבחון את התביעה.",
    ],
    forWho:
      "מבוטחים שמגישים תביעה על נזקי מים או רטיבות, שמאים, ומנהלי נכסים שזקוקים לתיעוד מקצועי.",
    benefits: [
      "תיעוד אובייקטיבי של מקור הנזק והיקפו",
      "תמונות תרמיות וממצאים ברורים",
      "דו״ח ערוך ומסודר להגשה לחברת הביטוח",
      "תיעוד שמצמצם ויכוחים על מקור הנזק",
    ],
    steps: [
      {
        title: "פנייה ותיאום",
        desc: "מספרים לנו על הנזק ועל דרישות חברת הביטוח, ומתאמים בדיקה.",
      },
      {
        title: "בדיקה ותיעוד",
        desc: "ביצוע בדיקה תרמוגרפית מלאה עם תיעוד מסודר של כל ממצא.",
      },
      {
        title: "עריכת הדו״ח",
        desc: "הכנת דו״ח מקצועי עם תמונות תרמיות, ממצאים והמלצות.",
      },
      {
        title: "מסירה וליווי",
        desc: "מסירת הדו״ח וליווי בהגשתו מול חברת הביטוח לפי הצורך.",
      },
    ],
    limits: {
      title: "מה הדו״ח עושה — ומה הוא לא",
      items: [
        "הדו״ח מתעד ממצאים באופן אובייקטיבי: מקור הנזק, היקפו והקשר ביניהם. ההחלטה על התביעה עצמה נמצאת תמיד בידי חברת הביטוח.",
        "דו״ח טוב מצמצם ויכוחים — אבל אף דו״ח אינו מבטיח אישור תביעה. היזהרו ממי שמבטיח אחרת.",
        "חשוב לתעד לפני שמתקנים: תיקון הנזק לפני הבדיקה מוחק את הראיות שהדו״ח אמור לתעד.",
      ],
    },
    checklist: {
      title: "מה לסדר מול חברת הביטוח לפני שמזמינים דו״ח",
      items: [
        "בדקו בפוליסה אם הוצאות על מומחה מוכרות רק בתנאי שהודעתם למבטח מראש, ואם כן, הודיעו לו לפני שמזמינים בדיקה.",
        "בררו מה בדיוק חברת הביטוח מבקשת, ומסרו לנו את זה כבר בשיחה, כדי שהבדיקה תתעד את מה שנדרש לתביעה שלכם.",
        "ודאו שכל ממצא בדו״ח אומת במדידה משלימה ולא נשען על תמונה תרמית בלבד.",
        "אם הנזק נוגע גם לשכנים או לרכוש המשותף, תאמו מראש גישה גם לשם, כדי שהדו״ח יראה מאיזה כיוון מגיעה הרטיבות.",
      ],
    },
    related: {
      lead: "עדיין לא אותר מקור הנזק? מתחילים באיתור:",
      links: [
        {
          label: "איתור נזילות מים במצלמה תרמית",
          href: "/services/water-leak-detection/",
        },
        {
          label: "איתור רטיבות וכשלי בידוד",
          href: "/services/moisture-detection/",
        },
      ],
    },
    pricing: "quote",
    priceModel: `${reportPriceModel} נשמח לתת לכם הצעת מחיר מותאמת.`,
    priceLink: {
      label: "איך דו״ח לביטוח משפיע על מחיר הבדיקה",
      href: "/pricing/",
    },
    featuredGuides: ["leak-detection-cost", "find-leak-without-breaking"],
    guides: {
      title: "לפני שמגישים תביעה על נזקי מים",
      lead: "מה כדאי לדעת על האיתור, על העלות ועל התיעוד לפני שמגישים תביעה, מוסבר במדריכים:",
    },
    faqs: [
      {
        q: "הדו״ח מבטיח שחברת הביטוח תאשר את התביעה?",
        a: "לא, וההחלטה תמיד בידי חברת הביטוח. הדו״ח מתעד בצורה מסודרת את מקור הנזק, את היקפו ואת הקשר ביניהם, עם תמונות תרמיות וממצאים שאומתו במדידה משלימה.",
      },
      {
        q: "כמה זמן לוקח לקבל את הדו״ח?",
        a: `הדו״ח נמסר תוך ${site.reportTurnaroundDays} ימי עסקים מסיום הבדיקה.`,
      },
      {
        q: "אפשר גם איתור וגם דו״ח באותו ביקור?",
        a: "בהחלט. אנחנו מאתרים את מקור הנזילה ומפיקים את הדו״ח על בסיס אותה בדיקה.",
      },
    ],
    keywords: [
      "דו״ח תרמוגרפי",
      "דו״ח נזילה לביטוח",
      "תביעת ביטוח נזקי מים",
      "דוח איתור נזילות",
      "שמאות נזקי מים",
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export const serviceSlugs: string[] = services.map((service) => service.slug);

// --- build-time checks (module scope: every build that imports this file runs them) ------------

function fail(message: string): never {
  throw new Error(`lib/services.ts: ${message}`);
}

for (const item of heroPicker.items) {
  if (!serviceSlugs.includes(item.service)) {
    fail(`heroPicker names service '${item.service}', which does not exist.`);
  }
}
if (new Set(heroPicker.items.map((item) => item.service)).size !== services.length) {
  fail("heroPicker must offer each service exactly once.");
}

// Sentences long enough to be quotable must not repeat across two services' answers or checklists —
// a shared sentence is the doorway pattern (content-standards §2). This catches literal reuse only;
// the editorial rule is the doorway test itself.
const sentenceOwner = new Map<string, string>();

for (const service of services) {
  const where = `service '${service.slug}'`;

  const metaLength = [...service.metaDescription].length;
  if (metaLength < 150 || metaLength > 160) {
    fail(`${where} metaDescription is ${metaLength} characters; keep it at 150–160.`);
  }

  const showsPrice = service.priceModel.includes(`₪${site.priceFrom}`);
  if ((service.pricing === "from") !== showsPrice) {
    fail(`${where} pricing is '${service.pricing}' but its priceModel ${showsPrice ? "states" : "omits"} ₪${site.priceFrom}.`);
  }
  if (service.pricing === "quote" && service.priceModel.includes("₪")) {
    fail(`${where} is priced per job; its priceModel must state no ₪ figure.`);
  }

  if ((service.featuredGuides.length > 0) !== Boolean(service.guides)) {
    fail(`${where}: \`guides\` (the block's title and lead) is required exactly when featuredGuides is non-empty.`);
  }

  for (const text of [service.answer.a, ...service.checklist.items]) {
    for (const sentence of text.split(/(?<=[.?!:])\s+/)) {
      const key = sentence.trim();
      if (key.length < 30) continue;
      const owner = sentenceOwner.get(key);
      if (owner && owner !== service.slug) {
        fail(`the sentence «${key}» appears on both '${owner}' and '${service.slug}'.`);
      }
      sentenceOwner.set(key, service.slug);
    }
  }
}
