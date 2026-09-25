import type { Template } from "@/lib/content";

/**
 * Превью шаблона — схематичный макет страницы, собранный из обычных блоков.
 *
 * Намеренно НЕ скриншот: картинок в проекте нет, а каталог без визуала
 * шаблоны не продаёт. Схема честно показывает структуру (шапка, блоки,
 * форма), а не конкретный дизайн, и не врёт, обещая «вот как будет
 * выглядеть ваш сайт». Когда появятся настоящие скриншоты, достаточно
 * добавить поле `image` в Template и заменить этот компонент на <img> —
 * данные и вёрстка карточки не поменяются.
 *
 * Цвета берутся из `preview` в данных, поэтому все макеты узнаваемо
 * различаются и не выглядят копией одного и того же.
 */
export default function TemplatePreview({ t, className = "" }: { t: Template; className?: string }) {
  const [bg, accent, extra] = t.preview;
  const bar = "rounded-sm";

  return (
    <div
      aria-hidden
      className={`relative aspect-[16/10] w-full overflow-hidden ${className}`}
      style={{ background: bg }}
    >
      {/* шапка: логотип-квадрат + две «ссылки» + кнопка */}
      <div className="flex items-center gap-2 px-4 pt-4">
        <span className={bar} style={{ width: 18, height: 18, background: accent }} />
        <span className="flex gap-1.5">
          <span className={bar} style={{ width: 26, height: 6, background: `${accent}66` }} />
          <span className={bar} style={{ width: 20, height: 6, background: `${accent}40` }} />
          <span className={bar} style={{ width: 14, height: 6, background: `${accent}40` }} />
        </span>
        <span className="ml-auto rounded-sm" style={{ width: 34, height: 13, background: accent }} />
      </div>

      {/* первый экран: заголовок в две строки + подзаголовок */}
      <div className="px-4 pt-5">
        <div className="rounded-sm" style={{ width: "58%", height: 11, background: "#ffffffcc" }} />
        <div className="mt-1.5 rounded-sm" style={{ width: "38%", height: 11, background: "#ffffff88" }} />
        <div className="mt-2.5 rounded-sm" style={{ width: "66%", height: 5, background: "#ffffff33" }} />
        <div className="mt-1 rounded-sm" style={{ width: "48%", height: 5, background: "#ffffff33" }} />
        <div className="mt-3 flex gap-1.5">
          <span className="rounded-sm" style={{ width: 52, height: 14, background: accent }} />
          <span className="rounded-sm" style={{ width: 40, height: 14, background: "#ffffff22" }} />
        </div>
      </div>

      {t.kind === "full" ? (
        /* Полноценный сайт: сетка карточек — каталог или портфолио. */
        <div className="mt-5 grid grid-cols-3 gap-1.5 px-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-sm"
              style={{
                height: 30,
                background: i === 1 ? `${extra}55` : "#ffffff1a",
                border: `1px solid ${i === 1 ? `${extra}66` : "#ffffff1f"}`,
              }}
            />
          ))}
        </div>
      ) : (
        /* Визитка: широкая карточка с «текстом» и боковой формой. */
        <div className="mt-5 flex gap-1.5 px-4">
          <div className="flex-1 rounded-sm bg-[#ffffff14] p-1.5">
            <div className="rounded-sm" style={{ width: "70%", height: 5, background: "#ffffff44" }} />
            <div className="mt-1.5 rounded-sm" style={{ width: "88%", height: 4, background: "#ffffff22" }} />
            <div className="mt-1 rounded-sm" style={{ width: "60%", height: 4, background: "#ffffff22" }} />
          </div>
          <div
            className="w-1/3 rounded-sm"
            style={{ background: `${accent}26`, border: `1px solid ${accent}55` }}
          />
        </div>
      )}

      {/* полоса «时下лан/подвал» — отделяет макет от края карточки */}
      <div
        className="absolute inset-x-0 bottom-0 h-6"
        style={{ background: "#00000038", borderTop: "1px solid #ffffff1a" }}
      />
    </div>
  );
}