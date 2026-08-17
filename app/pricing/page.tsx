import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Wallet } from "lucide-react";
import { services } from "@/lib/services";
import { pricing } from "@/lib/pricing";
import { site, telHref, whatsappHref, defaultWhatsappMessage } from "@/lib/site";
import { faqPageJsonLd } from "@/lib/jsonld";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import CtaButton from "@/components/CtaButton";
import ContactCTA from "@/components/ContactCTA";
import JsonLd from "@/components/JsonLd";
import WhatsappIcon from "@/components/WhatsappIcon";

export const metadata: Metadata = {
  title: "מחירון איתור נזילות",
  description:
    `כמה עולה איתור נזילות? ביקור איתור החל מ-₪${site.priceFrom}, מחיר סופי שקוף שנמסר מראש לפי גודל הנכס והיקף הבדיקה. כל המחירים וההסברים — בעמוד אחד.`,
  alternates: { canonical: "/pricing/" },
};

export default function PricingPage() {
  const faqEntities = [pricing.answer, ...pricing.faqs];

  return (
    <>
      <JsonLd data={faqPageJsonLd(faqEntities)} />

      <PageHero
        title={pricing.title}
        subtitle={pricing.subtitle}
        crumbs={[
          { name: "בית", href: "/" },
          { name: "מחירון", href: "/pricing" },
        ]}
      />

      <section className="py-14 md:py-20">
        <Container className="max-w-4xl">
          {/* The AEO answer block — also part of this page's FAQPage graph. */}
          <div className="rounded-2xl border-s-4 border-brand bg-paper p-6">
            <h2 className="text-xl font-bold text-brand">{pricing.answer.q}</h2>
            <p className="mt-3 leading-relaxed text-ink/80">{pricing.answer.a}</p>
          </div>

          <h2 className="mt-12 text-2xl font-extrabold text-brand">{pricing.ratesHeading}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.slug}
                  className="flex flex-col rounded-2xl border border-ink/10 bg-white p-6 shadow-sm"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-brand">{service.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/75">{service.priceModel}</p>
                  <Link
                    href={`/services/${service.slug}/`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand underline underline-offset-2"
                  >
                    על השירות
                    <ArrowLeft className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              );
            })}
          </div>

          <h2 className="mt-12 flex items-center gap-2 text-2xl font-extrabold text-brand">
            <Wallet className="size-6 text-accent-strong" aria-hidden="true" />
            {pricing.factors.title}
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {pricing.factors.items.map((factor) => (
              <li key={factor.title} className="rounded-xl border border-ink/10 bg-white p-5">
                <h3 className="font-bold text-brand">{factor.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/70">{factor.desc}</p>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-2xl bg-brand p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <p className="text-lg font-bold">רוצים מחיר מדויק לנכס שלכם?</p>
              <p className="mt-1 text-sm text-white/80">
                תארו לנו את הבעיה בטלפון או בוואטסאפ — ותקבלו מחיר מראש. {site.guarantee}.
              </p>
            </div>
            <div className="mt-4 flex shrink-0 flex-col gap-3 sm:mt-0 sm:flex-row">
              <CtaButton href={telHref} variant="accent" dataCta="pricing-call">
                חייגו: {site.phone.display}
              </CtaButton>
              <CtaButton
                href={whatsappHref(defaultWhatsappMessage)}
                variant="whatsapp"
                dataCta="pricing-whatsapp"
              >
                <WhatsappIcon className="size-4" />
                וואטסאפ
              </CtaButton>
            </div>
          </div>

          <h2 className="mt-12 text-2xl font-extrabold text-brand">שאלות על מחיר</h2>
          <div className="mt-6 divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 bg-white">
            {pricing.faqs.map((faq) => (
              <details key={faq.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-base font-bold text-brand [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span className="text-accent-strong transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-ink/75">{faq.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
