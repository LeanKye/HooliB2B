import { ITEMS, REVIEWS } from "./atelier/data";
import { Catalog, Hero, Order, Reviews } from "./atelier/sections";

/**
 * Экраны шаблона на странице `/templates/atelier-bakery` — «скриншоты».
 *
 * Рендерятся теми же секциями, что и живой предпросмотр, просто
 * уменьшенными. Раньше такие макеты рисовались вручную, и они
 * разошлись с предпросмотром: правился один — второй устаревал.
 * Здесь расхождение невозможно по построению.
 *
 * Как уменьшаем. Секции свёрстаны под `max-w-5xl` (1024 px) и
 * настраиваются по ширине окна, а не контейнера. Если просто втиснуть их
 * в колонку 480 px, вёрстка останется десктопной, а текст окажется
 * втрое крупнее — получится не скриншот, а увеличенный фрагмент.
 * Поэтому секция рендерится в натуральную ширину 1024 px, а `zoom`
 * уменьшает её вместе с занимаемым местом.
 *
 * `zoom`, а не `transform: scale`: у трансформации не меняется layout, и
 * рамка осталась бы высотой с неуменьшенную секцию — то есть с дырой внизу.
 */

/** Собственная ширина секций — ровно то, что видит посетитель на десктопе. */
const NATURAL_W = 1024;

/** Коэффициенты под брейкпоинты страницы шаблона. */
const K = "[--k:0.3] sm:[--k:0.26] lg:[--k:0.36] xl:[--k:0.46]";

/**
 * Превью для карточки в каталоге. Сетка там на три колонки, поэтому
 * коэффициент меньше. Чуть меньше нужного: обрезка снизу читается как
 * «страница продолжается», а тёмные поля — как окно браузера.
 */
const CARD_K = "[--k:0.27] lg:[--k:0.3]";

/**
 * Превью шаблона для карточки в каталоге `/` — настоящий первый экран.
 *
 * Раньше все карточки рисовались одной обобщённой схемой и отличались
 * только цветом, поэтому каталог выглядел одинаковым. Теперь у
 * проработанного шаблона стоит его собственный первый экран.
 */
export function AtelierCardPreview({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative aspect-[16/10] w-full overflow-hidden bg-[#241a0c] text-white ${className}`}
    >
      <div
        className={`${CARD_K} absolute inset-x-0 top-0 mx-auto`}
        style={{ width: NATURAL_W, zoom: "var(--k)" }}
      >
        <Hero />
      </div>
    </div>
  );
}

/** Полоса браузера: макет должен читаться как скриншот, а не как блок сайта. */
function Chrome({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/5 px-3 py-2">
      <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
      <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
      <span className="h-2 w-2 rounded-full bg-[#28c840]" />
      <span className="ml-2 truncate text-[0.6rem] text-white/40">{label}</span>
    </div>
  );
}

/**
 * Рамка одного экрана. Тёмная база совпадает с фоном шаблона (#241a0c),
 * поэтому низ обрезанной страницы не выдаёт себя чужой подложкой.
 */
function Frame({
  label,
  maxH,
  children,
}: {
  label: string;
  /** Обрезка снизу: длинные экраны показываем не целиком, как на скриншоте. */
  maxH: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-[#241a0c] text-white">
      <Chrome label={label} />
      <div className={`${K} overflow-hidden`} style={{ maxHeight: maxH }}>
        <div className="mx-auto origin-top-left" style={{ width: NATURAL_W, zoom: "var(--k)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Градиент у нижней кромки: даёт понять, что страница продолжается. */
function Fade() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#241a0c] to-transparent" />
  );
}

type Variant = "hero" | "catalog" | "order" | "reviews";

/**
 * Один экран шаблона. Компонент остаётся серверным: обработчики сюда не
 * передаются, поэтому клиентский JS на странице шаблона не растёт.
 */
export function AtelierScreen({ variant }: { variant: Variant }) {
  if (variant === "hero")
    return (
      <div className="relative">
        <Frame label="вашсайт.рф" maxH="19rem">
          <Hero />
        </Frame>
      </div>
    );

  if (variant === "catalog")
    return (
      <div className="relative">
        <Frame label="вашсайт.рф#catalog" maxH="21rem">
          <Catalog cat="all" shown={ITEMS} />
        </Frame>
        <Fade />
      </div>
    );

  if (variant === "order")
    return (
      <div className="relative">
        <Frame label="вашсайт.рф#order" maxH="22rem">
          <Order items={ITEMS} />
        </Frame>
      </div>
    );

  return (
    <div className="relative">
      <Frame label="вашсайт.рф#reviews" maxH="16rem">
        <Reviews reviews={REVIEWS} />
      </Frame>
    </div>
  );
}
