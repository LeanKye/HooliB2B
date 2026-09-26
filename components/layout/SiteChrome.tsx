"use client";

import { usePathname } from "next/navigation";
import AuroraBackground from "@/components/background/AuroraBackground";
import SideNav from "@/components/ui/SideNav";
import ThemeToggle from "@/components/ui/ThemeToggle";

/** Задаётся при сборке для GitHub Pages (см. next.config.ts). Локально пустой. */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

/**
 * Обвязка сайта: живой фон, боковая навигация и кнопка переключения темы.
 *
 * Всё это — часть HooliB2B, и на странице шаблона (предпросмотре) ей не
 * место. Раньше эти три компонента рендерились прямо в корневом layout,
 * поэтому кнопка темы всплывала поверх демо-сайта фотографа: она выглядела
 * как элемент шаблона, хотя переключала тему нашего сайта (и на странице
 * Lumina ничего не меняла — там собственная тёмная палитра). Аврора и
 * навигация давали тот же визуальный шум.
 *
 * Здесь решаем по маршруту: `/templates/<slug>/preview/` рендерится как
 * «чужой» сайт. Остальные страницы, включая страницу самого шаблона,
 * обвязку сохраняют — там она уместна.
 */
export default function SiteChrome() {
  const pathname = usePathname() ?? "/";
  // На GitHub Pages путь может прийти как с basePath, так и без него.
  const clean = basePath && pathname.startsWith(basePath) ? pathname.slice(basePath.length) || "/" : pathname;
  const isTemplatePreview = /^\/templates\/[^/]+\/preview\/?$/.test(clean);

  if (isTemplatePreview) return null;

  return (
    <>
      <AuroraBackground />
      <SideNav />
      <ThemeToggle />
    </>
  );
}
