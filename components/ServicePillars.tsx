import { services, servicePillars } from "@/lib/services";
import Container from "./Container";
import LinkLead from "./LinkLead";
import SectionHeading from "./SectionHeading";
import ServiceCard from "./ServiceCard";

export default function ServicePillars() {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionHeading
          eyebrow={servicePillars.eyebrow}
          title={servicePillars.title}
          subtitle={servicePillars.subtitle}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
        {/* A permanent in-body link into the location silo — the updates strip, which used to be the
            homepage's only one, hides itself 45 days after its newest item. */}
        <LinkLead
          lead={servicePillars.areas.lead}
          links={servicePillars.areas.links}
          className="mx-auto mt-8 max-w-3xl text-center"
        />
      </Container>
    </section>
  );
}
