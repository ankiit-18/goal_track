import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
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
  const isComplete = status === "COMPLETED";

  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-[24px] border border-zinc-200 bg-white px-6 py-5 shadow-[0_18px_45px_-40px_rgba(15,23,42,0.22)] transition",
        "hover:border-zinc-300 hover:shadow-[0_22px_55px_-40px_rgba(15,23,42,0.26)]"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-heading text-3xl leading-none tracking-[-0.04em] text-zinc-950">
            {title}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-zinc-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600">
              {stageCount} stage{stageCount === 1 ? "" : "s"}
            </span>
            {description?.trim() ? (
              <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                {description}
              </span>
            ) : null}
          </div>
        </div>

        <div className="shrink-0 text-right">
          {isComplete ? (
            <span className="inline-flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          ) : null}
          <p
            className={cn(
              "mt-1 font-heading text-3xl tracking-[-0.04em]",
              isComplete ? "text-emerald-700" : "text-emerald-700"
            )}
          >
            {pct}%
          </p>
        </div>
      </div>

      <div className="mt-5 h-1.5 rounded-full bg-zinc-100">
        <div
          className={cn(
            "h-1.5 rounded-full",
            isComplete ? "bg-emerald-700" : "bg-emerald-700"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-5 grid gap-3 text-[11px] uppercase tracking-[0.18em] text-zinc-500 sm:grid-cols-2">
        <div>
          <p>Start window</p>
          <p className="mt-2 text-sm font-medium normal-case tracking-normal text-zinc-950">
            {startDateLabel}
          </p>
        </div>
        <div>
          <p>Deadline</p>
          <p
            className={cn(
              "mt-2 text-sm font-medium normal-case tracking-normal",
              isComplete ? "text-zinc-700" : "text-zinc-950"
            )}
          >
            {endDateLabel}
          </p>
        </div>
      </div>

      {!isComplete ? (
        <p className="mt-4 text-sm text-zinc-500">
          {completedStageCount} completed, {Math.max(stageCount - completedStageCount, 0)} remaining
        </p>
      ) : null}
    </Link>
  );
}
