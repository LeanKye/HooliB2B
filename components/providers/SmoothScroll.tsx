"use client";

import { useEffect, useState } from "react";
import { MotionConfig } from "motion/react";

/**
 * Плавный скролл — нативный, без сторонних библиотек.
 *
 * Раньше здесь стоял Lenis: он перехватывал колесо и двигал `scrollTop` из
 * requestAnimationFrame. Это означало, что скролл выполнялся на main thread,
 * а не композитором, и на ProMotion (120 Гц, бюджет кадра 8.3 мс) страница
 * просаживалась до 60 — плюс лишние ~3 КБ и свой цикл кадра. Нативный скролл
 * на трекпаде и так плавный, а `scroll-behavior: smooth` в CSS намеренно не
 * ставим: он конфликтует с Lenis (которого больше нет) и давал рывки.
 *
 * Осталось только `MotionConfig`: он нужен, чтобы motion-анимации (смена слова
 * в герое, пружина барабана в навигации) уважали prefers-reduced-motion.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Плавный скролл к секции по id — используется навигацией и кнопками. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  /*
   * Отступ задаёт сам `scroll-mt-24` на секции (96 px) — этого хватает и под
   * плашку «где я» на телефоне, и под десктопную навигацию. Раньше offset
   * считался вручную, потому что Lenis понимает только координаты.
   */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

/**
 * Устройство без курсора — по нему решаем, можно ли анимировать дорогие эффекты.
 *
 * Нужен там, где CSS-медиазапрос не достаёт: `filter: blur()` в анимациях motion
 * задаётся инлайном, и мобильное правило `.reveal { filter: none }` на него не
 * действует. Blur перерисовывает текст на каждом кадре — на телефоне от этого
 * «дрожат» цифры в первом экране.
 */
export function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    setCoarse(mq.matches);
    const onChange = () => setCoarse(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return coarse;
}
