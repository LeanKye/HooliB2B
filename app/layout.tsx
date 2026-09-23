import type { Metadata, Viewport } from "next";
import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import SmoothScroll from "@/components/providers/SmoothScroll";
import AuroraBackground from "@/components/background/AuroraBackground";
import SideNav from "@/components/ui/SideNav";
import ThemeToggle from "@/components/ui/ThemeToggle";

export const metadata: Metadata = {
  title: "HooliB2B — digital-продукты для малого бизнеса",
  description:
    "Сайты, CRM и AI-ассистенты для малого бизнеса. Быстрый запуск на готовых шаблонах, индивидуальная разработка и поддержка по подписке.",
  keywords: ["сайты для бизнеса", "CRM", "AI-ассистент", "разработка", "малый бизнес", "подписка"],
  openGraph: {
    title: "HooliB2B — digital-продукты для малого бизнеса",
    description: "Сайты, CRM и AI-ассистенты. Быстрый запуск, поддержка по подписке.",
    type: "website",
  },
};

export const viewport: Viewport = {
  /*
   * themeColor красит системные полосы браузера (статус-бар, панель вкладок).
   * Раньше в тёмной теме там стоял почти чёрный #04060c — в сочетании с
   * `viewport-fit=cover` это и давало ощущение «чёрных полос сверху и снизу».
   * Теперь цвет совпадает с верхом авроры, и полосы сливаются с фоном сайта.
   */
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#dbe3f8" },
    { media: "(prefers-color-scheme: dark)", color: "#2e316f" },
  ],
  width: "device-width",
  initialScale: 1,
  /*
   * cover — сайт занимает весь экран, включая зоны выреза камеры и домашнего
   * индикатора. Без этого iOS отдаёт странице только «безопасный» прямоугольник,
   * а полосы по краям закрашивает сама (в Telegram — тёмным).
   */
  viewportFit: "cover",
};

// Ставим тему до первой отрисовки — без «вспышки» белым.
const themeScript = `(function(){try{var t=localStorage.getItem('hooli-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.classList.toggle('dark',t==='dark');}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <SmoothScroll>
            <AuroraBackground />
            <SideNav />
            <ThemeToggle />
            <div className="relative z-10">{children}</div>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
