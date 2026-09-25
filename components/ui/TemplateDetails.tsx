import type { Template } from "@/lib/content";

/**
 * Что в шаблоне можно менять, а что остаётся как есть.
 *
 * Клиенту важно понимать границу: иначе кажется, что «купил шаблон —
 * и всё, что внутри, нельзя тронуть». На самом деле настраивается почти
 * всё, и фиксировано ровно то, что нельзя менять без потери смысла
 * (расположение кнопок, логика формы, вёрстка под мобильные).
 */
export type Flexibility = {
  /** Меняется под клиента — это основа шаблона. */
  editable: { title: string; note: string }[];
  /** Остаётся как есть: расположение кнопок, поведение формы и т.п. */
  fixed: { title: string; note: string }[];
};

const flex: Flexibility = {
  editable: [
    { title: "Тексты и разделы", note: "Заголовки, описания, состав блоков — под ваш бизнес." },
    { title: "Цвета, шрифты, графика", note: "Палитра и начертания под бренд." },
    { title: "Фото и видео", note: "Сток закрываем вашими работами." },
    { title: "Разделы каталога и услуг", note: "Добавляем, убираем, переименовываем." },
    { title: "Формы и интеграции", note: "Куда уходят заявки: почта, мессенджер, CRM." },
  ],
  fixed: [
    { title: "Расположение кнопок", note: "Кнопка заявки всегда на своём месте — так работает привычка." },
    { title: "Поведение формы", note: "Проверка полей, защита от спама, подтверждение." },
    { title: "Вёрстка под мобильные", note: "Адаптив проверен и не ломается." },
    { title: "Быстрые показатели", note: "Скорость, безопасность, базовая SEO-разметка." },
  ],
};

/** Подпись-метка «меняется / остаётся» внутри разбора. */
function Tag({ kind }: { kind: "editable" | "fixed" }) {
  const editable = kind === "editable";
  return (
    <span
      className="shrink-0 rounded-full px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em]"
      style={
        editable
          ? { background: "color-mix(in oklab, #34d399 20%, transparent)", color: "#34d399" }
          : { background: "color-mix(in oklab, #fbbf24 20%, transparent)", color: "#fbbf24" }
      }
    >
      {editable ? "меняется" : "остаётся"}
    </span>
  );
}

/**
 * Что в шаблоне меняется, а что остаётся как есть.
 *
 * Клиенту важно понимать границу: иначе кажется, что «купил шаблон — и всё,
 * что внутри, нельзя тронуть». На самом деле настраивается почти всё, и
 * фиксировано ровно то, что нельзя менять без потери смысла (расположение
 * кнопок, механика формы, адаптив).
 */
