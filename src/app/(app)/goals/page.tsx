import Link from "next/link";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import {
  ArrowRight,
  CalendarClock,
  CheckCheck,
  Layers3,
  Plus,
  Sparkles,
  Target,
} from "lucide-react";
import GoalCard from "@/components/GoalCard";
import { prisma } from "@/lib/prisma";
import { goalProgressPercent } from "@/lib/progress";
import { getSession } from "@/lib/session";
import { btnPrimaryClass, cardMutedClass } from "@/lib/ui-styles";

type GoalWithStages = Prisma.GoalGetPayload<{ include: { stages: true } }>;

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export default async function GoalsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const goals: GoalWithStages[] = await prisma.goal.findMany({
    where: { userId: session.userId },
    include: { stages: true },
    orderBy: [{ updatedAt: "desc" }],
  });

  const today = startOfToday();
  const activeGoals = goals.filter((goal) => goal.status !== "COMPLETED");
  const completedGoals = goals.filter((goal) => goal.status === "COMPLETED");
  const totalStages = goals.reduce((sum, goal) => sum + goal.stages.length, 0);
  const completedStages = goals.reduce(
    (sum, goal) =>
      sum + goal.stages.filter((stage) => stage.status === "COMPLETED").length,
    0
  );

  const upcomingDeadlines = goals.reduce((count, goal) => {
    return (
      count +
      goal.stages.filter(
        (stage) => stage.status === "PENDING" && stage.deadline >= today
      ).length
    );
  }, 0);

  const averageProgress =
    goals.length === 0
      ? 0
      : Math.round(
          goals.reduce((sum, goal) => sum + goalProgressPercent(goal.stages), 0) /
            goals.length
        );

  return (
    <div className="space-y-8 pb-10">
      <section className="relative overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,250,240,0.95),rgba(240,249,255,0.96))] p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.42)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(23,18,12,0.95),rgba(13,22,34,0.94))] sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.2),transparent_30%),radial-gradient(circle_at_left_center,rgba(59,130,246,0.15),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_28%)]" />

        <div className="relative grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-700 shadow-sm backdrop-blur dark:bg-white/10 dark:text-zinc-200">
              <Sparkles className="h-3.5 w-3.5" />
              Goals library
            </div>

            <div className="space-y-3">
              <h1 className="font-heading text-4xl leading-tight text-zinc-950 dark:text-white sm:text-5xl">
                Every long-term goal, organized in one place.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
                Review active plans, revisit completed wins, and open each goal
                when you want to manage stages, deadlines, and progress.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/goals/new" className={`${btnPrimaryClass} gap-2`}>
                <Plus className="h-4 w-4" />
                Create goal
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-300/70 bg-white/70 px-4 py-2.5 text-sm font-semibold text-zinc-800 backdrop-blur transition hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10"
              >
                Back to dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[28px] border border-white/70 bg-zinc-950 p-5 text-white dark:border-white/10">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                Portfolio progress
              </p>
              <p className="mt-3 text-4xl font-semibold tracking-tight">
                {averageProgress}%
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                You&apos;ve completed {completedStages} of {totalStages} stages across
                all goals.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 backdrop-blur dark:border-white/10 dark:bg-white/5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                Quick view
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                    {activeGoals.length}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                    Active
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                    {completedGoals.length}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                    Closed
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                    {upcomingDeadlines}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                    Pending
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
                {goals.length}
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
                Stages planned
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                {totalStages}
              </p>
            </div>
            <span className="rounded-2xl bg-violet-500/15 p-3 text-violet-700 dark:text-violet-300">
              <Target className="h-5 w-5" />
            </span>
          </div>
        </article>

        <article className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.28)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/70">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                Completed stages
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
                Future deadlines
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                {upcomingDeadlines}
              </p>
            </div>
            <span className="rounded-2xl bg-amber-500/15 p-3 text-amber-700 dark:text-amber-300">
              <CalendarClock className="h-5 w-5" />
            </span>
          </div>
        </article>
      </section>

      {goals.length === 0 ? (
        <section className={`${cardMutedClass} rounded-[32px] border-dashed text-center`}>
          <h2 className="font-heading text-3xl text-zinc-950 dark:text-white">
            No goals yet
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            Create your first goal to start mapping a bigger outcome into clear
            stages and deadlines.
          </p>
          <Link href="/goals/new" className={`${btnPrimaryClass} mt-6 inline-flex gap-2`}>
            <Plus className="h-4 w-4" />
            Create your first goal
          </Link>
        </section>
      ) : (
        <>
          <section className="space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                  Active plans
                </p>
                <h2 className="mt-2 font-heading text-3xl text-zinc-950 dark:text-white">
                  Goals in motion
                </h2>
              </div>
            </div>

            {activeGoals.length === 0 ? (
              <div className={`${cardMutedClass} rounded-[28px]`}>
                <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                  You don&apos;t have any active goals right now. Everything in your
                  library is marked complete.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-2">
                {activeGoals.map((goal) => {
                  const completedStageCount = goal.stages.filter(
                    (stage) => stage.status === "COMPLETED"
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
          </section>

          {completedGoals.length > 0 ? (
            <section className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                  Completed
                </p>
                <h2 className="mt-2 font-heading text-3xl text-zinc-950 dark:text-white">
                  Finished goals
                </h2>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {completedGoals.map((goal) => {
                  const completedStageCount = goal.stages.filter(
                    (stage) => stage.status === "COMPLETED"
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
        </>
      )}
    </div>
  );
}
