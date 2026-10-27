// The homepage gallery's data: which images ship, what their alt text says, and where each one
// came from. components/Gallery.tsx renders it; scripts/optimize-gallery.mjs reads it to build
// public/images/gallery/*.webp, so the files that ship and the words that describe them cannot
// drift apart.
//
// PROVENANCE IS DATA, NOT A COMMENT. Every image below is AI-generated (Google Gemini, 2026-10-22
// and 2026-10-27) from reference portraits of the team (עומר — docs/business-facts.md §A). docs/content-standards.md
// §6 never permits "a photo presented as our work that isn't"; docs/eeat-and-trust.md §5 records the
// owner's scoped exception for this gallery: the likeness approved 2026-10-22, and on 2026-10-26
// every label dropped — no note or tags on the page, no הדמיה in the alt text, no AI marker in the
// files.
// `source` below is now the only record of where each image came from; keep it accurate. Captions
// name an activity, never a symptom or a finding.
//
// Alt text describes only what is visible — never a city, a customer, a camera model or a finding.
// The thermal screens are described by colour and position, since colour is a thermal image's whole
// information channel (docs/performance-guidelines.md §3).

/** Every gallery file is exactly this size (3:5, WebP) — see scripts/optimize-gallery.mjs. */
export const galleryImageSize = { width: 720, height: 1200 } as const;

export type GallerySource =
  | { kind: "ai-generated"; tool: string; created: string }
  // docs/eeat-and-trust.md §5: a real job photo ships only with its date, city and written consent.
  | { kind: "job"; date: string; city: string; consent: string };

export interface GalleryImage {
  /** File name under public/images/gallery/, without ".webp". Pixels change → the slug changes. */
  slug: string;
  alt: string;
  /** The master in assets/gallery/ (gitignored) and, if needed, the region cut from it (px). */
  master: {
    file: string;
    crop?: { left: number; top: number; width: number; height: number };
  };
  source: GallerySource;
}

export interface GalleryScene {
  caption: string;
  /** A slug from lib/services.ts — the service the scene illustrates. */
  service: string;
  /**
   * The scene, then closer shots of the camera in use — an illustration, never a reading. A
   * three-image scene spans the gallery's full width (components/Gallery.tsx).
   */
  images:
    | readonly [GalleryImage, GalleryImage]
    | readonly [GalleryImage, GalleryImage, GalleryImage];
}

/** The section's own words. */
export const gallery = {
  eyebrow: "הבדיקה בשטח",
  title: "כך נראית בדיקה תרמית בבית",
};

const gemini: GallerySource = {
  kind: "ai-generated",
  tool: "Google Gemini",
  created: "2026-10-22",
};

const geminiBatch2: GallerySource = {
  kind: "ai-generated",
  tool: "Google Gemini",
  created: "2026-10-27",
};

