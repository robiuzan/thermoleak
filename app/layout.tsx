import type { Metadata, Viewport } from "next";
import "./globals.css";
// The fleet live-kit's behaviour CSS (byte-locked) — after globals.css; its colours are the
// --live-* variables at the end of globals.css (CLAUDE.md §14).
import "@/lib/live/live-core.css";
import { heebo, assistant } from "./fonts";
import { site } from "@/lib/site";
import { localBusinessJsonLd, webSiteJsonLd } from "@/lib/jsonld";
import JsonLd from "@/components/JsonLd";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyContact from "@/components/StickyContact";
import Analytics from "@/components/Analytics";
import ConsentBanner from "@/components/ConsentBanner";
import { LiveDialogs, LiveHead, LiveTopBar } from "@/components/live/Live";
import { CONSENT_STORAGE_KEY } from "@/lib/consent";

/**
 * The seasonal card (/assets/live.js, fleet live-kit — CLAUDE.md §14) never opens while anything
 * carries `data-live-block`. The consent banner is a client component that mounts only after
 * hydration, and a static export cannot know on the server whether THIS visitor already answered:
 * a mark rendered on the server for everyone held the card back for every returning visitor until
 * hydration, and a mark rendered only by the banner arrives after the card's 4 s timer on a slow
 * phone (the 2026-10-12 review of hambabait opened the card under a still-unmounted banner in 3 of
 * 7 throttled runs). So this sets the mark on <html> before first paint ONLY when no answer is
 * stored — the same test ConsentBanner makes (lib/consent.ts isConsentChoice) — and the banner
 * removes it when the visitor answers. Storage blocked: no mark, and live.js shows no card without
 * storage anyway. The kit README, step 5.
 */
const liveConsentBlock =
  `try{var c=localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)});` +
  `if(c!=="granted"&&c!=="denied")document.documentElement.setAttribute("data-live-block","")}catch(e){}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.nameHe} | איתור נזילות תרמי בגוש דן והמרכז`,
    template: `%s | ${site.nameHe}`,
  },
  description: site.description,
  applicationName: site.nameHe,
  keywords: [
    "איתור נזילות",
    "איתור נזילות תרמי",
    "מצלמה תרמית",
    "איתור רטיבות",
    "דו״ח תרמוגרפי",
    "בדיקת לוח חשמל",
    "נזילה בקיר",
    "איתור נזילות ללא הרס",
  ],
  authors: [{ name: site.nameHe }],
  creator: site.nameHe,
  // No layout-level canonical: every indexable page sets its own, and a layout default would
  // leak a homepage canonical onto pages that deliberately omit one (e.g. the noindex /thank-you/).
  verification: { google: "BxQI2a7Ich4zF5TWYlTsXPCi7iAueoYlddQLGxW62p0" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.domain,
    siteName: site.nameHe,
    title: `${site.nameHe} | איתור נזילות תרמי`,
    description: site.description,
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: `${site.nameHe} — איתור נזילות תרמי` },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.nameHe} | איתור נזילות תרמי`,
    description: site.description,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }] },
  category: "business",
};

export const viewport: Viewport = {
  themeColor: "#0b3d5c",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} ${assistant.variable}`}
      // The live surfaces' head scripts (fleet live-kit) set data-live* on <html> before hydration.
      suppressHydrationWarning
    >
      {/*
        An explicit <head> for one reason: the live surfaces' inline scripts (CLAUDE.md §14) must
        run before first paint — they pick the announcement line, mark calm pages and hold the card
        back while the consent question is unanswered. This is Next 16's documented pattern for
        client-only state (node_modules/next/dist/docs/01-app/02-guides/
        preventing-flash-before-hydration.md, "Themes"); Next still merges the metadata above into
        this element. GTM keeps loading afterInteractive (components/Analytics.tsx), so nothing
        third-party moves into <head>.
      */}
      <head>
        <LiveHead />
        {/* After LiveHead (which must stay first): "no card until the consent question is
            answered" — set before first paint, only for a visitor with no stored answer. */}
        <script id="live-consent-block" dangerouslySetInnerHTML={{ __html: liveConsentBlock }} />
      </head>
      <body className="flex min-h-screen flex-col bg-white text-ink antialiased">
        <JsonLd data={localBusinessJsonLd()} />
        <JsonLd data={webSiteJsonLd()} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          דלג לתוכן המרכזי
        </a>
        <Analytics />
        {/* The announcement bar: after the skip link, above the sticky header, in flow and NOT
            sticky — it scrolls away (CLAUDE.md §14). */}
        <LiveTopBar />
        <Navbar />
        {/* The StickyContact spacer belongs on the FOOTER, not here. With `pb-20` on <main> the
            footer still sat flush to the viewport bottom and the fixed bar covered its last row —
            which holds the site's only links to /accessibility/ and /privacy/. See Footer.tsx. */}
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <StickyContact />
        <ConsentBanner />
        {/* The seasonal card: a closed native <dialog>, opened only by /assets/live.js. */}
        <LiveDialogs />
      </body>
    </html>
  );
}
