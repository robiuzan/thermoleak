---
name: page-images-pipeline
description: The site-side runbook for putting AI page images on טרמוליק — the policy already in place, the authored slot plan, the Media Studio page-images toolkit in order (plan lint → brief → digest → the owner's yes → approve → calibrate → generate → qa → alt → finish → stage → review → install → gate → deploy), the legacy import of the eleven gallery images, the camera reference, the owner's five touches, the cost table, and how to retire, replace or revoke. Use when generating, reviewing or installing page images, or when something in that chain fails. Triggers "generate the images", "run the image pipeline", "approve the prompts", "review board", "install the images", "retire an image", "revoke consent".
---

# Page images — the pipeline, site side

Read first: `CLAUDE.md` §15 (the decisions), skill `page-imagery` (the slots, what the words may say) and the
contract that fixes every path and command:
`C:\Users\robiu\antigravity\Projects\Media Studio\page-images\docs\contract.md`. Where this file and the
contract disagree, the contract wins.

The toolkit lives in Media Studio. This repo contributes the plan (`content/images/plan.json`), the components
(`Figure`, `FieldStrip`, `Gallery`, `ArticleBody`), the validator (`lib/images.ts`) and the gate
(`scripts/images/check-images-out.mjs`), and it carries no `sharp`. This site's configuration is in
`Media Studio\sites\thermoleak\` (`site.json`, `style.md`, `judge.json`, `import.json`, `plan-generator.mjs`,
`brand\`). The portraits, the shield, the camera reference and the consent record are in
`Media Studio\refs\thermoleak\` and never enter git.

## The owner's touches — everything else runs unattended

| #   | Touch                                                                         | Where                                                   |
| --- | ----------------------------------------------------------------------------- | ------------------------------------------------------- |
| 1   | Approve the plan, the seven note texts and the budget (done 2026-11-01)       | chat                                                    |
| 2   | The consent record for עומר and יואב (signed copies reported done 2026-11-01) | `Media Studio\refs\thermoleak\CONSENT.md`, outside git  |
| 3   | One "yes" on the prompt digest                                                | `Media Studio\sites\thermoleak\plan-digest.md` → chat   |
| 4   | One board session (about 70 cards: approve all passing, plus spot checks)     | `http://localhost:4310` beside `npm run dev:images`     |
| 5   | Confirm the deploy                                                            | `ops/deploy-site.ps1 -Domain thermoleak.co.il -Confirm` |

Expected spend is about US$20–25 against a hard cap of US$45 (`runner.costCapUsd`). Only the owner raises it.

## 0. Prerequisites

- `npm run gate` is green with the manifest as it stands.
- **The shared toolkit order.** Nobody edits `page-images/lib` while another session has it dirty. On
  2026-11-01 the order is hambabait, then netomazganim, then this site's changes: object references, the
  legacy import, retire-on-install, `minQuality`, calibration by the site's own rules, the allowed FLIR text,
  rejected frames staying out of `stage`, and `brief --refresh-blocks`. `object-mismatch` and the camera reference
  need those changes, so nothing renders before they land.
- Media Studio: `cd page-images && npm install && npm test`. `secrets/.env` holds `GEMINI_API_KEY` and
  `ANTHROPIC_API_KEY`, by name, never printed.
- `node page-images/cli.mjs doctor --site thermoleak` is all green.

Toolkit commands run from the Media Studio root: `node page-images/cli.mjs <cmd> --site thermoleak [--dry-run]`.

## 1. The slot plan

`content/images/plan.json` holds 55 render slots and 11 reuse entries; `plan-generator.mjs` records how it was
made, and the JSON is the source of truth. `plan lint --site thermoleak` must print 0 violations and 0 warnings
across 27 routes. Every frame with a person sets `badge: true`, and every frame with the camera sets
`objects: ["camera"]`. A people-free subject must not contain man, men, person, people, technician, worker,
crew, he, him, his, hand or hands.

A slot with a `service` has the camera. A frame without the camera has `service: null`, so it gets
`TRADE:generic` and the TRADE block never names a device the frame must not hold. `objectFallback: false` keeps the
camera-fallback block off a frame whose camera is dark or set down, and `twin: false` on the hero stops a people-free
twin after a refusal: the old hero stays live instead.

## 2. Prompts and the digest

```powershell
node page-images/cli.mjs brief  --site thermoleak     # prompts\thermoleak\<slot-id>.md, approved: null
node page-images/cli.mjs digest --site thermoleak     # sites\thermoleak\plan-digest.md, prints batch <sha8>
```

The digest is the owner's page: one line per slot, the fixed blocks once, the reference objects, the consent
record, the Hebrew notes, the cost estimate and the batch fingerprint.

## 3. The owner's yes → approve

Only after the owner says yes **in chat** to that digest:

```powershell
node page-images/cli.mjs approve --site thermoleak --batch <sha8> --by "owner in chat"
```

Nobody edits `approved:` by hand, and a new scene is a new batch.

## 4. Calibrate, pilot, batches

1. **Calibrate** (about US$1): `qa --site thermoleak --calibrate --only thermoleak --cap 5` scores the judges on
   the 45 labelled masters; without `--only` it pools other trades' frames. Go when `wrong-trade`, `text`,
   `branding` and `extra-person` reach ≥ 90 % recall. No labelled frame has a wrong face, so the pilot measures
   the face.
   Tune the wording in `judge.json`, never the labels.
   **First run, 2026-11-02 (US$1.66, `review/thermoleak/calibration.json` in Media Studio): go.** Recall:
   `wrong-trade` 93 % (14/15), `text` 100 %, `branding` 100 %, `extra-person` 100 % (2/2), `object-mismatch`
   100 % (3/3); `foreign` 75 % (3/4) and the one-label `impossible` and `screen-mismatch` missed, none on the go
   line. Verdicts 29/37. Precision looks poor (`text` 17 %, `branding` 28 %, `screen-mismatch` 10 false
   positives), but read against the judges' reasons most of it is label drift: the 2026-10-22 labels predate
   today's rules, and the judges rightly flag a lettered «טרמוליק» shirt (03, 17), the emblem on a sleeve (13,
   24), temperature digits on a screen (17, 24) and a readable «E8» on the camera (43). Labels were not changed
   after the run. Two things follow: renders will tend to copy the «E8» printed on the reference camera, which
   today's `allowedText` (`FLIR` only) rejects — a question for the owner with the digest; and some of the 11
   legacy gallery images break today's rules (24 is live), which the owner sees again on the board.
