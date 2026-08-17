import type { Metadata } from "next";
import ThankYouContent from "@/components/ThankYouContent";

// The form's post-submit destination — a URL-based conversion target for analytics/ads.
// noindex: thin by design, and a stray SERP entry would inflate conversion counts.
// Deliberately absent from app/sitemap.ts for the same reason.
export const metadata: Metadata = {
  title: "הפנייה בדרך אלינו",
  robots: { index: false, follow: true },
};

export default function ThankYouPage() {
  return <ThankYouContent />;
}
