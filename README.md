# HooliB2B — сайт-визитка

**Живая версия: https://leankye.github.io/HooliB2B/**

Одностраничный сайт (SPA) для B2B-сервиса разработки и сопровождения digital-продуктов.
Анимации, живой фон, реагирующий на мышь, «liquid glass»-навигация, тёмная и светлая темы.

## Стек и почему именно он

| Технология | Зачем |
|---|---|
| **Next.js 16 (App Router) + `output: "export"`** | Полностью статическая сборка: сайт раздаётся как обычные HTML/CSS/JS, сервер не нужен, загрузка мгновенная. При этом есть SPA-переходы между разделами без перезагрузки. |
| **Tailwind CSS v4** | Быстрая вёрстка, mobile-first, тёмная тема через класс `.dark`. |
| **`motion` (Framer Motion)** | Появление блоков, «перетекающие» заголовки. Уважает `prefers-reduced-motion`. |
| **`lenis`** | Плавный анимированный скролл (~3 КБ). |
| **Свой `<canvas>`-фон** | Частицы + аврора-пятна, реагирующие на курсор. Без тяжёлого WebGL. |
| **Системные шрифты** | Ноль сетевых запросов за шрифтами → мгновенный первый рендер и никакого «прыжка» текста. |

Итого: ~1.3 МБ на всю сборку, никаких внешних сервисов и шрифтов, бэкенд не требуется.

## Команды

```bash
npm install        # установить зависимости
npm run dev        # дев-сервер → http://localhost:3000
npm run build      # статическая сборка в папку out/
npm run build:pages # сборка для GitHub Pages (с basePath /HooliB2B)
npm start          # локальный просмотр собранного сайта (npx serve out)
```

## Структура

```
app/
  layout.tsx              # <html>, тема, провайдеры, фон, навигация
  page.tsx                # главная: сборка всех секций
  globals.css             # токены тем, liquid glass, анимации
  icon.svg                # favicon (логотип)
  not-found.tsx           # 404
  partners/[slug]/page.tsx# страница кейса партнёра (генерируется статически)
components/
  background/AuroraBackground.tsx  # живой фон (canvas + параллакс от мыши)
  providers/ThemeProvider.tsx      # тёмная/светлая тема + localStorage
  providers/SmoothScroll.tsx       # Lenis + scrollToId()
  ui/                              # Logo, SideNav, ThemeToggle, Reveal, Section, ServiceIcon
  sections/                        # Hero, Services, Pricing, Process, Partners, Team, Contact
lib/content.ts                     # ВЕСЬ контент сайта (цены, услуги, партнёры, команда)
public/.nojekyll                   # чтобы GitHub Pages не пропускал папку _next через Jekyll
.github/workflows/deploy-pages.yml # авто-деплой на GitHub Pages
```

## Как менять контент

Почти всё правится в одном файле — `lib/content.ts`:

- `services` — продукты, цены внедрения и подписки, список возможностей;
- `plans` — тарифы подписки;
- `process` — шаги работы;
- `partners` — клиенты для раздела «Наши партнёры»;
- `team` — команда;
- `metrics` — цифры в первом экране;
- `navItems` — пункты боковой навигации (id должны совпадать с `id` секций).

### Как добавить партнёра

1. Добавьте объект в массив `partners` в `lib/content.ts` (обязательно уникальный `slug`).
2. Пересоберите сайт (`npm run build`). Страница `/partners/<slug>/` создастся автоматически —
   за это отвечает `generateStaticParams` в `app/partners/[slug]/page.tsx`.
3. Карточка появится в разделе «Наши партнёры», а внутри кейса — метрики, отзыв
   и кнопка перехода на сайт клиента (`url`).

## Деплой

Папка `out/` после `npm run build` — это готовый статический сайт.
Её можно залить на любой хостинг статики: Netlify, Vercel, Cloudflare Pages, GitHub Pages,
nginx, S3 — что угодно. Переменные окружения и бэкенд не нужны.

### GitHub Pages

Сайт живёт по адресу **https://leankye.github.io/HooliB2B/** и обновляется автоматически
при каждом пуше в `main` — за это отвечает `.github/workflows/deploy-pages.yml`.

Тонкость: Pages раздаёт проект из подкаталога `/HooliB2B/`, поэтому сборка делается
с `basePath` (см. `next.config.ts`). Он прокидывается переменной `NEXT_PUBLIC_BASE_PATH`,
так что локальная разработка остаётся в корне и ничего не ломается — один и тот же код
работает и на `localhost:3000`, и в подкаталоге на Pages.

Pages уже включён (Source: GitHub Actions), так что деплой идёт сам при каждом пуше
в `main` — никаких ручных шагов не нужно.

Если однажды будете поднимать Pages в новом репозитории: workflow пытается включить их
сам (`configure-pages` с `enablement: true`), но дефолтному `GITHUB_TOKEN` не хватает прав
на *создание* Pages-сайта (`Resource not accessible by integration`), поэтому нужен один
ручной клик — **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Собрать и проверить версию для Pages локально (без GitHub):

```bash
npm run build:pages
mkdir -p /tmp/pagesroot && ln -sfn "$PWD/out" /tmp/pagesroot/HooliB2B
cd /tmp/pagesroot && python3 -m http.server 4321
# → http://localhost:4321/HooliB2B/
```

> Если позже подключите свой домен, `configure-pages` вернёт пустой `base_path`
> и сайт соберётся для корня автоматически — править код не придётся.

## Доступность и производительность

- `prefers-reduced-motion` уважается: скролл-анимации и анимации motion отключаются.
- `prefers-color-scheme` учитывается при первом заходе, дальше выбор хранится в `localStorage`
  (без «вспышки» белым — тема ставится inline-скриптом до первой отрисовки).
- Canvas-фон паузится в неактивной вкладке, число частиц зависит от ширины экрана.
