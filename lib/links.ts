// Cross-file links and their build-time checks — the hub-and-spoke edges between services, guides and
// city pages (docs/seo-geo-aeo-strategy.md §2).
//
// WHY A FILE OF ITS OWN: lib/services.ts, lib/articles.ts and lib/locations.ts never import each other,
// so no cycle can form and no content file drags another into a bundle. This module imports all three
// and is imported ONLY by server routes (app/**/page.tsx) — never by a client component.
//
// The checks run at module scope, so every build that renders a service, guide or hub page fails on a
// bad link instead of shipping it: an unknown slug, a missing trailing slash, a route that does not
// exist. The same pattern as the `nearby` check at the bottom of lib/locations.ts.
import {
  site,
  staticRoutes,
  withTrailingSlash,
  type LinkedText,
  type NavLink,
} from "./site";
import {
  services,
  getService,
  methodExplainer,
  servicePillars,
  type Service,
} from "./services";
import { servicesHub } from "./hubs";
import { articles, getArticle, type Article } from "./articles";
import {
  locations,
  getLocation,
  locationTitle,
  type Location,
} from "./locations";

function fail(message: string): never {
  throw new Error(`lib/links.ts: ${message}`);
}

/** Every internal href a link in lib/ may point at — trailing slash included, plus the /pricing/
 * anchors that exist (app/pricing/page.tsx renders those ids). */
export const knownRoutes: ReadonlySet<string> = new Set([
  ...staticRoutes.map((route) => withTrailingSlash(route.path)),
  "/pricing/#guarantee",
  "/pricing/#visit-scope",
  "/pricing/#price-factors",
  ...services.map((service) => `/services/${service.slug}/`),
  ...articles.map((article) => `/guides/${article.slug}/`),
  ...locations.map((location) => `/locations/${location.slug}/`),
]);

/** Check one link list; `where` names the owner in the error. */
export function checkLinks(where: string, links: readonly NavLink[]): void {
  for (const link of links) {
    if (!knownRoutes.has(link.href)) {
      fail(
        `${where} links to '${link.href}' — not a route of this site, or missing its trailing slash.`,
      );
    }
  }
}

const guideHref = (article: Article) => `/guides/${article.slug}/`;
const serviceHref = (service: Service) => `/services/${service.slug}/`;
const cityHref = (location: Location) => `/locations/${location.slug}/`;

/** The services a guide hands its reader to — its `relatedServices`, resolved. */
export function servicesOfArticle(article: Article): NavLink[] {
  return article.relatedServices.map((slug) => {
    const service =
      getService(slug) ??
      fail(`guide '${article.slug}' lists relatedServices '${slug}', which is not a service.`);
    return { href: serviceHref(service), label: service.title };
  });
}

/** One guide as a link, under its own title — fails the build if the guide does not exist. */
export function guideLink(slug: string): NavLink {
  const article =
    getArticle(slug) ?? fail(`a page links to guide '${slug}', which is not a guide.`);
  return { href: guideHref(article), label: article.title };
}

/** The guides a service page features (its explicit `featuredGuides`, in order). */
export function guidesOf(service: Service): NavLink[] {
  return service.featuredGuides.map((slug) => {
    const article =
      getArticle(slug) ??
      fail(`service '${service.slug}' features guide '${slug}', which is not a guide.`);
    return { href: guideHref(article), label: article.title };
  });
}

/** Every city page under its own title — the hub's and the water/moisture pages' city grid. */
export function allCityLinks(): NavLink[] {
  return locations.map((location) => ({
    href: cityHref(location),
    label: locationTitle(location),
  }));
}

const linksIn = (text: LinkedText): NavLink[] =>
  text.filter((part): part is NavLink => typeof part !== "string");

/** The city links a service page carries: all twelve under the city page's own title as the
 * anchor, or a chosen few under a descriptive anchor (a place inside that city). */
export function cityLinksOf(service: Service): NavLink[] {
  const spec = service.cityLinks;
  if (!spec) return [];
  if (spec.mode === "all") return allCityLinks();
  return spec.places.map(({ place, city }) => {
    const location =
      getLocation(city) ??
      fail(`service '${service.slug}' links to city '${city}', which is not a location.`);
    return { href: cityHref(location), label: `${place} ${location.prefixed}` };
  });
}

// --- build-time checks --------------------------------------------------------------------------

for (const service of services) {
  checkLinks(`service '${service.slug}' related`, service.related.links);
  checkLinks(`service '${service.slug}' priceLink`, [service.priceLink]);
  guidesOf(service);
  cityLinksOf(service);
}

// The hub and homepage link blocks.
checkLinks("servicesHub.intro", linksIn(servicesHub.intro));
checkLinks("servicesHub.more", linksIn(servicesHub.more));
checkLinks("methodExplainer.more", methodExplainer.more.links);
checkLinks("servicePillars.areas", servicePillars.areas.links);

// Copy that states how many city pages exist must say the real number.
for (const [where, text] of [
  ["servicesHub.cities.lead", servicesHub.cities.lead],
  ["servicePillars.areas.lead", servicePillars.areas.lead],
] as const) {
  if (!text.includes(`${locations.length} ערים`)) {
    fail(`${where} must name the number of city pages (${locations.length}).`);
  }
}

// LOC-11: each city's schema name is exactly one site.serviceAreas entry, one to one.
const schemaNames = locations.map((l) => l.areaServedName ?? l.name);
for (const name of schemaNames) {
  if (!site.serviceAreas.includes(name)) {
    fail(`the city schema name '${name}' is not in site.serviceAreas — set its areaServedName.`);
  }
}
if (new Set(schemaNames).size !== site.serviceAreas.length) {
  fail("lib/locations.ts and site.serviceAreas must name the same cities, one to one.");
}

for (const article of articles) {
  servicesOfArticle(article);
  for (const block of article.blocks) {
    if (block.kind === "related") {
      checkLinks(`guide '${article.slug}' related block`, block.links);
    }
  }
}
