import Link from "next/link";
import {
  ArrowUpRight,
  CalendarRange,
  CheckCircle2,
  CircleDashed,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type GoalCardProps = {
  href: string;
  title: string;
  description: string | null;
  progress: number;
  status: "ACTIVE" | "COMPLETED";
  endDateLabel: string;
  startDateLabel: string;
  stageCount: number;
  completedStageCount: number;
};

export default function GoalCard({
  href,
  title,
  description,
  progress,
  status,
  endDateLabel,
  startDateLabel,
  stageCount,
  completedStageCount,
}: GoalCardProps) {
  const pct = Math.min(100, Math.max(0, progress));
  const remainingStages = Math.max(stageCount - completedStageCount, 0);
  const isComplete = status === "COMPLETED";

  return (
    <Link
      href={href}
      className={cn(
        "group relative block overflow-hidden rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_-28px_rgba(15,23,42,0.32)] backdrop-blur-xl transition duration-300",
        "hover:-translate-y-1 hover:shadow-[0_28px_80px_-30px_rgba(15,23,42,0.38)]",
        "dark:border-white/10 dark:bg-zinc-900/75 dark:shadow-[0_24px_80px_-34px_rgba(0,0,0,0.68)]"
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.14),transparent_36%)] opacity-80 transition group-hover:opacity-100" />

      <div className="relative flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]",
                  isComplete
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                )}
              >
                {isComplete ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <CircleDashed className="h-3.5 w-3.5" />
                )}
                {isComplete ? "Completed" : "In motion"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900/5 px-3 py-1 text-[11px] font-medium text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
                <Flag className="h-3.5 w-3.5" />
                {stageCount} stage{stageCount === 1 ? "" : "s"}
              </span>
            </div>

            <div>
              <h2 className="font-heading text-2xl leading-tight text-zinc-950 dark:text-white">
                {title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {description?.trim() || "Add a short description to anchor why this goal matters."}
              </p>
            </div>
          </div>

          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-white transition group-hover:scale-105 dark:bg-white dark:text-zinc-950">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                Progress
              </p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                {pct}%
              </p>
            </div>
            <div className="text-right text-sm text-zinc-500 dark:text-zinc-400">
              <p>{completedStageCount} stages done</p>
              <p>{remainingStages} remaining</p>
            </div>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-zinc-950/8 dark:bg-white/10">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                isComplete
                  ? "bg-[linear-gradient(90deg,#10b981,#34d399)]"
                  : "bg-[linear-gradient(90deg,#0f766e,#2dd4bf,#f59e0b)]"
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="grid gap-3 text-sm text-zinc-600 dark:text-zinc-400 sm:grid-cols-2">
          <div className="rounded-2xl bg-zinc-950/[0.03] p-3 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500">
              Start window
            </p>
            <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">
              {startDateLabel}
            </p>
          </div>
          <div className="rounded-2xl bg-zinc-950/[0.03] p-3 dark:bg-white/5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500">
              <CalendarRange className="h-3.5 w-3.5" />
              Deadline
            </p>
            <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">
              {endDateLabel}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
