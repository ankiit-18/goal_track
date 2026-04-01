import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { DashboardNav } from "@/components/DashboardNav";
import { WeeklyRoutineClientOnly } from "./WeeklyRoutineClientOnly";

export default async function WeeklyDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="space-y-10 pb-14">
      <DashboardNav />

      <section className="rounded-[34px] border border-zinc-200 bg-white px-8 py-10 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.18)] lg:px-10">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:items-start">
          <div>
            <h1 className="max-w-3xl font-heading text-6xl leading-[0.92] tracking-[-0.06em] text-zinc-950">
              Weekly goals,
              <span className="block italic font-normal">organized into a steady rhythm.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-600">
              Review the full week at a glance, keep each day simple, and build
              a recurring routine that supports your long-term goals.
            </p>
          </div>

          <div className="rounded-[22px] bg-[#f7f8f4] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Weekly system
            </p>
            <p className="mt-4 text-sm leading-7 text-zinc-600">
              Add habits to a weekday once, then check them off week by week.
              The board below gives each day a simple, readable home.
            </p>
          </div>
        </div>
      </section>

      <WeeklyRoutineClientOnly />
    </div>
  );
}
