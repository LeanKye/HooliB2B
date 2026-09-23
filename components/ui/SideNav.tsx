"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/content";
import { scrollToId } from "@/components/providers/SmoothScroll";

/** Задаётся при сборке для GitHub Pages (см. next.config.ts). Локально пустой. */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

/**
 * Навигация. На десктопе — столбик «liquid glass» капсул слева с подписями.
 * На телефоне — плашка «где я» со списком разделов плюс компактный столбик
 * точек, который показывает прогресс по странице.
 *
 * Подписи на телефоне больше не прячем: по одним точкам невозможно понять,
 * где ты находишься и куда попадёшь, нажав на точку.
 */
export default function SideNav() {
  const pathname = usePathname();
  // На GitHub Pages сайт живёт в подкаталоге (/HooliB2B), и `usePathname()`
  // может вернуть путь как с basePath, так и без него — нормализуем оба случая,
  // чтобы навигация показывалась только на главной.
  const raw = pathname ?? "/";
  const clean = basePath && raw.startsWith(basePath) ? raw.slice(basePath.length) || "/" : raw;
  const isHome = clean === "/" || clean === "";
  const [active, setActive] = useState(navItems[0].id);
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const runnerRef = useRef<HTMLSpanElement>(null);

  // Скролл-спай: определяем секцию у верхней трети экрана
  useEffect(() => {
    if (!isHome) return;
    let raf = 0;
    const compute = () => {
      raf = 0;
      const line = window.innerHeight * 0.34;
      let current = navItems[0].id;
      for (const it of navItems) {
        const el = document.getElementById(it.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - line <= 0) current = it.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isHome]);

  // Двигаем «бегунок» к активной кнопке (элемент есть только в десктопном столбике)
  useEffect(() => {
    const list = listRef.current;
    const runner = runnerRef.current;
    if (!list || !runner) return;
    const el = list.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!el) return;
    const center = el.offsetTop + el.offsetHeight / 2;
    runner.style.transform = `translateY(${center}px) translateY(-50%)`;
  }, [active]);

  // Мобильный список разделов закрывается по Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  if (!isHome) return null;

  const activeLabel = navItems.find((n) => n.id === active)?.label ?? navItems[0].label;

  return (
    <>
      {/* ===================== Мобильная навигация ===================== */}
      {/*
        Плашка «где я». Текущий раздел всегда написан словами, а по нажатию
        открывается список всех разделов. Стоит слева сверху — зеркально
        кнопке переключения темы справа сверху, и не мешает контенту.
      */}
      <div className="fixed left-4 top-4 z-50 sm:left-6 sm:top-6 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={`Разделы страницы. Текущий: ${activeLabel}`}
          className="glass-nav flex h-11 items-center gap-2 rounded-full pl-3.5 pr-3 text-[0.8rem] font-medium"
        >
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "linear-gradient(120deg, var(--glow-1), var(--glow-3))" }}
          />
          {activeLabel}
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className={`h-3.5 w-3.5 text-[var(--muted)] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
      {/* Затемнение: первый тап по странице просто закрывает список. */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-[rgba(4,6,12,0.45)] transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Список разделов с подписями */}
      <div
        id="mobile-nav"
        className={`fixed left-4 top-[4.25rem] z-50 w-[11.5rem] origin-top-left transition-all duration-300 sm:left-6 sm:top-[5.25rem] lg:hidden ${
          open ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"
        }`}
      >
        <ul className="glass-strong flex flex-col gap-0.5 rounded-3xl p-1.5">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => go(item.id)}
                  aria-current={isActive ? "true" : undefined}
                  className="flex h-11 w-full items-center gap-3 rounded-2xl px-3 text-left text-[0.86rem] font-medium transition-colors duration-200"
                  style={
                    isActive
                      ? { background: "color-mix(in oklab, var(--glow-2) 20%, transparent)", color: "var(--fg)" }
                      : { color: "var(--muted)" }
                  }
                >
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{
                      background: isActive
                        ? "linear-gradient(120deg, var(--glow-1), var(--glow-3))"
                        : "color-mix(in oklab, var(--fg) 30%, transparent)",
                    }}
                  />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {/*
        Столбик точек остаётся — он показывает, где мы находимся на странице.
        Зона нажатия выросла с 32×32 до 28×40 px (по пальцу попадать проще),
        активная точка подсвечивается и становится крупнее.
      */}
      <nav aria-label="Разделы страницы" className="fixed left-1 top-1/2 z-40 -translate-y-1/2 lg:hidden">
        <div className="glass-nav flex flex-col items-center gap-0.5 rounded-full px-1.5 py-2">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item.id)}
                aria-label={item.label}
                aria-current={isActive ? "true" : undefined}
                className="flex h-10 w-7 items-center justify-center"
              >
                <span
                  aria-hidden
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: isActive ? 9 : 6,
                    height: isActive ? 9 : 6,
                    background: isActive
                      ? "linear-gradient(120deg, var(--glow-1), var(--glow-3))"
                      : "color-mix(in oklab, var(--fg) 32%, transparent)",
                    boxShadow: isActive
                      ? "0 0 12px 1px color-mix(in oklab, var(--glow-2) 65%, transparent)"
                      : "none",
                  }}
                />
              </button>
            );
          })}
        </div>
      </nav>

      {/* ===================== Десктопная навигация (как была) ===================== */}
      <nav
        aria-label="Навигация по разделам"
        className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
      >
        <div ref={listRef} className="relative flex flex-col gap-2">
          {/* светящийся бегунок */}
          <span
            ref={runnerRef}
            aria-hidden
            className="pointer-events-none absolute -left-2.5 top-0 h-7 w-[3px] rounded-full bg-gradient-to-b from-[var(--glow-1)] via-[var(--glow-2)] to-[var(--glow-3)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ boxShadow: "0 0 14px 2px color-mix(in oklab, var(--glow-2) 70%, transparent)" }}
          />
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                data-id={item.id}
                data-active={isActive}
                onClick={() => go(item.id)}
                aria-label={item.label}
                aria-current={isActive ? "true" : undefined}
                className="glass-nav flex h-11 w-[9.5rem] items-center gap-3 rounded-full px-4 text-[var(--muted)] transition-transform duration-300 hover:translate-x-1.5"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full transition-colors duration-300"
                  style={{
                    background: isActive
                      ? "linear-gradient(120deg, var(--glow-1), var(--glow-3))"
                      : "color-mix(in oklab, var(--fg) 30%, transparent)",
                  }}
                />
                <span
                  className="text-[0.82rem] font-medium tracking-tight"
                  style={{ color: isActive ? "var(--fg)" : "var(--muted)" }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
