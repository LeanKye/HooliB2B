import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { templates } from "@/lib/content";
import Reveal from "@/components/ui/Reveal";
import TemplatePreview from "@/components/ui/TemplatePreview";
import { TemplateFlex } from "@/components/ui/TemplateDetails";
import { AtelierScreen } from "@/components/templates/AtelierScreens";
import { LuminaScreen } from "@/components/templates/LuminaScreens";

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = templates.find((x) => x.slug === slug);
  if (!t) return { title: "Шаблон не найден — HooliB2B" };
  return {
    title: `Шаблон «${t.name}» — HooliB2B`,
    description: t.summary,
  };
}

/**
 * Плейсхолдер одного скриншота.
 *
 * Сейчас на их месте — CSS-схема страницы (TemplatePreview), потому что
 * изображений в проекте нет. Схема показывает структуру, а не дизайн, и
 * подписана подсказкой «что будет на кадре»: когда появится настоящий
 * скриншот, его достаточно положить в `public/templates/<slug>/<n>.jpg`
 * и подставить в `src` — разметка не изменится.
 */
function Shot({
  shot,
  t,
}: {
  shot: (typeof templates)[number]["shots"][number];
  t: (typeof templates)[number];
}) {
  return (
    <figure className="glass overflow-hidden rounded-3xl p-3">
      <div className="overflow-hidden rounded-2xl">
        <TemplatePreview t={t} />
      </div>
      <figcaption className="px-1 pt-3">
        <div className="text-[0.9rem] font-semibold">{shot.caption}</div>
        <div className="mt-1 text-[0.8rem] leading-relaxed text-[var(--muted)]">{shot.hint}</div>
      </figcaption>
    </figure>
  );
}

/** Подпись под макетом экрана: что это и на что смотреть. */
function Figure({
  caption,
  hint,
  children,
}: {
  caption: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="glass overflow-hidden rounded-3xl p-3">
      <div className="overflow-hidden rounded-2xl">{children}</div>
      <figcaption className="px-1 pt-4">
        <div className="text-[0.95rem] font-semibold">{caption}</div>
        <p className="mt-1 text-[0.85rem] leading-relaxed text-[var(--muted)]">{hint}</p>
      </figcaption>
    </figure>
  );
}

/**
 * Экраны шаблона: подпись и как этот экран получить.
 *
 * Описания живут здесь, а не в разметке страницы, потому что у каждого
 * шаблона свой набор экранов. Иначе страница шаблона знала бы про
 * «Ателье» и Lumina поимённо и разрасталась правкой на каждый новый
 * шаблон — ровно то, из-за чего макеты раньше и разошлись с предпросмотром.
 */
type Screen = { variant: string; caption: string; hint: string; render: () => React.ReactNode };

const SCREENS: Record<string, Screen[]> = {
  "lumina-wedding": [
    {
      variant: "hero",
      caption: "Первый экран",
      hint: "Заголовок, кнопки и мозаика из четырёх кадров. Одно «главное» фото сюда не ставим: фотографу нужно показать диапазон работ, а не стоковую картинку. Место кнопок не двигаем, меняем текст.",
      render: () => <LuminaScreen variant="hero" />,
    },
    {
      variant: "gallery",
      caption: "Портфолио",
      hint: "Сетка работ с фильтром по категориям. Категории и снимки — ваши, мы только настраиваем сетку и лёгкое увеличение по клику.",
      render: () => <LuminaScreen variant="gallery" />,
    },
    {
      variant: "price",
      caption: "Услуги и цены",
      hint: "Три пакета карточками, средний выделен бейджем и поднят. Состав пакетов и цены — полностью ваши.",
      render: () => <LuminaScreen variant="price" />,
    },
    {
      variant: "form",
      caption: "Заявка и отзывы",
      hint: "Отзывы держим рядом с формой: человек читает чужой опыт и только потом оставляет заявку. Поля формы настраиваем под вас.",
      render: () => <LuminaScreen variant="form" />,
    },
  ],
  "atelier-bakery": [
    {
      variant: "hero",
      caption: "Первый экран",
      hint: "Акция дня, кнопки и витрина из трёх позиций с ценой и весом. Для пекарни это решает исход: человек смотрит с телефона по дороге и решает за минуту.",
      render: () => <AtelierScreen variant="hero" />,
    },
    {
      variant: "catalog",
      caption: "Меню",
      hint: "Каталог с фильтром по категориям. Кнопка «+» складывает позицию в корзину — ассортимент и цены полностью ваши.",
      render: () => <AtelierScreen variant="catalog" />,
    },
    {
      variant: "order",
      caption: "Заказ",
      hint: "Корзина, итог и форма без регистрации. Заказ уходит в мессенджер, оплата при получении — так и покупают с проходимости.",
      render: () => <AtelierScreen variant="order" />,
    },
    {
      variant: "reviews",
      caption: "Отзывы",
      hint: "Отзывы с площадок-агрегаторов или из ваших соцсетей. Для маленького бренда доверие решает больше, чем дизайн.",
      render: () => <AtelierScreen variant="reviews" />,
    },
  ],
};

