"use client";

import { useState } from "react";
import Link from "next/link";
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
    const e = new Date();
    e.setFullYear(e.getFullYear() + 1);
    return toDatetimeLocalValue(e);
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
    <div className="mx-auto max-w-lg">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
        >
          ← Back to dashboard
        </Link>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          New goal
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Name it, add context, and set the time window you care about.
        </p>
      </div>

      <form
        onSubmit={(e) => void onSubmit(e)}
        className={`${cardClass} space-y-5`}
      >
        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/50 dark:text-red-200">
            {error}
          </p>
        ) : null}

        <label className={labelClass}>
          Title
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            placeholder="e.g. Crack GATE"
          />
        </label>

        <label className={labelClass}>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={inputClass + " min-h-[5rem] resize-y"}
            placeholder="Optional context"
          />
        </label>

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

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={pending}
            className={btnPrimaryClass}
          >
            {pending ? "Saving…" : "Create goal"}
          </button>
          <Link href="/dashboard" className={btnSecondaryClass}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
