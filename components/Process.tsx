import { PhoneCall, ScanLine, Target, FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { processSteps } from "@/lib/services";
import Container from "./Container";
import SectionHeading from "./SectionHeading";

// The copy lives in lib/services.ts (processSteps); the icons stay here, one per step, by position.
const icons: LucideIcon[] = [PhoneCall, ScanLine, Target, FileText];

export default function Process() {
  return (
    <section className="bg-paper py-16 md:py-20">
      <Container>
        <SectionHeading
          eyebrow={processSteps.eyebrow}
          title={processSteps.title}
          subtitle={processSteps.subtitle}
        />
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.steps.map((step, index) => {
            const Icon = icons[index] ?? FileText;
            return (
              <li
                key={step.title}
                className="relative rounded-2xl border border-ink/10 bg-white p-6 shadow-sm"
              >
                <span className="absolute end-5 top-5 text-4xl font-extrabold text-brand/10">
                  {index + 1}
                </span>
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-accent/15 text-accent-strong">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-bold text-brand">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{step.desc}</p>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
