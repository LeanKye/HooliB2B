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
     * Все слова лежат в одной ячейке grid, поэтому ширина блока равна самому
     * длинному слову и НИКОГДА не меняется. Раньше слово было inline-block и при
     * каждой смене размонтировалось: ширина схлопывалась до нуля, абзац
     * переверстывался, «AI-ассистентов» перескакивал на другую строку — и
     * страница прыгала на ~28 px. Теперь верстка стабильна, а слова просто
     * сменяют друг друга прозрачностью.
     *
     * На узком экране слот всё равно не помещается в строку и оставлял бы пустое
     * место посередине предложения, поэтому до `md` слово занимает строку целиком
     * и стоит по центру — как выделенная вставка.
     */
    <span className="relative inline-grid w-full text-center align-baseline md:w-auto">
      {words.map((word, idx) => (
        <motion.span
          key={word}
          aria-hidden={idx !== i}
          initial={false}
          animate={idx === i ? { opacity: 1, y: 0 } : { opacity: 0, y: idx === prev ? -14 : 14 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="text-gradient col-start-1 row-start-1 font-semibold"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  const up = (delay: number) => ({
    initial: { opacity: 0, y: 26, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.9, delay, ease: EASE },
  });

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center pl-11 pr-5 pb-24 pt-28 sm:pl-16 sm:pr-8 sm:pt-32 lg:pl-48"
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
