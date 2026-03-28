import Link from "next/link";
import { cn } from "@/lib/utils";

export type GoalCardProps = {
  href: string;
  title: string;
  description: string | null;
  progress: number;
  status: "ACTIVE" | "COMPLETED";
  /** End date of goal window (shown as “Deadline” like the premium mock) */
  endDateLabel: string;
  startDateLabel: string;
};

export default function GoalCard({
  href,
  title,
  description,
  progress,
  status,
  endDateLabel,
  startDateLabel,
}: GoalCardProps) {
  const pct = Math.min(100, Math.max(0, progress));

  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-2xl bg-white p-5 shadow-md transition",
        "hover:shadow-xl dark:bg-zinc-900 dark:ring-1 dark:ring-zinc-800"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-zinc-100">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-zinc-400">
              {description}
            </p>
          ) : null}
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
            Deadline: {endDateLabel}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
            status === "COMPLETED"
              ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300"
              : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          )}
        >
          {status === "COMPLETED" ? "Completed" : "Active"}
        </span>
      </div>

      <div className="mt-4">
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-zinc-800">
          <div
            className="h-2 rounded-full bg-blue-500 transition-all duration-500 ease-out group-hover:bg-blue-600 dark:bg-emerald-500 dark:group-hover:bg-emerald-400"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">
        {pct}% completed
      </p>
      <p className="mt-1 text-xs text-gray-400 dark:text-zinc-500">
        Window: {startDateLabel} → {endDateLabel}
      </p>
    </Link>
  );
}
