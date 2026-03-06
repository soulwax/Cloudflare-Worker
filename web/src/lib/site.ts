export interface ModuleCard {
  slug: string;
  title: string;
  description: string;
  status: "migrated" | "legacy";
  href?: string;
}

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/brain-atlas", label: "Brain Atlas" },
] as const;

export const moduleCards: ModuleCard[] = [
  {
    slug: "brain-atlas",
    title: "Brain Atlas",
    description:
      "Migrated to App Router as the first typed React slice. Explore major regions in Chapter 1, then switch to Chapter 2 for interlinked circuits.",
    status: "migrated",
    href: "/brain-atlas",
  },
  {
    slug: "vision",
    title: "Visual Cortex",
    description:
      "Still on the legacy runtime for now. This is a good next migration target because it is mostly a data-driven explainer page.",
    status: "legacy",
  },
  {
    slug: "ecg",
    title: "12-Lead ECG Explorer",
    description:
      "Still on the legacy runtime. It will benefit from typed components because the current UI is a large inline SVG/JS template.",
    status: "legacy",
  },
  {
    slug: "retina",
    title: "Retinal Receptive Field Lab",
    description:
      "Still on the legacy runtime. Its charts and controls are a natural fit for React components once the migration pattern is stable.",
    status: "legacy",
  },
  {
    slug: "dopamine",
    title: "Dopamine Prediction Error Lab",
    description:
      "Still on the legacy runtime. Its learning curves and snapshot traces map cleanly to componentized chart sections.",
    status: "legacy",
  },
];