export const galleryScenes: GalleryScene[] = [
  {
    caption: "סריקה תרמית סביב כיור המטבח",
    service: "water-leak-detection",
    images: [
      {
        slug: "kitchen-sink-thermal-scan",
        alt: "טכנאי בחולצת טרמוליק מכוון מצלמה תרמית אל בסיס הברז של כיור מטבח כפול, במטבח פתוח עם סלון ברקע.",
        master: { file: "1Gemini_Generated_Image_hqx5nnhqx5nnhqx5.png" },
        source: gemini,
      },
      {
        slug: "kitchen-tap-thermal-scan",
        alt: "טכנאי בחולצת טרמוליק מחזיק מצלמה תרמית ליד ברז של כיור מטבח מנירוסטה; על המסך רקע סגול ופס צהוב וכתום שיורד לאורך מרכזו.",
        master: { file: "Gemini_Generated_Image_lv1gxwlv1gxwlv1g.jpg" },
        source: geminiBatch2,
      },
      {
        slug: "kitchen-sink-thermal-screen",
        alt: "טכנאי מחזיק מצלמה תרמית מעל כיור מטבח כפול; על המסך רקע סגול ופס אנכי צהוב וכתום במרכזו, שקצהו העליון לבן.",
        master: { file: "3Gemini_Generated_Image_hqx5nnhqx5nnhqx5.png" },
        source: gemini,
      },
    ],
  },
  {
    caption: "סריקה תרמית של קיר מתחת לחלון",
    service: "moisture-detection",
    images: [
      {
        slug: "damp-wall-thermal-scan",
        alt: "טכנאי בחולצת טרמוליק נשען על אדן חלון ומכוון מצלמה תרמית אל כתם רטיבות בקיר; על המסך כחול קר למעלה ופס אדום בתחתית.",
        master: { file: "2Gemini_Generated_Image_uyldu1uyldu1uyld.png" },
        source: gemini,
      },
      {
        slug: "damp-wall-thermal-screen",
        alt: "טכנאי מחזיק מצלמה תרמית מול קיר ורדיאטור מתחת לחלון; על המסך כחול למעלה עם פס ירקרק שיורד במרכז, צהוב באמצע ושורת כתמים אדומים בחלק התחתון.",
        // Cut away an orange bag (top left), a vacuum (bottom left) and a sliver of forearm.
        master: {
          file: "3Gemini_Generated_Image_uyldu1uyldu1uyld.png",
          crop: { left: 127, top: 126, width: 781, height: 1302 },
        },
        source: gemini,
      },
    ],
  },
  {
    caption: "סריקה תרמית של רצפת המקלחת",
    service: "water-leak-detection",
    images: [
      {
        slug: "shower-floor-thermal-scan",
        alt: "טכנאי בחולצת טרמוליק ובמשקפי מגן כורע בתא מקלחת עם דלת זכוכית ומכוון מצלמה תרמית אל רצפת המקלחת.",
        master: { file: "Gemini_Generated_Image_99484a99484a9948.jpg" },
        source: geminiBatch2,
      },
      {
        slug: "shower-floor-thermal-screen",
        alt: "טכנאי מחזיק מצלמה תרמית מעל רצפת מקלחת אפורה עם תעלת ניקוז, ליד דופן זכוכית; על המסך רקע סגול וצורה צהובה וכתומה במרכזו.",
        master: { file: "Gemini_Generated_Image_1fnqcj1fnqcj1fnq.jpg" },
        source: geminiBatch2,
      },
    ],
  },
  {
    caption: "סריקה תרמית של התקרה",
    service: "water-leak-detection",
    images: [
      {
        slug: "ceiling-thermal-scan",
        alt: "טכנאי בחולצת טרמוליק כורע על רצפת אריחים בהירה ומרים מצלמה תרמית אל כתם רטיבות חום בתקרה, ליד חלון עם תריס גלילה ונוף של בנייני אבן.",
        master: { file: "Gemini_Generated_Image_46ln7y46ln7y46ln.jpg" },
        source: geminiBatch2,
      },
      {
        slug: "ceiling-thermal-screen",
        alt: "טכנאי מחזיק מצלמה תרמית בחדר לבן ומאחוריו כתם רטיבות בתקרה; על המסך רקע כתום וכתם סגול כהה במרכזו.",
        master: { file: "Gemini_Generated_Image_qaueaxqaueaxqaue.jpg" },
        source: geminiBatch2,
      },
    ],
  },
  {
    caption: "סריקה תרמית של קיר בסלון",
    service: "moisture-detection",
    images: [
      {
        slug: "living-room-wall-thermal-scan",
        alt: "טכנאי בחולצת טרמוליק כורע ברך על רצפת אריחים בהירה ומכוון מצלמה תרמית אל כתמים חיוורים בקיר לבן, ליד דלתות הזזה מזכוכית בסלון מואר.",
        master: { file: "Gemini_Generated_Image_a8lc69a8lc69a8lc.jpg" },
        source: geminiBatch2,
      },
      {
        slug: "living-room-wall-thermal-camera",
        alt: "טכנאי בחולצת טרמוליק עומד ליד קיר לבן ומכוון מצלמה תרמית אל כתם רטיבות גדול עם שוליים חומים.",
        master: { file: "Gemini_Generated_Image_sfxqbdsfxqbdsfxq.jpg" },
        source: geminiBatch2,
      },
    ],
  },
];

export function gallerySrc(image: GalleryImage): string {
  return `/images/gallery/${image.slug}.webp`;
}
