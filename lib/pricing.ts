// Pricing page (/pricing/) content. Per-service price lines render from lib/services.ts
// `priceModel` — this file never restates a per-service price.
// 🔶 confirm — the ₪450 base and what a visit includes are unverified (docs/business-facts.md §C).
import type { ServiceFaq } from "./services";
import { site } from "./site";

export interface PricingFactor {
  title: string;
  desc: string;
}

export const pricing = {
  title: "מחירון איתור נזילות ובדיקות תרמוגרפיה",
  subtitle: "מחיר שקוף שנמסר מראש — לפני שקובעים ביקור, לא בסופו.",

  // The AEO answer block — also joins the page's FAQPage structured data.
  answer: {
    q: "כמה עולה איתור נזילות?",
    a: `ביקור איתור נזילות מתחיל ב-₪${site.priceFrom} ברוב הדירות. המחיר הסופי נקבע לפי גודל הנכס, מספר המוקדים החשודים והיקף התיעוד הנדרש — ונמסר לכם מראש, בטלפון או בוואטסאפ, לפני שמתאמים ביקור. בדיקות לוחות חשמל ודו״חות לביטוח מתומחרים בנפרד לפי היקף העבודה.`,
  } satisfies ServiceFaq,

  ratesHeading: "מחירון לפי שירות",

  factors: {
    title: "ממה מושפע המחיר?",
    items: [
      {
        title: "גודל הנכס",
        desc: "דירת שלושה חדרים נסרקת מהר יותר מבית פרטי או ממבנה מסחרי — היקף השטח קובע את משך הביקור.",
      },
      {
        title: "מספר המוקדים החשודים",
        desc: "כתם בודד וממוקד לעומת רטיבות שמופיעה בכמה חדרים — כל מוקד נסרק ומאומת בנפרד.",
      },
      {
        title: "היקף התיעוד",
        desc: "כשנדרש דו״ח מפורט לחברת הביטוח, נוספת עבודת עריכה ותיעוד מעבר לבדיקה עצמה.",
      },
      {
        title: "סוג הבדיקה",
        desc: "בדיקות לוחות חשמל מתומחרות לפי כמות הלוחות והיקף המתקן — בנפרד ממחירון איתור הנזילות.",
      },
    ] satisfies PricingFactor[],
  },

  faqs: [
    {
      q: "מתי אדע כמה זה יעלה לי?",
      a: "לפני שקובעים ביקור. מתארים לנו בטלפון או בוואטסאפ את הבעיה ואת גודל הנכס — ואנחנו מוסרים מחיר מראש. בלי הפתעות בסוף הבדיקה.",
    },
    {
      q: "ממה בעיקר מושפע המחיר?",
      a: "מגודל הנכס, ממספר המוקדים החשודים ומהיקף התיעוד הנדרש — למשל כשצריך דו״ח מפורט לחברת הביטוח. את המחיר המדויק לנכס שלכם תקבלו מראש.",
    },
    {
      q: "האם בדיקת לוח חשמל מתומחרת אותו דבר?",
      a: "לא. בדיקות לוחות חשמל מתומחרות לפי כמות הלוחות והיקף המתקן, ולכן שם ניתנת הצעת מחיר נפרדת לכל מתקן.",
    },
  ] satisfies ServiceFaq[],
};
