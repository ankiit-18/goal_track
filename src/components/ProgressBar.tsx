type Props = {
  value: number;
  className?: string;
};

export function ProgressBar({ value, className = "" }: Props) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div
      className={`relative h-2.5 w-full overflow-hidden rounded-full bg-zinc-200/90 dark:bg-zinc-800 ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_12px_rgba(16,185,129,0.35)] transition-[width] duration-500 ease-out dark:from-emerald-400 dark:to-emerald-300 dark:shadow-emerald-500/20"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
