import { methodExplainer } from "@/lib/services";
import Container from "./Container";
import SectionHeading from "./SectionHeading";

// Homepage definition block: what thermal leak detection is — and, deliberately, what the camera
// cannot see. The honest-limits framing is positioning, not hedging (docs/content-standards.md §7).
export default function MethodExplainer() {
  return (
    <section className="py-16 md:py-20">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow={methodExplainer.eyebrow} title={methodExplainer.title} />
        <div className="mt-6 space-y-4">
          {methodExplainer.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="leading-relaxed text-ink/80">
              {paragraph}
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}
