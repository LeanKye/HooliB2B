"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/content";
import { scrollToId } from "@/components/providers/SmoothScroll";

/** Задаётся при сборке для GitHub Pages (см. next.config.ts). Локально пустой. */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

/**
 * Высота строки «барабана» с названием раздела. Окно выше самой строки текста:
 * тогда при перекатывании соседнее название успевает показаться и растаять.
 * В окно ровно в строку смена читалась бы как мгновенная подмена слова.
 */
const ROLL_H = 30;

/** Растворение краёв окна: названия входят и уходят «из тумана». */
const ROLL_FADE = "linear-gradient(180deg, transparent 0%, #000 26%, #000 74%, transparent 100%)";

/**
 * Перекатывание на один раздел. Заметно дольше «перелистывания»: название
 * должно успеть прочитаться, а не мелькнуть. При `prefers-reduced-motion`
 * длительность гасит глобальное правило в globals.css, так что барабан
 * просто переставляется без движения.
 */
const ROLL_MS = 460;

/**
 * Навигация.
 *
 * Десктоп (≥ lg) — прежний столбик «liquid glass» капсул с подписями слева.
 *
 * Телефон и планшет (< lg) — две части, и ни одна из них не занимает место,
 * отведённое контенту:
 *
 *   1. Плашка «где я» слева сверху. Название раздела перекатывается в ней
 *      барабаном, как счётчик таймера в iOS: шаг считается по прокрутке
 *      (раздел меняется в тот момент, когда чтение уже перешло к следующему),
 *      а сам барабан доворачивается пружинкой — поэтому смена читается глазом,
 *      а не выглядит подменой. Ширина плашки равна самому длинному названию и
 *      не меняется при перекате: на слове «Партнёры» она не «дышит».
 *      Нажатие открывает список всех разделов.
 *
 *   2. Нижний лист (bottom sheet) со всеми разделами и отметкой «сейчас» —
 *      удобно дотянуться большим пальцем.
 *
 * Столбика точек слева больше нет: он занимал край экрана и дублировал то,
 * что и так видно в плашке. Левый отступ секций уменьшен с 48 до 20 px —
 * он держался именно под ширину столбика.
 */
