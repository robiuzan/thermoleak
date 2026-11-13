import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Eye } from "lucide-react";
import { getService, services, serviceSlugs } from "@/lib/services";
import { site, telHref, pageOpenGraph } from "@/lib/site";
import { imageFor, leadSlotOf } from "@/lib/images";
import { cityLinksOf, guidesOf } from "@/lib/links";
import { serviceJsonLd, faqPageJsonLd } from "@/lib/jsonld";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import ContactCTA from "@/components/ContactCTA";
import JsonLd from "@/components/JsonLd";
import CtaButton from "@/components/CtaButton";
import Figure from "@/components/Figure";
import LinkLead from "@/components/LinkLead";
import CityChips from "@/components/CityChips";
import TrustRow from "@/components/TrustRow";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  // metaDescription, not `summary`: the summary is an 85–92-character card blurb with no call to
  // action, and it was doing both jobs (finding SEO-03, docs/keyword-map.md §5).
  return {
    title: service.h1,
    description: service.metaDescription,
    keywords: service.keywords,
    alternates: { canonical: `/services/${slug}/` },
    ...pageOpenGraph({
      path: `/services/${slug}`,
      title: `${service.h1} | ${site.nameHe}`,
      description: service.metaDescription,
    }),
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = services.filter((item) => item.slug !== service.slug);
  // The visible answer block is genuine on-page Q&A, so it legitimately joins the FAQPage graph.
  const faqEntities = [service.answer, ...service.faqs];
  // The hub-and-spoke edges (LOC-2 and service → guide), resolved and checked in lib/links.ts.
  const guides = guidesOf(service);
  const cityLinks = cityLinksOf(service);

  const route = `/services/${service.slug}/`;
  const mainImage = imageFor(route, "main");
  const detailImage = imageFor(route, "detail");
  const workImage = imageFor(route, "work");
  const eager = leadSlotOf(route, ["main", "detail", "work"]);

  return (
    <>
      <JsonLd data={serviceJsonLd(service)} />
      <JsonLd data={faqPageJsonLd(faqEntities)} />

      <PageHero
        title={service.h1}
        subtitle={service.tagline}
        crumbs={[
          { name: "בית", href: "/" },
          { name: "שירותים", href: "/services" },
          { name: service.title, href: `/services/${service.slug}` },
        ]}
      />

      <section className="py-14 md:py-20">
        <Container className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* The AEO answer block: question-form heading, complete in the first sentence,
                extractable as-is (docs/content-standards.md §5). Keep it first in the DOM. */}
            <div className="mb-8 rounded-2xl border-s-4 border-brand bg-paper p-6">
              <h2 className="text-xl font-bold text-brand">
                {service.answer.q}
              </h2>
              <p className="mt-3 leading-relaxed text-ink/80">
                {service.answer.a}
              </p>
            </div>

            {/* Confirmed facts near the top (the framework's trust signals) — never the guarantee,
                never a credential that is not on file (components/TrustRow.tsx). */}
            <TrustRow className="mb-8" />

            {/* The manifest's `main`, directly under the answer block. Until one is approved the
                decorative illustration stands in: it sits under an H1 that already states the
                service name, and `alt={service.h1}` made a screen reader announce the heading
                twice (backlog §11.5), so an empty alt is the correct choice for an image carrying no
                information the surrounding text lacks. */}
            {mainImage ? (
              <Figure
                image={mainImage}
                priority={eager === "main"}
                className="mb-8"
              />
            ) : (
              <Image
                src={service.image}
                alt=""
                width={600}
                height={400}
                className="mb-8 h-auto w-full rounded-2xl border border-ink/10"
              />
            )}
            {service.intro.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="mb-4 leading-relaxed text-ink/80"
              >
                {paragraph}
              </p>
            ))}

            <h2 className="mt-8 text-xl font-bold text-brand">
              היתרונות עבורכם
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {service.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-2 rounded-xl border border-ink/10 bg-white p-4 text-sm text-ink/80"
                >
                  <CheckCircle2
                    className="mt-0.5 size-5 shrink-0 text-accent-strong"
                    aria-hidden="true"
                  />
                  {benefit}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-xl font-bold text-brand">
              איך התהליך עובד
            </h2>
            <ol className="mt-4 space-y-4">
              {service.steps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-brand">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink/70">
                      {step.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            {detailImage ? (
              <Figure
                image={detailImage}
                priority={eager === "detail"}
                className="mt-8"
              />
            ) : null}

            {/* Honest limits — deliberate positioning, not hedging (content-standards §7). */}
            <div className="mt-10 rounded-2xl border border-ink/10 bg-white p-6">
              <h2 className="flex items-center gap-2 text-xl font-bold text-brand">
                <Eye className="size-5 text-accent-strong" aria-hidden="true" />
                {service.limits.title}
              </h2>
              {service.limits.intro ? (
                <p className="mt-3 text-sm leading-relaxed text-ink/75">
                  {service.limits.intro}
                </p>
              ) : null}
              <ul className="mt-4 space-y-3">
                {service.limits.items.map((item) => (
                  <li
                    key={item.slice(0, 24)}
                    className="flex items-start gap-2 text-sm leading-relaxed text-ink/75"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-strong"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              {service.limits.outro ? (
                <p className="mt-4 text-sm font-semibold leading-relaxed text-brand">
                  {service.limits.outro}
                </p>
              ) : null}
            </div>

            {/* "What to check before you book" — the buyer's guide, specific to this service. */}
            <section
              aria-labelledby={`checklist-${service.slug}`}
              className="mt-10 rounded-2xl border border-ink/10 bg-paper p-6"
            >
              <h2
                id={`checklist-${service.slug}`}
                className="text-xl font-bold text-brand"
              >
                {service.checklist.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {service.checklist.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm leading-relaxed text-ink/80"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-5 shrink-0 text-accent-strong"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {workImage ? (
              <Figure
                image={workImage}
                priority={eager === "work"}
                className="mt-8"
              />
            ) : null}

            {/* Contextual cross-links with descriptive anchors (backlog §9.3). */}
            <LinkLead
              lead={service.related.lead}
              links={service.related.links}
              className="mt-8"
            />

            {/* A few chosen city pages, as a sentence (the panel service: the three cities whose own
                pages discuss panel scans). */}
            {service.cityLinks?.mode === "places" ? (
              <LinkLead
                lead={service.cityLinks.lead}
                links={cityLinks}
                className="mt-4"
              />
            ) : null}

            {service.guides && guides.length > 0 ? (
              <div className="mt-10">
                <h2 className="text-xl font-bold text-brand">
                  {service.guides.title}
                </h2>
                <LinkLead
                  lead={service.guides.lead}
                  links={guides}
                  className="mt-3"
                />
              </div>
            ) : null}

            <h2 className="mt-10 text-xl font-bold text-brand">
              שאלות נפוצות על {service.title}
            </h2>
            <div className="mt-4 divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 bg-white">
              {service.faqs.map((faq) => (
                <details key={faq.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-base font-bold text-brand [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span className="text-accent-strong transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="px-5 pb-5 text-sm leading-relaxed text-ink/75">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>

            {/* Every city page, under its own title as the anchor — the descriptive inbound edge
                the location silo was missing (LOC-2). */}
            {service.cityLinks?.mode === "all" ? (
              <CityChips
                title={service.cityLinks.title}
                titleClassName="text-xl font-bold text-brand"
                lead={service.cityLinks.lead}
                links={cityLinks}
                className="mt-10"
              />
            ) : null}
          </div>

          {/* Sticky sidebar: price + CTA */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-sm">
              <h2 className="text-lg font-bold text-brand">{service.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">
                {service.priceModel}
              </p>
              <p className="mt-1 text-sm">
                <Link
                  href={service.priceLink.href}
                  className="inline-flex min-h-11 items-center font-semibold text-brand underline underline-offset-2"
                >
                  {service.priceLink.label}
                </Link>
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <CtaButton
                  href={telHref}
                  variant="accent"
                  size="lg"
                  dataCta="service-call"
                >
                  חייגו עכשיו
                </CtaButton>
                <CtaButton
                  href="#contact"
                  variant="outline"
                  size="lg"
                  dataCta="service-form"
                >
                  השארת פרטים
                </CtaButton>
              </div>
              {/* The sidebar states the promise beside the price, which is exactly where a visitor
                  asks what it covers — and no service page linked to /pricing/ at all (cro-4). */}
              <p className="mt-4 text-center text-sm font-semibold text-brand">
                <Link
                  href="/pricing/#guarantee"
                  className="underline underline-offset-2"
                >
                  {site.guarantee}
                </Link>
              </p>
            </div>
          </aside>
        </Container>
      </section>

      {/* Related services */}
      <section className="bg-paper py-14 md:py-16">
        <Container>
          <h2 className="text-xl font-bold text-brand">שירותים נוספים</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {related.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.slug}
                  href={`/services/${item.slug}/`}
                  className="group flex items-center gap-3 rounded-2xl border border-ink/10 bg-white p-5 transition hover:border-brand/30 hover:shadow-md"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="flex-1 font-bold text-brand">
                    {item.title}
                  </span>
                  <ArrowLeft
                    className="size-4 text-accent-strong transition-all group-hover:-translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
