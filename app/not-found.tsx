import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100svh] items-center justify-center px-5 pb-[calc(var(--safe-bottom)+7rem)] pt-[calc(var(--safe-top)+7rem)]">
      <div className="glass-strong max-w-lg rounded-[2rem] p-10 text-center">
        <div className="font-display text-6xl font-semibold text-gradient">404</div>
        <h1 className="mt-4 text-2xl font-semibold">Страница не найдена</h1>
        <p className="mt-3 text-[0.95rem] text-[var(--muted)]">
          Возможно, ссылка устарела. Вернёмся на главную?
        </p>
        <Link
          href="/"
          className="glass-strong mt-7 inline-flex rounded-full px-7 py-3.5 text-[0.95rem] font-semibold transition-transform duration-300 hover:scale-[1.03]"
        >
          На главную
        </Link>
      </div>
    </main>
  );
}
