/**
 * The fleet live-kit's settings for thermoleak.co.il — the announcement bar, the seasonal card and
 * the homepage updates strip (3locksmiths.co.il/fleet/live-kit, owner decision 2026-10-11). Read by
 * components/live/Live.tsx and by every scripts/live/ gate. The registers themselves are
 * content/live/_campaigns.mjs and content/live/_updates.mjs (CLAUDE.md §14).
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The page a quoted file renders, so a tip must link to the page that shows its sentence (the gate,
 * scripts/live/check-live-register.mjs, compares this with the line's link). Three content files
 * hold several pages each, one entry per `slug: "…"`, so the slug the quoted sentence sits under
 * decides: lib/articles.ts → /guides/<slug>/, lib/services.ts → /services/<slug>/ (its blocks
 * BEFORE the first service — methodExplainer, serviceChooser — render on the homepage),
 * lib/locations.ts → /locations/<slug>/. A sentence found under two different pages is ambiguous:
 * the answer then names no page, so the gate fails until a longer, unique sentence is quoted.
 * lib/site.ts and components/ feed many pages and answer null (unchecked).
 */
const SEGMENTED = {
  "lib/articles.ts": "/guides/",
  "lib/services.ts": "/services/",
  "lib/locations.ts": "/locations/",
};
const WHOLE = {
  "lib/faqs.ts": "/", // generalFaqs render on the homepage only
  "lib/pricing.ts": "/pricing/",
};
/** The first ״…״ quote that follows `file` in a source — the same reading as the gate's. */
function firstQuote(file, source) {
  const s = String(source ?? "");
  const at = s.indexOf(file);
  if (at < 0) return null;
  const m = /״(.+?)״(?=\s*(?:$|[·—([]|״))/.exec(s.slice(at + file.length));
  if (!m) return null;
  return (
    m[1]
      .split("…")
      .map((x) => x.trim())
      .filter(Boolean)[0] ?? null
  );
}
function pageOfSource(file, source) {
  if (file in WHOLE) return WHOLE[file];
  const app = /^app\/((?:[a-z0-9-]+\/)*)page\.tsx$/.exec(file);
  if (app) return `/${app[1]}`;
  const prefix = SEGMENTED[file];
  if (!prefix) return null;
  const quote = firstQuote(file, source);
  if (!quote) return null;
  // The gates run through npm scripts, i.e. from the repo root (the same assumption Live.tsx makes).
  // Only the gate calls this (plain Node); the ignore comment keeps Next's file tracing from
  // following a dynamic path and tracing the whole project (Turbopack's own suggested fix).
  const path = join(/* turbopackIgnore: true */ process.cwd(), file);
  if (!existsSync(path))
    return `(cannot read ${file} from ${process.cwd()} — run the gate from the repo root)`;
  const text = readFileSync(path, "utf8");
  const slugs = [...text.matchAll(/^\s*slug: "([a-z0-9-]+)",\s*$/gm)];
  const pages = new Set();
  for (let at = text.indexOf(quote); at >= 0; at = text.indexOf(quote, at + 1)) {
    let page = "/";
    for (const s of slugs) if (s.index < at) page = `${prefix}${s[1]}/`;
    pages.add(page);
  }
  if (!pages.size) return null; // the gate reports a quote that is not in the file
  return pages.size === 1
    ? [...pages][0]
    : `(ambiguous — the quote sits under ${[...pages].join(" and ")}; quote a longer sentence)`;
}

const config = {
  site: "thermoleak.co.il",
  url: "https://thermoleak.co.il",
  dir: "content/live",

  /**
   * NAP for the bar and the card. This site has no site.config.json (the roster does not feed the
   * build — CLAUDE.md §5), so the kit's gates read it here. It RESTATES lib/site.ts (site.phone,
   * site.whatsapp), which stays the one source: components/live/Live.tsx refuses to build if the
   * two disagree, so a number change there can never leave the bar on the old one.
   */
  contact: {
    phoneDisplay: "055-660-1006",
    phoneE164: "+972556601006",
    whatsappE164: "+972556601006",
  },

  /**
   * Calm pages: no seasonal line, no card (a safety or wartime line still shows). Exact paths, or
   * prefixes ending in "*". The post-form conversion page (noindex) and the two legal pages. No page
   * here tells the reader to call 100/101/102, and there are no emergency pages. The 404 page marks
   * itself (app/not-found.tsx renders `[data-live-calm-page]`): no path can name it in advance.
   */
  calm: ["/thank-you/", "/privacy/", "/accessibility/"],
  /**
   * No card here, but the bar is normal: the contact page, whose form the card would compete with.
   * (The same form sits in ContactCTA at the foot of most pages; live.js never opens the card while
   * a form field has focus.)
   */
  noDialog: ["/contact/"],

  /** The homepage strip sits in the site's own container width (components/Container.tsx). */
  updatesContainerClass: "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8",

  /**
   * This site's own ⛔ patterns, on top of the fleet's (lib/live/claims.mjs). Every 🔶 and ❌ row of
   * docs/business-facts.md, and every confirmed fact that is still not bar copy under the fleet's
   * rule (no hours, emergency, speed, warranty, price, coverage, credentials, counts or reviews on a
   * live surface), written as STEMS so a rewording cannot slip past. Applied by
   * scripts/live/check-live-register.mjs to every visible register string. Three traps shape them:
   *   - no `\b` (ASCII-only in JavaScript): a short stem that also sits inside an innocent word gets
   *     an explicit edge — "מחר" is inside "מתומחר", "ביט" inside "ביטוח", "זמין" inside "להזמין";
   *   - final letters: "תשלום" does not match "תשלומים" — `[םמ]`, `[נן]`, `[כך]`;
   *   - advice is not a claim: the guides say "מומלץ אחת לשנה", "הנפוצה ביותר", "מיד אחרי אירוע",
   *     "דירוג חומרה" (of a finding) — those stems need their claim context.
   * Mutation-tested 2026-10-12 against the draft, the site's own advice and a list of near-misses.
   */
  claims: [
    // §A/§D: "20+ שנות ניסיון בשטח" is the founder's field experience (✅) and "20 years in
    // business" is false; founded 2015, in the trade since ~2005. No tenure of any length.
    {
      id: "tenure",
      re: /2015|2005|משנת\s*\d|מאז\s*(?:שנת\s*)?\d|\d+\s*\+?\s*שנ(?:ה|ים|ות)|(?:^|[\s,.!?:;()–—-])ו?(?:עשר|עשרים|שלושים|ארבעים|חמש|שש|שבע|שמונה|תשע|אחת עשרה|שתים עשרה)(?:ה|ת)?\s+(?:ו?\S+\s+)?שנ(?:ה|ים|ות)(?=$|[\s,.!?:;()–—-])|שנות (?:ניסיון|ותק|פעילות|עבודה)|שנים של ניסיון|ניסיון (?:רב|של|עשיר|מוכח|מצטבר)|עשור|(?:אנחנו|אנו|צוות|עסק|חברה|טכנאי\S*|מומח\S*|מאתר\S*)\s+(?:\S+\s+)?ו?ותיק|ו?ותיק(?:ים|ה)?\s+ב(?:תחום|ענף|מקצוע|שטח)|(?:^|[\s,.!?:;()–—-])[והבלמש]{0,2}ותק(?=$|[\s,.!?:;()–—-])|בשטח מאז/,
    },
    // §D: the removed "3,000+ בתים ועסקים" and "97% איתור כבר בביקור הראשון" — no job, customer or
    // success count or rate, in digits or in words.
    {
      id: "counts-or-rates",
      re: /\d[\d,]*\s*\+|\+\s*\d|\d[\d,.]*\s*%|אחוז|1,?000|אלף|אלפי|רבבות|(?:^|[\s,.!?:;()–—-])[והבלמשכ]{0,2}(?:מאות|עשרות)\s+(?!ק״מ|מטר|ס״מ|מ״מ|מעלות|שקל|ש״ח)\S|\d[\d,.]*\s*(?:בתים|לקוחות|בדיקות|איתורים|נכסים|דירות|עבודות|פרויקטים|ממצאים|עסקים|מבנים|משפחות|נזילות|ביקורים|דו״חות)|בביקור הראשון|הצלחה|הצלחות/,
    },
    // §B: no reviews, no rating, no Business Profile (none exists yet), no social profile — the six
    // testimonials and the 4.9 rating were fabrications, removed 2026-08-17. A finding's "דירוג
    // חומרה" and a report's "המלצות לטיפול" (the service pages) are not praise of the business.
    {
      id: "social-proof",
      re: /המלצות\s+(?:של\s+|מ)?(?:ה)?לקוחות|המלצות חמות|המלצה חמה|המלצת לקוח|ממליצ(?:ים|ות|ה)?\s+(?:עלינו|עליו|עליה|עליהם|בחום)|(?:כולם|לקוחות|הלקוחות|לקוחותינו)\s+(?:\S+\s+)?(?:ממליצ|מרוצ|חוזר|אוהב)|(?:^|[\s,.!?:;()–—-])[וה]?מרוצ(?:ים|ה|ות)(?=$|[\s,.!?:;()–—-])|שביעות רצון|ביקורות|ביקורת (?:חיובית|מעולה|מצוינת)|דירוג(?!\s*(?:ה)?חומר)|כוכבים|★|מוניטין|שם טוב|(?:מספרים|אומרים) עלינו|גוגל|google|פרופיל עסקי|פייסבוק|facebook|אינסטגרם|instagram|טיקטוק|tiktok|יוטיוב|youtube/i,
    },
    // §D: "שירות חירום … זמינים גם מעבר לשעות הפעילות" (site.emergencyNote) is 🔶, and so is any
    // same-day reach (§E). No emergency, no speed, no arrival or turnaround time — the confirmed
    // 3-business-day report turnaround and the "כשעה" visit included: a time is a promise here.
    {
      id: "emergency-or-speed",
      re: /חירום|דחו(?:ף|פה|פים|פות)|דחיפ|מיידי|מייד(?=$|[\s,.!?:;()–—-])|מהיר|במהירות|(?:^|[\s,.!?:;()–—-])[ובלכש]?מהר(?=$|[\s,.!?:;()–—-])|זריז|אקספרס|עוד היום|באותו (?:ה)?(?:יום|בוקר|ערב|שבוע)|בו ביום|למחרת|(?:^|[\s,.!?:;()–—-])[וה]?מחר(?=$|[\s,.!?:;()–—-])|תוך\s*(?:\d+\s*)?(?:דקות|שעות|שעתיים|שעה|יום|יומיים|ימים|שבוע|שבועיים|ימי עסקים)|ימי עסקים|כ-?שע(?:ה|תיים)|משך (?:ה)?בדיקה|זמן (?:תגובה|הגעה|מענה|המתנה)|(?:ללא|בלי)\s+(?:המתנה|תור|תורים|עיכוב)|(?:מגיע|נגיע|להגיע|הגעה|יוצא|נצא|עונ|נענה|חוזר|נחזור)\S*\s+(?:\S+\s+)?(?:מהר|מיד|מייד|תוך|היום)(?=$|[\s,.!?:;()–—-])/,
    },
    // The hours (ראשון–חמישי 08:00–18:00 · שישי 08:00–13:00 — closed on Shabbat) are never bar copy:
    // no hours, days or availability, and nothing that implies Shabbat or night work. "זמין" is a
    // whole word ("להזמין" / "שמזמינים" stay allowed).
    {
      id: "hours-or-availability",
      re: /\d{1,2}:\d{2}|24\s*[/\-–×x]\s*7|24 שעות|עשרים וארבע|מסביב לשעון|סביב השעון|כל (?:שעות )?היממה|שעות (?:ה)?(?:פעילות|פתיחה|עבודה)|מעבר לשעות|מחוץ לשעות|אחרי שעות|[א-ו]׳\s*[–-]\s*[א-ו]׳|ראשון\s*[–-]\s*חמישי|ימים בשבוע|כל (?:ימות|ימי) השבוע|פתוחים|(?:^|[\s,.!?:;()–—-])[והש]?פתוח(?=$|[\s,.!?:;()–—-])|(?:^|[\s,.!?:;()–—-])[ובלש]?זמי[נן](?:ים|ה|ות)?(?=$|[\s,.!?:;()–—-])|זמינות|כבר עכשיו|בשבת|מוצ״ש|מוצאי (?:שבת|חג)|בחג|בשישי|ביום שישי|בימי שישי|בערב(?=$|[\s,.!?:;()–—-])|בערבים|לילה|לילות|בסופ״ש|בסופי שבוע|בסוף השבוע/,
    },
    // §C: ₪350 is confirmed, but no price, fee or payment term reaches a promo surface; the accepted
    // payment methods are still 🔶; and the guarantee's slogan ("לא מצאנו — לא שילמתם", "אין דמי
    // ביקור") is a term with exclusions that live on /pricing/, never a one-line promise.
    {
      id: "price-or-terms",
      re: /₪|ש״ח|שקל|החל\s+מ-?\s*(?:₪|\d)|דמי (?:ביקור|הגעה|נסיעה)|(?:ללא|בלי|אין)\s+(?:דמי|חיוב|תשלום|עלות|התחייבות)|לא (?:תחויבו|תשלמו|שילמתם|מצאנו)|תחויב|חיוב|תשלו[םמ]|לשלם|משלמ|אשראי|(?:^|[\s,.!?:;()–—-])[וב]{0,2}ביט(?=$|[\s,.!?:;()–—-])|העברה בנקאית|מזומן|חשבונית|מע״מ|(?:^|[\s,.!?:;()–—-])[וכבל]{0,2}מע[״׳"']?מ(?=$|[\s,.!?:;()–—-])|תמחור|מתומחר|תעריף|הצע(?:ת|ות) מחיר|מחיר|עלות|זול|משתלם|חיסכון|חוסכ|לחסוך/,
    },
    // Warranty and guarantee wording, in any form — the bounded terms are on /pricing/ only.
    {
      id: "guarantee-wording",
      re: /מובטח|מבטיחים|נבטיח|התחייבות|מתחייבים|נתחייב|כסף בחזרה|החזר כספי|(?:^|[\s,.!?:;()–—-])[וה]?אחריות(?=$|[\s,.!?:;()–—-])|ודאות|100\s*%/,
    },
    // §E: coverage is ✅ (גוש דן והמרכז, national by prior arrangement, ~2 hours' drive), but no
    // surface states coverage, reach, distance or a city: which cities have real job history is 🔶,
    // and every claim on the three city pages still awaits the owner.
    {
      id: "coverage",
      re: /ארצי|בכל (?:רחבי )?(?:הארץ|ישראל)|כל הארץ|בכל (?:אזור|עיר|שכונה|מקום)|לכל (?:מקום|אזור|עיר)|פריסה|גוש דן|אזור המרכז|במרכז הארץ|והמרכז|בתיאום מראש|ק״מ|קילומטר|שעתיים נסיעה|נסיעה מ|אזורי שירות|אזור השירות|(?:^|[\s,.!?:;()–—-])[ובלמ]?(?:תל אביב|יפו|חולון|בת ים|רמת גן|גבעתיים|הרצליה|פתח תקווה|ראשון לציון|רעננה|כפר סבא|ראש העין|מודיעין|ירושלים|חיפה|באר שבע|אשדוד|נתניה|השרון|השפלה|הצפון|הדרום|בצפון|בדרום)(?=$|[\s,.!?:;()–—-])/,
    },
    // §A/§B: a certificate, ח.פ. / בע״מ and a trade association are confirmed ABSENT (❌) — never
    // refill them. The FLIR E8, the third-party insurance and the team of two are ✅ facts, but
    // equipment and credentials are not bar copy, and neither is "the report insurers accept".
    {
      id: "credentials-or-entity",
      re: /הסמכ|מוסמ[כך]|תעוד(?:ה|ת|ות)|דיפלומ|level|thermograph|בע״מ|בע"מ|ח״פ|ח\.פ|עוסק מורשה|חברה רשומה|איגוד|לשכת|חברים ב|FLIR|פליר|E8|(?:^|[\s,.!?:;()–—-])ו?ציוד (?:מקצועי|מתקדם|חדיש)|מצלמה (?:מקצועית|מתקדמת|חדישה)|טכנולוגיה (?:מתקדמת|חדישה)|צוות של|שני טכנאים|שני אנשי|טכנאי(?:ם|ים)? (?:מוסמכ|מקצועי|מנוס)|מומח(?:ה|ים|ית|יות)|מקצוע[נן]|מנוס(?:ה|ים)|ביטוח|מבוטח|קביל/i,
    },
    // §E/§F: service at the customer's home, no public premises, no operating base on record (🔶):
    // no address, office or branch.
    {
      id: "premises",
      re: /סני[פף]|משרד(?:נו|ים)?(?=$|[\s,.!?:;()–—-])|המשרד(?:ים)? שלנו|כתובת(?:נו)?(?=$|[\s,.!?:;()–—-])|רח(?:וב|׳)\s+\S+\s+\d|מיקוד/,
    },
    // §A: permission to publish a photo is 🔶 — no line may point at photos of the work or the team
    // (a finding's thermal image is the method, not a photo of the business, and stays allowed).
    {
      id: "work-photos",
      re: /גלריי?ת|(?:תמונות|צילומים|צילומי)\s+(?:מ|של\s+)?(?:ה)?(?:עבודות|עבודה|פרויקטים|צוות|לקוחות|שטח|ביצוע)|לפני ו?אחרי|(?:עבודות|פרויקטים) שביצענו/,
    },
    // Not a claim, a sensitivity rule: shelter and war wording stays out of every seasonal surface.
    // The wartime line is the top-level `reduced` entry, worded by the owner.
    {
      id: "shelter-wording",
      re: /ממ״ד|ממ"ד|ממ׳׳ד|ממ״ק|ממ״מ|מיגון|מקלט|מוגן|חדר ביטחון|אזעק|טילים|רקטות|יירוט/,
    },
    // No rank and no "best", in the trade's own words.
    {
      id: "rank-or-best",
      re: /מספר\s*1(?!\d)|מס[׳']\s*1(?!\d)|מספר אחת|מקום ראשון|הכי (?:טוב|טובים|מומלץ|זול|מקצועי|מקצועיים|מנוסה|מנוסים|אמין|אמינים|מהיר|מדויק|מדויקים)|(?:הטוב|המדויק|המקצועי|האמין|המנוסה|המהיר|הזול)(?:ים|ה)?\s+ביותר|הטוב(?:ים|ה)?\s+ב(?:גוש|אזור|תחום|ארץ|מרכז|עיר)|המוביל(?:ים|ה)?(?=$|[\s,.!?:;()–—-])|(?:^|[\s,.!?:;()–—-])ו?מובילים(?=$|[\s,.!?:;()–—-])|מוביל(?:ים|ה)?\s+ב(?:תחום|ארץ|אזור|גוש|מרכז|ישראל|שוק)|ללא תחרות|אין כמונו|היחידים|הראשונים ב/,
    },
    // ---- Review of 2026-10-12: rewordings of the same rows that slipped every stem above. -------
    // Each rule below closes a family of near-misses the review fed through findClaim (a prefixed
    // number word, a number in words, a final letter, a synonym, an abbreviation). Same ids'
    // meaning as above; mutation-tested against the draft and the site's own sentences. These
    // stems apply to visible register copy only: since the kit fix of 2026-10-12 the calendar's
    // labels answer to the fleet rules alone, so a bare war stem is safe here.
    {
      // "למעלה מעשרים שנה", "יותר מעשר שנים", "בעשרים השנים האחרונות", "מהוותיקים", "הוותיקים באיתור"
      id: "tenure",
      re: /(?:^|[\s,.!?:;()–—-])[ובלמה]{1,2}(?:עשר|עשרים|שלושים|ארבעים|חמש|שש|שבע|שמונה|תשע|אחת עשרה|שתים עשרה)(?:ה|ת)?\s+(?:ו?\S+\s+)?[וה]?שנ(?:ה|ים|ות)(?=$|[\s,.!?:;()–—-])|(?:^|[\s,.!?:;()–—-])ו?(?:עשר|עשרים|שלושים|ארבעים|חמש|שש|שבע|שמונה|תשע)(?:ה|ת)?\s+(?:ו?\S+\s+)?ה?שנים(?=$|[\s,.!?:;()–—-])|מהו?ותיק|ה?ו?ותיק(?:ים|ות|ה)?\s+ב(?:איתור|תרמוגרפ|ענף)|(?:אנחנו|אנו)\s+(?:\S+\s+)?הו?ותיק/,
    },
    {
      // the removed 97% first-visit rate and 3,000+ jobs, reworded: "בביקור אחד", "תמיד מוצאים",
      // "מעל 3000", "3000 בעלי בתים" — an honest limit ("לא תמיד מוצאים") stays allowed
      id: "counts-or-rates",
      re: /בביקור (?:אחד|יחיד)|(?<!לא\s)(?:כמעט\s+)?תמיד\s+(?:מאתר|מוצא|נמצא|מגלה|מצליח|מאותר)|(?<!לא\s)(?:מאתר|מוצא|מגלה|מצליח|מאותר)\S*\s+(?:\S+\s+)?(?:תמיד|בכל פעם|בכל ביקור)|(?:רוב|מרבית)\s+(?:ה)?(?:נזילות|מקרים|בדיקות|איתורים)\s+(?:\S+\s+)?(?:מאותר|נפתר|מסתיי|נמצא)|(?:מעל|למעלה מ|יותר מ)[-־]?\s*\d[\d,]{2,}|\d[\d,]*\s*בעלי\s+(?:בתים|עסקים|דירות|נכסים)/,
    },
    {
      // past tense and synonyms: "המליצו עלינו", "הומלצנו", "מומלצים על ידי", "חוות הדעת של הלקוחות"
      id: "social-proof",
      re: /המליצו|הומלצ|מומלצ(?:ים|ות)\s+(?:על ידי|ע״י|בקרב|אצל|בחום)|חוות (?:ה)?דעת (?:של |מ)?(?:ה)?לקוח|חוות (?:ה)?דעת (?:חיוביות|מעולות|טובות|מצוינות|מצויינות)|(?:אומרים|מספרים|כותבים)\s+(?:ה)?לקוחות|לקוחות(?:ינו)?\s+ש(?:חוזר|ממליצ|מרוצ)|דירגו (?:אותנו|אותי)/,
    },
    {
      // the 3-business-day turnaround and the hour-long visit in words; "זמני" (the final-letter
      // trap of "זמן"); waiting; a call to act now (docs/eeat-and-trust.md §7)
      id: "emergency-or-speed",
      re: /תוך\s*(?:שני|שתי|שלושה|שלוש|ארבעה|ארבע|חמישה|חמש|שישה|שבעה|עשרה)\s+(?:דקות|שעות|ימים|ימי|שבועות)|יממה|יממות|(?:אורכ|נמשכ|לוקח)\S*\s+(?:\S+\s+)?(?:כ-?)?(?:שעה|שעתיים|דקות|\d+\s*(?:דקות|שעות))|(?:מוכן|נמסר|יימסר|נשלח|יישלח|אצלכם|בידיכם)\S*\s+(?:\S+\s+)?(?:אחרי|לאחר|בתוך|עד)\s+(?:\d+|שני|שתי|שלושה|שלוש|ארבעה|חמישה|כמה|מספר)\s+(?:ימים|ימי|שעות)|זמני (?:תגובה|הגעה|מענה|המתנה)|(?:ללא|בלי)\s+לחכות|לא (?:תחכו|תצטרכו לחכות)|(?:מגיע|נגיע|להגיע|הגעה|יוצא|נצא|עונ|נענה|חוזר|נחזור)\S*\s+(?:\S+\s+)?(?:בהקדם|השבוע|עכשיו)|(?:התקשרו|חייגו|כתבו|שלחו|הזמינו|פנו)\s+(?:\S+\s+)?(?:עכשיו|כעת|מיד|מייד|היום)(?=$|[\s,.!?:;()–—-])/,
    },
    {
      // the days in words or without the dash: "ראשון עד חמישי", "א׳ עד ה׳", "א-ה", "שישי עד 13"
      id: "hours-or-availability",
      re: /ראשון\s*(?:עד|ל|ו)\s*(?:חמישי|שישי)|[א-ו][׳']\s*(?:עד|ל)\s*[א-ו][׳']|(?:^|[\s,.!?:;()–—-])[א-ו]\s*[-–]\s*[א-ו](?=$|[\s,.!?:;()–—-])|(?:^|[\s,.!?:;()–—-])[ובה]?שישי(?=$|[\s,.!?:;()–—-])|בכל שעה|בכל עת|שעות (?:ה)?(?:ערב|לילה)/,
    },
    {
      // the price without a currency (₪350, and the old unverified ₪450), the Hebrew maqaf, and
      // the guarantee's slogan reworded: "הביקור עלינו", "על חשבוננו", "לא יעלה לכם", "אגורה"
      id: "price-or-terms",
      re: /(?<!\d)(?:350|450)(?!\d)|החל\s+מ־\s*(?:₪|\d)|(?:^|[\s,.!?:;()–—-])(?:ב|מ)[-־]\s*\d{3,}|(?:^|[\s,.!?:;()–—-])רק\s*\d{3,}|\d{3,}\s*(?:בלבד|לביקור|לבדיקה)|על חשבוננו|(?:הביקור|הבדיקה|האיתור)\s+(?:\S+\s+)?עלינו|לא (?:יעלה|תעלה|עולה|יעלו)\s+לכם|אגורה/,
    },
    {
      // §C: the accepted payment methods are 🔶 — none may be named
      id: "payment-methods",
      re: /פייבוקס|pay\s?box|(?:^|[^a-z])bit(?![a-z])|apple\s?pay|google\s?pay|אפל\s?פיי|(?:^|[\s,.!?:;()–—-])[וב]?צ[׳']ק(?:ים)?(?=$|[\s,.!?:;()–—-])|כרטיס(?:י)?\s+(?:אשראי|חיוב)|(?:^|[\s,.!?:;()–—-])[וב]?ויזה(?=$|[\s,.!?:;()–—-])|ישראכרט|מאסטרקארד|דיינרס/i,
    },
    {
      id: "guarantee-wording",
      re: /(?:ללא|בלי|אפס)\s+סיכון|(?:מחזירים|נחזיר|יוחזר)\s+(?:לכם\s+)?(?:את\s+)?(?:ה)?כסף/,
    },
    {
      // reach in other words, and the cities by abbreviation or beyond the twelve
      id: "coverage",
      re: /ברחבי (?:הארץ|ישראל|המרכז|גוש|השרון|השפלה|הצפון|הדרום)|(?:לכל|מכל|בכל) רחבי|מדן ו?עד אילת|מצפון ו?עד דרום|(?:^|[\s,.!?:;()–—-])[ובלמ]?(?:ת״א|ר״ג|פ״ת|ראשל״צ|ב״ש|י-ם|בני ברק|אור יהודה|יהוד|קריית אונו|קרית אונו|גבעת שמואל|רחובות|נס ציונה|לוד|רמלה|אשקלון|אילת|הוד השרון|רמת השרון|הקריות|חדרה|שוהם|אלעד|גני תקווה)(?=$|[\s,.!?:;()–—-])/,
    },
    {
      // the ❌ "Level 1" certificate in Hebrew, training in place of a certificate, equipment and
      // team adjectives one word apart, "מומחי" (construct state), "עוסק פטור", standards
      id: "credentials-or-entity",
      re: /(?:רמה|דרגה|level)\s*(?:\d|[אב][׳']|ראשונה|שנייה|שניה)|(?:בעל|בעלת|בעלי|עם|עבר|עברו|בוגר|בוגרי|בוגרת)\s+(?:\S+\s+)?(?:הכשר|קורס|השתלמ)|קורס\s+(?:\S+\s+)?(?:תרמוגרפ|מקצועי)|הכשרה\s+(?:מקצועית|ב?תרמוגרפ)|תרמוגרפ(?:ר|רים|יסט|יסטים|יסטית)(?=$|[\s,.!?:;()–—-])|מצלמ(?:ה|ות|ת)\s+(?:\S+\s+)?(?:מקצועי|מתקדמ|חדיש|איכותי|משוכלל|ייעודי)|(?:מכשור|מכשיר(?:ים)?|ציוד)\s+(?:\S+\s+)?(?:מקצועי|מתקדם|מתקדמים|חדיש|משוכלל|איכותי)|(?:^|[\s,.!?:;()–—-])[והבלמש]?מומחי(?=$|[\s,.!?:;()–—-])|צוות\s+(?:\S+\s+)?(?:מקצועי|מיומן|מנוסה|מומחה|מוסמך)|עוסק פטור|(?:^|[^a-z])iso(?![a-z])|תקן (?:ישראלי|בינלאומי|אירופי)|(?:לפי|על פי|בהתאם ל)(?:ה)?תקן/i,
    },
    {
      id: "premises",
      re: /בואו (?:אלינו|לבקר)|בקרו (?:אותנו|אצלנו)|אולם תצוגה|(?:^|[\s,.!?:;()–—-])[ובל]?חנות(?:נו)?(?=$|[\s,.!?:;()–—-])/,
    },
    {
      id: "work-photos",
      re: /(?:ה)?עבודות שלנו|(?:ה)?פרויקטים שלנו|תיק עבודות|פורטפוליו|portfolio/i,
    },
    {
      // "ממד" without its gershayim, and war wording — a bare "מלחמ" stem (מלחמה, מלחמת, למלחמת,
      // במלחמות …): the calendar's memorial-day name no longer passes through these stems.
      id: "shelter-wording",
      re: /(?:^|[\s,.!?:;()–—-])[ובלה]{0,2}ממ[״"׳']?ד(?=$|[\s,.!?:;()–—-])|מלחמ|חרבות ברזל|כיפת ברזל|(?:^|[\s,.!?:;()–—-])[ובלה]{0,2}טיל(?=$|[\s,.!?:;()–—-])|רסיס|שיגור|פגיע(?:ה|ת)\s+(?:טיל|רקט|ישירה)|נפיל(?:ה|ות|ת)\s+(?:\S+\s+)?(?:טיל|רקט|רסיס)|הסלמה|לחימה|מילואים/,
    },
    {
      id: "rank-or-best",
      re: /#\s*1(?!\d)|מקום\s*1(?!\d)|הכי (?:מתקדם|מתקדמים|משוכלל|ותיק|ותיקים|מוכר|מוכרים)|(?:^|[\s,.!?:;()–—-])ו?יחידים(?=$|[\s,.!?:;()–—-])|אין עלינו|(?:^|[\s,.!?:;()–—-])[וה]?מובחר(?:ים|ת|ות)?(?=$|[\s,.!?:;()–—-])/,
    },
  ],
  pageOfSource,
  allowClaims: [],
};

export default config;
