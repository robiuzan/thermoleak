"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { navLinks, site, telHref } from "@/lib/site";
import Container from "./Container";
import CtaButton from "./CtaButton";
import Logo from "./Logo";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Escape closes the mobile menu and returns focus to the toggle, so a keyboard user is never
  // stranded inside a closed disclosure (WCAG 2.1.2-adjacent; backlog §11.3).
  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && open) {
      setOpen(false);
      menuButtonRef.current?.focus();
    }
  }

  return (
    <header
      className="sticky top-0 z-40 border-b border-ink/10 bg-white/90 backdrop-blur"
      onKeyDown={handleKeyDown}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label={`${site.nameHe} — דף הבית`}>
          {/* No `priority`: the hero image is the LCP candidate, and a second high-priority
              preload for a ~40px logo competes with it for early bandwidth (backlog §10.3). */}
          <Logo />
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
          <CtaButton
            href={telHref}
            variant="primary"
            dataCta="header-call"
            ariaLabel={`התקשרו אלינו: ${site.phone.display}`}
          >
            <Phone className="size-4" aria-hidden="true" />
            {site.phone.display}
          </CtaButton>
        </div>

        <button
          type="button"
          ref={menuButtonRef}
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
              dataCta="menu-call"
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
