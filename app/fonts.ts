import { Heebo, Assistant } from "next/font/google";

// Headings — Heebo (Hebrew + Latin)
export const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  variable: "--font-heebo",
});

// Body — Assistant (Hebrew + Latin)
export const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-assistant",
});
