export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "start" | "center";
  as?: "h1" | "h2";
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  as = "h2",
}: SectionHeadingProps) {
  const Tag = as;
  const alignClasses = align === "center" ? "mx-auto text-center" : "text-start";

  return (
    <div className={`max-w-2xl ${alignClasses}`}>
      {eyebrow ? (
        <p className="mb-2 text-sm font-bold tracking-wide text-accent-strong">{eyebrow}</p>
      ) : null}
      <Tag className="text-2xl font-extrabold text-brand sm:text-3xl md:text-4xl">{title}</Tag>
      {subtitle ? (
        <p className="mt-3 text-base leading-relaxed text-ink/70 sm:text-lg">{subtitle}</p>
      ) : null}
    </div>
  );
}
