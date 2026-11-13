import Link from "next/link";
import type { NavLink } from "@/lib/site";

// A row of link chips — the city page's «אזורים סמוכים» markup, shared by every block that links into
// the location silo (the service pages, the /services/ hub). `min-h-11` keeps each chip at the 44 px
// tap-target floor; the old chip was ~34 px. `data-shared-block` marks the list as a block rendered
// the same way on other routes, so the content-standards §1 word count can strip it.
export default function CityChips({
  title,
  titleClassName = "text-lg font-bold text-brand",
  lead,
  links,
  className = "",
}: {
  title?: string;
  // Match the surrounding h2s: text-xl on the service pages and /services/, text-lg on a city page.
  titleClassName?: string;
  lead?: string;
  links: NavLink[];
  className?: string;
}) {
  if (links.length === 0) return null;
  return (
    <div className={className}>
      {title ? <h2 className={titleClassName}>{title}</h2> : null}
      {lead ? (
        <p className="mt-2 text-sm leading-relaxed text-ink/75">{lead}</p>
      ) : null}
      <ul data-shared-block className="mt-3 flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex min-h-11 items-center rounded-full border border-ink/15 px-4 text-sm font-semibold text-brand transition hover:border-brand/40 hover:bg-brand/5"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
