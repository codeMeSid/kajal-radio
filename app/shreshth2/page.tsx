import type { Metadata } from "next";
import Link from "next/link";
import { Clock } from "@/components/Hud";
import Radio from "@/components/Radio";

export const metadata: Metadata = {
  title: "Shreshth3 Radio",
  description:
    "a private penthouse lounge above a night city — dim 1970s bar, moon in the window, neon below, no street, no crowd, the 1970s — gangster nightlife colliding with a Sinatra lounge and Starboy aura",
};

const SAFE_TOP = "top-[max(1rem,env(safe-area-inset-top))]";
const SAFE_LEFT = "left-[max(1rem,env(safe-area-inset-left))]";

export default function Shreshth3Radio() {
  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center overflow-hidden">
      {/* 1 — the scene */}
      <div className="hero-bg-shreshth3 fixed inset-0 -z-20 bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/50" />
      </div>

      {/* 2 — grain */}
      <div className="grain pointer-events-none fixed inset-0 -z-10" />

      {/* 3 — clock */}
      <div className={`fixed z-20 ${SAFE_TOP} ${SAFE_LEFT}`}>
        <Clock />
      </div>

      {/* Wordmark: the top half of the justify-between pair. */}
      <header className="mt-[max(4.5rem,calc(env(safe-area-inset-top)+3.5rem))] px-6 text-center">
        <h1 className="text-4xl font-semibold tracking-[-0.03em] text-ink drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)] sm:text-5xl">
          <Link href="/" className="transition hover:text-accent-soft">
            श्रेष्ठ3 रेडियो
          </Link>
        </h1>
      </header>

      <Radio station="shreshth3" />
    </main>
  );
}
