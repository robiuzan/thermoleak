import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { serviceChooser } from "@/lib/services";
import Container from "./Container";
import SectionHeading from "./SectionHeading";

// Homepage decision aid. Two jobs at once: it lifts the homepage over its content floor
// (backlog §3.1) and it captures the "method-confused" searcher described in
// docs/seo-geo-aeo-strategy.md §1 — someone who knows their symptom but not which service it maps
// to. Symptom-first phrasing, because that is how the visitor actually arrives.
export default function ServiceChooser() {
  return (
    <section className="bg-paper py-16 md:py-20">
      <Container>
        <SectionHeading eyebrow={serviceChooser.eyebrow} title={serviceChooser.title} />
        <p className="mx-auto mt-4 max-w-2xl text-center leading-relaxed text-ink/70">
          {serviceChooser.intro}
        </p>

        <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
          {serviceChooser.cases.map((item) => (
            <li key={item.symptom}>
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-2xl border border-ink/10 bg-white p-6 transition hover:border-brand/30 hover:shadow-md"
              >
                <span className="text-base font-bold text-brand">{item.symptom}</span>
                <span className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">
                  {item.explanation}
                </span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-strong">
                  {item.serviceLabel}
                  <ArrowLeft
                    className="size-4 transition-transform group-hover:-translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-ink/70">
          {serviceChooser.outro}
        </p>
      </Container>
    </section>
  );
}
