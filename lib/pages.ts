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
  {
    href: "/shreshth",
    src: "/bg/shreshth/scene-wide.png",
    alt: "Shreshth Radio",
    kicker: "an ordinary Gujarati urban neighbourhood · the late 1970s",
    title: "श्रेष्ठ रेडियो",
  },
  {
    href: "/shamili2",
    src: "/bg/shamili2/scene-wide.png",
    alt: "Shamili2 Radio",
    kicker: "A girl lying on her bed in a Indian royal household set up with a bengali tradition theme with flowers or gajra in her hair · the late 1980s / 1990s",
    title: "शमीली2 रेडियो",
  },
];
