"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { track as analytics } from "@vercel/analytics";
import { STATIONS, type StationId, type Track } from "@/lib/tracks";

/* ------------------------------------------------------------------ *
 * YouTube IFrame API
 * ------------------------------------------------------------------ */

type YTPlayer = {
  loadVideoById: (id: string) => void;
  cueVideoById: (id: string) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
};

type YTNamespace = {
  Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer;
};

type YTWindow = Window & {
  YT?: YTNamespace;
  onYouTubeIframeAPIReady?: () => void;
};

let apiPromise: Promise<YTNamespace> | null = null;

function loadYouTubeApi(): Promise<YTNamespace> {
  const w = window as YTWindow;
  if (w.YT?.Player) return Promise.resolve(w.YT);
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const previous = w.onYouTubeIframeAPIReady;
      w.onYouTubeIframeAPIReady = () => {
        previous?.();
        resolve(w.YT as YTNamespace);
      };
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    });
  }
  return apiPromise;
}

const UNSTARTED = -1;
const ENDED = 0;
const PLAYING = 1;
const PAUSED = 2;

/* ------------------------------------------------------------------ *
 * Module-scope pieces.
 * Declared here, NOT inside Radio: a component defined in the render body
 * gets a new identity every render, React remounts the subtree, and the
 * vinyl's CSS animation snaps back to 0deg on every progress tick.
 * ------------------------------------------------------------------ */

const GLASS =
  "border border-white/10 bg-gradient-to-b from-white/[0.15] to-white/[0.055] " +
  "backdrop-blur-3xl backdrop-saturate-[1.7] " +
  "shadow-[0_16px_48px_-12px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)]";

function clock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function IconPrev({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M7 5.5a1 1 0 0 1 2 0v4.9l8.5-5.2A1 1 0 0 1 19 6.05v11.9a1 1 0 0 1-1.5.85L9 13.6v4.9a1 1 0 1 1-2 0v-13Z" />
    </svg>
  );
}

function IconNext({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17 5.5a1 1 0 0 0-2 0v4.9L6.5 5.2A1 1 0 0 0 5 6.05v11.9a1 1 0 0 0 1.5.85L15 13.6v4.9a1 1 0 1 0 2 0v-13Z" />
    </svg>
  );
}

