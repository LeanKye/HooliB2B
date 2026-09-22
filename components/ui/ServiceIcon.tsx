import type { Service } from "@/lib/content";

const paths: Record<Service["icon"], React.ReactNode> = {
  site: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="3" />
      <path d="M3 9h18M7 6.8h.01M10 6.8h.01" />
    </>
  ),
  cart: (
    <>
      <path d="M4.5 7.5h15l-1.2 10.2a2.5 2.5 0 0 1-2.5 2.2H8.2a2.5 2.5 0 0 1-2.5-2.2L4.5 7.5Z" />
      <path d="M9 7.5V6a3 3 0 0 1 6 0v1.5" />
    </>
  ),
  crm: (
    <>
      <path d="M4 5h16l-6 7v5.5l-4 2.5v-8L4 5Z" />
    </>
  ),
  ai: (
    <>
      <path d="M12 3.5l1.7 4.3 4.3 1.7-4.3 1.7L12 15.5l-1.7-4.3L6 9.5l4.3-1.7L12 3.5Z" />
      <path d="M18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z" />
    </>
  ),
  combo: (
    <>
      <path d="M12 3.5 20 7.5 12 11.5 4 7.5l8-4Z" />
      <path d="M4 12l8 4 8-4M4 16.5l8 4 8-4" />
    </>
  ),
  custom: (
    <>
      <path d="M8.5 8 5 12l3.5 4M15.5 8 19 12l-3.5 4M13.5 5.5l-3 13" />
    </>
  ),
};

export default function ServiceIcon({ name, className = "" }: { name: Service["icon"]; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}
