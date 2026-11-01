import { imageFor } from "@/lib/images";
import { methodExplainer } from "@/lib/services";
import Container from "./Container";
import Figure from "./Figure";
import SectionHeading from "./SectionHeading";

// Homepage definition block: what thermal leak detection is — and, deliberately, what the camera
// cannot see. The honest-limits framing is positioning, not hedging (docs/content-standards.md §7).
export default function MethodExplainer() {
  const image = imageFor("/", "detail");

  return (
    <section className="py-16 md:py-20">
      <Container max="3xl">
        <SectionHeading
          eyebrow={methodExplainer.eyebrow}
          title={methodExplainer.title}
        />
        <div className="mt-6 space-y-4">
          {methodExplainer.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              className="leading-relaxed text-ink/80"
            >
              {paragraph}
            </p>
          ))}
        </div>
        {image ? <Figure image={image} className="mt-8" /> : null}
      </Container>
    </section>
  );
}
