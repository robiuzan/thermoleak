---
name: hebrew-rtl
description: RTL and Hebrew (he-IL) discipline for thermoleak — logical Tailwind utilities only with the pl/pr/ml/mr/left/right/text-left/text-right ban, dir="ltr" islands for phone, email and URLs (there is no .ltr CSS helper here), Israeli number and date formats, Hebrew punctuation with גרש and גרשיים, directional icons, and the EmailOff wrapper every visible address needs. Use whenever writing markup, classes or copy that appears on the page. Mandatory per CLAUDE.md §6. Triggers "RTL", "Hebrew", "which padding utility", "text direction", "LTR island", "mailto broken".
---

# Hebrew & RTL discipline

`<html lang="he" dir="rtl">` is set in `app/layout.tsx`. Do not remove it. Everything below follows.

**Current state: the repo has zero violations of the ban list.** That is unusual and worth preserving —
every finding here is about not regressing, not about cleaning up.

## Logical utilities only — the ban list

For horizontal spacing and positioning, use **direction-aware** utilities so the layout mirrors
correctly:

| Use                                     | Never use                     |
| --------------------------------------- | ----------------------------- |
| `ps-*` / `pe-*`                         | `pl-*` / `pr-*`               |
| `ms-*` / `me-*`                         | `ml-*` / `mr-*`               |
| `start-*` / `end-*`                     | `left-*` / `right-*`          |
| `text-start` / `text-end`               | `text-left` / `text-right`    |
| `gap-*` (preferred)                     | bare `space-x-*`              |
| `space-x-reverse` alongside `space-x-*` | bare `space-x-*`              |
| `rounded-s-*` / `rounded-e-*`           | `rounded-l-*` / `rounded-r-*` |
| `border-s-*` / `border-e-*`             | `border-l-*` / `border-r-*`   |

The only exception is a genuinely direction-agnostic case — a centred absolute overlay, a
mathematically symmetric transform — and it **must carry an explanatory comment** saying why.

Let `dir="rtl"` mirror flex and grid naturally. Don't reach for `flex-row-reverse` to "fix" order; if
the order looks wrong, the DOM order is wrong.

Vertical utilities (`pt`, `pb`, `mt`, `mb`, `top`, `bottom`) are unaffected — use them normally.

## LTR islands — the attribute is the whole mechanism

Latin and numeric content inside Hebrew must be isolated or the bidi algorithm reorders it: phone
numbers render backwards, prices lose their currency position, URLs fragment.

**This repo has no `.ltr` CSS helper class.** Isolation is per-element `dir="ltr"`, exactly as
`ContactCTA`, `ContactForm`, `app/accessibility/page.tsx` and `app/privacy/page.tsx` do it:

```tsx
<span className="block font-bold text-brand" dir="ltr">{site.phone.display}</span>
<a href={telHref} dir="ltr" className="font-semibold text-brand underline">{site.phone.display}</a>
<input id="phone" type="tel" dir="ltr" className="… text-start" />
```

Use it for phone numbers, emails, URLs, prices with `₪`, and version strings. Note the phone input also
needs `text-start` so the caret starts where a user expects inside an RTL form.

**Write the plain value in `lib/site.ts`** — `055-660-1006`. The component adds the isolation. Never
put markup in the data files.

## Every visible email needs `EmailOff`

Cloudflare Scrape Shield rewrites addresses in the served HTML: a `mailto:` becomes
`/cdn-cgi/l/email-protection#…`, which **404s** for crawlers and for anyone without JS, and a plain-text
address becomes the English placeholder "[email protected]" mid-Hebrew-sentence.

```tsx
<EmailOff>
  <a href={mailHref}>{site.email}</a>
</EmailOff>
```

`components/EmailOff.tsx` emits real `<!--email_off-->` / `<!--email_on-->` HTML comments around its
children — Cloudflare leaves anything between them alone. It uses `dangerouslySetInnerHTML` with
build-time constant strings (JSX comments are compile-time only and never reach the output), and its
carrier span is `display: contents` so it adds no box to a flex or grid parent. Wrap **every** new
visible address; `Footer` already does.

## Israeli formats

- Phone: `055-660-1006` displayed; `+972556601006` in `tel:` — both from `lib/site.ts`, via `telHref`.
- WhatsApp: `whatsappHref(message?)` builds `https://wa.me/972556601006` and URL-encodes the message.
- Currency: this site writes **`₪450`** (symbol first) in `priceModel` strings — match the existing
  convention rather than switching to `450 ₪` mid-file.
- Dates: `dd/mm/yyyy`.
- Ranges: en dash, no spaces — `08:00–18:00`, `3–6 שעות`.
- Thousands separator: comma — `3,000+`.

## Hebrew punctuation

Use **גרש** `׳` (U+05F3) and **גרשיים** `״` (U+05F4) in Hebrew abbreviations — `דו״ח`, `ק״מ`, `רח׳`,
`ח״פ`, `ת״י`. Not the ASCII `'` and `"`, which render wrong and read as English punctuation.

The repo is **consistent** about this — `דו״ח תרמוגרפי`, `ק״מ`, `בע״מ`, `ת״י 5568` all use the correct
characters, including inside the review names (`דנה ל׳`). Match it exactly; a stray ASCII quote in a
Hebrew abbreviation is visible to a native reader.

## Directional icons

Icons that imply direction must point correctly for RTL. In Hebrew, "next / read more" points **left**:
`ServiceCard` and `app/services/[slug]/page.tsx` both use `ArrowLeft` with a
`group-hover:-translate-x-1` nudge. Copy that; don't import `ArrowRight` for a "continue" affordance.

## If a Hebrew route slug is ever added

All current slugs are ASCII (`/services/water-leak-detection/`), so there is no percent-encoding
matcher in this repo. If a Hebrew-slugged dynamic route is introduced, params arrive **percent-encoded**
during static export and must be normalised before matching:

```ts
const target = decodeURIComponent(param).normalize("NFC");
return items.find((i) => i.slug.normalize("NFC") === target);
```

Both halves matter. A route that skips this **works in dev and 404s in production**.

## Copy rules

- Keep user-facing strings Hebrew. No mid-sentence language mixing — an English equipment name (FLIR)
  gets its own clause.
- Address the reader as "אתם"; speak as "אנחנו" / טרמוליק.
- Copy lives in `lib/site.ts`, `lib/services.ts` and `lib/faqs.ts`, never in JSX.
- Full voice and depth rules: `docs/content-standards.md` §4 and §7.

## Checklist

- [ ] No banned physical-direction utility, or an exception with a comment.
- [ ] Every phone, email, URL and price is inside an LTR island (`dir="ltr"` on the element).
- [ ] Every visible email is wrapped in `<EmailOff>`.
- [ ] Hebrew abbreviations use `׳` / `״`.
- [ ] Directional icons point left for "next".
- [ ] Layout checked at 360px and at desktop, in RTL.

```bash
grep -rnE '\b(pl|pr|ml|mr)-[0-9]|\b(left|right)-[0-9]|text-(left|right)\b|\brounded-(l|r)-|\bborder-(l|r)-' components app
```

Expect no output.
