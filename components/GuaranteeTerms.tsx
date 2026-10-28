import { ShieldCheck } from "lucide-react";
import { site } from "@/lib/site";
import Container from "./Container";

// The guarantee, with its scope stated. Confirmed 2026-08-24 (docs/business-facts.md §C).
// This block exists because "לא מצאנו — לא שילמתם" was the site's strongest commercial promise and
// its largest undefined liability — no definition of "found", no exclusions, no call-out policy.
// A bounded promise converts better than a vague one. Do not rewrite these into slogans.
export default function GuaranteeTerms() {
  const terms = site.guaranteeTerms;

  return (
    <section
      id="guarantee"
      className="scroll-mt-20 border-t border-ink/10 bg-paper py-14 md:py-16"
    >
      <Container className="max-w-3xl">
        <div className="flex items-start gap-3">
          <ShieldCheck
            className="mt-1 size-7 shrink-0 text-accent-strong"
            aria-hidden="true"
          />
          <div>
            <h2 className="text-2xl font-extrabold text-brand">
              {site.guarantee}
            </h2>
            <p className="mt-2 leading-relaxed text-ink/70">
              זו התחייבות, ולכן היא מוגדרת — כדי שתדעו בדיוק מה היא כוללת ומה
              לא, לפני שאתם מזמינים.
            </p>
          </div>
        </div>

        <dl className="mt-8 space-y-5">
          {[
            { term: "מה נחשב איתור", desc: terms.whatCounts },
            { term: "אם לא אותר מקור", desc: terms.ifNotFound },
            { term: "מה לא נכלל", desc: terms.excluded },
            { term: "מתי האחריות אינה חלה", desc: terms.exceptions },
          ].map((row) => (
            <div
              key={row.term}
              className="rounded-xl border border-ink/10 bg-white p-5"
            >
              <dt className="font-bold text-brand">{row.term}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink/75">
                {row.desc}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
