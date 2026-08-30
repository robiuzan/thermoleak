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
    founder: { "@type": "Person", "@id": `${site.domain}/about/#founder`, name: site.founder },
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

// Page-type nodes (docs/schema-graph.md §2). Each ties the page to the business node so the graph
// is connected rather than a set of orphans. `Offer`/`PriceSpecification` is deliberately NOT here:
// it is blocked on price confirmation (docs/business-facts.md §C) and must never ship a guessed
// value.
interface PageNodeOptions {
  path: string;
  name: string;
  description: string;
}

function pageNode(type: string, { path, name, description }: PageNodeOptions) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${canonicalUrl(path)}#page`,
    url: canonicalUrl(path),
    name,
    description,
    inLanguage: "he-IL",
    isPartOf: { "@id": `${site.domain}/#website` },
    about: { "@id": businessId },
  };
}

export function aboutPageJsonLd(options: PageNodeOptions) {
  return pageNode("AboutPage", options);
}

export function contactPageJsonLd(options: PageNodeOptions) {
  return pageNode("ContactPage", options);
}

export function collectionPageJsonLd(options: PageNodeOptions) {
  return pageNode("CollectionPage", options);
}

// Article for /guides/{slug}/. `author` is omitted entirely when no real person is on file —
// docs/business-facts.md §A. An absent author costs an Article rich result; an INVENTED one is a
// fabricated E-E-A-T signal, which this project has already paid for once. Absent wins.
export function articleJsonLd(article: {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author?: string;
}) {
  const url = canonicalUrl(`/guides/${article.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.description,
    url,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    inLanguage: "he-IL",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    publisher: { "@id": businessId },
    ...(article.author ? { author: { "@type": "Person", name: article.author } } : {}),
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
