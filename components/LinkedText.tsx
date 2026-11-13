import Link from "next/link";
import type { LinkedText as LinkedTextType } from "@/lib/site";

// A paragraph whose links sit inside the sentence (hub prose). The copy lives in lib/ as
// text runs and { label, href } links; this only renders them.
export default function LinkedText({
  text,
  className = "",
}: {
  text: LinkedTextType;
  className?: string;
}) {
  return (
    <p className={`leading-relaxed text-ink/80 ${className}`}>
      {text.map((part, index) =>
        typeof part === "string" ? (
          <span key={index}>{part}</span>
        ) : (
          <Link
            key={part.href}
            href={part.href}
            className="font-semibold text-brand underline underline-offset-2"
          >
            {part.label}
          </Link>
        ),
      )}
    </p>
  );
}
