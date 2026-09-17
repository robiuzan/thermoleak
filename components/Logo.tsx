import Image from "next/image";
import { site } from "@/lib/site";

export interface LogoProps {
  className?: string;
  // Render for a dark background (e.g. the footer): the transparent dark logo is flipped to white.
  onDark?: boolean;
  // Preload (use for the above-the-fold navbar logo).
  priority?: boolean;
  /**
   * Load immediately without preloading. The navbar logo is above the fold on every route, so
   * `next/image`'s default `loading="lazy"` makes it wait for layout before the request even
   * starts — a visible delay on the one element that is on-screen first.
   *
   * Deliberately NOT `priority`: that was tried and removed (backlog §10.3) because it injects a
   * preload <link> that competes with the LCP hero. `eager` is the middle setting — request it
   * straight away, but do not jump the preload queue.
   */
  eager?: boolean;
}

// Brand logo lockup (icon + Hebrew wordmark + tagline) — a 280×70 transparent WebP in /public/images.
// On dark sections we invert it to white via `brightness-0 invert`; transparency means only the
// opaque logo pixels flip, so it reads cleanly on the dark-blue footer.
export default function Logo({ className = "", onDark = false, priority = false, eager = false }: LogoProps) {
  return (
    <Image
      src="/images/thermoleak_logo.webp"
      alt={site.nameHe}
      width={280}
      height={70}
      priority={priority}
      loading={eager && !priority ? "eager" : undefined}
      className={`h-9 w-auto${onDark ? " brightness-0 invert" : ""}${className ? ` ${className}` : ""}`}
    />
  );
}
