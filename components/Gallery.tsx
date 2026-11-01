import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { gallery, galleryScenes } from "@/lib/gallery";
import { imagesFor } from "@/lib/images";
import { getService } from "@/lib/services";
import Container from "./Container";
import Figure from "./Figure";
import SectionHeading from "./SectionHeading";

export interface GalleryProps {
  /** The page whose `supplied` placements fill the scenes: `/` or `/gallery/`. */
  route: string;
  title?: string;
  /** True on /gallery/, where the first tile is the page's LCP image. */
  priorityFirst?: boolean;
  /** The line under the scenes that points the homepage at /gallery/. */
  allImagesLink?: boolean;
}

// The scenes of the homepage and of /gallery/: each pairs a wide shot with closer shots of the
// thermal camera in use, and a three-image scene takes the full row from md up. Every picture is an
// illustration under the site-wide note (CLAUDE.md §15); the files, alt text and provenance come
// from the manifest, the scene captions from lib/gallery.ts. On the homepage it sits below the fold
// everywhere: lazy, dimensioned, no client JS.
export default function Gallery({
  route,
  title = gallery.title,
  priorityFirst = false,
  allImagesLink = false,
}: GalleryProps) {
  const tiles = imagesFor(route, "supplied");
  const scenes = galleryScenes
    .map((scene) => ({
      ...scene,
      images: tiles.filter((image) => scene.orders.includes(image.order)),
    }))
    .filter((scene) => scene.images.length > 0);
  if (scenes.length === 0) return null;

  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionHeading eyebrow={gallery.eyebrow} title={title} />
        <ul className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2">
          {scenes.map((scene) => {
            const service = getService(scene.service);
            if (!service) {
              throw new Error(
                `lib/gallery.ts: no service with the slug '${scene.service}'`,
              );
            }
            const triple = scene.images.length === 3;
            return (
              <li
                key={scene.caption}
                className={triple ? "md:col-span-2" : undefined}
              >
                <figure className="h-full rounded-2xl border border-ink/10 bg-white p-3 shadow-sm">
                  <div
                    className={`grid gap-2 ${triple ? "grid-cols-3" : "grid-cols-2"}`}
                  >
                    {scene.images.map((image) => (
                      <Figure
                        key={image.id}
                        image={image}
                        bare
                        priority={priorityFirst && image.id === tiles[0]?.id}
                        imageClassName="h-auto w-full rounded-xl"
                      />
                    ))}
                  </div>
                  <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-x-4 px-1">
                    <span className="font-bold text-brand">
                      {scene.caption}
                    </span>
                    <Link
                      href={`/services/${service.slug}/`}
                      className="group inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-accent-strong"
                    >
                      {service.title}
                      <ArrowLeft
                        className="size-4 transition-transform group-hover:-translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
        {allImagesLink ? (
          <p className="mt-8 text-center">
            <Link
              href="/gallery/"
              className="inline-flex min-h-11 items-center font-semibold text-brand underline underline-offset-2"
            >
              {gallery.allImagesLink}
            </Link>
          </p>
        ) : null}
      </Container>
    </section>
  );
}
