import { services } from "@/lib/services";
import Container from "./Container";
import SectionHeading from "./SectionHeading";
import ServiceCard from "./ServiceCard";

export default function ServicePillars() {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionHeading
          eyebrow="השירותים שלנו"
          title="פתרונות איתור תרמי לכל בעיה"
          subtitle="מאיתור נזילות מים נסתרות ועד דו״ח מקצועי לחברת הביטוח — הכול בעזרת מצלמה תרמית, ללא הרס מיותר."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </Container>
    </section>
  );
}
