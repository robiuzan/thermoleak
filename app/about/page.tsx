import type { Metadata } from "next";
import { ShieldCheck, Target, Wallet, Sparkles, BadgeCheck } from "lucide-react";
import { site } from "@/lib/site";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import TrustBar from "@/components/TrustBar";
import ContactCTA from "@/components/ContactCTA";
import JsonLd from "@/components/JsonLd";
import { aboutPageJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  // Bare subject only — the layout template appends "| טרמוליק". The previous title contained
  // the brand too and rendered it twice (docs/optimization-backlog.md §2.1).
  title: "אודות",
  description:
    "מעל עשור של ניסיון באיתור נזילות ורטיבות במצלמה תרמית. הכירו את הערכים, השיטה והמומחיות של טרמוליק — דיוק, שקיפות וללא הרס.",
  alternates: { canonical: "/about/" },
};

const story = [
  "טרמוליק הוקמה מתוך אמונה פשוטה: אפשר לאתר נזילות ורטיבות בצורה מדויקת — בלי לשבור חצי בית בדרך. מאז 2015 אנחנו עושים בדיוק את זה, עם מצלמות תרמיות מקצועיות וניסיון מצטבר בשטח.",
  "כל בדיקה אצלנו מתחילה בהקשבה ללקוח ומסתיימת בממצא ברור ובדו״ח מסודר. אנחנו מאמינים בשקיפות מלאה במחירים, בעבודה נקייה ובליווי עד לפתרון — לא רק באיתור הבעיה.",
  "אנחנו נותנים שירות לבעלי בתים, ועדי בית, עסקים, מנהלי נכסים ושמאי ביטוח בכל גוש דן והמרכז, עם זמינות מהירה גם למקרי חירום.",
];

// Depth to the 500-word floor (backlog §3.3). Deliberately written around what CAN be stated
// today: method, scope and limits. The credentials block and a named person are still blocked on
// docs/business-facts.md §A/§B — that gap is why this page was short in the first place.
const approach = [
  {
    title: "מאתרים את המקור, לא את הסימפטום",
    body: "כתם רטיבות כמעט אף פעם לא נמצא בדיוק מעל הנזילה. מים נעים לאורך צנרת, לאורך תקרות ומתחת לריצוף, ומופיעים במקום שבו הם מוצאים מוצא. לכן אנחנו לא מתחילים מהכתם אלא סורקים גם את סביבתו — כולל אזורים שנראים תקינים לחלוטין.",
  },
  {
    title: "לא מסתמכים על ממצא אחד",
    body: "מצלמה תרמית מודדת טמפרטורת פני שטח, לא מים. היא מצוינת בלצמצם אזור חיפוש, אבל ממצא תרמי לבדו הוא השערה. כל מוקד חשוד מאומת אצלנו במדידת לחות ובאמצעים משלימים לפני שנקבע מקור — וכך נמנעים גם מהריסה מיותרת וגם מאבחון שגוי.",
  },
  {
    title: "אומרים גם מה השיטה לא יכולה",
    body: "יש מצבים שבהם בדיקה תרמית לא תיתן תשובה חד-משמעית: נזילה שאינה פעילה בזמן הסריקה, צנרת עמוקה מתחת למדה עבה, או קיר שהתייצב בטמפרטורת הסביבה. אנחנו אומרים את זה מראש. מי שמבטיח ודאות מוחלטת בכל מקרה מוכר משהו אחר.",
  },
  {
    title: "המחיר נמסר לפני הביקור",
    body: "אנחנו מוסרים מחיר על בסיס תיאור הנכס והבעיה — בטלפון או בוואטסאפ, לפני שקובעים. מחיר שמתגלה רק בסוף הביקור הוא לא שקיפות, וזה לא איך שאנחנו עובדים.",
  },
  {
    title: "מאתרים, לא מתקנים — וזו החלטה מכוונת",
    body: "אנחנו מבצעים את האבחון ומפיקים את הדו״ח; את התיקון עצמו מבצע בעל מקצוע — אינסטלטור, איטום או חשמלאי, לפי הממצא. ההפרדה הזו חשובה: מי שגם מאתר וגם מתקן נמצא בניגוד עניינים מובנה לגבי היקף הממצא. אנחנו יכולים להפנות אתכם, ואנחנו מלווים עד שהבעיה נפתרת.",
  },
  {
    title: "אזור השירות — ומה זה אומר בפועל",
    body: "אנחנו פועלים בגוש דן והמרכז, ברדיוס של עד כ-60 ק״מ, ונותנים שירות ארצי בתיאום מראש. המרחק משפיע על זמינות ולא על איכות הבדיקה: לנזילה פעילה נשתדל להגיע באותו יום באזור הקרוב, ובמרחק גדול יותר נתאם מועד. אין לנו משרד קבלה — השירות ניתן אצלכם, וזה מה שהעסק הזה עושה כל היום.",
  },
];