2. **Pilot** (10 frames, about US$7): 3 עומר with the camera, 2 יואב with the camera, the hero, 2 people-free
   with the camera (the case, and a set-down camera with its screen), 1 people-free without it, 1 `done` frame
   with tape.
   - **Go:** ≥ 7/10 pass within two attempts, the face matches on ≥ 80 % of person frames, `object-mismatch` on
     ≤ 2 first attempts, the FLIR mark legible and unbroken on ≥ 2 of 3 camera close-ups, `badge-mismatch` on
     ≤ 1 of 3, zero stray text, ≤ 1 refusal.
   - **No-go:** rewrite `OBJECTS:camera`, promote the fallback framing, or take it to the owner. A prompt keeps
     its fixed blocks once briefed, so re-issue them with `brief --refresh-blocks`. Dropping the FLIR mark is the
     owner's decision.
   **The pilot, 2026-11-02 (batch `e95502a2`, US$3.39): go.** All 10 pass. 7 of 10 within two attempts (the hero
   needed three, the insurance `main` four), no refusal, no wrong camera, every kept face matches, the marks read
   on 2 of 3 close-ups. The owner allowed a small «E8» beside «FLIR» the same day (`judge.json` `allowedText`);
   the prompts still ask for FLIR only, and the set-down camera now renders both cleanly. What the pilot taught:
   - **The judges see 1280 px and miss small things.** Readout digits and a scale bar on a tablet, a garbled
     «ALIB» for FLIR, a beard on the clean-shaven manager, a blue ceiling stain and a breaker glowing orange all
     passed both judges. So every batch gets a full-size review (crops of screens, the camera body, faces,
     the chest and the corner) before the board, and what it finds is queued as a `reviewer` regenerate: the
     sidecar's `qa.final` becomes `regenerate` with a `qa.reviewer` record, and the prompt gains a positive
     `## Fix after attempt N` line. Only Fix sections change; the approved scene stays byte-identical.
   - **A judge's own fix line can contradict the approved prompt** (asking for an E8 on the bezel that the NO TEXT
     block rules out) or name a person by id, which the image model cannot use. Read the Fix lines QA writes and
     rewrite them before the next render.
   - **The agreement rule lets real faults through:** one judge's `panel-contact` on a panel with its cover plate
     gone was downgraded. The reviewer catches those.
   - `judge.json` gained the lens rule (a screen toward the viewer means a lens away from him), thermal colours
     only on a screen, facial hair as part of the face, and `face-mismatch` only with `faceMatch: "no"`.
   **The batches, 2026-11-02 (US$23.15 in all, pilot included): 52 of 55 slots staged with the 11 imports.**
   - **The screen rule, as applied:** a man *facing the viewer* holds the camera with its screen toward himself;
     a lit screen toward the viewer in his hands is a regenerate. Side-on or in profile, with the lens plausibly on
     the surface, it is a board note. The image model poses men frontally with the screen out; "side-on to the
     viewer, his face in profile, the small shield on his chest in view" in a Fix line is what worked.
   - **A stopped slot (`needs-owner`) is restarted by hand:** move `needs-owner.json` aside (kept, never
     deleted), add a Fix for the latest attempt, re-run. `runner.maxAttempts` is 8 here since 2026-11-02.
   - **Left empty after eight attempts:** `gallery-generated-2` (painted bay numbers, then the emblem on a
     sleeve), `gallery-generated-4` (always facing the viewer with the screen out), and
     `services-insurance-reports-work` (the image model draws a temperature readout on every tablet). Every
     route keeps two images or more; `/gallery/` keeps 19 tiles. A new scene for any of them needs a new yes.
   - **The judges also missed** a picture rendered on its side (now in `impossible`), stripped or patched plaster
     behind a man, and a hard-edged repainted patch. The full-size review catches these.
