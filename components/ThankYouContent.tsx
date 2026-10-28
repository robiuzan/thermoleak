"use client";

import {
  useEffect,
  useRef,
  useSyncExternalStore,
  type MouseEvent,
} from "react";
import Link from "next/link";
import { CheckCircle2, Phone, TriangleAlert } from "lucide-react";
import { site, telHref, whatsappHref } from "@/lib/site";
import { pushEvent } from "@/lib/analytics";
import { LEAD_HANDOFF_KEY, THANK_YOU_COUNTED_KEY } from "./ContactForm";
import Container from "./Container";
import WhatsappIcon from "./WhatsappIcon";

interface LeadHandoff {
  message: string;
  opened: boolean;
  /**
   * The service the visitor picked — the <select>'s fixed enum, and the only form field that may
   * reach analytics (CLAUDE.md §12). OPTIONAL on purpose: a payload written before this field
   * existed can still be sitting in sessionStorage when a visitor who submitted the form just
   * before a deploy lands here, and that must not throw away their handoff.
   */
  service?: string;
}

function isLeadHandoff(value: unknown): value is LeadHandoff {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  if (typeof record.message !== "string" || typeof record.opened !== "boolean")
    return false;
  return record.service === undefined || typeof record.service === "string";
}

// useSyncExternalStore needs a STABLE snapshot — returning a fresh object per call loops forever —
// so the parsed handoff is cached. The cache is keyed on the raw stored string, NOT on "have I read
// once": this module stays loaded across client-side navigation, so a visitor who submits the form a
// SECOND time in the same tab would otherwise get the FIRST lead's payload back. That mixed up three
// things at once — the re-open button opened the previous enquiry's message, `blocked` showed the
// previous attempt's outcome, and `thank_you_view` reported the previous lead's service. Comparing
// the raw string keeps the snapshot stable while the payload is unchanged and invalidates the moment
// it is not.
let cachedRaw: string | null | undefined;
let cachedHandoff: LeadHandoff | null = null;

function readHandoff(): LeadHandoff | null {
  let raw: string | null;
  try {
    raw = sessionStorage.getItem(LEAD_HANDOFF_KEY);
  } catch {
    // Storage unavailable (private mode) — the generic WhatsApp link below is the fallback.
    return cachedHandoff;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedHandoff = null;
    if (raw) {
      try {
        const parsed: unknown = JSON.parse(raw);
        if (isLeadHandoff(parsed)) cachedHandoff = parsed;
      } catch {
        // Malformed payload — treat it as no handoff rather than throwing during render.
      }
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

  // thank_you_view is pushed from here rather than configured in the container: /thank-you/ is
  // reached ONLY by router.push from the form handler, so an All Pages trigger never fires for it
  // (docs/data-tracking-infrastructure.md §6).
  //
  // Three separate things conspire to double-count this event, and all three are handled:
  //   1. useSyncExternalStore renders once with the server snapshot during hydration and again with
  //      the client one — so this reads readHandoff() directly rather than depending on `handoff`.
  //   2. React's development double-invoke runs the effect twice on one mount — the ref covers it.
  //   3. A REMOUNT gets a fresh ref: reloading /thank-you/, or returning to it with the back button
  //      after tapping "חזרה לדף הבית", would count the same lead again. Only sessionStorage
  //      survives that, so the count is marked there and ContactForm clears the mark on each new
  //      submit.
  // The result is one event per LEAD, not per mount. If sessionStorage is unavailable (private
  // mode) this degrades to once per mount — the right way round to fail for a conversion signal,
  // since an inflated one would have Ads bidding on a phantom.
  const viewPushed = useRef(false);
  useEffect(() => {
    if (viewPushed.current) return;
    viewPushed.current = true;
    try {
      if (sessionStorage.getItem(THANK_YOU_COUNTED_KEY)) return;
      sessionStorage.setItem(THANK_YOU_COUNTED_KEY, "1");
    } catch {
      // Storage unavailable — fall through and count this mount.
    }
    const stored = readHandoff();
    pushEvent(
      "thank_you_view",
      stored?.service ? { service: stored.service } : {},
    );
  }, []);

  // The rendered href stays GENERIC on purpose. The prefilled message carries the visitor's name
  // and phone, and this anchor is tagged `data-cta` — GTM's built-in Click URL variable reads the
  // href, so a prefilled one would push real customer PII into the dataLayer and on to GA4 as
  // `link_url`. CLAUDE.md §12 forbids that, and ContactForm's own consent line promises it does not
  // happen. The prefilled conversation is opened from the click handler instead, where the URL
  // never enters the DOM. No-JS visitors get a blank chat, which is a working fallback.
  const genericWaHref = whatsappHref();
  const prefilledWaHref = whatsappHref(handoff?.message);
  const blocked = handoff !== null && !handoff.opened;

  function openPrefilledChat(event: MouseEvent<HTMLAnchorElement>) {
    if (!handoff?.message) return; // nothing stored — let the generic href do its job
    event.preventDefault();
    const win = window.open(prefilledWaHref, "_blank", "noopener,noreferrer");
    // Popup blocked: navigate this tab instead. The address bar carries the message, but the
    // anchor's href — the only thing the tag manager can read — stays clean.
    if (!win) window.location.href = prefilledWaHref;
  }

  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-2xl">
        <div className="rounded-2xl border border-ink/10 bg-white p-8 text-center shadow-sm">
          <CheckCircle2
            className="mx-auto size-12 text-[#0e7468]"
            aria-hidden="true"
          />
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="mt-4 text-2xl font-extrabold text-brand sm:text-3xl"
          >
            הפנייה שלכם מוכנה לשליחה
          </h1>
          <p className="mt-3 leading-relaxed text-ink/70">
            ההודעה עם הפרטים שמילאתם נפתחה בוואטסאפ — נשאר רק ללחוץ ״שליחה״ שם,
            ונחזור אליכם בשעות הפעילות.
          </p>

          {blocked ? (
            <div className="mt-5 rounded-xl border border-accent-strong/30 bg-accent/10 p-4 text-start">
              <p className="flex items-start gap-2 text-sm font-semibold text-ink">
                <TriangleAlert
                  className="mt-0.5 size-5 shrink-0 text-accent-strong"
                  aria-hidden="true"
                />
                נראה שהדפדפן חסם את פתיחת וואטסאפ. לא נורא — ההודעה שלכם שמורה,
                ואפשר לפתוח אותה ידנית בכפתור למטה.
              </p>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={genericWaHref}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="thankyou-whatsapp"
              onClick={openPrefilledChat}
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
              או חייגו:{" "}
              <span dir="ltr" className="whitespace-nowrap">
                {site.phone.display}
              </span>
            </a>
          </div>

          <ul className="mt-8 space-y-2 text-start text-sm leading-relaxed text-ink/70">
            <li>
              • נחזור אליכם לתיאום מועד שנוח לכם, בשעות הפעילות (
              {site.hours[0].days} {site.hours[0].time}).
            </li>
            <li>
              • כדאי להכין: מיקום הכתם או הבעיה, ומתי היא מופיעה (למשל אחרי
              מקלחת או גשם).
            </li>
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