export default async function TemplatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = templates.find((x) => x.slug === slug);
  if (!t) notFound();

  const isFull = t.kind === "full";
  // Подробные макеты экранов делаем по одному шаблону: детальная проработка
  // занимает много текста, а показывать её везде одинаково незачем.
  const isDetailed = t.detailed === true;

  return (
    <main className="relative pb-[calc(var(--safe-bottom)+5rem)] pl-[calc(var(--safe-left)+1.25rem)] pr-[calc(var(--safe-right)+1.25rem)] pt-[calc(var(--safe-top)+7rem)] sm:pl-[calc(var(--safe-left)+2rem)] sm:pr-[calc(var(--safe-right)+2rem)] sm:pt-[calc(var(--safe-top)+8rem)] lg:pl-48">
      <div className="mx-auto w-full max-w-5xl">
        <Reveal>
          <Link
            href="/#templates"
            className="glass-nav inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[0.85rem] font-medium text-[var(--muted)] hover:text-[var(--fg)]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Все шаблоны
          </Link>
        </Reveal>

        <Reveal delay={60}>
          <div className="glass-strong relative mt-6 overflow-hidden rounded-[2rem] p-7 sm:p-10">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(110% 120% at 0% 0%, color-mix(in oklab, ${t.accent} 26%, transparent), transparent 55%)`,
              }}
            />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em]"
                  style={{ background: `color-mix(in oklab, ${t.accent} 20%, transparent)`, color: t.accent }}
                >
                  {isFull ? "Полноценный сайт" : "Сайт-визитка"}
                </span>
                <span className="text-[0.85rem] text-[var(--muted)]">{t.industry}</span>
              </div>

              <h1 className="mt-4 text-[2rem] font-semibold sm:text-[2.8rem]">Шаблон «{t.name}»</h1>
              <p className="mt-4 max-w-3xl text-[1.02rem] leading-relaxed text-[var(--muted)]">{t.summary}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {t.blocks.map((b) => (
                  <span key={b} className="pill rounded-full border border-[var(--border)] px-3.5 py-1.5 text-[0.78rem] text-[var(--muted)]">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/*
         * Предпросмотр — главная кнопка страницы. Скриншоты и макеты
         * показывают вёрстку, а живой предпросмотр отвечает на вопрос
         * «а как это работает»: фильтр фильтрует, форма проверяет поля,
         * на телефоне включается бургер-меню. Ссылка ведёт на отдельную
         * страницу, а не открывает окно, чтобы предпросмотр можно было
         * скинуть клиенту ссылкой.
         */}
        {isDetailed && (
          <Reveal delay={80}>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href={`/templates/${t.slug}/preview/`}
                className="glass-strong inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[0.95rem] font-semibold transition-transform duration-300 hover:scale-[1.03]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
                  <path d="M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                </svg>
                Открыть живой предпросмотр
              </Link>
              <span className="text-[0.85rem] text-[var(--muted)]">
                Можно нажать кнопки, отфильтровать работы и заполнить форму
              </span>
            </div>
          </Reveal>
        )}

        {/* Кому подойдёт — отвечает на главный вопрос каталога */}
        <Reveal delay={100}>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="glass rounded-3xl p-6">
              <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.16em]" style={{ color: t.accent }}>
                Кому подойдёт
              </h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--muted)]">{t.whoFor}</p>
            </div>
            <div className="glass rounded-3xl p-6">
              <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Что меняем под вас
              </h2>
              <ul className="mt-3 grid gap-2">
                {t.customizes.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-[0.9rem] text-[var(--muted)]">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: t.accent }} />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* Разбор блоков: зачем каждый нужен бизнесу */}
        <Reveal delay={140}>
          <div className="glass mt-6 rounded-[2rem] p-7 sm:p-10">
            <h2 className="text-[1.35rem] font-semibold">Что внутри и зачем</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {t.blockNotes.map((b, i) => (
                <div key={b.block} className="flex gap-3">
                  <span
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[0.8rem] font-semibold"
                    style={{ background: `color-mix(in oklab, ${t.accent} 18%, transparent)`, color: t.accent }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <div className="text-[0.95rem] font-semibold">{b.block}</div>
                    <p className="mt-1 text-[0.88rem] leading-relaxed text-[var(--muted)]">{b.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/*
         * Экраны шаблона. Для разработанного шаблона (isDetailed) показываем
         * полноценные макеты вблизи к натуральной величине — с кнопками,
         * полями формы и подписью «будет ваше фото» там, где клиент
         * подставит свой контент. Для остальных остаётся общая схема.
         */}
        {isDetailed ? (
          <Reveal delay={180}>
            <div className="mt-6">
              <h2 className="text-[1.35rem] font-semibold">Экраны шаблона</h2>
              <p className="mt-2 max-w-3xl text-[0.92rem] leading-relaxed text-[var(--muted)]">
                Это разбор вёрстки: видно, где стоят заголовки, кнопки и фотографии.
                Надписи «ваше фото» — не украшение, а честная пометка: почти каждая
                картинка меняется на материалы клиента. Цвета, шрифты и графика
                подбираются под бренд, поэтому точный вид каждого экрана
                складывается уже вместе с вами.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {SCREENS[t.slug]?.map((s) => (
                  <Figure key={s.variant} caption={s.caption} hint={s.hint}>
                    {s.render()}
                  </Figure>
                ))}
              </div>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={180}>
            <div className="mt-6">
              <h2 className="text-[1.35rem] font-semibold">Как выглядит</h2>
              <p className="mt-2 max-w-3xl text-[0.92rem] leading-relaxed text-[var(--muted)]">
                Сейчас здесь схемы: они показывают структуру экрана, а не финальный дизайн.
                Точные цвета, шрифты и графика всегда подбираются под бренд клиента — именно
                поэтому показать «как будет» заранее нельзя, можно показать структуру.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {t.shots.map((s) => (
                  <Shot key={s.caption} shot={s} t={t} />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* Граница настраиваемого: почти всё меняется, фиксирована механика */}
        <Reveal delay={220}>
          <div className="mt-6">
            <h2 className="text-[1.35rem] font-semibold">Что можно менять</h2>
            <p className="mt-2 max-w-3xl text-[0.92rem] leading-relaxed text-[var(--muted)]">
              Шаблон — это заготовка под задачу, а не готовый сайт, который нельзя
              трогать. Настраивается практически всё, что видит посетитель.
            </p>
            <div className="mt-5">
              <TemplateFlex />
            </div>
          </div>
        </Reveal>

        {/* Что нужно от клиента — убирает первый круг вопросов */}
        <Reveal delay={220}>
          <div className="glass mt-6 rounded-[2rem] p-7 sm:p-10">
            <h2 className="text-[1.35rem] font-semibold">Что нужно от вас для запуска</h2>
            <p className="mt-2 text-[0.92rem] text-[var(--muted)]">
              Этот список обсуждаем до начала работ — он определяет сроки.
            </p>
            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {t.needsAssets.map((n) => (
                <div key={n} className="flex items-start gap-2.5 rounded-2xl border border-[var(--border)] p-3.5 text-[0.9rem] text-[var(--muted)]">
                  <svg viewBox="0 0 20 20" className="mt-[2px] h-4 w-4 shrink-0" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 4.5l1.4 3.4 3.6 1.3-3.6 1.3L10 14l-1.4-3.5L5 9.2l3.6-1.3L10 4.5Z" />
                  </svg>
                  {n}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={260}>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/#contact"
              className="glass-strong inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[0.95rem] font-semibold transition-transform duration-300 hover:scale-[1.03]"
            >
              Хочу такой шаблон
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link
              href="/#templates"
              className="glass-nav rounded-full px-7 py-3.5 text-[0.95rem] font-medium text-[var(--muted)] hover:text-[var(--fg)]"
            >
              Посмотреть другие
            </Link>
          </div>
        </Reveal>

        <Reveal delay={300}>
          <p className="mt-8 text-[0.78rem] text-[var(--muted)]">
            Шаблон показывает структуру и подход. Итоговый вид зависит от вашего контента и фирменного
            стиля, поэтому каждый проект чем-то отличается — это не копипаст, а заготовка под задачу.
          </p>
        </Reveal>
      </div>
    </main>
  );
}