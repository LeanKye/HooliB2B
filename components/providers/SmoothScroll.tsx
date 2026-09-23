"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { MotionConfig } from "motion/react";

/** Телефон или планшет — устройство без курсора. */
function isCoarse() {
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

/**
 * Плавный анимированный скролл (Lenis, ~3 КБ).
 *
 * Включаем его только там, где есть колесо или трекпад. На тач-устройствах Lenis
 * бесполезен — тач-скролл он не перехватывает (syncTouch по умолчанию выключен),
 * зато держит постоянный rAF-цикл и переопределяет scroll-behavior, из-за чего
 * прокрутка на Android ощущалась рваной. Там отдаём скролл браузеру.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || isCoarse()) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Прокидываем экземпляр наружу, чтобы кнопки навигации умели плавно скроллить.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Плавный скролл к секции по id — используется навигацией. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  // Считаем позицию сами (числом) — так поведение одинаково во всех браузерах.
  // На телефоне отступ больше: сверху висит плашка с названием раздела.
  const offset = isCoarse() ? 76 : 24;
  const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset);
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) {
    lenis.scrollTo(y, { duration: 1.2 });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
}
