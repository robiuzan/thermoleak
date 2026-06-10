import type { Metadata } from "next";
import { ShieldCheck, Target, Wallet, Sparkles, BadgeCheck } from "lucide-react";
import { site } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import TrustBar from "@/components/TrustBar";
import ContactCTA from "@/components/ContactCTA";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "אודות תרמולק — מומחים לאיתור נזילות תרמי",
  description:
    "מעל עשור של ניסיון באיתור נזילות ורטיבות במצלמה תרמית. הכירו את הערכים, השיטה והמומחיות של תרמולק — דיוק, שקיפות וללא הרס.",
  alternates: { canonical: "/about" },
};

const story = [
  "תרמולק הוקמה מתוך אמונה פשוטה: אפשר לאתר נזילות ורטיבות בצורה מדויקת — בלי לשבור חצי בית בדרך. כבר מעל עשור אנחנו עושים בדיוק את זה, עם מצלמות תרמיות מקצועיות וניסיון של אלפי בדיקות.",
  "כל בדיקה אצלנו מתחילה בהקשבה ללקוח ומסתיימת בממצא ברור ובדו״ח מסודר. אנחנו מאמינים בשקיפות מלאה במחירים, בעבודה נקייה ובליווי עד לפתרון — לא רק באיתור הבעיה.",
  "אנחנו נותנים שירות לבעלי בתים, ועדי בית, עסקים, מנהלי נכסים ושמאי ביטוח בכל גוש דן והמרכז, עם זמינות מהירה גם למקרי חירום.",
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
        data={breadcrumbJsonLd([
          { name: "בית", url: "/" },
          { name: "אודות", url: "/about" },
        ])}
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

      <section className="py-16 md:py-20">
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
