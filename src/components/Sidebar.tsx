"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  LayoutGrid,
  LogOut,
  PlusCircle,
  Target,
  UserCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

function NavLink({
  href,
  label,
  helper,
  icon,
  active,
}: {
  href: string;
  label: string;
  helper: string;
  icon: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-3 overflow-hidden rounded-[22px] border px-3.5 py-3 transition",
        active
          ? "border-white/15 bg-white/12 text-white shadow-[0_18px_45px_-30px_rgba(0,0,0,0.8)]"
          : "border-transparent text-zinc-400 hover:border-white/10 hover:bg-white/6 hover:text-white"
      )}
    >
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition",
          active
            ? "bg-white text-zinc-950"
            : "bg-white/6 text-zinc-300 group-hover:bg-white/10 group-hover:text-white"
        )}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{label}</span>
        <span className="mt-0.5 block truncate text-xs text-zinc-500 group-hover:text-zinc-400">
          {helper}
        </span>
      </span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const isDashboard = pathname === "/dashboard";
  const isGoals =
    pathname === "/goals" ||
    (pathname.startsWith("/goals/") && pathname !== "/goals/new");
  const isWeekly = pathname === "/dashboard/weekly";
  const isNew = pathname === "/goals/new";
  const isProfile = pathname.startsWith("/profile");

  return (
    <aside className="sticky top-0 hidden h-screen w-80 shrink-0 overflow-hidden border-r border-white/10 bg-[linear-gradient(180deg,#050816_0%,#0b1322_46%,#081018_100%)] text-white lg:flex">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.12),transparent_26%)]" />

      <div className="relative flex w-full flex-col p-5">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
          <Link href="/dashboard" className="block">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-white text-zinc-950 shadow-[0_18px_40px_-26px_rgba(255,255,255,0.75)]">
                <Target className="h-7 w-7" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-emerald-300">
                  GoalTrack
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  Plan with clarity
                </h1>
                <p className="mt-2 max-w-[14rem] text-sm leading-6 text-zinc-400">
                  A calm space for long-term goals, weekly rhythm, and daily
                  progress.
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.03] p-3 backdrop-blur">
          <nav className="space-y-2" aria-label="Primary">
            <NavLink
              href="/dashboard"
              label="Dashboard"
              helper="Long-term overview"
              icon={<LayoutGrid className="h-5 w-5" />}
              active={isDashboard}
            />
            <NavLink
              href="/goals"
              label="Goals"
              helper="Browse every goal"
              icon={<Target className="h-5 w-5" />}
              active={isGoals}
            />
            <NavLink
              href="/dashboard/weekly"
              label="Weekly routine"
              helper="See your weekly system"
              icon={<Compass className="h-5 w-5" />}
              active={isWeekly}
            />
            <NavLink
              href="/goals/new"
              label="New goal"
              helper="Create the next roadmap"
              icon={<PlusCircle className="h-5 w-5" />}
              active={isNew}
            />
            <NavLink
              href="/profile"
              label="Profile"
              helper="Account and preferences"
              icon={<UserCircle2 className="h-5 w-5" />}
              active={isProfile}
            />
          </nav>
        </div>

        <div className="mt-6 rounded-[28px] border border-emerald-400/15 bg-emerald-400/8 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-300">
            Focus note
          </p>
          <p className="mt-3 text-sm leading-7 text-zinc-300">
            Great systems make hard goals feel lighter. Keep the next milestone
            visible and the weekly actions small enough to repeat.
          </p>
        </div>

        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={() => void logout()}
            className="flex w-full items-center justify-between rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-semibold text-zinc-300 transition hover:border-white/15 hover:bg-white/[0.07] hover:text-white"
          >
            <span>Log out</span>
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
