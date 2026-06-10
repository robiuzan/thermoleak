import type { Metadata } from "next";
import { site } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import PageHero from "@/components/PageHero";
import ContactCTA from "@/components/ContactCTA";
import Container from "@/components/Container";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "צור קשר",
  description:
    "צרו קשר עם טרמוליק לאיתור נזילות, רטיבות ובדיקות תרמוגרפיה בגוש דן והמרכז. טלפון, וואטסאפ או טופס — מענה מהיר ושירות חירום.",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "בית", url: "/" },
          { name: "צור קשר", url: "/contact" },
        ])}
      />
      <PageHero
        title="צרו איתנו קשר"
        subtitle="נשמח לעזור לכם לאתר את מקור הבעיה. זמינים בטלפון, בוואטסאפ ובטופס."
        crumbs={[
          { name: "בית", href: "/" },
          { name: "צור קשר", href: "/contact" },
        ]}
      />
      <ContactCTA />
      <section className="border-t border-ink/10 bg-paper py-10">
        <Container className="text-center text-ink/70">
          <p className="font-semibold text-brand">{site.emergencyNote}</p>
          <p className="mt-1 text-sm">{site.serviceAreaText}</p>
        </Container>
      </section>
    </>
  );
}
