"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { navLinks, site, telHref } from "@/lib/site";
import Container from "./Container";
import CtaButton from "./CtaButton";
import Logo from "./Logo";

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Scroll lock while the menu is open, so the page behind it cannot be scrolled away
  // (backlog §11.3). Restores the previous value rather than assuming it was "".
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Focus management: move focus into the panel on open, trap Tab inside it while open, and
  // return focus to the trigger on close. Without this a keyboard user tabs straight out of an
  // open menu into the page behind it (backlog §11.3).
  useEffect(() => {
    if (!open) return;
    const panel = menuRef.current;
    if (!panel) return;

    const first = panel.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      const items = Array.from(panel!.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      const active = document.activeElement;

      // The trigger sits outside the panel, so wrap in both directions explicitly.
      if (event.shiftKey && (active === firstItem || !panel!.contains(active))) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && active === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label={`${site.nameHe} — דף הבית`}>
          {/* No `priority`: the hero image is the LCP candidate, and a second high-priority
              preload for a ~40px logo competes with it for early bandwidth (backlog §10.3). */}
          <Logo eager />
        </Link>

        {/* Nothing in this row may wrap: from 768 to ~970 px the row had less room than its
            content, and flexbox made it up by wrapping the links and the phone number — the call
            button grew to 60–80 px inside this 64 px row (backlog §8.7). Below lg the links sit
            closer (px-2, no gap) so the row fits at 768 px; from lg on it is exactly as before. */}
        <nav aria-label="ניווט ראשי" className="hidden items-center gap-0 md:flex lg:gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-2 py-2 text-sm font-semibold whitespace-nowrap text-ink/80 transition-colors hover:bg-brand/10 hover:text-brand lg:px-3"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          {/* Visible text is the phone number, which the accessible name contains — WCAG 2.5.3. */}
          <CtaButton
            href={telHref}
            variant="primary"
            dataCta="header-call"
            ariaLabel={`התקשרו אלינו: ${site.phone.display}`}
          >
            <Phone className="size-4" aria-hidden="true" />
            {/* An LTR island that never breaks: bare, "055-660-1006" broke after its hyphens. */}
            <span dir="ltr" className="whitespace-nowrap">
              {site.phone.display}
            </span>
          </CtaButton>
        </div>

        {/* size-11 is exactly 44px — the WCAG 2.5.5 / platform minimum tap target. The previous
            `p-2` around a 24px icon measured 40px (backlog §11.6). */}
        <button
          type="button"
          ref={menuButtonRef}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex size-11 items-center justify-center rounded-lg text-brand md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "סגירת תפריט הניווט" : "פתיחת תפריט הניווט"}
        >
          {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
        </button>
      </Container>

      {open ? (
        <div
          id="mobile-menu"
          ref={menuRef}
          className="border-t border-ink/10 bg-white md:hidden"
          // Mounted only while open, so the mark is too: the seasonal card (/assets/live.js, fleet
          // live-kit — CLAUDE.md §14) never opens over the open menu.
          data-live-block=""
        >
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
              <span dir="ltr" className="whitespace-nowrap">
                {site.phone.display}
              </span>
            </CtaButton>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
