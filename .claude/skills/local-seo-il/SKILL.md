---
name: local-seo-il
description: Israeli local-SEO doctrine for טרמוליק — NAP for a service-area business with no premises, the 12 named service areas — all with a page since 2026-10-28 and none yet with a real job reference — the 4×12 matrix and its expansion cap, Hebrew ב+city grammar, sameAs and geo both empty by design until a real GBP lands, Google עסק שלי as the top lever, and the doorway-page policy that gates any city page. Use when planning local coverage or auditing local visibility. Triggers "local SEO", "NAP", "city pages", "Google עסק שלי", "doorway pages", "areaServed", "add a city".
---

# Local SEO — Israel

One business, **no public premises**, 12 named service areas, **all 12 with location pages** —
תל אביב, חולון, בת ים since 2026-08-30 (`7c9bbda`), the other nine added 2026-10-28 at the owner's
request. Everything below follows from that.

The doctrine in this file is stable. The **status** paragraphs are the part that rots — every one of
them was wrong for two weeks after sprint 3. Verify against `lib/locations.ts` and `out/` before
reporting a local gap.

## 1. NAP for a service-area business

There is no street address, deliberately: `site.address.note` reads
"שירות עד בית הלקוח — אין צורך להגיע למשרד", and `PostalAddress` in the JSON-LD carries only
`addressRegion: "גוש דן והמרכז"` + `addressCountry: "IL"`. That is a **legitimate** configuration — but
it commits you to three things:

- The Google Business Profile must be a **service-area profile with the address hidden**. A profile with
  a visible address that the site doesn't show is an inconsistency Google resolves against you.
- `geo` must be real or absent, and here it is **absent by design**: `lib/site.ts` has no `geo` key at
  all, and no `GeoCoordinates` node is emitted anywhere. A placeholder pointing at Tel Aviv city centre
  was removed 2026-08-17. Do not restore one — a real operating base is a `docs/business-facts.md` §E
  fact the owner has to supply.
- Phone and email must be byte-identical everywhere. They currently are, and per the roster manifest
  they are **real fleet values** — `055-660-1006` / `+972556601006` / `info@thermoleak.co.il`. Don't
  "correct" them to the fleet's `055-6601006` display format without checking; the E.164 number matches.

## 2. Google עסק שלי — the top lever

`sameAs` is **empty and there is no `social` key in `lib/site.ts`**. The two platform-homepage links
that used to sit there (`facebook.com`, `instagram.com`) were emitted into `sameAs` and rendered as
footer icons; both were removed 2026-08-17 and `components/Footer.tsx` carries a comment saying they
return only with real profile URLs. There is **no GBP link anywhere on the site** — that is the gap,
not the empty field.

For a single-operator trade business the Business Profile outranks almost everything else you can do
on-page: it drives the map pack, it is where reviews live, and it is the entity anchor that makes
`sameAs` meaningful. It is also the **only** legitimate source for a rating or a review on this site.
The six invented testimonials and the 4.9 `aggregateRating` built from them were removed 2026-08-17
and `/reviews/` now 301s to `/about/`; reintroducing any of it without a real sourced profile is a
stop-ship, not a shortcut (golden rule 3, `/schema-structured-data`).

This is a `docs/business-facts.md` §B blocker, not a code task. Escalate it rather than working around
it. Once supplied, the URL goes in `lib/site.ts` and flows to `sameAs` and the footer from there.

## 3. The Tier-2 layer — twelve of twelve

`site.serviceAreas` names twelve cities:

> תל אביב-יפו · רמת גן · גבעתיים · הרצליה · פתח תקווה · ראשון לציון · חולון · בת ים · רעננה ·
> כפר סבא · ראש העין · מודיעין

Every one has a route at `/locations/{slug}/` since 2026-10-28, so the `איתור נזילות ב{city}` layer —
the way most local demand is actually typed — is fully expressed, and the schema's twelve `City`
nodes no longer claim more than the site shows. The open local work is **page strength**, not page
count:

- **No real job reference in any city.** It is the strongest doorway-test item and the one research
  cannot supply (business-facts §E).
- **Every claim is 🔶 until the owner confirms it.** §E lists the weakest, single-source claim per
  city to confirm first.
- **No service page links to any city** (LOC-2, §8).
- **No Google Business Profile** (§2) — still the top lever.

## 4. The doorway policy — non-negotiable

> Replace the city name with another city name. Is the page now correct and publishable for that other
> city? If yes, it is a doorway page.

All twelve pages passed this gate — the first three on 2026-08-24, the nine on 2026-10-28, each read
side by side with the other eleven. `lib/locations.ts`'s header records why the list once stopped at
three even though all twelve could clear the bar, and keeps those reasons as the risk the owner
accepted in lifting the cap. To pass, a location page needs **three or more** true, specific items:

- Named neighbourhoods, streets or landmarks.
- Housing-stock reality — 60s שיכונים with old galvanised plumbing, towers with pressurised systems and
  shared risers, ground-floor flats where the leak is in the slab.
- A real job reference from that city (with permission), or a photo.
- Travel and response reality for that distance — is same-day genuinely available there.
- A city-specific FAQ that would read oddly anywhere else.
- Local pricing reality if it differs.

