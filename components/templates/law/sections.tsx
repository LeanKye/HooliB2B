import { SERVICES, TEAM, type Service } from "./data";

/**
 * Портрет или фото офиса — заглушка.
 *
 * Настоящих снимков у шаблона нет, поэтому вместо фото — градиент из двух
 * тонов. Подпись «ваше фото» честно говорит, что здесь будет материал
 * клиента: в юридической услуге фотография — это лицо человека, который
 * будет вести дело, и подменять её заглушкой в обещании нельзя.
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
          background: `linear-gradient(${140 + hue}deg, hsl(${hue} 32% 44%), hsl(${hue + 22} 30% 20%))`,
        }}
      />
      {label && <span className="relative p-2 text-[0.65rem] leading-tight text-white/70">{label}</span>}
    </div>
  );
}

/**
 * Первый экран: тон, имя и цифры опыта.
 *
 * Здесь нет ни «поможем со всем», ни обещаний результата — юридическая
 * услуга продаётся конкретикой. Поэтому вместо рекламного заголовка стоит
 * тон, имя и четыре сухих цифры: сколько лет, сколько дел, сколько юристов
 * и где приём. Это то, что клиент проверяет в первую очередь.
 *
 * Справа — портрет юриста: человек хочет понимать, кому доверит дело.
 */
