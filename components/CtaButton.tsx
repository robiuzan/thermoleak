import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "accent" | "whatsapp" | "outline" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus-visible:outline-none";

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

// All combinations vetted for WCAG AA text contrast.
const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  accent: "bg-accent-strong text-white hover:bg-[#9a3412]",
  whatsapp: "bg-[#25D366] text-ink hover:bg-[#1faa57]",
  outline: "border-2 border-brand text-brand hover:bg-brand hover:text-white",
  ghost: "text-brand hover:bg-brand/10",
};

export interface CtaButtonProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  ariaLabel?: string;
  // Conversion-tracking hook, `{location}-{action}` (e.g. "hero-call"). GTM click triggers
  // match on this attribute — no JS ships for it (see the tracking-analytics skill).
  dataCta?: string;
}

export default function CtaButton({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  ariaLabel,
  dataCta,
}: CtaButtonProps) {
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  const isHttp = href.startsWith("http");
  const isExternalProtocol = /^(tel:|mailto:)/.test(href) || isHttp;

  if (isExternalProtocol) {
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        data-cta={dataCta}
        {...(isHttp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} aria-label={ariaLabel} data-cta={dataCta}>
      {children}
    </Link>
  );
}
