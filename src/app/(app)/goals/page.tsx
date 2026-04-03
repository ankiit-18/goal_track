import Link from "next/link";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { Plus } from "lucide-react";
import GoalCard from "@/components/GoalCard";
import { prisma } from "@/lib/prisma";
import { goalProgressPercent } from "@/lib/progress";
import { getSession } from "@/lib/session";
import { btnPrimaryClass, cardMutedClass } from "@/lib/ui-styles";

type GoalWithStages = Prisma.GoalGetPayload<{ include: { stages: true } }>;

export default async function GoalsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const goals: GoalWithStages[] = await prisma.goal.findMany({
    where: { userId: session.userId },
    include: { stages: true },
    orderBy: [{ updatedAt: "desc" }],
  });

  const now = new Date();
  const activeGoals = goals.filter((goal) => goal.status !== "COMPLETED");
  const completedGoals = goals.filter((goal) => goal.status === "COMPLETED");
  const totalStages = goals.reduce((sum, goal) => sum + goal.stages.length, 0);
  const completedStages = goals.reduce(
    (sum, goal) =>
      sum + goal.stages.filter((stage) => stage.status === "COMPLETED").length,
    0
  );

  const upcomingStages = goals.reduce((count, goal) => {
    return (
      count +
      goal.stages.filter(
        (stage) =>
          stage.status === "PENDING" &&
          new Date(stage.deadline).getTime() > now.getTime()
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
    <div className="space-y-10 pb-14">
      <section className="rounded-[34px] border border-zinc-200 bg-white px-8 py-10 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.18)] lg:px-10">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:items-start">
          <div>
            <h1 className="max-w-3xl font-heading text-6xl leading-[0.92] tracking-[-0.06em] text-zinc-950">
              Every long-term goal,
              <span className="block italic font-normal">organized in one place.</span>
            </h1>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/goals/new" className={btnPrimaryClass + " px-5 py-3"}>
                <Plus className="mr-2 h-4 w-4" />
                Create goal
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-xl px-4 py-3 text-sm font-medium text-emerald-800 transition hover:bg-zinc-50"
              >
                Back to dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-[22px] bg-[#f7f8f4] p-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Portfolio progress
              </p>
              <p className="text-lg font-semibold text-emerald-700">{averageProgress}%</p>
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-zinc-200">
              <div
                className="h-1.5 rounded-full bg-emerald-700"
                style={{ width: `${averageProgress}%` }}
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-600">
              You have completed {completedStages} of {totalStages} stages across
              your long-term goals.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[20px] border border-zinc-200 bg-[#fafaf7] px-5 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Total goals
          </p>
          <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-zinc-950">
            {goals.length}
          </p>
        </article>

        <article className="rounded-[20px] border border-zinc-200 bg-[#fafaf7] px-5 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Stages planned
          </p>
          <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-zinc-950">
            {totalStages}
          </p>
        </article>

        <article className="rounded-[20px] border border-zinc-200 bg-[#fafaf7] px-5 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Completed stages
          </p>
          <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-zinc-950">
            {completedStages}
          </p>
        </article>

        <article className="rounded-[20px] border border-zinc-200 bg-[#fafaf7] px-5 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Upcoming stages
          </p>
          <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-zinc-950">
            {upcomingStages}
          </p>
        </article>
      </section>

      {goals.length === 0 ? (
        <section className={`${cardMutedClass} rounded-[28px] border-dashed text-center`}>
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
            <div className="flex items-end gap-3">
              <h2 className="font-heading text-4xl tracking-[-0.04em] text-zinc-950">
                Active Plans
              </h2>
              <p className="pb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Goals in motion
              </p>
            </div>

            {activeGoals.length === 0 ? (
              <div className={`${cardMutedClass} rounded-[24px]`}>
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
                      startDateLabel={goal.startDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      endDateLabel={goal.endDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
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
              <div className="flex items-end gap-3">
                <h2 className="font-heading text-4xl tracking-[-0.04em] text-zinc-950">
                  Completed
                </h2>
                <p className="pb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  Finished goals
                </p>
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
                      startDateLabel={goal.startDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      endDateLabel={goal.endDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
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

      <footer className="border-t border-zinc-200 pt-6 text-[11px] uppercase tracking-[0.18em] text-zinc-400">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="normal-case tracking-normal">
            © 2026 GoalTrack | Founder: Ankit Kumar (IIT Gandhinagar)
          </p>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy-policy">Privacy policy</Link>
            <span>Terms of service</span>
            <Link href="/about-us">About us</Link>
            <Link href="/blog">Blog</Link>
            <span>Help center</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
