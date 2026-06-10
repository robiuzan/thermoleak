"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { navLinks, site, telHref } from "@/lib/site";
import Container from "./Container";
import CtaButton from "./CtaButton";
import Logo from "./Logo";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label={`${site.nameHe} — דף הבית`}>
          <Logo priority />
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
