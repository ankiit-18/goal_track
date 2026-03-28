import Link from "next/link";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { goalProgressPercent } from "@/lib/progress";
import { DashboardNav } from "@/components/DashboardNav";
import GoalCard from "@/components/GoalCard";
import {
  btnPrimaryClass,
  cardClass,
  cardMutedClass,
  sectionTitleClass,
} from "@/lib/ui-styles";

type GoalWithStages = Prisma.GoalGetPayload<{ include: { stages: true } }>;

function startOfToday() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const goals: GoalWithStages[] = await prisma.goal.findMany({
    where: { userId: session.userId },
    include: { stages: true },
    orderBy: { updatedAt: "desc" },
  });

  const today = startOfToday();

  const upcomingStages = goals
    .flatMap((g) =>
      g.stages
        .filter(
          (s: GoalWithStages["stages"][number]) =>
            s.status === "PENDING" && s.deadline >= today
        )
        .map((s: GoalWithStages["stages"][number]) => ({
          stageId: s.id,
          title: s.title,
          deadline: s.deadline,
          goalId: g.id,
          goalTitle: g.title,
        }))
    )
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
    .slice(0, 12);

  const doneCount = goals.filter((g) => g.status === "COMPLETED").length;
  const pendingCount = goals.filter((g) => g.status !== "COMPLETED").length;

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <DashboardNav />
      </div>

      <header className="space-y-1">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Dashboard
        </h1>
        <p className="max-w-2xl text-base text-zinc-600 dark:text-zinc-400">
          Milestones, deadlines, and progress in one calm overview.
        </p>
      </header>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-md dark:bg-zinc-900 dark:shadow-none">
          <p className="text-sm text-gray-600 dark:text-zinc-400">
            <span className="font-medium">Total goals:</span>{" "}
            <span className="text-lg font-bold tabular-nums text-gray-900 dark:text-white">
              {goals.length}
            </span>
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-md dark:bg-zinc-900 dark:shadow-none">
          <p className="text-sm text-gray-600 dark:text-zinc-400">
            <span className="font-medium">Completed:</span>{" "}
            <span className="text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {doneCount}
            </span>
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-md dark:bg-zinc-900 dark:shadow-none">
          <p className="text-sm text-gray-600 dark:text-zinc-400">
            <span className="font-medium">Pending:</span>{" "}
            <span className="text-lg font-bold tabular-nums text-gray-800 dark:text-zinc-300">
              {pendingCount}
            </span>
          </p>
        </div>
      </div>

      <section className={cardClass}>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <h2 className={sectionTitleClass}>Upcoming deadlines</h2>
        </div>
        {upcomingStages.length === 0 ? (
          <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            No pending stage deadlines from today onward. Open a goal and add
            stages to see them here.
          </p>
        ) : (
          <ul className="mt-5 space-y-1">
            {upcomingStages.map((row) => (
              <li key={row.stageId}>
                <Link
                  href={`/goals/${row.goalId}`}
                  className="group flex flex-wrap items-baseline justify-between gap-2 rounded-xl px-3 py-3 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-emerald-700 group-hover:underline dark:text-emerald-400">
                      {row.goalTitle}
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      {row.title}
                    </p>
                  </div>
                  <time
                    dateTime={row.deadline.toISOString()}
                    className="shrink-0 rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium tabular-nums text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
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
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            All goals
          </h2>
          <Link href="/goals/new" className={btnPrimaryClass}>
            Create goal
          </Link>
        </div>

        {goals.length === 0 ? (
          <div
            className={`${cardMutedClass} border-dashed text-center dark:border-zinc-700`}
          >
            <p className="text-zinc-600 dark:text-zinc-400">
              No goals yet. Create one to split it into stages and track
              progress.
            </p>
            <Link
              href="/goals/new"
              className="mt-5 inline-flex font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
            >
              Create your first goal →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {goals.map((g) => {
              const progress = goalProgressPercent(g.stages);
              return (
                <GoalCard
                  key={g.id}
                  href={`/goals/${g.id}`}
                  title={g.title}
                  description={g.description}
                  progress={progress}
                  status={g.status as "ACTIVE" | "COMPLETED"}
                  startDateLabel={g.startDate.toLocaleDateString()}
                  endDateLabel={g.endDate.toLocaleDateString()}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
