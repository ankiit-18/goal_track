import { CalendarDays, Repeat2, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { DashboardNav } from "@/components/DashboardNav";
import { WeeklyRoutineClientOnly } from "./WeeklyRoutineClientOnly";

export default async function WeeklyDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="space-y-8 pb-10">
      <DashboardNav />

      <section className="relative overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,rgba(240,253,250,0.94),rgba(239,246,255,0.95))] p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.38)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(10,20,25,0.95),rgba(13,24,35,0.92))] sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.18),transparent_30%),radial-gradient(circle_at_left_bottom,rgba(59,130,246,0.18),transparent_34%)]" />

        <div className="relative grid gap-8 xl:grid-cols-[1.3fr_0.8fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-700 shadow-sm backdrop-blur dark:bg-white/10 dark:text-zinc-200">
              <Sparkles className="h-3.5 w-3.5" />
              Weekly rhythm
            </div>

            <div className="max-w-3xl space-y-3">
              <h1 className="font-heading text-4xl leading-tight text-zinc-950 dark:text-white sm:text-5xl">
                Shape the week that supports your long-term goals.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
                Keep your recurring habits visible, review each day at a glance,
                and build a routine that keeps momentum steady.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 backdrop-blur dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                    How it works
                  </p>
                  <p className="mt-2 text-lg font-semibold text-zinc-950 dark:text-white">
                    Habits repeat every week
                  </p>
                </div>
                <span className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-700 dark:text-emerald-300">
                  <Repeat2 className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                Assign each habit to a weekday, then check it off for the
                specific week you are reviewing.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-zinc-950 p-5 text-white dark:border-white/10">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                Weekly mindset
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="rounded-2xl bg-white/10 p-3 text-sky-300">
                  <CalendarDays className="h-5 w-5" />
                </span>
                <p className="text-sm leading-6 text-zinc-300">
                  Plan lightly, review often, and let consistency do the heavy
                  lifting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WeeklyRoutineClientOnly />
    </div>
  );
}
