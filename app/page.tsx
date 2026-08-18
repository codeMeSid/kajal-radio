import type { Metadata } from "next";
import DomeGallery from "@/components/DomeGallery";
import { SITE_PAGES } from "@/lib/pages";

export const metadata: Metadata = {
  title: {
    absolute: "Kajal",
  },
  description: "A house of small pages.",
};

export default function Home() {
  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden bg-[#16110b]">
      <h1 className="pointer-events-none fixed inset-x-0 top-[max(1rem,env(safe-area-inset-top))] z-10 text-center text-[11px] uppercase tracking-[0.42em] text-ink/70">
        Kajal
      </h1>
      <div className="h-[100dvh] w-full">
        <DomeGallery
          images={SITE_PAGES}
          fit={1}
          minRadius={1000}
          maxVerticalRotationDeg={10}
          segments={30}
          grayscale={false}
          overlayBlurColor="#16110b"
        />
      </div>
    </main>
  );
}
