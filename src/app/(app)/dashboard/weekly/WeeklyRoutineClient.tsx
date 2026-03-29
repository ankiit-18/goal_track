"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleDashed,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { readResponseJson } from "@/lib/fetch-json";
import {
  btnPrimaryClass,
  btnSecondaryClass,
  cardClass,
  cardMutedClass,
  inputClass,
  labelClass,
} from "@/lib/ui-styles";
import {
  addWeeksToMondayKey,
  formatDateKeyShort,
  formatWeekRangeLabel,
  mondayKeyLocal,
  weekKeysFromMonday,
} from "@/lib/week-dates";

const fetchOpts: RequestInit = { credentials: "include" };
const WEEKDAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
    return count + weekKeys.filter((dateKey) => habit.completionDateKeys.includes(dateKey)).length;
  }, 0);
  const completionRate = totalSlots === 0 ? 0 : Math.round((completedCount / totalSlots) * 100);
  const todayHabits = habits.filter((habit) => {
    const dayIndex = weekKeys.indexOf(todayKey);
    return dayIndex >= 0 && habit.weekday === dayIndex + 1;
  });

  return (
    <div className="space-y-6">
      <section className={`${cardClass} overflow-hidden rounded-[32px] border-white/70 bg-white/80 p-0 dark:border-white/10 dark:bg-zinc-900/70`}>
        <div className="grid gap-0 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="border-b border-zinc-200/70 p-6 dark:border-white/10 xl:border-b-0 xl:border-r">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                  Selected week
                </p>
                <h2 className="mt-2 font-heading text-3xl text-zinc-950 dark:text-white">
                  {rangeLabel}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  Review the whole week at once, or jump backward and forward to
                  compare your rhythm over time.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
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
            </div>
          </div>

          <div className="grid gap-px bg-zinc-200/70 dark:bg-white/10 sm:grid-cols-3 xl:grid-cols-3">
            <div className="bg-white/85 p-5 dark:bg-zinc-950/40">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                Weekly habits
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                {habits.length}
              </p>
            </div>
            <div className="bg-white/85 p-5 dark:bg-zinc-950/40">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                Check-ins done
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                {completedCount}
              </p>
            </div>
            <div className="bg-white/85 p-5 dark:bg-zinc-950/40">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                Weekly score
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                {completionRate}%
              </p>
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </p>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-[32px] border border-white/70 bg-zinc-950 p-6 text-white shadow-[0_22px_60px_-34px_rgba(0,0,0,0.85)] dark:border-white/10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                Today&apos;s pulse
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                Daily focus
              </h2>
            </div>
            <span className="rounded-2xl bg-white/10 p-3 text-emerald-300">
              <Sparkles className="h-5 w-5" />
            </span>
          </div>

          {weekKeys.includes(todayKey) ? (
            <div className="mt-6 space-y-3">
              {todayHabits.length === 0 ? (
                <p className="text-sm leading-7 text-zinc-400">
                  Nothing is scheduled for today. Add a recurring habit below if
                  you want a lighter routine to stay visible.
                </p>
              ) : (
                todayHabits.map((habit) => {
                  const done = habit.completionDateKeys.includes(todayKey);
                  return (
                    <div
                      key={habit.id}
                      className={`rounded-2xl border p-4 ${
                        done
                          ? "border-emerald-500/30 bg-emerald-500/10"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl ${
                            done
                              ? "bg-emerald-400 text-zinc-950"
                              : "bg-white/10 text-zinc-300"
                          }`}
                        >
                          {done ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <CircleDashed className="h-4 w-4" />
                          )}
                        </span>
                        <div>
                          <p className="font-semibold text-white">{habit.title}</p>
                          <p className="mt-1 text-sm text-zinc-400">
                            {done ? "Checked off for today." : "Still open for today."}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <p className="mt-6 text-sm leading-7 text-zinc-400">
              You&apos;re viewing a different week, so today&apos;s focus is hidden
              until you return to the current week.
            </p>
          )}
        </div>

        <section className={cardMutedClass + " rounded-[32px]"}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                Add repeating habit
              </p>
              <h2 className="mt-2 font-heading text-3xl text-zinc-950 dark:text-white">
                Build your weekly system
              </h2>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Pick the weekday where this habit belongs. It will appear every week
            on that day, ready to be checked off.
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
                placeholder="e.g. Deep work, 30 min reading, strength training"
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
                {WEEKDAY_SHORT.map((label, index) => (
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
      </section>

      {loading ? (
        <p className="py-8 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Loading your week…
        </p>
      ) : (
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                Week at a glance
              </p>
              <h2 className="mt-2 font-heading text-3xl text-zinc-950 dark:text-white">
                Daily board
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-7">
            {weekKeys.map((dateKey, index) => {
              const dow = index + 1;
              const dayHabits = habits.filter((habit) => habit.weekday === dow);
              const doneCount = dayHabits.filter((habit) =>
                habit.completionDateKeys.includes(dateKey)
              ).length;
              const isToday = dateKey === todayKey;

              return (
                <article
                  key={dateKey}
                  className={`flex min-h-[18rem] flex-col overflow-hidden rounded-[28px] border bg-white/85 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.28)] backdrop-blur dark:bg-zinc-900/75 ${
                    isToday
                      ? "border-emerald-400/70 ring-2 ring-emerald-500/20 dark:border-emerald-500/50"
                      : "border-white/70 dark:border-white/10"
                  }`}
                >
                  <div
                    className={`border-b px-5 py-4 ${
                      isToday
                        ? "border-emerald-200 bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(45,212,191,0.06))] dark:border-emerald-500/20 dark:bg-[linear-gradient(135deg,rgba(16,185,129,0.16),rgba(45,212,191,0.04))]"
                        : "border-zinc-200/70 bg-zinc-50/90 dark:border-white/10 dark:bg-zinc-950/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                          {WEEKDAY_SHORT[index]}
                        </p>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                          {formatDateKeyShort(dateKey)}
                        </p>
                      </div>
                      {isToday ? (
                        <span className="rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                          Today
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                      {dayHabits.length === 0
                        ? "Rest or flex day"
                        : `${doneCount} of ${dayHabits.length} complete`}
                    </p>
                  </div>

                  <ul className="flex flex-1 flex-col gap-3 p-4">
                    {dayHabits.length === 0 ? (
                      <li className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/60 px-4 text-center text-sm text-zinc-400 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-500">
                        Nothing scheduled
                      </li>
                    ) : (
                      dayHabits.map((habit) => {
                        const done = habit.completionDateKeys.includes(dateKey);
                        return (
                          <li key={habit.id}>
                            <div
                              className={`rounded-2xl border p-3 transition ${
                                done
                                  ? "border-emerald-200 bg-emerald-50/80 dark:border-emerald-500/20 dark:bg-emerald-500/10"
                                  : "border-zinc-200/80 bg-white dark:border-white/10 dark:bg-white/[0.04]"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <input
                                  type="checkbox"
                                  checked={done}
                                  disabled={pending}
                                  onChange={() => void toggleCompletion(habit.id, dateKey)}
                                  className="mt-1 h-[1.125rem] w-[1.125rem] shrink-0 rounded-md border-zinc-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500/30 dark:border-zinc-600"
                                />
                                <div className="min-w-0 flex-1">
                                  <p
                                    className={`text-sm font-semibold leading-6 break-words ${
                                      done
                                        ? "text-zinc-500 line-through decoration-zinc-400 dark:text-zinc-400"
                                        : "text-zinc-900 dark:text-zinc-100"
                                    }`}
                                  >
                                    {habit.title}
                                  </p>
                                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                                    {done ? "Complete" : "Planned"}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-3 flex justify-end border-t border-zinc-100 pt-3 dark:border-white/10">
                                <button
                                  type="button"
                                  disabled={pending}
                                  onClick={() => void removeHabit(habit.id)}
                                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 transition hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Remove
                                </button>
                              </div>
                            </div>
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
