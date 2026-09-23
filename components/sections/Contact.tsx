import Logo from "@/components/ui/Logo";
import Reveal from "@/components/ui/Reveal";

const contacts = [
  { label: "Почта", value: "hello@hoolib2b.ru", href: "mailto:hello@hoolib2b.ru" },
  { label: "Telegram", value: "@hoolib2b", href: "https://t.me/hoolib2b" },
  { label: "Телефон", value: "+7 (000) 000-00-00", href: "tel:+70000000000" },
];

export default function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-24 py-20 pl-[calc(var(--safe-left)+1.25rem)] pr-[calc(var(--safe-right)+1.25rem)] sm:py-28 sm:pl-[calc(var(--safe-left)+2rem)] sm:pr-[calc(var(--safe-right)+2rem)] lg:pl-48">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <div className="glass-strong relative overflow-hidden rounded-[2rem] p-7 sm:p-12">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 120% at 0% 0%, color-mix(in oklab, var(--glow-1) 22%, transparent), transparent 55%), radial-gradient(120% 120% at 100% 100%, color-mix(in oklab, var(--glow-3) 20%, transparent), transparent 55%)",
              }}
            />
            <div className="relative z-10 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
              <div>
                <div className="pill mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-3.5 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.18em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[var(--glow-1)] to-[var(--glow-4)]" />
                  Начнём?
                </div>
                <h2 className="max-w-xl text-[2rem] font-semibold leading-[1.03] sm:text-[3rem]">
                  Обсудим, что <span className="text-gradient">даст вашему бизнесу</span> цифра
                </h2>
                <p className="mt-4 max-w-lg text-[1rem] leading-relaxed text-[var(--muted)]">
                  Бесплатная диагностика: разберём ваши процессы и предложим решение. Без обязательств и
                  технического жаргона.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="mailto:hello@hoolib2b.ru"
                    className="glass-strong rounded-full px-7 py-3.5 text-[0.95rem] font-semibold transition-transform duration-300 hover:scale-[1.03]"
                  >
                    Написать нам
                  </a>
                  <a
                    href="https://t.me/hoolib2b"
                    target="_blank"
                    rel="noreferrer"
                    className="glass-nav rounded-full px-7 py-3.5 text-[0.95rem] font-medium text-[var(--muted)] hover:text-[var(--fg)]"
                  >
                    Написать в Telegram
                  </a>
                </div>
              </div>

              <div className="grid gap-3">
                {contacts.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    className="glass-nav flex items-center justify-between rounded-2xl px-5 py-4"
                  >
                    <span className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                      {c.label}
                    </span>
                    <span className="text-[0.95rem] font-medium">{c.value}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative pb-[calc(var(--safe-bottom)+5rem)] pl-[calc(var(--safe-left)+1.25rem)] pr-[calc(var(--safe-right)+1.25rem)] pt-6 sm:pb-[calc(var(--safe-bottom)+4rem)] sm:pl-[calc(var(--safe-left)+2rem)] sm:pr-[calc(var(--safe-right)+2rem)] lg:pl-48">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 border-t border-[var(--border)] pt-8 sm:flex-row sm:items-center sm:justify-between">
        <Logo withText />
        <p className="text-[0.8rem] text-[var(--muted)]">
          © {new Date().getFullYear()} HooliB2B. Разработка и сопровождение digital-продуктов.
        </p>
        <p className="text-[0.75rem] text-[var(--muted)]">Цены на сайте ориентировочные.</p>
      </div>
    </footer>
  );
}
