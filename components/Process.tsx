import { PhoneCall, ScanLine, Target, FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Container from "./Container";
import SectionHeading from "./SectionHeading";

interface ProcessStep {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const steps: ProcessStep[] = [
  {
    icon: PhoneCall,
    title: "פנייה ותיאום מהיר",
    desc: "מתקשרים או שולחים וואטסאפ, מתארים את הבעיה, ואנחנו מתאמים הגעה בזמן שנוח לכם.",
  },
  {
    icon: ScanLine,
    title: "בדיקה תרמוגרפית בשטח",
    desc: "סורקים את האזורים החשודים במצלמה תרמית מקצועית ובאמצעי איתור משלימים.",
  },
  {
    icon: Target,
    title: "איתור מדויק של המקור",
    desc: "מזהים ומסמנים את נקודת הבעיה המדויקת — לא ניחוש, אלא ממצא ברור.",
  },
  {
    icon: FileText,
    title: "דו״ח, ממצאים וליווי",
    desc: "מקבלים דו״ח ברור עם תמונות והמלצה לתיקון, ואנחנו מלווים אתכם עד הפתרון.",
  },
];

export default function Process() {
  return (
    <section className="bg-paper py-16 md:py-20">
      <Container>
        <SectionHeading
          eyebrow="איך זה עובד"
          title="ארבעה צעדים פשוטים לפתרון"
          subtitle="תהליך מסודר ושקוף — מהשיחה הראשונה ועד הדו״ח הסופי."
        />
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="relative rounded-2xl border border-ink/10 bg-white p-6 shadow-sm"
              >
                <span className="absolute end-5 top-5 text-4xl font-extrabold text-brand/10">
                  {index + 1}
                </span>
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-accent/15 text-accent-strong">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-bold text-brand">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{step.desc}</p>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
