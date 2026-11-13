"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { DeskData } from "@/components/desk/desk-content";
import { OsScreen, type OsControl } from "@/components/desk/os-screen";
import { site } from "@/data/site";
import { COMPACT_QUERY, createEngine, type Engine } from "./engine";

function useMedia(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const m = matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => matchMedia(query).matches,
    () => false,
  );
}

const pill =
  "pointer-events-auto inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/**
 * The whole portfolio: a 3D desk you can look around and sit down at. The plain page
 * stays in the HTML underneath and takes over if WebGL is unavailable or the visitor asks.
 */
export function Experience(props: DeskData) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const osRef = useRef<HTMLDivElement>(null);
  const control = useRef<OsControl>(null);
  const engine = useRef<Engine>(null);
  const windowCount = useRef(0);
  const tip = useRef<HTMLDivElement>(null);

  const [plain, setPlain] = useState(false);
  const [ready, setReady] = useState(false);
  const [state, setState] = useState({ zoomed: false, live: false });
  const systemDark = useMedia("(prefers-color-scheme: dark)");
  const [nightPick, setNightPick] = useState<boolean>();
  const night = nightPick ?? systemDark;
  const compact = useMedia(COMPACT_QUERY);
  const reduceMotion = useMedia("(prefers-reduced-motion: reduce)");
  const nightRef = useRef(night);
  useEffect(() => {
    nightRef.current = night;
  }, [night]);

  useEffect(() => {
    if (plain || !canvasRef.current || !osRef.current) return;
    let e: Engine;
    try {
      e = createEngine({
        canvas: canvasRef.current,
        os: osRef.current,
        projects: props.projects.map((p) => ({ slug: p.slug, title: p.shortTitle ?? p.title, heroUrl: p.hero?.src.src })),
        night: nightRef.current,
        reduceMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
        onState: setState,
        onReady: () => setReady(true),
        onAction: (a) => {
          if (a.type === "project") control.current?.open(`project:${a.slug}`);
          if (a.type === "terminal") control.current?.open("terminal");
          if (a.type === "contact") control.current?.open("contact");
        },
        onHover: (label, x, y) => {
          const el = tip.current;
          if (!el) return;
          el.hidden = !label;
          if (label) {
            el.textContent = label;
            el.style.transform = `translate(${Math.min(x + 14, window.innerWidth - 260)}px, ${y + 18}px)`;
          }
        },
      });
    } catch (err) {
      console.warn("3D desk unavailable, showing the plain page instead:", err);
      return; // The plain page stays.
    }
    engine.current = e;
    document.documentElement.classList.add("scene3d");
    return () => {
      document.documentElement.classList.remove("scene3d");
      e.dispose();
      engine.current = null;
      setReady(false);
    };
    // The scene is built once per mode switch; its data does not change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plain]);

  useEffect(() => engine.current?.setNight(night), [night]);

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key !== "Escape") return;
      if (windowCount.current > 0) control.current?.closeTop();
      else engine.current?.setZoom(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (plain)
    return (
      <button type="button" className={`${pill} fixed right-4 bottom-4 z-50`} onClick={() => setPlain(false)}>
        Open the 3D desk
      </button>
    );

  return (
    <div data-scene className="scene-root fixed inset-0 z-50 overflow-hidden bg-[#07080c]">
      <canvas ref={canvasRef} className="block h-full w-full touch-none" aria-label="A desk with an all-in-one computer, lit by a window" />

      <div ref={tip} hidden className="pointer-events-none fixed top-0 left-0 z-40 max-w-60 rounded border border-white/20 bg-black/75 px-2.5 py-1.5 text-xs text-white" role="tooltip" />

      <OsScreen
        {...props}
        elRef={osRef}
        controlRef={control}
        live={state.live}
        ready={ready}
        compact={compact}
        reduceMotion={reduceMotion}
        onWindowCount={(n) => (windowCount.current = n)}
        onExit={() => engine.current?.setZoom(false)}
      />

      <header
        className={`pointer-events-none fixed inset-x-0 top-0 z-30 flex items-start justify-between bg-gradient-to-b from-black/45 to-transparent p-4 pb-10 text-white sm:p-5 sm:pb-10 ${compact && state.zoomed ? "hidden" : ""}`}
      >
        <div className="pointer-events-auto drop-shadow">
          <p className="text-[15px] font-semibold">{site.name}</p>
          <p className="mt-0.5 text-[11px] tracking-[0.16em] uppercase opacity-70">Student developer</p>
        </div>
        <div className="sr-only focus-within:not-sr-only focus-within:pointer-events-auto focus-within:absolute focus-within:top-16 focus-within:left-4 focus-within:flex focus-within:flex-wrap focus-within:gap-2" role="group" aria-label="Quick launch">
          <button type="button" className={pill} onClick={() => engine.current?.setZoom(true)}>
            Sit at the computer
          </button>
          <button type="button" className={pill} onClick={() => (engine.current?.setZoom(true), control.current?.open("terminal"))}>
            Terminal
          </button>
          <button type="button" className={pill} onClick={() => (engine.current?.setZoom(true), control.current?.open("storage"))}>
            Storage Explorer
          </button>
          <button type="button" className={pill} onClick={() => (engine.current?.setZoom(true), control.current?.open("contact"))}>
            Contact
          </button>
          <button type="button" className={pill} onClick={() => engine.current?.toggleLamp()}>
            Desk lamp
          </button>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {state.zoomed ? (
            <button type="button" className={pill} onClick={() => engine.current?.setZoom(false)}>
              ← Back to the desk <kbd className="rounded border border-white/30 px-1.5 text-[10px] opacity-80">Esc</kbd>
            </button>
          ) : null}
          <button
            type="button"
            className={pill}
            aria-label={night ? "Switch the room to day" : "Switch the room to night"}
            onClick={() => setNightPick(!night)}
          >
            {night ? "Day" : "Night"}
          </button>
          <button type="button" className={pill} onClick={() => setPlain(true)}>
            Plain page
          </button>
        </div>
      </header>

      {!state.zoomed && ready ? (
        <p className="pointer-events-none fixed bottom-6 left-1/2 z-30 max-w-[90vw] -translate-x-1/2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-center text-sm text-white backdrop-blur-md">
          <b className="font-semibold">Click or tap the screen</b> to sit down<span className="hidden sm:inline"> · drag to look around</span>
        </p>
      ) : null}

      <div
        aria-hidden={ready}
        className={`pointer-events-none fixed inset-0 z-40 grid place-items-center bg-[#07080c] text-sm text-white/70 transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
      >
        Starting up…
      </div>
    </div>
  );
}
