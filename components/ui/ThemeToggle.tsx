"use client";

import { useTheme } from "@/components/providers/ThemeProvider";

/** Стеклянная кнопка переключения светлой/тёмной темы. */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
      className="glass-nav group fixed top-[calc(var(--safe-top)+1rem)] right-[calc(var(--safe-right)+1.25rem)] z-50 flex h-11 w-11 items-center justify-center rounded-full sm:right-[calc(var(--safe-right)+2rem)]"
    >
      <span className="relative block h-5 w-5">
        {/* солнце */}
        <svg
          viewBox="0 0 24 24"
          className="absolute inset-0 h-5 w-5 transition-all duration-500"
          style={{
            opacity: isDark ? 0 : 1,
            transform: isDark ? "rotate(-90deg) scale(0.4)" : "rotate(0) scale(1)",
          }}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6" />
        </svg>
        {/* луна */}
        <svg
          viewBox="0 0 24 24"
          className="absolute inset-0 h-5 w-5 transition-all duration-500"
          style={{
            opacity: isDark ? 1 : 0,
            transform: isDark ? "rotate(0) scale(1)" : "rotate(90deg) scale(0.4)",
          }}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 13.2A8.2 8.2 0 1 1 10.8 4a6.6 6.6 0 0 0 9.2 9.2Z" />
        </svg>
      </span>
    </button>
  );
}
