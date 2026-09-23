"use client";

import { plans } from "@/lib/content";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { scrollToId } from "@/components/providers/SmoothScroll";

const priceRows = [
  { name: "Сайт-визитка", template: "25 000 ₽", custom: "60 000 ₽", sub: "3 000 ₽/мес" },
  { name: "Полноценный сайт", template: "60 000 ₽", custom: "150 000 ₽", sub: "7 000 ₽/мес" },
  { name: "CRM-система", template: "80 000 ₽", custom: "200 000 ₽", sub: "10 000 ₽/мес" },
  { name: "AI-ассистент", template: "70 000 ₽", custom: "180 000 ₽", sub: "12 000 ₽/мес" },
  { name: "Комбо-пакет (сайт + CRM + AI)", template: "180 000 ₽", custom: "450 000 ₽", sub: "25 000 ₽/мес" },
  { name: "Индивидуальная разработка", template: "—", custom: "от 300 000 ₽", sub: "по проекту" },
];

function PlanCard({ plan, index }: { plan: (typeof plans)[number]; index: number }) {
  return (
    <div
      className={`glass relative flex h-full flex-col overflow-hidden rounded-3xl p-7 transition-transform duration-500 hover:-translate-y-1.5 ${
        plan.featured ? "sm:-translate-y-3 sm:scale-[1.03]" : ""
      }`}
    >
      {plan.featured && (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--glow-2) 20%, transparent), transparent 55%)",
            }}
          />
          <span className="pill absolute right-5 top-5 rounded-full border border-[var(--border-strong)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em]">
            Популярный
          </span>
        </>
      )}
      <div className="relative z-10 flex h-full flex-col">
        <h3 className="text-lg font-semibold">{plan.name}</h3>
        <div className="mt-4 flex items-end gap-1.5">
          <span className="font-display text-4xl font-semibold tabular">{plan.price}</span>
          <span className="pb-1 text-sm text-[var(--muted)]">{plan.note}</span>
        </div>
        <ul className="mt-6 grid gap-3">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-[0.9rem] text-[var(--muted)]">
              <svg viewBox="0 0 20 20" className="mt-[3px] h-4 w-4 shrink-0 text-[var(--glow-3)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 10.5l4 4 8-9" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => scrollToId("contact")}
          className={`mt-8 w-full rounded-full px-6 py-3 text-[0.9rem] font-semibold transition-transform duration-300 hover:scale-[1.02] ${
            plan.featured ? "glass-strong text-[var(--fg)]" : "border border-[var(--border-strong)] text-[var(--fg)]"
          }`}
          style={index === 0 ? { background: "var(--card)" } : undefined}
        >
          Подключить
        </button>
      </div>
    </div>
  );
}

export default function Pricing() {
  return (
    <Section
      id="pricing"
      eyebrow="Цены"
      title={<>Понятные <span className="text-gradient">тарифы</span> без сюрпризов</>}
      subtitle="Разовая оплата за внедрение и небольшая подписка за сопровождение. Мы следим, чтобы продукт работал, обновлялся и не терял ваших клиентов."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 80} className="h-full">
            <PlanCard plan={p} index={i} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="glass mt-8 overflow-hidden rounded-3xl">
          <div className="hidden grid-cols-[1.7fr_1fr_1fr_1fr] gap-4 border-b border-[var(--border)] px-6 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)] sm:grid">
            <span>Продукт</span>
            <span className="text-right">Внедрение (шаблон)</span>
            <span className="text-right">Разработка с нуля</span>
            <span className="text-right">Подписка</span>
          </div>
          {priceRows.map((r, i) => (
            <div
              key={r.name}
              className={`grid grid-cols-3 gap-x-3 gap-y-2 px-5 py-5 transition-colors duration-300 hover:bg-[var(--card)] sm:grid-cols-[1.7fr_1fr_1fr_1fr] sm:items-center sm:gap-4 sm:px-6 ${
                i > 0 ? "border-t border-[var(--border)]" : ""
              }`}
            >
              <span className="col-span-3 font-medium sm:col-span-1">{r.name}</span>
              <span className="text-left sm:text-right">
                <span className="block text-[0.62rem] uppercase tracking-wider text-[var(--muted)] sm:hidden">Шаблон</span>
                <span className="tabular text-[0.92rem]">{r.template}</span>
              </span>
              <span className="text-left sm:text-right">
                <span className="block text-[0.62rem] uppercase tracking-wider text-[var(--muted)] sm:hidden">С нуля</span>
                <span className="tabular text-[0.92rem]">{r.custom}</span>
              </span>
              <span className="text-left sm:text-right">
                <span className="block text-[0.62rem] uppercase tracking-wider text-[var(--muted)] sm:hidden">Подписка</span>
                <span className="tabular text-[0.92rem] text-[var(--muted)]">{r.sub}</span>
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
