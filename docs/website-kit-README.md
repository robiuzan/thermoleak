# 🚀 Website Build Kit

A reusable system for building excellent service-business websites from A→Z. Fill one brief,
hand it over, get a complete site.

## What's in here

| File | What it is | When you use it |
|------|-----------|-----------------|
| [`website-brief-template.md`](./website-brief-template.md) | **The master template.** A fill-in-the-blanks brief covering every aspect of a great website (brand, content, structure, design, SEO, tech, legal). | Copy it for every new project. |
| [`thermoleak-brief.md`](./thermoleak-brief.md) | **A worked example** — the template filled for a thermal-leak-detection business. Invented values are tagged `🔶 ASSUMPTION`. | Read it to see what a "good, finished brief" looks like. |
| `README.md` | This guide + the build workflow. | Start here. |

---

## How to start a new website (3 steps)

1. **Copy** `website-brief-template.md` → `your-business-brief.md`.
2. **Fill** what you know. You don't need everything — blanks fall back to smart defaults
   (see **Part K** of the template). The bare **minimum to start** is listed at the bottom of
   the template.
3. **Hand it to me.** Say *"Build the site from this brief"* and point me at the file.

> Don't have answers yet? Just give me whatever you have (even a paragraph). I'll draft the
> brief, mark my guesses as `🔶 ASSUMPTION`, and ask you only about what's blocking the build.

---

## The A→Z build workflow

Here's exactly what happens after you hand me a brief:

### 1. Confirm 📋
I summarize the brief back to you, list every `🔶 ASSUMPTION`, and ask **only** the questions
that block the build. We lock scope, pages, and the primary conversion goal.

### 2. Design system 🎨
Scaffold the **Next.js (App Router + TypeScript + Tailwind)** project with RTL/Hebrew set up,
then build the foundation: color & type tokens, spacing, buttons, cards, forms, header/footer,
and the sticky call + WhatsApp bar.

### 3. Build pages 🧱
Build each page from the sitemap (Home → Services → About → Reviews → Contact → Legal) with real
content, your voice, imagery, and conversion elements in the right places.

### 4. SEO, analytics & legal 🔍
Per-page metadata, sitemap & robots, **LocalBusiness + Service + FAQ + Review** structured data,
GA4 + Search Console, conversion tracking (calls/WhatsApp/forms), privacy policy, cookie consent,
and an **accessibility statement (IS 5568 / WCAG 2.0 AA)**.

### 5. Review & polish ✨
Responsive check (phone/tablet/desktop), performance pass (fast Core Web Vitals, optimized
images), and an accessibility pass. You review and request changes.

### 6. Launch 🚀
Deploy to Vercel, connect the domain + DNS, enable SSL. Post-launch checklist: verify Search
Console, submit sitemap, link the Google Business Profile, test every form and call/WhatsApp link.

---

## Defaults (so you don't have to decide everything)

Unless your brief says otherwise, I build with: **Hebrew + RTL**, Israeli formats (₪,
`0XX-XXX-XXXX`), Hebrew-friendly fonts (Heebo/Assistant), mobile-first, sticky call+WhatsApp,
LocalBusiness/FAQ/Review schema, GA4, WCAG 2.0 AA + IS 5568, hosted on Vercel.

Override any of these in the relevant section of your brief — see **Part K** of the template for
the full list.

---

## Reusing this for many services

This kit is service-agnostic. The same template works for a plumber, an electrician, a clinic, a
law office, a cleaning service, etc. For each one: **copy → fill → hand over.** The defaults and
build workflow stay the same; only the brief content changes.
