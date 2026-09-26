"use client";

import { useState } from "react";

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
 */

type Cat = "wedding" | "portrait" | "family";

const CATS: { id: "all" | Cat; label: string }[] = [
  { id: "all", label: "Все работы" },
  { id: "wedding", label: "Свадьбы" },
  { id: "portrait", label: "Портреты" },
  { id: "family", label: "Семья" },
];

const WORKS: { id: number; cat: Cat; title: string; place: string; hue: number }[] = [
  { id: 1, cat: "wedding", title: "Анна и Игорь", place: "Санторини", hue: 12 },
  { id: 2, cat: "wedding", title: "Мария и Павел", place: "Псков", hue: 28 },
  { id: 3, cat: "portrait", title: "Портрет в студии", place: "Санкт-Петербург", hue: 44 },
  { id: 4, cat: "family", title: "Семья на даче", place: "Приозерск", hue: 60 },
  { id: 5, cat: "wedding", title: "Елена и Артём", place: "Сочи", hue: 74 },
  { id: 6, cat: "portrait", title: "Портрет в парке", place: "Москва", hue: 88 },
  { id: 7, cat: "family", title: "Семья дома", place: "Москва", hue: 102 },
  { id: 8, cat: "wedding", title: "Ольга и Никита", place: "Карелия", hue: 116 },
];

/**
 * Кадры для первого экрана.
 *
 * Берутся из WORKS — то есть это буквально кадры из портфолио, а не
 * отдельная декорация. Так человек видит на первом экране ровно то,
 * что потом листает ниже, и блок не расходится с содержимым.
 *
 * Раскладка мозаики: крупный кадр слева (он и есть «лицо» работы),
 * два меньших справа и широкая кинематографичная полоса внизу. Раньше
 * здесь была сетка с `col-span-2` и `aspect-[3/4]` — из-за этого первый
 * кадр вытягивался в плиту высотой под 700 px, а четвёртый уезжал на
 * следующую строку, и вся полоса читалась как случайный набор плиток.
 * Теперь высоты задаёт сама сетка строк, поэтому блок всегда ровный.
 */
const HERO_SHOTS = [WORKS[0], WORKS[4], WORKS[2], WORKS[3]];

const PACKAGES = [
  { name: "Съёмка 2 часа", price: "от 15 000 ₽", items: ["2 часа съёмки", "20 фото в ретуши", "Галерея онлайн"] },
  { name: "Полный день", price: "от 32 000 ₽", popular: true, items: ["8 часов съёмки", "60 фото в ретуши", "Вторая локация", "Помощь координатора"] },
  { name: "Предсъёмка", price: "от 9 000 ₽", items: ["30 минут съёмки", "10 фото в ретуши", "Знакомство и план"] },
];

const REVIEWS = [
  { name: "Анна К.", text: "Снимали свадьбу за границей. Фотографии пришли через неделю, и каждая — без единого промаха. Отдельно спасибо, что помогли с таймингом." },
  { name: "Мария П.", text: "Брали предсъёмку перед свадьбой. В итоге полный день шли уже без нервов: знали, что получится." },
  { name: "Семья В.", text: "Семейная съёмка с детьми. Терпеливо, без навязчивых указаний, и ребёнок в итоге сам попросил ещё кадр." },
];

/**
 * Кадр-заглушка: настоящих снимков у шаблона нет, поэтому вместо фото —
 * градиент из двух тонов. Подпись «ваше фото» честно говорит, что здесь
 * будет материал клиента: на демо это полезнее красивой заглушки.
 *
 * Градиент лежит на отдельном слое, а не на самом блоке: только так он
 * увеличивается при наведении (`.group-hover/photo:scale`), не растягивая
 * вместе с собой скругление и подпись.
 */
