"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { MotionConfig } from "motion/react";

/**
 * Плавный анимированный скролл (Lenis, ~3 КБ).
 * Отключается, если пользователь просит уменьшить анимацию.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
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
  const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY - 24);
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) {
    lenis.scrollTo(y, { duration: 1.2 });
  } else {
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}
