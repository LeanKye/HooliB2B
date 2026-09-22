"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { metrics } from "@/lib/content";
import { scrollToId } from "@/components/providers/SmoothScroll";

const words = ["сайты", "CRM-системы", "AI-ассистентов", "интеграции"];
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % words.length), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-block align-bottom">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[i]}
          initial={{ y: 16, opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -16, opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease: EASE }}
          className="text-gradient inline-block font-semibold"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
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
        <motion.div {...up(0.05)} className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[0.75rem] font-medium tracking-wide text-[var(--muted)] backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--glow-3)] opacity-70" style={{ animation: "pulse-ring 2.4s ease-out infinite" }} />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--glow-3)]" />
          </span>
          B2B-сервис разработки и сопровождения
        </motion.div>

        <div
          style={{
            transform:
              "translate3d(calc((var(--mx, 0.5) - 0.5) * -18px), calc((var(--my, 0.5) - 0.5) * -14px), 0)",
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
