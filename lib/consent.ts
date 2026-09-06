// Google Consent Mode v2 — the visitor's analytics choice.
//
// Analytics storage is DENIED by default and stays denied until the visitor opts in. That default
// is set in components/Analytics.tsx, in the SAME inline script that loads the container and
// BEFORE it, so gtm.js can never run ahead of the consent state.
//
// Under the Israeli Privacy Protection Law (Amendment 13) the honest position for a site that
// loads GA4 on every route is an explicit opt-in, and app/privacy/ must describe what actually
// happens. Keep the three in sync: this default, the banner, and the privacy page.

export const CONSENT_STORAGE_KEY = "tl-consent-v1";

export type ConsentChoice = "granted" | "denied";

export function isConsentChoice(value: unknown): value is ConsentChoice {
  return value === "granted" || value === "denied";
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    // Defined by the inline bootstrap in components/Analytics.tsx. Optional because the container
    // is skipped entirely when no id is configured.
    gtag?: (...args: unknown[]) => void;
  }
}
