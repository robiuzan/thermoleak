# assets/gallery — gallery masters (not shipped)

Full-size masters for the homepage gallery. **Only this README is in git**: the masters are
gitignored (the repo is public, and most of them show the team in scenes that will never be
published), and nothing in this folder is deployed. What ships is `public/images/gallery/*.webp`,
built from here.

- **Add or change an image:** put the master here, add or edit its entry in `lib/gallery.ts` (slug,
  alt, `master.file`, optional `master.crop`), then run `node scripts/optimize-gallery.mjs`. New
  pixels need a new slug — `/images/*` is cached for 30 days (`public/_headers`).
- **Fresh clone:** this folder holds only this file. The masters live on the machine that made them
  (and in the Gemini history); copy them back before re-running the script.
- **Provenance:** #1–31 were made with Google Gemini on 2026-10-22 and #32–45 on 2026-10-27, from
  reference portraits of the team (עומר), who agreed himself. Since 2026-10-26 they ship with no label at all — no note or
  tags, no הדמיה in the alt text, no AI marker in the files — by the owner's decision
  (`docs/business-facts.md` §A, `docs/eeat-and-trust.md` §5).

## Making new images

The first batch lost 27 of 31 frames to a handful of causes (see the register below). This prompt is
built to stop each of them.

1. **Prepare four references once:**
   - one clear, front-facing portrait of the employee;
   - the shield emblem **alone**, cropped from the designer’s full-size logo, with no letters — the
     repo’s 280×70 logo is too small, and a badge that contains text is how סרמוליק happened;
   - a clean product photo of the FLIR E8;
   - pose images where someone inspects or points at a wall — never drilling, digging or repairing.
2. Give the prompt below plus all four images to the prompt-writing AI, then ask
   “generate images for <situation>”.
3. In Gemini, attach only the portrait, the emblem and the camera — in that order — with each prompt.
   Add the pose image only if a pose comes out wrong (it also carries its room and activity along).
4. Check the result is vertical (9:16). Google AI Studio has an aspect-ratio setting; in the Gemini
   app, check the first result.
5. Check every result at full size before it comes here:
   - the shield has no letters, and nothing on the clothes is written;
   - the camera is dark grey (the E8), with no model text on the bezel;
   - nothing is broken, opened, dug or repaired, and no other tools appear;
   - one person — no faces in mirrors or framed photos;
   - every object appears once (taps, cables, hoses);
   - the screen shows the spot the lens points at;
   - no thin black or white strip on an edge (cut it off with `master.crop`).
6. Master here → an entry in `lib/gallery.ts` → `node scripts/optimize-gallery.mjs`.

### The prompt (2026-10-22)

