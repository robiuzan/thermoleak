import { ChevronDown } from "lucide-react";
import type { ServiceFaq } from "@/lib/services";
import Container from "./Container";
import SectionHeading from "./SectionHeading";

export interface FaqProps {
  faqs: ServiceFaq[];
  title?: string;
  eyebrow?: string;
  withBackground?: boolean;
}

export default function Faq({
  faqs,
  title = "שאלות נפוצות",
  eyebrow,
  withBackground = true,
}: FaqProps) {
  return (
    <section className={`py-16 md:py-20 ${withBackground ? "bg-paper" : ""}`}>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} />
        <div className="mx-auto mt-8 max-w-3xl divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 bg-white">
          {faqs.map((faq) => (
            <details key={faq.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-base font-bold text-brand [&::-webkit-details-marker]:hidden">
                {faq.q}
                <ChevronDown
                  className="size-5 shrink-0 text-accent-strong transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-ink/75">{faq.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