export function TemplateFlex() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center gap-2">
          <Tag kind="editable" />
          <h3 className="text-[1.05rem] font-semibold">Меняется под вас</h3>
        </div>
        <p className="mt-2 text-[0.88rem] leading-relaxed text-[var(--muted)]">
          Это и есть шаблон: готовая структура, которую мы переделываем под ваш бизнес.
        </p>
        <ul className="mt-5 grid gap-3">
          {flex.editable.map((e) => (
            <li key={e.title} className="flex gap-2.5">
              <svg viewBox="0 0 20 20" className="mt-[3px] h-4 w-4 shrink-0" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 10.5l4 4 8-9" />
              </svg>
              <div>
                <div className="text-[0.9rem] font-medium">{e.title}</div>
                <div className="mt-0.5 text-[0.82rem] leading-relaxed text-[var(--muted)]">{e.note}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="glass rounded-3xl p-6">
        <div className="flex items-center gap-2">
          <Tag kind="fixed" />
          <h3 className="text-[1.05rem] font-semibold">Остаётся как есть</h3>
        </div>
        <p className="mt-2 text-[0.88rem] leading-relaxed text-[var(--muted)]">
          Немногое, и это не ваш бренд, а механика: держим, чтобы всё работало.
        </p>
        <ul className="mt-5 grid gap-3">
          {flex.fixed.map((f) => (
            <li key={f.title} className="flex gap-2.5">
              <svg viewBox="0 0 20 20" className="mt-[3px] h-4 w-4 shrink-0" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 4v7l4 2" />
              </svg>
              <div>
                <div className="text-[0.9rem] font-medium">{f.title}</div>
                <div className="mt-0.5 text-[0.82rem] leading-relaxed text-[var(--muted)]">{f.note}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Детальный макет экрана шаблона.
 *
 * В отличие от схемы в TemplatePreview (уменьшенной и обезличенной) здесь
 * экран показан ближе к натуральной величине и с правдоподобным
 * содержимым: видно, где стоят заголовки, кнопки и фотографии. Схема
 * отвечала на вопрос «какие блоки внутри», макет — «как это выглядит».
 *
 * Подпись «будет ваше фото» — не украшение: почти каждая картинка в
 * шаблоне меняется на материалы клиента, и это надо показать честно.
 */
export default function TemplateMockup({
  t,
  variant,
}: {
  t: Template;
  variant: "hero" | "gallery" | "price" | "form";
}) {
  const [bg, accent, extra] = t.preview;
  const frame = "relative overflow-hidden rounded-2xl";
  const dot = (c: string) => <span className="h-2 w-2 rounded-full" style={{ background: c }} />;
  const browser = (label: string) => (
    <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
      {dot("#ff5f57")}
      {dot("#febc2e")}
      {dot("#28c840")}
      <span className="ml-2 text-[0.5rem] opacity-40" style={{ color: "#fff" }}>
        {label}
      </span>
    </div>
  );

  if (variant === "hero")
    return (
      <div className={frame} style={{ background: bg }}>
        {browser("вашсайт.рф")}

        {/* Шапка: лого слева, ссылки по центру, кнопка справа */}
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="text-[0.6rem] font-semibold" style={{ color: accent }}>
            LUMINA
          </span>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-[0.5rem] opacity-50" style={{ color: "#fff" }}>Портфолио</span>
            <span className="text-[0.5rem] opacity-50" style={{ color: "#fff" }}>Услуги</span>
            <span className="text-[0.5rem] opacity-50" style={{ color: "#fff" }}>Отзывы</span>
            {/* Кнопка: место не меняется, меняется текст */}
            <span className="rounded-full px-2.5 py-1 text-[0.5rem] font-semibold" style={{ background: accent, color: bg }}>
              Записаться
            </span>
          </div>
        </div>

        <div className="relative px-4 pb-4 pt-6">
          <div className="text-[0.95rem] font-semibold leading-tight" style={{ color: "#fff" }}>
            Свадебная
            <br />
            фотография
          </div>
          <div className="mt-1.5 text-[0.55rem] opacity-60" style={{ color: "#fff" }}>
            Тёплые кадры о вашем дне
          </div>
          <div
            className="relative mt-3 flex h-24 items-end justify-between rounded-xl p-2"
            style={{ background: `linear-gradient(140deg, ${accent}55, ${extra}33)` }}
          >
            <span className="rounded-full bg-black/40 px-2 py-1 text-[0.5rem] text-white/80">будет ваше фото</span>
            <span className="rounded-full px-2.5 py-1 text-[0.5rem] font-semibold" style={{ background: accent, color: bg }}>
              Смотреть работы
            </span>
          </div>
        </div>
      </div>
    );

  if (variant === "gallery")
    return (
      <div className={frame} style={{ background: bg }}>
        {browser("галерея")}

        <div className="px-3 pt-3 text-[0.6rem] font-semibold" style={{ color: "#fff" }}>Портфолио</div>
        {/* Фильтр по категориям — наполняется работами клиента */}
        <div className="mt-2 flex gap-1.5 px-3">
          {["Все", "Свадьбы", "Портреты", "Семья"].map((c, i) => (
            <span
              key={c}
              className="rounded-full px-2 py-0.5 text-[0.5rem]"
              style={i === 0 ? { background: accent, color: bg } : { background: `${accent}22`, color: `${accent}cc` }}
            >
              {c}
            </span>
          ))}
        </div>

        <div className="mt-2.5 grid grid-cols-3 gap-1.5 px-3 pb-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="relative flex aspect-[3/4] items-end rounded-lg p-1"
              style={{ background: `linear-gradient(${140 + i * 25}deg, ${i % 2 ? extra : accent}44, #ffffff12)` }}
            >
              <span className="text-[0.4rem] leading-tight text-white/60">ваше фото</span>
            </div>
          ))}
        </div>
      </div>
    );

  if (variant === "price")
    return (
      <div className={frame} style={{ background: bg }}>
        {browser("услуги")}

        <div className="px-3 pt-3 text-[0.6rem] font-semibold" style={{ color: "#fff" }}>Услуги и цены</div>
        <div className="grid grid-cols-3 gap-1.5 p-3">
          {["Съёмка 2 часа", "Полный день", "Предсъёмка"].map((p, i) => (
            <div
              key={p}
              className="relative rounded-lg p-1.5"
              style={
                i === 1
                  ? { background: `${accent}26`, border: `1px solid ${accent}88` }
                  : { background: "#ffffff0f", border: "1px solid #ffffff1a" }
              }
            >
              {i === 1 && (
                <span
                  className="absolute -top-1.5 left-1/2 -translate-x-1/2 rounded-full px-1.5 py-0.5 text-[0.4rem] font-semibold"
                  style={{ background: accent, color: bg }}
                >
                  популярный
                </span>
              )}
              <div className="text-[0.5rem] font-medium" style={{ color: "#fff" }}>{p}</div>
              <div className="mt-1 h-1 w-8 rounded-full" style={{ background: `${accent}66` }} />
              <div className="mt-1.5 space-y-0.5">
                {[0, 1].map((r) => (
                  <div key={r} className="h-1 rounded-full" style={{ width: `${70 + r * 15}%`, background: "#ffffff22" }} />
                ))}
              </div>
              <div className="mt-2 text-[0.6rem] font-semibold" style={{ color: accent }}>от 15 000 ₽</div>
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <div className={frame} style={{ background: bg }}>
      {browser("заявка")}

      <div className="grid grid-cols-2 gap-3 p-3">
        <div>
          <div className="text-[0.6rem] font-semibold" style={{ color: "#fff" }}>Расскажите о дате</div>
          <div className="mt-1 space-y-0.5">
            {[0, 1, 2].map((r) => (
              <div key={r} className="h-1 rounded-full" style={{ width: `${85 - r * 20}%`, background: "#ffffff2a" }} />
            ))}
          </div>
          {/* Отзывы — тексты меняются полностью */}
          <div className="mt-3 space-y-1.5">
            <div className="rounded-lg p-1.5" style={{ background: "#ffffff0f" }}>
              <div className="text-[0.5rem]" style={{ color: extra }}>★★★★★</div>
              <div className="mt-0.5 h-1 w-full rounded-full" style={{ background: "#ffffff22" }} />
              <div className="mt-0.5 h-1 w-2/3 rounded-full" style={{ background: "#ffffff22" }} />
            </div>
          </div>
        </div>

        <div className="rounded-lg p-2" style={{ background: "#ffffff0d", border: "1px solid #ffffff1a" }}>
          <div className="text-[0.5rem] font-semibold" style={{ color: "#fff" }}>Заявка</div>
          {/* Поля формы: подписи меняются, механика — нет */}
          {["Имя", "Телефон", "Дата"].map((f) => (
            <div key={f} className="mt-1.5 rounded border border-white/15 px-1.5 py-1 text-[0.45rem] opacity-50" style={{ color: "#fff" }}>
              {f}
            </div>
          ))}
          <span className="mt-2 block rounded-full py-1 text-center text-[0.5rem] font-semibold" style={{ background: accent, color: bg }}>
            Отправить
          </span>
        </div>
      </div>
    </div>
  );
}