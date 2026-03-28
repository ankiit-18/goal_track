"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "block rounded-lg px-2 py-2 text-sm font-medium transition",
        active
          ? "bg-white/10 text-white"
          : "text-zinc-400 hover:bg-white/5 hover:text-white"
      )}
    >
      {children}
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
    <div className="flex w-64 shrink-0 flex-col bg-black text-white">
      <div className="p-6">
        <Link href="/dashboard" className="block">
          <h1 className="text-2xl font-bold tracking-tight">GoalTracker</h1>
          <p className="mt-1 text-xs text-zinc-500">Plan · track · finish</p>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4 pb-6">
        <NavLink href="/dashboard" active={isDashboard}>
          Dashboard
        </NavLink>
        <NavLink href="/goals" active={isGoals}>
          Goals
        </NavLink>
        <NavLink href="/dashboard/weekly" active={isWeekly}>
          Weekly routine
        </NavLink>
        <NavLink href="/goals/new" active={isNew}>
          New goal
        </NavLink>
        <NavLink href="/profile" active={isProfile}>
          Profile
        </NavLink>
      </nav>

      <div className="border-t border-zinc-800 p-4">
        <button
          type="button"
          onClick={() => void logout()}
          className="w-full rounded-lg px-2 py-2 text-left text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
