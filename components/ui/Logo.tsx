export default function Logo({ size = 36, withText = false }: { size?: number; withText?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        role="img"
        aria-label="HooliB2B"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="hl-g" x1="2" y1="2" x2="46" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#6366f1" />
            <stop offset="0.5" stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
          <linearGradient id="hl-sh" x1="24" y1="4" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#hl-g)" />
        <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#hl-sh)" />
        <rect
          x="2.75"
          y="2.75"
          width="42.5"
          height="42.5"
          rx="13.25"
          stroke="#ffffff"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        <path
          d="M16.5 14.5v19M31.5 14.5v19M16.5 24h15"
          stroke="#ffffff"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="35.5" cy="12.5" r="3" fill="#ffffff" fillOpacity="0.9" />
      </svg>
      {withText && (
        <span className="font-display text-[1.05rem] font-semibold tracking-tight">
          Hooli<span className="text-gradient">B2B</span>
        </span>
      )}
    </span>
  );
}
