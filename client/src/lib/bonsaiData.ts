/**
 * QiSpace Bonsai — Data Model
 * Wabi-Sabi Cinematic Dark Garden design
 */

export interface BonsaiSpecies {
  id: string;
  kanji: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  style: string;
  baseGrowthPoints: number;
  careNotes: string[];
}

export interface BonsaiPot {
  id: string;
  name: string;
  subtitle: string;
  material: string;
}

export interface GrowthRule {
  icon: string;
  label: string;
  points: number;
}

export const SPECIES: BonsaiSpecies[] = [
  {
    id: "japanese-maple",
    kanji: "紅葉",
    name: "Japanese Maple",
    subtitle: "Kamagata — five-pointed leaves",
    description: "Delicate palmate foliage that blazes crimson in autumn. The Kamagata cultivar is prized for its compact, finely-cut leaves.",
    image: "/manus-storage/JapaneseMapleBonsai_fca2d0c2.webp",
    style: "Kamagata",
    baseGrowthPoints: 294,
    careNotes: [
      "Prefers partial shade in summer to prevent leaf scorch",
      "Repot every 2–3 years in early spring before bud break",
      "Prune in late autumn after leaves have fallen",
    ],
  },
  {
    id: "cannabis",
    kanji: "大麻",
    name: "Cannabis Bonsai",
    subtitle: "Sinsemilla — flowering form",
    description: "A rare and striking bonsai form featuring the iconic serrated leaves and dense flowering clusters of the cannabis plant.",
    image: "/manus-storage/Tokimeki-CannabisBonsai_5cc7fa0d.webp",
    style: "Sinsemilla",
    baseGrowthPoints: 204,
    careNotes: [
      "Requires full sun — minimum 8 hours of direct light",
      "Water deeply but allow soil to dry between waterings",
      "Pinch new growth tips to encourage lateral branching",
    ],
  },
  {
    id: "chrysanthemum",
    kanji: "菊盆栽",
    name: "Chrysanthemum Bonsai",
    subtitle: "Incurved Puff — layered petals",
    description: "The chrysanthemum bonsai combines the ancient art of bonsai with the layered petal complexity of the incurved mum variety.",
    image: "/manus-storage/Tokimeki-ChrysanthemumBonsai_c3684a0e.webp",
    style: "Incurved Cascade",
    baseGrowthPoints: 204,
    careNotes: [
      "Deadhead spent blooms promptly to encourage new flower buds",
      "Feed with high-potassium fertilizer during bud formation",
      "Protect from frost — bring indoors below 5°C",
    ],
  },
  {
    id: "red-cedar",
    kanji: "赤杉森",
    name: "Red Cedar Mini Forest",
    subtitle: "Grove Forest Style — soft conifer clusters",
    description: "A miniature grove of red cedar trees arranged in the Yose-ue (group planting) style, evoking a misty mountain forest.",
    image: "/manus-storage/Tokimeki-RedCedarForestBonsai_9f18d9c3.webp",
    style: "Grove Forest",
    baseGrowthPoints: 204,
    careNotes: [
      "Mist foliage daily to maintain humidity around the grove",
      "Rotate the pot quarterly for even light distribution",
      "Remove interior dead branches to improve airflow",
    ],
  },
  {
    id: "wisteria",
    kanji: "藤",
    name: "Wisteria Bonsai",
    subtitle: "Cascade Flower Style — pendulous racemes",
    description: "Cascading purple flower racemes drape from twisted branches in this breathtaking Kengai (cascade) style wisteria.",
    image: "/manus-storage/Tokimeki-WisteriaBonsai_8f3b2d81.webp",
    style: "Cascade Flower",
    baseGrowthPoints: 204,
    careNotes: [
      "Prune hard after flowering to maintain compact form",
      "Requires a cold dormancy period to set flower buds",
      "Feed with low-nitrogen fertilizer to promote blooms over foliage",
    ],
  },
];

export const POTS: BonsaiPot[] = [
  { id: "round-earthen",   name: "Round Earthen",   subtitle: "Unglazed terracotta",    material: "Terracotta" },
  { id: "square-stone",    name: "Square Stone",    subtitle: "Coarse stonewear",       material: "Stonewear" },
  { id: "round-cobalt",    name: "Round Cobalt",    subtitle: "Glazed cobalt blue",     material: "Glazed Ceramic" },
  { id: "square-glazed",   name: "Square Glazed",   subtitle: "Pale celadon glaze",     material: "Celadon" },
];

export const GROWTH_RULES: GrowthRule[] = [
  { icon: "🌿", label: "Each Ikigai entry",        points: 2  },
  { icon: "📓", label: "Each journal entry",        points: 5  },
  { icon: "✅", label: "Each completed week",       points: 8  },
  { icon: "💧", label: "Daily watering",            points: 1  },
  { icon: "✂️", label: "Pruning session",           points: 3  },
  { icon: "🪵", label: "Carve Jin deadwood",        points: 5  },
];

export type CareAction = "water" | "prune" | "carve-jin";

export interface CareActionDef {
  id: CareAction;
  label: string;
  icon: string;
  cooldownMs: number;
  pointsGained: number;
  description: string;
}

export const CARE_ACTIONS: CareActionDef[] = [
  {
    id: "water",
    label: "Water (daily)",
    icon: "💧",
    cooldownMs: 24 * 60 * 60 * 1000, // 24h in real app; shortened for demo
    pointsGained: 1,
    description: "Provide a thorough watering, allowing water to drain fully from the pot.",
  },
  {
    id: "prune",
    label: "Prune",
    icon: "✂️",
    cooldownMs: 3 * 60 * 1000, // 3 min demo cooldown
    pointsGained: 3,
    description: "Remove unwanted growth to refine the tree's silhouette and encourage back-budding.",
  },
  {
    id: "carve-jin",
    label: "Carve Jin",
    icon: "🪵",
    cooldownMs: 5 * 60 * 1000, // 5 min demo cooldown
    pointsGained: 5,
    description: "Create dramatic deadwood features (Jin) that evoke the tree's age and resilience.",
  },
];
