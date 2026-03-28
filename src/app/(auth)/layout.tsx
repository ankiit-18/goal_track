import { LogoMark } from "@/components/Logo";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <div
        className="pointer-events-none absolute right-0 top-0 h-72 w-72 translate-x-1/4 -translate-y-1/4 rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-500/10"
        aria-hidden
      />
      <header className="relative z-10 px-4 pt-8 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200"
        >
          <LogoMark className="h-8 w-8" />
          GoalTrack
        </Link>
      </header>
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12 sm:py-16">
        {children}
      </div>
    </div>
  );
}
