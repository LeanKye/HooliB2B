import { process } from "@/lib/content";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";

export default function Process() {
  return (
    <Section
      id="process"
      eyebrow="Как мы работаем"
      title={<>От идеи до запуска — <span className="text-gradient">6 шагов</span></>}
      subtitle="Прозрачный процесс без технического жаргона. Вы всегда понимаете, что происходит и что будет дальше."
    >
      <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* соединительная линия на десктопе */}
        <span
          aria-hidden
          className="hairline absolute left-0 right-0 top-[3.4rem] hidden h-px lg:block"
        />
        {process.map((p, i) => (
          <Reveal key={p.n} delay={i * 70} className="h-full">
            <div className="glass group relative h-full overflow-hidden rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1.5">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(160deg, color-mix(in oklab, var(--glow-1) 16%, transparent), transparent 60%)",
                }}
              />
              <div className="relative z-10">
                <div
                  className="font-display text-5xl font-semibold leading-none"
                  style={{ WebkitTextStroke: "1.2px var(--border-strong)", color: "transparent" }}
                >
                  {p.n}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-[var(--muted)]">{p.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
