import type { Metadata } from "next";
import { site, telHref, mailHref } from "@/lib/site";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "מדיניות פרטיות",
  description:
    "מדיניות הפרטיות של טרמוליק — איזה מידע נאסף באתר, כיצד נעשה בו שימוש, וכיצד אנו שומרים על פרטיותכם.",
  alternates: { canonical: "/privacy/" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="מדיניות פרטיות"
        crumbs={[
          { name: "בית", href: "/" },
          { name: "מדיניות פרטיות", href: "/privacy" },
        ]}
      />
      <section className="py-14 md:py-16">
        <Container className="max-w-3xl leading-relaxed text-ink/80">
          <p>
            הפרטיות שלכם חשובה לנו. מסמך זה מסביר איזה מידע נאסף בעת השימוש באתר {site.nameHe}, כיצד אנו
            משתמשים בו וכיצד אנו שומרים עליו.
          </p>

          <h2 className="mt-8 text-xl font-bold text-brand">איזה מידע נאסף</h2>
          <p className="mt-2">
            כאשר אתם משאירים פרטים בטופס יצירת הקשר, אנו אוספים את הפרטים שמסרתם מרצונכם — שם, מספר טלפון,
            אזור מגורים, סוג השירות המבוקש ופרטים נוספים שתבחרו לשתף. מידע זה נדרש כדי לחזור אליכם ולספק
            את השירות.
          </p>

          <h2 className="mt-8 text-xl font-bold text-brand">השימוש במידע</h2>
          <ul className="mt-2 list-disc space-y-2 ps-6">
            <li>יצירת קשר ומענה לפנייתכם.</li>
            <li>מתן הצעת מחיר ותיאום השירות.</li>
            <li>שיפור השירות והמענה ללקוחות.</li>
          </ul>

          <h2 className="mt-8 text-xl font-bold text-brand">שמירת המידע והעברתו</h2>
          <p className="mt-2">
            איננו מעבירים את פרטיכם לצד שלישי לצרכים שיווקיים. מידע עשוי להישמר לצורך מתן השירות ובהתאם
            לדרישות הדין.
          </p>

          <h2 className="mt-8 text-xl font-bold text-brand">עוגיות וכלי ניתוח</h2>
          <p className="mt-2">
            ייתכן שהאתר עושה שימוש בעוגיות ובכלי ניתוח תנועה (כגון Google Analytics) לצורך הבנת אופן
            השימוש באתר ושיפורו. ניתן לחסום עוגיות דרך הגדרות הדפדפן.
          </p>

          <h2 className="mt-8 text-xl font-bold text-brand">זכויותיכם</h2>
          <p className="mt-2">
            אתם רשאים לפנות אלינו בכל עת בבקשה לעיין במידע שנמסר, לתקנו או לבקש את מחיקתו, בכפוף להוראות
            הדין.
          </p>

          <h2 className="mt-8 text-xl font-bold text-brand">יצירת קשר בנושא פרטיות</h2>
          <ul className="mt-2 space-y-1">
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

          <p className="mt-8 text-sm text-ink/55">
            מסמך זה הוא תבנית כללית ואינו מהווה ייעוץ משפטי. מומלץ להתאים אותו לפעילות העסק עם איש מקצוע.
          </p>
        </Container>
      </section>
    </>
  );
}
