import type { Metadata } from "next";
import Link from "next/link";
import { Clock } from "@/components/Hud";
import Radio from "@/components/Radio";

export const metadata: Metadata = {
  title: "Kajal Radio",
  description:
    "A one-street radio station. Thirty-six songs about kajal, playing out of a cassette shop in Jaisalmer, 1997.",
};

const SAFE_TOP = "top-[max(1rem,env(safe-area-inset-top))]";
const SAFE_LEFT = "left-[max(1rem,env(safe-area-inset-left))]";

export default function KajalRadio() {
  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden">
      {/* 1 — the scene */}
      <div className="hero-bg-kajal fixed inset-0 -z-20 bg-cover bg-center">
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
            काजल रेडियो
          </Link>
        </h1>
        <p className="mt-1.5 text-[12.5px] text-ink/80 [text-shadow:0_2px_10px_rgba(0,0,0,0.95)]">
          Thirty-six songs about the same two eyes.
        </p>
      </header>

      {/* 4 — the player */}
      <div className="w-full max-w-xl px-[max(1rem,env(safe-area-inset-left))] pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-4 sm:pt-8">
        <Radio station="kajal" />
      </div>
    </main>
  );
}
