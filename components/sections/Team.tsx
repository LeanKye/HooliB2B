import { team } from "@/lib/content";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";

/** Иконки ролей — вместо безликих инициалов. */
const roleIcons: Record<string, React.ReactNode> = {
  dev: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 8.5 5 12l3.5 3.5M15.5 8.5 19 12l-3.5 3.5M13.3 5.8l-2.6 12.4" />
    </svg>
  ),
  sales: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.5 12.4c0 4.1-3.8 7.4-8.5 7.4-1.1 0-2.2-.2-3.2-.5L4.5 20.5l1.2-3.7A7 7 0 0 1 3.5 12.4C3.5 8.3 7.3 5 12 5s8.5 3.3 8.5 7.4Z" />
      <path d="M9 11.6h6M9 14.6h3.5" />
    </svg>
  ),
  analytics: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4v15.5h16" />
      <path d="M8.2 16.5v-4.2M12.4 16.5V8.4M16.6 16.5v-6" />
    </svg>
  ),
};

export default function Team() {
  return (
    <Section
      id="team"
      eyebrow="Команда"
      title={<>Небольшая, но <span className="text-gradient">сильная</span> команда</>}
      subtitle="Вместо агентства с десятками людей — три специалиста, каждый на своём месте. Это быстрее, дешевле и без «передачи по цепочке»."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((m, i) => (
          <Reveal key={m.role} delay={i * 80} className="h-full">
            <div className="glass group relative h-full overflow-hidden rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1.5">
              <span
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
                style={{ background: m.accent }}
              />
              <div className="relative z-10">
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border)]"
                  style={{ background: `color-mix(in oklab, ${m.accent} 20%, transparent)`, color: m.accent }}
                >
                  {roleIcons[m.icon]}
                </span>
                <p className="mt-5 text-[0.72rem] font-semibold uppercase tracking-[0.16em]" style={{ color: m.accent }}>
                  {m.role}
                </p>
                <h3 className="mt-2 text-lg font-semibold">{m.name}</h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-[var(--muted)]">{m.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

