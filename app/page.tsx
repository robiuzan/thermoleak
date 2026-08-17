import type { Metadata } from "next";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import MethodExplainer from "@/components/MethodExplainer";
import ServicePillars from "@/components/ServicePillars";
import Process from "@/components/Process";
import Faq from "@/components/Faq";
import ContactCTA from "@/components/ContactCTA";
import JsonLd from "@/components/JsonLd";
import { generalFaqs } from "@/lib/faqs";
import { faqPageJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  // A layout's title.template does NOT apply to that segment's own page, so this must be the
  // complete rendered title — brand included. A bare subject here ships with no brand at all
  // (the live bug fixed 2026-08-17; docs/optimization-backlog.md §2.1).
  title: "איתור נזילות תרמי, רטיבות ובדיקות תרמוגרפיה | טרמוליק",
  description:
    "איתור נזילות מים ורטיבות במצלמה תרמית בגוש דן והמרכז — ללא הרס, עם אחריות ודו״ח לחברות הביטוח. חייגו לאיתור מהיר ומדויק.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(generalFaqs)} />
      <Hero />
      <TrustBar />
      <MethodExplainer />
      <ServicePillars />
      <Process />
      <Faq faqs={generalFaqs} eyebrow="שאלות נפוצות" title="שאלות שחשוב שתדעו" />
      <ContactCTA />
    </>
  );
}
