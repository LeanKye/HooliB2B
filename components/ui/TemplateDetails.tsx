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