**If none of those can be said truthfully about a city, that city does not warrant a page.** Record that
in business-facts §E rather than padding. Full spec: `docs/content-standards.md` §2–§3.

The shipped model carries that audit trail in the data: each claim is a `LocationClaim` with a
`category` of `"housing-stock" | "neighbourhood" | "travel" | "infrastructure"`, so a reviewer can see
**why** a claim was considered city-specific. Keep that when you add a city — see `/new-city`.

> ⚠️ **Batch 2 was not a data edit, and was not run as one.** The 2026-08-24 claim texts were never
> saved (LOC-1), so on 2026-10-28 each of the nine was researched afresh and given two independent
> fact-checks (one against the cited live pages, one blind). The re-check overturned two queued leads:
> הרצליה's "94 בנייני רכבת ביד התשעה" (no source) and רעננה's "קריית שרת 1950s railway buildings"
> (refuted). Every statement's source is in `docs/location-sources/{slug}.md`; the first three cities
> have no register yet. A thirteenth area means the same fresh pass — see `/new-city`.

## 5. Hebrew grammar per location

All twelve are real cities, so `ב{name}` mostly works — with two cautions:

- `תל אביב-יפו` reads badly in a title as `בתל אביב-יפו`. Use `בתל אביב`.
- Any future **region** entry (השרון, השפלה, גוש דן, צפון) needs `בצפון הארץ` / `באזור השרון`, not a
  bare preposition.

The shipped `Location` interface in `lib/locations.ts` already encodes this — don't redesign it:

```ts
kind: "city" | "region"; // drives City vs AdministrativeArea in the schema
prefixed: string; // the name WITH its preposition — בתל אביב, באזור השרון
```

`kind` drives the schema type; `prefixed` carries the preposition so no template has to guess. Read the
full interface from the file rather than from any doc, this one included.

## 6. The expansion cap

4 services × 12 areas = 48 possible cells. **Do not build them.** Order of operations:

1. Build location pages **only** for cities where §4 can be satisfied. All 12 have one since
   2026-10-28 — the owner's decision, replacing the old 3–5 ceiling. An area beyond the twelve goes
   through `/new-city`.
2. Each earns its depth per content-standards §3 before the next one starts.
3. Only then consider a service × location second tier, and only for services with genuine local
   demand — `water-leak-detection` and `moisture-detection`, not `insurance-reports` (which is a
   document, not a place).

A cell exists when there is something true and specific to say in it. Not before.

## 7. Coverage honesty

`site.serviceAreaText` reads "גוש דן והמרכז · שירות ארצי בתיאום מראש" while `areaServed` enumerates
twelve cities and the `Service` nodes claim the region. An `areaServed` the business cannot service
produces leads it can't serve and a claim it can't defend. The national clause was **confirmed
2026-09-17** (business-facts §E: reach is about two hours' drive from Tel Aviv), and the unconfirmed
"עד 60 ק״מ" was removed the same day — do not restore a radius. The realistic **same-day** radius is
still 🔶, which is why only the four nearest city pages say "נשתדל להגיע באותו יום".

## 8. Internal equity

The mesh shipped **half wired** (LOC-2), and this is the standing local gap:

- ✅ `/locations/` is in `navLinks` and in the footer's navigation column, so every page reaches the hub
  and nothing is orphaned.
- ✅ Each city page links out to all four services, and `nearby` edges between the cities are
  bidirectional — build-enforced since 2026-10-28 (an unknown or one-way slug fails the build).
- ✅ The footer's `אזורי שירות` list links all twelve cities on every page (since 2026-10-19), and the
  hub shows twelve cards — each city page is linked from 30 other pages. That is chrome, though.
- ❌ No service page links to any city with a descriptive anchor — the four pages that monetise a local
  query send no relevance signal to the page targeting it.

Wire the inbound links **in the same commit** as any new city; `/new-city`, the roadmap and
`docs/keyword-map.md` §6 all say "before it ships", and sprint 3 and the 2026-10-28 batch are the
counter-examples. See `/internal-linking`.

## Checklist

- [ ] GBP exists as a service-area profile, is linked from the site, and is in `sameAs`.
- [ ] `sameAs` contains real profile URLs, or is empty — never a platform homepage. It is empty today.
- [ ] `geo` is the real operating base, or absent. It is absent today.
- [ ] No `aggregateRating`, no `Review` — unless sourced from a real public profile (§2).
- [ ] Every location entry has `kind` and `prefixed`; no template interpolates a bare `ב${name}`.
- [ ] Every location page that ships passes the doorway test.
- [ ] Location pages emit `Service` + `areaServed` with the correct area type.
- [ ] The national coverage claim is confirmed or removed.

## Gotchas

- **Never** a `LocalBusiness` node per city. This business has no premises at all; one node is the
  honest count.
- Never invent a review, rating, neighbourhood or coordinate to fill a local-SEO checkbox. This site
  shipped invented ones once and paid to remove them; the empty fields are the fix, not the defect.
- Nine city pages landed together on 2026-10-28 at the owner's request — the doorway pattern,
  accepted knowingly (header of `lib/locations.ts`), not a template for the next batch. Every page
  still has to pass §4 on its own, and there is no staging environment between the ops script and
  production.
