import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/lib/articles";
import { gallery } from "@/lib/gallery";
import { imagesFor, imagesNote, type PlacedImage } from "@/lib/images";
import { collectionPageJsonLd } from "@/lib/jsonld";
import { locations } from "@/lib/locations";
import { services } from "@/lib/services";
import { pageOpenGraph, site } from "@/lib/site";
import ContactCTA from "@/components/ContactCTA";
import Container from "@/components/Container";
import Figure from "@/components/Figure";
import Gallery from "@/components/Gallery";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";

const title = "גלריה — כך נראית בדיקה תרמית בבית";

export const metadata: Metadata = {
  // Bare subject only — the layout template appends "| טרמוליק".
  title,
  description: imagesNote.galleryDescription,
  alternates: { canonical: "/gallery/" },
  ...pageOpenGraph({
    path: "/gallery",
    title: `${title} | ${site.nameHe}`,
    description: imagesNote.galleryDescription,
  }),
};

/** The page each image illustrates, titled — so a tile can link to the place it belongs. */
const pageTitles = new Map<string, string>([
  ...services.map((s) => [`/services/${s.slug}/`, s.title] as const),
  ...articles.map((a) => [`/guides/${a.slug}/`, a.title] as const),
  ...locations.map(
    (l) => [`/locations/${l.slug}/`, `איתור נזילות ${l.prefixed}`] as const,
  ),
]);

/**
 * Where a tile links. A reused image goes back to the page it was made for (its first placement);
 * an image made for the gallery goes to the service it shows. Neither: no link.
 */
function linkFor(image: PlacedImage): { href: string; label: string } | null {
  const href =
    image.route !== "/gallery/"
      ? image.route
      : image.service
        ? `/services/${image.service}/`
        : null;
  const label = href ? pageTitles.get(href) : undefined;
  return href && label ? { href, label } : null;
}

// /gallery/ — the home of the site-wide image disclosure (CLAUDE.md §15). Every picture here is an
// illustration of how a thermal check is done, and the note says so in plain Hebrew. A
// CollectionPage with no ImageObject on purpose: renderings are never evidence, so nothing here
// reaches the structured data (the images gate fails the build if it ever does). The BreadcrumbList
// comes from PageHero.
export default function GalleryPage() {
  const tiles = imagesFor("/gallery/", "generated");

  return (
    <>
      <JsonLd
        data={collectionPageJsonLd({
          path: "/gallery",
          name: `גלריה — ${site.nameHe}`,
          description: imagesNote.galleryDescription,
        })}
      />
      <PageHero
        title={title}
        subtitle={imagesNote.galleryIntro}
        crumbs={[
          { name: "בית", href: "/" },
          { name: "גלריה", href: "/gallery" },
        ]}
      />

      <section className="pt-14 md:pt-16">
        <Container max="3xl">
          {/* The disclosure — verbatim from content/images/notice.json (the gate compares it). */}
          <p
            data-images-notice="gallery"
            className="rounded-2xl border border-ink/10 bg-paper p-6 leading-relaxed text-ink/80"
          >
            {imagesNote.gallery}
          </p>
        </Container>
      </section>

      <Gallery
        route="/gallery/"
        title={imagesNote.generatedTitle}
        priorityFirst
      />

      {tiles.length > 0 ? (
        <section className="bg-paper py-14 md:py-16">
          <Container>
            <h2 className="text-center text-2xl font-extrabold text-brand sm:text-3xl">
              {gallery.secondTitle}
            </h2>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tiles.map((image) => {
                const link = linkFor(image);
                return (
                  <li key={image.id}>
                    <Figure
                      image={image}
                      captionExtra={
                        link ? (
                          <Link
                            href={link.href}
                            className="font-semibold text-brand underline underline-offset-2"
                          >
                            {link.label}
                          </Link>
                        ) : undefined
                      }
                    />
                  </li>
                );
              })}
            </ul>
          </Container>
        </section>
      ) : null}

      <ContactCTA />
    </>
  );
}
