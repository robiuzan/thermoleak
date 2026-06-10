import type { Metadata } from "next";
import { site, telHref, mailHref } from "@/lib/site";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "הצהרת נגישות",
  description:
    "הצהרת הנגישות של אתר תרמולק — האתר עומד ברמת AA של תקן ישראלי 5568 ובהנחיות WCAG 2.0. פרטי רכז הנגישות ואפשרות לדיווח.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <>
      <PageHero
        title="הצהרת נגישות"
        crumbs={[
          { name: "בית", href: "/" },
          { name: "הצהרת נגישות", href: "/accessibility" },
        ]}
      />
      <section className="py-14 md:py-16">
        <Container className="max-w-3xl text-ink/80 leading-relaxed">
          <p>
            ב{site.nameHe} אנו רואים חשיבות רבה במתן שירות שוויוני לכלל הלקוחות, ופועלים כדי שהאתר יהיה
            נגיש לאנשים עם מוגבלות. אנו מאמינים שלכל אדם מגיעה הזכות לגלוש באתר בכבוד, בעצמאות ובנוחות.
          </p>

          <h2 className="mt-8 text-xl font-bold text-brand">רמת הנגישות באתר</h2>
          <p className="mt-2">
            האתר נבנה בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג–2013,
            ובהתאם לרמה AA של התקן הישראלי 5568, המבוסס על הנחיות הנגישות הבינלאומיות WCAG 2.0.
          </p>

          <h2 className="mt-8 text-xl font-bold text-brand">מה הונגש באתר</h2>
          <ul className="mt-2 list-disc space-y-2 ps-6">
            <li>מבנה כותרות סמנטי וברור לניווט נוח עם קורא מסך.</li>
            <li>ניווט מלא באמצעות מקלדת, עם סימון ברור של הפוקוס.</li>
            <li>שמירה על ניגודיות צבעים תקינה בין הטקסט לרקע.</li>
            <li>טקסט חלופי לאלמנטים גרפיים וקישורים בעלי משמעות.</li>
            <li>התאמה מלאה לגלישה במכשירים ניידים ובגדלי מסך שונים.</li>
            <li>אפשרות לדלג ישירות לתוכן המרכזי בראש כל עמוד.</li>
          </ul>

          <h2 className="mt-8 text-xl font-bold text-brand">דיווח על בעיית נגישות</h2>
          <p className="mt-2">
            אנו משקיעים מאמץ מתמשך בשיפור נגישות האתר. אם נתקלתם בקושי או בתקלת נגישות, נשמח שתעדכנו אותנו
            ונפעל לתקן בהקדם. ניתן לפנות לרכז הנגישות:
          </p>
          <ul className="mt-3 space-y-1">
            <li>
              טלפון:{" "}
              <a href={telHref} dir="ltr" className="font-semibold text-brand underline">
                {site.phone.display}
              </a>
            </li>
            <li>
              אימייל:{" "}
              <a href={mailHref} dir="ltr" className="font-semibold text-brand underline">
                {site.email}
              </a>
            </li>
          </ul>

          <p className="mt-8 text-sm text-ink/55">הצהרת הנגישות עודכנה לאחרונה ביוני 2026.</p>
        </Container>
      </section>
    </>
  );
}