```text
Act as an expert AI image engineer for photorealistic, documentary-style commercial photography, consistent-character generation and pose transfer. You write prompts for Google Gemini image generation.

THE COMPANY
- Name: טרמוליק (ThermoLeak) — https://thermoleak.co.il/
- What it does: finds hidden water leaks and damp WITHOUT breaking anything, using a thermal camera; scans electrical panels for hot spots; writes reports for insurers.
- What it never does: break, drill, dig, open walls, floors or ceilings, or repair anything. Repairs are done later by other tradespeople.
- Customers: private homes, building committees and businesses in Israel.

REFERENCE IMAGES
I attach these to you, in this order:
- Image 1 — ONE clear, front-facing portrait of the employee.
- Image 2 — the company emblem: the shield icon alone, cropped out of the logo so the file contains no letters.
- Image 3 — the FLIR E8 thermal camera the company uses.
- Image 4 — a pose reference. It is for you only: I will NOT attach it in Gemini.
In Gemini I attach Images 1, 2 and 3, in that order, with every prompt. If any of the four is missing here, reply with one line naming it instead of writing prompts.

WHEN I SAY "generate images for [service or situation]"
Write 3 prompts that form ONE set — the same room, light, clothes and problem in all three:
1. Wide shot (35mm lens): the room and the problem (for example a clearly visible brown water stain about the size of a dinner plate), the employee scanning it, his face in three-quarter profile.
2. Medium shot (50mm lens): waist up, his face clearly visible, the camera raised toward the problem.
3. Close-up (85mm lens, f/2): over his right shoulder, so the chest emblem is out of view and his sleeve and back show plain grey fabric; the camera's screen is sharp and large in the frame, the problem softly out of focus behind it.
Scene-only exception: if Image 4 shows no person and no tools, write a scene-only set instead — no person, no tools, no opener sentences — and keep every other rule.

RULES FOR EVERY PROMPT
1. The person. Begin every prompt with exactly these two sentences: "The male employee from the reference portrait image. Must maintain a 95% facial similarity match to the reference portrait." Then write: "The reference portrait is the first attached image." Keep his face shape, hairline, hair colour and length, facial hair, nose, jaw, skin tone, build and age exactly. He is the only person and the only face anywhere in the image.
2. The pose. Study Image 4 and write its subject's body position into the prompt in plain words (stance, which arm is raised and how high, where the head turns). Use it in the shot whose framing is closest to Image 4 and adapt it for the other two; lens, framing and light always follow the shot list and rules 7 and 10. Whatever the person in Image 4 is doing, in your prompt he is scanning an intact surface with the thermal camera, held in his right hand in all three shots. Name nothing else from Image 4 — not its activity, tools, people, signs or room.
3. An intact surface. Every wall, floor, ceiling and tile is whole and smooth. The only sign of the problem is a clearly visible, evenly toned, soft-edged brown tide-mark stain on smooth, unbroken paint; any pipe stays inside the wall and shows only as a warm line on the camera's screen. He holds only the thermal camera; the floor around him is clear and nothing else he brought is in view. If my request names another tool, use it only if it is the moisture meter or the acoustic leak detector (headphones and a ground microphone) — both are methods the website names; for any other tool, reply with one line asking me to confirm it first. For an electrical panel, he scans the breakers from a short distance and touches nothing.
4. The thermal camera. Exactly the camera in the third attached image: a FLIR E8 — a compact pistol-grip camera with a dark grey and black body, a black rubber grip and a screen on the back. He holds it clear of everything, with visible space between it and any tap, pipe or wall.
5. The screen. It shows a thermal image (iron palette: purple-blue = cool, orange-yellow = warm) of exactly the surface the lens points at: a cool blue-purple patch matching the stain, a warm line along a hidden hot-water pipe, or a bright hot spot on an overheating breaker. The thermal image fills the screen, with no numbers or menus.
6. Clothing. A plain dark grey short-sleeved polo shirt as his outer layer. The shield emblem from the second attached image appears once, small (about 7 cm), embroidered on his left chest; the sleeves and back are plain grey fabric. His clothes carry no letters, words or numbers. Clean dark work trousers and clean dark work boots. Bare hands, no vest. In a home: no hard hat and no safety glasses; on a building site, a roof or in a plant room, a white hard hat and clear safety glasses are fine. Eyeglasses only if the portrait shows them, in the same plain frames.
7. The setting. Unless I name another place (a building stairwell, a shop, an office, a plant room), a typical Israeli apartment: light porcelain floor tiles, white plastered walls, aluminium window frames with roller shutters, warm Mediterranean daylight. Through the window: pale stone-clad apartment blocks with solar water heaters on the roofs, and greenery. Tidy and sparsely furnished, with bare walls apart from the problem and a clear foreground.
8. Only two marks. The only marks in the image are the small shield on his shirt and the small FLIR logo on the side of the camera; the bezel around the screen is plain black with no model number. Everything else — appliances, packaging, signs — is plain and unbranded.
9. Physical sense. Every object appears once and makes sense; nothing floats. Natural hands with five fingers. No mirror or glass reflects a face.
10. Photo style. A photorealistic documentary photo: raw photo look, 8k detail, natural window light, realistic skin texture and fabric, subtle everyday imperfections — not CGI, not over-saturated. Shot on a Canon EOS R5 with the lens named for the shot, sharp focus on the subject. Vertical 9:16 portrait, with his head, the camera and the stain clear of the top and bottom edges.
11. Language. Write the prompts in English only, and add no Hebrew or other writing beyond the two marks in rule 8.

HOW TO WRITE EACH PROMPT
- One self-contained paragraph per prompt, because each is pasted on its own. Order: the two opener sentences; this shot's lens, framing, pose and action; then one fixed block — the room, the stain (size, colour, exact position), his clothes and the camera — written once and pasted word for word into all three prompts.
- Describe what should be seen ("smooth, unbroken paint", "a dark grey camera body"). Decide every "if" yourself, and never name anything that must not appear.
- End every prompt with: "His hands are bare, his plain short-sleeved polo is his outer layer with no vest, the camera body is dark grey and black, the only mark on his clothes is the small shield, and every wall, floor and ceiling is whole."

BEFORE YOU ANSWER, check every prompt and rewrite any that fails: the two opener sentences word for word · one person, the face from the first image · the same fixed block in all three · the shield only, no letters · a plain short-sleeved dark grey polo · bare hands, no vest · no hard hat or safety glasses in a home · a dark grey FLIR E8 in his right hand · the screen matches its target · nothing broken, opened, dug or repaired · no tools beyond those rule 3 allows · the setting from rule 7 · only the two marks from rule 8 · vertical 9:16.

OUTPUT FORMAT
Output ONLY the 3 prompts, each in its own code block, with no other text — except the one-line replies that the rules above allow.
```

