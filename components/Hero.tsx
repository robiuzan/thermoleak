import { Phone, ShieldCheck, Clock, BadgeCheck, Target } from "lucide-react";
import { site, telHref, whatsappHref, defaultWhatsappMessage } from "@/lib/site";
import Container from "./Container";
import CtaButton from "./CtaButton";
import WhatsappIcon from "./WhatsappIcon";

function ThermalVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl ring-1 ring-white/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,#ff6a3d_0%,#c2410c_18%,#1e88a8_48%,#0b3d5c_78%)]" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.06)_0,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_10px)]" />
      <div className="absolute end-6 top-6 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
        <span className="size-2 rounded-full bg-[#ff6a3d]" />
        סריקה תרמית
      </div>
      <div className="absolute bottom-6 start-6 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 text-sm font-bold text-brand shadow-lg">
        <Target className="size-5 text-accent-strong" aria-hidden="true" />
        מוקד נזילה אותר
      </div>
    </div>
  );
}

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
            <CtaButton href={telHref} variant="accent" size="lg" ariaLabel={`התקשרו אלינו: ${site.phone.display}`}>
              <Phone className="size-5" aria-hidden="true" />
              חייגו עכשיו: {site.phone.display}
            </CtaButton>
            <CtaButton href={whatsappHref(defaultWhatsappMessage)} variant="whatsapp" size="lg">
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
        <ThermalVisual />
      </Container>
    </section>
  );
}
