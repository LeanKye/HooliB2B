"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/content";
import { scrollToId } from "@/components/providers/SmoothScroll";

/** Задаётся при сборке для GitHub Pages (см. next.config.ts). Локально пустой. */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

/**
 * На какой «дистанции» (в разделах) гаснет соседняя подпись. 1.15 — подпись
 * живёт, пока раздел не отъехал на 1.15 раздела от линии чтения.
 */
const FADE_SPAN = 1.15;

/** Масштаб точки-маркера: в покое и на пике близости. */
const DOT_MIN = 0.72;
const DOT_MAX = 1.27;

/**
 * Навигация.
 *
 * Десктоп (≥ lg) — прежний столбик «liquid glass» капсул с подписями слева.
 *
 * Телефон и планшет (< lg) — три части:
 *
 *   1. Компактная плашка «где я» слева сверху: текущий раздел написан словами,
 *      по нажатию открывается список всех разделов. Так нужный раздел находится
 *      даже при первом заходе, когда структура страницы ещё неизвестна.
 *
 *   2. Столбик точек слева по центру — прогресс по странице. Любая точка ведёт
 *      в свой раздел. Пока идёт прокрутка, рядом с точками проявляются подписи,
 *      и они «перетекают» друг в друга: чем ближе раздел к линии чтения, тем
 *      крупнее и ярче его название, тем мельче и прозрачнее соседние. Через
 *      секунду после остановки подписи гаснут — при чтении лента не мешает.
 *
 *   3. Нижний лист (bottom sheet) со всеми разделами и отметкой «сейчас» —
 *      удобно дотянуться большим пальцем.
 *
 * Ширина столбика подобрана под левый отступ секций (pl-12 = 48px): бокс
 * заканчивается на ~42px, поэтому колонка текста не «съедается» ни на пиксель.
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
  // Подписи у столбика точек показываются только пока идёт прокрутка.
  const [awake, setAwake] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const runnerRef = useRef<HTMLSpanElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const wakeTimer = useRef(0);

  /** Разбудить подписи столбика; погаснут через `ms` без новых прокруток. */
  const wake = useCallback((ms = 900) => {
    setAwake(true);
    window.clearTimeout(wakeTimer.current);
    wakeTimer.current = window.setTimeout(() => setAwake(false), ms);
  }, []);

  useEffect(() => () => window.clearTimeout(wakeTimer.current), []);

  /**
   * Скролл-спай + непрерывная «позиция чтения». Считаем один раз на кадр.
   *
   * `p` — дробный номер раздела у линии чтения (0 — герой, 2.4 — середина между
   * третьим и четвёртым разделом). Из него получаем и активный раздел (для плашки
   * и списка), и вес каждой подписи в столбике — отсюда плавное «перетекание».
   */
  useEffect(() => {
    if (!isHome) return;
    let raf = 0;
    const weights = new Array<number>(navItems.length).fill(-1);

    const compute = () => {
      raf = 0;
      const scrollY = window.scrollY;
      const line = window.innerHeight * 0.34;
      const isMobile = window.innerWidth < 1024;

      const tops: (number | null)[] = [];
      for (const it of navItems) {
        const el = document.getElementById(it.id);
        tops.push(el ? el.getBoundingClientRect().top + scrollY - line : null);
      }

      let pos = 0;
      for (let i = 0; i < tops.length; i++) {
        const t = tops[i];
        if (t !== null && scrollY >= t) pos = i;
      }
      /*
       * frac — насколько мы «подошли» к следующему разделу, 0..1. Отсчёт в
       * пикселях, а не в долях раздела: разделы очень разной высоты, и переход
       * должен занимать одинаковые ~0.85 экрана, а не всю предыдущую секцию.
       */
      const next = tops[pos + 1];
      const look = window.innerHeight * 0.85;
      let frac = 0;
      if (next !== null) {
        frac = Math.min(1, Math.max(0, 1 - (next - scrollY) / Math.max(1, look)));
      }

      // Активным считаем тот раздел, чья подпись на рельсе крупнее: при frac
      // от 0.5 «на подходе» следующая весит больше текущей, а при frac = 1
      // позиция перескакивает на него — без скачка, веса в этот момент равны.
      const idx = frac >= 0.5 && pos + 1 < navItems.length ? pos + 1 : pos;
      const id = navItems[idx].id;
      setActive((prev) => (prev === id ? prev : id));

      if (!isMobile) return;

      const p = pos + frac;
      for (let i = 0; i < navItems.length; i++) {
        const w = Math.max(0, Math.min(1, 1 - Math.abs(i - p) / FADE_SPAN));
        if (Math.abs(w - weights[i]) < 0.004) continue;
        weights[i] = w;

        const dot = dotRefs.current[i];
        if (dot) dot.style.transform = `scale(${(DOT_MIN + (DOT_MAX - DOT_MIN) * w).toFixed(3)})`;

        const label = labelRefs.current[i];
        if (label) {
          // Прозрачность в квадрате: подпись «на подходе» почти невидима, но
          // вспыхивает ровно тогда, когда раздел встаёт на линию чтения.
          label.style.opacity = (w * w).toFixed(3);
          label.style.transform = `translateY(-50%) scale(${(0.82 + 0.18 * w).toFixed(3)})`;
        }
      }
    };

    const onScroll = () => {
      wake();
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
  }, [isHome, wake]);

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
      {/* ===================== Плашка «где я» (телефон и планшет) ===================== */}
      <div className="fixed left-4 top-[calc(var(--safe-top)+1rem)] z-50 sm:left-6 lg:hidden">
        <button
          type="button"
          data-nav-pill
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={`Разделы страницы. Текущий: ${activeLabel}`}
          className="glass-nav flex h-10 items-center gap-2 rounded-full pl-3.5 pr-3 text-[0.8rem] font-medium"
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
      {/* ===================== Нижний лист со всеми разделами ===================== */}
      <div className={`fixed inset-0 z-[60] lg:hidden ${open ? "" : "pointer-events-none"}`}>
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          // Пока лист открыт, жесты по затемнению не должны прокручивать страницу.
          style={{ touchAction: "none" }}
          className={`absolute inset-0 bg-[rgba(4,6,12,0.5)] transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Разделы страницы"
          inert={!open}
          style={{ paddingBottom: "calc(var(--safe-bottom) + 0.6rem)" }}
          className={`glass-strong absolute inset-x-0 bottom-0 rounded-t-[1.75rem] px-3 pt-2.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div
            aria-hidden
            className="mx-auto mb-2.5 h-1 w-10 rounded-full bg-[color-mix(in_oklab,var(--fg)_20%,transparent)]"
          />
          <ul className="grid gap-1">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => go(item.id)}
                    aria-current={isActive ? "true" : undefined}
                    className="flex h-12 w-full items-center gap-3 rounded-2xl px-3.5 text-left text-[0.95rem] font-medium transition-colors duration-200"
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
                    {isActive && (
                      <span className="ml-auto text-[0.68rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                        сейчас
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {/* ===================== Столбик точек с перетекающими подписями ===================== */}
      <nav
        aria-label="Разделы страницы"
        // Прикосновение к рельсу — тоже повод показать названия: человек,
        // который не понял, что это навигация, сразу увидит подписи.
        onPointerDown={() => wake(2600)}
        className="fixed left-1.5 top-1/2 z-40 -translate-y-1/2 lg:hidden"
      >
        <ul className="glass-nav flex flex-col items-center gap-0.5 rounded-full px-1.5 py-2">
          {navItems.map((item, idx) => {
            const isActive = active === item.id;
            return (
              <li key={item.id} className="relative">
                <button
                  type="button"
                  onClick={() => go(item.id)}
                  aria-label={item.label}
                  aria-current={isActive ? "true" : undefined}
                  className="flex h-9 w-6 items-center justify-center"
                >
                  <span
                    aria-hidden
                    ref={(el) => {
                      dotRefs.current[idx] = el;
                    }}
                    className="block h-[7px] w-[7px] rounded-full"
                    style={{
                      transform: `scale(${DOT_MIN})`,
                      background: isActive
                        ? "linear-gradient(120deg, var(--glow-1), var(--glow-3))"
                        : "color-mix(in oklab, var(--fg) 32%, transparent)",
                      boxShadow: isActive
                        ? "0 0 12px 1px color-mix(in oklab, var(--glow-2) 65%, transparent)"
                        : "none",
                      transition: "background 300ms ease, box-shadow 300ms ease",
                    }}
                  />
                </button>
                {/*
                  Подпись позиционируется абсолютно, поэтому не расширяет столбик
                  и не заезжает на колонку текста. Прозрачность внешнего слоя —
                  «проснулись/уснули» (CSS-переход), внутреннего — близость раздела
                  (переписывается каждый кадр без перехода, чтобы не отставать).
                */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute left-[calc(100%+0.4rem)] top-1/2 transition-opacity duration-300 ${
                    awake ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span
                    ref={(el) => {
                      labelRefs.current[idx] = el;
                    }}
                    className="pill block origin-left whitespace-nowrap rounded-full border border-[var(--border)] px-3 py-1.5 text-[0.82rem] font-medium transition-none"
                    style={{ opacity: 0, transform: "translateY(-50%) scale(0.82)" }}
                  >
                    {item.label}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
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