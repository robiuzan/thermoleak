import type { Metadata } from "next";
import { site } from "@/lib/site";
import PageHero from "@/components/PageHero";
import ContactCTA from "@/components/ContactCTA";
import Container from "@/components/Container";
import JsonLd from "@/components/JsonLd";
import { contactPageJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "צור קשר",
  description:
    "צרו קשר עם טרמוליק לאיתור נזילות, רטיבות ובדיקות תרמוגרפיה בגוש דן והמרכז. טלפון, וואטסאפ או טופס — מענה מהיר ושירות חירום.",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={contactPageJsonLd({
          path: "/contact",
          name: "צור קשר — טרמוליק",
          description: metadata.description as string,
        })}
      />
      <PageHero
        title="צרו איתנו קשר"
        subtitle="נשמח לעזור לכם לאתר את מקור הבעיה. זמינים בטלפון, בוואטסאפ ובטופס."
        crumbs={[
          { name: "בית", href: "/" },
          { name: "צור קשר", href: "/contact" },
        ]}
      />
      <ContactCTA />

      {/* Depth to the 200-word floor (backlog §3.3) with content that is genuinely useful at the
          moment of contact — what happens next, and what to have ready. */}
      <section className="border-t border-ink/10 py-14 md:py-16">
        <Container className="grid max-w-4xl gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-brand">מה קורה אחרי שפונים אלינו</h2>
            <ol className="mt-4 space-y-3">
              {[
                "אנחנו חוזרים אליכם בשעות הפעילות, ומבררים בקצרה מה קורה: איפה מופיע הכתם או הרטיבות, מתי הופיע, והאם הוא משתנה לפי שימוש.",
                "על בסיס התיאור נמסור מחיר מראש — לפני שקובעים ביקור, לא בסופו.",
                "מתאמים מועד שנוח לכם. לנזילה פעילה נשתדל להגיע באותו יום.",
                "בסיום הבדיקה תדעו מה נמצא ומה ההמלצה. דו״ח כתוב, כשנדרש, נמסר תוך מספר ימי עסקים.",
              ].map((step, index) => (
                <li key={step.slice(0, 20)} className="flex gap-3">
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-ink/80">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand">מה כדאי להכין מראש</h2>
            <ul className="mt-4 space-y-2">
              {[
                "מתי הבחנתם בבעיה לראשונה, והאם היא מחמירה.",
                "האם היא קשורה לשימוש מסוים — מקלחת, מכונת כביסה, גשם, הפעלת מזגן.",
                "האם כבר בוצע תיקון או פתיחת קיר באזור.",
                "גודל הנכס ומספר המקומות שבהם מופיעה הבעיה.",
                "תמונה של הכתם, אם יש — היא עוזרת לנו להעריך מראש.",
              ].map((item) => (
                <li key={item.slice(0, 20)} className="flex items-start gap-2 text-sm leading-relaxed text-ink/80">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-strong" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-xl border border-ink/10 bg-paper p-5">
              <p className="font-semibold text-brand">{site.emergencyNote}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{site.serviceAreaText}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{site.address.note}</p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