## Register — first batch, reviewed 2026-10-22

Every master was inspected at full resolution and at gallery size, then re-checked by an
independent second reviewer. **4 shipped, 7 more "maybe", 20 rejected.**

- **reject** — contradicts the site (breaking, drilling, digging, repair), the confirmed kit (the
  FLIR E8), the brand (a misspelled badge), or shows an AI artifact a visitor would notice.
- **maybe** — usable only once the owner confirms the kit shown (drain camera, pressure test), or
  after a retouch. #10 is a near-copy of a shipped frame.
- **Worth regenerating** (strong frames with one fixable fault): #2 — fix the badge, drop the drill;
  #11 — the dark-grey E8 instead of the yellow camera, no safety glasses; #16 — the same pose
  indoors, at a damp wall; #19 — intact tiles, no cable reel.
- Alt text exists for every master, so any of them can be used later without re-describing it.

| #   | Master                                         | Verdict                                     | Why                                                         | Alt text                                                                                                                                             |
| --- | ---------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `1Gemini_Generated_Image_7bl5647bl5647bl5.png` | reject                                      | breaks up a shower floor with a power tool                  | טכנאי בחולצת טרמוליק יושב על שרפרף במקלחת ומפרק ריצוף שבור בכלי חשמלי, וסביבו שברי אריחים, מקדחה ושעון לחץ.                                          |
| 2   | `1Gemini_Generated_Image_f7s5x7f7s5x7f7s5.png` | reject                                      | chest badge misspelled סרמוליק; a drill on the stairs       | טכנאי מכוון מצלמה תרמית אל כתם רטיבות גדול בצבע חום בתקרה ליד גרם מדרגות, ומאחוריו סולם אלומיניום.                                                   |
| 3   | `1Gemini_Generated_Image_hqx5nnhqx5nnhqx5.png` | **shipped** → `kitchen-sink-thermal-scan`   | clean at gallery size; safety glasses indoors               | טכנאי בחולצת טרמוליק מכוון מצלמה תרמית אל בסיס הברז של כיור מטבח כפול, במטבח פתוח עם סלון ברקע.                                                      |
| 4   | `1Gemini_Generated_Image_i7ge3i7ge3i7ge3i.png` | reject                                      | yellow camera, not the FLIR E8; garbled logo on the bag     | טכנאי בחולצת טרמוליק רוכן אל מגירות שולחן כתיבה, בידו האחת מצלמה תרמית צהובה ובשנייה פנס דולק; על הקיר שמתחת לשולחן כתם רטיבות כהה.                  |
| 5   | `1Gemini_Generated_Image_jgktnujgktnujgkt.png` | maybe                                       | drain camera (unconfirmed kit); no thermal camera           | טכנאי בחולצת טרמוליק כורע על רצפת חדר רחצה ומחדיר כבל של מצלמת צנרת מגלגלת אדומה לפתח ניקוז, ובידו השנייה צג שחור.                                   |
| 6   | `1Gemini_Generated_Image_k2hed4k2hed4k2he.png` | reject                                      | hi-vis vest in a home; sleeve patch misspelled סרמוליק      | טכנאי באפוד זוהר ומשקפי מגן מכוון מצלמה תרמית אל קיר אריחים מעל ברז בחדר רחצה, ותיקי כלים פתוחים מונחים על הרצפה.                                    |
| 7   | `1Gemini_Generated_Image_ub0bvgub0bvgub0b.png` | maybe                                       | orange hose and T-manifold: pressure-test kit (unconfirmed) | טכנאי במשקפי מגן מגלגל צינור כתום ארוך בחצר בית, ולרגליו מחבר מתכת בצורת T המחובר לצינור, על רקע צמחייה ומזגנים.                                     |
| 8   | `1Gemini_Generated_Image_uyldu1uyldu1uyld.png` | reject                                      | a second face in the mirror; heavy clutter                  | טכנאי רוכן ליד רדיאטור ומכוון מצלמה תרמית אל כתמי רטיבות חומים בקיר שמתחת לחלון בחדר שינה.                                                           |
| 9   | `2Gemini_Generated_Image_f7s5x7f7s5x7f7s5.png` | reject                                      | ceiling cut open around a pipe                              | טכנאי מכוון מצלמה תרמית אל פתח בתקרה שחושף צינור, ועל המסך כתם סגול כהה במרכז בין אזורים צהובים וכתומים.                                             |
| 10  | `2Gemini_Generated_Image_hqx5nnhqx5nnhqx5.png` | maybe                                       | near-copy of #3; tap spout looks plugged into the camera    | טכנאי בחולצת טרמוליק מחזיק מצלמה תרמית ליד פיית הברז ומביט בה, מעל כיור נירוסטה כפול במטבח מואר.                                                     |
| 11  | `2Gemini_Generated_Image_i7ge3i7ge3i7ge3i.png` | reject                                      | yellow camera carrying a FLIR logo, not the E8              | טכנאי בחולצת טרמוליק ובמשקפי מגן רוכן אל שידת עץ ומקרב מצלמה תרמית צהובה אל חזית המגירות שלה.                                                        |
| 12  | `2Gemini_Generated_Image_jgktnujgktnujgkt.png` | reject                                      | three rods leave one reel; drain camera                     | טכנאי בחולצת טרמוליק כורע בחדר רחצה, מחזיק מצלמה תרמית שחורה ומשחיל מוט אדום מגלגלת אל פתח ניקוז ברצפה.                                              |
| 13  | `2Gemini_Generated_Image_uyldu1uyldu1uyld.png` | **shipped** → `damp-wall-thermal-scan`      | clean at every scale                                        | טכנאי בחולצת טרמוליק נשען על אדן חלון ומכוון מצלמה תרמית אל כתם רטיבות בקיר; על המסך כחול קר למעלה ופס אדום בתחתית.                                  |
| 14  | `3Gemini_Generated_Image_2yis5s2yis5s2yis.png` | reject                                      | drilling into an opened wall; 'ONLY' printed on the sleeve  | טכנאי במשקפיים קודח בפטישון בקיר אריחים פתוח שבו נחשפים צינורות, ועל הרצפה שברי אריחים ודלי.                                                         |
| 15  | `3Gemini_Generated_Image_f7s5x7f7s5x7f7s5.png` | maybe                                       | dark spot in the stain reads as a hole; no readable badge   | טכנאי מכוון מצלמה תרמית אל כתם רטיבות בהיר בתקרה; על המסך רקע כתום, נקודה לבנה במרכז ופס סגול אלכסוני מתחתיה.                                        |
| 16  | `3Gemini_Generated_Image_gc9oqagc9oqagc9o.png` | reject                                      | camera aimed into an excavation pit                         | טכנאי מכוון מצלמה תרמית אל בור חפירה עם צינורות חשופים, ובמסך פסים אנכיים צהובים וכתומים על רקע סגול.                                                |
| 17  | `3Gemini_Generated_Image_hqx5nnhqx5nnhqx5.png` | **shipped** → `kitchen-sink-thermal-screen` | screen pattern does not match the sink it faces             | טכנאי מחזיק מצלמה תרמית מעל כיור מטבח כפול; על המסך רקע סגול ופס אנכי צהוב וכתום במרכזו, שקצהו העליון לבן.                                           |
| 18  | `3Gemini_Generated_Image_i7ge3i7ge3i7ge3i.png` | reject                                      | yellow camera; screen matches nothing in view               | טכנאי בחולצת טרמוליק מכוון מצלמה תרמית צהובה אל מגירות שולחן עץ ובידו השנייה פנס אדום; במסך כתם צהוב-כתום רחב שעובר לסגול לעבר הפינה הימנית העליונה. |
| 19  | `3Gemini_Generated_Image_jgktnujgktnujgkt.png` | reject                                      | tile wall opened to the pipes; garbled wordmark             | טכנאי מחזיק מצלמה תרמית שחורה מול קיר אריחים פתוח עם צנרת חשופה, ועל הרצפה גלגלת כבל אדומה; במסך פס צהוב בהיר אנכי עם הסתעפות כתומה על רקע סגול.     |
| 20  | `3Gemini_Generated_Image_k2hed4k2hed4k2he.png` | reject                                      | hi-vis vest; 'E5 Pis' camera label; garbled patch           | טכנאי במשקפי מגן, באפוד זוהר ובכפפות מחזיק מצלמה תרמית מול קיר אריחים בחדר רחצה; על המסך קווים צהובים שיורדים מלמעלה ופונים ימינה על רקע סגול.       |
| 21  | `3Gemini_Generated_Image_nakr89nakr89nakr.png` | reject                                      | rotary-hammer drilling into brick                           | טכנאי עם זקן ומשקפי מגן קודח בפטישון בקיר שאריחיו הוסרו וחשפו לבנים אדומות, ולרגליו דלי, כבל ושברי אריחים.                                           |
| 22  | `3Gemini_Generated_Image_pnx2l6pnx2l6pnx2.png` | reject                                      | pipe repair inside an opened wall                           | טכנאי במשקפיים מחבר צינורות שחורים לאביזר מתכת בצורת T עם גביע פלסטיק שקוף, בתוך קיר אריחים פתוח שבו נחשפים טיח ולבנים.                              |
| 23  | `3Gemini_Generated_Image_ub0bvgub0bvgub0b.png` | reject                                      | pressure-test kit; a tangle of loose wires                  | טכנאי במשקפיים מסובב ידית שחורה במחבר מתכת בצורת T שמחובר לצינור כתום, וחוטים לבנים דקים משתלשלים ממנו בחצר.                                         |
| 24  | `3Gemini_Generated_Image_uyldu1uyldu1uyld.png` | **shipped** → `damp-wall-thermal-screen`    | garbled maker text, visible only when zoomed; cropped       | טכנאי מחזיק מצלמה תרמית מול קיר ורדיאטור מתחת לחלון; על המסך כחול למעלה עם פס ירקרק שיורד במרכז, צהוב באמצע ושורת כתמים אדומים בחלק התחתון.          |
| 25  | `Gemini_Generated_Image_k2hed4k2hed4k2he1.jpg` | reject                                      | JPEG copy of #6                                             | טכנאי באפוד זוהר ומשקפי מגן מכוון מצלמה תרמית אל קיר אריחים מעל ברז בחדר רחצה, ותיקי כלים פתוחים מונחים על הרצפה.                                    |
| 26  | `Gemini_Generated_Image_t4toubt4toubt4to1.png` | reject                                      | excavation in a driveway; repair materials                  | טכנאי רכון לתוך בור חפירה בחניה מרוצפת, וסביבו ערמות חול, כלי עבודה, צינורות שחורים ופח כתום, ומכונית חונה ברקע.                                     |
| 27  | `Gemini_Generated_Image_t4toubt4toubt4to2.png` | reject                                      | digging and pipe repair; a different, younger man           | טכנאי במשקפי מגן כורע בתוך בור חפירה בחצר מרוצפת ואוחז בשתי ידיו צינור שחור, לצד ערמות חול ואבנים.                                                   |
| 28  | `Gemini_Generated_Image_t4toubt4toubt4to3.png` | reject                                      | joining pipes in a trench; a different man                  | טכנאי במשקפיים מחבר צינורות שחורים במחברי פליז בתוך תעלה חפורה, ולצידו ערמת עפר וכלי עבודה.                                                          |
| 29  | `Gemini_Generated_Image_x8j3c2x8j3c2x8j31.png` | maybe                                       | drain camera (unconfirmed); doubled tap unless cropped      | טכנאי בחולצת טרמוליק כורע בחדר רחצה ליד כיור ומחזיק צג של מצלמת צנרת, וכבל אדום מסליל שעל הרצפה מושחל לפתח ניקוז ברצפה.                              |
| 30  | `Gemini_Generated_Image_x8j3c2x8j3c2x8j32.png` | maybe                                       | drain camera (unconfirmed); best of its set                 | טכנאי בחולצת טרמוליק כורע על רצפת חדר רחצה, מחזיק צג של מצלמת צנרת ומשחיל את הכבל השחור שלה לפתח ניקוז פתוח ברצפה.                                   |
| 31  | `Gemini_Generated_Image_x8j3c2x8j3c2x8j33.png` | maybe                                       | drain camera (unconfirmed); face turned away                | טכנאי בחולצת טרמוליק מביט בצג של מצלמת צנרת המציג חלל צינור אפור עם פתח עגול כהה, ולידו על הרצפה סליל כבל אדום.                                      |

