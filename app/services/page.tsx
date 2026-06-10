import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import Process from "@/components/Process";
import ContactCTA from "@/components/ContactCTA";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "שירותים — איתור נזילות, רטיבות ותרמוגרפיה",
  description:
    "השירותים של תרמולק: איתור נזילות מים, איתור רטיבות ובידוד, בדיקת לוחות חשמל ודו״ח תרמוגרפי לחברות ביטוח. הכול במצלמה תרמית, ללא הרס.",
  alternates: { canonical: "/services/" },
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "בית", url: "/" },
          { name: "שירותים", url: "/services" },
        ])}
      />
      <PageHero
        title="השירותים שלנו"
        subtitle="פתרונות איתור תרמי מקיפים לבית, לעסק ולחברות הביטוח — מדויקים, מהירים וללא הרס מיותר."
        crumbs={[
          { name: "בית", href: "/" },
          { name: "שירותים", href: "/services" },
        ]}
      />

      <section className="py-16 md:py-20">
        <Container>
          <div className="grid gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article
                  key={service.slug}
                  className="grid gap-6 rounded-2xl border border-ink/10 bg-white p-6 shadow-sm md:grid-cols-[auto_1fr_auto] md:items-center md:p-8"
                >
                  <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                    <Icon className="size-7" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-brand">{service.title}</h2>
                    <p className="mt-1 text-sm leading-relaxed text-ink/70">{service.summary}</p>
                    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                      {service.benefits.slice(0, 3).map((benefit) => (
                        <li key={benefit} className="flex items-center gap-1.5 text-sm text-ink/75">
                          <CheckCircle2 className="size-4 shrink-0 text-accent-strong" aria-hidden="true" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center justify-center gap-1 rounded-xl border-2 border-brand px-5 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
                  >
                    פרטים נוספים
                    <ArrowLeft className="size-4" aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>

          <p className="mt-10 text-center text-ink/70">
            לא בטוחים איזה שירות מתאים לכם? התקשרו {site.phone.display} ונשמח להכווין.
          </p>
        </Container>
      </section>

      <Process />
      <ContactCTA />
    </>
  );
}
