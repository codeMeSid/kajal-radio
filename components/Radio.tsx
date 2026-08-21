"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

function IconPlay({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.3-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

function IconPause({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M7 4.5h3.2v15H7zM13.8 4.5H17v15h-3.2z" />
    </svg>
  );
}

function VinylSlot({ slotRef }: { slotRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={slotRef}
      className="size-28 rounded-full bg-black/70 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] sm:size-32"
    />
  );
}

export default function Radio({ station }: { station: StationId }) {
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  const tracks = STATIONS[station];
  const current = tracks[trackIndex];
  const playable = Boolean(current?.videoId);

  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const loadedRef = useRef("");
  const wantsPlayRef = useRef(false);
  const errorStreak = useRef(0);
  const advanceRef = useRef<(reason: "ended" | "error") => void>(() => {});
  const currentRef = useRef<Track | undefined>(current);
  currentRef.current = current;

  const goTo = (next: number) => {
    if (tracks.length === 0) return;
    setTrackIndex(((next % tracks.length) + tracks.length) % tracks.length);
  };

  advanceRef.current = (reason) => {
    if (reason === "error" && errorStreak.current > tracks.length) {
      wantsPlayRef.current = false;
      setPlaying(false);
      return;
    }
    goTo(trackIndex + 1);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const videoId = current?.videoId;
    if (!mounted || !videoId || playerRef.current) return;
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
          controls: 0,
          fs: 0,
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
            } else if (e.data === PAUSED || e.data === UNSTARTED) {
              setPlaying(false);
            } else if (e.data === ENDED) {
              setPlaying(false);
              advanceRef.current("ended");
            }
          },
          onError: (e: { data: number }) => {
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
  }, [mounted, current?.videoId]);

  useEffect(() => {
    const p = playerRef.current;
    if (!p || !ready) return;
    const videoId = current?.videoId ?? "";

    if (!videoId) {
      if (loadedRef.current) p.stopVideo();
      loadedRef.current = "";
      setPlaying(false);
      return;
    }
    if (loadedRef.current === videoId) return;

    loadedRef.current = videoId;
    if (wantsPlayRef.current) p.loadVideoById(videoId);
    else p.cueVideoById(videoId);
  }, [ready, current?.videoId]);

  const slotRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ top: number; left: number; width: number; height: number } | null>(
    null,
  );

  useLayoutEffect(() => {
    const measure = () => {
      const slot = slotRef.current;
      if (!slot) return;
      const r = slot.getBoundingClientRect();
      setBox({ top: r.top, left: r.left, width: r.width, height: r.height });
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (slotRef.current) ro.observe(slotRef.current);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    window.visualViewport?.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("scroll", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
      window.visualViewport?.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("scroll", measure);
    };
  }, [trackIndex]);

  const toggle = () => {
    const p = playerRef.current;
    wantsPlayRef.current = !playing;
    if (!p) return;
    if (playing) p.pauseVideo();
    else p.playVideo();
  };

  const overlay = (
    <div
      style={
        box
          ? { top: box.top, left: box.left, width: box.width, height: box.height }
          : { top: 0, left: 0, width: 112, height: 112, opacity: 0, pointerEvents: "none" }
      }
      className="fixed z-40 overflow-hidden rounded-full shadow-[0_12px_36px_-8px_rgba(0,0,0,0.9)] ring-1 ring-white/25"
    >
      <div
        className="vinyl-spin absolute inset-0"
        style={{ animationPlayState: playing ? "running" : "paused" }}
      >
        <div className="yt-frame yt-cover pointer-events-none">
          <div ref={hostRef} />
        </div>
        {current?.videoId ? (
          <img
            src={`https://i.ytimg.com/vi/${current.videoId}/hqdefault.jpg`}
            alt=""
            className="pointer-events-none absolute inset-0 size-full object-cover"
          />
        ) : null}
      </div>

      <button
        type="button"
        onClick={toggle}
        disabled={!playable}
        aria-label={playing ? "Pause" : "Play"}
        className="absolute inset-0 z-10 m-auto grid size-12 place-items-center rounded-full bg-accent text-black shadow-[0_8px_24px_-6px_rgba(227,169,75,0.8)] ring-1 ring-white/25 transition active:scale-95 disabled:opacity-40 sm:size-14"
      >
        {playing ? (
          <IconPause className="size-5 sm:size-6" />
        ) : (
          <IconPlay className="size-5 translate-x-px sm:size-6" />
        )}
      </button>
    </div>
  );

  return (
    <>
      {mounted ? createPortal(overlay, document.body) : null}

      <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-20 flex w-28 flex-col items-center sm:w-32">
        {tracks.length === 0 ? (
          <p className="mb-2 text-center text-[10.5px] text-amber-200/80">no tracks yet</p>
        ) : !playable ? (
          <p className="mb-2 text-center text-[10.5px] text-amber-200/80">no videoId yet</p>
        ) : null}

        <VinylSlot slotRef={slotRef} />

        <p className="mt-2.5 w-full text-center text-[13px] font-semibold leading-snug tracking-tight text-ink line-clamp-2 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)] sm:text-[14px]">
          {current?.title ?? "No tracks yet"}
        </p>
      </div>
    </>
  );
}
