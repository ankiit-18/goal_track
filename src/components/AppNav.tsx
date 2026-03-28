"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/Logo";

export function AppNav() {
  const router = useRouter();
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const navLink = (href: string, label: string) => {
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
          active
            ? "bg-emerald-500/10 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300"
            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 text-zinc-900 dark:text-white"
        >
          <LogoMark className="h-9 w-9 shrink-0 shadow-md shadow-emerald-900/20 rounded-[10px]" />
          <span className="text-base font-semibold tracking-tight">
            GoalTrack
          </span>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-0.5 sm:gap-1">
          {navLink("/dashboard", "Goals")}
          {navLink("/dashboard/weekly", "Weekly")}
          <Link
            href="/goals/new"
            className={`ml-0.5 rounded-xl px-3.5 py-2 text-sm font-semibold shadow-md transition sm:ml-1 ${
              pathname === "/goals/new"
                ? "bg-emerald-600 text-white shadow-emerald-900/25 dark:shadow-emerald-950/40"
                : "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-emerald-900/20 hover:from-emerald-400 hover:to-emerald-500 dark:shadow-emerald-950/30"
            }`}
          >
            New goal
          </Link>
          {navLink("/profile", "Profile")}
          <button
            type="button"
            onClick={() => void logout()}
            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            Log out
          </button>
        </nav>
      </div>
    </header>
  );
}
