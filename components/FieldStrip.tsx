import { stripFor } from "@/lib/images";
import Figure from "./Figure";

export interface FieldStripProps {
  route: string;
  cols?: 2 | 3;
  /** Whether tile 1 is the page's LCP image. False when a content image comes before the strip. */
  priority?: boolean;
  className?: string;
}

// A row of two or three field snapshots — the `strip-1..3` / `pair-1..2` slots of a route. Renders
// NOTHING below two images: one tile in a row reads as a broken grid, and every page reads correctly
// with zero images. With three columns the third tile is hidden on phones (two across is the
// readable width there); it is lazy, so a hidden tile costs no bytes until it intersects.
export default function FieldStrip({
  route,
  cols = 3,
  priority = true,
  className = "",
}: FieldStripProps) {
  const images = stripFor(route).slice(0, cols);
  if (images.length < 2) return null;

  return (
    <ul
      className={`grid grid-cols-2 gap-3 sm:gap-4 ${cols === 3 ? "sm:grid-cols-3" : ""} ${className}`}
    >
      {images.map((image, index) => (
        <li
          key={image.id}
          className={cols === 3 && index === 2 ? "hidden sm:block" : undefined}
        >
          <Figure
            image={image}
            priority={priority && index === 0}
            caption={false}
          />
        </li>
      ))}
    </ul>
  );
}
