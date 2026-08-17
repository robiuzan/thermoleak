---
name: deploy-thermoleak
description: Ship thermoleak to production — pushing to main IS the deploy, the GitHub Actions rsync-over-SSH pipeline to the cPanel docroot, why there is deliberately no Cloudflare purge step, the rsync --delete semantics, post-deploy verification, and how to roll back when there is no out.prev. Use when publishing. Triggers "deploy", "ship it", "publish the site", "go live", "roll back", "why isn't my change live".
---

# Deploy

## The one thing to know

**Pushing to `main` deploys to production.** There is no separate deploy command, no staging
environment, and no manual approval gate. `git push` is the production mutation.

This is the **opposite** of the Cloudflare Pages sites in the same fleet, where pushing to `main`
deploys nothing and a `wrangler` script does the work. Don't carry that assumption over.

## The pipeline

`.github/workflows/deploy.yml`, on every push to `main` (and on `workflow_dispatch`):

1. Checkout, Node 22, `npm ci`.
2. `npm run build` → `./out`.
3. **rsync over SSH** to the cPanel docroot (`websquadinc` account):
   ```
   rsync -rltzv --delete --chmod=D755,F644 --exclude='.well-known' \
     ./out/ "$SSH_USER@$SSH_HOST:thermoleak.co.il/"
   ```
4. **Verify the deploy landed** — `curl` `/`, `/contact/` and `/services/` and fail the job on anything
   that isn't HTTP 200.

`concurrency: deploy-prod` with `cancel-in-progress: true`, so a rapid second push supersedes the first
rather than racing it.

Transport is SSH because **FTP is disabled on this server**. The `websquadinc` account has a jailed
shell and an authorized deploy key; the private key is the `SSH_PRIVATE_KEY` repo secret.

## Things in that workflow that look wrong and are not

- **`--delete`** makes the docroot match `./out` exactly. That is deliberate — the first run also
  cleared the old WordPress files that used to live there. `.well-known` is excluded so cPanel
  AutoSSL/ACME keeps working.
- **There is no Cloudflare cache-purge step, on purpose.** Cloudflare serves this site's HTML with
  `cf-cache-status: DYNAMIC` (uncached) and every static asset is content-hashed, so a purge has nothing
  to clear. Deploys landed correctly on all pages during the months its `CF_API_TOKEN` sat expired and
  the purge returned 401 — a step that could only ever fail was marking every run red and camouflaging
  the runs that failed for real reasons.
  **Reinstate a purge only if a Cache Rule is later added that caches HTML.** If so, mint a token scoped
  to Zone → Cache Purge on this zone alone — **do not** reuse the fleet-wide Sys Admin token: this repo
  is **public**.
- **The verify step is not redundant.** `rsync` exiting 0 proves bytes moved, not that the origin serves
  the new build. The three-URL assertion is what makes a green check mean something.

## Before you push

Run `/qa-build-gate` end to end. Its stop-ship list applies — in particular:

- no `aggregateRating` in the export without a verifiable public source (currently on all 13 pages);
- no `<title>` with the brand zero times or twice;
- no missing canonical, no route absent from the sitemap.

Because the push *is* the deploy, "I'll fix it after I see it live" costs a second production deploy and
a window of broken pages.

## Deploying is a production mutation — always ask

**Never commit to `main` as the last step of a task unless you were asked to.** Not "while I'm here",
not "to test the pipeline". Build, gate, report, and let the user decide when it ships.

If work needs to land without deploying, use a branch and open a PR — the workflow only fires on `main`.

## After a deploy

```bash
curl -sSI https://thermoleak.co.il/ | head -20
curl -sS https://thermoleak.co.il/services/water-leak-detection/ | grep -o '<title>[^<]*</title>'
curl -sS https://thermoleak.co.il/robots.txt
curl -sS https://thermoleak.co.il/sitemap.xml | grep -c '<url>'      # expect 11
curl -sL -o /dev/null -w '%{http_code}\n' https://thermoleak.co.il/some-missing-page/   # expect 404
```

Check: the page is the new build; the title carries the brand exactly once; `robots.txt` matches what
`app/robots.ts` intends (**Cloudflare can prepend a managed block** — see `/aeo-answer-content`); the
sitemap lists 11 URLs; the 404 actually returns 404 via the `.htaccess` `ErrorDocument`; and any new
`public/.htaccess` header entries actually appear in the response (`/web-security-headers`).

## Rollback

There is **no `out.prev/`** on this pipeline, and `--delete` means the previous docroot contents are
gone. Rollback options, in order:

1. **`git revert` the offending commit and push.** The pipeline rebuilds and re-syncs. This is the
   normal path and takes one deploy cycle.
2. **`workflow_dispatch`** the workflow from an earlier commit if you need a specific known-good build.
3. Cloudflare cannot roll you back — it isn't serving cached HTML.

Because reverting is the rollback, keep commits small enough to revert cleanly.

## Rules

- **Never push to `main` without being asked.** The push is the deploy.
- Never deploy with `/qa-build-gate` stop-ship items outstanding.
- Never add an origin-side HTTPS redirect to `public/.htaccess` — Cloudflare already forces HTTPS and
  the origin rule loops.
- Never reinstate the cache purge without a caching rule that justifies it, and never with the
  fleet-wide token in a public repo.
- Zone settings (AI crawler policy, cache rules, Scrape Shield) are the owner's to change; a deploy does
  not touch them. Note Scrape Shield's email obfuscation **is** on — that's what `EmailOff` works
  around, so don't "clean up" that component.
