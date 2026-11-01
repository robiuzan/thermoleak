// The gallery's scene register: the words of the section and which images form each scene.
// components/Gallery.tsx renders it on `/` and `/gallery/`. The images themselves — their files,
// alt text and provenance — are entries in content/images/manifest.json (slot `supplied`), and
// `orders` names their placement orders. Masters and the review of each frame:
// assets/gallery/README.md.
//
// Every picture on the site is an illustration under the site-wide note, never evidence
// (CLAUDE.md §15), so a scene's caption names an activity, never a symptom or a finding.

export interface GalleryScene {
  caption: string;
  /** A slug from lib/services.ts — the service the scene illustrates. */
  service: string;
  /** The placement orders of the scene's images: a wide shot, then closer shots of the camera. */
  orders: readonly number[];
}

/** The section's own words. `secondTitle` heads the second row on /gallery/. */
export const gallery = {
  eyebrow: "הבדיקה בשטח",
  title: "כך נראית בדיקה תרמית בבית",
  secondTitle: "עוד הדמיות של בדיקה תרמית",
  allImagesLink: "לכל התמונות — בגלריה",
};

/** The page each people-free, camera-free /gallery/ tile links to: it has no service of its own. */
export const generatedLinks: Record<string, string> = {
  "gallery-generated-3": "/services/moisture-detection/",
  "gallery-generated-6": "/services/water-leak-detection/",
};

export const galleryScenes: GalleryScene[] = [
  {
    caption: "סריקה תרמית סביב כיור המטבח",
    service: "water-leak-detection",
    orders: [1, 2, 3],
  },
  {
    caption: "סריקה תרמית של קיר מתחת לחלון",
    service: "moisture-detection",
    orders: [4, 5],
  },
  {
    caption: "סריקה תרמית של רצפת המקלחת",
    service: "water-leak-detection",
    orders: [6, 7],
  },
  {
    caption: "סריקה תרמית של התקרה",
    service: "water-leak-detection",
    orders: [8, 9],
  },
  {
    caption: "סריקה תרמית של קיר בסלון",
    service: "moisture-detection",
    orders: [10, 11],
  },
];
