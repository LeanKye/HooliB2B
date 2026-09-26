"use client";

import { useEffect, useRef } from "react";
import { services } from "@/lib/content";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import ServiceIcon from "@/components/ui/ServiceIcon";

type Service = (typeof services)[number];

function ServiceCard({ s }: { s: Service }) {
  const ref = useRef<HTMLDivElement>(null);
  /*
   * Подсветка следует за курсором через --cx/--cy. Событие мыши приходит
   * чаще, чем браузер рисует кадр (до 1000+ Гц на трекпадах), а setProperty
   * инвалидирует стиль карточки. Поэтому запоминаем позицию и пишем её
   * не чаще одного раза в кадр.
   */
  const pending = useRef<{ x: number; y: number } | null>(null);
  const queued = useRef(0);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    pending.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    if (queued.current) return;
    queued.current = requestAnimationFrame(() => {
      queued.current = 0;
      const p = pending.current;
      const node = ref.current;
      if (!p || !node) return;
      node.style.setProperty("--cx", `${p.x}px`);
      node.style.setProperty("--cy", `${p.y}px`);
    });
  };

  // Отменяем отложенную запись, если карточка размонтировалась раньше кадра.
  useEffect(
    () => () => {
      if (queued.current) cancelAnimationFrame(queued.current);
    },
    [],
  );

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className="glass group relative flex h-full flex-col overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1.5"
    >
      {/* подсветка, следующая за курсором */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(280px circle at var(--cx, 50%) var(--cy, 50%), color-mix(in oklab, ${s.accent} 22%, transparent), transparent 65%)`,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${s.accent} 45%, transparent)` }}
      />

      <div className="relative z-10 flex h-full flex-col">
        <div
          className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)]"
          style={{ background: `color-mix(in oklab, ${s.accent} 16%, transparent)`, color: s.accent }}
        >
          <ServiceIcon name={s.icon} className="h-6 w-6" />
        </div>

        <h3 className="text-xl font-semibold">{s.title}</h3>
        <p className="mt-1 text-[0.8rem] font-medium uppercase tracking-wide" style={{ color: s.accent }}>
          {s.tagline}
        </p>
        <p className="mt-3 text-[0.92rem] leading-relaxed text-[var(--muted)]">{s.description}</p>

        <ul className="mt-5 grid gap-2">
          {s.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-[0.88rem] text-[var(--muted)]">
              <svg viewBox="0 0 20 20" className="mt-[3px] h-4 w-4 shrink-0" fill="none" stroke={s.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 10.5l4 4 8-9" />
              </svg>
              {b}
            </li>
          ))}
        </ul>

        {/*
         * Подписка здесь больше не показывается.
         *
         * Раньше в подвале карточки стояло «Внедрение 25 000 ₽» и «Подписка
         * 3 000 ₽/мес» рядом, и это читалось как обязательная связка: мол,
         * заказываешь «Сайт-визитку» — подписка именно 3 000 ₽/мес. На деле
         * подписка выбирается отдельно (тарифы «Базовый / Стандарт / Премиум»
         * в блоке «Цены»), и её стоимость не зависит от продукта. Значения
         * к тому же расходились с тарифами: здесь для CRM стояло 10 000 ₽/мес,
         * а «Премиум» — 15 000 ₽/мес.
         *
         * Оставляем только разовую цену внедрения — её выбор действительно
         * определяется продуктом.
         */}
        {/*
         * Подпись зависит от формата самой цены.
         *
         * Раньше здесь стояло жёсткое «Внедрение от», а цену писали как
         * «25 000 ₽» — вместе читалось «Внедрение от 25 000 ₽». Теперь в
         * setupFrom лежит либо «≈ 20 000 ₽» (оценка, «от» лишнее и противоречит
         * знаку ≈), либо «от 40 000 ₽», где «от» несёт смысл нижней границы.
         * Одна подпись на оба формата дала бы «Внедрение от ≈ 20 000 ₽», поэтому
         * выбираем её по строке.
         */}
        <div className="mt-auto flex items-end justify-between gap-4 border-t border-[var(--border)] pt-5">
          <div>
            <div className="text-[0.68rem] uppercase tracking-[0.14em] text-[var(--muted)]">
              {s.setupFrom.startsWith("от ") ? "Внедрение от" : "Внедрение"}
            </div>
            <div className="font-display text-lg font-semibold tabular" style={{ color: s.accent }}>
              {s.setupFrom}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <Section
      id="services"
      eyebrow="Что мы делаем"
      title={<>Продукты, которые <span className="text-gradient">решают задачи</span></>}
      subtitle="Берём готовые, проверенные шаблоны и адаптируем под ваш бизнес — это быстро и заметно дешевле разработки с нуля. Нужно что-то нестандартное? Соберём индивидуально."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.id} delay={i * 70} className="h-full">
            <ServiceCard s={s} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
