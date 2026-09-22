"use client";

import { useEffect, useRef } from "react";

type P = { x: number; y: number; vx: number; vy: number; r: number; h: number };

/**
 * Живой фон: аврора-пятна (реагируют на мышь через CSS-переменные) +
 * лёгкий canvas со «светлячками», которые разлетаются от курсора.
 * Уважает prefers-reduced-motion и паузится в неактивной вкладке.
 */
export default function AuroraBackground() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let mx = 0.5;
    let my = 0.5;
    let tx = 0.5;
    let ty = 0.5;
    let px = -9999;
    let py = -9999;

    const particles: P[] = [];

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = w < 640 ? 26 : w < 1100 ? 46 : 74;
      particles.length = 0;
      for (let i = 0; i < target; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.9 + 0.7,
          h: 210 + Math.random() * 110,
        });
      }
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      mx = e.clientX / Math.max(w, 1);
      my = e.clientY / Math.max(h, 1);
    };

    const onLeave = () => {
      px = -9999;
      py = -9999;
    };

    let raf = 0;
    let visible = true;
    const onVis = () => {
      visible = !document.hidden;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    };

    const frame = () => {
      raf = 0;
      tx += (mx - tx) * 0.06;
      ty += (my - ty) * 0.06;
      document.documentElement.style.setProperty("--mx", tx.toFixed(4));
      document.documentElement.style.setProperty("--my", ty.toFixed(4));

      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        if (!reduce) {
          p.x += p.vx;
          p.y += p.vy;
        }
        const dx = p.x - px;
        const dy = p.y - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < 22000 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const force = (1 - d / 148) * 1.9;
          p.x += (dx / d) * force;
          p.y += (dy / d) * force;
        }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        const near = d2 < 22000 ? 1 - Math.sqrt(d2) / 148 : 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + near * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.h}, 90%, ${64 + near * 18}%, ${0.28 + near * 0.5})`;
        ctx.fill();
      }

      if (visible) raf = requestAnimationFrame(frame);
    };

    build();
    window.addEventListener("resize", build);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", build);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% -10%, color-mix(in oklab, var(--glow-1) 16%, transparent), transparent 60%)",
        }}
      />
      <div
        className="animate-floaty absolute -left-40 -top-40 h-[46rem] w-[46rem] rounded-full opacity-60 blur-[110px]"
        style={{
          background: "radial-gradient(circle at 30% 30%, var(--glow-1), transparent 65%)",
          transform: "translate3d(calc(var(--mx, 0.5) * 90px), calc(var(--my, 0.5) * 70px), 0)",
        }}
      />
      <div
        className="animate-floaty absolute -right-40 top-10 h-[40rem] w-[40rem] rounded-full opacity-55 blur-[120px]"
        style={{
          background: "radial-gradient(circle at 60% 40%, var(--glow-3), transparent 65%)",
          animationDelay: "-2s",
          transform: "translate3d(calc(var(--mx, 0.5) * -110px), calc(var(--my, 0.5) * 90px), 0)",
        }}
      />
      <div
        className="animate-floaty absolute -bottom-56 left-1/4 h-[44rem] w-[44rem] rounded-full opacity-55 blur-[130px]"
        style={{
          background: "radial-gradient(circle at 50% 50%, var(--glow-2), transparent 65%)",
          animationDelay: "-4s",
          transform: "translate3d(calc(var(--mx, 0.5) * 70px), calc(var(--my, 0.5) * -80px), 0)",
        }}
      />
      <div
        className="animate-floaty absolute -bottom-40 right-1/4 h-[34rem] w-[34rem] rounded-full opacity-45 blur-[120px]"
        style={{
          background: "radial-gradient(circle at 50% 50%, var(--glow-4), transparent 65%)",
          animationDelay: "-6s",
          transform: "translate3d(calc(var(--mx, 0.5) * -60px), calc(var(--my, 0.5) * -60px), 0)",
        }}
      />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(120% 80% at 50% 0%, #000 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(120% 80% at 50% 0%, #000 30%, transparent 75%)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 50%, transparent 55%, color-mix(in oklab, var(--bg) 75%, transparent))",
        }}
      />
    </div>
  );
}

