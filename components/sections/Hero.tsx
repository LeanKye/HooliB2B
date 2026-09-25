"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { metrics } from "@/lib/content";
import { scrollToId } from "@/components/providers/SmoothScroll";

const words = ["сайты", "CRM-системы", "AI-ассистентов", "интеграции"];
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

function RotatingWord() {
  // Храним и текущее слово, и предыдущее: уходящее уезжает вверх, остальные
  // ждут внизу. Получается «перелистывание» вместо простого мигания.
  const [{ i, prev }, setState] = useState({ i: 0, prev: 0 });
  useEffect(() => {
    const t = setInterval(
      () => setState((s) => ({ i: (s.i + 1) % words.length, prev: s.i })),
      2600,
    );
    return () => clearInterval(t);
  }, []);

  return (
    /*
     * Слово живёт в капсуле внутри предложения, а не отдельной центрированной
     * строкой. Все слова лежат в одной ячейке grid, поэтому ширина блока равна
     * самому длинному слову и НИКОГДА не меняется — абзац не переверстывается и
     * страница не прыгает. Раньше слово было inline-block и при каждой смене
     * размонтировалось: ширина схлопывалась до нуля, «AI-ассистентов»
     * перескакивал на другую строку и верстка дёргалась на ~28 px.
     *
     * Зарезервированное место под самое длинное слово читается как осознанный
     * элемент интерфейса именно благодаря капсуле — без неё после короткого
     * слова оставалась «дыра» посередине предложения.
     */
    <span className="relative inline-grid align-baseline">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -inset-y-[0.25em] rounded-full border border-[var(--border)]"
        style={{
          background:
            "linear-gradient(120deg, color-mix(in oklab, var(--glow-1) 15%, transparent), color-mix(in oklab, var(--glow-3) 15%, transparent))",
        }}
      />
      {words.map((word, idx) => (
        <motion.span
          key={word}
          aria-hidden={idx !== i}
          initial={false}
          animate={idx === i ? { opacity: 1, y: 0 } : { opacity: 0, y: idx === prev ? -10 : 10 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="text-gradient col-start-1 row-start-1 justify-self-center whitespace-nowrap px-2.5 font-semibold leading-[1.1]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  /*
   * Появление вверху — только сдвиг и прозрачность. Оба идут через композитор и
   * не перерисовывают текст, поэтому одинаково дешёвы на любом устройстве.
   *
   * Раньше сюда входил `filter: blur(8px)`, и на телефоне от него «дрожали» цифры
   * в метриках. Подавить его в CSS нельзя было: motion задаёт filter инлайном,
   * а значит правило `.reveal { filter: none }` (класс `.reveal` здесь не
   * используется) на него не действует. Пытаться решить это в JS через
   * `useCoarsePointer()` тоже нельзя: хук возвращает `false` на первом рендере
   * и уточняет значение в useEffect, то есть `filter` исчезает из цели анимации
   * уже на лету — motion оставляет последний записанный инлайн-стиль, и blur
   * зависает на экране навсегда. Поэтому дорогая часть просто убрана, а не
   * conditionally отключена.
   */
  const up = (delay: number) => ({
    initial: { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: EASE },
  });

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center pb-24 pl-[calc(var(--safe-left)+1.25rem)] pr-[calc(var(--safe-right)+1.25rem)] pt-[calc(var(--safe-top)+7rem)] sm:pl-[calc(var(--safe-left)+2rem)] sm:pr-[calc(var(--safe-right)+2rem)] sm:pt-[calc(var(--safe-top)+8rem)] lg:pl-48"
    >
      <div className="mx-auto w-full max-w-6xl">
        <motion.div {...up(0.05)} className="pill mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-[0.75rem] font-medium tracking-wide text-[var(--muted)]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--glow-3)] opacity-70" style={{ animation: "pulse-ring 2.4s ease-out infinite" }} />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--glow-3)]" />
          </span>
          B2B-сервис разработки и сопровождения
        </motion.div>

        <div
          style={{
            // --px/--py обнуляются на тач-устройствах: следить за «курсором» там нечем.
            transform:
              "translate3d(calc((var(--mx, 0.5) - 0.5) * var(--px, 1) * -18px), calc((var(--my, 0.5) - 0.5) * var(--py, 1) * -14px), 0)",
          }}
        >
          <motion.h1
            {...up(0.15)}
            className="max-w-4xl text-[2.15rem] font-semibold leading-[0.99] sm:text-[4.4rem] lg:text-[5.2rem]"
          >
            Digital-продукты <span className="text-[var(--muted)]">для малого бизнеса</span>
          </motion.h1>
        </div>

        <motion.p {...up(0.28)} className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-[var(--muted)] sm:text-xl">
          Готовые шаблоны, быстрый запуск и поддержка по подписке. Запускаем{" "}
          <RotatingWord /> без найма программистов в штат.
        </motion.p>

        <motion.div {...up(0.4)} className="mt-9 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => scrollToId("contact")}
            className="glass-strong group relative overflow-hidden rounded-full px-7 py-3.5 text-[0.95rem] font-semibold text-[var(--fg)] transition-transform duration-300 hover:scale-[1.03]"
          >
            <span className="relative z-10">Обсудить проект</span>
            <span
              aria-hidden
              className="absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: "linear-gradient(120deg, color-mix(in oklab, var(--glow-1) 35%, transparent), color-mix(in oklab, var(--glow-3) 35%, transparent))" }}
            />
          </button>
          <button
            type="button"
            onClick={() => scrollToId("services")}
            className="glass-nav rounded-full px-7 py-3.5 text-[0.95rem] font-medium text-[var(--muted)] hover:text-[var(--fg)]"
          >
            Смотреть услуги →
          </button>
        </motion.div>

        <motion.dl {...up(0.55)} className="mt-14 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="glass rounded-2xl px-4 py-4">
              <dt className="font-display text-2xl font-semibold tabular sm:text-[1.7rem]">{m.value}</dt>
              <dd className="mt-1 text-[0.78rem] leading-snug text-[var(--muted)]">{m.label}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