function Photo({
  hue,
  label,
  ratio = "aspect-[3/4]",
}: {
  hue: number;
  label?: string;
  ratio?: string;
}) {
  return (
    <div className={`group/photo relative flex items-end overflow-hidden rounded-xl ${ratio}`}>
      <span
        aria-hidden
        className="absolute inset-0 transition-transform duration-500 ease-out group-hover/photo:scale-[1.05]"
        style={{
          background: `linear-gradient(${140 + hue}deg, hsl(${hue} 55% 42%), hsl(${hue + 26} 48% 26%))`,
        }}
      />
      {label && <span className="relative p-2 text-[0.65rem] leading-tight text-white/70">{label}</span>}
    </div>
  );
}

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


      {/*
       * Первый экран.
       *
       * Одно большое вертикальное фото здесь — плохой выбор именно для
       * фотографа: он продаёт корпус работ, а одна «главная» картинка
       * выглядит как сток и ничего не говорит об уровне съёмки. Поэтому
       * справа стоит мозаика из четырёх кадров разного жанра (свадьба,
       * эмоции, портрет, деталь): глаз считывает диапазон, а взгляд
       * двигается по ленте и хочется листать дальше.
       *
       * Все четыре кадра кликабельны и открывают тот же просмотр, что и
       * в портфолио: рассмотреть работу можно прямо с первого экрана.
       *
       * На телефоне мозаика уходит под текст, на десктопе стоит справа
       * от него — так заголовок и фотографии конкурируют за первый
       * взгляд, а не выстраиваются в столбик.
       */}
      <section className="mx-auto max-w-5xl px-4 pb-12 pt-10 sm:pt-16">
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="text-[0.72rem] font-medium uppercase tracking-[0.22em] text-[#f472b6]">
              Свадьбы · Портреты · Семья
            </p>
            <h1 className="mt-4 text-[2.4rem] font-semibold leading-[1.05] sm:text-[3.4rem]">
              Свадебная
              <br />
              фотография
            </h1>
            <p className="mt-4 max-w-lg text-[0.98rem] leading-relaxed text-white/70">
              Тёплые кадры о вашем дне. Снимаем так, чтобы через десять лет
              смотреть и улыбаться.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#portfolio"
                className="rounded-full bg-[#f472b6] px-6 py-3 text-sm font-semibold text-[#17111c] transition-opacity hover:opacity-90"
              >
                Смотреть работы
              </a>
              <a
                href="#prices"
                className="rounded-full border border-white/25 px-6 py-3 text-sm font-medium transition-colors hover:bg-white/5"
              >
                Услуги и цены
              </a>
            </div>
          </div>

          {/*
           * Мозаика из четырёх кадров. Пропорция контейнера задана явно
           * (aspect), а высоты плиток — долями `grid-rows`: иначе строки
           * `1fr` схлопываются под пустое содержимое и блок разъезжается.
           *
           * Телефон — ровная сетка 2×2. На десктопе один кадр занимает
           * левую колонку целиком, справа два кадра стопкой, а внизу —
           * широкая горизонтальная полоса: взгляд идёт сверху вниз
           * и вправо, и рядом стоят кадры разного жанра.
           */}
          <div className="grid aspect-[4/5] grid-cols-2 grid-rows-2 gap-2.5 sm:aspect-square sm:grid-cols-3 sm:grid-rows-3 sm:gap-3">
            {HERO_SHOTS.map((s, i) => {
              const area = [
                "col-span-1 row-span-1 sm:col-span-2 sm:row-span-3",
                "col-span-1 row-span-1 sm:col-span-1 sm:row-span-2",
                "col-span-1 row-span-1 sm:col-span-1 sm:row-span-1",
                "col-span-1 row-span-1 sm:col-span-2 sm:row-span-1",
              ][i];
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setLightbox(s.id)}
                  className={`group block overflow-hidden rounded-xl ${area}`}
                >
                  <Photo hue={s.hue} label="ваше фото" ratio="h-full w-full" />
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-6 text-[0.75rem] text-white/45 sm:text-center">
          Четыре кадра из портфолио — здесь будут ваши работы
        </p>
      </section>

      {/* Портфолио: фильтр реально фильтрует, карточка открывается */}
      <section id="portfolio" className="mx-auto max-w-5xl scroll-mt-16 px-4 py-12">
        <h2 className="text-2xl font-semibold">Портфолио</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCat(c.id)}
              aria-pressed={cat === c.id}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                cat === c.id ? "bg-[#f472b6] text-[#17111c]" : "bg-white/10 text-white/75 hover:bg-white/15"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {shown.map((w) => (
            <button key={w.id} type="button" onClick={() => setLightbox(w.id)} className="text-left">
              <Photo hue={w.hue} label={`${w.title} · ${w.place}`} />
            </button>
          ))}
        </div>
      </section>


      {/* Услуги: средний пакет выделен — так выделяют «популярный» */}
      <section id="prices" className="mx-auto max-w-5xl scroll-mt-16 px-4 py-12">
        <h2 className="text-2xl font-semibold">Услуги и цены</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {PACKAGES.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl p-5 ${
                p.popular ? "border border-[#f472b6] bg-[#f472b6]/10 md:-translate-y-2" : "border border-white/12 bg-white/5"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-[#f472b6] px-3 py-0.5 text-[0.68rem] font-semibold text-[#17111c]">
                  популярный
                </span>
              )}
              <div className="text-sm text-white/75">{p.name}</div>
              <div className="mt-2 text-xl font-semibold text-[#f472b6]">{p.price}</div>
              <ul className="mt-4 grid gap-2 text-sm text-white/70">
                {p.items.map((it) => (
                  <li key={it} className="flex items-start gap-2">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#f472b6]" />
                    {it}
                  </li>
                ))}
              </ul>
              <a href="#request" className="mt-5 block rounded-full border border-white/25 py-2.5 text-center text-sm font-medium transition-colors hover:bg-white/10">
                Выбрать
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Отзывы рядом с формой: сначала чужий опыт, потом заявка */}
      <section id="reviews" className="mx-auto max-w-5xl scroll-mt-16 px-4 py-12">
        <h2 className="text-2xl font-semibold">Отзывы</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="rounded-2xl border border-white/12 bg-white/5 p-5">
              <div className="text-[#fbbf24]">★★★★★</div>
              <blockquote className="mt-3 text-sm leading-relaxed text-white/75">«{r.text}»</blockquote>
              <figcaption className="mt-3 text-sm font-medium">{r.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>


      {/* Форма: поля проверяются, заявка не уходит никуда — это предпросмотр */}
      <section id="request" className="mx-auto max-w-5xl scroll-mt-16 px-4 py-12">
        <div className="rounded-2xl border border-white/12 bg-white/5 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">Расскажите о дате</h2>
          <p className="mt-2 text-sm text-white/65">Ответим в течение дня.</p>

          {sent ? (
            <div className="mt-6 rounded-xl border border-[#34d399]/50 bg-[#34d399]/10 p-5">
              <div className="font-medium text-[#34d399]">Заявка отправлена</div>
              <p className="mt-1 text-sm text-white/70">
                Спасибо, {name.trim()}. В предпросмотре ничего не уходит — на реальном
                сайте заявка пришла бы в мессенджер и на почту.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2" noValidate>
              <label className="grid gap-1.5 text-sm">
                <span>Имя</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Как к вам обращаться"
                  className={`rounded-lg border bg-white/5 px-3 py-2.5 outline-none transition-colors placeholder:text-white/35 ${
                    err.name ? "border-red-400/70" : "border-white/20 focus:border-[#f472b6]"
                  }`}
                />
                {err.name && <span className="text-xs text-red-300">{err.name}</span>}
              </label>

              <label className="grid gap-1.5 text-sm">
                <span>Телефон</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 900 000-00-00"
                  inputMode="tel"
                  className={`rounded-lg border bg-white/5 px-3 py-2.5 outline-none transition-colors placeholder:text-white/35 ${
                    err.phone ? "border-red-400/70" : "border-white/20 focus:border-[#f472b6]"
                  }`}
                />
                {err.phone && <span className="text-xs text-red-300">{err.phone}</span>}
              </label>

              <label className="grid gap-1.5 text-sm">
                <span>Дата съёмки</span>
                <input type="date" className="rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 outline-none focus:border-[#f472b6]" />
              </label>

              <label className="grid gap-1.5 text-sm">
                <span>Что снимаем</span>
                <select className="rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 outline-none focus:border-[#f472b6]">
                  <option>Свадьба</option>
                  <option>Портрет</option>
                  <option>Семейная съёмка</option>
                  <option>Пока не знаю</option>
                </select>
              </label>

              <div className="sm:col-span-2">
                <button type="submit" className="w-full rounded-full bg-[#f472b6] py-3 text-sm font-semibold text-[#17111c] transition-opacity hover:opacity-90">
                  Отправить заявку
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

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
