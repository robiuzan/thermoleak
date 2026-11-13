import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { services } from "@/lib/services";
import { servicesHub } from "@/lib/hubs";
import { allCityLinks } from "@/lib/links";
import { site, pageOpenGraph } from "@/lib/site";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import Process from "@/components/Process";
import ContactCTA from "@/components/ContactCTA";
import FieldStrip from "@/components/FieldStrip";
import JsonLd from "@/components/JsonLd";
import LinkedText from "@/components/LinkedText";
import CityChips from "@/components/CityChips";
import TrustRow from "@/components/TrustRow";
import { collectionPageJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: servicesHub.title,
  description: servicesHub.description,
  alternates: { canonical: "/services/" },
  ...pageOpenGraph({
    path: "/services",
    title: `${servicesHub.title} | ${site.nameHe}`,
    description: servicesHub.description,
  }),
};

// The parent hub: prose that links down to all four services, the twelve city pages, /pricing/ and
// /guides/ with descriptive anchors (backlog §9.4, LOC-2), then the cards. The H1 stays the short label.
export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={collectionPageJsonLd({
          path: "/services",
          name: "השירותים של טרמוליק",
          description: servicesHub.description,
        })}
      />
      <PageHero
        title="השירותים שלנו"
        subtitle={servicesHub.subtitle}
        crumbs={[
          { name: "בית", href: "/" },
          { name: "שירותים", href: "/services" },
        ]}
      />

      <section className="py-16 md:py-20">
        <Container>
          <div className="mx-auto mb-10 max-w-4xl">
            <TrustRow className="mb-6" />
            <LinkedText text={servicesHub.intro} />
          </div>
          <FieldStrip
            route="/services/"
            cols={2}
            className="mx-auto mb-10 max-w-4xl"
          />
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
                    <h2 className="text-xl font-bold text-brand">
                      {service.title}
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-ink/70">
                      {service.summary}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                      {service.benefits.slice(0, 3).map((benefit) => (
                        <li
                          key={benefit}
                          className="flex items-center gap-1.5 text-sm text-ink/75"
                        >
                          <CheckCircle2
                            className="size-4 shrink-0 text-accent-strong"
                            aria-hidden="true"
                          />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* A descriptive anchor — the service page's own H1 — instead of «פרטים נוספים». */}
                  <Link
                    href={`/services/${service.slug}/`}
                    className="inline-flex items-center justify-center gap-1 rounded-xl border-2 border-brand px-5 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
                  >
                    {service.h1}
                    <ArrowLeft className="size-4 shrink-0" aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>

          <div className="mx-auto mt-12 max-w-4xl">
            <LinkedText text={servicesHub.more} />
            <CityChips
              title={servicesHub.cities.title}
              lead={servicesHub.cities.lead}
              links={allCityLinks()}
              className="mt-8"
            />
          </div>

          <p className="mt-10 text-center text-ink/70">
            לא בטוחים איזה שירות מתאים לכם? התקשרו{" "}
            <span dir="ltr" className="whitespace-nowrap">
              {site.phone.display}
            </span>{" "}
            ונשמח להכווין.
          </p>
        </Container>
      </section>

      <Process />
      <ContactCTA />
    </>
  );
}
