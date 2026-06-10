"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { services } from "@/lib/services";
import { site, whatsappHref } from "@/lib/site";

interface FormState {
  name: string;
  phone: string;
  area: string;
  service: string;
  message: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

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
  else if (!/^0\d{8,9}$/.test(phoneDigits)) errors.phone = "מספר טלפון לא תקין (לדוגמה: 050-0000000)";

  if (!values.area.trim()) errors.area = "נא להזין יישוב או אזור";
  return errors;
}

const fieldClasses =
  "w-full rounded-xl border bg-white px-4 py-3 text-ink placeholder:text-ink/40 focus:border-brand focus:outline-none";

export default function ContactForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof FormState>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const lines = [
      "שלום, פנייה חדשה מהאתר:",
      `שם: ${values.name}`,
      `טלפון: ${values.phone}`,
      `אזור: ${values.area}`,
      `שירות: ${values.service}`,
    ];
    if (values.message.trim()) lines.push(`פרטים: ${values.message}`);

    window.open(whatsappHref(lines.join("\n")), "_blank", "noopener,noreferrer");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-[#25D366]/50 bg-[#25D366]/10 p-6 text-center"
      >
        <CheckCircle2 className="mx-auto mb-3 size-10 text-[#0e7468]" aria-hidden="true" />
        <h3 className="text-lg font-bold text-brand">הפנייה מוכנה לשליחה בוואטסאפ</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">
          אם חלון הוואטסאפ לא נפתח אוטומטית, אפשר להתקשר אלינו ישירות בטלפון {site.phone.display}.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setValues(initialState);
            setErrors({});
          }}
          className="mt-4 text-sm font-semibold text-brand underline"
        >
          שליחת פנייה נוספת
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-label="טופס פנייה מהירה">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-semibold text-ink">
          שם מלא <span className="text-accent-strong">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={`${fieldClasses} ${errors.name ? "border-red-500" : "border-ink/20"}`}
        />
        {errors.name ? (
          <p id="name-error" className="mt-1 text-sm text-red-600">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-semibold text-ink">
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
          value={values.phone}
          onChange={(event) => update("phone", event.target.value)}
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          className={`${fieldClasses} text-start ${errors.phone ? "border-red-500" : "border-ink/20"}`}
        />
        {errors.phone ? (
          <p id="phone-error" className="mt-1 text-sm text-red-600">
            {errors.phone}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="area" className="mb-1 block text-sm font-semibold text-ink">
          יישוב / אזור <span className="text-accent-strong">*</span>
        </label>
        <input
          id="area"
          name="area"
          type="text"
          autoComplete="address-level2"
          placeholder="לדוגמה: תל אביב"
          value={values.area}
          onChange={(event) => update("area", event.target.value)}
          aria-invalid={errors.area ? true : undefined}
          aria-describedby={errors.area ? "area-error" : undefined}
          className={`${fieldClasses} ${errors.area ? "border-red-500" : "border-ink/20"}`}
        />
        {errors.area ? (
          <p id="area-error" className="mt-1 text-sm text-red-600">
            {errors.area}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="service" className="mb-1 block text-sm font-semibold text-ink">
          סוג השירות
        </label>
        <select
          id="service"
          name="service"
          value={values.service}
          onChange={(event) => update("service", event.target.value)}
          className={`${fieldClasses} border-ink/20`}
        >
          {services.map((service) => (
            <option key={service.slug} value={service.title}>
              {service.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-semibold text-ink">
          פרטים נוספים
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="ספרו לנו בקצרה על הבעיה"
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          className={`${fieldClasses} resize-y border-ink/20`}
        />
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-strong px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-[#9a3412] focus-visible:outline-none"
      >
        <Send className="size-5" aria-hidden="true" />
        שליחת פנייה בוואטסאפ
      </button>
      <p className="text-center text-xs text-ink/50">
        בלחיצה על הכפתור תיפתח שיחת וואטסאפ עם הפרטים שמילאתם. לא נשמור פרטים ללא הסכמתכם.
      </p>
    </form>
  );
}
