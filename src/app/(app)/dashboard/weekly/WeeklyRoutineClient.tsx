"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";
import { readResponseJson } from "@/lib/fetch-json";
import {
  btnPrimaryClass,
  btnSecondaryClass,
  cardMutedClass,
  inputClass,
  labelClass,
} from "@/lib/ui-styles";
import {
  addWeeksToMondayKey,
  formatDateKeyFull,
  formatWeekRangeLabel,
  mondayKeyLocal,
  weekKeysFromMonday,
} from "@/lib/week-dates";

const fetchOpts: RequestInit = { credentials: "include" };
const WEEKDAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKDAY_LONG = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type HabitRow = {
  id: string;
  weekday: number;
  title: string;
  sortOrder: number;
  completionDateKeys: string[];
};

export function WeeklyRoutineClient() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [habits, setHabits] = useState<HabitRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newWeekday, setNewWeekday] = useState(1);

  const mondayKey = useMemo(() => {
    const base = mondayKeyLocal(new Date());
    return addWeeksToMondayKey(base, weekOffset);
  }, [weekOffset]);

  const weekKeys = useMemo(() => weekKeysFromMonday(mondayKey), [mondayKey]);
  const from = weekKeys[0];
  const to = weekKeys[6];

  const todayKey = useMemo(() => {
    const now = new Date();
    const pad = (value: number) => String(value).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/weekly-habits?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
        fetchOpts
      );
      const data = await readResponseJson<{
        error?: string;
        habits?: HabitRow[];
      }>(res);
      if (data === null) {
        setError(
          res.ok
            ? "Empty response from server. Try refreshing the page."
            : `Could not load weekly habits (HTTP ${res.status}).`
        );
        return;
      }
      if (!res.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : "Could not load weekly habits"
        );
        return;
      }
      setHabits(data.habits ?? []);
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    void load();
  }, [load]);

  async function addHabit(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/weekly-habits", {
        ...fetchOpts,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          weekday: newWeekday,
        }),
      });
      const data = await readResponseJson<{
        error?: unknown;
        detail?: string;
      }>(res);
      if (data === null) {
        setError(
          res.ok
            ? "Empty response from server."
            : `Could not add habit (HTTP ${res.status}).`
        );
        return;
      }
      if (!res.ok) {
        const message =
          typeof data.error === "string" ? data.error : "Could not add habit";
        const hint =
          typeof data.detail === "string" && data.detail.length > 0
            ? ` — ${data.detail}`
            : "";
        setError(message + hint);
        return;
      }
      setNewTitle("");
      await load();
    } finally {
      setPending(false);
    }
  }

  async function toggleCompletion(habitId: string, dateKey: string) {
    setPending(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/weekly-habits/${habitId}/toggle-completion`,
        {
          ...fetchOpts,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dateKey }),
        }
      );
      if (!res.ok) {
        const data = await readResponseJson<{ error?: string }>(res);
        setError(
          data?.error ??
            (data === null
              ? `Could not update (HTTP ${res.status}).`
              : "Could not update")
        );
        return;
      }
      await load();
    } finally {
      setPending(false);
    }
  }

  async function removeHabit(id: string) {
    if (
      !confirm("Remove this weekly habit? Its history for past weeks will be deleted.")
    ) {
      return;
    }
    setPending(true);
    try {
      await fetch(`/api/weekly-habits/${id}`, {
        ...fetchOpts,
        method: "DELETE",
      });
      await load();
    } finally {
      setPending(false);
    }
  }

  const rangeLabel = useMemo(
    () => formatWeekRangeLabel(weekKeys[0], weekKeys[6]),
    [weekKeys]
  );

  const totalSlots = habits.length;
  const completedCount = habits.reduce((count, habit) => {
    return (
      count +
      weekKeys.filter((dateKey) => habit.completionDateKeys.includes(dateKey)).length
    );
  }, 0);
  const completionRate =
    totalSlots === 0 ? 0 : Math.round((completedCount / totalSlots) * 100);

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_22px_55px_-42px_rgba(15,23,42,0.16)]">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-start">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Selected week
            </p>
            <h2 className="mt-3 font-heading text-4xl tracking-[-0.04em] text-zinc-950">
              {rangeLabel}
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600">
              Move backward or forward to review a full week of recurring habits.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[20px] border border-zinc-200 bg-[#fafaf7] px-5 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Weekly habits
              </p>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-zinc-950">
                {habits.length}
              </p>
            </div>
            <div className="rounded-[20px] border border-zinc-200 bg-[#fafaf7] px-5 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Check-ins done
              </p>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-zinc-950">
                {completedCount}
              </p>
            </div>
            <div className="rounded-[20px] border border-zinc-200 bg-[#fafaf7] px-5 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Weekly score
              </p>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-zinc-950">
                {completionRate}%
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => setWeekOffset((offset) => offset - 1)}
            className={`${btnSecondaryClass} gap-2 px-3 py-2 text-sm`}
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            type="button"
            disabled={pending || weekOffset === 0}
            onClick={() => setWeekOffset(0)}
            className={`${btnSecondaryClass} px-3 py-2 text-sm disabled:opacity-40`}
          >
            This week
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => setWeekOffset((offset) => offset + 1)}
            className={`${btnSecondaryClass} gap-2 px-3 py-2 text-sm`}
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </p>
      ) : null}

      <section className={cardMutedClass + " rounded-[28px]"}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Add repeating habit
            </p>
            <h2 className="mt-2 font-heading text-4xl tracking-[-0.04em] text-zinc-950">
              Build your weekly system
            </h2>
          </div>
        </div>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">
          Assign a habit to one weekday and it will return every week in the daily board.
        </p>

        <form
          onSubmit={(e) => void addHabit(e)}
          className="mt-6 grid gap-4 lg:grid-cols-[1fr_180px_auto]"
        >
          <label className={`${labelClass} block`}>
            Habit name
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Deep work, reading, strength training"
              className={inputClass}
            />
          </label>

          <label className={`${labelClass} block`}>
            Weekday
            <select
              value={newWeekday}
              onChange={(e) => setNewWeekday(Number(e.target.value))}
              className={inputClass}
            >
              {WEEKDAY_LONG.map((label, index) => (
                <option key={label} value={index + 1}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={pending}
              className={`${btnPrimaryClass} w-full gap-2`}
            >
              <Plus className="h-4 w-4" />
              Add habit
            </button>
          </div>
        </form>
      </section>

      {loading ? (
        <p className="py-8 text-center text-sm font-medium text-zinc-500">
          Loading your week…
        </p>
      ) : (
        <section className="space-y-5">
          <div className="flex items-end gap-3">
            <h2 className="font-heading text-4xl tracking-[-0.04em] text-zinc-950">
              Daily board
            </h2>
            <p className="pb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              One clear card for each day
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {weekKeys.map((dateKey, index) => {
              const dow = index + 1;
              const dayHabits = habits.filter((habit) => habit.weekday === dow);
              const isToday = dateKey === todayKey;

              return (
                <article
                  key={dateKey}
                  className={`rounded-[28px] border bg-white px-6 py-6 shadow-[0_18px_45px_-40px_rgba(15,23,42,0.18)] ${
                    isToday
                      ? "border-emerald-300 bg-[#fbfdf8]"
                      : "border-zinc-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-zinc-500">
                        {WEEKDAY_SHORT[index]}
                      </p>
                      <h3 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-zinc-950">
                        {formatDateKeyFull(dateKey).replace(",", "")}
                      </h3>
                    </div>
                    {isToday ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
                        Today
                      </span>
                    ) : null}
                  </div>

                  <ul className="mt-8 space-y-5">
                    {dayHabits.length === 0 ? (
                      <li className="text-sm text-zinc-400">Nothing scheduled.</li>
                    ) : (
                      dayHabits.map((habit) => {
                        const done = habit.completionDateKeys.includes(dateKey);
                        return (
                          <li key={habit.id} className="flex items-start gap-4">
                            <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-4">
                              <input
                                type="checkbox"
                                checked={done}
                                disabled={pending}
                                onChange={() => void toggleCompletion(habit.id, dateKey)}
                                className="mt-1 h-7 w-7 shrink-0 rounded-full border-zinc-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500/30"
                              />
                              <span
                                className={`min-w-0 text-2xl leading-tight tracking-[-0.03em] ${
                                  done
                                    ? "text-zinc-400 line-through decoration-zinc-300"
                                    : "text-zinc-900"
                                }`}
                              >
                                {habit.title}
                              </span>
                            </label>
                            <button
                              type="button"
                              disabled={pending}
                              onClick={() => void removeHabit(habit.id)}
                              className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-rose-600"
                              aria-label={`Remove ${habit.title}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </li>
                        );
                      })
                    )}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
