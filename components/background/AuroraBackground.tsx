"use client";

import { useEffect, useRef } from "react";

type P = { x: number; y: number; vx: number; vy: number; r: number; h: number };

/**
 * Пятна авроры. Раньше это были круги с filter: blur(110–130px) — самый дорогой
 * элемент кадра на мобильном GPU: слой 700+ пикселей размывался заново на каждом
 * шаге бесконечной анимации. Теперь мягкость даёт многоступенчатый градиент
 * (.aurora-blob), а параллакс вынесен на внешний слой — раньше его перебивал
 * transform из @keyframes floaty, то есть реакция на курсор не работала вовсе.
 */
const BLOBS = [
  { pos: "-left-40 -top-40 h-[46rem] w-[46rem]", color: "var(--glow-1)", at: "30% 30%", opacity: 0.75, dx: 90, dy: 70 },
  { pos: "-right-40 top-10 h-[40rem] w-[40rem]", color: "var(--glow-3)", at: "60% 40%", opacity: 0.7, dx: -110, dy: 90 },
  { pos: "-bottom-56 left-1/4 h-[44rem] w-[44rem]", color: "var(--glow-2)", at: "50% 50%", opacity: 0.7, dx: 70, dy: -80 },
  { pos: "-bottom-40 right-1/4 h-[34rem] w-[34rem]", color: "var(--glow-4)", at: "50% 50%", opacity: 0.6, dx: -60, dy: -60 },
];

/** Сдвиг пятна от курсора. --px/--py обнуляются на тач-устройствах (см. globals.css). */
const parallax = (dx: number, dy: number) =>
  `translate3d(calc((var(--mx, 0.5) - 0.5) * var(--px, 1) * ${dx}px), calc((var(--my, 0.5) - 0.5) * var(--py, 1) * ${dy}px), 0)`;

/**
 * Живой фон: аврора-пятна (реагируют на курсор через CSS-переменные) +
 * лёгкий canvas со «светлячками», которые разлетаются от курсора.
 *
 * На тач-устройствах считаем дешевле: canvas в 1x вместо 2x, 30 кадров вместо 60
 * и полная остановка отрисовки на время скролла — чтобы не грелся корпус.
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
    // Телефон/планшет: считаем дешевле и не тратим батарею на постоянную анимацию.
    const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;

    let w = 0;
    let h = 0;
    let mx = 0.5;
    let my = 0.5;
    let tx = 0.5;
    let ty = 0.5;
    let px = -9999;
    let py = -9999;
    let writtenX = "";
    let writtenY = "";

    const particles: P[] = [];

    const build = () => {
      // На iPhone это вчетверо меньше пикселей на кадр: 1x вместо 2x.
      const dpr = coarse ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = coarse ? (w < 640 ? 16 : 30) : w < 640 ? 26 : w < 1100 ? 46 : 74;
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

    const draw = () => {
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
    };

    const step = 1000 / (coarse ? 30 : 60) - 1;
    let raf = 0;
    let last = 0;
    let visible = true;
    let scrolling = false;
    let scrollTimer = 0;
    let resizeTimer = 0;

    const frame = (t: number) => {
      raf = 0;
      // Пока идёт скролл или вкладка скрыта — фон замирает: весь бюджет кадра
      // достаётся прокрутке. Частицы ползут ~13 px/с, так что это незаметно.
      if (!visible || scrolling) return;
      if (t - last < step) {
        raf = requestAnimationFrame(frame);
        return;
      }
      last = t;

      if (!coarse) {
        tx += (mx - tx) * 0.06;
        ty += (my - ty) * 0.06;
        const nx = tx.toFixed(4);
        const ny = ty.toFixed(4);
        // Пишем переменные только при реальном изменении: setProperty на <html>
        // инвалидирует стили всего документа, и делать это каждый кадр нельзя.
        if (nx !== writtenX || ny !== writtenY) {
          writtenX = nx;
          writtenY = ny;
          const root = document.documentElement.style;
          root.setProperty("--mx", nx);
          root.setProperty("--my", ny);
        }
      }

      draw();
      raf = requestAnimationFrame(frame);
    };

    const onVis = () => {
      visible = !document.hidden;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    };

    const onScroll = () => {
      scrolling = true;
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        scrolling = false;
        if (!raf && visible) raf = requestAnimationFrame(frame);
      }, 140);
    };

    // Пересобираем частицы не на каждый resize (поворот экрана сыпет событиями),
    // а один раз после того, как размер устоялся.
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 160);
    };

    build();
    window.addEventListener("resize", onResize);

    if (reduce) {
      // Пользователь просил меньше движения — рисуем один статичный кадр.
      draw();
    } else {
      if (coarse) {
        window.addEventListener("scroll", onScroll, { passive: true });
      } else {
        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerleave", onLeave);
      }
      document.addEventListener("visibilitychange", onVis);
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(scrollTimer);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
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
      {BLOBS.map((b, i) => (
        // Внешний слой — параллакс от курсора, внутренний — «дыхание» (floaty).
        // Раньше оба transform жили на одном элементе, и анимация перебивала
        // инлайновый сдвиг, поэтому фон за курсором не следовал.
        <div key={b.color} className={`absolute ${b.pos}`} style={{ transform: parallax(b.dx, b.dy) }}>
          <div
            className="aurora-blob animate-floaty h-full w-full"
            style={
              {
                "--blob": b.color,
                "--blob-at": b.at,
                opacity: b.opacity,
                animationDelay: `${-2 * i}s`,
              } as React.CSSProperties
            }
          />
        </div>
      ))}
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

