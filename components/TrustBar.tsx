import { site } from "@/lib/site";
import Container from "./Container";

const stats = [site.stats.years, site.stats.jobs, site.stats.firstVisit, site.stats.rating];

export default function TrustBar() {
  return (
    <section aria-label="נתונים ואמון" className="border-b border-ink/10 bg-paper">
      <Container className="grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-extrabold text-brand sm:text-4xl">{stat.value}</p>
            <p className="mt-1 text-sm text-ink/70">{stat.label}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
