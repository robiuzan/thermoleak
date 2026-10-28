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
// One node for the founder, referenced from everywhere he appears. Without this, LocalBusiness.founder
// and each Article.author were separate anonymous Person objects, and nothing told an engine they
// were the same human being — the opposite of what an author-entity signal is for (finding SD-5).
// The anchor is real: app/about/page.tsx renders id="founder".
const founderId = `${site.domain}/about/#founder`;

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
    founder: { "@type": "Person", "@id": founderId, name: site.founder },
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
    // No inLanguage: schema.org does not define it on Service. It belongs on the creative works —
    // WebSite, the page nodes and Article — which is where it still is.
  };
}

// Service node for a location page. NOTE what this deliberately is NOT: a `LocalBusiness` per city.
// This business has NO premises at all, so one node is the honest count — a LocalBusiness per city
// implies premises that do not exist and is a recognised local-spam pattern (docs/schema-graph.md §5).
export function locationServiceJsonLd(location: {
  slug: string;
  name: string;
  kind: "city" | "region";
  prefixed: string;
  answer: { q: string; a: string };
}) {
  const url = canonicalUrl(`/locations/${location.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: `איתור נזילות ${location.prefixed}`,
    serviceType: "איתור נזילות",
    description: location.answer.a,
    url,
    provider: { "@id": businessId },
    // A region typed as a City is a factual error in the graph, which is why `kind` exists.
    areaServed: {
      "@type": location.kind === "region" ? "AdministrativeArea" : "City",
      name: location.name,
    },
    // No inLanguage — see serviceJsonLd above.
  };
}

// Returns null for an empty list, and <JsonLd> renders nothing for null. The guard is HERE, not at
// the five call sites, because the failure it prevents is a future one: a FAQPage with
// mainEntity: [] is an invalid node, and the next article added without a `faq` block — or the next
// city added without FAQs — would have emitted one silently from a caller that looked correct.
export function faqPageJsonLd(faqs: ServiceFaq[]) {
  if (faqs.length === 0) return null;
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
    // When the byline IS the founder, the author node carries his @id so it resolves to the same
    // Person as LocalBusiness.founder. A guest author gets a plain Person — correct, because they
    // are not that entity and must not inherit its authority.
    ...(article.author
      ? {
          author: {
            "@type": "Person",
            ...(article.author === site.founder ? { "@id": founderId } : {}),
            name: article.author,
          },
        }
      : {}),
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
