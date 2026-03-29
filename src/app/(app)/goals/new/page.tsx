"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarRange, Flag, Sparkles, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  btnPrimaryClass,
  btnSecondaryClass,
  cardClass,
  inputClass,
  labelClass,
} from "@/lib/ui-styles";

function toDatetimeLocalValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function NewGoalPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startLocal, setStartLocal] = useState(() =>
    toDatetimeLocalValue(new Date())
  );
  const [endLocal, setEndLocal] = useState(() => {
    const end = new Date();
    end.setFullYear(end.getFullYear() + 1);
    return toDatetimeLocalValue(end);
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const startDate = new Date(startLocal).toISOString();
      const endDate = new Date(endLocal).toISOString();
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description.trim() || null,
          startDate,
          endDate,
        }),
      });
      const data = (await res.json()) as {
        error?: string | Record<string, string[]>;
        goal?: { id: string };
      };
      if (!res.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : "Could not create goal"
        );
        return;
      }
      if (data.goal?.id) {
        router.push(`/goals/${data.goal.id}`);
        router.refresh();
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-8 pb-10">
      <section className="relative overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,rgba(250,252,255,0.96),rgba(242,251,247,0.96))] p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.42)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(18,20,30,0.95),rgba(10,24,24,0.95))] sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_28%),radial-gradient(circle_at_left_center,rgba(59,130,246,0.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.12),transparent_28%)]" />

        <div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <Link
              href="/goals"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to goals
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-700 shadow-sm backdrop-blur dark:bg-white/10 dark:text-zinc-200">
              <Sparkles className="h-3.5 w-3.5" />
              New goal
            </div>

            <div className="space-y-3">
              <h1 className="font-heading text-4xl leading-tight text-zinc-950 dark:text-white sm:text-5xl">
                Create a goal worth committing to.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
                Capture the outcome, define the time window, and give yourself a
                clear container for milestones and progress.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[28px] border border-white/70 bg-zinc-950 p-5 text-white dark:border-white/10">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                    Goal setup
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    Start with the destination
                  </p>
                </div>
                <span className="rounded-2xl bg-white/10 p-3 text-emerald-300">
                  <Target className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                You can add detailed stages after this, so keep the first draft
                simple and motivating.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 backdrop-blur dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                    Time window
                  </p>
                  <p className="mt-2 text-lg font-semibold text-zinc-950 dark:text-white">
                    Give the goal a real horizon
                  </p>
                </div>
                <span className="rounded-2xl bg-amber-500/15 p-3 text-amber-700 dark:text-amber-300">
                  <CalendarRange className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                A meaningful start and end date makes progress easier to review
                later.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <aside className="rounded-[32px] border border-white/70 bg-zinc-950 p-6 text-white shadow-[0_22px_60px_-34px_rgba(0,0,0,0.85)] dark:border-white/10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Writing prompt
          </p>
          <h2 className="mt-2 font-heading text-3xl text-white">
            Make it specific
          </h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">What outcome?</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Name the result you want, not just the activity.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">Why now?</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Add a short description to anchor the reason behind the goal.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">How long?</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Choose a realistic timeframe you can actually review against.
              </p>
            </div>
          </div>
        </aside>

        <form
          onSubmit={(e) => void onSubmit(e)}
          className={`${cardClass} rounded-[32px] border-white/70 bg-white/85 p-6 shadow-[0_22px_60px_-36px_rgba(15,23,42,0.28)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/75`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                Goal details
              </p>
              <h2 className="mt-2 font-heading text-3xl text-zinc-950 dark:text-white">
                Set up the roadmap
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                Start with the core details now. You can add milestones and more
                structure on the next screen.
              </p>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
              <Flag className="h-5 w-5" />
            </span>
          </div>

          {error ? (
            <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/50 dark:text-red-200">
              {error}
            </p>
          ) : null}

          <div className="mt-6 space-y-5">
            <label className={labelClass}>
              Title
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
                placeholder="e.g. Crack GATE, Launch portfolio, Build savings"
              />
            </label>

            <label className={labelClass}>
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className={inputClass + " min-h-[7rem] resize-y"}
                placeholder="What does success look like, and why does this goal matter right now?"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Start
                <input
                  type="datetime-local"
                  required
                  value={startLocal}
                  onChange={(e) => setStartLocal(e.target.value)}
                  className={inputClass}
                />
              </label>

              <label className={labelClass}>
                End
                <input
                  type="datetime-local"
                  required
                  value={endLocal}
                  onChange={(e) => setEndLocal(e.target.value)}
                  className={inputClass}
                />
              </label>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200/80 pt-5 dark:border-white/10">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              After creating it, you can add stages and deadlines.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={pending}
                className={btnPrimaryClass}
              >
                {pending ? "Saving…" : "Create goal"}
              </button>
              <Link href="/goals" className={btnSecondaryClass}>
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
