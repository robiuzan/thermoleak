import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Service } from "@/lib/services";

export default function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col rounded-2xl border border-ink/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-md"
    >
      <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-lg font-bold text-brand">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">{service.summary}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-strong transition-all group-hover:gap-2">
        פרטים נוספים
        <ArrowLeft className="size-4" aria-hidden="true" />
      </span>
    </Link>
  );
}
