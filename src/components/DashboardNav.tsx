"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Repeat2 } from "lucide-react";

export function DashboardNav() {
  const pathname = usePathname();
  const isGoals = pathname === "/dashboard";
  const isWeekly = pathname === "/dashboard/weekly";

  const linkClass = (active: boolean) =>
    `inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
      active
        ? "bg-white text-zinc-950 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.45)] dark:bg-white dark:text-zinc-950"
        : "text-zinc-600 hover:bg-white/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100"
    }`;

  return (
    <nav
      className="inline-flex flex-wrap gap-2 rounded-[24px] border border-white/70 bg-white/75 p-2 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.45)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/65"
      aria-label="Dashboard views"
    >
      <Link href="/dashboard" className={linkClass(isGoals)}>
        <Compass className="h-4 w-4" />
        Long-term goals
      </Link>
      <Link href="/dashboard/weekly" className={linkClass(isWeekly)}>
        <Repeat2 className="h-4 w-4" />
        Weekly routine
      </Link>
    </nav>
  );
}
