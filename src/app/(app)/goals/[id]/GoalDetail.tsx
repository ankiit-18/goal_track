"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SerializedGoal } from "@/types/goal";
import { ProgressBar } from "@/components/ProgressBar";
import {
  btnPrimaryClass,
  btnSecondaryClass,
  cardClass,
  cardMutedClass,
  inputClass,
  labelClass,
  sectionTitleClass,
} from "@/lib/ui-styles";

function toDatetimeLocalValue(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
  const [editStart, setEditStart] = useState(toDatetimeLocalValue(initial.startDate));
  const [editEnd, setEditEnd] = useState(toDatetimeLocalValue(initial.endDate));
  const [editStatus, setEditStatus] = useState<"ACTIVE" | "COMPLETED">(
    initial.status === "COMPLETED" ? "COMPLETED" : "ACTIVE"
  );

  const [newStageTitle, setNewStageTitle] = useState("");
  const [newStageDeadline, setNewStageDeadline] = useState(() =>
    toDatetimeLocalValue(new Date().toISOString())
  );

  const [aiSteps, setAiSteps] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const sortedStages = useMemo(
    () =>
      [...goal.stages].sort(
        (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      ),
    [goal.stages]
  );

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
      const data = (await res.json()) as { error?: string; goal?: SerializedGoal };
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
      router.push("/dashboard");
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
      const data = (await res.json()) as { error?: string; goal?: SerializedGoal };
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Could not add stage");
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
      const data = (await res.json()) as { error?: string; goal?: SerializedGoal };
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Could not update");
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
      const data = (await res.json()) as { error?: string; goal?: SerializedGoal };
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

  async function suggestBreakdown() {
    setError(null);
    setAiLoading(true);
    setAiSteps(null);
    try {
      const res = await fetch("/api/ai-breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: goal.title }),
      });
      const data = (await res.json()) as { error?: string; steps?: string };
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "AI request failed");
        return;
      }
      if (typeof data.steps === "string") setAiSteps(data.steps);
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/dashboard"
          className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
        >
          ← Back to dashboard
        </Link>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {goal.title}
        </h1>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </p>
      ) : null}

      <section className={cardClass}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className={sectionTitleClass}>Overall progress</h2>
          <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-sm font-bold tabular-nums text-emerald-800 dark:text-emerald-300">
            {goal.progress}%
          </span>
        </div>
        <ProgressBar value={goal.progress} />
      </section>

      <section className={cardClass}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className={sectionTitleClass}>AI breakdown</h2>
          <button
            type="button"
            disabled={aiLoading || pending}
            onClick={() => void suggestBreakdown()}
            className={btnSecondaryClass}
          >
            {aiLoading ? "Generating…" : "Suggest steps"}
          </button>
        </div>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Uses your goal title to propose actionable steps (configure{" "}
          <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">
            OPENAI_API_KEY
          </code>{" "}
          on the server).
        </p>
        {aiSteps ? (
          <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-4 text-sm leading-relaxed text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-200">
            {aiSteps}
          </pre>
        ) : null}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-white">
          Goal details
        </h2>
        <form
          onSubmit={(e) => void saveGoal(e)}
          className={`${cardClass} space-y-5`}
        >
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
              rows={3}
              className={inputClass + " min-h-[5rem] resize-y"}
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
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-800 transition hover:bg-red-100 disabled:opacity-60 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200 dark:hover:bg-red-950/60"
            >
              Delete goal
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-white">
          Stages
        </h2>
        <form
          onSubmit={(e) => void addStage(e)}
          className={`${cardMutedClass} mb-6 flex flex-col gap-4 sm:flex-row sm:items-end`}
        >
          <label className={`${labelClass} block flex-1`}>
            New stage
            <input
              value={newStageTitle}
              onChange={(e) => setNewStageTitle(e.target.value)}
              placeholder="Milestone title"
              className={inputClass}
            />
          </label>
          <label className={`${labelClass} block sm:w-56`}>
            Deadline
            <input
              type="datetime-local"
              value={newStageDeadline}
              onChange={(e) => setNewStageDeadline(e.target.value)}
              className={inputClass}
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className={`${btnSecondaryClass} border-zinc-800 bg-zinc-900 text-white hover:bg-zinc-800 dark:border-zinc-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white`}
          >
            Add stage
          </button>
        </form>

        {sortedStages.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-200 px-4 py-8 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
            No stages yet. Add milestones to drive your progress percentage.
          </p>
        ) : (
          <ul className="space-y-4">
            {sortedStages.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 shadow dark:bg-zinc-900"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span
                    className="text-xl leading-none"
                    aria-hidden
                    title={s.status === "COMPLETED" ? "Done" : "Pending"}
                  >
                    {s.status === "COMPLETED" ? "✅" : "⏳"}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={`font-semibold ${
                        s.status === "COMPLETED"
                          ? "text-zinc-400 line-through dark:text-zinc-500"
                          : "text-zinc-900 dark:text-zinc-50"
                      }`}
                    >
                      {s.title}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {new Date(s.deadline).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {s.status === "PENDING" ? (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => void toggleStage(s.id, "COMPLETED")}
                      className="rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-500/25 dark:text-emerald-300"
                    >
                      Mark done
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => void toggleStage(s.id, "PENDING")}
                      className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                    >
                      Mark pending
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => void deleteStage(s.id)}
                    className="text-xs font-semibold text-red-600 hover:underline dark:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
