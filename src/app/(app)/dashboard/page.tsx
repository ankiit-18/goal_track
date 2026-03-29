import Link from "next/link";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import {
  ArrowRight,
  CheckCheck,
  Clock3,
  Flag,
  Layers3,
  Sparkles,
  Target,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { goalProgressPercent } from "@/lib/progress";
import { DashboardNav } from "@/components/DashboardNav";
import GoalCard from "@/components/GoalCard";
import { btnPrimaryClass, cardMutedClass } from "@/lib/ui-styles";

type GoalWithStages = Prisma.GoalGetPayload<{ include: { stages: true } }>;

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function daysBetween(from: Date, to: Date) {
  const diff = to.getTime() - from.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const goals: GoalWithStages[] = await prisma.goal.findMany({
    where: { userId: session.userId },
    include: { stages: true },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
  });

  const today = startOfToday();

  const upcomingStages = goals
    .flatMap((goal) =>
      goal.stages
        .filter(
          (stage: GoalWithStages["stages"][number]) =>
            stage.status === "PENDING" && stage.deadline >= today
        )
        .map((stage: GoalWithStages["stages"][number]) => ({
          stageId: stage.id,
          title: stage.title,
          deadline: stage.deadline,
          goalId: goal.id,
          goalTitle: goal.title,
          daysLeft: daysBetween(today, stage.deadline),
        }))
    )
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
    .slice(0, 6);

  const totalGoals = goals.length;
  const activeGoals = goals.filter((goal) => goal.status !== "COMPLETED");
  const completedGoals = goals.filter((goal) => goal.status === "COMPLETED");
  const totalStages = goals.reduce((sum, goal) => sum + goal.stages.length, 0);
  const completedStages = goals.reduce(
    (sum, goal) =>
      sum +
      goal.stages.filter((stage: GoalWithStages["stages"][number]) => {
        return stage.status === "COMPLETED";
      }).length,
    0
  );
  const averageProgress =
    totalGoals === 0
      ? 0
      : Math.round(
          goals.reduce((sum, goal) => sum + goalProgressPercent(goal.stages), 0) /
            totalGoals
        );
  const focusGoals = activeGoals.slice(0, 3);

  return (
    <div className="space-y-8 pb-10">
      <DashboardNav />

      <section className="relative overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,rgba(244,251,249,0.94),rgba(255,248,237,0.96))] p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(12,18,24,0.95),rgba(24,24,27,0.94))] sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.24),transparent_28%),radial-gradient(circle_at_left_center,rgba(20,184,166,0.18),transparent_32%)]" />

        <div className="relative grid gap-8 xl:grid-cols-[1.3fr_0.8fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-700 shadow-sm shadow-zinc-950/5 backdrop-blur dark:bg-white/10 dark:text-zinc-200">
              <Sparkles className="h-3.5 w-3.5" />
              Long-term goals dashboard
            </div>

            <div className="max-w-3xl space-y-3">
              <h1 className="font-heading text-4xl leading-tight text-zinc-950 dark:text-white sm:text-5xl">
                Turn big ambitions into a calm, visible roadmap.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
                See the goals that matter most, the milestones coming up next,
                and how your weekly rhythm supports the bigger picture.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/goals/new" className={btnPrimaryClass}>
                Create a new goal
              </Link>
              <Link
                href="/dashboard/weekly"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-300/70 bg-white/70 px-4 py-2.5 text-sm font-semibold text-zinc-800 backdrop-blur transition hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10"
              >
                Open weekly board
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 backdrop-blur dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                    Goal completion
                  </p>
                  <p className="mt-2 text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                    {averageProgress}%
                  </p>
                </div>
                <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-700 dark:text-emerald-300">
                  <Target className="h-6 w-6" />
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                Across {totalGoals} goal{totalGoals === 1 ? "" : "s"}, you have
                finished {completedStages} of {totalStages} planned stages.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-zinc-950 p-5 text-white shadow-[0_18px_45px_-32px_rgba(0,0,0,0.9)] dark:border-white/10">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
                Current balance
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-3xl font-semibold tracking-tight">
                    {activeGoals.length}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-zinc-500">
                    Active
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-semibold tracking-tight text-emerald-300">
                    {completedGoals.length}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-zinc-500">
                    Closed
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-semibold tracking-tight text-amber-300">
                    {upcomingStages.length}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-zinc-500">
                    Next steps
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.28)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/70">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                Total goals
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                {totalGoals}
              </p>
            </div>
            <span className="rounded-2xl bg-sky-500/15 p-3 text-sky-700 dark:text-sky-300">
              <Layers3 className="h-5 w-5" />
            </span>
          </div>
        </article>

        <article className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.28)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/70">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                Active right now
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                {activeGoals.length}
              </p>
            </div>
            <span className="rounded-2xl bg-amber-500/15 p-3 text-amber-700 dark:text-amber-300">
              <Flag className="h-5 w-5" />
            </span>
          </div>
        </article>

        <article className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.28)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/70">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                Stages completed
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                {completedStages}
              </p>
            </div>
            <span className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-700 dark:text-emerald-300">
              <CheckCheck className="h-5 w-5" />
            </span>
          </div>
        </article>

        <article className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.28)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/70">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                Upcoming deadlines
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                {upcomingStages.length}
              </p>
            </div>
            <span className="rounded-2xl bg-rose-500/15 p-3 text-rose-700 dark:text-rose-300">
              <Clock3 className="h-5 w-5" />
            </span>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/70">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                Focus goals
              </p>
              <h2 className="mt-2 font-heading text-3xl text-zinc-950 dark:text-white">
                What deserves attention next
              </h2>
            </div>
            <Link
              href="/goals/new"
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 transition hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
            >
              Add another goal
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {goals.length === 0 ? (
            <div className={`${cardMutedClass} mt-6 border-dashed text-center`}>
              <p className="text-zinc-600 dark:text-zinc-400">
                No goals yet. Create one to break a long-term plan into clear,
                trackable stages.
              </p>
              <Link
                href="/goals/new"
                className="mt-5 inline-flex font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
              >
                Create your first goal
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {(focusGoals.length > 0 ? focusGoals : goals.slice(0, 2)).map((goal) => {
                const completedStageCount = goal.stages.filter(
                  (stage: GoalWithStages["stages"][number]) =>
                    stage.status === "COMPLETED"
                ).length;

                return (
                  <GoalCard
                    key={goal.id}
                    href={`/goals/${goal.id}`}
                    title={goal.title}
                    description={goal.description}
                    progress={goalProgressPercent(goal.stages)}
                    status={goal.status as "ACTIVE" | "COMPLETED"}
                    startDateLabel={goal.startDate.toLocaleDateString()}
                    endDateLabel={goal.endDate.toLocaleDateString()}
                    stageCount={goal.stages.length}
                    completedStageCount={completedStageCount}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-[32px] border border-white/70 bg-zinc-950 p-6 text-white shadow-[0_24px_60px_-36px_rgba(0,0,0,0.9)] dark:border-white/10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                Next milestones
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                Upcoming deadlines
              </h2>
            </div>
            <span className="rounded-2xl bg-white/10 p-3 text-amber-300">
              <Clock3 className="h-5 w-5" />
            </span>
          </div>

          {upcomingStages.length === 0 ? (
            <p className="mt-6 text-sm leading-7 text-zinc-400">
              No pending stage deadlines from today onward. Add more milestones
              inside a goal when you want this view to turn into your action
              queue.
            </p>
          ) : (
            <ul className="mt-6 space-y-3">
              {upcomingStages.map((row) => (
                <li key={row.stageId}>
                  <Link
                    href={`/goals/${row.goalId}`}
                    className="block rounded-3xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-amber-300">
                          {row.goalTitle}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-zinc-200">
                          {row.title}
                        </p>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-300">
                        {row.daysLeft <= 0
                          ? "Today"
                          : `${row.daysLeft} day${row.daysLeft === 1 ? "" : "s"}`}
                      </span>
                    </div>
                    <time
                      dateTime={row.deadline.toISOString()}
                      className="mt-4 inline-flex rounded-full bg-white/8 px-3 py-1.5 text-xs font-medium text-zinc-300"
                    >
                      {row.deadline.toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {goals.length > 3 ? (
        <section className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                Goal archive
              </p>
              <h2 className="mt-2 font-heading text-3xl text-zinc-950 dark:text-white">
                Every long-term track
              </h2>
            </div>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {goals.slice(3).map((goal) => {
              const completedStageCount = goal.stages.filter(
                (stage: GoalWithStages["stages"][number]) =>
                  stage.status === "COMPLETED"
              ).length;

              return (
                <GoalCard
                  key={goal.id}
                  href={`/goals/${goal.id}`}
                  title={goal.title}
                  description={goal.description}
                  progress={goalProgressPercent(goal.stages)}
                  status={goal.status as "ACTIVE" | "COMPLETED"}
                  startDateLabel={goal.startDate.toLocaleDateString()}
                  endDateLabel={goal.endDate.toLocaleDateString()}
                  stageCount={goal.stages.length}
                  completedStageCount={completedStageCount}
                />
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
