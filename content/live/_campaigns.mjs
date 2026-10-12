/**
 * thermoleak.co.il — the announcement bar's lines and when each one shows, plus the one seasonal
 * card. Fleet live-kit register (3locksmiths.co.il/fleet/live-kit; the pilot's
 * content/enriched/_campaigns.mjs explains every field). Checked by
 * scripts/live/check-live-register.mjs before every build (CLAUDE.md §14).
 *
 * ✅ APPROVED by the owner on 2026-10-12, on the fleet wording sign-off page — approved fingerprint
 *   86e30fc91128 (sha256 of _campaigns.mjs + _updates.mjs as approved). A wording change needs a
 *   new approval; the build refuses a register without its `approved` stamp.
 *
 * THE RULES (fleet-wide, and this site's)
 *   - A tip must be something this site already says: `source` quotes the sentence, in the file
 *     that holds it, and the gate checks the sentence is still there — and, for lib/articles.ts and
 *     lib/services.ts, that the line links to the page that shows it (live.config.mjs
 *     pageOfSource). The SEASON is the only thing added: when a tip shows, never what it says.
 *   - No offers, prices, fees, the guarantee's slogan, hours, availability, emergency, speed,
 *     turnaround, coverage, cities, credentials, equipment, counts or reviews (live.config.mjs
 *     claims + the fleet list). Nothing here is 🔶 in docs/business-facts.md. The business is closed
 *     on Shabbat and its out-of-hours service is unconfirmed — no line implies either.
 *   - No urgency or scarcity (docs/eeat-and-trust.md §7) and no shelter wording; the wartime line
 *     is `reduced`, below.
 *   - One row: a seasonal line ≤ 46 characters as read (with its link label); evergreen ≤ 70.
 *   - Never type a phone number: {phone}, {whatsapp:<word>}.
 *   - Quiet days silence every line; Shabbat and chag silence the seasonal ones (the fleet
 *     calendar, content/live/_calendar.json — synced from the pilot, never edited here).
 *   - from/until carry Israel's offset for that date: +03:00 until 25/10/2026, +02:00 from then
 *     until 26/03/2027, +03:00 again until 31/10/2027, +02:00 after.
 */
