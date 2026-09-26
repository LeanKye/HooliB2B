"use client";

import { useState } from "react";
import { CATS, PACKAGES, REVIEWS, WORKS, type Cat } from "./lumina/data";
import { Hero, Photo, Portfolio, Prices, Request, Reviews } from "./lumina/sections";

/**
 * Живой предпросмотр шаблона Lumina — настоящий мини-сайт, а не картинка.
 *
 * Зачем он клиенту: по скриншотам видно вёрстку, но не видно поведения.
 * Здесь всё работает — фильтр в галерее фильтрует, карточка открывается,
 * форма проверяет поля и отправляет заявку, на узком экране включается
 * бургер-меню. Именно эти детали решают, подойдёт ли шаблон, а на
 * статичном изображении их не проверить.
 *
 * Отдельно важно: палитра и шрифты здесь НЕ как на сайте HooliB2B. Шаблон
 * должен выглядеть чужим сайтом — иначе клиент решит, что «переделка» не
 * даст ничего. Поэтому здесь своя тёмная база, свадебный акцент и
 * засечный шрифт для заголовков.
 *
 * Все данные вымышленные, форма ничего не отправляет: предпросмотр
 * показывает механику, а не работу с реальными заявками.
 *
 * Секции лежат в `lumina/sections.tsx` и используются дважды: здесь и в
 * макетах экранов на странице шаблона. Благодаря этому «скриншоты» на
 * странице шаблона показывают ровно то, что откроется в предпросмотре,
 * и разойтись уже не могут.
 */
export default function LuminaPreview() {
  const [cat, setCat] = useState<"all" | Cat>("all");
  const [menu, setMenu] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState<{ name?: string; phone?: string }>({});

  const shown = cat === "all" ? WORKS : WORKS.filter((w) => w.cat === cat);

  /** Проверка формы: показывает, что механика в шаблоне есть. */
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof err = {};
    if (name.trim().length < 2) next.name = "Как к вам обращаться?";
    if (phone.replace(/\D/g, "").length < 10) next.phone = "Нужен полный номер";
    setErr(next);
    if (Object.keys(next).length === 0) setSent(true);
  };

  /*
   * `min-h-[100svh]`, а не `min-h-full`: процентная высота от родителя без
   * заданной высоты не работает, и низ длинной страницы «выползал» на цвет
   * body сайта. `svh` учитывает, что на мобильных адресная строка то уезжает,
   * то возвращается.
   *
   * `colorScheme: "dark"` — для нативных контролов: без него выпадающий список
   * и календарь в поле «Дата съёмки» рисуются в системной теме (светлыми на
   * белом) и выглядят чужеродно внутри тёмного шаблона.
   */
  return (
    <div className="min-h-[100svh] bg-[#17111c] text-white" style={{ colorScheme: "dark" }}>
      {/* Шапка: на телефоне превращается в бургер — это и есть адаптив */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#17111c]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
          <span className="text-sm font-semibold tracking-[0.3em] text-[#f472b6]">LUMINA</span>
          <nav className="ml-auto hidden items-center gap-5 text-sm text-white/70 sm:flex">
            <a href="#portfolio" className="transition-colors hover:text-white">Портфолио</a>
            <a href="#prices" className="transition-colors hover:text-white">Услуги</a>
            <a href="#reviews" className="transition-colors hover:text-white">Отзывы</a>
            <a href="#request" className="rounded-full bg-[#f472b6] px-4 py-2 font-medium text-[#17111c] transition-opacity hover:opacity-90">Записаться</a>
          </nav>
          <button
            type="button"
            onClick={() => setMenu((v) => !v)}
            aria-expanded={menu}
            aria-label="Меню"
            className="ml-auto rounded-lg border border-white/20 p-2 sm:hidden"
          >
            <span className="block h-0.5 w-4 bg-white" />
            <span className="mt-1 block h-0.5 w-4 bg-white" />
          </button>
        </div>
        {menu && (
          <nav className="flex flex-col gap-3 border-t border-white/10 px-4 py-4 text-sm sm:hidden">
            <a href="#portfolio" onClick={() => setMenu(false)}>Портфолио</a>
            <a href="#prices" onClick={() => setMenu(false)}>Услуги</a>
            <a href="#reviews" onClick={() => setMenu(false)}>Отзывы</a>
            <a href="#request" onClick={() => setMenu(false)} className="rounded-full bg-[#f472b6] px-4 py-2 text-center font-medium text-[#17111c]">Записаться</a>
          </nav>
        )}
      </header>
      {/* Первый экран: заголовок, кнопки и мозаика из четырёх кадров */}
      <Hero onOpenShot={setLightbox} />

      {/* Портфолио: фильтр реально фильтрует, карточка открывается */}
      <Portfolio
        cat={cat}
        cats={CATS}
        shown={shown}
        onPickCategory={setCat}
        onOpenShot={setLightbox}
      />

      {/* Услуги: средний пакет выделен — так выделяют «популярный» */}
      <Prices packages={PACKAGES} />

      {/* Отзывы рядом с формой: сначала чужой опыт, потом заявка */}
      <Reviews reviews={REVIEWS} />

      {/* Форма: поля проверяются, заявка не уходит никуда — это предпросмотр */}
      <Request
        interactive
        sent={sent}
        name={name}
        phone={phone}
        errors={err}
        onName={setName}
        onPhone={setPhone}
        onSubmit={submit}
      />


      <footer className="border-t border-white/10 px-4 py-8 text-center text-xs text-white/45">
        Lumina — демонстрационный предпросмотр шаблона HooliB2B. Фото, цены и отзывы вымышлены.
      </footer>

      {/* Просмотр кадра: открывается по клику на работу */}
      {lightbox !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр работы"
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <div className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <Photo
              hue={WORKS.find((w) => w.id === lightbox)?.hue ?? 12}
              label={WORKS.find((w) => w.id === lightbox)?.title ?? ""}
            />
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="mt-4 w-full rounded-full border border-white/25 py-2.5 text-sm transition-colors hover:bg-white/10"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
