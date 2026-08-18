export type SitePage = {
  href: string;
  src: string;
  alt: string;
  kicker: string;
  title: string;
};

// Add a page = one object here + app/<slug>/page.tsx
export const SITE_PAGES: SitePage[] = [
  {
    href: "/kajal",
    src: "/bg/kajal/scene-wide.png",
    alt: "Kajal Radio",
    kicker: "Jaipur · RJ14 · 1997",
    title: "काजल रेडियो",
  },
  {
    href: "/shamili",
    src: "/bg/shamili/scene-wide.png",
    alt: "Shamili Radio",
    kicker: "typical Bengali house setup · late 2020s",
    title: "शमीली रेडियो",
  },
];
