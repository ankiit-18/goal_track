import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { LogoMark } from "@/components/Logo";
import {
  btnPrimaryClass,
  btnSecondaryClass,
  cardClass,
  sectionTitleClass,
} from "@/lib/ui-styles";

export default async function Home() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-500/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-indigo-400/15 blur-3xl dark:bg-indigo-500/10"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex justify-center sm:justify-start">
            <div className="rounded-2xl border border-zinc-200/80 bg-white/60 p-3 shadow-lg shadow-zinc-900/5 ring-1 ring-zinc-200/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/50 dark:ring-zinc-700/80">
              <LogoMark className="h-14 w-14" />
            </div>
          </div>
          <div className="flex justify-center gap-3 sm:justify-end sm:pt-1">
            {[
              { n: "3", l: "Pillars" },
              { n: "7", l: "Days / week" },
              { n: "100%", l: "Progress" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-xl border border-zinc-200/80 bg-white/60 px-4 py-2 text-center dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <p className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                  {s.n}
                </p>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </div>

        <header className="mx-auto mt-10 max-w-2xl text-center sm:mt-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Plan · Track · Finish
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-white">
            Goals that actually move forward
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Break big ambitions into stages with deadlines, build a weekly rhythm,
            and see progress add up—without another complicated system.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className={btnPrimaryClass + " min-w-[140px] px-6 py-3"}
            >
              Get started
            </Link>
            <Link
              href="/login"
              className={btnSecondaryClass + " min-w-[140px] px-6 py-3"}
            >
              Sign in
            </Link>
          </div>
        </header>

        <section className={`${cardClass} mx-auto mt-14 w-full max-w-4xl`}>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <h2 className={sectionTitleClass}>What you get</h2>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
            {[
              {
                t: "Milestones",
                d: "Stages with dates under each long-term goal.",
              },
              {
                t: "Weekly habits",
                d: "Repeatable weekday routines you check off each week.",
              },
              {
                t: "Clear progress",
                d: "A simple bar driven by completed stages.",
              },
            ].map((item) => (
              <li
                key={item.t}
                className={`${cardClass} transition hover:border-emerald-300/60 hover:shadow-md hover:shadow-emerald-900/5 dark:hover:border-emerald-700/40`}
              >
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {item.t}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {item.d}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
