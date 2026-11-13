import Link from "next/link";
import { Phone, PhoneCall, ShieldCheck, BadgeCheck } from "lucide-react";
import {
  site,
  telHref,
  whatsappHref,
  defaultWhatsappMessage,
} from "@/lib/site";
import { heroPicker } from "@/lib/services";
import { imageFor } from "@/lib/images";
import Container from "./Container";
import CtaButton from "./CtaButton";
import Figure from "./Figure";
import WhatsappIcon from "./WhatsappIcon";

export default function Hero() {
  // The manifest's `main` on `/`: the page's single LCP image, in a frame of its own.
  const heroImage = imageFor("/", "main");

  return (
    <section className="on-dark relative overflow-hidden bg-brand text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,106,61,0.28),transparent_55%)]"
      />
      <Container className="relative grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        <div>
          {/* «בשטח» is load-bearing: 20+ is the founder's field experience, not the company's age
              (founded 2015). The eyebrow used to drop it. */}
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white">
            <BadgeCheck className="size-4 text-accent" aria-hidden="true" />
            {site.stats.years.value} {site.stats.years.label}
          </p>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            {site.tagline}
          </h1>
          {/* The entity line: brand + service + region, visible (the H1 stays the slogan). */}
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            {site.pitch}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {/* No ariaLabel: the visible text already reads "חייגו עכשיו: 055-660-1006", which is a
                complete accessible name. An aria-label of "התקשרו אלינו…" would REPLACE it and drop
                the visible words — a WCAG 2.5.3 (Label in Name) failure. */}
            <CtaButton
              href={telHref}
              variant="accent"
              size="lg"
              dataCta="hero-call"
            >
              <Phone className="size-5" aria-hidden="true" />
              חייגו עכשיו:{" "}
              <span dir="ltr" className="whitespace-nowrap">
                {site.phone.display}
              </span>
            </CtaButton>
            <CtaButton
              href={whatsappHref(defaultWhatsappMessage)}
              variant="whatsapp"
              size="lg"
              dataCta="hero-whatsapp"
            >
              <WhatsappIcon className="size-5" />
              שליחת וואטסאפ
            </CtaButton>
          </div>
          <ul className="mt-5 flex flex-col gap-1 text-sm font-medium text-white/85">
            <li>
              {/* The framework's "emergency" option, in the only wording on file: the owner
                  confirmed the sentence itself 2026-10-28 — not a response time, not a dispatch
                  promise, not 24/7 (business-facts §D). Same number as the call button. */}
              <a
                href={telHref}
                data-cta="hero-emergency-call"
                className="inline-flex min-h-11 items-center gap-2 underline underline-offset-2 transition-colors hover:text-white"
              >
                <PhoneCall
                  className="size-5 shrink-0 text-accent"
                  aria-hidden="true"
                />
                {site.emergencyNote}
              </a>
            </li>
            <li>
              {/* The strongest claim on the site, one click from the terms that bound it (cro-4 /
                  EEAT-4). It stays apart from any credential (EEAT-6). */}
              <Link
                href="/pricing/#guarantee"
                className="inline-flex min-h-11 items-center gap-2 underline underline-offset-2 transition-colors hover:text-white"
              >
                <ShieldCheck
                  className="size-5 shrink-0 text-accent"
                  aria-hidden="true"
                />
                {site.guarantee}
              </Link>
            </li>
          </ul>

          {/* The quick selector: four problems → four service pages. Server-rendered links, no
              client state; each tap target is ≥44 px. */}
          <p id="hero-pick" className="mt-6 text-sm font-semibold text-white">
            {heroPicker.label}
          </p>
          <ul
            aria-labelledby="hero-pick"
            className="mt-2 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap"
          >
            {heroPicker.items.map((item) => (
              <li key={item.service}>
                <Link
                  href={`/services/${item.service}/`}
                  data-cta={`hero-pick-${item.service}`}
                  className="flex min-h-11 items-center justify-center rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-white/20"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          {heroImage ? (
            <Figure
              image={heroImage}
              priority
              bare
              imageClassName="h-auto w-full rounded-3xl ring-1 ring-white/20"
            />
          ) : null}
        </div>
      </Container>
    </section>
  );
}