export default function SideNav() {
  const pathname = usePathname();
  // На GitHub Pages сайт живёт в подкаталоге (/HooliB2B), и `usePathname()`
  // может вернуть путь как с basePath, так и без него — нормализуем оба случая,
  // чтобы навигация показывалась только на главной.
  const raw = pathname ?? "/";
  const clean = basePath && raw.startsWith(basePath) ? raw.slice(basePath.length) || "/" : raw;
  const isHome = clean === "/" || clean === "";

  // Индекс раздела у линии чтения — им поворачивается барабан в плашке.
  const [activeIdx, setActiveIdx] = useState(0);
  const [open, setOpen] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const runnerRef = useRef<HTMLSpanElement>(null);

  /*
   * Раздел и его индекс. Барабан в плашке крутится по индексу, а список
   * разделов и десктопный столбик сравнивают id — держим оба представления
   * рядом, чтобы они не разъехались. Объявлены до эффектов: «бегунок»
   * десктопного столбика зависит от `active`.
   */
  const active = navItems[activeIdx]?.id ?? navItems[0].id;
  const activeLabel = navItems[activeIdx]?.label ?? navItems[0].label;

  /**
   * Скролл-спай + позиция чтения. Считаем один раз на кадр.
   *
   * `pos + frac` — дробный номер раздела у линии чтения (0 — герой, 2.4 —
   * середина между третьим и четвёртым разделом). Из него получаются и
   * активный раздел, и прогресс по странице, поэтому барабан в плашке и
   * полоска прогресса не могут разойтись.
   */
  useEffect(() => {
    if (!isHome) return;
    let raf = 0;
    /**
     * Кэш позиций разделов.
     *
     * В документных координатах они меняются только при смене раскладки, а
     * `getBoundingClientRect` заставляет браузер пересчитать стили и геометрию.
     * Раньше мы читали их на каждом кадре прокрутки — теперь читаем один раз
     * после загрузки, после подгрузки шрифтов и при изменении размера окна.
     */
    let tops: number[] = [];

    const measure = () => {
      const line = window.innerHeight * 0.34;
      const base = window.scrollY;
      tops = navItems.map((item) => {
        const el = document.getElementById(item.id);
        // Отсутствующий раздел — «бесконечность»: он никогда не станет текущим,
        // а `frac` не сможет стать `NaN` (прежняя проверка на `null` пропускала
        // `undefined` за последним разделом и глушила вычисления до перезагрузки).
        return el ? el.getBoundingClientRect().top + base - line : Number.POSITIVE_INFINITY;
      });
    };

    const compute = () => {
      raf = 0;
      const scrollY = window.scrollY;

      let pos = 0;
      for (let i = 0; i < tops.length; i++) {
        if (scrollY >= tops[i]) pos = i;
      }
      /*
       * frac — насколько мы «подошли» к следующему разделу, 0..1. Отсчёт в
       * пикселях, а не в долях раздела: разделы очень разной высоты, и переход
       * должен занимать одинаковые ~0.85 экрана, а не всю предыдущую секцию.
       */
      const next: number | undefined = tops[pos + 1];
      const look = window.innerHeight * 0.85;
      let frac = 0;
      if (next !== undefined && Number.isFinite(next)) {
        frac = Math.min(1, Math.max(0, 1 - (next - scrollY) / Math.max(1, look)));
      }

      /*
       * Барабан поворачивается на середине подхода к следующему разделу —
       * ровно там, где раньше «уравнивались» веса подписей на столбике.
       * Раньше нельзя: человек ещё читает текущий раздел. Позже — он уже
       * читает следующий, а плашка врёт.
       */
      const idx = frac >= 0.5 && pos + 1 < navItems.length ? pos + 1 : pos;
      setActiveIdx((prev) => (prev === idx ? prev : idx));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    // Размер окна меняет и высоту «линии чтения», и позиции разделов.
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    compute();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // Шрифты подгружаются асинхронно и могут сдвинуть разделы — перемеряем.
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
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

  return (
    <>
      {/* ===================== Плашка «где я» (телефон и планшет) ===================== */}
      <div className="fixed top-[calc(var(--safe-top)+1rem)] left-[calc(var(--safe-left)+1.25rem)] z-50 sm:left-[calc(var(--safe-left)+2rem)] lg:hidden">
        <button
          type="button"
          data-nav-pill
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={`Разделы страницы. Текущий: ${activeLabel}`}
          className="glass-nav relative flex h-11 items-center gap-2.5 rounded-full pl-3.5 pr-3.5 text-[0.82rem] font-medium"
        >
          <span
            aria-hidden
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: "linear-gradient(120deg, var(--glow-1), var(--glow-3))" }}
          />
          {/*
            Барабан названий. Ширину окна задаёт невидимый дублёр, в котором
            лежат сразу все названия: она равна самому длинному из них и не
            меняется при перекате — поэтому плашка не «дышит» на коротких
            словах. Края окна растворяет маска, и перекатывающаяся строка
            входит и уходит «из тумана», как строка счётчика в таймере iOS.
          */}
          <span aria-hidden className="relative inline-grid">
            <span className="invisible col-start-1 row-start-1 inline-grid">
              {navItems.map((item) => (
                <span key={item.id} className="col-start-1 row-start-1 whitespace-nowrap">
                  {item.label}
                </span>
              ))}
            </span>
            <span
              className="col-start-1 row-start-1 block overflow-hidden"
              style={{ height: ROLL_H, maskImage: ROLL_FADE, WebkitMaskImage: ROLL_FADE }}
            >
              <span
                className="block transition-transform ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                style={{
                  transitionDuration: `${ROLL_MS}ms`,
                  transform: `translateY(${-activeIdx * ROLL_H}px)`,
                  willChange: "transform",
                }}
              >
                {navItems.map((item) => (
                  <span
                    key={item.id}
                    className="flex items-center justify-center whitespace-nowrap"
                    style={{ height: ROLL_H }}
                  >
                    {item.label}
                  </span>
                ))}
              </span>
            </span>
          </span>
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