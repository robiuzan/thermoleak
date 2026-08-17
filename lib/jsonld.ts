// Structured data (JSON-LD) builders. Injected via the <JsonLd> component.
//
// Gating rules (docs/schema-graph.md §4): `aggregateRating`/`Review` ship ONLY with real,
// publicly verifiable reviews — the fabricated 4.9/6 rating was removed 2026-08-17 and must not
// return without a source. `sameAs` ships only with real profile URLs. `geo` ships only with the
// real operating base, never a city-centre placeholder. All three are blocked on
// docs/business-facts.md §B/§E.
import { site, canonicalUrl } from "./site";
import type { Service, ServiceFaq } from "./services";

const businessId = `${site.domain}/#business`;

// LocalBusiness — injected globally in the root layout.
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": businessId,
    name: site.nameHe,
    alternateName: site.name,
    description: site.description,
    url: canonicalUrl("/"),
    telephone: site.phone.tel,
    email: site.email,
    image: `${site.domain}/icon.svg`,
    logo: `${site.domain}/icon.svg`,
    priceRange: "₪₪",
    foundingDate: String(site.founded),
    address: {
      "@type": "PostalAddress",
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    areaServed: site.serviceAreas.map((name) => ({ "@type": "City", name })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Friday",
        opens: "08:00",
        closes: "13:00",
      },
    ],
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.domain}/#website`,
    name: site.nameHe,
    url: canonicalUrl("/"),
    inLanguage: "he-IL",
    publisher: { "@id": businessId },
  };
}

export function serviceJsonLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${canonicalUrl(`/services/${service.slug}`)}#service`,
    name: service.title,
    serviceType: service.h1,
    description: service.summary,
    url: canonicalUrl(`/services/${service.slug}`),
    provider: { "@id": businessId },
    areaServed: { "@type": "AdministrativeArea", name: site.address.region },
    inLanguage: "he-IL",
  };
}

export function faqPageJsonLd(faqs: ServiceFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

export interface Crumb {
  name: string;
  url: string;
}

export function breadcrumbJsonLd(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.url),
    })),
  };
}
