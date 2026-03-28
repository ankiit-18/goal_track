"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardNav() {
  const pathname = usePathname();
  const isGoals = pathname === "/dashboard";
  const isWeekly = pathname === "/dashboard/weekly";

  const linkClass = (active: boolean) =>
    `rounded-lg px-4 py-2 text-sm font-semibold transition ${
      active
        ? "bg-white text-emerald-800 shadow-sm dark:bg-zinc-800 dark:text-emerald-300"
        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
    }`;

  return (
    <nav
      className="inline-flex flex-wrap gap-1 rounded-2xl border border-zinc-200/80 bg-zinc-100/80 p-1.5 dark:border-zinc-800 dark:bg-zinc-900/60"
      aria-label="Dashboard views"
    >
      <Link href="/dashboard" className={linkClass(isGoals)}>
        Long-term goals
      </Link>
      <Link href="/dashboard/weekly" className={linkClass(isWeekly)}>
        Weekly routine
      </Link>
    </nav>
  );
}
