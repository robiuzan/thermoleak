import Image from "next/image";
import { Phone, ShieldCheck, Clock, BadgeCheck } from "lucide-react";
import { site, telHref, whatsappHref, defaultWhatsappMessage } from "@/lib/site";
import Container from "./Container";
import CtaButton from "./CtaButton";
import WhatsappIcon from "./WhatsappIcon";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,106,61,0.28),transparent_55%)]"
      />
      <Container className="relative grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white">
            <BadgeCheck className="size-4 text-accent" aria-hidden="true" />
            {site.stats.years.value} שנות ניסיון · {site.address.region}
          </p>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            {site.tagline}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            {site.pitch}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <CtaButton
              href={telHref}
              variant="accent"
              size="lg"
              dataCta="hero-call"
              ariaLabel={`התקשרו אלינו: ${site.phone.display}`}
            >
              <Phone className="size-5" aria-hidden="true" />
              חייגו עכשיו: {site.phone.display}
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
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white/85">
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-accent" aria-hidden="true" />
              {site.guarantee}
            </li>
            <li className="flex items-center gap-2">
              <Clock className="size-5 text-accent" aria-hidden="true" />
              זמינות מהירה
            </li>
            <li className="flex items-center gap-2">
              <BadgeCheck className="size-5 text-accent" aria-hidden="true" />
              ללא הרס מיותר
            </li>
          </ul>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <Image
            src="/images/hero.webp"
            alt="טכנאי טרמוליק מבצעים איתור נזילה בדירה בעזרת מצלמה תרמית וציוד אקוסטי"
            width={828}
            height={670}
            priority
            className="h-auto w-full rounded-3xl ring-1 ring-white/20"
          />
        </div>
      </Container>
    </section>
  );
}
