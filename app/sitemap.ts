import type { MetadataRoute } from "next";
import { canonicalUrl } from "@/lib/site";
import { serviceSlugs } from "@/lib/services";
import { articles } from "@/lib/articles";
import { locations } from "@/lib/locations";

// Required for `output: "export"` — emit a static sitemap.xml at build time.
export const dynamic = "force-static";

// Per-route content dates. Update a route's date when its CONTENT meaningfully changes —
// the previous `new Date()` stamped build time on every URL, telling search engines the whole
// site changed on every deploy, which made the signal worthless (backlog §1.3).
// /thank-you/ is deliberately absent: it is noindex (see app/thank-you/page.tsx).
const staticRoutes: {
  path: string;
  lastModified: string;
  priority: number;
  freq: "weekly" | "monthly" | "yearly";
}[] = [
  { path: "", lastModified: "2026-08-17", priority: 1, freq: "weekly" },
  { path: "/services", lastModified: "2026-08-17", priority: 0.9, freq: "monthly" },
  { path: "/pricing", lastModified: "2026-08-17", priority: 0.9, freq: "monthly" },
  { path: "/guides", lastModified: "2026-08-24", priority: 0.8, freq: "weekly" },
  { path: "/about", lastModified: "2026-08-17", priority: 0.7, freq: "monthly" },
  { path: "/contact", lastModified: "2026-08-17", priority: 0.8, freq: "monthly" },
  { path: "/accessibility", lastModified: "2026-08-02", priority: 0.3, freq: "yearly" },
  { path: "/privacy", lastModified: "2026-08-02", priority: 0.3, freq: "yearly" },
];

const SERVICES_LAST_MODIFIED = "2026-08-17";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: canonicalUrl(route.path),
    lastModified: route.lastModified,
    changeFrequency: route.freq,
    priority: route.priority,
  }));

  const serviceEntries: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: canonicalUrl(`/services/${slug}`),
    lastModified: SERVICES_LAST_MODIFIED,
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

  // The /locations/ index ships only once at least one city has passed the doorway gate — an
  // index page pointing at nothing is worse than no index (docs/content-standards.md §2).
  const locationEntries: MetadataRoute.Sitemap =
    locations.length === 0
      ? []
      : [
          {
            url: canonicalUrl("/locations"),
            lastModified: "2026-08-24",
            changeFrequency: "monthly" as const,
            priority: 0.8,
          },
          ...locations.map((location) => ({
            url: canonicalUrl(`/locations/${location.slug}`),
            lastModified: "2026-08-24",
            changeFrequency: "monthly" as const,
            priority: 0.7,
          })),
        ];

  return [...staticEntries, ...serviceEntries, ...guideEntries, ...locationEntries];
}
