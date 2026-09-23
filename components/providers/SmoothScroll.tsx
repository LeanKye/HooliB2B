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
  /*
   * Отступ считаем числом, а не константой: сверху на телефоне висит плашка
   * «где я» (её низ и берём за ориентир) плюс вырез камеры. Раньше отступ был
   * жёстко 76px и после подключения viewport-fit=cover заголовок раздела
   * оказался бы под вырезом.
   */
  const pill = document.querySelector<HTMLElement>("[data-nav-pill]");
  const offset = isCoarse() ? (pill ? pill.getBoundingClientRect().bottom + 16 : 76) : 24;
  const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset);
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) {
    lenis.scrollTo(y, { duration: 1.2 });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
}
