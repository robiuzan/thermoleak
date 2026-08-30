import Script from "next/script";
import { site } from "@/lib/site";

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
 * time (docs/data-tracking-infrastructure.md §4).
 */
export default function Analytics() {
  const gtmId = site.analytics.gtmId;
  if (!gtmId) return null;

  return (
    <>
      <Script id="gtm-init" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
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
