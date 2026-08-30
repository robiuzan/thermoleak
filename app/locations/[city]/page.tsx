import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { getLocation, locationSlugs, locations } from "@/lib/locations";
import { services } from "@/lib/services";
import { site, canonicalUrl } from "@/lib/site";
import { locationServiceJsonLd, faqPageJsonLd } from "@/lib/jsonld";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import ContactCTA from "@/components/ContactCTA";
import JsonLd from "@/components/JsonLd";

interface PageProps {
  params: Promise<{ city: string }>;
}

export function generateStaticParams(): { city: string }[] {
  return locationSlugs.map((city) => ({ city }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const location = getLocation(city);
  if (!location) return {};

  // Title formula per docs/keyword-map.md §3 — bare subject, the layout template appends the brand.
  return {
    title: `איתור נזילות ${location.prefixed}`,
    description: `${location.answer.slice(0, 155)}`,
    alternates: { canonical: `/locations/${city}/` },
    openGraph: {
      title: `איתור נזילות ${location.prefixed} | ${site.nameHe}`,
      description: location.answer,
      url: canonicalUrl(`/locations/${city}`),
    },
  };
}

export default async function LocationPage({ params }: PageProps) {
  const { city } = await params;
  const location = getLocation(city);
  if (!location) notFound();

  const nearby = location.nearby
    .map((slug) => locations.find((l) => l.slug === slug))
    .filter((l) => l !== undefined);

  return (
    <>
      <JsonLd data={locationServiceJsonLd(location)} />
      {location.faqs.length > 0 ? <JsonLd data={faqPageJsonLd(location.faqs)} /> : null}

      <PageHero
        title={`איתור נזילות ${location.prefixed}`}
        subtitle={`שירות עד בית הלקוח ${location.prefixed} — אבחון תרמי ללא הרס.`}
        crumbs={[
          { name: "בית", href: "/" },
          { name: "אזורי שירות", href: "/locations" },
          { name: location.name, href: `/locations/${location.slug}` },
        ]}
      />

      <section className="py-14 md:py-20">
        <Container className="max-w-3xl">
          {/* AEO answer block first in the DOM — docs/content-standards.md §5. */}
          <div className="rounded-2xl border-s-4 border-brand bg-paper p-6">
            <h2 className="text-xl font-bold text-brand">
              מבצעים איתור נזילות {location.prefixed}?
            </h2>
            <p className="mt-3 leading-relaxed text-ink/80">{location.answer}</p>
          </div>

          {location.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mt-6 leading-relaxed text-ink/80">
              {paragraph}
            </p>
          ))}

          {/* The local substance. This block is what separates a real location page from a doorway
              page — every item must be true and specific to this city. */}
          <h2 className="mt-10 flex items-center gap-2 text-xl font-bold text-brand">
            <MapPin className="size-5 text-accent-strong" aria-hidden="true" />
            מה מאפיין נכסים {location.prefixed}
          </h2>
          <ul className="mt-4 space-y-3">
            {location.claims.map((claim) => (
              <li
                key={claim.text.slice(0, 32)}
                className="flex items-start gap-2 leading-relaxed text-ink/80"
              >
                <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent-strong" />
                {claim.text}
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-xl border border-ink/10 bg-white p-5">
            <h2 className="font-bold text-brand">זמינות והגעה</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">{location.travel}</p>
          </div>

          <h2 className="mt-10 text-xl font-bold text-brand">השירותים שאנחנו נותנים {location.prefixed}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}/`}
                  className="group flex h-full items-center gap-3 rounded-xl border border-ink/10 bg-white p-4 transition hover:border-brand/30"
                >
                  <span className="flex-1 font-semibold text-brand">{service.title}</span>
                  <ArrowLeft
                    className="size-4 shrink-0 text-accent-strong transition-transform group-hover:-translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>

          {location.faqs.length > 0 ? (
            <>
              <h2 className="mt-10 text-xl font-bold text-brand">
                שאלות נפוצות — {location.name}
              </h2>
              <div className="mt-4 divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 bg-white">
                {location.faqs.map((faq) => (
                  <details key={faq.q} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-base font-bold text-brand [&::-webkit-details-marker]:hidden">
                      {faq.q}
                      <span className="text-accent-strong transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="px-5 pb-5 text-sm leading-relaxed text-ink/75">{faq.a}</p>
                  </details>
                ))}
              </div>
            </>
          ) : null}

          {nearby.length > 0 ? (
            <div className="mt-10 border-t border-ink/10 pt-8">
              <h2 className="text-lg font-bold text-brand">אזורים סמוכים</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {nearby.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/locations/${other.slug}/`}
                      className="inline-block rounded-full border border-ink/15 px-4 py-1.5 text-sm font-semibold text-brand transition hover:border-brand/40 hover:bg-brand/5"
                    >
                      {other.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
