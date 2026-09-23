import Reveal from "@/components/ui/Reveal";

type Props = {
  id: string;
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

/** Обёртка секции с заголовком и плавным появлением. */
export default function Section({ id, eyebrow, title, subtitle, children, className = "" }: Props) {
  return (
    <section id={id} className={`relative scroll-mt-24 py-20 pl-[calc(var(--safe-left)+1.25rem)] pr-[calc(var(--safe-right)+1.25rem)] sm:py-28 sm:pl-[calc(var(--safe-left)+2rem)] sm:pr-[calc(var(--safe-right)+2rem)] lg:pl-48 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <header className="mb-10 max-w-3xl sm:mb-16">
            {eyebrow && (
              <div className="pill mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3.5 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[var(--glow-1)] to-[var(--glow-3)]" />
                {eyebrow}
              </div>
            )}
            <h2 className="text-[1.9rem] font-semibold sm:text-[3rem]">{title}</h2>
            {subtitle && (
              <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-[var(--muted)] sm:text-lg">
                {subtitle}
              </p>
            )}
          </header>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
