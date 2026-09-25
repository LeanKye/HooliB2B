"use client";

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
