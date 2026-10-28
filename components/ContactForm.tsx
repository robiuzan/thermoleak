"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Send } from "lucide-react";
import { services } from "@/lib/services";
import { whatsappHref } from "@/lib/site";
import { pushEvent } from "@/lib/analytics";

interface FormState {
  name: string;
  phone: string;
  area: string;
  service: string;
  message: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

// Handoff to /thank-you/: the composed message, whether window.open succeeded, and the selected
// service — so the thank-you page can offer a manual re-open when a popup blocker swallowed the
// first attempt, and can attribute its own conversion event. The service is the <select>'s fixed
// enum; nothing else from this form may be forwarded to analytics (CLAUDE.md §12).
export const LEAD_HANDOFF_KEY = "tl-lead";

// Set by /thank-you/ once it has counted a thank_you_view, and cleared HERE on every new submit.
// Without it the event is once-per-mount, not once-per-lead: a reload of /thank-you/, or a
// back-button return to it after tapping "חזרה לדף הבית", mounts the component again and would
// count the same lead twice. thank_you_view is the cleanest Ads conversion target
// (docs/data-tracking-infrastructure.md §3), so inflating it would bid real money on a phantom.
export const THANK_YOU_COUNTED_KEY = "tl-lead-counted";

const initialState: FormState = {
  name: "",
  phone: "",
  area: "",
  service: services[0].title,
  message: "",
};

function validate(values: FormState): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "נא להזין שם מלא";

  const phoneDigits = values.phone.replace(/[-\s]/g, "");
  if (!phoneDigits) errors.phone = "נא להזין מספר טלפון";
  else if (!/^0\d{8,9}$/.test(phoneDigits))
    errors.phone = "מספר טלפון לא תקין (לדוגמה: 050-0000000)";

  if (!values.area.trim()) errors.area = "נא להזין יישוב או אזור";
  return errors;
}

const fieldClasses =
  "w-full rounded-xl border bg-white px-4 py-3 text-ink placeholder:text-ink/70 focus:border-brand focus:outline-none";

