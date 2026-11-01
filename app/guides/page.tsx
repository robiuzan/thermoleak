import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { articles } from "@/lib/articles";
import { imageFor } from "@/lib/images";
import { site, pageOpenGraph } from "@/lib/site";
import { collectionPageJsonLd } from "@/lib/jsonld";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import ContactCTA from "@/components/ContactCTA";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "מדריכים — איתור נזילות ורטיבות",
  description:
    "מדריכים מקצועיים על איתור נזילות: מה מצלמה תרמית באמת רואה ומה לא, איך מאתרים נזילה בלי לשבור, וכמה עולה בדיקה. הסבר ענייני, כולל המגבלות.",
  alternates: { canonical: "/guides/" },
  ...pageOpenGraph({
    path: "/guides",
    title: `מדריכים — איתור נזילות ורטיבות | ${site.nameHe}`,
    description:
      "מדריכים מקצועיים על איתור נזילות: מה מצלמה תרמית באמת רואה ומה לא, איך מאתרים נזילה בלי לשבור, וכמה עולה בדיקה. הסבר ענייני, כולל המגבלות.",
  }),
};

export default function GuidesPage() {
  // Each card shows the 480-px thumbnail derived from the guide's own `lead` image — a plain image,
  // not a figure: the guide page owns the captioned one. The first card that has one is the page's
  // single eager (LCP) image.
  const cards = articles.map((article) => ({
    article,
    lead: imageFor(`/guides/${article.slug}/`, "lead"),
  }));
  const firstThumb = cards.findIndex((card) => card.lead?.thumb);

  return (
    <>
      <JsonLd
        data={collectionPageJsonLd({
          path: "/guides",
          name: "מדריכים — טרמוליק",
          description: metadata.description as string,
        })}
      />

      <PageHero
        title="מדריכים"
        subtitle="הסבר ענייני על איך איתור נזילות באמת עובד — כולל מה השיטה לא יכולה לעשות."
        crumbs={[
          { name: "בית", href: "/" },
          { name: "מדריכים", href: "/guides" },
        ]}
      />

      <section className="py-14 md:py-20">
        <Container max="3xl">
          <p className="mb-8 leading-relaxed text-ink/80">
            רוב מה שנכתב על איתור נזילות נועד למכור בדיקה. המדריכים כאן נועדו
            להסביר — כולל המקרים שבהם השיטה מגיעה לגבול שלה. אם אחרי הקריאה תדעו
            שאתם לא צריכים אותנו, זו תשובה טובה בדיוק כמו ההפך.
          </p>

          <ul className="space-y-4">
            {cards.map(({ article, lead }, index) => (
              <li key={article.slug}>
                <Link
                  href={`/guides/${article.slug}/`}
                  className="group flex items-start gap-4 rounded-2xl border border-ink/10 bg-white p-6 transition hover:border-brand/30 hover:shadow-md"
                >
                  {lead?.thumb ? (
                    <Image
                      src={lead.thumb.src}
                      alt={lead.alt}
                      width={lead.thumb.width}
                      height={lead.thumb.height}
                      preload={index === firstThumb}
                      fetchPriority={index === firstThumb ? "high" : undefined}
                      className="h-auto w-28 shrink-0 rounded-lg border border-ink/10 bg-paper sm:w-36"
                    />
                  ) : null}
                  <span className="flex-1">
                    <span className="block text-lg font-bold text-brand">
                      {article.title}
                    </span>
                    <span className="mt-2 block text-sm leading-relaxed text-ink/70">
                      {article.description}
                    </span>
                  </span>
                  <ArrowLeft
                    className="mt-1 size-5 shrink-0 text-accent-strong transition-all group-hover:-translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
