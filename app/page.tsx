import type { Metadata } from "next";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import MethodExplainer from "@/components/MethodExplainer";
import ServicePillars from "@/components/ServicePillars";
import ServiceChooser from "@/components/ServiceChooser";
import Process from "@/components/Process";
import Gallery from "@/components/Gallery";
import Faq from "@/components/Faq";
import ContactCTA from "@/components/ContactCTA";
import JsonLd from "@/components/JsonLd";
import { LiveUpdates } from "@/components/live/Live";
import { generalFaqs } from "@/lib/faqs";
import { faqPageJsonLd } from "@/lib/jsonld";
import { site, pageOpenGraph } from "@/lib/site";

// A layout's title.template does NOT apply to that segment's own page, so this must be the complete
// rendered title — brand included, exactly once (the live bug fixed 2026-08-17; backlog §2.1). It
// carries the head term «איתור נזילות» and the region, and stays off «איתור נזילות מים», which the
// water-leak page owns (docs/seo-geo-aeo-strategy.md §2).
const title = `איתור נזילות תרמי ורטיבות ${site.address.regionPrefixed} | ${site.nameHe}`;
// Was «…עם אחריות ודו״ח לחברות הביטוח. חייגו לאיתור מהיר…» — an unqualified guarantee, a report
// with every visit and a speed claim (business-facts §H).
const description = `איתור נזילות ורטיבות ${site.address.regionPrefixed}, בלי לשבור קירות: סריקה במצלמה תרמית ואימות במדידה משלימה. ביקור איתור החל מ-₪${site.priceFrom}, והמחיר נמסר מראש. חייגו ${site.phone.display}.`;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  ...pageOpenGraph({ path: "/", title, description }),
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(generalFaqs)} />
      <Hero />
      <TrustBar />
      <MethodExplainer />
      {/* The updates strip (fleet live-kit, CLAUDE.md §14): after the definition block, never
          between the hero and its trust bar. Server-rendered; it hides itself (before first
          paint) 45 days after the newest item in content/live/_updates.mjs. */}
      <LiveUpdates />
      <ServicePillars />
      <ServiceChooser />
      <Process />
      {/* The four steps, then what a visit looks like: white between Process and the FAQ, which
          are both bg-paper. Far below the fold, so its lazy images never touch LCP. */}
      <Gallery route="/" allImagesLink />
      <Faq
        faqs={generalFaqs}
        eyebrow="שאלות נפוצות"
        title="שאלות שחשוב שתדעו"
      />
      <ContactCTA />
    </>
  );
}
