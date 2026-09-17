import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { locations } from "@/lib/locations";
import { site, pageOpenGraph } from "@/lib/site";
import { collectionPageJsonLd } from "@/lib/jsonld";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import ContactCTA from "@/components/ContactCTA";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "אזורי שירות — איתור נזילות בגוש דן והמרכז",
  description:
    "היכן אנחנו עובדים: איתור נזילות ורטיבות במצלמה תרמית בגוש דן והמרכז, ושירות ארצי בתיאום מראש. שירות עד בית הלקוח, ללא צורך להגיע למשרד.",
  alternates: { canonical: "/locations/" },
  ...pageOpenGraph({ path: "/locations", title: `אזורי שירות — איתור נזילות בגוש דן והמרכז | ${site.nameHe}`, description: "היכן אנחנו עובדים: איתור נזילות ורטיבות במצלמה תרמית בגוש דן והמרכז, ושירות ארצי בתיאום מראש. שירות עד בית הלקוח, ללא צורך להגיע למשרד." }),
};

export default function LocationsPage() {
  return (
    <>
      <JsonLd
        data={collectionPageJsonLd({
          path: "/locations",
          name: "אזורי שירות — טרמוליק",
          description: metadata.description as string,
        })}
      />

      <PageHero
        title="אזורי שירות"
        subtitle={site.serviceAreaText}
        crumbs={[
          { name: "בית", href: "/" },
          { name: "אזורי שירות", href: "/locations" },
        ]}
      />

      <section className="py-14 md:py-20">
        <Container className="max-w-3xl">
          <p className="leading-relaxed text-ink/80">
            אנחנו עובדים בכל גוש דן והמרכז — {site.address.note}. המרחק משפיע על זמינות ולא על
            איכות הבדיקה: באזור הקרוב נשתדל להגיע באותו יום לנזילה פעילה, ובמרחק גדול יותר נתאם
            מועד. אם היישוב שלכם לא מופיע כאן, עדיין שווה להתקשר — אנחנו נותנים שירות ארצי בתיאום
            מראש.
          </p>

          {locations.length > 0 ? (
            <>
              <h2 className="mt-10 text-xl font-bold text-brand">עמודי אזור</h2>
              <ul className="mt-4 space-y-3">
                {locations.map((location) => (
                  <li key={location.slug}>
                    <Link
                      href={`/locations/${location.slug}/`}
                      className="group flex items-start gap-4 rounded-2xl border border-ink/10 bg-white p-5 transition hover:border-brand/30 hover:shadow-md"
                    >
                      <span className="flex-1">
                        <span className="block font-bold text-brand">
                          איתור נזילות {location.prefixed}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-ink/70">
                          {location.claims[0]?.text}
                        </span>
                      </span>
                      <ArrowLeft
                        className="mt-1 size-4 shrink-0 text-accent-strong transition-transform group-hover:-translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <h2 className="mt-10 text-xl font-bold text-brand">כל היישובים שאנחנו מכסים</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {site.serviceAreas.map((area) => (
              <li
                key={area}
                className="rounded-full border border-ink/15 px-4 py-1.5 text-sm text-ink/75"
              >
                {area}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-ink/70">
            רשימה זו אינה סגורה. {site.emergencyNote}.
          </p>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
