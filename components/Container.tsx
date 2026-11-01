import type { ReactNode } from "react";

// The column widths a page may ask for. These REPLACE the default instead of being passed through
// `className`: two max-w-* utilities on one element are decided by the order Tailwind emits them,
// not by the order they are written, and it emits max-w-6xl after the narrower ones — so for months
// every `<Container className="max-w-3xl">` silently rendered 1088 px wide (fixed 2026-11-01).
const widths = {
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "6xl": "max-w-6xl",
} as const;

export interface ContainerProps {
  children: ReactNode;
  className?: string;
  max?: keyof typeof widths;
}

export default function Container({
  children,
  className = "",
  max = "6xl",
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full ${widths[max]} px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
}
