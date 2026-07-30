import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { navLinks, site, telHref, mailHref } from "@/lib/site";
import { services } from "@/lib/services";
import Container from "./Container";
import EmailOff from "./EmailOff";
import Logo from "./Logo";
import WhatsappIcon from "./WhatsappIcon";
import FacebookIcon from "./FacebookIcon";
import InstagramIcon from "./InstagramIcon";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand text-white/90">
      <Container className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand + contact */}
        <div>
          <Logo onDark />
          <p className="mt-3 text-sm leading-relaxed text-white/70">{site.tagline}</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={telHref} className="inline-flex items-center gap-2 hover:text-white">
                <Phone className="size-4" aria-hidden="true" />
                {site.phone.display}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${site.whatsapp.intl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <WhatsappIcon className="size-4" />
                וואטסאפ
              </a>
            </li>
            <li>
              <EmailOff>
                <a href={mailHref} className="inline-flex items-center gap-2 hover:text-white">
                  <Mail className="size-4" aria-hidden="true" />
                  {site.email}
                </a>
              </EmailOff>
            </li>
            <li className="inline-flex items-center gap-2 text-white/70">
              <MapPin className="size-4" aria-hidden="true" />
              {site.address.region}
            </li>
          </ul>
        </div>

        {/* Services */}
        <nav aria-label="שירותים">
          <p className="text-sm font-bold uppercase tracking-wide text-white">שירותים</p>
          <ul className="mt-4 space-y-2 text-sm">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`/services/${service.slug}`} className="text-white/70 hover:text-white">
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Navigation */}
        <nav aria-label="ניווט">
          <p className="text-sm font-bold uppercase tracking-wide text-white">ניווט</p>
          <ul className="mt-4 space-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/70 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Hours + area */}
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-white">שעות פעילות</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {site.hours.map((entry) => (
              <li key={entry.days} className="flex items-center gap-2">
                <Clock className="size-4 shrink-0" aria-hidden="true" />
                <span>
                  {entry.days}: {entry.time}
                </span>
              </li>
            ))}
            <li className="pt-2 text-white/60">{site.serviceAreaText}</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/15">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-sm text-white/70 sm:flex-row">
          <p>
            © {year} {site.nameHe}. כל הזכויות שמורות.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/accessibility" className="hover:text-white">
              הצהרת נגישות
            </Link>
            <Link href="/privacy" className="hover:text-white">
              מדיניות פרטיות
            </Link>
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="פייסבוק"
              className="hover:text-white"
            >
              <FacebookIcon className="size-5" />
            </a>
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="אינסטגרם"
              className="hover:text-white"
            >
              <InstagramIcon className="size-5" />
            </a>
          </div>
        </Container>
      </div>
    </footer>
  );
}
