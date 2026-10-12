"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { CONSENT_STORAGE_KEY, isConsentChoice, type ConsentChoice } from "@/lib/consent";

type ConsentState = ConsentChoice | "none" | "unknown";

// A minimal external store. useSyncExternalStore is required here rather than useState + useEffect:
// Next 16's lint rejects a synchronous setState inside useEffect, and ThankYouContent already
// establishes this pattern for client-only reads.
let listeners: Array<() => void> = [];
let cached: ConsentState | undefined;

function subscribe(onChange: () => void) {
  listeners.push(onChange);
  return () => {
    listeners = listeners.filter((listener) => listener !== onChange);
  };
}

function getSnapshot(): ConsentState {
  if (cached === undefined) {
    try {
      const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
      cached = isConsentChoice(raw) ? raw : "none";
    } catch {
      // Storage blocked (private mode, or the visitor blocks site data). Ask again this page view.
      cached = "none";
    }
  }
  return cached;
}

// The server cannot know the choice, so it renders "unknown" and the banner is absent from the
// HTML. It appears only after hydration — which means a returning visitor who already decided
// never sees it flash, and it contributes nothing to CLS because it is fixed-position.
const getServerSnapshot = (): ConsentState => "unknown";

function record(choice: ConsentChoice) {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Not persistable — the choice still applies for this page view.
  }
  cached = choice;
  // Answered: lift the before-paint "no card yet" mark that app/layout.tsx put on <html> for a
  // visitor with no stored answer (fleet live-kit — CLAUDE.md §14).
  document.documentElement.removeAttribute("data-live-block");
  // Only an upgrade is signalled. "denied" is already the default set before the container loaded,
  // so there is nothing to send for a refusal.
  if (choice === "granted") window.gtag?.("consent", "update", { analytics_storage: "granted" });
  listeners.forEach((listener) => listener());
}

export default function ConsentBanner() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // The seasonal card (/assets/live.js, fleet live-kit — CLAUDE.md §14) never opens over this
  // banner, and never before the question is answered. Before first paint, app/layout.tsx marks
  // <html> with `data-live-block` only when no answer is stored — the server cannot know, and a
  // mark rendered here for everyone held the card back for every returning visitor until
  // hydration. The banner carries the mark too while it asks; record() lifts the <html> one.
  if (state !== "none") return null;

  return (
    <div
      data-live-block=""
      // On mobile it sits above StickyContact (a ~3.5rem fixed bar) so the call and WhatsApp
      // buttons stay tappable while the banner is up — a consent prompt must never block the
      // primary conversion path. StickyContact is md:hidden, hence bottom-0 from md up.
      className="fixed inset-x-0 bottom-14 z-50 border-t border-ink/15 bg-white p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.10)] md:bottom-0"
      role="region"
      aria-label="הודעה על עוגיות"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-ink/70">
          אנחנו משתמשים ב־Google Analytics כדי להבין איך משתמשים באתר ולשפר אותו. המדידה לא מופעלת
          עד שתאשרו.{" "}
          <Link href="/privacy/" className="font-semibold text-brand underline">
            מדיניות הפרטיות
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => record("denied")}
            // border-ink/55 is 3.58:1 — the same non-text contrast bar Sprint 4 task 5 sets for the
            // form inputs. A new component must not ship below a floor the next a11y pass enforces.
            className="min-h-11 rounded-xl border border-ink/55 px-5 text-sm font-bold text-ink/80 transition-colors hover:bg-paper"
          >
            ללא מדידה
          </button>
          <button
            type="button"
            onClick={() => record("granted")}
            className="min-h-11 rounded-xl bg-brand px-5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
          >
            אישור
          </button>
        </div>
      </div>
    </div>
  );
}
