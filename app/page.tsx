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
import { home } from "@/lib/hubs";
import { pageOpenGraph } from "@/lib/site";

// The complete title (the layout template does not apply to the root page) and the description live
// in lib/hubs.ts with the reasons. The old description promised «עם אחריות ודו״ח לחברות הביטוח» and
// «איתור מהיר» — an unqualified guarantee, a report with every visit and a speed claim (§H).
export const metadata: Metadata = {
  title: { absolute: home.title },
  description: home.description,
  alternates: { canonical: "/" },
  ...pageOpenGraph({ path: "/", title: home.title, description: home.description }),
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
