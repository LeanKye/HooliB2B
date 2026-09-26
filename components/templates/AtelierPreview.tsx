"use client";

import { useState } from "react";
import { ITEMS, REVIEWS, type Item } from "./atelier/data";
import { Catalog, Hero, Order, Reviews } from "./atelier/sections";

/**
 * Живой предпросмотр шаблона «Ателье» — пекарня.
 *
 * Устройство то же, что у Lumina, и намеренно: секции лежат в
 * `atelier/sections.tsx` и используются дважды — здесь и в макетах
 * экранов на странице шаблона. Благодаря этому «скриншоты» и живой
 * предпросмотр не могут разойтись.
 *
 * Отдельно важно: палитра здесь НЕ как на сайте HooliB2B. Шаблон должен
 * выглядеть чужим сайтом — иначе клиент решит, что «переделка» ничего
 * не даст. Поэтому своя тёплая база, охряный акцент и засечный шрифт
 * для заголовков.
 *
 * Все данные вымышленные, заказ ничего не отправляет: предпросмотр
 * показывает механику, а не работу с реальными заявками.
 */

export default function AtelierPreview() {
  const [cat, setCat] = useState<"all" | Item["cat"]>("all");
  const [menu, setMenu] = useState(false);
  const [cart, setCart] = useState<number[]>([]);
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState<{ name?: string; phone?: string }>({});

  const shown = cat === "all" ? ITEMS : ITEMS.filter((w) => w.cat === cat);

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
   * и календарь рисуются в системной теме (светлыми на белом) и выглядят
   * чужеродно внутри тёмного шаблона.
   */
  return (
    <div className="min-h-[100svh] bg-[#241a0c] text-white" style={{ colorScheme: "dark" }}>
      {/* Шапка: на телефоне превращается в бургер — это и есть адаптив */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#241a0c]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
          <span className="text-sm font-semibold tracking-[0.3em] text-[#fbbf24]">АТЕЛЬЕ</span>
          <nav className="ml-auto hidden items-center gap-5 text-sm text-white/70 sm:flex">
            <a href="#catalog" className="transition-colors hover:text-white">Меню</a>
            <a href="#reviews" className="transition-colors hover:text-white">Отзывы</a>
            <a href="#order" className="transition-colors hover:text-white">Как заказать</a>
            <a href="#order" className="rounded-full bg-[#fbbf24] px-4 py-2 font-medium text-[#241a0c] transition-opacity hover:opacity-90">
              Заказать{cart.length > 0 ? ` · ${cart.length}` : ""}
            </a>
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
            <a href="#catalog" onClick={() => setMenu(false)}>Меню</a>
            <a href="#reviews" onClick={() => setMenu(false)}>Отзывы</a>
            <a href="#order" onClick={() => setMenu(false)}>Как заказать</a>
            <a href="#order" onClick={() => setMenu(false)} className="rounded-full bg-[#fbbf24] px-4 py-2 text-center font-medium text-[#241a0c]">
              Заказать{cart.length > 0 ? ` · ${cart.length}` : ""}
            </a>
          </nav>
        )}
      </header>

      <Hero />

      {/* Меню: фильтр работает, «+» складывает позицию в корзину */}
      <Catalog
        cat={cat}
        shown={shown}
        inCart={cart}
        onPickCategory={setCat}
        onAdd={(id) => setCart((c) => (c.includes(id) ? c : [...c, id]))}
      />

      <Reviews reviews={REVIEWS} />

      {/* Заказ: корзина, поля и отправка. Всё считается на клиенте. */}
      <Order
        interactive
        cart={cart}
        items={ITEMS}
        sent={sent}
        name={name}
        phone={phone}
        errors={err}
        onName={setName}
        onPhone={setPhone}
        onRemove={(id) => setCart((c) => c.filter((x) => x !== id))}
        onSubmit={submit}
      />

      <footer className="border-t border-white/10 px-4 py-8 text-center text-xs text-white/45">
        Ателье — демонстрационный предпросмотр шаблона HooliB2B. Товары, цены и отзывы вымышлены.
      </footer>
    </div>
  );
}