export default function ContactForm() {
  const router = useRouter();
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof FormState>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      // Move focus to the first invalid field so the error is reachable and announced.
      if (nextErrors.name) nameRef.current?.focus();
      else if (nextErrors.phone) phoneRef.current?.focus();
      else areaRef.current?.focus();
      return;
    }

    const lines = [
      "שלום, פנייה חדשה מהאתר:",
      `שם: ${values.name}`,
      `טלפון: ${values.phone}`,
      `אזור: ${values.area}`,
      `שירות: ${values.service}`,
    ];
    if (values.message.trim()) lines.push(`פרטים: ${values.message}`);
    const message = lines.join("\n");

    // window.open inside the submit gesture is normally allowed; a popup blocker returns null.
    // Either way we continue to /thank-you/, which reads this handoff and offers a manual
    // re-open — so a blocked popup can never silently lose the lead (backlog §8.1).
    const win = window.open(whatsappHref(message), "_blank");
    if (win) win.opener = null;
    const handoffOk = win !== null;

    // The lead signal, and the one event that cannot be built container-side: the outcome of the
    // handoff exists nowhere but here. Only `service` travels — it is the <select>'s fixed enum.
    // name, phone, area and message are PII and are banned from the dataLayer (CLAUDE.md §12),
    // which is also what the consent line under this form promises the visitor.
    pushEvent("lead_whatsapp_open", {
      service: values.service,
      handoff_ok: handoffOk,
    });
    // Diagnostic companion, never a key event — it fires in ADDITION to the line above.
    if (!handoffOk)
      pushEvent("lead_handoff_blocked", { service: values.service });

    try {
      sessionStorage.setItem(
        LEAD_HANDOFF_KEY,
        JSON.stringify({ message, opened: handoffOk, service: values.service }),
      );
      // A new submit is a new lead, so the thank-you page is allowed to count again.
      sessionStorage.removeItem(THANK_YOU_COUNTED_KEY);
    } catch {
      // Storage unavailable (private mode) — the thank-you page falls back to a generic link.
    }
    router.push("/thank-you/");
  }

  const errorCount = Object.keys(errors).length;

  // `method="post"` below is a PII guard, not a transport choice — nothing here ever POSTs.
  // A <form> with no method defaults to GET on the CURRENT URL, and every field carries a `name`,
  // so an UN-HYDRATED submit (JS blocked, or a chunk that 404s — CLAUDE.md §10 records that
  // happening on this stack) would navigate to
  //   /contact/?name=…&phone=…&area=…&service=…&message=…
  // with the customer's real details in the address bar. GTM then reports that URL to GA4 as
  // `page_location`, which is the SEC-3 violation reached through the URL instead of an href
  // (CLAUDE.md §12). With `method="post"` the un-hydrated path POSTs to a static asset and
  // Cloudflare Pages refuses it: the visitor sees an error rather than having their name published
  // to analytics, which is the right way round to fail.
  // Do NOT "simplify" this away — the working path never reaches it, so removing it breaks nothing
  // visibly and silently restores the leak.
  return (
    <form
      onSubmit={handleSubmit}
      method="post"
      noValidate
      className="space-y-4"
      aria-label="טופס פנייה מהירה"
    >
      {/* WCAG 4.1.3 Status Messages: focus moves to the first invalid field, but that alone does
          not tell the user HOW MANY fields failed — and on a phone the others are off-screen.
          A polite live region announces the count without stealing focus. */}
      <p role="status" aria-live="polite" className="sr-only">
        {errorCount > 0
          ? `נמצאו ${errorCount} שגיאות בטופס. נא לתקן ולשלוח שוב.`
          : ""}
      </p>

      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-semibold text-ink"
        >
          שם מלא <span className="text-accent-strong">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          ref={nameRef}
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={`${fieldClasses} ${errors.name ? "border-red-500" : "border-ink/55"}`}
        />
        {errors.name ? (
          <p id="name-error" className="mt-1 text-sm text-red-600">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-1 block text-sm font-semibold text-ink"
        >
          טלפון <span className="text-accent-strong">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
          placeholder="050-0000000"
          ref={phoneRef}
          value={values.phone}
          onChange={(event) => update("phone", event.target.value)}
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          className={`${fieldClasses} text-start ${errors.phone ? "border-red-500" : "border-ink/55"}`}
        />
        {errors.phone ? (
          <p id="phone-error" className="mt-1 text-sm text-red-600">
            {errors.phone}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="area"
          className="mb-1 block text-sm font-semibold text-ink"
        >
          יישוב / אזור <span className="text-accent-strong">*</span>
        </label>
        <input
          id="area"
          name="area"
          type="text"
          autoComplete="address-level2"
          placeholder="לדוגמה: תל אביב"
          ref={areaRef}
          value={values.area}
          onChange={(event) => update("area", event.target.value)}
          aria-invalid={errors.area ? true : undefined}
          aria-describedby={errors.area ? "area-error" : undefined}
          className={`${fieldClasses} ${errors.area ? "border-red-500" : "border-ink/55"}`}
        />
        {errors.area ? (
          <p id="area-error" className="mt-1 text-sm text-red-600">
            {errors.area}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="service"
          className="mb-1 block text-sm font-semibold text-ink"
        >
          סוג השירות
        </label>
        <select
          id="service"
          name="service"
          value={values.service}
          onChange={(event) => update("service", event.target.value)}
          className={`${fieldClasses} border-ink/55`}
        >
          {services.map((service) => (
            <option key={service.slug} value={service.title}>
              {service.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1 block text-sm font-semibold text-ink"
        >
          פרטים נוספים
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="ספרו לנו בקצרה על הבעיה"
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          className={`${fieldClasses} resize-y border-ink/55`}
        />
      </div>

      {/* ⚠️ `form-whatsapp` fires PRE-VALIDATION. The click lands before handleSubmit decides
          whether the form is valid, so three mistyped phone numbers are three clicks on this
          element. It must NEVER be used as the lead trigger — the lead event is the
          `lead_whatsapp_open` push in handleSubmit, which only runs after validation passes
          (docs/data-tracking-infrastructure.md §3). */}
      <button
        type="submit"
        data-cta="form-whatsapp"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-strong px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-[#9a3412] focus-visible:outline-none"
      >
        <Send className="size-5" aria-hidden="true" />
        שליחת פנייה בוואטסאפ
      </button>
      <p className="text-center text-xs leading-relaxed text-ink/70">
        בלחיצה על הכפתור תיפתח שיחת וואטסאפ עם הפרטים שמילאתם — הם אינם נשמרים
        אצלנו.{" "}
        <Link href="/privacy" className="font-semibold text-brand underline">
          מדיניות פרטיות
        </Link>
      </p>
    </form>
  );
}