const campaigns = {
  approved:
    "2026-10-12 — Robi (owner), fleet wording sign-off page, fingerprint 86e30fc91128 (with the neutral line the owner chose there: ״נזק מים בבית? חשוב לתעד לפני שמתקנים״)",
  ui: { close: "סגירה" },

  // From 768px (app/globals.css) whenever nothing seasonal shows, and the JavaScript-off state.
  // The site's own honest first step — "not sure it is a leak? ask first" — on the second channel
  // the header does not already carry.
  evergreen: {
    topbar: {
      text: "לא בטוחים שזו נזילה? תארו לנו את הבעיה ב{whatsapp:וואטסאפ}",
    },
    source:
      "lib/services.ts — ״לא בטוחים שזו בכלל נזילה״ · ״עדיף לברר בטלפון לפני שמזמינים בדיקה — אם מה שאתם מתארים לא דורש סריקה, נגיד לכם את זה.״ · lib/pricing.ts — ״מתארים לנו בטלפון או בוואטסאפ את הבעיה ואת גודל הנכס״",
  },

  // The fleet's pre-written wartime line (wording confirmed for 3locksmiths 2026-10-04), shown
  // only while the status switch says `reduced`, on every page. Confirmed for THIS business by
  // the owner on 2026-10-12 (fleet wording sign-off page): טרמוליק keeps working under Home
  // Front Command restrictions.
  reduced: {
    topbar: { text: "פועלים בכפוף להנחיות פיקוד העורף" },
    source:
      "3locksmiths.co.il docs/business-facts.md §D.12 (wording confirmed by the owner 2026-10-04) · fleet rollout decision 2026-10-11 · confirmed for thermoleak.co.il by the owner 2026-10-12 (fleet wording sign-off page)",
  },

  windows: [
    // The first rains: a stain shows up, and the visitor cannot tell condensation from a leak. The
    // moisture page's own answer — and the season's one card.
    {
      id: "first-rains-2026",
      variant: "first-rains",
      kind: "seasonal",
      from: "2026-10-18T08:00:00+03:00",
      until: "2026-12-15T00:00:00+02:00",
      priority: 30,
      topbar: {
        text: "עיבוי או נזילה? לעיתים מודדים אחרי גשם",
        link: { label: "פרטים", href: "/services/moisture-detection/" },
      },
      dialog: {
        title: "הופיעה רטיבות אחרי הגשם?",
        body: "הבחנה בין עיבוי לנזילה דורשת לעיתים שתי מדידות בתנאים שונים — למשל אחרי גשם ולאחר ימי התייבשות. ספרו לנו היכן מופיעה הרטיבות ומתי.",
        call: "חייגו אלינו {phone}",
        whatsapp: "וואטסאפ",
        link: {
          label: "על איתור רטיבות",
          href: "/services/moisture-detection/",
        },
        capDays: 14,
      },
      source:
        "lib/services.ts — ״הבחנה בין עיבוי לנזילה דורשת לעיתים שתי מדידות בתנאים שונים — למשל אחרי גשם ולאחר ימי התייבשות.״ · ״מספרים לנו היכן מופיעה הרטיבות ומתי, ומתאמים מועד נוח לבדיקה.״",
    },

    // The winter storms: water damage, and the reflex to repair it at once. Document first.
    {
      id: "document-first-2026",
      variant: "document-first",
      kind: "seasonal",
      from: "2026-12-15T00:00:00+02:00",
      until: "2027-01-15T00:00:00+02:00",
      priority: 20,
      topbar: {
        text: "נזק מים בבית? חשוב לתעד לפני שמתקנים",
        link: { label: "פרטים", href: "/services/insurance-reports/" },
      },
      source:
        "lib/services.ts — ״חשוב לתעד לפני שמתקנים: תיקון הנזק לפני הבדיקה מוחק את הראיות שהדו״ח אמור לתעד.״",
    },

    // The coldest weeks: water on a window or a cold outside wall — usually condensation, and the
    // cost guide says so before anyone books a visit.
    {
      id: "condensation-2027",
      variant: "condensation",
      kind: "seasonal",
      from: "2027-01-15T00:00:00+02:00",
      until: "2027-03-01T00:00:00+02:00",
      priority: 20,
      topbar: {
        text: "עיבוי על החלון בחורף? לרוב זו לא נזילה",
        link: { label: "למדריך", href: "/guides/leak-detection-cost/" },
      },
      source:
        "lib/articles.ts — ״עיבוי קלאסי — לחות שמופיעה על חלון או על קיר חיצוני קר בחורף, נעלמת באוורור וחוזרת. לרוב זו בעיית אוורור ובידוד ולא נזילה.״",
    },

    // Before Pesach the walls get repainted — and a damp stain painted over comes back.
    {
      id: "before-pesach-2027",
      variant: "before-pesach",
      kind: "seasonal",
      from: "2027-03-01T00:00:00+02:00",
      until: "2027-04-21T12:00:00+03:00",
      priority: 20,
      topbar: {
        text: "צובעים לפני פסח? קודם מטפלים בגורם לכתם",
        link: { label: "פרטים", href: "/services/moisture-detection/" },
      },
      source:
        "lib/services.ts — ״במקום לצבוע שוב על הכתם, מטפלים בגורם עצמו.״ · ״כך תוכלו לטפל בשורש הבעיה במקום לצבוע שוב ושוב על אותו כתם״",
    },

    // The summer: does a thermal camera work in the heat? The guide's own question, and its answer.
    {
      id: "summer-test-2027",
      variant: "summer-test",
      kind: "seasonal",
      from: "2027-05-16T08:00:00+03:00",
      until: "2027-09-01T00:00:00+03:00",
      priority: 20,
      topbar: {
        text: "אפשר לעשות בדיקה תרמית בקיץ?",
        link: { label: "למדריך", href: "/guides/what-a-thermal-camera-sees/" },
      },
      source:
        "lib/articles.ts — ״אפשר לעשות בדיקה תרמית בקיץ?״ · ״כן, אבל התנאים משפיעים. מה שהבדיקה צריכה הוא הפרש טמפרטורה בין האזור הרטוב לסביבתו.״",
    },

    // A new year (5788): the panel check the site recommends once a year for businesses.
    {
      id: "annual-panel-2027",
      variant: "annual-panel",
      kind: "seasonal",
      from: "2027-09-01T00:00:00+03:00",
      until: "2027-10-31T00:00:00+03:00",
      priority: 20,
      topbar: {
        text: "לוח חשמל בעסק? מומלץ לבדוק אחת לשנה",
        link: { label: "פרטים", href: "/services/electrical-thermography/" },
      },
      source:
        "lib/services.ts — ״לעסקים ומפעלים מומלץ אחת לשנה, וגם לאחר שינויים או הוספת עומסים במערכת.״",
    },
  ],
};

export default campaigns;
