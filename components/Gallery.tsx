import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  gallery,
  galleryImageSize,
  galleryScenes,
  gallerySrc,
} from "@/lib/gallery";
import { getService } from "@/lib/services";
import Container from "./Container";
import SectionHeading from "./SectionHeading";

// Homepage gallery: each scene pairs a wide shot with a close-up of the thermal camera in use; a
// three-image scene takes the full row from md up. The images are AI illustrations that, by the
// owner's decision of 2026-10-26, carry no label at all —
// not on the page, not in the alt text, not in the files (docs/eeat-and-trust.md §5). Their
// provenance lives only in `source.kind` (lib/gallery.ts). Below the fold everywhere: lazy,
// dimensioned, no client JS.
export default function Gallery() {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionHeading eyebrow={gallery.eyebrow} title={gallery.title} />
        <ul className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2">
          {galleryScenes.map((scene) => {
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
                      <Image
                        key={image.slug}
                        src={gallerySrc(image)}
                        alt={image.alt}
                        width={galleryImageSize.width}
                        height={galleryImageSize.height}
                        className="h-auto w-full rounded-xl"
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
      </Container>
    </section>
  );
}
