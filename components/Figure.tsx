import type { ReactNode } from "react";
import Image from "next/image";
import { imagesDraftMode, type PlacedImage } from "@/lib/images";

const DRAFT_BADGE = "טיוטה — ממתין לאישור";

export interface FigureProps {
  image: PlacedImage;
  /** The page's single LCP candidate — its FIRST content image in DOM order. */
  priority?: boolean;
  /** `false` hides the figcaption (strip tiles, thumbnails); the alt still ships. */
  caption?: boolean;
  /** Extra figcaption content after the caption — the gallery's link to the page it illustrates. */
  captionExtra?: ReactNode;
  /** A plain wrapper instead of <figure>, for a tile inside a scene that has its own figcaption. */
  bare?: boolean;
  className?: string;
  /** Replaces the default image classes where a surface has its own frame (the hero's ring). */
  imageClassName?: string;
}

// The one way a content image renders on this site: a `PlacedImage` from lib/images.ts through
// next/image, which emits a plain <img> with its intrinsic width/height (`images.unoptimized`, so no
// srcset) and adds no JS — Logo already puts that chunk on every route. Dimensions reserve the box,
// so CLS stays 0.
//
// `priority` passes `preload` AND `fetchPriority`: in Next 16 `preload` is what inserts the <link>
// (`priority` is deprecated) and it never sets fetchpriority by itself, while
// scripts/images/check-images-out.mjs requires exactly one fetchpriority="high" per image-bearing
// page, on its first content image. The wrapper carries `id="img-<id>"` so the review board can
// deep-link a candidate on the real page, and `data-image-id` / `data-image-status` so the gate can
// match it to the manifest.
//
// In draft mode (`IMAGES_DRAFT=1`) a candidate shows a small badge; a production build never renders
// a candidate at all, so the badge cannot reach a visitor. Server component.
export default function Figure({
  image,
  priority = false,
  caption = true,
  captionExtra,
  bare = false,
  className = "",
  imageClassName = "h-auto w-full rounded-2xl border border-ink/10 bg-paper",
}: FigureProps) {
  const draft = imagesDraftMode && image.status === "candidate";
  const showCaption =
    !bare && caption && (image.caption !== null || captionExtra !== undefined);
  const Wrapper = bare ? "div" : "figure";

  return (
    <Wrapper
      id={`img-${image.id}`}
      data-image-id={image.id}
      data-image-status={image.status}
      className={`relative ${className}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        preload={priority}
        fetchPriority={priority ? "high" : undefined}
        className={imageClassName}
      />
      {draft ? (
        <span className="absolute end-2 top-2 rounded-md border border-accent-strong/40 bg-white px-2 py-0.5 text-xs font-semibold text-accent-strong">
          {DRAFT_BADGE}
        </span>
      ) : null}
      {showCaption ? (
        <figcaption className="mt-2 text-sm leading-relaxed text-ink/70">
          {image.caption}
          {image.caption !== null && captionExtra !== undefined ? " · " : null}
          {captionExtra}
        </figcaption>
      ) : null}
    </Wrapper>
  );
}
