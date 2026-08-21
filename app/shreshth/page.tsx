import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Listeners } from "@/components/Hud";
import Radio from "@/components/Radio";

export const metadata: Metadata = {
  title: "Shreshth Radio",
  description: "an ordinary Gujarati urban neighbourhood, the late 1970s",
};

const SAFE_TOP = "top-[max(1rem,env(safe-area-inset-top))]";
const SAFE_LEFT = "left-[max(1rem,env(safe-area-inset-left))]";
const SAFE_RIGHT = "right-[max(1rem,env(safe-area-inset-right))]";

// ponytail: placeholder hrefs. Swap in the real handles, they are one string each.
const SOCIALS = [
  { label: "Instagram", href: "#", path: "M12 7.6a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8Zm0 7.25a2.85 2.85 0 1 1 0-5.7 2.85 2.85 0 1 1 0 5.7Zm5.6-7.43a1.03 1.03 0 1 1-2.05 0 1.03 1.03 0 0 1 2.05 0ZM12 4.35c-2.5 0-2.81.01-3.79.06-.99.04-1.66.2-2.25.43a4.55 4.55 0 0 0-1.64 1.07A4.55 4.55 0 0 0 3.25 7.6c-.23.59-.39 1.26-.43 2.25C2.77 10.83 2.76 11.14 2.76 12s.01 1.17.06 2.15c.04.99.2 1.66.43 2.25.24.62.56 1.15 1.07 1.64.49.51 1.02.83 1.64 1.07.59.23 1.26.39 2.25.43.98.05 1.29.06 3.79.06s2.81-.01 3.79-.06c.99-.04 1.66-.2 2.25-.43a4.55 4.55 0 0 0 1.64-1.07c.51-.49.83-1.02 1.07-1.64.23-.59.39-1.26.43-2.25.05-.98.06-1.29.06-2.15s-.01-1.17-.06-2.15c-.04-.99-.2-1.66-.43-2.25a4.55 4.55 0 0 0-1.07-1.64 4.55 4.55 0 0 0-1.64-1.07c-.59-.23-1.26-.39-2.25-.43-.98-.05-1.29-.06-3.79-.06Zm0 1.55c2.46 0 2.75.01 3.72.05.9.04 1.38.19 1.71.31.43.17.74.37 1.06.69.32.32.52.63.69 1.06.12.33.27.81.31 1.71.04.97.05 1.26.05 3.72s-.01 2.75-.05 3.72c-.04.9-.19 1.38-.31 1.71-.17.43-.37.74-.69 1.06-.32.32-.63.52-1.06.69-.33.12-.81.27-1.71.31-.97.04-1.26.05-3.72.05s-2.75-.01-3.72-.05c-.9-.04-1.38-.19-1.71-.31a2.85 2.85 0 0 1-1.06-.69 2.85 2.85 0 0 1-.69-1.06c-.12-.33-.27-.81-.31-1.71-.04-.97-.05-1.26-.05-3.72s.01-2.75.05-3.72c.04.9.19-1.38.31-1.71.17-.43.37-.74.69-1.06.32-.32.63-.52 1.06-.69.33.12.81-.27 1.71-.31.97-.04 1.26-.05 3.72-.05Z" },
  { label: "X", href: "#", path: "M17.53 3.5h2.9l-6.33 7.24 7.45 9.76h-5.83l-4.57-5.97-5.22 5.97H3.02l6.77-7.74L2.65 3.5h5.98l4.13 5.46L17.53 3.5Zm-1.02 15.26h1.6L7.56 5.13H5.84l10.67 13.63Z" },
  { label: "Email", href: "#", path: "M3.5 6.75A2.25 2.25 0 0 1 5.75 4.5h12.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25H5.75a2.25 2.25 0 0 1-2.25-2.25V6.75Zm2.4-.75 6.1 4.62L18.1 6H5.9ZM19 7.4l-6.52 4.94a.9.9 0 0 1-1.09 0L5 7.4v9.85c0 .41.34.75.75.75h12.5c.41 0 .75-.34.75-.75V7.4Z" },
];

export default function ShreshthRadio() {
  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden">
      {/* 1 — the scene */}
      <div className="hero-bg-shreshth fixed inset-0 -z-20 bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/80" />
      </div>

      {/* 2 — grain */}
      <div className="grain pointer-events-none fixed inset-0 -z-10" />

      {/* 3 — the fixed top row */}
      <div className={`fixed z-20 ${SAFE_TOP} ${SAFE_LEFT}`}>
        <Clock />
      </div>

      <div className={`fixed z-20 left-1/2 -translate-x-1/2 ${SAFE_TOP}`}>
        <Listeners />
      </div>

      <div className={`fixed z-20 flex items-center gap-1 ${SAFE_TOP} ${SAFE_RIGHT}`}>
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            aria-label={s.label}
            target="_blank"
            rel="noreferrer"
            className="grid size-8 place-items-center rounded-full text-ink/60 transition hover:bg-white/10 hover:text-ink sm:size-9"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]" aria-hidden>
              <path d={s.path} />
            </svg>
          </a>
        ))}
      </div>

      {/* Wordmark: the top half of the justify-between pair. */}
      <header className="mt-[max(4.5rem,calc(env(safe-area-inset-top)+3.5rem))] px-6 text-center">
        <p className="text-[10.5px] uppercase tracking-[0.42em] text-accent-soft/90 [text-shadow:0_2px_10px_rgba(0,0,0,0.95)]">
          an ordinary Gujarati urban neighbourhood · the late 1970s
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.03em] text-ink drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)] sm:text-5xl">
          <Link href="/" className="transition hover:text-accent-soft">
            श्रेष्ठ रेडियो
          </Link>
        </h1>
      </header>

      {/* 4 — the player */}
      <div className="w-full max-w-xl px-[max(1rem,env(safe-area-inset-left))] pb-[max(1rem,env(safe-area-inset-bottom))] pt-8">
        <Radio station="shreshth" />
      </div>
    </main>
  );
}
