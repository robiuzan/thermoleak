// Mobile-only persistent bottom bar: Click-to-Call + WhatsApp. Hidden on md+.
import { Phone } from "lucide-react";
import { site, telHref, whatsappHref, defaultWhatsappMessage } from "@/lib/site";
import WhatsappIcon from "./WhatsappIcon";

export default function StickyContact() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-ink/10 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.08)] md:hidden">
      <a
        href={telHref}
        data-cta="sticky-call"
        className="flex items-center justify-center gap-2 bg-brand py-4 text-base font-bold text-white"
        aria-label={`התקשרו אלינו: ${site.phone.display}`}
      >
        <Phone className="size-5" aria-hidden="true" />
        חייגו עכשיו
      </a>
      <a
        href={whatsappHref(defaultWhatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        data-cta="sticky-whatsapp"
        className="flex items-center justify-center gap-2 bg-[#25D366] py-4 text-base font-bold text-ink"
        aria-label="שליחת הודעת וואטסאפ"
      >
        <WhatsappIcon className="size-5" />
        וואטסאפ
      </a>
    </div>
  );
}
