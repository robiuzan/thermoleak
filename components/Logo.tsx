import { site } from "@/lib/site";

export interface LogoProps {
  className?: string;
  // Color + size of the wordmark, e.g. "text-brand text-lg" or "text-white text-xl".
  wordmarkClassName?: string;
  showWordmark?: boolean;
  // Unique suffix for the gradient id (avoids duplicate ids when several logos render on one page).
  idSuffix?: string;
}

// Brand logo. The icon is an inline SVG (crisp, no extra request); the wordmark is HTML text
// so it inherits the page font and is recolorable per background. To swap in a real logo file,
// replace the <svg> below with <Image src="/logo.svg" .../> (the file lives in /public/logo.svg).
export default function Logo({
  className = "",
  wordmarkClassName = "text-brand text-lg",
  showWordmark = true,
  idSuffix = "a",
}: LogoProps) {
  const gradId = `tl-logo-${idSuffix}`;
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 64 64" className="size-9 shrink-0" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#0B3D5C" />
            <stop offset="0.55" stopColor="#1E88A8" />
            <stop offset="1" stopColor="#FF6A3D" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="14" fill="#0B3D5C" />
        <path
          d="M32 12c7 9 12 15 12 22a12 12 0 1 1-24 0c0-7 5-13 12-22z"
          fill={`url(#${gradId})`}
        />
        <circle cx="27" cy="36" r="3.2" fill="#ffffff" opacity="0.9" />
      </svg>
      {showWordmark ? (
        <span className={`font-extrabold leading-none ${wordmarkClassName}`}>{site.name}</span>
      ) : null}
    </span>
  );
}
