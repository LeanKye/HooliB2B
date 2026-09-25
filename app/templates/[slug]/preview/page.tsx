import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { templates } from "@/lib/content";
import LuminaPreview from "@/components/templates/LuminaPreview";

export function generateStaticParams() {
  return [{ slug: "lumina-wedding" }];
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
    title: `Предпросмотр «${t.name}» — HooliB2B`,
    description: `Живой предпросмотр шаблона ${t.name}: можно нажать кнопки, отфильтровать работы и заполнить форму.`,
  };
}

/**
 * Живой предпросмотр шаблона.
 *
 * Отдельная страница, а не модальное окно: предпросмотр должен
 * открываться на всю ширину и работать как обычный сайт — иначе не
 * проверить ни адаптив, ни «как это ощущается». Плюс на отдельном
 * адресе можно дать ссылку клиенту в переписке.
 *
 * Собственная тема оформления (Layout) намеренно не используется: под
 * предпросмотр идёт полноценная шапка и подвал шаблона, чтобы человек
 * не принял её за навигацию HooliB2B.
 */
export default async function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = templates.find((x) => x.slug === slug);
  // Предпросмотр есть только у проработанного шаблона.
  if (!t || !t.detailed) notFound();

  return (
    <>
      {/* Служебная полоса: показывает, что это демо, и возвращает на страницу шаблона */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0d0a12] px-4 py-2">
        <div className="mx-auto flex max-w-5xl items-center gap-3 text-[0.78rem]">
          <Link
            href={`/templates/${slug}/`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 transition-colors hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            К шаблону
          </Link>
          <span className="truncate text-white/55">
            Предпросмотр «{t.name}» — работает по-настоящему, данные вымышлены
          </span>
        </div>
      </div>

      <LuminaPreview />
    </>
  );
}