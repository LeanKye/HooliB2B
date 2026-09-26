import { CATS, PACKAGES, REVIEWS, WORKS } from "./lumina/data";
import { Hero, Portfolio, Prices, Request, Reviews } from "./lumina/sections";

/**
 * Экраны шаблона на странице `/templates/lumina-wedding` — «скриншоты».
 *
 * Раньше эти макеты были нарисованы вручную голыми div-ами, и именно
 * поэтому они разошлись с живым предпросмотром: правился один — второй
 * оставался старым. Теперь здесь рендерятся те же секции из
 * `lumina/sections.tsx`, что и в предпросмотре, просто в уменьшенном виде.
 * Расхождение стало невозможным по построению: поменяли секцию — макет
 * покажет новое состояние автоматически.
 *
 * Как уменьшаем. Секции свёрстаны под `max-w-5xl` (1024 px) и настраиваются
 * по ширине окна, а не контейнера (обычные `sm:`/`lg:`). Если просто втиснуть
 * их в колонку 480 px, вёрстка останется десктопной, а текст окажется
 * втрое крупнее — получится не скриншот, а увеличенный фрагмент. Поэтому
 * секция рендерится в натуральную ширину 1024 px, а `zoom` уменьшает её
 * вместе с занимаемым местом: рамка схлопывается ровно под контент, и
 * высоту угадывать не нужно.
 *
 * `zoom`, а не `transform: scale`: у трансформации не меняется layout, и
 * рамка осталась бы высотой с неуменьшенную секцию — то есть с дырой внизу.
 */

/** Собственная ширина секций — ровно то, что видит посетитель на десктопе. */
const NATURAL_W = 1024;

/**
 * Коэффициенты под брейкпоинты страницы шаблона. Считались от фактической
 * ширины колонки: 1024 − отступы − две колонки − рамка фигуры.
 */
const K = "[--k:0.3] sm:[--k:0.26] lg:[--k:0.36] xl:[--k:0.46]";

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
 * Рамка одного экрана. Тёмная база совпадает с фоном шаблона (#17111c),
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
    <div className="overflow-hidden rounded-2xl bg-[#17111c] text-white">
      <Chrome label={label} />
      <div className={`${K} overflow-hidden`} style={{ maxHeight: maxH }}>
        <div
          className="mx-auto origin-top-left"
          style={{ width: NATURAL_W, zoom: "var(--k)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/** Градиент у нижней кромки: даёт понять, что страница продолжается. */
function Fade() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#17111c] to-transparent" />
  );
}

type Variant = "hero" | "gallery" | "price" | "form";

/**
 * Один экран шаблона. Компонент остаётся серверным: обработчики сюда не
 * передаются, поэтому клиентский JS на странице шаблона не растёт.
 */
export function LuminaScreen({ variant }: { variant: Variant }) {
  if (variant === "hero")
    return (
      <div className="relative">
        <Frame label="вашсайт.рф" maxH="19rem">
          <Hero />
        </Frame>
      </div>
    );

  if (variant === "gallery")
    return (
      <div className="relative">
        <Frame label="вашсайт.рф#portfolio" maxH="21rem">
          <Portfolio cat="all" cats={CATS} shown={WORKS} />
        </Frame>
        <Fade />
      </div>
    );

  if (variant === "price")
    return (
      <div className="relative">
        <Frame label="вашсайт.рф#prices" maxH="16rem">
          <Prices packages={PACKAGES} />
        </Frame>
      </div>
    );

  return (
    <div className="relative">
      <Frame label="вашсайт.рф#request" maxH="24rem">
        <Reviews reviews={REVIEWS} />
        <Request />
      </Frame>
      <Fade />
    </div>
  );
}
