import type { Metadata } from "next";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ServicePillars from "@/components/ServicePillars";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import ContactCTA from "@/components/ContactCTA";
import JsonLd from "@/components/JsonLd";
import { generalFaqs } from "@/lib/faqs";
import { faqPageJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "איתור נזילות תרמי, רטיבות ובדיקות תרמוגרפיה",
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
      <ServicePillars />
      <Process />
      <Testimonials limit={3} />
      <Faq faqs={generalFaqs} eyebrow="שאלות נפוצות" title="שאלות שחשוב שתדעו" />
      <ContactCTA />
    </>
  );
}
