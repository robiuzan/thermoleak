---
name: page-imagery
description: Which image belongs in which slot on טרמוליק — the measured inventory of every position that holds a picture (rendered width, ratio, size class, DOM order and the eager image), what an alt or a caption may and may not say, and the honesty rules for thermal imagery that keep an AI-made picture an illustration and never evidence of a job. Use when adding or changing a content image, wiring a Figure, writing an alt or a caption, or deciding what a page should show. Triggers "add an image", "which photo here", "alt text", "caption", "thermal screen", "Figure", "gallery", "image slot".
---

# Page imagery

**What ships.** Every content page carries two or more **AI-made illustrations** of thermal leak detection
(the user's decision of 2026-11-01, CLAUDE.md §15): Gemini renders in the look of a technician's phone
snapshot, made by the Media Studio `page-images` toolkit, approved by the owner on the local site first,
installed under `public/images/<group>/<slug>.webp`, described in `content/images/manifest.json`, with the
טרמוליק logo bottom-right. Besides those the site has the navbar logo (`/images/thermoleak_logo.webp`) and four
decorative service illustrations (`/images/services/`, `alt=""`). The authoritative slot lists are `SlotId` in
`lib/images.ts` and the plan `content/images/plan.json`. **This file is the measured layout behind them:**
every width below comes from the code, not from taste.

`Container` is the constant: `max-w-6xl` is 1152 px with `lg:px-8`, so the widest column is **1088 px**;
`max="4xl"` gives **832 px** and `max="3xl"` gives **704 px**. A width is set with the `max` prop, never with a
`max-w-*` in `className`, which loses to `.max-w-6xl`.

## The slot inventory

| Route         | Slot · ratio · class                        | Where it sits                                                     | Widest rendered | Note                                                        |
| ------------- | ------------------------------------------- | ----------------------------------------------------------------- | --------------- | ----------------------------------------------------------- |
| `/`           | `main` · 5:4 · tile 960 · priority          | the `Hero` image column, `max-w-md`                               | 448 px          | The LCP image: ≤ 150 KB, no caption                         |
| `/`           | `detail` · 3:2 · half 1200                  | under the two `MethodExplainer` paragraphs                        | 704 px          | People-free: the camera set down, its screen in view        |
| `/`           | `supplied` 1–11 · 3:5 720×1200              | the `Gallery` section, five scenes                                | ~330 px         | Scene captions in `lib/gallery.ts`                          |
| `/services/`  | `pair-1..2` · 4:3 · reuse                   | `FieldStrip cols={2}` under `PageHero`, above the cards           | 536 px          | Two service mains; no render of its own                     |
| 4 services    | `main` · 4:3 · large 1400 · priority        | under the answer block; the decorative SVG is its fallback        | ~709 px         |                                                             |
| 4 services    | `detail` · 3:2 · half                       | after the «איך התהליך עובד» steps                                 | ~709 px         |                                                             |
| 4 services    | `work` · 3:2 · half                         | after the limits box                                              | ~709 px         |                                                             |
| `/pricing/`   | `survey` · 3:2 · half · priority            | after «מה כולל ביקור»                                             | 832 px          | Reused on `/about/`                                         |
| `/pricing/`   | `layers` · 3:2 · half                       | after the «ממה מושפע המחיר?» factors                              | 832 px          | Reused on the cost guide                                    |
| `/guides/`    | thumbnail 480×360, derived from each `lead` | the start of each card                                            | ~144 px         | First card priority                                         |
| 3 guides      | `lead` · 4:3 · half · priority              | after the answer box, through `ArticleBody`                       | 704 px          |                                                             |
| 3 guides      | `mid` · reuse                               | a `{ kind: "figure", slot: "mid" }` block in `lib/articles.ts`    | 704 px          |                                                             |
| `/locations/` | `strip-1..3` · 4:3 · tile                   | `FieldStrip` under the intro                                      | 224 px          | Building types, never a named place                         |
| 12 cities     | `main` · 4:3 · large · priority             | under the answer block                                            | 704 px          | A person with the camera                                    |
| 12 cities     | `detail` · 3:2 · half                       | after the «מה מאפיין נכסים…» claims                               | 704 px          | People-free, no camera; never shared by two cities          |
| `/about/`     | `team` · 3:2 · half · priority              | after the story, with the note under it                           | 704 px          | **No image beside the founder card**                        |
| `/about/`     | `work` · 3:2 · half                         | after «איך אנחנו עובדים»                                          | 704 px          |                                                             |
| `/about/`     | `survey` · reuse                            | inside «ציוד וכיסוי»                                              | ~500 px         |                                                             |
| `/contact/`   | `main` 3:2, `team` reuse, no captions       | **below** the two columns, never above a CTA or the form          | 408 px          |                                                             |
| `/gallery/`   | `supplied` 1–11, then `generated` 12–21     | scenes first, then a 3-column grid with a caption and a page link | ~347 px         | 18–21 are the four service mains                            |
| every page    | the footer note `data-images-notice`        | the `Footer` bottom bar                                           | —               | Live once `notice.json` is stamped and an image is approved |

Not slots: `PageHero` (a picture there would move the LCP off the `<h1>`), the aside on a service page, the
founder card, the share card `/og.png`, the logo.

Two facts that are easy to get wrong:

- **There is no resizer.** `images.unoptimized` with `output: "export"` means the file in `public/images/` is
  the file every device downloads. That is why `finish` writes one WebP per slot at a fixed long edge and
  budget, and why the plan keeps **one ratio per row**.
- **Priority is computed, not hard-coded.** `leadSlotOf`, `FieldStrip`'s first tile and `ArticleBody` derive
  the eager image from what actually renders, so a rejected `main` moves it to the next slot. Each page gets
  exactly one `fetchPriority="high"`. Grep for it case-insensitively: the HTML is camelCase.

## Adding or changing an image

1. Edit `content/images/plan.json` through the `image-art-director` agent. Never the manifest.
2. Run the pipeline (skill `page-images-pipeline`). The owner approves the digest, then the candidates.
3. A new slot kind is code first: add the id to `SLOT_IDS` in `scripts/images/lib/manifest-rules.mjs` and to
   `SlotId` in `lib/images.ts`, wire the page, and let the gate prove it renders.
4. Never an `<img>` written by hand for a content image, and never a file dropped into `public/images/`.

## Alt text and captions (Hebrew)

The toolkit's `alt` step writes both from the finished pixels. `scripts/images/lib/manifest-rules.mjs` and
the toolkit enforce them, and the postbuild gate re-checks the built HTML.

- **Alt: 40–160 characters, one sentence, only what is visible.** Never `תמונה של`, never `הדמיה` or `AI`: the
  note carries that.
- **Caption: 40–200 characters, optional.** It names the activity or the method: «סריקה תרמית של…», «אימות במד
  לחות», «איתור אקוסטי», «סימון המוקד ותיעוד».
- **A screen is an illustration, never a reading.** Describe colours and positions: «על המסך רקע סגול ופס
  צהוב-כתום». Never "the screen shows the leak", and never a temperature or a number.
- **Forbidden in an alt or a caption:** a finding or result (`ממצא`, `נמצא`, `אותר`, `תוצאה`, `הוכחה`), the
  guarantee's slogan, an insurer's outcome (`אושר`, `פיצוי`), a city or neighbourhood, a date, a customer, a
  count of jobs, a price, a size with a unit, a temperature or a percentage, a credential (`מוסמך`, `הסמכה`,
  `מורשה`), availability (`מיידי`, `תוך שעה`, `24/7`), and the camera's make or model, in the English alt too.
- **`ביטוח` alone is legal:** it is a service name. The claim to be insured (`מבוטח`, `צד ג`) is not.
- **Names:** רונן דהן never. `עומר` and `יואב` only in a caption whose every placement is `/about/`, and never
  in an alt. Surnames appear nowhere in this repo.
- Hebrew punctuation: גרש `׳` and גרשיים `״`. Trade words come from the toolkit's GLOSSARY block
  (`Media Studio/sites/thermoleak/style.md`).

The stems live in `scripts/images/lib/images.config.mjs`, which Media Studio's `site.json` must match:
`doctor` fails when they drift.

## Honesty — the gate this site is built around

- **An image here illustrates how the work is done. It never records a job.** This site removed six invented
  testimonials in 2026-08; the words around a picture must never turn it into evidence.
- **Renderings carry zero Experience weight** (`docs/eeat-and-trust.md` §5a). Real phone photos enter the
  manifest as `owner-supplied` and replace renderings one for one.
- **Never** a stock photo, a rendering in `og:image`, JSON-LD or a Google Business Profile, a certificate, a
  rating, a before/after split, a customer, or readable text. The only marks in a frame are the shield on the
  chest and the small FLIR mark on the camera's side.
- **Nothing broken, anywhere.** No opened wall, drilled tile, exposed pipe, trench or tool of repair. The only
  sign of a problem is a soft-edged brown tide-mark or a pale damp bloom.
- **The geometry of a screen.** A man facing the viewer holds the camera with the screen toward him. A lit
  screen shows only where the camera is set down with its back to the viewer and its lens on the surface: that
  is the one framing in which it can honestly show that surface.
- **Only the confirmed kit:** the E8, the pin moisture meter, the acoustic detector (headphones, plain handset,
  ground microphone), blue masking tape or chalk, a plain tablet showing only a thermal image, a plain grey
  case. Nothing else. A panel is scanned from a short distance and never touched.
- **People:** only עומר and יואב, from their consented references, with the shield on the left chest of every
  frame. No customer, no helper, no face in a mirror, glass door or wet floor. The founder is never depicted.
- **Israeli interiors only.** Porcelain or terrazzo floors, white plaster, aluminium frames with roller
  shutters, stone-clad blocks and solar heaters outside. Radiators, carpet, brick and US sockets are out.

**Maybe or reject.** Style misses (glasses indoors, a plausibly non-Israeli room, an open cupboard, a staged
look) are notes for the owner. Honesty faults (a wrong camera, a second person, a different face, a lettered
badge, readable text beyond the two marks, a screen that cannot be the surface in front of the lens, anything
broken or repaired) are rejects.

## Related

Agent `image-art-director` authors the plan · agent `image-qa-reviewer` is the second opinion on candidates ·
skill `page-images-pipeline` runs the pipeline · `docs/eeat-and-trust.md` §5a · `docs/performance-guidelines.md`
§1 and §3 · `Media Studio/page-images/docs/contract.md` is the toolkit contract.
