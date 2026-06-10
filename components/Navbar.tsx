"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { navLinks, site, telHref } from "@/lib/site";
import Container from "./Container";
import CtaButton from "./CtaButton";

function LogoMark() {
  return (
    <svg viewBox="0 0 64 64" className="size-8" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="navthermal" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#0B3D5C" />
          <stop offset="0.55" stopColor="#1E88A8" />
          <stop offset="1" stopColor="#FF6A3D" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="#0B3D5C" />
      <path
        d="M32 12c7 9 12 15 12 22a12 12 0 1 1-24 0c0-7 5-13 12-22z"
        fill="url(#navthermal)"
      />
      <circle cx="27" cy="36" r="3.2" fill="#ffffff" opacity="0.9" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label={`${site.nameHe} — דף הבית`}
        >
          <LogoMark />
          <span className="text-lg font-extrabold text-brand">{site.name}</span>
        </Link>

        <nav aria-label="ניווט ראשי" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-ink/80 transition-colors hover:bg-brand/10 hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <CtaButton href={telHref} variant="primary" ariaLabel={`התקשרו אלינו: ${site.phone.display}`}>
            <Phone className="size-4" aria-hidden="true" />
            {site.phone.display}
          </CtaButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-brand md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "סגירת תפריט הניווט" : "פתיחת תפריט הניווט"}
        >
          {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
        </button>
      </Container>

      {open ? (
        <div id="mobile-menu" className="border-t border-ink/10 bg-white md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-base font-semibold text-ink/80 transition-colors hover:bg-brand/10 hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
            <CtaButton
              href={telHref}
              variant="primary"
              className="mt-2"
              ariaLabel={`התקשרו אלינו: ${site.phone.display}`}
            >
              <Phone className="size-4" aria-hidden="true" />
              {site.phone.display}
            </CtaButton>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
