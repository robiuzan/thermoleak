// Hub-page copy: /services/ (and, with the next guides, /guides/). A hub's job is to link down to
// every child with descriptive anchors and to explain how the children relate — the framework's
// "parent hub" (docs/seo-geo-aeo-strategy.md §2; backlog §9.4, which this closes for /services/).
// Copy only; every link is checked in lib/links.ts. Never quoted by a live register.
import { site, type LinkedText } from "./site";

// The homepage's own metadata. A layout's title.template does NOT apply to that segment's own page,
// so this is the complete rendered title — brand included, exactly once (backlog §2.1). It carries the
// head term «איתור נזילות» and the region and stays off «איתור נזילות מים», which the water-leak page
// owns; the description is worded apart from that page's snippet so the two do not compete.
export const home = {
  title: `איתור נזילות תרמי ורטיבות ${site.address.regionPrefixed} | ${site.nameHe}`,
  description: `${site.nameHe} מאתרת נזילות ורטיבות ${site.address.regionPrefixed} במצלמה תרמית, ומאמתת כל ממצא במדידה לפני שפותחים קיר. ביקור איתור החל מ-₪${site.priceFrom}, במחיר שנמסר מראש. חייגו ${site.phone.display}.`,
};

export const servicesHub = {
  // The <title> keeps its keyword phrase; the H1 stays the short label (keyword-map §3–§4).
  title: "שירותים — איתור נזילות, רטיבות ותרמוגרפיה",
  description: `שירותי איתור נזילות ורטיבות ${site.address.regionPrefixed}: איתור נזילות מים, רטיבות ובידוד, בדיקת לוחות חשמל ודו״ח תרמוגרפי לביטוח — במצלמה תרמית, ללא הרס. חייגו ${site.phone.display}.`,
  // Was «מדויקים, מהירים» — «מהירים» is not a confirmed phrase (business-facts §D).
  subtitle: "ארבע בדיקות במצלמה תרמית — לבית, לעסק ולתביעות ביטוח — ללא הרס.",
  intro: [
    `ארבעת השירותים של ${site.nameHe} נשענים על אותו כלי — מצלמה תרמית שמציגה הפרשי טמפרטורה שהעין לא רואה — ואפשר לשלב כמה מהם באותו ביקור. ההבדל ביניהם הוא בשאלה שכל בדיקה עונה עליה. על מים שדולפים מצנרת נסתרת בקיר או מתחת לריצוף עונה `,
    {
      label: "איתור נזילות מים במצלמה תרמית",
      href: "/services/water-leak-detection/",
    },
    "; על כתם רטיבות, עובש או קיר קר — ",
    { label: "איתור רטיבות וכשלי בידוד", href: "/services/moisture-detection/" },
    "; על חיבור שמתחמם בלוח החשמל — ",
    {
      label: "בדיקה תרמוגרפית ללוח חשמל",
      href: "/services/electrical-thermography/",
    },
    "; ועל הצורך לתעד את מקור הנזק ואת היקפו לתביעה — ",
    { label: "דו״ח תרמוגרפי לביטוח", href: "/services/insurance-reports/" },
    ".",
  ] satisfies LinkedText,
  moreTitle: "מחיר, מדריכים ואזורי שירות",
  more: [
    `ביקור איתור נזילה או רטיבות מתחיל מ-₪${site.priceFrom}, ובדיקת לוח חשמל ודו״ח לביטוח מתומחרים בנפרד לפי היקף העבודה. הפירוט המלא, כולל מה נכלל בביקור, נמצא בעמוד `,
    { label: "מחירון איתור נזילות", href: "/pricing/" },
    ". ואם תרצו להבין את השיטה לפני שקובעים ביקור, ",
    { label: "המדריכים לאיתור נזילות ורטיבות", href: "/guides/" },
    " מסבירים מה מצלמה תרמית מזהה ואיפה היא מגיעה לגבול שלה. השירות ניתן בגוש דן והמרכז, ובשאר הארץ בתיאום מראש.",
  ] satisfies LinkedText,
  cities: {
    // The count is checked against lib/locations.ts in lib/links.ts.
    lead: "סוג הבניין משנה את החיפוש אחר נזילה, ולכן ריכזנו עמוד נפרד ל-12 ערים באזור השירות:",
  },
};