## Register — second batch, reviewed 2026-10-27

14 Gemini frames, downloaded at 2K (`Download full size`). The user first dropped compressed 1K
copies into `public/images/images for testing/`; they were moved out of `public/` and replaced here
by the 2K originals (same pictures, checked pixel by pixel). Only the 9:16 set (#33, #38, #43)
followed the 2026-10-22 prompt fully; the 3:4 and 16:9 frames brought back safety glasses indoors,
khaki trousers and American-looking rooms. **2 shipped, 6 "maybe", 6 rejected.**

Review: the same checklist and verdicts as the first batch, at full size and at gallery size, with
עומר's reference portraits (`עומר רטנר 1–5`) for the face. #37, #40, #41 and #42 had two independent
reviewers who agreed; #36 and #44 one reviewer plus a second check; #33, #38 and #43 a full check
plus two reviewers' partial passes (their run was cut off) that found nothing beyond the notes
below; #32, #34, #35, #39 and #45 one full check.

- **Worth regenerating:** #35, #41 and #44 — the same poses with no glasses, dark trousers, an Israeli
  room and (#41) the sink cupboard closed.

| #   | Master                                        | Verdict                                | Why                                                                                                      | Alt text                                                                                                                                         |
| --- | --------------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 32  | `Gemini_Generated_Image_1fnqcj1fnqcj1fnq.jpg` | maybe                                  | safety glasses indoors                                                                                   | טכנאי מחזיק מצלמה תרמית מעל רצפת מקלחת אפורה עם תעלת ניקוז, ליד דופן זכוכית.                                                                     |
| 33  | `Gemini_Generated_Image_46ln7y46ln7y46ln.jpg` | **shipped** → `ceiling-thermal-scan`   | clean at every scale; the side FLIR logo is slightly broken, visible only zoomed                         | טכנאי בחולצת טרמוליק כורע על רצפת אריחים בהירה ומרים מצלמה תרמית אל כתם רטיבות חום בתקרה, ליד חלון עם תריס גלילה ונוף של בנייני אבן.             |
| 34  | `Gemini_Generated_Image_4zkk2l4zkk2l4zkk.jpg` | reject                                 | American-looking room; 16:9 — the default 3:5 slice keeps only his arm                                   | טכנאי עומד בסלון מואר ומרים מצלמה תרמית אל התקרה.                                                                                                |
| 35  | `Gemini_Generated_Image_99484a99484a9948.jpg` | maybe                                  | safety glasses indoors; khaki trousers                                                                   | טכנאי בחולצת טרמוליק ובמשקפי מגן כורע בתא מקלחת עם דלת זכוכית ומכוון מצלמה תרמית אל רצפת המקלחת.                                                 |
| 36  | `Gemini_Generated_Image_a8lc69a8lc69a8lc.jpg` | maybe                                  | safety glasses indoors; khaki trousers and tan boots; stain barely visible                               | טכנאי בחולצת טרמוליק כורע ברך על רצפת אריחים בהירה ומכוון מצלמה תרמית אל כתמים חיוורים בקיר לבן, ליד דלתות הזזה מזכוכית בסלון מואר.              |
| 37  | `Gemini_Generated_Image_hawg57hawg57hawg.jpg` | reject                                 | a second man in the foreground; pipes exposed in an open ceiling; safety glasses indoors                 | טכנאי בחולצת טרמוליק מרים מצלמה תרמית אל צינורות בתקרה פתוחה, ואדם נוסף נראה מגבו בקדמת התמונה.                                                  |
| 38  | `Gemini_Generated_Image_ib25qyib25qyib25.jpg` | maybe                                  | clean, but a near-copy of #33 (same room and pose) — the spare if #33 comes down                         | טכנאי בחולצת טרמוליק כורע ומרים מצלמה תרמית אל כתם רטיבות חום בתקרה, ליד חלון עם תריס גלילה ונוף של בנייני אבן; על המסך כתם סגול במרכז רקע כתום. |
| 39  | `Gemini_Generated_Image_jnbnwujnbnwujnbn.jpg` | reject                                 | American-looking room; safety glasses indoors; khaki trousers; 16:9                                      | טכנאי בחולצת טרמוליק ובמשקפי מגן כורע על רצפת אריחים בסלון ומכוון מצלמה תרמית אל תחתית הקיר.                                                     |
| 40  | `Gemini_Generated_Image_lc0nmklc0nmklc0n.jpg` | reject                                 | tool belt with a hammer and pliers (garbled labels); American kitchen; safety glasses indoors            | טכנאי בחולצת טרמוליק מחזיק מצלמה תרמית מעל אי מטבח לבן עם כיור כפול מנירוסטה, במטבח פתוח ומואר.                                                  |
| 41  | `Gemini_Generated_Image_lv1gxwlv1gxwlv1g.jpg` | maybe                                  | safety glasses indoors; sink cupboard left open on the drain trap                                        | טכנאי בחולצת טרמוליק מחזיק מצלמה תרמית ליד ברז של כיור מטבח מנירוסטה; על המסך רקע סגול ופס צהוב וכתום שיורד לאורך מרכזו.                         |
| 42  | `Gemini_Generated_Image_nhnxr9nhnxr9nhnx.jpg` | reject                                 | the face doesn't read as עומר (stubble, heavier); work jacket, not the polo; building site; no 3:5 slice | טכנאי בקסדה צהובה, במשקפי מגן כהים ובמעיל עבודה כהה מחזיק בשתי ידיו מצלמה תרמית מול קיר בטון עם פסים כהים באתר בנייה.                            |
| 43  | `Gemini_Generated_Image_qaueaxqaueaxqaue.jpg` | **shipped** → `ceiling-thermal-screen` | clean at every scale; the screen's cool patch matches the stain behind it                                | טכנאי מחזיק מצלמה תרמית בחדר לבן ומאחוריו כתם רטיבות בתקרה; על המסך רקע כתום וכתם סגול כהה במרכזו.                                               |
| 44  | `Gemini_Generated_Image_sfxqbdsfxqbdsfxq.jpg` | maybe                                  | safety glasses indoors; olive trousers; dark wood floor                                                  | טכנאי בחולצת טרמוליק עומד ליד קיר לבן ומכוון מצלמה תרמית אל כתם רטיבות גדול עם שוליים חומים.                                                     |
| 45  | `Gemini_Generated_Image_wnik7ewnik7ewnik.jpg` | reject                                 | American-looking room; safety glasses indoors; olive trousers; 16:9                                      | טכנאי בחולצת טרמוליק ובמשקפי מגן עומד בסלון ומכוון מצלמה תרמית אל פינת קיר לבן.                                                                  |
