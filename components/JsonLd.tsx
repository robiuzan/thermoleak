// Renders a JSON-LD <script>. Data is controlled (built in lib/jsonld.ts), not user input.
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
