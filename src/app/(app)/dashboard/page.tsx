import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Bell,
  Plus,
  TrendingUp,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { goalProgressPercent } from "@/lib/progress";
import {
  DashboardTimelinePanel,
  NextMilestoneStat,
} from "@/components/DashboardTimelinePanel";
import { DashboardNav } from "@/components/DashboardNav";
import { btnPrimaryClass } from "@/lib/ui-styles";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [user, goals] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      select: { name: true, email: true },
    }),
    prisma.goal.findMany({
      where: { userId: session.userId },
      include: { stages: true },
      orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    }),
  ]);

  const displayName = user?.name?.trim() || user?.email?.split("@")[0] || "there";

  const activeGoals = goals.filter((goal) => goal.status !== "COMPLETED");
  const totalGoals = goals.length;
  const completedStages = goals.reduce(
    (sum, goal) =>
      sum + goal.stages.filter((stage) => stage.status === "COMPLETED").length,
    0
  );
  const averageProgress =
    totalGoals === 0
      ? 0
      : Math.round(
          goals.reduce((sum, goal) => sum + goalProgressPercent(goal.stages), 0) /
            totalGoals
        );

  const focusGoals = activeGoals.slice(0, 2).map((goal, index) => {
    const progress = goalProgressPercent(goal.stages);
    const completedStageCount = goal.stages.filter(
      (stage) => stage.status === "COMPLETED"
    ).length;

    return {
      id: goal.id,
      title: goal.title,
      description:
        goal.description?.trim() ||
        "A cleaner roadmap starts by keeping this ambition visible and active.",
      progress,
      completedStageCount,
      remainingStageCount: Math.max(goal.stages.length - completedStageCount, 0),
      priority: index === 0 ? "Priority one" : "Secondary",
      tone:
        index === 0
          ? "bg-emerald-50 text-emerald-700"
          : "bg-zinc-100 text-zinc-700",
    };
  });

  const pendingStages = goals
    .flatMap((goal) =>
      goal.stages
        .filter((stage) => stage.status === "PENDING")
        .map((stage) => ({
          id: stage.id,
          title: stage.title,
          goalId: goal.id,
          goalTitle: goal.title,
          deadline: stage.deadline ? stage.deadline.toISOString() : null,
        }))
    );

  return (
    <div className="rounded-[28px] border border-zinc-200 bg-[#fcfcfa] shadow-[0_24px_60px_-44px_rgba(15,23,42,0.18)]">
      <header className="flex flex-wrap items-start justify-between gap-6 border-b border-zinc-200 px-8 py-8 lg:px-12">
        <div>
          <h1 className="font-heading text-5xl leading-[0.95] tracking-[-0.05em] text-zinc-950">
            {getGreeting()}, {displayName}.
          </h1>
          <p className="mt-4 text-xl text-zinc-700">
            Here is your intentional rhythm for today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:text-zinc-950"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          <Link href="/goals/new" className={btnPrimaryClass + " rounded-2xl px-7 py-4 text-base"}>
            <Plus className="mr-2 h-4 w-4" />
            New Ambition
          </Link>
        </div>
      </header>

      <div className="space-y-10 px-8 py-8 lg:px-12 lg:py-10">
        <DashboardNav />

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total goals",
              value: String(totalGoals),
              detail: `+${Math.max(activeGoals.length, 0)} in motion`,
            },
            {
              label: "Active right now",
              value: String(activeGoals.length),
              detail: activeGoals.length === 0 ? "Quiet focus" : "High focus",
            },
            {
              label: "Avg. completion",
              value: `${averageProgress}%`,
              detail: `${completedStages} stages done`,
            },
          ].map((card) => (
            <article
              key={card.label}
              className="rounded-[28px] border border-zinc-200 bg-white p-7 shadow-[0_22px_50px_-40px_rgba(15,23,42,0.16)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                {card.label}
              </p>
              <div className="mt-4 flex items-end gap-3">
                <p className="font-heading text-5xl leading-none tracking-[-0.05em] text-zinc-950">
                  {card.value}
                </p>
                <p className="pb-1 text-lg text-emerald-700">{card.detail}</p>
              </div>
            </article>
          ))}
          <NextMilestoneStat pendingStages={pendingStages} />
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.25fr_0.55fr]">
          <div>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-heading text-4xl tracking-[-0.04em] text-zinc-950">
                  Active Focus
                </h2>
              </div>
              <Link href="/goals" className="text-2xl font-medium text-emerald-700 transition hover:text-emerald-800">
                View Long-term Goals
              </Link>
            </div>

            <div className="space-y-6">
              {focusGoals.length === 0 ? (
                <div className="rounded-[30px] border border-dashed border-zinc-200 bg-white p-10 text-center">
                  <p className="text-lg text-zinc-600">
                    No active goals yet. Create one to begin your first roadmap.
                  </p>
                </div>
              ) : (
                focusGoals.map((goal) => (
                  <article
                    key={goal.id}
                    className="rounded-[30px] border border-zinc-200 bg-white p-7 shadow-[0_22px_55px_-42px_rgba(15,23,42,0.18)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className={`inline-flex rounded-xl px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${goal.tone}`}>
                          {goal.priority}
                        </span>
                        <h3 className="mt-5 font-heading text-4xl leading-[0.98] tracking-[-0.04em] text-zinc-950">
                          {goal.title}
                        </h3>
                        <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-700">
                          {goal.description}
                        </p>
                      </div>
                      <Link
                        href={`/goals/${goal.id}`}
                        className="inline-flex h-12 w-12 items-center justify-center rounded-full text-zinc-300 transition hover:bg-zinc-50 hover:text-zinc-800"
                        aria-label={`Open ${goal.title}`}
                      >
                        <TrendingUp className="h-5 w-5" />
                      </Link>
                    </div>

                    <div className="mt-8 flex items-end justify-between gap-4">
                      <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">
                        Progress
                      </p>
                      <p className="font-heading text-4xl tracking-[-0.05em] text-emerald-700">
                        {goal.progress}%
                      </p>
                    </div>
                    <div className="mt-5 h-2 rounded-full bg-zinc-100">
                      <div
                        className="h-2 rounded-full bg-[#0c7a4c]"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>

                    <div className="mt-5 flex items-center gap-4 text-sm text-zinc-500">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 text-[11px] font-semibold text-zinc-700">
                          {goal.completedStageCount}
                        </span>
                        <span>{goal.remainingStageCount} stages remaining</span>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          <DashboardTimelinePanel pendingStages={pendingStages} />
        </section>
      </div>
    </div>
  );
}
