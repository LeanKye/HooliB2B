import Link from "next/link";
import { partners } from "@/lib/content";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";

function PartnerLogo({ letter, accent }: { letter: string; accent: string }) {
  return (
    <span
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] font-display text-xl font-semibold"
      style={{
        background: `color-mix(in oklab, ${accent} 22%, transparent)`,
        color: accent,
        boxShadow: `0 10px 30px -14px ${accent}`,
      }}
    >
      {letter}
    </span>
  );
}

export default function Partners() {
  return (
    <Section
      id="partners"
      eyebrow="Наши партнёры"
      title={<>Бизнесы, которые <span className="text-gradient">уже с нами</span></>}
      subtitle="Мы делаем продукты для реальных компаний. Загляните в карточку — там детали проекта, результаты в цифрах и ссылка на работающий сайт."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((p, i) => (
          <Reveal key={p.slug} delay={i * 80} className="h-full">
            <Link
              href={`/partners/${p.slug}`}
              className="glass group relative flex h-full flex-col overflow-hidden rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1.5"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(320px circle at 80% 0%, color-mix(in oklab, ${p.accent} 20%, transparent), transparent 60%)`,
                }}
              />
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-center gap-4">
                  <PartnerLogo letter={p.logo} accent={p.accent} />
                  <div>
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <p className="text-[0.8rem] text-[var(--muted)]">
                      {p.industry} · {p.city}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-[0.9rem] leading-relaxed text-[var(--muted)]">{p.summary}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {p.services.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-[var(--border)] px-3 py-1 text-[0.72rem] text-[var(--muted)]"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-center gap-2 pt-6 text-[0.85rem] font-medium">
                  <span style={{ color: p.accent }}>Подробнее о проекте</span>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: p.accent }}
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}

        {/* карточка-приглашение */}
        <Reveal delay={partners.length * 80} className="h-full">
          <div className="glass flex h-full flex-col justify-center rounded-3xl border-dashed p-6 text-center">
            <p className="font-display text-lg font-semibold">Здесь может быть ваш проект</p>
            <p className="mt-2 text-[0.88rem] text-[var(--muted)]">
              Мы открыты к сотрудничеству с малым бизнесом. Расскажите о задаче — покажем, что можно сделать.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