3. **Batches:** services and gallery (18) → home, about, contact, pricing, the locations strip (10) → cities
   (24) → guides (3). `import` runs beside the first batch and spends nothing with Gemini.

```powershell
node page-images/cli.mjs generate --site thermoleak --only "services-*,gallery-*" --dry-run
node page-images/cli.mjs generate --site thermoleak --only "services-*,gallery-*"
node page-images/cli.mjs qa       --site thermoleak
node page-images/cli.mjs alt      --site thermoleak
node page-images/cli.mjs finish   --site thermoleak
node page-images/cli.mjs stage    --site thermoleak --dry-run
node page-images/cli.mjs stage    --site thermoleak
node page-images/cli.mjs import   --site thermoleak --dry-run
node page-images/cli.mjs import   --site thermoleak --retire
```

- `qa` is deterministic checks plus two vision judges. `strict` is false here, so `agreement` codes need both
  judges or high confidence. It amends the prompt with the judges' positive fixes, so re-run `generate` and `qa` until nothing is queued,
  up to `runner.maxAttempts`.
- `finish` resizes to the slot's box, composites the logo bottom-right on navy or white by the corner's
  brightness, and writes WebP at q85, stepping to q80. It never goes below `minQuality` 80: a frame that does
  not fit moves down a size class.
- **The eleven legacy images** go through `import`, from the shipped WebP files at 720×1200. The list is
  `sites\thermoleak\import.json`. Their alts stay the approved ones.

Before the owner's session, run the `image-qa-reviewer` agent over the candidates and regenerate what it finds.

## 5. Review on the real pages

```powershell
node page-images/cli.mjs review --site thermoleak   # the board at http://localhost:4310; it starts dev:images itself
```

Candidates render in place with the «טיוטה — ממתין לאישור» badge, and each card links to
`http://localhost:3000<route>#img-<id>`. Check `/`, a service, a guide, a city, `/about/` (the team figure and
its note), `/contact/`, `/gallery/`, the footer, and the column widths at 1280 px.

## 6. Install, status, gate

