import { HERO_SHOTS, type Cat, WORKS } from "./data";

/**
 * Портфолио: фильтр по категориям и сетка работ.
 *
 * В предпросмотре сюда передаются обработчики, и блок работает по-настоящему;
 * в макете на странице шаблона они не передаются, и это тот же самый
 * компонент — просто без поведения. Именно поэтому «скриншот» и живой
 * предпросмотр не могут разойтись: это один и тот же код.
 */
export function Portfolio({
  cat,
  shown,
  cats,
  onPickCategory,
  onOpenShot,
}: {
  cat: "all" | Cat;
  shown: readonly (typeof WORKS)[number][];
  cats: readonly { id: "all" | Cat; label: string }[];
  onPickCategory?: (id: "all" | Cat) => void;
  onOpenShot?: (id: number) => void;
}) {
  return (
    <section id="portfolio" className="mx-auto max-w-5xl scroll-mt-16 px-4 py-12">
      <h2 className="text-2xl font-semibold">Портфолио</h2>
      <div className="mt-5 flex flex-wrap gap-2">
        {cats.map((c) => {
          const cls = `rounded-full px-4 py-2 text-sm transition-colors ${
            cat === c.id ? "bg-[#f472b6] text-[#17111c]" : "bg-white/10 text-white/75 hover:bg-white/15"
          }`;
          if (!onPickCategory)
            return (
              <span key={c.id} className={cls}>
                {c.label}
              </span>
            );
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onPickCategory(c.id)}
              aria-pressed={cat === c.id}
              className={cls}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {shown.map((w) => {
          if (!onOpenShot)
            return (
              <div key={w.id}>
                <Photo hue={w.hue} label={`${w.title} · ${w.place}`} />
              </div>
            );
          return (
            <button key={w.id} type="button" onClick={() => onOpenShot(w.id)} className="text-left">
              <Photo hue={w.hue} label={`${w.title} · ${w.place}`} />
            </button>
          );
        })}
      </div>
    </section>
  );
}

/** Услуги: средний пакет выделен — так выделяют «популярный». */
export function Prices({
  packages,
}: {
  packages: readonly {
    name: string;
    price: string;
    popular?: boolean;
    items: readonly string[];
  }[];
}) {
  return (
    <section id="prices" className="mx-auto max-w-5xl scroll-mt-16 px-4 py-12">
      <h2 className="text-2xl font-semibold">Услуги и цены</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {packages.map((p) => (
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
  );
}

/** Отзывы: в предпросмотре стоят рядом с формой — сначала чужой опыт. */
export function Reviews({
  reviews,
}: {
  reviews: readonly { name: string; text: string }[];
}) {
  return (
    <section id="reviews" className="mx-auto max-w-5xl scroll-mt-16 px-4 py-12">
      <h2 className="text-2xl font-semibold">Отзывы</h2>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {reviews.map((r) => (
          <figure key={r.name} className="rounded-2xl border border-white/12 bg-white/5 p-5">
            <div className="text-[#fbbf24]">★★★★★</div>
            <blockquote className="mt-3 text-sm leading-relaxed text-white/75">«{r.text}»</blockquote>
            <figcaption className="mt-3 text-sm font-medium">{r.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/**
 * Кадр-заглушка: настоящих снимков у шаблона нет, поэтому вместо фото —
 * градиент из двух тонов. Подпись «ваше фото» честно говорит, что здесь
 * будет материал клиента: на демо это полезнее красивой заглушки.
 *
 * Градиент лежит на отдельном слое, а не на самом блоке: только так он
 * увеличивается при наведении (`.group-hover/photo:scale`), не растягивая
 * вместе с собой скругление и подпись.
 */
export function Photo({
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

/**
 * Первый экран Lumina.
 *
 * Одно большое вертикальное фото здесь — плохой выбор именно для
 * фотографа: он продаёт корпус работ, а одна «главная» картинка выглядит
 * как сток и ничего не говорит об уровне съёмки. Поэтому справа стоит
 * мозаика из четырёх кадров разного жанра: глаз считывает диапазон, а
 * взгляд двигается по ленте и хочется листать дальше.
 *
 * Все четыре кадра кликабельны и открывают тот же просмотр, что и в
 * портфолио: рассмотреть работу можно прямо с первого экрана.
 *
 * На телефоне мозаика уходит под текст, на десктопе стоит справа от
 * него — так заголовок и фотографии конкурируют за первый взгляд, а не
 * выстраиваются в столбик.
 */
export function Hero({ onOpenShot }: { onOpenShot?: (id: number) => void }) {
  return (
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
            // В макете на странице шаблона обработчика нет: блок остаётся
            // тем же самым, но кадры не кликабельны.
            if (!onOpenShot)
              return (
                <div key={s.id} className={`block overflow-hidden rounded-xl ${area}`}>
                  <Photo hue={s.hue} label="ваше фото" ratio="h-full w-full" />
                </div>
              );
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onOpenShot(s.id)}
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
  );
}

/**
 * Форма заявки.
 *
 * В предпросмотре форма проверяет поля и показывает подтверждение;
 * в макете на странице шаблона `interactive` не передан, и она рисуется
 * как статичная картинка — но это тот же самый компонент с теми же
 * подписями и раскладкой.
 */
export function Request({
  interactive = false,
  sent = false,
  name = "",
  phone = "",
  errors = {},
  onName,
  onPhone,
  onSubmit,
}: {
  interactive?: boolean;
  sent?: boolean;
  name?: string;
  phone?: string;
  errors?: { name?: string; phone?: string };
  onName?: (v: string) => void;
  onPhone?: (v: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
}) {
  const inputCls = (bad?: string) =>
    `rounded-lg border bg-white/5 px-3 py-2.5 outline-none transition-colors placeholder:text-white/35 ${
      bad ? "border-red-400/70" : "border-white/20 focus:border-[#f472b6]"
    }`;

  return (
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
          <form
            onSubmit={interactive ? onSubmit : undefined}
            className="mt-6 grid gap-4 sm:grid-cols-2"
            noValidate
          >
            <label className="grid gap-1.5 text-sm">
              <span>Имя</span>
              <input
                value={name}
                onChange={onName ? (e) => onName(e.target.value) : undefined}
                placeholder="Как к вам обращаться"
                readOnly={!onName}
                className={inputCls(errors.name)}
              />
              {errors.name && <span className="text-xs text-red-300">{errors.name}</span>}
            </label>

            <label className="grid gap-1.5 text-sm">
              <span>Телефон</span>
              <input
                value={phone}
                onChange={onPhone ? (e) => onPhone(e.target.value) : undefined}
                placeholder="+7 900 000-00-00"
                inputMode="tel"
                readOnly={!onPhone}
                className={inputCls(errors.phone)}
              />
              {errors.phone && <span className="text-xs text-red-300">{errors.phone}</span>}
            </label>

            <label className="grid gap-1.5 text-sm">
              <span>Дата съёмки</span>
              <input
                type="date"
                readOnly
                className="rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 outline-none focus:border-[#f472b6]"
              />
            </label>

            <label className="grid gap-1.5 text-sm">
              <span>Что снимаем</span>
              {/*
                Без `disabled`: браузер рисует неактивный select серым, и макет
                на странице шаблона разошёлся бы с живым предпросмотром. Поле
                остаётся неуправляемым (без `value`), поэтому React не ругается
                на отсутствие `onChange`, а видно его ровно таким же.
              */}
              <select className="rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 outline-none focus:border-[#f472b6]">
                <option>Свадьба</option>
                <option>Портрет</option>
                <option>Семейная съёмка</option>
                <option>Пока не знаю</option>
              </select>
            </label>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full rounded-full bg-[#f472b6] py-3 text-sm font-semibold text-[#17111c] transition-opacity hover:opacity-90"
              >
                Отправить заявку
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

