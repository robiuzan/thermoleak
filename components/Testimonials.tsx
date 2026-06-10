import { Star } from "lucide-react";
import { reviews, averageRating, reviewCount } from "@/lib/reviews";
import Container from "./Container";
import SectionHeading from "./SectionHeading";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`דירוג ${rating} מתוך 5`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={`size-4 ${value <= rating ? "fill-amber-400 text-amber-400" : "text-ink/20"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export interface TestimonialsProps {
  limit?: number;
  showHeading?: boolean;
}

export default function Testimonials({ limit, showHeading = true }: TestimonialsProps) {
  const items = typeof limit === "number" ? reviews.slice(0, limit) : reviews;

  return (
    <section className="py-16 md:py-20">
      <Container>
        {showHeading ? (
          <SectionHeading
            eyebrow="לקוחות ממליצים"
            title="מה הלקוחות שלנו אומרים"
            subtitle={`דירוג ממוצע ${averageRating} מתוך 5 על בסיס ${reviewCount} חוות דעת.`}
          />
        ) : null}
        <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${showHeading ? "mt-10" : ""}`}>
          {items.map((review) => (
            <figure
              key={`${review.name}-${review.text.slice(0, 12)}`}
              className="flex flex-col rounded-2xl border border-ink/10 bg-white p-6 shadow-sm"
            >
              <Stars rating={review.rating} />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink/80">
                {review.text}
              </blockquote>
              <figcaption className="mt-4 border-t border-ink/10 pt-4 text-sm">
                <span className="font-bold text-brand">{review.name}</span>
                <span className="text-ink/60">
                  {" "}
                  · {review.location} · {review.service}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