function IconPlay({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.3-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

function IconPause({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M7 4.5h3.2v15H7zM13.8 4.5H17v15h-3.2z" />
    </svg>
  );
}

function VinylSlot({
  slotRef,
  size,
  hidden,
}: {
  slotRef: React.RefObject<HTMLDivElement | null>;
  size: number;
  hidden: boolean;
}) {
  return (
    <div
      ref={slotRef}
      style={{ width: size, height: size }}
      className="relative shrink-0 rounded-full bg-black/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
    >
      {/* Visible only while the real player is detached into the big view. */}
      <span
        className={`absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14)_0%,transparent_58%)] transition-opacity ${
          hidden ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

function Meta({
  track,
  compact,
}: {
  track: Track | undefined;
  compact: boolean;
}) {
  if (!track) {
    return (
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold tracking-tight text-ink">
          No tracks yet
        </p>
        {compact ? null : (
          <p className="truncate text-[12.5px] text-white/70">add songs in lib/tracks.ts</p>
        )}
      </div>
    );
  }
  const sub = [track.artist, track.film, track.year > 0 ? track.year : null]
    .filter(Boolean)
    .join(" · ");
  return (
    <div className="min-w-0 flex-1">
      <p className="truncate text-[15px] font-semibold tracking-tight text-ink">
        {track.title}
      </p>
      {compact ? null : <p className="truncate text-[12.5px] text-white/70">{sub}</p>}
    </div>
  );
}

function SeekBar({
  position,
  duration,
  onSeek,
  className = "",
}: {
  position: number;
  duration: number;
  onSeek: (seconds: number) => void;
  className?: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(0);

  const value = dragging ? preview : position;
  const pct = duration > 0 ? Math.max(0, Math.min(1, value / duration)) * 100 : 0;

  const secondsAt = (clientX: number) => {
    const el = railRef.current;
    if (!el || duration <= 0) return 0;
    const r = el.getBoundingClientRect();
    return (Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * duration);
  };

  return (
    <div
      ref={railRef}
      role="slider"
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={Math.round(duration)}
      aria-valuenow={Math.round(value)}
      tabIndex={0}
      // Pointer, not click: click never fires mid-drag and never fires on touch
      // until release. touch-none stops the drag scrolling the page.
      onPointerDown={(e) => {
        if (duration <= 0) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
        setPreview(secondsAt(e.clientX));
      }}
      onPointerMove={(e) => {
        if (!dragging) return;
        setPreview(secondsAt(e.clientX));
      }}
      onPointerUp={(e) => {
        if (!dragging) return;
        const t = secondsAt(e.clientX);
        setDragging(false);
        onSeek(t);
      }}
      onPointerCancel={() => setDragging(false)}
      onKeyDown={(e) => {
        if (duration <= 0) return;
        if (e.key === "ArrowRight") onSeek(Math.min(duration, position + 5));
        if (e.key === "ArrowLeft") onSeek(Math.max(0, position - 5));
      }}
      className={`group relative flex h-6 cursor-pointer touch-none items-center outline-none ${className}`}
    >
      <div className="relative h-[3px] w-full rounded-full bg-white/15">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-accent shadow-[0_0_10px_rgba(227,169,75,0.75)]"
          style={{ width: `${pct}%` }}
        />
        <div
          className={`absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-soft shadow-[0_0_10px_rgba(227,169,75,0.9)] transition-opacity ${
            dragging ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
          }`}
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Transport({
  playing,
  onPrev,
  onNext,
  onToggle,
  large,
}: {
  playing: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggle: () => void;
  large: boolean;
}) {
  const ghost =
    "grid place-items-center rounded-full text-ink/80 transition hover:bg-white/10 hover:text-ink active:scale-95";
  return (
    <div className={`flex shrink-0 items-center ${large ? "gap-3" : "gap-0.5"}`}>
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous track"
        className={`${ghost} ${large ? "size-11" : "size-9"}`}
      >
        <IconPrev className={large ? "size-5" : "size-4"} />
      </button>

      <button
        type="button"
        onClick={onToggle}
        aria-label={playing ? "Pause" : "Play"}
        className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-b from-accent-soft to-accent-deep text-black/85 ring-1 ring-white/25 transition active:scale-95 ${
          large
            ? "size-[52px] shadow-[0_10px_28px_-6px_rgba(227,169,75,0.75)]"
            : "size-10 shadow-[0_8px_20px_-6px_rgba(227,169,75,0.7)]"
        }`}
      >
        {playing ? (
          <IconPause className={large ? "size-5" : "size-4"} />
        ) : (
          <IconPlay className={`${large ? "size-5" : "size-4"} translate-x-[1px]`} />
        )}
      </button>

      <button
        type="button"
        onClick={onNext}
        aria-label="Next track"
        className={`${ghost} ${large ? "size-11" : "size-9"}`}
      >
        <IconNext className={large ? "size-5" : "size-4"} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Radio
 * ------------------------------------------------------------------ */

export default function Radio({ station }: { station: StationId }) {
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const tracks = STATIONS[station];
  const current = tracks[trackIndex];
  const playable = Boolean(current?.videoId);

  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const loadedRef = useRef("");
  const wantsPlayRef = useRef(false);
  const errorStreak = useRef(0);
  // Event handlers from the YT API outlive the render that created them, so
  // they call through a ref that every render refreshes.
  const advanceRef = useRef<(reason: "ended" | "error") => void>(() => {});
  const currentRef = useRef<Track | undefined>(current);
  currentRef.current = current;

  const goTo = (next: number) => {
    if (tracks.length === 0) return;
    setTrackIndex(((next % tracks.length) + tracks.length) % tracks.length);
    setPosition(0);
    setDuration(0);
  };

  advanceRef.current = (reason) => {
    if (reason === "error" && errorStreak.current > tracks.length) {
      wantsPlayRef.current = false;
      setPlaying(false);
      return;
    }
    goTo(trackIndex + 1);
  };

  /* Destroy on unmount only — creating is handled below. */
  useEffect(() => {
    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  /* Create the player once, on the first track that actually has an id.
     Constructing it with an empty videoId makes the API throw. */
  useEffect(() => {
    const videoId = current?.videoId;
    if (!videoId || playerRef.current) return;
    let cancelled = false;
    loadYouTubeApi().then((YT) => {
      if (cancelled || !hostRef.current || playerRef.current) return;
      loadedRef.current = videoId;
      playerRef.current = new YT.Player(hostRef.current, {
        width: "100%",
        height: "100%",
        videoId,
        playerVars: {
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          controls: 1,
          iv_load_policy: 3,
          origin: window.location.origin,
        },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            setReady(true);
            if (wantsPlayRef.current) e.target.playVideo();
          },
          onStateChange: (e: { data: number }) => {
            if (e.data === PLAYING) {
              errorStreak.current = 0;
              wantsPlayRef.current = true;
              setPlaying(true);
              const p = playerRef.current;
              if (p) setDuration(p.getDuration());
            } else if (e.data === PAUSED || e.data === UNSTARTED) {
              setPlaying(false);
            } else if (e.data === ENDED) {
              setPlaying(false);
              advanceRef.current("ended");
            }
          },
          onError: (e: { data: number }) => {
            // Videos get deleted or lose embed rights after ship. Move on,
            // and leave a breadcrumb so the dead id can be replaced.
            errorStreak.current += 1;
            analytics("yt_error", {
              code: e.data,
              videoId: loadedRef.current,
              title: currentRef.current?.title ?? "",
            });
            advanceRef.current("error");
          },
        },
      });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.videoId]);

  /* Swap the video when the selection changes. */
  useEffect(() => {
    const p = playerRef.current;
    if (!p || !ready) return;
    const videoId = current?.videoId ?? "";

    if (!videoId) {
      // Only if something was actually loaded — the API throws
      // "Invalid video id" when stopping a player that never got one.
      if (loadedRef.current) p.stopVideo();
      loadedRef.current = "";
      setPlaying(false);
      setPosition(0);
      setDuration(0);
      return;
    }
    if (loadedRef.current === videoId) return;

    loadedRef.current = videoId;
    setPosition(0);
    setDuration(0);
    if (wantsPlayRef.current) p.loadVideoById(videoId);
    else p.cueVideoById(videoId);
  }, [ready, current?.videoId]);

  /* Progress. */
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      setPosition(p.getCurrentTime());
      const d = p.getDuration();
      if (d > 0) setDuration(d);
    }, 250);
    return () => clearInterval(id);
  }, [playing]);

  /* ---------------------------------------------------------------- *
   * One iframe, two pills. Desktop and mobile each hold an empty vinyl
   * slot; the real player is a single fixed element parked over whichever
   * slot is currently visible. Moving the iframe in the DOM would reload
   * it and stop playback.
   * ---------------------------------------------------------------- */
  const desktopSlot = useRef<HTMLDivElement>(null);
  const mobileSlot = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ top: number; left: number; width: number; height: number } | null>(
    null,
  );

  useLayoutEffect(() => {
    const measure = () => {
      if (expanded) {
        const width = Math.min(window.innerWidth - 32, 720);
        const height = Math.round((width * 9) / 16);
        setBox({
          width,
          height,
          left: Math.round((window.innerWidth - width) / 2),
          top: Math.max(16, Math.round((window.innerHeight - height) / 2 - 40)),
        });
        return;
      }
      const slot = [desktopSlot.current, mobileSlot.current].find(
        (el) => el && el.getClientRects().length > 0,
      );
      if (!slot) return;
      const r = slot.getBoundingClientRect();
      setBox({ top: r.top, left: r.left, width: r.width, height: r.height });
    };

    measure();
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [expanded, trackIndex]);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  const toggle = () => {
    const p = playerRef.current;
    // Never gated on a readiness event: iOS Safari will not fire one before
    // the gesture, and the button would stay dead forever.
    wantsPlayRef.current = !playing;
    if (!p) return;
    if (playing) p.pauseVideo();
    else p.playVideo();
  };

  const seek = (seconds: number) => {
    setPosition(seconds);
    playerRef.current?.seekTo(seconds, true);
  };

  const shownDuration = duration || current?.duration || 0;

  return (
    <>
      {/* The player itself — always visible, never a 1px box. Tap the vinyl to
          grow it to a real, watchable, skippable size. */}
      {expanded && (
        <div
          aria-hidden
          onClick={() => setExpanded(false)}
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm"
        />
      )}
      <div
        style={
          box
            ? { top: box.top, left: box.left, width: box.width, height: box.height }
            : { top: 0, left: 0, width: 80, height: 80, opacity: 0, pointerEvents: "none" }
        }
        className={`fixed z-40 overflow-hidden ${
          expanded
            ? "rounded-2xl ring-1 ring-white/20 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
            : "rounded-full ring-1 ring-white/25 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.9)]"
        }`}
      >
        <div
          className={`absolute inset-0 ${expanded ? "" : "vinyl-spin"}`}
          style={expanded ? undefined : { animationPlayState: playing ? "running" : "paused" }}
        >
          <div className={`yt-frame ${expanded ? "absolute inset-0" : "yt-cover"}`}>
            <div ref={hostRef} />
          </div>
        </div>

        {!expanded && (
          <>
            <button
              type="button"
              onClick={() => setExpanded(true)}
              aria-label="Open the video full size"
              className="absolute inset-0 rounded-full"
            />
            <span className="pointer-events-none absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/70 ring-2 ring-white/40" />
          </>
        )}
      </div>

      {expanded && box && (
        <button
          type="button"
          aria-label="Close video"
          onClick={() => setExpanded(false)}
          style={{ top: Math.max(8, box.top - 44), left: box.left + box.width - 36 }}
          className="fixed z-40 grid size-9 place-items-center rounded-full bg-black/60 text-ink ring-1 ring-white/20 backdrop-blur transition hover:bg-black/80"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4" aria-hidden>
            <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>
      )}

      <div className="flex w-full max-w-xl flex-col items-center gap-3">
        {tracks.length === 0 ? (
          <p className="rounded-full border border-amber-300/25 bg-black/40 px-3 py-1 text-center text-[10.5px] uppercase tracking-[0.12em] text-amber-200/80 backdrop-blur-md">
            no tracks yet — add them in lib/tracks.ts
          </p>
        ) : !playable ? (
          <p className="rounded-full border border-amber-300/25 bg-black/40 px-3 py-1 text-center text-[10.5px] uppercase tracking-[0.12em] text-amber-200/80 backdrop-blur-md">
            no videoId yet — add one in lib/tracks.ts
          </p>
        ) : null}

        {/* DESKTOP — one horizontal pill. */}
        <div className={`hidden w-full items-center gap-4 rounded-full p-3 pr-5 sm:flex ${GLASS}`}>
          <VinylSlot slotRef={desktopSlot} size={80} hidden={expanded} />

          <div className="min-w-0 flex-1">
            <Meta track={current} compact={false} />
            <SeekBar position={position} duration={shownDuration} onSeek={seek} className="mt-1" />
          </div>

          <div className="shrink-0 text-[10.5px] tabular-nums text-white/60">
            {clock(position)} <span className="text-white/30">/</span> {clock(shownDuration)}
          </div>

          <Transport
            playing={playing}
            onPrev={() => goTo(trackIndex - 1)}
            onNext={() => goTo(trackIndex + 1)}
            onToggle={toggle}
            large={false}
          />
        </div>

        {/* MOBILE — same pill height as desktop. Disc left; controls on top, seeker below. */}
        <div className={`flex w-full items-center gap-3 rounded-full p-2 pr-3 sm:hidden ${GLASS}`}>
          <VinylSlot slotRef={mobileSlot} size={64} hidden={expanded} />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <Meta track={current} compact />
              <Transport
                playing={playing}
                onPrev={() => goTo(trackIndex - 1)}
                onNext={() => goTo(trackIndex + 1)}
                onToggle={toggle}
                large={false}
              />
            </div>
            <div className="flex items-center gap-2">
              <SeekBar
                position={position}
                duration={shownDuration}
                onSeek={seek}
                className="min-w-0 flex-1"
              />
              <div className="shrink-0 text-[10px] tabular-nums text-white/60">
                {clock(position)} <span className="text-white/30">/</span> {clock(shownDuration)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
