"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCheck,
  CircleDashed,
  Clock3,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { SerializedGoal } from "@/types/goal";
import { ProgressBar } from "@/components/ProgressBar";
import {
  btnPrimaryClass,
  cardClass,
  cardMutedClass,
  inputClass,
  labelClass,
} from "@/lib/ui-styles";

function toDatetimeLocalValue(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function daysBetween(from: Date, to: Date) {
  const diff = to.getTime() - from.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

type Props = { initial: SerializedGoal };

export function GoalDetail({ initial }: Props) {
  const router = useRouter();
  const [goal, setGoal] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const [editTitle, setEditTitle] = useState(initial.title);
  const [editDescription, setEditDescription] = useState(
    initial.description ?? ""
  );
  const [editStart, setEditStart] = useState(
    toDatetimeLocalValue(initial.startDate)
  );
  const [editEnd, setEditEnd] = useState(toDatetimeLocalValue(initial.endDate));
  const [editStatus, setEditStatus] = useState<"ACTIVE" | "COMPLETED">(
    initial.status === "COMPLETED" ? "COMPLETED" : "ACTIVE"
  );

  const [newStageTitle, setNewStageTitle] = useState("");
  const [newStageDeadline, setNewStageDeadline] = useState(() =>
    toDatetimeLocalValue(new Date().toISOString())
  );

  const sortedStages = useMemo(
    () =>
      [...goal.stages].sort(
        (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      ),
    [goal.stages]
  );

  const completedStageCount = sortedStages.filter(
    (stage) => stage.status === "COMPLETED"
  ).length;
  const pendingStageCount = sortedStages.length - completedStageCount;
  const nextStage = sortedStages.find((stage) => stage.status === "PENDING");
  const today = new Date();
  const dayCount = daysBetween(today, new Date(goal.endDate));

  async function saveGoal(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch(`/api/goals/${goal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription.trim() || null,
          startDate: new Date(editStart).toISOString(),
          endDate: new Date(editEnd).toISOString(),
          status: editStatus,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        goal?: SerializedGoal;
      };
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Could not save");
        return;
      }
      if (data.goal) setGoal(data.goal);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function removeGoal() {
    if (!confirm("Delete this goal and all its stages?")) return;
    setPending(true);
    try {
      const res = await fetch(`/api/goals/${goal.id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Could not delete goal");
        return;
      }
      router.push("/goals");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function addStage(e: React.FormEvent) {
    e.preventDefault();
    if (!newStageTitle.trim()) return;
    setError(null);
    setPending(true);
    try {
      const res = await fetch(`/api/goals/${goal.id}/stages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newStageTitle.trim(),
          deadline: new Date(newStageDeadline).toISOString(),
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        goal?: SerializedGoal;
      };
      if (!res.ok) {
        setError(
          typeof data.error === "string" ? data.error : "Could not add stage"
        );
        return;
      }
      if (data.goal) {
        setGoal(data.goal);
        setNewStageTitle("");
      }
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function toggleStage(id: string, next: "PENDING" | "COMPLETED") {
    setError(null);
    setPending(true);
    try {
      const res = await fetch(`/api/stages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = (await res.json()) as {
        error?: string;
        goal?: SerializedGoal;
      };
      if (!res.ok) {
        setError(
          typeof data.error === "string" ? data.error : "Could not update"
        );
        return;
      }
      if (data.goal) setGoal(data.goal);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function deleteStage(id: string) {
    if (!confirm("Remove this stage?")) return;
    setPending(true);
    try {
      const res = await fetch(`/api/stages/${id}`, { method: "DELETE" });
      const data = (await res.json()) as {
        error?: string;
        goal?: SerializedGoal;
      };
      if (!res.ok) {
        setError("Could not delete stage");
        return;
      }
      if (data.goal) setGoal(data.goal);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-8 pb-10">
      <section className="relative overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,rgba(250,252,255,0.96),rgba(242,251,247,0.96))] p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.42)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(18,20,30,0.95),rgba(10,24,24,0.95))] sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_28%),radial-gradient(circle_at_left_center,rgba(59,130,246,0.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.12),transparent_28%)]" />

        <div className="relative grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
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
              Goal workspace
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${
                    goal.status === "COMPLETED"
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {goal.status === "COMPLETED" ? "Completed" : "Active"}
                </span>
                <span className="inline-flex items-center rounded-full bg-zinc-950/6 px-3 py-1 text-[11px] font-medium text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
                  {sortedStages.length} stage{sortedStages.length === 1 ? "" : "s"}
                </span>
              </div>

              <h1 className="font-heading text-4xl leading-tight text-zinc-950 dark:text-white sm:text-5xl">
                {goal.title}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
                {goal.description?.trim() ||
                  "Refine the goal details, keep milestones current, and use the timeline below to stay on track."}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[28px] border border-white/70 bg-zinc-950 p-5 text-white dark:border-white/10">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                Overall progress
              </p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="text-4xl font-semibold tracking-tight">
                  {goal.progress}%
                </p>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300">
                  {completedStageCount}/{sortedStages.length || 0} done
                </span>
              </div>
              <div className="mt-4">
                <ProgressBar value={goal.progress} />
              </div>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 backdrop-blur dark:border-white/10 dark:bg-white/5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                Next milestone
              </p>
              <p className="mt-3 text-lg font-semibold text-zinc-950 dark:text-white">
                {nextStage ? nextStage.title : "All milestones complete"}
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {nextStage
                  ? new Date(nextStage.deadline).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "You can add a new stage if this goal is evolving further."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </p>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.28)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
            Completed stages
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            {completedStageCount}
          </p>
        </article>
        <article className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.28)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
            Remaining stages
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            {pendingStageCount}
          </p>
        </article>
        <article className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.28)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
            Goal window
          </p>
          <p className="mt-2 text-base font-semibold text-zinc-950 dark:text-white">
            {new Date(goal.startDate).toLocaleDateString()} -{" "}
            {new Date(goal.endDate).toLocaleDateString()}
          </p>
        </article>
        <article className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.28)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
            Time left
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            {dayCount <= 0 ? "Due" : dayCount}
            {dayCount > 0 ? "d" : ""}
          </p>
        </article>
      </section>

      <section>
        <section
          className={`${cardClass} rounded-[32px] border-white/70 bg-white/85 p-6 shadow-[0_22px_60px_-36px_rgba(15,23,42,0.28)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/75`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                Goal details
              </p>
              <h2 className="mt-2 font-heading text-3xl text-zinc-950 dark:text-white">
                Edit the roadmap
              </h2>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
              <Clock3 className="h-5 w-5" />
            </span>
          </div>

          <form onSubmit={(e) => void saveGoal(e)} className="mt-6 space-y-5">
            <label className={labelClass}>
              Title
              <input
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Description
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4}
                className={inputClass + " min-h-[7rem] resize-y"}
                placeholder="Why this goal matters and what success looks like"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Start
                <input
                  type="datetime-local"
                  required
                  value={editStart}
                  onChange={(e) => setEditStart(e.target.value)}
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                End
                <input
                  type="datetime-local"
                  required
                  value={editEnd}
                  onChange={(e) => setEditEnd(e.target.value)}
                  className={inputClass}
                />
              </label>
            </div>

            <label className={labelClass}>
              Status
              <select
                value={editStatus}
                onChange={(e) =>
                  setEditStatus(e.target.value as "ACTIVE" | "COMPLETED")
                }
                className={inputClass}
              >
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </label>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={pending}
                className={btnPrimaryClass}
              >
                {pending ? "Saving…" : "Save changes"}
              </button>
              <button
                type="button"
                onClick={() => void removeGoal()}
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-800 transition hover:bg-red-100 disabled:opacity-60 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200 dark:hover:bg-red-950/60"
              >
                <Trash2 className="h-4 w-4" />
                Delete goal
              </button>
            </div>
          </form>
        </section>
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
              Milestones
            </p>
            <h2 className="mt-2 font-heading text-3xl text-zinc-950 dark:text-white">
              Stage timeline
            </h2>
          </div>
        </div>

        <form
          onSubmit={(e) => void addStage(e)}
          className={`${cardMutedClass} rounded-[32px] border-white/70 bg-white/70 p-5 backdrop-blur dark:border-white/10 dark:bg-zinc-900/50`}
        >
          <div className="grid gap-4 lg:grid-cols-[1fr_220px_auto]">
            <label className={`${labelClass} block`}>
              New stage
              <input
                value={newStageTitle}
                onChange={(e) => setNewStageTitle(e.target.value)}
                placeholder="Milestone title"
                className={inputClass}
              />
            </label>
            <label className={`${labelClass} block`}>
              Deadline
              <input
                type="datetime-local"
                value={newStageDeadline}
                onChange={(e) => setNewStageDeadline(e.target.value)}
                className={inputClass}
              />
            </label>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={pending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-900/15 transition hover:from-emerald-400 hover:to-emerald-500 disabled:pointer-events-none disabled:opacity-50 dark:from-emerald-500 dark:to-emerald-600 dark:text-white"
              >
                <Plus className="h-4 w-4" />
                Add stage
              </button>
            </div>
          </div>
        </form>

        {sortedStages.length === 0 ? (
          <p className="rounded-[28px] border border-dashed border-zinc-200 px-4 py-10 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
            No stages yet. Add milestones to turn this goal into a clear,
            trackable path.
          </p>
        ) : (
          <ul className="space-y-4">
            {sortedStages.map((stage) => (
              <li
                key={stage.id}
                className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.28)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/75"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <span
                      className={`mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                        stage.status === "COMPLETED"
                          ? "bg-emerald-500 text-white"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                      }`}
                    >
                      {stage.status === "COMPLETED" ? (
                        <CheckCheck className="h-5 w-5" />
                      ) : (
                        <CircleDashed className="h-5 w-5" />
                      )}
                    </span>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p
                          className={`text-lg font-semibold ${
                            stage.status === "COMPLETED"
                              ? "text-zinc-500 line-through decoration-zinc-400 dark:text-zinc-400"
                              : "text-zinc-950 dark:text-white"
                          }`}
                        >
                          {stage.title}
                        </p>
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                            stage.status === "COMPLETED"
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                              : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                          }`}
                        >
                          {stage.status === "COMPLETED" ? "Done" : "Pending"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                        Due{" "}
                        {new Date(stage.deadline).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {stage.status === "PENDING" ? (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => void toggleStage(stage.id, "COMPLETED")}
                        className="rounded-xl bg-emerald-500/15 px-3.5 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-500/25 dark:text-emerald-300"
                      >
                        Mark done
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => void toggleStage(stage.id, "PENDING")}
                        className="rounded-xl bg-zinc-100 px-3.5 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                      >
                        Mark pending
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => void deleteStage(stage.id)}
                      className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
