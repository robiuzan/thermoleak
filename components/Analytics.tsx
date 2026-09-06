import Script from "next/script";
import { site } from "@/lib/site";
import { CONSENT_STORAGE_KEY } from "@/lib/consent";

/**
 * Google Tag Manager — the shared Israeli-fleet container.
 *
 * WHY THE SHARED CONTAINER: 10 of the 12 fleet sites carry GTM-KWGGH438, and fleet-wide tag changes
 * would otherwise skip this domain. The cost is real and accepted: classic GTM is ~90 KB gzipped,
 * which exceeds the 50 KB tag budget in docs/performance-guidelines.md §1 / docs/data-tracking §5.
 * Cloudflare Zaraz remains the lighter alternative if that budget is ever enforced strictly.
 *
 * `afterInteractive` (the Next 16 default) is deliberate: the container loads early but after
 * hydration begins, so it never blocks LCP. Do NOT switch to `beforeInteractive` — that is for
 * critical scripts only and would put a 90 KB third party ahead of the page.
 *
 * ⚠️ TWO THINGS THIS DOES NOT DO:
 *   1. It does not create a GA4 property. GA4 is resolved INSIDE the container by a RegEx table on
 *      {{Page Hostname}}; thermoleak.co.il needs an entry there or events land nowhere.
 *   2. It does not prove the id works. A wrong container id renders identical markup and collects
 *      nothing — the failure that cost this fleet 18 days of silence. Assert after every deploy:
 *        curl -o /dev/null -w '%{http_code}' "https://www.googletagmanager.com/gtm.js?id=<ID>"
 *
 * No PII may ever enter the dataLayer — the contact form has name and phone in scope at submit
 * time (docs/data-tracking-infrastructure.md §4). That ban covers hrefs too: GTM's built-in Click
 * URL variable reads an anchor's href, so a prefilled WhatsApp link on a tagged element would
 * carry the visitor's name and phone straight into GA4 (see components/ThankYouContent.tsx).
 *
 * CONSENT: `analytics_storage` defaults to DENIED. The default lives in the same inline script as
 * the loader and runs before it, which is the only ordering that guarantees gtm.js cannot execute
 * ahead of the consent state. components/ConsentBanner.tsx upgrades it to granted; lib/consent.ts
 * holds the shared key. A stored grant is replayed synchronously here so a returning visitor is
 * measured from their first page view rather than after the banner would have hydrated.
 */
export default function Analytics() {
  const gtmId = site.analytics.gtmId;
  if (!gtmId) return null;

  // These two MUST be concatenated into a single line with no newline between them. A literal
  // newline inside the template gets serialised into the HTML as an escaped `\n`, which is a
  // SyntaxError at statement position — it would kill the whole script, taking both the consent
  // defaults and the container with it. Verified in `out/` after every change to this string.
  const consentDefaults =
    `window.dataLayer=window.dataLayer||[];` +
    `window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};` +
    `gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',` +
    `analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});` +
    `try{if(localStorage.getItem('${CONSENT_STORAGE_KEY}')==='granted')` +
    `{gtag('consent','update',{analytics_storage:'granted'});}}catch(e){}`;

  const gtmLoader =
    `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});` +
    `var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;` +
    `j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})` +
    `(window,document,'script','dataLayer','${gtmId}');`;

  return (
    <>
      <Script id="gtm-init" strategy="afterInteractive">
        {consentDefaults + gtmLoader}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