```powershell
node page-images/cli.mjs install --site thermoleak --dry-run
node page-images/cli.mjs install --site thermoleak
npm run images:status
npm run gate
```

`git status` must show only `public/images/**`, `content/images/manifest.json` and the dates below. Never
`assets/`, never `_candidates/`. Commit only when asked.

When every content route has its two images:

1. Set `gates.minPerContentPage` to `2`.
2. Move `lastModified` in `lib/site.ts` `staticRoutes`, `lib/services.ts` and `lib/locations.ts`, and
   `dateModified` in `lib/articles.ts`, for the routes that gained a captioned figure. Re-issuing an image with
   the logo does not count.
3. Set `/gallery/`'s date to the ship date.
4. Record the measured export size in `docs/performance-guidelines.md` §1 and backlog §10.6, and move the state
   line in CLAUDE.md §15.

## 7. Deploy — ask first

Skill `deploy-thermoleak`: `-DryRun`, show the delta and the drift check, wait for the owner, `-Confirm`. Then
its post-deploy image checks, then `node page-images/cli.mjs mirror --site thermoleak --to <the owner's folder>`.

## Cost table

| Item                                             | Unit (USD) | Expected                 |
| ------------------------------------------------ | ---------- | ------------------------ |
| `gemini-3-pro-image`: person or camera frame, 2K | 0.134      | 40 slots ≈ 5.4           |
| `gemini-nano-banana-2.1`: people-free, no camera | 0.0504     | 15 slots ≈ 0.8           |
| Retries (faces, the shield, the camera)          | —          | ≈ 6                      |
| Two judges per render, scene writer, alt         | list price | ≈ 6                      |
| Calibration                                      | —          | ≈ 3                      |
| **Total**                                        |            | **≈ 20–25, hard cap 45** |

`status` prints the running total from the ledger. When `generate` refuses past the cap, stop and report.

## Retire, replace, revoke

- A published file is **never deleted or renamed casually**. A replacement is a new slug plus `retired` on the
  old entry. The file stays at least 60 days, and removing it is a separate owner decision.
- A rollback never deletes an image: `wrangler pages deploy .\out.prev` (copy the newest `_next/static` in
  first, CLAUDE.md §10) or `git revert` of the manifest commit.
- **Revoked consent overrides the 60-day keep:** a people-free twin at the same dimensions for every frame the
  person is in, installed at new file names; old entries retired with a `consentRevoked` date, which an operator
  sets; the old files gone from `public/images/` within 14 days, which the gate enforces; the references deleted
  the same day.
- Real phone photos enter as `owner-supplied` and replace renderings one for one.

## Troubleshooting

| Symptom                                               | Do                                                                                                        |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `images:check` fails on an alt or caption stem        | Fix the text on the board. Never in the manifest by hand, never by weakening the stems                    |
| `images:check`: an unreferenced file                  | Fix the manifest through the toolkit. Never delete a live file                                            |
| `images:check`: two `fetchpriority="high"`            | A component passed `priority` twice. Only the first content image in DOM order may carry it               |
| `images:check`: `/images/` inside JSON-LD or og:image | A rendering never goes there. Remove the reference, not the check                                         |
| `out/.images-draft` exists                            | The last build ran with `IMAGES_DRAFT=1`. Rebuild without it                                              |
| `doctor`: images.config.mjs differs from site.json    | The trade stems drifted. Make the two files identical                                                     |
| The camera comes out wrong or decorated               | `object-mismatch`, then the two-failure fallback framing; persistent means the pilot's no-go              |
| A screen shows something the lens cannot see          | `screen-mismatch`. In a person frame the screen faces him; a lit screen belongs to a set-down camera      |
| The shield renders garbled or lettered                | `badge-mismatch` rejects it. The shield is required here, so a frame that keeps failing goes to the owner |
| A frame shows something opened, drilled or repaired   | `wrong-trade`: regenerate. Never accept it, however good the frame looks                                  |
| The two-man frames keep failing the face match        | Hero, team, gallery-1 only. If `home-main` exhausts its attempts, `hero.webp` stays live                  |
| Gemini refuses a face prompt repeatedly               | The framing fallback already ran; take it to the owner, since a required shield rules out most twins      |
