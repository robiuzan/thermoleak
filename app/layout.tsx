import type { Metadata, Viewport } from "next";
import "./globals.css";
import { heebo, assistant } from "./fonts";
import { site } from "@/lib/site";
import { localBusinessJsonLd, webSiteJsonLd } from "@/lib/jsonld";
import JsonLd from "@/components/JsonLd";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyContact from "@/components/StickyContact";

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
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.domain,
    siteName: site.nameHe,
    title: `${site.nameHe} | איתור נזילות תרמי`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.nameHe} | איתור נזילות תרמי`,
    description: site.description,
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
    <html lang="he" dir="rtl" className={`${heebo.variable} ${assistant.variable}`}>
      <body className="flex min-h-screen flex-col bg-white text-ink antialiased">
        <JsonLd data={localBusinessJsonLd()} />
        <JsonLd data={webSiteJsonLd()} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          דלג לתוכן המרכזי
        </a>
        <Navbar />
        <main id="main" className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
        <Footer />
        <StickyContact />
      </body>
    </html>
  );
}
