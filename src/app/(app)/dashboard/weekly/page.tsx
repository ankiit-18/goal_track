import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { DashboardNav } from "@/components/DashboardNav";
import { WeeklyRoutineClientOnly } from "./WeeklyRoutineClientOnly";

export default async function WeeklyDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="space-y-8">
      <DashboardNav />
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Habits & rhythm
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Weekly routine
        </h1>
        <p className="max-w-2xl text-base text-zinc-600 dark:text-zinc-400">
          Assign activities to weekdays—they repeat every week. Check them off
          for the week you&apos;re viewing, or jump to past and future weeks.
        </p>
      </header>
      <WeeklyRoutineClientOnly />
    </div>
  );
}