export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-12 pt-10 sm:pt-16">
      <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.22em] text-[#a78bfa]">
            Юридическая практика
          </p>
          <h1 className="mt-4 text-[2.3rem] font-semibold leading-[1.08] sm:text-[3.2rem]">
            Разбираемся
            <br />
            в вашей ситуации
          </h1>
          <p className="mt-4 max-w-lg text-[0.98rem] leading-relaxed text-white/70">
            Консультируем по бизнесу, семейным спорам и интеллектуальной
            собственности. Объясняем, что будет, сколько займёт и сколько
            стоит, — до начала работы.
          </p>

          {/* Цифры опыта: конкретика вместо обещаний */}
          <dl className="mt-7 grid grid-cols-3 gap-4">
            {[
              { v: `${TEAM.years}`, l: "лет практики" },
              { v: `${TEAM.cases}`, l: "дел завершено" },
              { v: TEAM.people, l: "в команде" },
            ].map((s) => (
              <div key={s.l}>
                <dt className="sr-only">{s.l}</dt>
                <dd className="text-[1.5rem] font-semibold leading-none text-[#a78bfa]">{s.v}</dd>
                <div className="mt-1.5 text-[0.72rem] text-white/50">{s.l}</div>
              </div>
            ))}
          </dl>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#request"
              className="rounded-full bg-[#a78bfa] px-6 py-3 text-sm font-semibold text-[#14101f] transition-opacity hover:opacity-90"
            >
              Записаться на консультацию
            </a>
            <a
              href="#cases"
              className="rounded-full border border-white/25 px-6 py-3 text-sm font-medium transition-colors hover:bg-white/5"
            >
              Посмотреть кейсы
            </a>
          </div>

          <p className="mt-5 text-[0.75rem] text-white/45">{TEAM.city}</p>
        </div>

        {/* Портрет юриста: дело ведёт конкретный человек */}
        <div className="relative">
          <Photo hue={262} ratio="aspect-[4/5]" label="ваше фото" />
          <div className="absolute -bottom-4 left-4 right-4 rounded-xl border border-white/12 bg-[#1e1b33]/95 p-3.5 backdrop-blur">
            <div className="text-[0.9rem] font-medium">Анна Верещагина</div>
            <div className="mt-0.5 text-[0.75rem] text-white/55">
              Ведущий юрист, гражданские и корпоративные дела
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Услуги: направления практики с фильтром.
 *
 * Фильтр здесь — не украшение. Юрист ищет «своё» направление и уходит,
 * если приходится прокручивать всё подряд. Обработчик необязателен: в
 * макете на странице шаблона блок рисуется тем же кодом, но без поведения.
 */
export function Services({
  cat,
  shown,
  onPick,
}: {
  cat: Service["cat"] | "all";
  shown: readonly Service[];
  /** Фильтр по направлению; «all» показывает все. */
  onPick?: (cat: Service["cat"] | "all") => void;
}) {
  const groups: { id: Service["cat"] | "all"; label: string }[] = [
    { id: "all", label: "Все направления" },
    { id: "business", label: "Бизнес" },
    { id: "civil", label: "Гражданские" },
    { id: "ip", label: "Интеллектуальная собственность" },
  ];

  return (
    <section id="services" className="mx-auto max-w-5xl scroll-mt-16 px-4 py-12">
      <h2 className="text-2xl font-semibold">Направления практики</h2>
      <p className="mt-2 text-sm text-white/60">
        Что входит в работу и сколько она стоит. Итоговую смету считаем
        после короткого разговора.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {groups.map((g) => {
          const cls = `rounded-full px-4 py-2 text-sm transition-colors ${
            cat === g.id ? "bg-[#a78bfa] text-[#14101f]" : "bg-white/10 text-white/75 hover:bg-white/15"
          }`;
          if (!onPick)
            return (
              <span key={g.id} className={cls}>
                {g.label}
              </span>
            );
          return (
            <button key={g.id} type="button" onClick={() => onPick(g.id)} className={cls}>
              {g.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {shown.map((s) => (
          <div key={s.id} className="rounded-2xl border border-white/12 bg-white/5 p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[1.05rem] font-semibold leading-snug">{s.title}</h3>
              <span className="shrink-0 rounded-full bg-[#a78bfa]/15 px-2.5 py-1 text-[0.7rem] font-semibold text-[#a78bfa]">
                {s.price}
              </span>
            </div>
            <ul className="mt-4 grid gap-2 text-sm text-white/70">
              {s.what.map((w) => (
                <li key={w} className="flex items-start gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#a78bfa]" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Кейсы: было, что сделали, чем закончилось.
 *
 * Формат «задача → действие → результат» выбран не для красоты: так клиент
 * проверяет, что юрист умеет решать похожие ситуации. Сроки и суммы в
 * тексте меняются на реальные по вашей практике.
 */
export function Cases({
  cases,
  onOpen,
}: {
  cases: readonly {
    id: number;
    title: string;
    result: string;
    period: string;
    task: string;
    action: string;
    outcome: string;
  }[];
  onOpen?: (id: number) => void;
}) {
  return (
    <section id="cases" className="mx-auto max-w-5xl scroll-mt-16 px-4 py-12">
      <h2 className="text-2xl font-semibold">Кейсы</h2>
      <p className="mt-2 text-sm text-white/60">
        Ситуации обезличены: без имён и реквизитов, но с сутью дела и
        результатом.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {cases.map((c) => {
          const body = (
            <>
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[0.98rem] font-semibold leading-snug">{c.title}</h3>
                <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[0.65rem] text-white/70">
                  {c.period}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{c.task}</p>
              <p className="mt-2.5 text-sm leading-relaxed text-white/65">{c.action}</p>
              <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-relaxed text-white/85">
                {c.outcome}
              </p>
              <span className="mt-3 inline-block rounded-full bg-[#a78bfa]/15 px-2.5 py-1 text-[0.7rem] font-medium text-[#a78bfa]">
                {c.result}
              </span>
            </>
          );

          if (!onOpen)
            return (
              <article key={c.id} className="rounded-2xl border border-white/12 bg-white/5 p-5">
                {body}
              </article>
            );
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onOpen(c.id)}
              className="rounded-2xl border border-white/12 bg-white/5 p-5 text-left transition-colors hover:border-[#a78bfa]/40"
            >
              {body}
            </button>
          );
        })}
      </div>
    </section>
  );
}


/**
 * Форма консультации: тема обращения и удобное время звонка.
 *
 * Тема выбирается списком, а не вводится текстом: клиент уже знает, с чем
 * пришёл, и не должен это формулировать. Время звонка — обязательная часть
 * заявки, поэтому выбор делается кнопками: так человек сразу говорит, когда
 * ему удобно, и юристу не нужно угадывать.
 */
export function Request({
  interactive = false,
  topic,
  slot,
  name,
  phone,
  sent,
  errors,
  topics,
  slots,
  onTopic,
  onSlot,
  onName,
  onPhone,
  onSubmit,
}: {
  interactive?: boolean;
  topic?: string;
  slot?: string;
  name?: string;
  phone?: string;
  sent?: boolean;
  errors?: { name?: string; phone?: string };
  topics: readonly string[];
  slots: readonly string[];
  onTopic?: (v: string) => void;
  onSlot?: (v: string) => void;
  onName?: (v: string) => void;
  onPhone?: (v: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
}) {
  const inputCls = (bad?: string) =>
    `rounded-lg border bg-white/5 px-3 py-2.5 outline-none transition-colors placeholder:text-white/35 ${
      bad ? "border-red-400/70" : "border-white/20 focus:border-[#a78bfa]"
    }`;

  return (
    <section id="request" className="mx-auto max-w-5xl scroll-mt-16 px-4 py-12">
      <div className="rounded-2xl border border-white/12 bg-white/5 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold">Консультация</h2>
        <p className="mt-2 text-sm text-white/65">
          Разберём ситуацию и скажем, есть ли смысл продолжать. Звонок до 20 минут, без обязательств.
        </p>

        {sent ? (
          <div className="mt-6 rounded-xl border border-[#34d399]/50 bg-[#34d399]/10 p-5">
            <div className="font-medium text-[#34d399]">Заявка отправлена</div>
            <p className="mt-1 text-sm text-white/70">
              Спасибо, {name?.trim()}. Перезвоним {slot ? `когда удобно (${slot})` : "в ближайшее время"}.
              В предпросмотре ничего не уходит — на реальном сайте заявка пришла бы юристу.
            </p>
          </div>
        ) : (
          <form onSubmit={interactive ? onSubmit : undefined} className="mt-6 grid gap-5" noValidate>
            <fieldset className="grid gap-2.5">
              <legend className="text-sm">Тема обращения</legend>
              <div className="flex flex-wrap gap-2">
                {topics.map((t) => {
                  const cls = `rounded-full px-3.5 py-2 text-sm transition-colors ${
                    topic === t
                      ? "bg-[#a78bfa] text-[#14101f]"
                      : "bg-white/10 text-white/75 hover:bg-white/15"
                  }`;
                  if (!onTopic)
                    return (
                      <span key={t} className={cls}>
                        {t}
                      </span>
                    );
                  return (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={topic === t}
                      onClick={() => onTopic(t)}
                      className={cls}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="grid gap-2.5">
              <legend className="text-sm">Когда удобно принять звонок</legend>
              <div className="flex flex-wrap gap-2">
                {slots.map((s) => {
                  const cls = `rounded-full px-3.5 py-2 text-sm transition-colors ${
                    slot === s
                      ? "bg-[#a78bfa] text-[#14101f]"
                      : "bg-white/10 text-white/75 hover:bg-white/15"
                  }`;
                  if (!onSlot)
                    return (
                      <span key={s} className={cls}>
                        {s}
                      </span>
                    );
                  return (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={slot === s}
                      onClick={() => onSlot(s)}
                      className={cls}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[#a78bfa] py-3 text-sm font-semibold text-[#14101f] transition-opacity hover:opacity-90"
            >
              Записаться на консультацию
            </button>
            <p className="text-center text-[0.72rem] text-white/45">
              Данные не передаём третьим лицам. Бесплатно и без договора.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}


