import { Check } from "lucide-react";
import { site } from "@/lib/site";

// Confirmed facts only (business-facts §A–§C): the founder's field experience, the three credentials
// and the tax invoice. Plain text items with a neutral check — no BadgeCheck, no seals. It NEVER renders
// site.guarantee: the guarantee beside credentials borrows their verifiability (finding EEAT-6), and it
// has its own linked terms. The electrician licence is not here either; it is stated in text on the
// panel page only (business-facts §H).
const experience = `${site.stats.years.value} ${site.stats.years.label}`;
const facts = [
  ...site.credentials,
  ...(site.issuesTaxInvoice ? [site.trustRow.taxInvoice] : []),
];

export default function TrustRow({
  className = "",
  withExperience = true,
}: {
  className?: string;
  // The homepage TrustBar already shows the experience as a tile, so it leaves it out here.
  withExperience?: boolean;
}) {
  const items = withExperience ? [experience, ...facts] : facts;
  return (
    <ul
      aria-label={site.trustRow.label}
      data-shared-block
      className={`flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink/75 ${className}`}
    >
      {items.map((item) => (
        <li key={item} className="flex items-center gap-1.5">
          <Check className="size-4 shrink-0 text-brand" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}
