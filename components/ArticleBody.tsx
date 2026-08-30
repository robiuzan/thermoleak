import Link from "next/link";
import { Info, TriangleAlert } from "lucide-react";
import type { Block } from "@/lib/articles";

// Renders the typed block model from lib/articles.ts. Keeping rendering in one place is what lets
// the FAQPage schema be DERIVED from the same blocks — copy and schema cannot drift.
export default function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`;

        switch (block.kind) {
          case "answer":
            // The AEO answer block: question-form heading, complete answer in the first sentence,
            // first in the DOM. docs/content-standards.md §5.
            return (
              <div key={key} className="mb-8 rounded-2xl border-s-4 border-brand bg-paper p-6">
                <h2 className="text-xl font-bold text-brand">{block.q}</h2>
                <p className="mt-3 leading-relaxed text-ink/80">{block.a}</p>
              </div>
            );

          case "heading":
            return (
              <h2 key={key} className="mt-10 mb-3 text-xl font-bold text-brand">
                {block.text}
              </h2>
            );

          case "paragraph":
            return (
              <p key={key} className="mb-4 leading-relaxed text-ink/80">
                {block.text}
              </p>
            );

          case "list": {
            const Tag = block.ordered ? "ol" : "ul";
            return (
              <Tag
                key={key}
                className={`mb-4 space-y-2 ps-6 ${block.ordered ? "list-decimal" : "list-disc"}`}
              >
                {block.items.map((item) => (
                  <li key={item.slice(0, 32)} className="leading-relaxed text-ink/80">
                    {item}
                  </li>
                ))}
              </Tag>
            );
          }

          case "table":
            // Wide content scrolls in its own container so the page body never scrolls sideways
            // (WCAG 1.4.10 Reflow; docs/mobile-ux-and-personalization.md §3).
            return (
              <div key={key} className="mb-6 overflow-x-auto rounded-2xl border border-ink/10">
                <table className="w-full min-w-[34rem] border-collapse text-sm">
                  <thead>
                    <tr className="bg-paper">
                      {block.head.map((cell) => (
                        <th
                          key={cell}
                          scope="col"
                          className="border-b border-ink/10 p-3 text-start font-bold text-brand"
                        >
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row) => (
                      <tr key={row[0]} className="border-b border-ink/10 last:border-0">
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cell}
                            className={`p-3 align-top leading-relaxed ${
                              cellIndex === 0 ? "font-semibold text-brand" : "text-ink/75"
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "callout": {
            const warn = block.tone === "warn";
            const Icon = warn ? TriangleAlert : Info;
            return (
              <div
                key={key}
                className={`mb-6 flex items-start gap-3 rounded-2xl border p-5 ${
                  warn ? "border-accent-strong/30 bg-accent/10" : "border-brand/20 bg-brand/5"
                }`}
              >
                <Icon
                  className={`mt-0.5 size-5 shrink-0 ${warn ? "text-accent-strong" : "text-brand"}`}
                  aria-hidden="true"
                />
                <p className="text-sm leading-relaxed text-ink/80">{block.text}</p>
              </div>
            );
          }

          case "faq":
            // Native <details>: every answer ships in the DOM with zero JS, which is what keeps the
            // FAQPage schema honest and the content extractable by answer engines.
            return (
              <div key={key} className="mt-10">
                <h2 className="mb-4 text-xl font-bold text-brand">שאלות נוספות</h2>
                <div className="divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 bg-white">
                  {block.items.map((item) => (
                    <details key={item.q} className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-base font-bold text-brand [&::-webkit-details-marker]:hidden">
                        {item.q}
                        <span className="text-accent-strong transition-transform group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="px-5 pb-5 text-sm leading-relaxed text-ink/75">{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            );

          default:
            return null;
        }
      })}
    </>
  );
}

export function RelatedServices({ slugs }: { slugs: { href: string; label: string }[] }) {
  return (
    <p className="mt-10 leading-relaxed text-ink/80">
      רוצים שנטפל בזה?{" "}
      {slugs.map((item, index) => (
        <span key={item.href}>
          {index > 0 ? " · " : ""}
          <Link href={item.href} className="font-semibold text-brand underline underline-offset-2">
            {item.label}
          </Link>
        </span>
      ))}
    </p>
  );
}
