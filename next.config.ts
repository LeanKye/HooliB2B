import type { NextConfig } from "next";

/**
 * GitHub Pages раздаёт «project site» по адресу https://<user>.github.io/<repo>/,
 * то есть в подкаталоге. Чтобы ассеты и ссылки не отдавали 404, сборку для Pages
 * нужно делать с basePath — он прокидывается переменной окружения.
 *
 *   локально (npm run dev / npm run build) — basePath пустой, сайт живёт в корне;
 *   деплой на Pages (npm run build:pages / GitHub Actions) — basePath = /<repo>.
 */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  // Полностью статическая сборка (папка `out`) — сайт грузится моментально,
  // бэкенд не нужен. `trailingSlash` даёт аккуратные URL вида /partners/lumen/.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  basePath: basePath || undefined,
};

export default nextConfig;

