import { Phone, Mail, MapPin, Clock } from "lucide-react";
import {
  site,
  telHref,
  mailHref,
  whatsappHref,
  defaultWhatsappMessage,
} from "@/lib/site";
import Container from "./Container";
import ContactForm from "./ContactForm";
import EmailOff from "./EmailOff";
import WhatsappIcon from "./WhatsappIcon";

export default function ContactCTA() {
  return (
    <section id="contact" className="py-16 md:py-20">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="mb-2 text-sm font-bold tracking-wide text-accent-strong">צור קשר</p>
          <h2 className="text-2xl font-extrabold text-brand sm:text-3xl">
            דברו איתנו — נשמח לעזור
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed text-ink/70">
            יש לכם נזילה, רטיבות או חשד לתקלה? התקשרו, שלחו וואטסאפ או השאירו פרטים — ונחזור אליכם
            במהירות עם פתרון מקצועי.
          </p>

          <div className="mt-6 space-y-3">
            <a
              href={telHref}
              data-cta="finalcta-call"
              className="flex items-center gap-4 rounded-xl border border-ink/10 bg-white p-4 transition-colors hover:border-brand/30"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Phone className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm text-ink/60">חייגו אלינו</span>
                <span className="block font-bold text-brand" dir="ltr">
                  {site.phone.display}
                </span>
              </span>
            </a>

            <a
              href={whatsappHref(defaultWhatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="finalcta-whatsapp"
              className="flex items-center gap-4 rounded-xl border border-ink/10 bg-white p-4 transition-colors hover:border-brand/30"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-lg bg-[#25D366]/15 text-[#0e7468]">
                <WhatsappIcon className="size-5" />
              </span>
              <span>
                <span className="block text-sm text-ink/60">שליחת הודעה</span>
                <span className="block font-bold text-brand">וואטסאפ</span>
              </span>
            </a>

            <EmailOff>
              <a
                href={mailHref}
                data-cta="finalcta-email"
                className="flex items-center gap-4 rounded-xl border border-ink/10 bg-white p-4 transition-colors hover:border-brand/30"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Mail className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm text-ink/60">אימייל</span>
                  <span className="block font-bold text-brand" dir="ltr">
                    {site.email}
                  </span>
                </span>
              </a>
            </EmailOff>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-ink/10 bg-white p-4">
                <span className="flex items-center gap-2 text-sm font-bold text-brand">
                  <Clock className="size-4" aria-hidden="true" />
                  שעות פעילות
                </span>
                <ul className="mt-2 space-y-1 text-sm text-ink/70">
                  {site.hours.map((entry) => (
                    <li key={entry.days}>
                      {entry.days}: {entry.time}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-ink/10 bg-white p-4">
                <span className="flex items-center gap-2 text-sm font-bold text-brand">
                  <MapPin className="size-4" aria-hidden="true" />
                  אזור שירות
                </span>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{site.serviceAreaText}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-sm">
          <h3 className="text-lg font-bold text-brand">השאירו פרטים ונחזור אליכם</h3>
          <p className="mt-1 text-sm text-ink/60">מענה מהיר, ללא התחייבות.</p>
          <div className="mt-4">
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
