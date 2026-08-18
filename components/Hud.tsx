"use client";

import { useEffect, useState } from "react";

const IST = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

/** "7:42 am" -> { hh: "7", mm: "42", suffix: "am" } so the colon can blink alone. */
function readIST(now: Date) {
  const parts = IST.formatToParts(now);
  const get = (t: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === t)?.value ?? "";
  return { hh: get("hour"), mm: get("minute"), suffix: get("dayPeriod").toLowerCase() };
}

export function Clock() {
  // Render nothing on the server: the clock is wall-time, it can never match.
  const [time, setTime] = useState<ReturnType<typeof readIST> | null>(null);

  useEffect(() => {
    const tick = () => setTime(readIST(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-baseline gap-1.5 text-ink/90 tabular-nums drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
      <span className="text-[15px] font-medium tracking-tight sm:text-base">
        {time ? (
          <>
            {time.hh}
            <span className="blink mx-px opacity-90">:</span>
            {time.mm}
          </>
        ) : (
          <span className="opacity-0">0:00</span>
        )}
      </span>
      <span className="text-[10px] uppercase tracking-[0.18em] text-ink/55">
        {time ? `${time.suffix} ist` : ""}
      </span>
    </div>
  );
}

export function Listeners() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // ponytail: cosmetic. Swap for a real presence channel when one exists.
    let n = 180 + Math.floor(Math.random() * 90);
    setCount(n);
    const id = setInterval(() => {
      n = Math.max(120, n + Math.floor(Math.random() * 9) - 4);
      setCount(n);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/25 px-2.5 py-1.5 backdrop-blur-md sm:gap-2 sm:px-3">
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent/70" />
        <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
      </span>
      <span className="text-[9.5px] uppercase tracking-[0.12em] text-ink/70 tabular-nums sm:text-[10.5px] sm:tracking-[0.16em]">
        {count === null ? "on air" : `${count} listening`}
      </span>
    </div>
  );
}
