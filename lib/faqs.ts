// General FAQs shown on the homepage and used for FAQPage structured data.
import type { ServiceFaq } from "./services";
import { site } from "./site";

export const generalFaqs: ServiceFaq[] = [
  {
    q: "מה זה בכלל איתור נזילות תרמי?",
    a: "זו שיטה לא הרסנית לאיתור נזילות ורטיבות. המים והלחות יוצרים הפרשי טמפרטורה שהמצלמה התרמית מזהה, וכך אנחנו מאתרים את מקור הבעיה המדויק מבלי לשבור קירות באופן עיוור.",
  },
  {
    q: "האם הבדיקה הרסנית? תשברו לי קירות?",
    a: "לא. כל היתרון של השיטה התרמוגרפית הוא שהיא לא פולשנית. אנחנו מאתרים קודם את המקור המדויק, וכך התיקון מתבצע רק במקום הנכון — בלי הריסות מיותרות.",
  },
  {
    q: "מה מצלמה תרמית לא יכולה לראות?",
    a: "המצלמה מצלמת טמפרטורת פני שטח — לא את המים עצמם. נזילה שאינה פעילה, צנרת עמוקה מתחת למדה עבה או קיר שהתייצב בטמפרטורת הסביבה עשויים שלא להשאיר חתימה ברורה. לכן כל ממצא תרמי מאומת אצלנו במכשירי מדידה משלימים לפני שנקבע המקור.",
  },
  {
    q: "כמה זמן לוקחת בדיקה ומתי מקבלים תשובה?",
    a: "ברוב המקרים הבדיקה אורכת כשעה, ואת הממצאים העיקריים תקבלו כבר במקום. דו״ח כתוב, כשנדרש, נמסר תוך 3 ימי עסקים.",
  },
  {
    q: "כמה עולה איתור נזילה?",
    a: `ביקור איתור מתחיל מ-₪${site.priceFrom}, והעלות הסופית נקבעת לפי גודל הנכס והיקף הבדיקה. המחיר תמיד נמסר לכם מראש, בשקיפות מלאה.`,
  },
  {
    // The site's most load-bearing commercial claim, and until now the only major one absent from
    // every FAQPage. Composed from site.guaranteeTerms rather than retyped: the terms are
    // owner-confirmed (business-facts §C) and this answer feeds JSON-LD, so a hand-written copy
    // here would eventually contradict /pricing/#guarantee — which is where the full terms,
    // including the exceptions, are set out.
    q: `מה כוללת ההתחייבות ״${site.guarantee}״?`,
    // ALL FOUR terms, exceptions included, in the order a worried homeowner needs them: the
    // no-charge promise, what "found" means, what is not covered, and when the promise does not
    // apply. Dropping `exceptions` here would state an UNCONDITIONAL no-charge promise on the
    // homepage while its conditions sat one click away on /pricing/#guarantee — which is the
    // over-promise §7.8 was opened about, not a fix for it.
    a: `${site.guaranteeTerms.ifNotFound} ${site.guaranteeTerms.whatCounts} ${site.guaranteeTerms.excluded} ${site.guaranteeTerms.exceptions}`,
  },
  {
    q: "האם צריך להכין משהו לפני הבדיקה?",
    a: "לרוב לא נדרשת הכנה מיוחדת. לעיתים נבקש להפעיל מערכת מסוימת לפני ההגעה — למשל מזגן או ברז — כדי שהנזילה תהיה פעילה בזמן הסריקה ותשאיר חתימה תרמית ברורה.",
  },
  {
    q: "מתאים גם לבדיקה לפני קניית דירה?",
    a: "בהחלט. סריקה תרמית לפני רכישה מגלה רטיבות נסתרת, כשלי בידוד וסימנים לנזילות ישנות — מידע חשוב למשא ומתן ולהחלטה, בלי לפגוע בנכס.",
  },
  {
    q: "אתם מגיעים לאזור שלי?",
    a: "אנחנו פועלים בכל גוש דן והמרכז, ומגיעים עד כשעתיים נסיעה מתל אביב — כלומר שירות ארצי בתיאום מראש. מוזמנים להתקשר ולבדוק זמינות לאזור שלכם.",
  },
  {
    q: "אני מקבל דו״ח לחברת הביטוח?",
    a: "כן. אנחנו מפיקים דו״ח תרמוגרפי מסודר עם תמונות וממצאים, שמקובל בחברות הביטוח ומסייע לקדם את התביעה.",
  },
];
