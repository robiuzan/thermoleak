"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { CheckCircle2, Phone, TriangleAlert } from "lucide-react";
import { site, telHref, whatsappHref } from "@/lib/site";
import { LEAD_HANDOFF_KEY } from "./ContactForm";
import Container from "./Container";
import WhatsappIcon from "./WhatsappIcon";

interface LeadHandoff {
  message: string;
  opened: boolean;
}

function isLeadHandoff(value: unknown): value is LeadHandoff {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.message === "string" && typeof record.opened === "boolean";
}

// The handoff never changes during a visit, so it is read once and cached — a stable snapshot
// is also what useSyncExternalStore requires (a fresh object per call would loop).
let cachedHandoff: LeadHandoff | null | undefined;

function readHandoff(): LeadHandoff | null {
  if (cachedHandoff === undefined) {
    cachedHandoff = null;
    try {
      const raw = sessionStorage.getItem(LEAD_HANDOFF_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isLeadHandoff(parsed)) cachedHandoff = parsed;
      }
    } catch {
      // Storage unavailable — fall back to the generic WhatsApp link below.
    }
  }
  return cachedHandoff;
}

const emptySubscribe = () => () => {};

export default function ThankYouContent() {
  // Hydration-safe client-only read: the server snapshot is null, the client snapshot is the
  // stored handoff. This replaces the setState-in-effect pattern Next 16's lint rejects.
  const handoff = useSyncExternalStore(emptySubscribe, readHandoff, () => null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Move focus to the heading so the outcome is announced after the form navigation.
    headingRef.current?.focus();
  }, []);

  // With a stored message the re-open link resumes the exact prefilled conversation;
  // without one (direct visit, private mode) it opens a blank chat.
  const waHref = whatsappHref(handoff?.message);
  const blocked = handoff !== null && !handoff.opened;

  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-2xl">
        <div className="rounded-2xl border border-ink/10 bg-white p-8 text-center shadow-sm">
          <CheckCircle2 className="mx-auto size-12 text-[#0e7468]" aria-hidden="true" />
          <h1 ref={headingRef} tabIndex={-1} className="mt-4 text-2xl font-extrabold text-brand sm:text-3xl">
            הפנייה שלכם מוכנה לשליחה
          </h1>
          <p className="mt-3 leading-relaxed text-ink/70">
            ההודעה עם הפרטים שמילאתם נפתחה בוואטסאפ — נשאר רק ללחוץ ״שליחה״ שם, ונחזור אליכם
            בשעות הפעילות.
          </p>

          {blocked ? (
            <div className="mt-5 rounded-xl border border-accent-strong/30 bg-accent/10 p-4 text-start">
              <p className="flex items-start gap-2 text-sm font-semibold text-ink">
                <TriangleAlert className="mt-0.5 size-5 shrink-0 text-accent-strong" aria-hidden="true" />
                נראה שהדפדפן חסם את פתיחת וואטסאפ. לא נורא — ההודעה שלכם שמורה, ואפשר לפתוח אותה
                ידנית בכפתור למטה.
              </p>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="thankyou-whatsapp"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-base font-bold text-ink transition-colors hover:bg-[#1faa57]"
            >
              <WhatsappIcon className="size-5" />
              {blocked ? "פתיחת ההודעה בוואטסאפ" : "פתיחה חוזרת של וואטסאפ"}
            </a>
            <a
              href={telHref}
              data-cta="thankyou-call"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-brand-dark"
            >
              <Phone className="size-5" aria-hidden="true" />
              או חייגו: {site.phone.display}
            </a>
          </div>

          <ul className="mt-8 space-y-2 text-start text-sm leading-relaxed text-ink/70">
            <li>• נחזור אליכם לתיאום מועד שנוח לכם, בשעות הפעילות ({site.hours[0].days} {site.hours[0].time}).</li>
            <li>• כדאי להכין: מיקום הכתם או הבעיה, ומתי היא מופיעה (למשל אחרי מקלחת או גשם).</li>
            <li>• לנזילה פעילה ודחופה — עדיף להתקשר ישירות.</li>
          </ul>

          <p className="mt-8 text-sm">
            <Link href="/" className="font-semibold text-brand underline">
              חזרה לדף הבית
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
