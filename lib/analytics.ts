// Conversion events pushed from repo code.
//
// WHY ANY OF THIS LIVES IN THE REPO. Of the seven events specified in
// docs/data-tracking-infrastructure.md §3, four are `[data-cta]` click triggers that belong in the
// shared GTM container and are deliberately NOT duplicated here — two sources for one click produce
// two numbers. The three below cannot be built container-side at any price:
//   • the WhatsApp handoff's OUTCOME exists only inside ContactForm's submit handler — no click
//     trigger can observe whether window.open returned a window or null;
//   • /thank-you/ is reached ONLY by router.push from that handler, so an All Pages trigger never
//     fires there (§6). It is also the cleanest Ads conversion target, which is why it must work.
//
// PII — CLAUDE.md §12. `service` is the <select>'s fixed enum and is the ONLY form field that may
// travel. `name`, `phone`, `area` and `message` must never appear in a parameter, and never in an
// href either: GTM's Click URL is itself a dataLayer variable.
//
// `Window.dataLayer` is declared in lib/consent.ts — one ambient declaration for the whole program.

export interface ConversionEvents {
  /** A handoff was ATTEMPTED — not that the visitor sent the message, which the site cannot see.
   *  This is the one lead event; it fires whether or not the popup opened. */
  lead_whatsapp_open: { service: string; handoff_ok: boolean };
  /** Diagnostic only: window.open returned null. **Never mark this a key event** — it fires
   *  alongside lead_whatsapp_open, so counting both doubles every blocked lead. */
  lead_handoff_blocked: { service: string };
  /** /thank-you/ mounted. `service` is absent when sessionStorage held no handoff. */
  thank_you_view: { service?: string };
}

export function pushEvent<K extends keyof ConversionEvents>(
  name: K,
  params: ConversionEvents[K],
): void {
  if (typeof window === "undefined") return;
  try {
    if (!window.dataLayer) window.dataLayer = [];
    window.dataLayer.push({ event: name, ...params });
  } catch {
    // The dataLayer can be absent or replaced by an extension. A lost metric must never break a
    // lead — this function is called from the submit path.
  }
}
