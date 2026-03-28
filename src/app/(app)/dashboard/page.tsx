import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { goalProgressPercent } from "@/lib/progress";
import { ProgressBar } from "@/components/ProgressBar";
import { DashboardNav } from "@/components/DashboardNav";
import {
  btnPrimaryClass,
  cardClass,
  cardMutedClass,
  sectionTitleClass,
} from "@/lib/ui-styles";

function startOfToday() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const goals = await prisma.goal.findMany({
    where: { userId: session.userId },
    include: { stages: true },
    orderBy: { updatedAt: "desc" },
  });

  const today = startOfToday();

  const upcomingStages = goals
    .flatMap((g) =>
      g.stages
        .filter((s) => s.status === "PENDING" && s.deadline >= today)
        .map((s) => ({
          stageId: s.id,
          title: s.title,
          deadline: s.deadline,
          goalId: g.id,
          goalTitle: g.title,
        }))
    )
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
    .slice(0, 12);

  const activeCount = goals.filter((g) => g.status === "ACTIVE").length;
  const doneCount = goals.filter((g) => g.status === "COMPLETED").length;

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <DashboardNav />
        <div className="flex gap-3 sm:pt-1">
          <div className="rounded-xl border border-zinc-200/80 bg-white/60 px-4 py-2 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="text-2xl font-bold tabular-nums text-zinc-900 dark:text-white">
              {goals.length}
            </p>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Goals
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200/80 bg-white/60 px-4 py-2 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {activeCount}
            </p>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Active
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200/80 bg-white/60 px-4 py-2 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="text-2xl font-bold tabular-nums text-zinc-600 dark:text-zinc-300">
              {doneCount}
            </p>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Done
            </p>
          </div>
        </div>
      </div>

      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Long-term goals
        </h1>
        <p className="max-w-2xl text-base text-zinc-600 dark:text-zinc-400">
          Milestones, deadlines, and progress in one calm overview.
        </p>
      </header>

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
          <ul className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {goals.map((g) => {
              const progress = goalProgressPercent(g.stages);
              return (
                <li key={g.id}>
                  <Link
                    href={`/goals/${g.id}`}
                    className={`${cardClass} group block transition hover:border-emerald-300/60 hover:shadow-md hover:shadow-emerald-900/5 dark:hover:border-emerald-700/40`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-emerald-800 dark:text-white dark:group-hover:text-emerald-300">
                          {g.title}
                        </h3>
                        {g.description ? (
                          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                            {g.description}
                          </p>
                        ) : null}
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                          g.status === "COMPLETED"
                            ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300"
                            : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}
                      >
                        {g.status === "COMPLETED" ? "Completed" : "Active"}
                      </span>
                    </div>
                    <div className="mt-5">
                      <div className="mb-2 flex justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        <span>Progress</span>
                        <span className="tabular-nums text-zinc-700 dark:text-zinc-300">
                          {progress}%
                        </span>
                      </div>
                      <ProgressBar value={progress} />
                    </div>
                    <p className="mt-4 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <span className="inline-block h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                      {g.startDate.toLocaleDateString()} →{" "}
                      {g.endDate.toLocaleDateString()}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
