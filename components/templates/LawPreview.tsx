"use client";

import { useState } from "react";
import { CASES, SERVICES, TIME_SLOTS, TOPICS, type Service } from "./law/data";
import { Cases, Hero, Request, Services } from "./law/sections";

/**
 * Живой предпросмотр шаблона «Право» — юридические услуги.
 *
 * Устройство то же, что у Lumina и «Ателье»: секции лежат в
 * `law/sections.tsx` и используются дважды — здесь и в макетах экранов на
 * странице шаблона. Благодаря этому «скриншоты» и живой предпросмотр не
 * могут разойтись.
 *
 * Отдельно важно: палитра здесь НЕ как на сайте HooliB2B. Шаблон должен
 * выглядеть чужим сайтом — иначе клиент решит, что «переделка» ничего
 * не даст. Поэтому своя тёмная база, холодный акцент и засечный шрифт
 * для заголовков.
 *
 * Все данные вымышленные, заявка ничего не отправляет: кейсы и цифры
 * правдоподобны, но не настоящие.
 */

export default function LawPreview() {
  const [cat, setCat] = useState<Service["cat"] | "all">("all");
  const [menu, setMenu] = useState(false);
  const [openCase, setOpenCase] = useState<number | null>(null);
  const [sent, setSent] = useState(false);
  const [topic, setTopic] = useState("");
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState<{ name?: string; phone?: string }>({});

  const shown = cat === "all" ? SERVICES : SERVICES.filter((s) => s.cat === cat);

  /** Проверка формы: показывает, что механика в шаблоне есть. */
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof err = {};
    if (name.trim().length < 2) next.name = "Как к вам обращаться?";
    if (phone.replace(/\D/g, "").length < 10) next.phone = "Нужен полный номер";
    setErr(next);
    if (Object.keys(next).length === 0) setSent(true);
  };

  /*
   * `min-h-[100svh]`, а не `min-h-full`: процентная высота от родителя без
   * заданной высоты не работает, и низ длинной страницы «выползал» на цвет
   * body сайта. `svh` учитывает, что на мобильных адресная строка то уезжает,
   * то возвращается.
   *
   * `colorScheme: "dark"` — для нативных контролов: без него выпадающий
   * список рисуется в системной теме (светлым на белом) и выглядит
   * чужеродно внутри тёмного шаблона.
   */
  return (
    <div className="min-h-[100svh] bg-[#1e1b33] text-white" style={{ colorScheme: "dark" }}>
      {/* Шапка: на телефоне превращается в бургер — это и есть адаптив */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#1e1b33]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
          <span className="text-sm font-semibold tracking-[0.3em] text-[#a78bfa]">ПРАВО</span>
          <nav className="ml-auto hidden items-center gap-5 text-sm text-white/70 sm:flex">
            <a href="#services" className="transition-colors hover:text-white">Услуги</a>
            <a href="#cases" className="transition-colors hover:text-white">Кейсы</a>
            <a href="#request" className="transition-colors hover:text-white">Консультация</a>
            <a href="#request" className="rounded-full bg-[#a78bfa] px-4 py-2 font-medium text-[#14101f] transition-opacity hover:opacity-90">
              Записаться
            </a>
          </nav>
          <button
            type="button"
            onClick={() => setMenu((v) => !v)}
            aria-expanded={menu}
            aria-label="Меню"
            className="ml-auto rounded-lg border border-white/20 p-2 sm:hidden"
          >
            <span className="block h-0.5 w-4 bg-white" />
            <span className="mt-1 block h-0.5 w-4 bg-white" />
          </button>
        </div>
        {menu && (
          <nav className="flex flex-col gap-3 border-t border-white/10 px-4 py-4 text-sm sm:hidden">
            <a href="#services" onClick={() => setMenu(false)}>Услуги</a>
            <a href="#cases" onClick={() => setMenu(false)}>Кейсы</a>
            <a href="#request" onClick={() => setMenu(false)}>Консультация</a>
            <a href="#request" onClick={() => setMenu(false)} className="rounded-full bg-[#a78bfa] px-4 py-2 text-center font-medium text-[#14101f]">
              Записаться
            </a>
          </nav>
        )}
      </header>

      <Hero />

      {/* Услуги: фильтр по направлению реально фильтрует */}
      <Services cat={cat} shown={shown} onPick={setCat} />

      {/* Кейсы: карточка открывает полный разбор — клиент проверяет похожие ситуации */}
      <Cases cases={CASES} onOpen={setOpenCase} />

      {/* Форма: тема и время выбираются кнопками, поля проверяются */}
      <Request
        interactive
        topics={TOPICS}
        slots={TIME_SLOTS}
        topic={topic}
        slot={slot}
        sent={sent}
        name={name}
        phone={phone}
        errors={err}
        onTopic={setTopic}
        onSlot={setSlot}
        onName={setName}
        onPhone={setPhone}
        onSubmit={submit}
      />

      <footer className="border-t border-white/10 px-4 py-8 text-center text-xs text-white/45">
        Право — демонстрационный предпросмотр шаблона HooliB2B. Кейсы и цены вымышлены.
      </footer>

      {/* Кейс целиком: открывается по клику на карточку */}
      {openCase !== null && <CaseDialog id={openCase} onClose={() => setOpenCase(null)} />}
    </div>
  );
}

/**
 * Разбор кейса целиком.
 *
 * Отдельный компонент, а не разметка внутри предпросмотра: он нужен только
 * в открытом состоянии и не должен попадать в разметку закрытой страницы.
 */
function CaseDialog({ id, onClose }: { id: number; onClose: () => void }) {
  const c = CASES.find((x) => x.id === id);
  if (!c) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Разбор кейса"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <div className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="rounded-2xl border border-white/12 bg-[#1e1b33] p-6">
          <div className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#a78bfa]">
            Кейс · {c.period}
          </div>
          <h3 className="mt-2 text-xl font-semibold">{c.title}</h3>

          <dl className="mt-5 grid gap-4 text-sm">
            <div>
              <dt className="text-white/45">Задача</dt>
              <dd className="mt-1 leading-relaxed text-white/80">{c.task}</dd>
            </div>
            <div>
              <dt className="text-white/45">Что сделали</dt>
              <dd className="mt-1 leading-relaxed text-white/80">{c.action}</dd>
            </div>
            <div>
              <dt className="text-white/45">Результат</dt>
              <dd className="mt-1 leading-relaxed text-white/90">{c.outcome}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-full border border-white/25 py-2.5 text-sm transition-colors hover:bg-white/10"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
