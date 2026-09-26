import { CATS, HOURS, ITEMS, type Item } from "./data";

/**
 * Фото-заглушка позиции.
 *
 * Настоящих снимков у шаблона нет, поэтому вместо фото — градиент из двух
 * тонов. Подпись «ваше фото» честно говорит, что здесь будет материал
 * клиента, и попутно показывает, где именно он нужен: в пекарне витрина
 * продаёт собой, и без реальных кадров она не работает.
 *
 * Градиент на отдельном слое: только так он увеличивается при наведении,
 * не растягивая вместе с собой скругление и подпись.
 */
export function Shot({ hue, label }: { hue: number; label?: string }) {
  return (
    <div className="group/shot relative flex items-end overflow-hidden rounded-xl">
      <span
        aria-hidden
        className="absolute inset-0 aspect-[4/3] w-full transition-transform duration-500 ease-out group-hover/shot:scale-[1.05]"
        style={{
          background: `linear-gradient(${140 + hue}deg, hsl(${hue} 62% 52%), hsl(${hue + 28} 52% 28%))`,
        }}
      />
      {label && (
        <span className="relative p-2 text-[0.65rem] leading-tight text-white/75">{label}</span>
      )}
    </div>
  );
}

/**
 * Первый экран: акция дня и витрина.
 *
 * Для пекарни порядок блоков жёсткий. Сначала акция — человек с телефона
 * решает за минуту, и первое, что он ищет, «что сегодня вкусного и
 * сколько стоит». Цена и вес вынесены в подпись кадра специально: у
 * хлеба это решающий аргумент, и без него карточка ничего не говорит.
 */
