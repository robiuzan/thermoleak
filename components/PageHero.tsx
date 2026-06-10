import Container from "./Container";
import Breadcrumbs, { type BreadcrumbItem } from "./Breadcrumbs";

export interface PageHeroProps {
  title: string;
  subtitle?: string;
  crumbs?: BreadcrumbItem[];
}

export default function PageHero({ title, subtitle, crumbs }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-brand text-white">
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
