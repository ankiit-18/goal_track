"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { readResponseJson } from "@/lib/fetch-json";
import {
  btnPrimaryClass,
  btnSecondaryClass,
  cardClass,
  cardMutedClass,
  inputClass,
  labelClass,
  sectionTitleClass,
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
    const n = new Date();
    const pad = (x: number) => String(x).padStart(2, "0");
    return `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())}`;
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
        const msg =
          typeof data.error === "string" ? data.error : "Could not add habit";
        const hint =
          typeof data.detail === "string" && data.detail.length > 0
            ? ` — ${data.detail}`
            : "";
        setError(msg + hint);
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
    if (!confirm("Remove this weekly habit? Its history for past weeks will be deleted."))
      return;
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

  return (
    <div className="space-y-8">
      <div
        className={`${cardClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
      >
        <div>
          <p className={sectionTitleClass}>Selected range</p>
          <p className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {rangeLabel}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => setWeekOffset((o) => o - 1)}
            className={btnSecondaryClass + " px-3 py-2 text-sm"}
          >
            ← Previous
          </button>
          <button
            type="button"
            disabled={pending || weekOffset === 0}
            onClick={() => setWeekOffset(0)}
            className={btnSecondaryClass + " px-3 py-2 text-sm disabled:opacity-40"}
          >
            This week
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => setWeekOffset((o) => o + 1)}
            className={btnSecondaryClass + " px-3 py-2 text-sm"}
          >
            Next →
          </button>
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Loading your week…
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
          {weekKeys.map((dateKey, i) => {
            const dow = i + 1;
            const dayHabits = habits.filter((h) => h.weekday === dow);
            const isToday = dateKey === todayKey;
            return (
              <div
                key={dateKey}
                className={`relative overflow-hidden rounded-2xl border bg-white/90 shadow-sm dark:bg-zinc-900/60 ${
                  isToday
                    ? "border-emerald-400/60 ring-2 ring-emerald-500/25 dark:border-emerald-500/40"
                    : "border-zinc-200/80 dark:border-zinc-800"
                }`}
              >
                <div
                  className={`h-1 w-full ${isToday ? "bg-gradient-to-r from-emerald-400 to-teal-500" : "bg-zinc-200 dark:bg-zinc-700"}`}
                  aria-hidden
                />
                <div className="p-3.5">
                  <div className="border-b border-zinc-100 pb-3 dark:border-zinc-800">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {WEEKDAY_SHORT[i]}
                    </p>
                    <p className="mt-0.5 text-base font-semibold tabular-nums text-zinc-900 dark:text-white">
                      {formatDateKeyShort(dateKey)}
                    </p>
                  </div>
                  <ul className="mt-3 space-y-2.5">
                    {dayHabits.length === 0 ? (
                      <li className="py-2 text-center text-xs text-zinc-400 dark:text-zinc-500">
                        Free day
                      </li>
                    ) : (
                      dayHabits.map((h) => {
                        const done = h.completionDateKeys.includes(dateKey);
                        return (
                          <li
                            key={h.id}
                            className="rounded-xl bg-zinc-50/90 p-2 dark:bg-zinc-800/50"
                          >
                            <label className="flex cursor-pointer items-start gap-2.5 text-sm">
                              <input
                                type="checkbox"
                                checked={done}
                                disabled={pending}
                                onChange={() =>
                                  void toggleCompletion(h.id, dateKey)
                                }
                                className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                              />
                              <span
                                className={`font-medium leading-snug ${
                                  done
                                    ? "text-zinc-400 line-through dark:text-zinc-500"
                                    : "text-zinc-800 dark:text-zinc-100"
                                }`}
                              >
                                {h.title}
                              </span>
                            </label>
                            <button
                              type="button"
                              disabled={pending}
                              onClick={() => void removeHabit(h.id)}
                              className="mt-1.5 pl-7 text-[11px] font-medium text-red-600 hover:underline dark:text-red-400"
                            >
                              Remove
                            </button>
                          </li>
                        );
                      })
                    )}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <section className={cardMutedClass}>
        <h2 className={sectionTitleClass}>Add repeating habit</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Same weekday every week—e.g. Monday for gym, Tuesday for reading.
        </p>
        <form
          onSubmit={(e) => void addHabit(e)}
          className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end"
        >
          <label className={`${labelClass} block flex-1`}>
            What
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Gym, Read books"
              className={inputClass}
            />
          </label>
          <label className={`${labelClass} block sm:w-44`}>
            Every
            <select
              value={newWeekday}
              onChange={(e) => setNewWeekday(Number(e.target.value))}
              className={inputClass}
            >
              {WEEKDAY_SHORT.map((label, idx) => (
                <option key={label} value={idx + 1}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            disabled={pending}
            className={btnPrimaryClass + " shrink-0"}
          >
            Add habit
          </button>
        </form>
      </section>
    </div>
  );
}
