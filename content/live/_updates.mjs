/**
 * thermoleak.co.il — the homepage updates strip (fleet live-kit, CLAUDE.md §14). The newest three
 * show after the method explainer; the calm script (before first paint) and /assets/live.js hide
 * the strip once the newest item is 45 days old, so a quiet month shows nothing rather than old
 * news. A new item is a real content change.
 *
 * Each item: { date: "YYYY-MM-DD" (the day it went live, never in the future), text (≤ 140, no
 * typed phone number, no price, no promise), href (a page of this site), linkLabel (≤ 18),
 * source (the fact it rests on) }. One item per date. scripts/live/check-live-register.mjs
 * enforces it. Never a customer, street, review, count, price or response time.
 *
 * Adding an item does NOT change the homepage's lastModified in app/sitemap.ts — the strip is not
 * the page's content.
 *
 * ✅ APPROVED by the owner on 2026-10-12, on the fleet wording sign-off page — approved fingerprint
 *   86e30fc91128 (sha256 of _campaigns.mjs + _updates.mjs as approved). A wording change needs a
 *   new approval; the build refuses a register without its `approved` stamp.
 * ⚠ The newest item is 17/09/2026: from 01/11/2026 the strip hides itself until a newer real item
 *   is added (it ships visible only if the site is deployed before then).
 */
const updates = {
  approved:
    "2026-10-12 — Robi (owner), fleet wording sign-off page, fingerprint 86e30fc91128 (with the neutral line the owner chose there: ״נזק מים בבית? חשוב לתעד לפני שמתקנים״)",
  heading: "עדכוני האתר",
  items: [
    {
      date: "2026-09-17",
      text: "פרסמנו פירוט של מה כולל ביקור איתור ומה לא נכלל בו.",
      href: "/pricing/",
      linkLabel: "לפירוט המלא",
      source:
        "lib/site.ts visitScope — approved verbatim by the owner 2026-09-17 (docs/business-facts.md §C), rendered on /pricing/ since commit 3c5d98a, deployed 2026-09-17 20:18 Israel time (ops logs/deploys.csv 2026-09-17T17:18:41Z)",
    },
    {
      date: "2026-08-30",
      text: "הוספנו לאתר מדריכים: מה מצלמה תרמית באמת רואה, איך מאתרים נזילה בקיר בלי לשבור, וכמה עולה איתור נזילות.",
      href: "/guides/",
      linkLabel: "למדור המדריכים",
      source:
        "lib/articles.ts — the three guides (datePublished 2026-08-24), live since the 2026-08-30 deploy (commit 047180c; ops logs/deploys.csv 2026-08-30T07:34:25Z)",
    },
  ],
};

export default updates;
