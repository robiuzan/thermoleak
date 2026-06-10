// Customer testimonials.
// ⚠️ PLACEHOLDER — replace with real, verifiable reviews (e.g. pulled from Google Business Profile)
// before launch. Do not publish an aggregate rating that isn't backed by genuine reviews.

export interface Review {
  name: string;
  location: string;
  rating: number; // 1–5
  service: string;
  text: string;
}

export const reviews: Review[] = [
  {
    name: "דנה ל׳",
    location: "תל אביב",
    rating: 5,
    service: "איתור נזילות מים",
    text: "חיפשנו מאיפה מגיעה רטיבות בסלון חודשים. הגיעו תוך יומיים, איתרו את הנזילה תוך פחות משעה ובלי לשבור כלום. שירות מקצועי ואדיב.",
  },
  {
    name: "אבי כ׳",
    location: "רמת גן",
    rating: 5,
    service: "דו״ח תרמוגרפי לביטוח",
    text: "הדו״ח שקיבלנו היה מסודר ומפורט, וחברת הביטוח קיבלה אותו ללא בעיה. חסך לנו המון ויכוחים. ממליץ בחום.",
  },
  {
    name: "מירי ש׳",
    location: "הרצליה",
    rating: 5,
    service: "איתור רטיבות ובידוד",
    text: "מקצועיים ואמינים. הסבירו כל שלב, מצאו את מקור הרטיבות בקיר החיצוני והפנו אותנו בדיוק לאן צריך. סוף סוף פתרנו את הבעיה.",
  },
  {
    name: "יוסי ב׳",
    location: "פתח תקווה",
    rating: 5,
    service: "בדיקת לוחות חשמל",
    text: "עשו לנו בדיקה תרמית ללוח החשמל בעסק וגילו חיבור שהתחמם מסוכן. טיפלנו בזמן בזכותם. שווה כל שקל.",
  },
  {
    name: "רונית ד׳",
    location: "גבעתיים",
    rating: 4,
    service: "איתור נזילות מים",
    text: "שירות יסודי ומקצועי. הגיעו בזמן, עבדו בצורה נקייה והסבירו הכל בסבלנות. ההמלצה לתיקון הייתה מדויקת.",
  },
  {
    name: "עומר נ׳",
    location: "ראשון לציון",
    rating: 5,
    service: "איתור נזילות מים",
    text: "אחרי שאינסטלטור אחד כבר שבר לנו קיר לחינם, הם מצאו את הנזילה האמיתית במצלמה תוך דקות. הלוואי שהייתי מתקשר אליהם קודם.",
  },
];

export const averageRating: number =
  Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10;

export const reviewCount: number = reviews.length;
