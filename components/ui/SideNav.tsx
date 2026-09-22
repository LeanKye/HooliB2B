"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/content";
import { scrollToId } from "@/components/providers/SmoothScroll";

/** Задаётся при сборке для GitHub Pages (см. next.config.ts). Локально пустой. */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

/**
 * Нестандартная навигация: вертикальный столбик полупрозрачных «liquid glass»
 * капсул слева. Активный раздел подсвечивается, а светящийся «бегунок»
 * плавно перетекает между кнопками при скролле.
 */
export default function SideNav() {
  const pathname = usePathname();
  // На GitHub Pages сайт живёт в подкаталоге (/HooliB2B), и `usePathname()`
  // может вернуть путь как с basePath, так и без него — нормализуем оба случая,
  // чтобы столбик навигации показывался только на главной.
  const raw = pathname ?? "/";
  const clean = basePath && raw.startsWith(basePath) ? raw.slice(basePath.length) || "/" : raw;
  const isHome = clean === "/" || clean === "";
  const [active, setActive] = useState(navItems[0].id);
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

  // Двигаем «бегунок» к активной кнопке
  useEffect(() => {
    const list = listRef.current;
    const runner = runnerRef.current;
    if (!list || !runner) return;
    const el = list.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!el) return;
    const center = el.offsetTop + el.offsetHeight / 2;
    runner.style.transform = `translateY(${center}px) translateY(-50%)`;
  }, [active]);

  const go = (id: string) => scrollToId(id);

  if (!isHome) return null;

  return (
    <nav
      aria-label="Навигация по разделам"
      className="fixed left-1 top-1/2 z-40 -translate-y-1/2 lg:left-5"
    >
      <div ref={listRef} className="relative flex flex-col gap-1.5 lg:gap-2">
        {/* светящийся бегунок */}
        <span
          ref={runnerRef}
          aria-hidden
          className="pointer-events-none absolute -left-1 top-0 h-5 w-[3px] rounded-full bg-gradient-to-b from-[var(--glow-1)] via-[var(--glow-2)] to-[var(--glow-3)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:-left-2.5 lg:h-7"
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
              title={item.label}
              className="glass-nav flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted)] transition-transform duration-300 hover:scale-[1.06] lg:h-11 lg:w-[9.5rem] lg:justify-start lg:gap-3 lg:px-4 lg:hover:translate-x-1.5"
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 lg:h-2 lg:w-2"
                style={{
                  background: isActive
                    ? "linear-gradient(120deg, var(--glow-1), var(--glow-3))"
                    : "color-mix(in oklab, var(--fg) 30%, transparent)",
                }}
              />
              <span
                className="hidden text-[0.82rem] font-medium tracking-tight lg:block"
                style={{ color: isActive ? "var(--fg)" : "var(--muted)" }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
