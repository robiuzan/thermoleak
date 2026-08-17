import type { MetadataRoute } from "next";
import { canonicalUrl } from "@/lib/site";
import { serviceSlugs } from "@/lib/services";

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

  return [...staticEntries, ...serviceEntries];
}
