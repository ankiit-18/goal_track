import {
  CalendarDays,
  CheckCheck,
  Mail,
  Sparkles,
  Target,
  UserCircle2,
} from "lucide-react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      goals: {
        select: {
          id: true,
          status: true,
          stages: { select: { id: true, status: true } },
        },
      },
    },
  });

  if (!user) redirect("/login");

  const totalGoals = user.goals.length;
  const completedGoals = user.goals.filter((goal) => goal.status === "COMPLETED").length;
  const totalStages = user.goals.reduce((sum, goal) => sum + goal.stages.length, 0);
  const completedStages = user.goals.reduce(
    (sum, goal) =>
      sum + goal.stages.filter((stage) => stage.status === "COMPLETED").length,
    0
  );
  const initials = (user.name || user.email || "U")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="space-y-8 pb-10">
      <section className="relative overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,rgba(250,252,255,0.96),rgba(241,250,249,0.96))] p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.42)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(14,20,30,0.95),rgba(10,22,24,0.95))] sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_28%),radial-gradient(circle_at_left_center,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.12),transparent_30%)]" />

        <div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-700 shadow-sm backdrop-blur dark:bg-white/10 dark:text-zinc-200">
              <Sparkles className="h-3.5 w-3.5" />
              Profile
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[28px] bg-zinc-950 text-2xl font-semibold text-white shadow-[0_20px_50px_-30px_rgba(15,23,42,0.8)] dark:bg-white dark:text-zinc-950">
                {initials || "U"}
              </div>
              <div className="space-y-2">
                <h1 className="font-heading text-4xl leading-tight text-zinc-950 dark:text-white sm:text-5xl">
                  {user.name?.trim() || "Set up your profile"}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
                  Keep your account details tidy and make the app feel more
                  personal while you work through your goals.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[28px] border border-white/70 bg-zinc-950 p-5 text-white dark:border-white/10">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                    Account overview
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    Personal and progress snapshot
                  </p>
                </div>
                <span className="rounded-2xl bg-white/10 p-3 text-emerald-300">
                  <UserCircle2 className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                Your profile powers how GoalTrack greets you and helps anchor
                your workspace.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 backdrop-blur dark:border-white/10 dark:bg-white/5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                Goal momentum
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                    {totalGoals}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                    Goals
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                    {completedGoals}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                    Completed
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
                Email
              </p>
              <p className="mt-2 break-all text-sm font-semibold text-zinc-950 dark:text-white">
                {user.email}
              </p>
            </div>
            <span className="rounded-2xl bg-sky-500/15 p-3 text-sky-700 dark:text-sky-300">
              <Mail className="h-5 w-5" />
            </span>
          </div>
        </article>

        <article className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.28)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/70">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                Member since
              </p>
              <p className="mt-2 text-base font-semibold text-zinc-950 dark:text-white">
                {user.createdAt.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <span className="rounded-2xl bg-amber-500/15 p-3 text-amber-700 dark:text-amber-300">
              <CalendarDays className="h-5 w-5" />
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
                Total stages
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
      </section>

      <ProfileForm initialName={user.name} />
    </div>
  );
}
