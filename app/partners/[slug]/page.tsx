import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { partners } from "@/lib/content";
import Reveal from "@/components/ui/Reveal";

export function generateStaticParams() {
  return partners.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const partner = partners.find((p) => p.slug === slug);
  if (!partner) return { title: "Партнёр не найден — HooliB2B" };
  return {
    title: `${partner.name} — кейс HooliB2B`,
    description: partner.summary,
  };
}

export default async function PartnerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const partner = partners.find((p) => p.slug === slug);
  if (!partner) notFound();

  return (
    <main className="relative pb-[calc(var(--safe-bottom)+5rem)] pl-[calc(var(--safe-left)+1.25rem)] pr-[calc(var(--safe-right)+1.25rem)] pt-[calc(var(--safe-top)+7rem)] sm:pl-[calc(var(--safe-left)+2rem)] sm:pr-[calc(var(--safe-right)+2rem)] sm:pt-[calc(var(--safe-top)+8rem)] lg:pl-48">
      <div className="mx-auto w-full max-w-5xl">
        <Reveal>
          <Link
            href="/#partners"
            className="glass-nav inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[0.85rem] font-medium text-[var(--muted)] hover:text-[var(--fg)]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Все партнёры
          </Link>
        </Reveal>

        <Reveal delay={60}>
          <div className="glass-strong relative mt-6 overflow-hidden rounded-[2rem] p-7 sm:p-10">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(110% 120% at 0% 0%, color-mix(in oklab, ${partner.accent} 26%, transparent), transparent 55%)`,
              }}
            />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-5">
                <span
                  className="flex h-20 w-20 items-center justify-center rounded-3xl border border-[var(--border)] font-display text-3xl font-semibold"
                  style={{
                    background: `color-mix(in oklab, ${partner.accent} 22%, transparent)`,
                    color: partner.accent,
                    boxShadow: `0 20px 50px -22px ${partner.accent}`,
                  }}
                >
                  {partner.logo}
                </span>
                <div>
                  <h1 className="text-[2rem] font-semibold sm:text-[2.8rem]">{partner.name}</h1>
                  <p className="mt-1 text-[0.95rem] text-[var(--muted)]">
                    {partner.industry} · {partner.city}
                  </p>
                </div>
              </div>

              <p className="mt-7 max-w-3xl text-[1.02rem] leading-relaxed text-[var(--muted)]">
                {partner.summary}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {partner.services.map((s) => (
                  <span
                    key={s}
                    className="pill rounded-full border border-[var(--border)] px-3.5 py-1.5 text-[0.78rem] text-[var(--muted)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {partner.results.map((r) => (
              <div key={r.label} className="glass rounded-3xl p-6 text-center">
                <div className="font-display text-4xl font-semibold tabular" style={{ color: partner.accent }}>
                  {r.value}
                </div>
                <div className="mt-2 text-[0.82rem] text-[var(--muted)]">{r.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={160}>
          <figure className="glass mt-6 rounded-[2rem] p-7 sm:p-10">
            <svg viewBox="0 0 24 24" className="h-8 w-8 opacity-40" fill="currentColor" style={{ color: partner.accent }}>
              <path d="M7.5 6C5 6 3 8 3 10.6c0 2.4 1.7 4.2 4 4.2.3 0 .6 0 .8-.1-.5 1.5-1.7 2.6-3.3 3.1l.7 1.9c3.5-.9 5.9-3.8 5.9-7.6V10C11.1 7.7 9.6 6 7.5 6Zm10 0C15 6 13 8 13 10.6c0 2.4 1.7 4.2 4 4.2.3 0 .6 0 .8-.1-.5 1.5-1.7 2.6-3.3 3.1l.7 1.9c3.5-.9 5.9-3.8 5.9-7.6V10C21.1 7.7 19.6 6 17.5 6Z" />
            </svg>
            <blockquote className="mt-5 max-w-3xl text-[1.1rem] leading-relaxed sm:text-[1.25rem]">
              «{partner.quote}»
            </blockquote>
            <figcaption className="mt-5 text-[0.88rem] text-[var(--muted)]">
              <span className="font-medium text-[var(--fg)]">{partner.author}</span> — {partner.authorRole}
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {partner.url && (
              <a
                href={partner.url}
                target="_blank"
                rel="noreferrer"
                className="glass-strong inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[0.95rem] font-semibold transition-transform duration-300 hover:scale-[1.03]"
              >
                Открыть сайт {partner.name}
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </a>
            )}
            <Link
              href="/#contact"
              className="glass-nav rounded-full px-7 py-3.5 text-[0.95rem] font-medium text-[var(--muted)] hover:text-[var(--fg)]"
            >
              Хочу похожий проект
            </Link>
          </div>
        </Reveal>

        <Reveal delay={240}>
          <p className="mt-8 text-[0.78rem] text-[var(--muted)]">
            Кейс носит демонстрационный характер и показывает, как будет выглядеть раздел с вашим проектом.
          </p>
        </Reveal>
      </div>
    </main>
  );
}

