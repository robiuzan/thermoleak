import Container from "@/components/Container";
import CtaButton from "@/components/CtaButton";

export default function NotFound() {
  return (
    <section className="py-24">
      <Container className="max-w-xl text-center">
        <p className="text-6xl font-extrabold text-brand">404</p>
        <h1 className="mt-4 text-2xl font-bold text-brand">הדף לא נמצא</h1>
        <p className="mt-3 leading-relaxed text-ink/70">
          ייתכן שהקישור שגוי או שהעמוד הוסר. אפשר לחזור לדף הבית או ליצור איתנו קשר ונשמח לעזור.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <CtaButton href="/" variant="primary">
            חזרה לדף הבית
          </CtaButton>
          <CtaButton href="/contact" variant="outline">
            צור קשר
          </CtaButton>
        </div>
      </Container>
    </section>
  );
}
