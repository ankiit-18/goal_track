"use client";

import dynamic from "next/dynamic";

const WeeklyRoutineClient = dynamic(
  () =>
    import("./WeeklyRoutineClient").then((mod) => mod.WeeklyRoutineClient),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-8">
        <div className="h-12 max-w-md animate-pulse rounded-2xl bg-zinc-200/80 dark:bg-zinc-800" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/80"
            />
          ))}
        </div>
        <div className="h-36 animate-pulse rounded-2xl bg-zinc-200/50 dark:bg-zinc-800/60" />
      </div>
    ),
  }
);

export function WeeklyRoutineClientOnly() {
  return <WeeklyRoutineClient />;
}
