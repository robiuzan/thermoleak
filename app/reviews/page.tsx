import type { Metadata } from "next";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import PageHero from "@/components/PageHero";
import Testimonials from "@/components/Testimonials";
import ContactCTA from "@/components/ContactCTA";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "המלצות לקוחות",
  description:
    "מה הלקוחות שלנו מספרים על שירות איתור הנזילות והרטיבות של תרמולק — דיוק, מקצועיות ושירות אדיב בכל גוש דן והמרכז.",
  alternates: { canonical: "/reviews/" },
};

export default function ReviewsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "בית", url: "/" },
          { name: "המלצות", url: "/reviews" },
        ])}
      />
      <PageHero
        title="לקוחות ממליצים"
        subtitle="בנינו את המוניטין שלנו בדיוק, אמינות ושירות — הנה מה שהלקוחות מספרים."
        crumbs={[
          { name: "בית", href: "/" },
          { name: "המלצות", href: "/reviews" },
        ]}
      />
      <Testimonials />
      <ContactCTA />
    </>
  );
}
