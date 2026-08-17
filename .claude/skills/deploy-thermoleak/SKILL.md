---
name: deploy-thermoleak
description: Ship thermoleak to production — Cloudflare Pages (project 'thermoleak') via the fleet ops script, dry-run then -Confirm, why pushing to main deploys NOTHING, the 15-day silent-drift incident that proves it, the out.prev rollback, and post-deploy verification against the live site. Use when publishing. Triggers "deploy", "ship it", "publish the site", "go live", "roll back", "why isn't my change live".
---

# Deploy

## The one thing to know

**Production is Cloudflare Pages (project `thermoleak`), direct upload via wrangler. Pushing to
`main` deploys nothing.** `.github/workflows/deploy.yml` is build-only CI.

Verified from the Cloudflare API (the Pages project serves `thermoleak.pages.dev`,
`thermoleak.co.il` and `www.thermoleak.co.il`) and from the fleet inventory: the DNS was **cut over
to Pages on 2026-08-02** — apex + www are proxied CNAMEs to `thermoleak.pages.dev`; the old apex A
record pointed at the cPanel server the retired rsync pipeline used to target.

## The incident this section exists to prevent

From 2026-08-02 to 2026-08-17 the repo's old rsync workflow **kept deploying, green, to the retired
cPanel server** — SSH succeeded, `--delete` synced, the status-only verify got 200s from routes that
existed in the old build too. Fifteen days of "successful" deploys never reached the public site.
It was caught only when a build-stamp assertion was added and went red.

Lessons encoded here:

- **A green pipeline is not a deploy.** Verify a content marker of the new build on the live
  domain, not a status code.
- **The origin is what Cloudflare says it is** — never what the repo believes. The ops script's
  drift check asks the Pages API before every upload; never bypass it to make a deploy pass.

## The command

Deploying is a **production mutation**. It runs dry first, and it always asks.

```powershell
# preview — safe, changes nothing
powershell -File "c:/Users/robiu/antigravity/Projects/Israeli services sites/ops/deploy-site.ps1" -Domain thermoleak.co.il -DryRun

# execute — only after the user asks
powershell -File "c:/Users/robiu/antigravity/Projects/Israeli services sites/ops/deploy-site.ps1" -Domain thermoleak.co.il -Confirm
```

Other flags: `-BuildOnly` (build + output gate, no upload), `-DeployOnly` (ship the existing `out/`
as-is), `-SkipDriftCheck` (only when the roster is knowingly ahead of DNS — never to silence a
failing check).

## What the script does, and why each step exists

1. Resolves the Pages project from the fleet roster (`thermoleak`).
2. **Drift check** — asks the Cloudflare API whether that project actually serves this domain.
3. Installs dependencies and clears `.next/` when needed (the staleness traps that produce a
   successful build of the wrong code).
4. `npm run build`.
5. **Output gate** on `out/` — refuses to ship a broken or truncated export.
6. Preserves the previous `out/` as `out.prev/` so a rollback is one command.
7. `npx wrangler pages deploy .\out --project-name thermoleak --branch main`.
8. Appends the result to the hub's `logs/deploys.csv`.

Credentials (`CLOUDFLARE_TOKEN_main`, `CLOUDFLARE_ACCOUNT_main`) come from the Sys Admin control
plane's `secrets/.env` — never from this repo, which is **public**.

## Before you deploy

Run `/qa-build-gate` end to end. Its stop-ship list applies — in particular, no `aggregateRating`
or `Review` in the export without a verifiable public source, no title with the brand zero times or
twice, no missing canonical on an indexable route.

`public/_headers` and `public/_redirects` ship inside `out/` — a deploy is what activates changes
to them. There is no `.htaccess`; that file died with the Apache origin.

## After you deploy

```bash
curl -sI  https://thermoleak.co.il/pricing/ | head -5          # 200 — a new-build route
curl -s   https://thermoleak.co.il/ | grep -o '<title>[^<]*</title>'
curl -sI  https://thermoleak.co.il/reviews/ | grep -iE '^HTTP|location'   # 301 -> /about/
curl -s   https://thermoleak.co.il/sitemap.xml | grep -c '<url>'          # 11
curl -sI  https://thermoleak.co.il/ | grep -iE 'strict-transport|x-frame' # _headers live
curl -s   https://thermoleak.co.il/robots.txt                             # managed block state
```

Check: a **new-build** route answers (not just old ones); the title carries the brand exactly once;
the `_headers` entries actually appear; `robots.txt` reflects the intended AI-crawler stance
(**Cloudflare prepends a managed block** — see `/aeo-answer-content`).

## Rollback

`out.prev/` holds the previous export: `npx wrangler pages deploy .\out.prev --project-name
thermoleak --branch main`. Cloudflare Pages also keeps prior deployments in its dashboard and can
roll back there, which is often faster — offer both and let the user choose. `git revert` fixes the
source but does **not** touch production until someone deploys.

## Rules

- **Never deploy without being asked.** Not as the last step of a task, not "while I'm here".
- Never use `-SkipDriftCheck` to make a failing deploy pass — a drift failure means the upload
  would go somewhere nobody can see, which is exactly the 15-day incident.
- Never verify a deploy by status codes on old routes; assert content only the new build has.
- Zone settings (AI crawler policy, Scrape Shield, cache rules) are the owner's to change; a deploy
  does not touch them. Scrape Shield email obfuscation applies to Pages responses too — `EmailOff`
  stays.
