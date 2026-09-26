"use client";

import { useState } from "react";
import Link from "next/link";
import { templates } from "@/lib/content";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import TemplatePreview from "@/components/ui/TemplatePreview";
import { TemplateCardPreview } from "@/components/templates/registry";
import { scrollToId } from "@/components/providers/SmoothScroll";

type Filter = "all" | "card" | "full";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "card", label: "Сайт-визитка" },
  { id: "full", label: "Полноценный сайт" },
];

function TemplateCard({ t }: { t: (typeof templates)[number] }) {
  const isFull = t.kind === "full";

  return (
    <div className="glass group flex h-full flex-col overflow-hidden rounded-3xl p-3 transition-transform duration-500 hover:-translate-y-1.5">
      <div className="overflow-hidden rounded-2xl">
        <TemplateCardPreview
          slug={t.slug}
          className="transition-transform duration-500 group-hover:scale-[1.03]"
          fallback={<TemplatePreview t={t} className="transition-transform duration-500 group-hover:scale-[1.03]" />}
        />
      </div>

      <div className="flex flex-1 flex-col p-3 pt-4">
        <div className="flex items-center gap-2">
          <span
            className="rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em]"
            style={{ background: `color-mix(in oklab, ${t.accent} 18%, transparent)`, color: t.accent }}
          >
            {isFull ? "Полноценный" : "Визитка"}
          </span>
          <span className="text-[0.75rem] text-[var(--muted)]">{t.industry}</span>
        </div>

        <h3 className="mt-3 text-lg font-semibold">{t.name}</h3>
        <p className="mt-1.5 text-[0.9rem] leading-relaxed text-[var(--muted)]">{t.summary}</p>

        {/* Что уже есть в шаблоне до кастомизации — главное, ради чего
            смотрят каталог: понять, попадёт ли шаблон в задачу. */}
        <ul className="mt-4 grid grid-cols-2 gap-1.5">
          {t.blocks.map((b) => (
            <li key={b} className="flex items-center gap-1.5 text-[0.78rem] text-[var(--muted)]">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: t.accent }} />
              <span className="truncate">{b}</span>
            </li>
          ))}
        </ul>

        {/*
         * Цены в каталоге нет намеренно: она живёт в разделе «Цены» и зависит
         * от состава работ, а не от шаблона. Карточка ведёт на подробную
         * страницу шаблона — там разбор блоков и список контента от клиента.
         */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
          <Link
            href={`/templates/${t.slug}/`}
            className="text-[0.85rem] font-semibold transition-colors duration-300"
            style={{ color: t.accent }}
          >
            Подробнее о шаблоне
          </Link>
          <Link
            href={`/templates/${t.slug}/`}
            className="rounded-full border border-[var(--border-strong)] px-4 py-2 text-[0.82rem] font-semibold text-[var(--fg)] transition-colors duration-300 hover:bg-[var(--card)]"
          >
            Смотреть
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Templates() {
  const [filter, setFilter] = useState<Filter>("all");
  const shown = filter === "all" ? templates : templates.filter((t) => t.kind === filter);

  return (
    <Section
      id="templates"
      eyebrow="Шаблоны"
      title={<>Готовые <span className="text-gradient">шаблоны</span> под вашу задачу</>}
      subtitle="Показываем структуру типовых решений, а не абстрактные обещания. Любой шаблон адаптируем под ваш бизнес: меняем тексты, цвета и блоки, подключаем домен и форму заявки."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={`rounded-full px-4 py-2 text-[0.85rem] font-medium transition-colors duration-300 ${
              filter === f.id
                ? "bg-[var(--card-strong)] text-[var(--fg)]"
                : "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((t, i) => (
          <Reveal key={t.slug} delay={i * 70} className="h-full">
            <TemplateCard t={t} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="glass mt-8 flex flex-col items-start gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.95rem] text-[var(--muted)]">
            Не нашли подходящий? Соберём под вашу задачу с нуля — от 3 дней.
          </p>
          <button
            type="button"
            onClick={() => scrollToId("contact")}
            className="glass-strong shrink-0 rounded-full px-6 py-3 text-[0.9rem] font-semibold text-[var(--fg)] transition-transform duration-300 hover:scale-[1.03]"
          >
            Обсудить задачу
          </button>
        </div>
      </Reveal>
    </Section>
  );
}