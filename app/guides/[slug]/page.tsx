import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle, articleSlugs, articleFaqs, articles } from "@/lib/articles";
import { getService } from "@/lib/services";
import { site, pageOpenGraph } from "@/lib/site";
import { articleJsonLd, faqPageJsonLd } from "@/lib/jsonld";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import ContactCTA from "@/components/ContactCTA";
import JsonLd from "@/components/JsonLd";
import ArticleBody, { RelatedServices } from "@/components/ArticleBody";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return articleSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  const og = pageOpenGraph({
    path: `/guides/${slug}`,
    title: `${article.title} | ${site.nameHe}`,
    description: article.description,
  });

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/guides/${slug}/` },
    ...og,
    // A guide is an article, not a website. Spread the shared block first, then override the two
    // fields that differ — that way the og:image and og:url still come from one place.
    openGraph: {
      ...og.openGraph,
      type: "article",
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = article.relatedServices
    .map((s) => getService(s))
    .filter((s) => s !== undefined)
    .map((s) => ({ href: `/services/${s.slug}/`, label: s.title }));

  const others = articles.filter((a) => a.slug !== article.slug);

  return (
    <>
      <JsonLd data={articleJsonLd(article)} />
      <JsonLd data={faqPageJsonLd(articleFaqs(article))} />

      <PageHero
        title={article.title}
        crumbs={[
          { name: "בית", href: "/" },
          { name: "מדריכים", href: "/guides" },
          { name: article.title, href: `/guides/${article.slug}` },
        ]}
      />

      <section className="py-14 md:py-20">
        <Container className="max-w-3xl">
          {/* Dates are real and verifiable. The byline is deliberately absent until a real person
              is on file (docs/business-facts.md §A) — never invent one. */}
          <p className="mb-8 text-sm text-ink/70">
            עודכן:{" "}
            <time dateTime={article.dateModified} dir="ltr">
              {article.dateModified.split("-").reverse().join("/")}
            </time>
            {article.author ? ` · נכתב על ידי ${article.author}` : null}
          </p>

          <ArticleBody blocks={article.blocks} />

          {related.length > 0 ? <RelatedServices slugs={related} /> : null}

          {others.length > 0 ? (
            <div className="mt-12 border-t border-ink/10 pt-8">
              <h2 className="text-lg font-bold text-brand">מדריכים נוספים</h2>
              <ul className="mt-4 space-y-2">
                {others.map((other) => (
                  <li key={other.slug}>
                    <a
                      href={`/guides/${other.slug}/`}
                      className="font-semibold text-brand underline underline-offset-2"
                    >
                      {other.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
