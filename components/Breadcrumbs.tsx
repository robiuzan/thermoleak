import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="מסלול ניווט" className="text-sm text-white/70">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1">
              {index > 0 ? (
                <ChevronLeft className="size-4 opacity-60" aria-hidden="true" />
              ) : null}
              {isLast ? (
                <span aria-current="page" className="font-semibold text-white">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-white">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
