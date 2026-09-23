"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

/**
 * Плавное появление блока при попадании в зону видимости.
 *
 * После завершения анимации снимаем класс `.reveal`: он держит постоянный
 * `will-change`, то есть элемент остаётся отдельным слоем композитора навсегда.
 * На странице таких блоков два десятка — на телефоне это лишняя память и работа
 * GPU на каждом кадре прокрутки.
 */
export default function Reveal({ children, delay = 0, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Ждём окончания перехода и только потом снимаем класс. Таймер — страховка:
  // transitionend не придёт, если вкладку свернули или элемент скрыли.
  useEffect(() => {
    const el = ref.current;
    if (!shown || !el) return;
    const onEnd = (e: TransitionEvent) => {
      if (e.target === el && e.propertyName === "opacity") setDone(true);
    };
    el.addEventListener("transitionend", onEnd);
    const timer = window.setTimeout(() => setDone(true), 1800);
    return () => {
      el.removeEventListener("transitionend", onEnd);
      window.clearTimeout(timer);
    };
  }, [shown]);

  return (
    <div
      ref={ref}
      className={done ? className : `reveal ${shown ? "in" : ""} ${className}`}
      style={done ? undefined : { transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
