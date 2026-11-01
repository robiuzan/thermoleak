import type { MetadataRoute } from "next";
import { canonicalUrl, staticRoutes } from "@/lib/site";
import { services } from "@/lib/services";
import { articles } from "@/lib/articles";
import { locations } from "@/lib/locations";

// Required for `output: "export"` — emit a static sitemap.xml at build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: canonicalUrl(route.path),
    lastModified: route.lastModified,
    changeFrequency: route.freq,
    priority: route.priority,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: canonicalUrl(`/services/${service.slug}`),
    lastModified: service.lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Articles carry their own real dateModified — the whole point of §1.3.
  const guideEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: canonicalUrl(`/guides/${article.slug}`),
    lastModified: article.dateModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const locationEntries: MetadataRoute.Sitemap = locations.map((location) => ({
    url: canonicalUrl(`/locations/${location.slug}`),
    lastModified: location.lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticEntries,
    ...serviceEntries,
    ...guideEntries,
    ...locationEntries,
  ];
}
