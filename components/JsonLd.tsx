// Renders a JSON-LD <script>. Data is controlled (built in lib/jsonld.ts), not user input.
//
// `null` renders nothing. That is what lets a builder refuse to emit an invalid node — see
// faqPageJsonLd, which returns null rather than a FAQPage with an empty mainEntity — without every
// call site repeating the same guard.
export default function JsonLd({ data }: { data: object | null }) {
  if (data === null) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
