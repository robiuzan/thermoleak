import Link from "next/link";
import type { LinkLead as LinkLeadData } from "@/lib/site";

// A lead sentence followed by descriptive in-copy links: the one rendering of every prose link block
// (a service's `related`, an article's `related` block, the hub links). Anchors are descriptive Hebrew
// labels from lib/ — never «לחצו כאן» (the internal-linking skill §3).
export default function LinkLead({
  lead,
  links,
  tail,
  className = "",
}: LinkLeadData & { className?: string }) {
  return (
    <p className={`leading-relaxed text-ink/80 ${className}`}>
      {lead}{" "}
      {links.map((link, index) => (
        <span key={link.href}>
          {index > 0 ? " · " : ""}
          <Link
            href={link.href}
            className="font-semibold text-brand underline underline-offset-2"
          >
            {link.label}
          </Link>
        </span>
      ))}
      {tail}
    </p>
  );
}
