import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Eye } from "lucide-react";
import { getService, services, serviceSlugs } from "@/lib/services";
import { site, telHref, canonicalUrl } from "@/lib/site";
import { serviceJsonLd, faqPageJsonLd } from "@/lib/jsonld";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import ContactCTA from "@/components/ContactCTA";
import JsonLd from "@/components/JsonLd";
import CtaButton from "@/components/CtaButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return {
    title: service.h1,
    description: service.summary,
    keywords: service.keywords,
    alternates: { canonical: `/services/${slug}/` },
    openGraph: {
      title: `${service.h1} | ${site.nameHe}`,
      description: service.summary,
      url: canonicalUrl(`/services/${slug}`),
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = services.filter((item) => item.slug !== service.slug);
  // The visible answer block is genuine on-page Q&A, so it legitimately joins the FAQPage graph.
  const faqEntities = [service.answer, ...service.faqs];

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
              <h2 className="text-xl font-bold text-brand">{service.answer.q}</h2>
              <p className="mt-3 leading-relaxed text-ink/80">{service.answer.a}</p>
            </div>

            <Image
              src={service.image}
              alt={service.h1}
              width={600}
              height={400}
              className="mb-8 h-auto w-full rounded-2xl border border-ink/10"
            />
            {service.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="mb-4 leading-relaxed text-ink/80">
                {paragraph}
              </p>
            ))}

            <h2 className="mt-8 text-xl font-bold text-brand">היתרונות עבורכם</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {service.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-2 rounded-xl border border-ink/10 bg-white p-4 text-sm text-ink/80"
                >
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent-strong" aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-xl font-bold text-brand">איך התהליך עובד</h2>
            <ol className="mt-4 space-y-4">
              {service.steps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-brand">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink/70">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Honest limits — deliberate positioning, not hedging (content-standards §7). */}
            <div className="mt-10 rounded-2xl border border-ink/10 bg-white p-6">
              <h2 className="flex items-center gap-2 text-xl font-bold text-brand">
                <Eye className="size-5 text-accent-strong" aria-hidden="true" />
                {service.limits.title}
              </h2>
              {service.limits.intro ? (
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{service.limits.intro}</p>
              ) : null}
              <ul className="mt-4 space-y-3">
                {service.limits.items.map((item) => (
                  <li key={item.slice(0, 24)} className="flex items-start gap-2 text-sm leading-relaxed text-ink/75">
                    <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-strong" />
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

            {/* Contextual cross-links with descriptive anchors (backlog §9.3). */}
            <p className="mt-8 leading-relaxed text-ink/80">
              {service.related.lead}{" "}
              {service.related.links.map((link, index) => (
                <span key={link.href}>
                  {index > 0 ? " · " : ""}
                  <Link href={link.href} className="font-semibold text-brand underline underline-offset-2">
                    {link.label}
                  </Link>
                </span>
              ))}
            </p>

            <h2 className="mt-10 text-xl font-bold text-brand">שאלות נפוצות על {service.title}</h2>
            <div className="mt-4 divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 bg-white">
              {service.faqs.map((faq) => (
                <details key={faq.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-base font-bold text-brand [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span className="text-accent-strong transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="px-5 pb-5 text-sm leading-relaxed text-ink/75">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Sticky sidebar: price + CTA */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-sm">
              <h2 className="text-lg font-bold text-brand">{service.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">{service.priceModel}</p>
              <div className="mt-5 flex flex-col gap-3">
                <CtaButton href={telHref} variant="accent" size="lg" dataCta="service-call">
                  חייגו עכשיו
                </CtaButton>
                <CtaButton href="#contact" variant="outline" size="lg" dataCta="service-form">
                  השארת פרטים
                </CtaButton>
              </div>
              <p className="mt-4 text-center text-sm font-semibold text-brand">{site.guarantee}</p>
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
                  <span className="flex-1 font-bold text-brand">{item.title}</span>
                  <ArrowLeft className="size-4 text-accent-strong transition-all group-hover:-translate-x-1" aria-hidden="true" />
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
