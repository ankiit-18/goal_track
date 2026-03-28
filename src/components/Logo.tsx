type Props = { className?: string };

export function LogoMark({ className = "h-9 w-9" }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        width="36"
        height="36"
        rx="10"
        className="fill-emerald-500 dark:fill-emerald-400"
      />
      <path
        d="M11 18.5l4.2 4.2L25 13"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
