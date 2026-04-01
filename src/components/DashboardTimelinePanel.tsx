"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Clock3 } from "lucide-react";

type PendingStage = {
  id: string;
  title: string;
  goalId: string;
  goalTitle: string;
  deadline: string | null;
};

function daysBetween(from: Date, to: Date) {
  const diff = to.getTime() - from.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getDeadlineLabel(target: Date, now: Date) {
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return "Deadline passed";
  if (diff < 1000 * 60 * 60 * 24) return "Due today";

  const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`;
}

function formatNextMilestoneValue(deadline: Date, now: Date) {
  const label = getDeadlineLabel(deadline, now);
  if (label === "Due today") return "Today";
  if (label === "Deadline passed") return "--";
  return `${daysBetween(now, deadline)}d`;
}

export function NextMilestoneStat({
  pendingStages,
}: {
  pendingStages: PendingStage[];
}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const nextMilestone = useMemo(() => {
    return pendingStages
      .filter((stage) => {
        if (!stage.deadline) return false;
        const deadline = new Date(stage.deadline);
        return deadline.getTime() >= now.getTime();
      })
      .sort((a, b) => {
        return new Date(a.deadline as string).getTime() - new Date(b.deadline as string).getTime();
      })[0];
  }, [now, pendingStages]);

  return (
    <article className="rounded-[28px] border border-zinc-200 bg-white p-7 shadow-[0_22px_50px_-40px_rgba(15,23,42,0.16)]">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
        Next milestone
      </p>
      <div className="mt-4 flex items-end gap-3">
        <p className="font-heading text-5xl leading-none tracking-[-0.05em] text-zinc-950">
          {nextMilestone?.deadline
            ? formatNextMilestoneValue(new Date(nextMilestone.deadline), now)
            : "--"}
        </p>
        <p className="pb-1 text-lg text-emerald-700">
          {nextMilestone ? nextMilestone.goalTitle : "Nothing queued"}
        </p>
      </div>
    </article>
  );
}

export function DashboardTimelinePanel({
  pendingStages,
}: {
  pendingStages: PendingStage[];
}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const { upcomingStages, stagesNeedingAttention } = useMemo(() => {
    const upcoming = pendingStages
      .filter((stage) => {
        if (!stage.deadline) return false;
        return new Date(stage.deadline).getTime() >= now.getTime();
      })
      .sort((a, b) => {
        return new Date(a.deadline as string).getTime() - new Date(b.deadline as string).getTime();
      })
      .slice(0, 3);

    const alerts = pendingStages
      .filter((stage) => {
        if (!stage.deadline) return true;
        return new Date(stage.deadline).getTime() < now.getTime();
      })
      .map((stage) => ({
        ...stage,
        isMissingDeadline: !stage.deadline,
      }))
      .slice(0, 6);

    return {
      upcomingStages: upcoming,
      stagesNeedingAttention: alerts,
    };
  }, [now, pendingStages]);

  return (
    <aside className="space-y-6">
      {stagesNeedingAttention.length > 0 ? (
        <section className="rounded-[30px] border border-amber-200 bg-[#fffaf0] p-6 shadow-[0_22px_55px_-42px_rgba(15,23,42,0.12)]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">
              Stage alerts
            </p>
            <Clock3 className="h-4 w-4 text-amber-700" />
          </div>
          <div className="mt-5 space-y-3">
            {stagesNeedingAttention.map((stage) => (
              <Link
                key={stage.id}
                href={`/goals/${stage.goalId}`}
                className="block rounded-2xl bg-white px-4 py-4 transition hover:bg-amber-50"
              >
                <p className="text-sm font-semibold text-zinc-950">{stage.goalTitle}</p>
                <p className="mt-1 text-sm text-zinc-600">{stage.title}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                  {stage.isMissingDeadline ? "Missing deadline" : "Deadline passed"}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {upcomingStages.length > 0 ? (
        <section className="rounded-[30px] border border-zinc-200 bg-white p-6 shadow-[0_22px_55px_-42px_rgba(15,23,42,0.18)]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
              Upcoming
            </p>
            <Clock3 className="h-4 w-4 text-zinc-500" />
          </div>
          <div className="mt-5 space-y-4">
            {upcomingStages.map((stage) => (
              <Link
                key={stage.id}
                href={`/goals/${stage.goalId}`}
                className="block rounded-2xl bg-zinc-50 px-4 py-4 transition hover:bg-zinc-100"
              >
                <p className="text-sm font-semibold text-zinc-950">{stage.goalTitle}</p>
                <p className="mt-1 text-sm text-zinc-600">{stage.title}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  {stage.deadline
                    ? getDeadlineLabel(new Date(stage.deadline), now)
                    : "Missing deadline"}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </aside>
  );
}
