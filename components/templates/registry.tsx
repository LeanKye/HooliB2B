import type { ReactNode } from "react";
import { AtelierCardPreview } from "./AtelierScreens";
import { LuminaCardPreview } from "./LuminaScreens";

/**
 * Превью карточки шаблона в каталоге: у проработанных — настоящий первый
 * экран, у остальных — обобщённая схема.
 *
 * Реестр нужен, чтобы каталог не знал про шаблоны поимённо: добавили
 * шаблон с превью — он появляется здесь сам, а не правкой в каталоге.
 * Иначе «уже есть превью» снова разойдётся с «уже есть предпросмотр».
 */
const CARD_PREVIEWS: Record<string, (props: { className?: string }) => ReactNode> = {
  "lumina-wedding": (props) => <LuminaCardPreview {...props} />,
  "atelier-bakery": (props) => <AtelierCardPreview {...props} />,
};

/** Есть ли у шаблона настоящее превью вместо схемы. */
export const hasCardPreview = (slug: string) => Boolean(CARD_PREVIEWS[slug]);

/**
 * Превью для карточки каталога. Само выбирает источник: настоящий экран
 * или схему — компоненту каталога не нужно знать, что есть что.
 */
export function TemplateCardPreview({
  slug,
  fallback,
  className = "",
}: {
  slug: string;
  /** Схема для шаблонов без превью — рендерится в вызывающем коде. */
  fallback: ReactNode;
  className?: string;
}) {
  const Preview = CARD_PREVIEWS[slug];
  if (!Preview) return <>{fallback}</>;
  return <>{Preview({ className })}</>;
}
