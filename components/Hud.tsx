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
