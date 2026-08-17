import Container from "./Container";
import Breadcrumbs, { type BreadcrumbItem } from "./Breadcrumbs";
import JsonLd from "./JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export interface PageHeroProps {
  title: string;
  subtitle?: string;
  crumbs?: BreadcrumbItem[];
}

export default function PageHero({ title, subtitle, crumbs }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-brand text-white">
      {/* BreadcrumbList is emitted here, from the same array the visible trail renders, so the
          markup and the schema can never drift apart (docs/schema-graph.md §2a). Pages must NOT
          also call breadcrumbJsonLd themselves — that would double-emit. */}
      {crumbs && crumbs.length > 0 ? (
        <JsonLd
          data={breadcrumbJsonLd(crumbs.map((crumb) => ({ name: crumb.name, url: crumb.href })))}
        />
      ) : null}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(255,106,61,0.22),transparent_55%)]"
      />
      <Container className="relative py-12 md:py-16">
        {crumbs && crumbs.length > 0 ? <Breadcrumbs items={crumbs} /> : null}
        <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h1>
        {subtitle ? (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            {subtitle}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
