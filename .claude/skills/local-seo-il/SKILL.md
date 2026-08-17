---
name: local-seo-il
description: Israeli local-SEO doctrine for טרמוליק — NAP for a service-area business with no premises, the 12 named service areas that have no pages behind them, the 4×12 matrix and its expansion cap, Hebrew ב+city grammar, the placeholder sameAs and geo, Google עסק שלי as the top lever, and the doorway-page policy that gates any city page. Use when planning local coverage or auditing local visibility. Triggers "local SEO", "NAP", "city pages", "Google עסק שלי", "doorway pages", "areaServed", "add a city".
---

# Local SEO — Israel

One business, **no public premises**, 12 named service areas, **zero location pages**. Everything below
follows from that.

## 1. NAP for a service-area business

There is no street address, deliberately: `site.address.note` reads
"שירות עד בית הלקוח — אין צורך להגיע למשרד", and `PostalAddress` in the JSON-LD carries only
`addressRegion: "גוש דן והמרכז"` + `addressCountry: "IL"`. That is a **legitimate** configuration — but
it commits you to three things:

- The Google Business Profile must be a **service-area profile with the address hidden**. A profile with
  a visible address that the site doesn't show is an inconsistency Google resolves against you.
- `geo` must be real or absent. `site.geo` is currently `32.0853, 34.7818` — **Tel Aviv city centre**,
  a placeholder. For a business with no premises, either drop it or set the real operating base
  (business-facts §E).
- Phone and email must be byte-identical everywhere. They currently are, and per the roster manifest
  they are **real fleet values** — `055-660-1006` / `+972556601006` / `info@thermoleak.co.il`. Don't
  "correct" them to the fleet's `055-6601006` display format without checking; the E.164 number matches.

## 2. Google עסק שלי — the top lever

`site.social` holds `https://www.facebook.com/` and `https://www.instagram.com/` — platform homepages,
not profiles — and they are emitted into JSON-LD `sameAs` **and** rendered as the footer's social icons.
There is **no GBP link anywhere on the site**.

For a single-operator trade business the Business Profile outranks almost everything else you can do
on-page: it drives the map pack, it is where reviews live, and it is the entity anchor that makes
`sameAs` meaningful. It is also the only legitimate source for the `aggregateRating` the site is
currently fabricating (see `/schema-structured-data`).

This is a `docs/business-facts.md` §B blocker, not a code task. Escalate it rather than working around
it. Once supplied, the URLs go in `lib/site.ts` `social` and flow to both surfaces from there.

## 3. The missing Tier-2 layer

`site.serviceAreas` names twelve cities:

> תל אביב-יפו · רמת גן · גבעתיים · הרצליה · פתח תקווה · ראשון לציון · חולון · בת ים · רעננה ·
> כפר סבא · ראש העין · מודיעין

They render as **plain text chips with no route behind them**, and they are enumerated as `City` nodes
in `areaServed`. So every `איתור נזילות ב{city}` query — the entire Tier-2 layer, and the way most
local demand is actually typed — is unexpressed.

This is simultaneously the largest local opportunity and the largest local risk on the site.

## 4. The doorway policy — non-negotiable

> Replace the city name with another city name. Is the page now correct and publishable for that other
> city? If yes, it is a doorway page.

This site has an advantage the rest of the fleet doesn't: **it has not yet built a thin location silo.**
Don't create one. To pass, a location page needs **three or more** true, specific items:

- Named neighbourhoods, streets or landmarks.
- Housing-stock reality — 60s שיכונים with old galvanised plumbing, towers with pressurised systems and
  shared risers, ground-floor flats where the leak is in the slab.
- A real job reference from that city (with permission), or a photo.
- Travel and response reality for that distance — is same-day genuinely available there.
- A city-specific FAQ that would read oddly anywhere else.
- Local pricing reality if it differs.

**If none of those can be said truthfully about a city, that city does not warrant a page.** Record that
in business-facts §E rather than padding. Full spec: `docs/content-standards.md` §2–§3.

## 5. Hebrew grammar per location

All twelve are real cities, so `ב{name}` mostly works — with two cautions:

- `תל אביב-יפו` reads badly in a title as `בתל אביב-יפו`. Use `בתל אביב`.
- Any future **region** entry (השרון, השפלה, גוש דן, צפון) needs `בצפון הארץ` / `באזור השרון`, not a
  bare preposition.

So define the shape **before** the first page exists, not after:

```ts
// lib/locations.ts
export interface Location {
  slug: string;                    // ASCII, matching the /services/ convention
  name: string;                    // תל אביב
  kind: "city" | "region";         // drives City vs AdministrativeArea in schema
  prefixed: string;                // בתל אביב
}
```

`kind` drives the schema type; `prefixed` carries the preposition so no template has to guess.

## 6. The expansion cap

4 services × 12 areas = 48 possible cells. **Do not build them.** Order of operations:

1. Build location pages **only** for cities where §4 can be satisfied — likely 3–5, not 12.
2. Each earns its depth per content-standards §3 before the next one starts.
3. Only then consider a service × location second tier, and only for services with genuine local
   demand — `water-leak-detection` and `moisture-detection`, not `insurance-reports` (which is a
   document, not a place).

A cell exists when there is something true and specific to say in it. Not before.

## 7. Coverage honesty

`site.serviceAreaText` claims "גוש דן והמרכז, ברדיוס של עד 60 ק״מ · שירות ארצי בתיאום מראש" while
`areaServed` enumerates twelve cities and the `Service` nodes claim the region. An `areaServed` the
business cannot service produces leads it can't serve and a claim it can't defend. Confirm the national
claim via business-facts §E before it becomes a keyword.

## 8. Internal equity

With no location pages there is nothing to link to yet. Plan the mesh **before** building: each location
page needs inbound links from the footer, from `/services/`, and from at least one service page, plus
2–4 nearby-location links out. See `/internal-linking`.

## Checklist

- [ ] GBP exists as a service-area profile, is linked from the site, and is in `sameAs`.
- [ ] `sameAs` contains real profile URLs, or is empty — never a platform homepage.
- [ ] `geo` is the real operating base, or absent.
- [ ] Every location entry has `kind` and `prefixed`; no template interpolates a bare `ב${name}`.
- [ ] Every location page that ships passes the doorway test.
- [ ] Location pages emit `Service` + `areaServed` with the correct area type.
- [ ] The national coverage claim is confirmed or removed.

## Gotchas

- **Never** a `LocalBusiness` node per city. This business has no premises at all; one node is the
  honest count.
- Never invent a review, rating, neighbourhood or coordinate to fill a local-SEO checkbox.
- Adding twelve city pages in one commit is not a local-SEO strategy; it is a doorway cluster with a
  deploy attached — and here every push to `main` ships straight to production.
