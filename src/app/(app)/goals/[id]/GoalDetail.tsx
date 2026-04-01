"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCheck,
  CircleDashed,
  MoreVertical,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { SerializedGoal } from "@/types/goal";
import { ProgressBar } from "@/components/ProgressBar";
import {
  btnPrimaryClass,
  inputClass,
  labelClass,
} from "@/lib/ui-styles";

function toDatetimeLocalValue(iso: string) {
  const d = getIstShiftedDate(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const IST_OFFSET_MINUTES = 330;

function getIstShiftedDate(value: string | Date) {
  const base = new Date(value);
  return new Date(base.getTime() + IST_OFFSET_MINUTES * 60 * 1000);
}

function formatDateLabel(value: string) {
  const date = getIstShiftedDate(value);
  return `${String(date.getUTCDate()).padStart(2, "0")}/${String(
    date.getUTCMonth() + 1
  ).padStart(2, "0")}/${date.getUTCFullYear()}`;
}

function formatDateTimeLabel(value: string) {
  const date = getIstShiftedDate(value);
  const hours24 = date.getUTCHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const meridiem = hours24 >= 12 ? "PM" : "AM";
  return `${date.getUTCDate()} ${MONTHS_SHORT[date.getUTCMonth()]} ${date.getUTCFullYear()}, ${hours12}:${minutes} ${meridiem}`;
}

function monthYearLabel(value: string) {
  const date = getIstShiftedDate(value);
  return `${MONTHS_SHORT[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

function daysBetween(from: string, to: string) {
  const diff = new Date(to).getTime() - new Date(from).getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
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
  const timelineDays = daysBetween(goal.startDate, goal.endDate);
  const progressTone =
    goal.status === "COMPLETED"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-emerald-50 text-emerald-700";

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
    <div className="space-y-8 pb-14">
      <div className="flex items-center justify-between">
        <Link
          href="/goals"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to goals
        </Link>
      </div>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-[34px] border border-[#e7eadf] bg-[radial-gradient(circle_at_top_left,_rgba(232,244,236,0.85),_rgba(255,255,255,0.96)_34%,_#ffffff_78%)] shadow-[0_30px_80px_-60px_rgba(24,48,33,0.42)]">
        <div className="grid gap-10 px-6 py-8 lg:px-8 xl:grid-cols-[0.9fr_1.1fr] xl:gap-0 xl:px-0 xl:py-0">
          <section className="space-y-8 xl:px-10 xl:py-10">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${progressTone}`}
                >
                  {goal.status === "COMPLETED" ? "Completed" : "Active"}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                  Long-term goal
                </span>
              </div>

              <h1 className="mt-4 font-heading text-6xl italic leading-[0.9] tracking-[-0.06em] text-zinc-950 sm:text-7xl">
                {goal.title}
              </h1>

              <div className="mt-8 grid grid-cols-2 gap-6 sm:max-w-md">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                    Stages
                  </p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-700">
                    {sortedStages.length} total
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                    Status
                  </p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-700">
                    {completedStageCount}/{sortedStages.length || 0} complete
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={(e) => void saveGoal(e)} className="space-y-6">
              <div>
                <p className="font-heading text-3xl italic text-zinc-800">
                  Definition
                </p>
                <input
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={
                    inputClass +
                    " mt-4 rounded-none border-x-0 border-t-0 border-b-zinc-200 bg-transparent px-0 py-3 text-2xl shadow-none focus:ring-0"
                  }
                />
              </div>

              <label className={labelClass}>
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                  Philosophy & context
                </span>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={5}
                  className={
                    inputClass +
                    " mt-3 min-h-[8.5rem] rounded-[20px] border-zinc-200 bg-white/90 text-base shadow-none focus:ring-0"
                  }
                  placeholder="Articulate the core purpose of this initiative..."
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                    Timeline start
                  </span>
                  <input
                    type="datetime-local"
                    required
                    value={editStart}
                    onChange={(e) => setEditStart(e.target.value)}
                    className={
                      inputClass +
                      " mt-3 rounded-[15px] border-zinc-200 bg-white/90 shadow-none focus:ring-0"
                    }
                  />
                </label>
                <label className={labelClass}>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                    Target end
                  </span>
                  <input
                    type="datetime-local"
                    required
                    value={editEnd}
                    onChange={(e) => setEditEnd(e.target.value)}
                    className={
                      inputClass +
                      " mt-3 rounded-[15px] border-zinc-200 bg-white/90 shadow-none focus:ring-0"
                    }
                  />
                </label>
              </div>

              <label className={labelClass}>
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                  Framework visibility
                </span>
                <select
                  value={editStatus}
                  onChange={(e) =>
                    setEditStatus(e.target.value as "ACTIVE" | "COMPLETED")
                  }
                  className={
                    inputClass +
                    " mt-3 rounded-[15px] border-zinc-200 bg-white/90 shadow-none focus:ring-0"
                  }
                >
                  <option value="ACTIVE">Active workspace</option>
                  <option value="COMPLETED">Completed archive</option>
                </select>
              </label>

              <div className="rounded-[24px] border border-[#e7eadf] bg-white/75 p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                      Goal window
                    </p>
                    <p
                      suppressHydrationWarning
                      className="mt-2 text-base font-semibold text-zinc-950"
                    >
                      {formatDateLabel(goal.startDate)} to {formatDateLabel(goal.endDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                      Planned duration
                    </p>
                    <p className="mt-2 text-base font-semibold text-zinc-950">
                      {timelineDays} days
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-zinc-800 disabled:opacity-50"
                >
                  {pending ? "Saving…" : "Save goal framework"}
                </button>
                <button
                  type="button"
                  onClick={() => void removeGoal()}
                  disabled={pending}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 transition hover:text-red-700 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete goal
                </button>
              </div>
            </form>
          </section>

          <section className="space-y-8 border-t border-[#e7eadf] xl:border-l xl:border-t-0 xl:px-10 xl:py-10">
            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
              <div className="rounded-[28px] border border-[#e7eadf] bg-white/78 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-heading text-4xl italic tracking-[-0.04em] text-zinc-900">
                      Overall Progress
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      Every completed stage sharpens the shape of this long-term goal.
                    </p>
                  </div>
                  <p className="text-3xl font-semibold text-emerald-700">
                    {goal.progress}%
                  </p>
                </div>

                <div className="mt-6">
                  <ProgressBar value={goal.progress} />
                </div>
              </div>

              <div className="rounded-[28px] border border-[#e7eadf] bg-[#fbfbf7] p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                  Next milestone
                </p>
                <p className="mt-3 text-2xl font-semibold text-zinc-950">
                  {nextStage ? nextStage.title : "All milestones complete"}
                </p>
                <p
                  suppressHydrationWarning
                  className="mt-3 text-sm leading-6 text-zinc-500"
                >
                  {nextStage
                    ? formatDateTimeLabel(nextStage.deadline)
                    : "You can add a fresh stage if this goal is still evolving."}
                </p>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200/80 pb-4">
                <div>
                  <p className="font-heading text-3xl italic text-zinc-900">
                    Evolutionary Stages
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">
                    Arrange the path in clear, sequential milestones.
                  </p>
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                  {pendingStageCount} remaining
                </p>
              </div>

              <form
                onSubmit={(e) => void addStage(e)}
                className="mt-6 grid gap-4 rounded-[28px] border border-[#e7eadf] bg-[#fafaf7] p-5 lg:grid-cols-[1fr_220px_160px]"
              >
                <label className={`${labelClass} block`}>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                    New stage milestone
                  </span>
                  <input
                    value={newStageTitle}
                    onChange={(e) => setNewStageTitle(e.target.value)}
                    placeholder="Describe the next phase..."
                    className={
                      inputClass +
                      " mt-3 rounded-[15px] border-zinc-200 bg-white shadow-none focus:ring-0"
                    }
                  />
                </label>

                <label className={`${labelClass} block`}>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                    Target date
                  </span>
                  <input
                    type="datetime-local"
                    value={newStageDeadline}
                    onChange={(e) => setNewStageDeadline(e.target.value)}
                    className={
                      inputClass +
                      " mt-3 rounded-[15px] border-zinc-200 bg-white shadow-none focus:ring-0"
                    }
                  />
                </label>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={pending}
                    className={btnPrimaryClass + " w-full rounded-xl px-4 py-3 text-sm"}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add phase
                  </button>
                </div>
              </form>

              {sortedStages.length === 0 ? (
                <div className="mt-6 rounded-[28px] border border-dashed border-zinc-200 px-5 py-12 text-center text-sm text-zinc-500">
                  No stages yet. Add milestones to shape the path forward.
                </div>
              ) : (
                <div className="mt-8 space-y-6">
                  {sortedStages.map((stage, index) => (
                    <div
                      key={stage.id}
                      className="grid grid-cols-[28px_1fr] gap-4 sm:gap-5"
                    >
                      <div className="flex flex-col items-center">
                        <span
                          className={`mt-3 flex h-7 w-7 items-center justify-center rounded-full border ${
                            stage.status === "COMPLETED"
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-zinc-300 bg-white text-zinc-400"
                          }`}
                        >
                          {stage.status === "COMPLETED" ? (
                            <CheckCheck className="h-3.5 w-3.5" />
                          ) : (
                            <CircleDashed className="h-3.5 w-3.5" />
                          )}
                        </span>
                        {index < sortedStages.length - 1 ? (
                          <span className="mt-2 h-full w-px bg-zinc-200" />
                        ) : null}
                      </div>

                      <article className="rounded-[28px] border border-[#e7eadf] bg-white/82 px-6 py-6 shadow-[0_28px_70px_-60px_rgba(15,23,42,0.25)]">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                              {stage.status === "COMPLETED"
                                ? "Completed phase"
                                : "Active phase"}
                            </p>
                            <h3
                              className={`mt-3 font-heading text-[2rem] italic leading-none tracking-[-0.05em] sm:text-[2.4rem] ${
                                stage.status === "COMPLETED"
                                  ? "text-zinc-400 line-through decoration-zinc-300"
                                  : "text-zinc-950"
                              }`}
                            >
                              {stage.title}
                            </h3>
                            <div className="mt-4 flex flex-wrap gap-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                              <span
                                suppressHydrationWarning
                                className={
                                  stage.status === "COMPLETED"
                                    ? "text-emerald-700"
                                    : "text-zinc-500"
                                }
                              >
                                {stage.status === "COMPLETED"
                                  ? `Completed ${monthYearLabel(stage.deadline)}`
                                  : `Due ${monthYearLabel(stage.deadline)}`}
                              </span>
                              <span
                                suppressHydrationWarning
                                className="text-zinc-500"
                              >
                                {formatDateTimeLabel(stage.deadline)}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                            aria-label="Stage actions"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                          {stage.status === "PENDING" ? (
                            <button
                              type="button"
                              disabled={pending}
                              onClick={() => void toggleStage(stage.id, "COMPLETED")}
                              className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 transition hover:text-emerald-800"
                            >
                              Mark as complete
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={pending}
                              onClick={() => void toggleStage(stage.id, "PENDING")}
                              className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 transition hover:text-zinc-700"
                            >
                              Mark pending
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={pending}
                            onClick={() => void deleteStage(stage.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-600 transition hover:text-red-700"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
