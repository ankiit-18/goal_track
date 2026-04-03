"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpenText,
  Compass,
  GraduationCap,
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
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 rounded-[20px] px-5 py-4 text-[15px] font-medium transition",
        active
          ? "bg-[#edf1ea] text-emerald-800"
          : "text-zinc-700 hover:bg-zinc-100/80 hover:text-zinc-950"
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-2xl",
          active ? "bg-white text-emerald-700 shadow-sm" : "text-zinc-600"
        )}
      >
        {icon}
      </span>
      <span>{label}</span>
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
  const isHowItWorks = pathname === "/how-it-works";
  const isBlog = pathname === "/blog" || pathname.startsWith("/blog/");

  return (
    <aside className="sticky top-0 hidden h-screen w-[300px] shrink-0 border-r border-zinc-200 bg-[#fbfcf8] lg:flex">
      <div className="flex w-full flex-col">
        <div className="px-10 pb-10 pt-14">
          <Link href="/dashboard" className="block">
            <h1 className="font-heading text-[2.2rem] leading-none tracking-[-0.05em] text-emerald-700">
              GoalTrack
            </h1>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
              Digital curator
            </p>
          </Link>
        </div>

        <div className="px-5">
          <nav className="space-y-2" aria-label="Primary">
            <NavLink
              href="/dashboard"
              label="Overview"
              icon={<LayoutGrid className="h-5 w-5" />}
              active={isDashboard}
            />
            <NavLink
              href="/goals"
              label="Long-term goals"
              icon={<Target className="h-5 w-5" />}
              active={isGoals}
            />
            <NavLink
              href="/dashboard/weekly"
              label="Weekly routine"
              icon={<Compass className="h-5 w-5" />}
              active={isWeekly}
            />
            <NavLink
              href="/how-it-works"
              label="How it works"
              icon={<GraduationCap className="h-5 w-5" />}
              active={isHowItWorks}
            />
            <NavLink
              href="/blog"
              label="Blog"
              icon={<BookOpenText className="h-5 w-5" />}
              active={isBlog}
            />
            <NavLink
              href="/goals/new"
              label="New ambition"
              icon={<PlusCircle className="h-5 w-5" />}
              active={isNew}
            />
          </nav>
        </div>

        <div className="mt-14 px-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
            Preferences
          </p>
          <div className="mt-4 space-y-2">
            <NavLink
              href="/profile"
              label="Settings"
              icon={<UserCircle2 className="h-5 w-5" />}
              active={isProfile}
            />
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-zinc-200 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#9bf2bf] text-xl font-semibold text-zinc-900">
              GT
            </div>
            <div>
              <p className="text-base font-semibold text-zinc-950">GoalTrack</p>
              <p className="text-sm text-zinc-500">Calm workspace</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