export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-12 pt-10 sm:pt-16">
      <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.22em] text-[#fbbf24]">
            Пекарня · Кофе · Своя выпечка
          </p>
          <h1 className="mt-4 text-[2.4rem] font-semibold leading-[1.05] sm:text-[3.4rem]">
            Печём
            <br />
            каждое утро
          </h1>
          <p className="mt-4 max-w-lg text-[0.98rem] leading-relaxed text-white/70">
            Хлеб на закваске, круассаны из сливочного теста и торты по
            заказу. Без полуфабрикатов: что в витрине — то и в печи.
          </p>

          {/* Акция дня: на витрине это первое, что замечают */}
          <div className="mt-6 rounded-2xl border border-[#fbbf24]/40 bg-[#fbbf24]/10 p-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#fbbf24] px-2.5 py-0.5 text-[0.65rem] font-semibold text-[#241a0c]">
                акция дня
              </span>
              <span className="text-[0.95rem] font-semibold">Кофе и круассан — 320 ₽</span>
            </div>
            <p className="mt-1.5 text-[0.8rem] leading-relaxed text-white/65">
              Каждое утро до 11:00. Меняем каждый день, актуально на сегодня.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#catalog"
              className="rounded-full bg-[#fbbf24] px-6 py-3 text-sm font-semibold text-[#241a0c] transition-opacity hover:opacity-90"
            >
              Смотреть меню
            </a>
            <a
              href="#order"
              className="rounded-full border border-white/25 px-6 py-3 text-sm font-medium transition-colors hover:bg-white/5"
            >
              Как заказать
            </a>
          </div>
        </div>


        {/* Витрина: три позиции с ценой и весом + режим работы */}
        <div className="grid grid-cols-2 gap-3">
          {ITEMS.slice(3, 6).map((it) => (
            <div key={it.id} className="overflow-hidden rounded-xl border border-white/12 bg-white/5">
              <Shot hue={it.hue} />
              <div className="p-2.5">
                <div className="truncate text-[0.8rem] font-medium">{it.name}</div>
                <div className="mt-1 flex items-baseline justify-between gap-2">
                  <span className="text-[0.85rem] font-semibold text-[#fbbf24]">{it.price} ₽</span>
                  <span className="text-[0.68rem] text-white/50">{it.weight}</span>
                </div>
              </div>
            </div>
          ))}
          <div className="col-span-2 flex items-center justify-between rounded-xl border border-white/12 bg-white/5 px-3.5 py-3">
            <div className="text-[0.78rem] text-white/65">
              <div className="text-white/85">{HOURS.days}</div>
              <div className="mt-0.5">{HOURS.sunday}</div>
            </div>
            <div className="text-right text-[0.75rem] text-white/50">
              <div>{HOURS.address}</div>
              <div className="mt-0.5 text-white/70">Заказ в мессенджер</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Каталог с фильтром и добавлением в корзину.
 *
 * Фильтр и «В корзину» работают по-настоящему — это и есть причина, по
 * которой визитку хочется открыть, а не разглядывать скриншот. Обработчики
 * необязательны: в макете на странице шаблона блок рисуется тем же кодом,
 * но без поведения.
 */
export function Catalog({
  cat,
  shown,
  inCart,
  onPickCategory,
  onAdd,
}: {
  cat: "all" | Item["cat"];
  shown: readonly Item[];
  inCart?: readonly number[];
  onPickCategory?: (id: "all" | Item["cat"]) => void;
  onAdd?: (id: number) => void;
}) {
  return (
    <section id="catalog" className="mx-auto max-w-5xl scroll-mt-16 px-4 py-12">
      <h2 className="text-2xl font-semibold">Меню</h2>
      <div className="mt-5 flex flex-wrap gap-2">
        {CATS.map((c) => {
          const cls = `rounded-full px-4 py-2 text-sm transition-colors ${
            cat === c.id ? "bg-[#fbbf24] text-[#241a0c]" : "bg-white/10 text-white/75 hover:bg-white/15"
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
        {shown.map((it) => {
          const added = inCart?.includes(it.id);
          const btn = added
            ? "bg-[#34d399] text-[#0d1f16]"
            : "bg-[#fbbf24] text-[#241a0c] hover:opacity-90";
          return (
            <div key={it.id} className="overflow-hidden rounded-xl border border-white/12 bg-white/5">
              <Shot hue={it.hue} />
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-[0.85rem] font-medium leading-tight">{it.name}</div>
                  {it.badge && (
                    <span className="shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-[0.6rem] text-white/80">
                      {it.badge}
                    </span>
                  )}
                </div>
                <div className="mt-1 text-[0.72rem] text-white/55">{it.note}</div>
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[0.9rem] font-semibold text-[#fbbf24]">{it.price} ₽</div>
                    <div className="text-[0.65rem] text-white/45">{it.weight}</div>
                  </div>
                  {onAdd ? (
                    <button
                      type="button"
                      onClick={() => onAdd(it.id)}
                      aria-label={`Добавить ${it.name}`}
                      className={`rounded-full px-3 py-1.5 text-[0.72rem] font-semibold transition-colors ${btn}`}
                    >
                      {added ? "В корзине" : "+"}
                    </button>
                  ) : (
                    <span className="rounded-full bg-[#fbbf24] px-3 py-1.5 text-[0.72rem] font-semibold text-[#241a0c]">
                      +
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Заказ: корзина и отправка в мессенджер.
 *
 * Без регистрации и оплаты онлайн — как и обещает блок в описании
 * шаблона. Для пекарни это важно: человек покупает по дороге, и лишний
 * шаг «создайте аккаунт» уводит его из заказа.
 */
export function Order({
  interactive = false,
  cart,
  items,
  name,
  phone,
  sent,
  errors,
  onName,
  onPhone,
  onRemove,
  onSubmit,
}: {
  interactive?: boolean;
  cart?: readonly number[];
  items: readonly Item[];
  name?: string;
  phone?: string;
  sent?: boolean;
  errors?: { name?: string; phone?: string };
  onName?: (v: string) => void;
  onPhone?: (v: string) => void;
  onRemove?: (id: number) => void;
  onSubmit?: (e: React.FormEvent) => void;
}) {
  const inCart = cart ?? [];
  const picked = items.filter((it) => inCart.includes(it.id));
  const total = picked.reduce((sum, it) => sum + it.price, 0);
  const inputCls = (bad?: string) =>
    `rounded-lg border bg-white/5 px-3 py-2.5 outline-none transition-colors placeholder:text-white/35 ${
      bad ? "border-red-400/70" : "border-white/20 focus:border-[#fbbf24]"
    }`;

  return (
    <section id="order" className="mx-auto max-w-5xl scroll-mt-16 px-4 py-12">
      <div className="rounded-2xl border border-white/12 bg-white/5 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold">Заказ</h2>
        <p className="mt-2 text-sm text-white/65">
          Без регистрации: соберите корзину и оставьте телефон — заказ уйдёт
          в мессенджер пекарни.
        </p>

        {sent ? (
          <div className="mt-6 rounded-xl border border-[#34d399]/50 bg-[#34d399]/10 p-5">
            <div className="font-medium text-[#34d399]">Заказ отправлен</div>
            <p className="mt-1 text-sm text-white/70">
              Спасибо, {name?.trim()}. В предпросмотре ничего не уходит — на
              реальном сайте заказ пришёл бы в мессенджер пекарни.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_1.1fr]">
            {/* Корзина: пустую тоже показываем честно, с подсказкой */}
            <div>
              <div className="text-sm font-medium">В корзине</div>
              {picked.length === 0 ? (
                <p className="mt-2 text-sm text-white/55">
                  Пока пусто. Выберите позицию в меню — её можно поменять до
                  отправки.
                </p>
              ) : (
                <ul className="mt-3 grid gap-2">
                  {picked.map((it) => (
                    <li
                      key={it.id}
                      className="flex items-center justify-between gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm"
                    >
                      <span className="truncate">{it.name}</span>
                      <span className="flex shrink-0 items-center gap-2">
                        <span className="text-white/70">{it.price} ₽</span>
                        {onRemove && (
                          <button
                            type="button"
                            onClick={() => onRemove(it.id)}
                            aria-label={`Убрать ${it.name}`}
                            className="text-white/45 transition-colors hover:text-white"
                          >
                            ✕
                          </button>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4 flex items-baseline justify-between border-t border-white/10 pt-3">
                <span className="text-sm text-white/65">Итого</span>
                <span className="text-lg font-semibold text-[#fbbf24]">{total} ₽</span>
              </div>
              <ol className="mt-4 grid gap-1.5 text-[0.75rem] text-white/45">
                <li>1. Собрали корзину</li>
                <li>2. Оставили имя и телефон</li>
                <li>3. Заказ ушёл в мессенджер пекарни</li>
              </ol>
            </div>


            <form onSubmit={interactive ? onSubmit : undefined} noValidate>
              <div className="grid gap-4">
                <label className="grid gap-1.5 text-sm">
                  <span>Имя</span>
                  <input
                    value={name ?? ""}
                    onChange={onName ? (e) => onName(e.target.value) : undefined}
                    placeholder="Как к вам обращаться"
                    readOnly={!onName}
                    className={inputCls(errors?.name)}
                  />
                  {errors?.name && <span className="text-xs text-red-300">{errors.name}</span>}
                </label>

                <label className="grid gap-1.5 text-sm">
                  <span>Телефон</span>
                  <input
                    value={phone ?? ""}
                    onChange={onPhone ? (e) => onPhone(e.target.value) : undefined}
                    placeholder="+7 900 000-00-00"
                    inputMode="tel"
                    readOnly={!onPhone}
                    className={inputCls(errors?.phone)}
                  />
                  {errors?.phone && <span className="text-xs text-red-300">{errors.phone}</span>}
                </label>

                <label className="grid gap-1.5 text-sm">
                  <span>Когда забрать</span>
                  <input
                    type="date"
                    readOnly
                    className="rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 outline-none focus:border-[#fbbf24]"
                  />
                </label>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#fbbf24] py-3 text-sm font-semibold text-[#241a0c] transition-opacity hover:opacity-90"
                >
                  Отправить заказ
                </button>
                <p className="text-center text-[0.72rem] text-white/45">
                  Оплата при получении. Предоплата не нужна.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

/** Отзывы: для небольшого бренда значат больше, чем для фотографа. */
export function Reviews({ reviews }: { reviews: readonly { name: string; text: string }[] }) {
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


