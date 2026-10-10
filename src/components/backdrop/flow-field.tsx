"use client";

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; px: number; py: number; life: number; speed: number };
type Ripple = { x: number; y: number; r: number; a: number; v: number };

/** Half-resolution canvas: a quarter of the pixels to fade and composite, and softer streaks. */
const SCALE = 0.5;
const FRAME_MS = 1000 / 30;

/** Cheap pseudo-noise: a flow direction from a few drifting sine waves. */
function flowAngle(x: number, y: number, t: number) {
  return (
    (Math.sin(x * 0.0032 + t * 0.15) + Math.cos(y * 0.004 - t * 0.11) + Math.sin((x + y) * 0.0021 + t * 0.07)) * 1.3
  );
}

/**
 * Faint currents drifting across the page, with a swirl around the pointer and a ripple on click.
 * Cheap on purpose: 30 fps, a few hundred particles drawn as one path per frame, half-resolution canvas,
 * paused while the tab is hidden, and a single still frame for reduced-motion visitors.
 */
export function FlowField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dark = window.matchMedia("(prefers-color-scheme: dark)");
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let ripples: Ripple[] = [];
    let raf = 0;
    let last = 0;
    let time = 0;
    let rgb = "124,197,159";
    // `target` is where the pointer is; the whirlwind eases toward it, so it trails and sweeps rather than snaps.
    const target = { x: -9999, y: -9999, active: false };
    const wind = { x: -9999, y: -9999, dx: 0, dy: 0, power: 0 };
    const RADIUS = 240;

    const readColor = () => {
      const hex = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim().replace("#", "");
      if (hex.length === 6) rgb = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(",");
    };

    const spawn = (p: Particle, forceNear = false) => {
      // While the whirlwind is up, a share of new particles appear around it so it stays populated.
      if (wind.power > 0.2 && (forceNear || Math.random() < 0.6)) {
        const a = Math.random() * Math.PI * 2;
        const d = RADIUS * (0.3 + Math.random() * 0.8);
        p.x = p.px = wind.x + Math.cos(a) * d;
        p.y = p.py = wind.y + Math.sin(a) * d;
      } else {
        p.x = p.px = Math.random() * width;
        p.y = p.py = Math.random() * height;
      }
      p.life = 60 + Math.random() * 140;
      p.speed = 0.7 + Math.random() * 0.9;
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * SCALE);
      canvas.height = Math.round(height * SCALE);
      ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
      const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4;
      const count = Math.min(220, Math.round((width * height) / (lowPower ? 14000 : 9000)));
      particles = Array.from({ length: count }, () => {
        const p = { x: 0, y: 0, px: 0, py: 0, life: 0, speed: 0 };
        spawn(p);
        return p;
      });
    };

    const step = (animate: boolean) => {
      // Fade what is already drawn so each streak leaves a short tail.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.07)";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      const follow = target.active ? 0.2 : 0;
      wind.dx = (target.x - wind.x) * follow;
      wind.dy = (target.y - wind.y) * follow;
      wind.x += wind.dx;
      wind.y += wind.dy;
      wind.power += ((target.active ? 1 : 0) - wind.power) * 0.08;

      // Recruit a few particles into the whirlwind each frame so it reads as a distinct vortex.
      if (wind.power > 0.3) for (let i = 0; i < 5; i++) spawn(particles[(Math.random() * particles.length) | 0], true);

      const alpha = dark.matches ? 0.55 : 0.8;
      ctx.strokeStyle = `rgba(${rgb},${alpha})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      const near = new Path2D();
      for (const p of particles) {
        const angle = flowAngle(p.x, p.y, time);
        let vx = Math.cos(angle) * p.speed;
        let vy = Math.sin(angle) * p.speed;
        const dx = p.x - wind.x;
        const dy = p.y - wind.y;
        const d2 = dx * dx + dy * dy;
        if (wind.power > 0.01 && d2 < RADIUS * RADIUS) {
          // Spin around the cursor, drawn slightly inward, and dragged along as it moves.
          const d = Math.sqrt(d2) || 1;
          const k = (1 - d / RADIUS) ** 1.5 * wind.power;
          vx += (-dy / d) * k * 4.2 - (dx / d) * k * 1.2 + wind.dx * k * 0.35;
          vy += (dx / d) * k * 4.2 - (dy / d) * k * 1.2 + wind.dy * k * 0.35;
        }
        p.px = p.x;
        p.py = p.y;
        p.x += vx;
        p.y += vy;
        const inWind = wind.power > 0.01 && d2 < RADIUS * RADIUS;
        const path = inWind ? near : null;
        if (path) {
          path.moveTo(p.px, p.py);
          path.lineTo(p.x, p.y);
        } else {
          ctx.moveTo(p.px, p.py);
          ctx.lineTo(p.x, p.y);
        }
        if (--p.life <= 0 || p.x < -10 || p.y < -10 || p.x > width + 10 || p.y > height + 10) spawn(p);
      }
      ctx.stroke();
      ctx.strokeStyle = `rgba(${rgb},${Math.min(1, alpha * 1.7)})`;
      ctx.lineWidth = 2.2;
      ctx.stroke(near);

      for (const ripple of ripples) {
        ctx.strokeStyle = `rgba(${rgb},${ripple.a})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.r, 0, Math.PI * 2);
        ctx.stroke();
        ripple.r += ripple.v;
        ripple.a -= 0.012;
      }
      ripples = ripples.filter((ripple) => ripple.a > 0);
      if (animate) time += 0.02;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < FRAME_MS) return;
      last = now;
      step(true);
    };
    const start = () => {
      if (!raf && !reduceMotion.matches && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const draw = () => {
      resize();
      readColor();
      // Pre-draw some history so the field never starts empty (and so the still frame has streaks).
      for (let i = 0; i < 70; i++) step(true);
    };

    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(draw, 150);
    };
    const onMove = (event: PointerEvent) => {
      if (!target.active && wind.power < 0.05) {
        wind.x = event.clientX;
        wind.y = event.clientY;
      }
      target.x = event.clientX;
      target.y = event.clientY;
      target.active = true;
    };
    const onLeave = () => {
      target.active = false;
    };
    const onDown = (event: PointerEvent) => {
      if (reduceMotion.matches) return;
      ripples.push(
        { x: event.clientX, y: event.clientY, r: 4, a: 0.5, v: 3.2 },
        { x: event.clientX, y: event.clientY, r: 2, a: 0.3, v: 1.8 },
      );
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onPreference = () => {
      stop();
      draw();
      start();
    };

    draw();
    start();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    document.documentElement.addEventListener("pointerleave", onLeave);
    reduceMotion.addEventListener("change", onPreference);
    dark.addEventListener("change", onPreference);
    return () => {
      stop();
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVisibility);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      reduceMotion.removeEventListener("change", onPreference);
      dark.removeEventListener("change", onPreference);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="backdrop-flow pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