const values = [
  { icon: Target, title: "דיוק לפני הכל", desc: "מאתרים את מקור הבעיה המדויק, לא את הסימפטום — וכך התיקון מתבצע נכון מהפעם הראשונה." },
  { icon: ShieldCheck, title: "ללא הרס מיותר", desc: "השיטה התרמוגרפית לא פולשנית, וחוסכת לכם הריסות, זמן וכסף." },
  { icon: Wallet, title: "שקיפות מחירים", desc: "המחיר נמסר מראש, בצורה ברורה, בלי הפתעות בסוף הביקור." },
  { icon: Sparkles, title: "אחריות מלאה", desc: site.guarantee + " — אנחנו עומדים מאחורי העבודה שלנו." },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={aboutPageJsonLd({
          path: "/about",
          name: "אודות טרמוליק",
          description: metadata.description as string,
        })}
      />
      <PageHero
        title="קצת עלינו"
        subtitle="מומחים לאיתור נזילות ורטיבות במצלמה תרמית — עם דיוק, שקיפות והרבה ניסיון."
        crumbs={[
          { name: "בית", href: "/" },
          { name: "אודות", href: "/about" },
        ]}
      />

      <section className="py-16 md:py-20">
        <Container className="max-w-3xl">
          {story.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mb-4 text-lg leading-relaxed text-ink/80">
              {paragraph}
            </p>
          ))}
        </Container>
      </section>

      <TrustBar />

      {/* Founder. Only what is confirmed: the name (business-facts §A) and the 2015 founding year.
          Role detail, years in the trade, certification number, insurance and ח.פ. are still 🔶 —
          do not infer them from the name. */}
      <section className="py-12">
        <Container className="max-w-3xl">
          <div id="founder" className="rounded-2xl border border-ink/10 bg-white p-6">
            <p className="text-sm font-bold tracking-wide text-accent-strong">מי עומד מאחורי טרמוליק</p>
            <p className="mt-2 leading-relaxed text-ink/80">
              טרמוליק נוסדה ב-{site.founded} ומובלת על ידי{" "}
              <span className="font-bold text-brand">{site.founder}</span>. כל בדיקה מבוצעת באותה
              שיטה שמתוארת כאן — סריקה, אימות, ואז מסקנה — ולא בסדר ההפוך.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container className="max-w-3xl">
          <h2 className="text-2xl font-extrabold text-brand sm:text-3xl">איך אנחנו עובדים</h2>
          <div className="mt-8 space-y-8">
            {approach.map((item) => (
              <div key={item.title}>
                <h3 className="text-lg font-bold text-brand">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-ink/80">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-16 md:py-20">
        <Container>
          <h2 className="text-center text-2xl font-extrabold text-brand sm:text-3xl">
            הערכים שמובילים אותנו
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
                  <span className="inline-flex size-12 items-center justify-center rounded-xl bg-accent/15 text-accent-strong">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-brand">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{value.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 rounded-2xl border border-ink/10 bg-paper p-8">
            <h2 className="text-xl font-bold text-brand">הסמכות וציוד</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {site.certifications.map((item) => (
                <li key={item} className="flex items-start gap-2 text-ink/80">
                  <BadgeCheck className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
