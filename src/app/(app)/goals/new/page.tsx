"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarRange, Lightbulb } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  btnPrimaryClass,
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
    <div className="grid gap-8 pb-14 xl:grid-cols-[1.08fr_0.72fr] xl:items-start">
      <section className="pt-6">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-700">
            New objective
          </p>
          <h1 className="mt-5 font-heading text-7xl leading-[0.9] tracking-[-0.07em] text-zinc-950">
            Create a goal worth
            <span className="block italic font-normal">committing to.</span>
          </h1>
        </div>

        <form onSubmit={(e) => void onSubmit(e)} className="mt-12 space-y-8">
          {error ? (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </p>
          ) : null}

          <label className={labelClass}>
            <span className="font-heading text-3xl font-normal italic text-zinc-800">
              What is your focus?
            </span>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass + " mt-4 rounded-none border-x-0 border-t-0 border-b-zinc-200 bg-transparent px-0 py-3 text-2xl shadow-none placeholder:text-[#c6d0c4] focus:ring-0"}
              placeholder="Enter a clear title..."
            />
          </label>

          <label className={labelClass}>
            <span className="font-heading text-3xl font-normal italic text-zinc-800">
              Describe the vision
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={inputClass + " mt-4 min-h-[9rem] rounded-[20px] border-zinc-100 bg-white/70 text-lg shadow-none placeholder:text-[#c6d0c4] focus:ring-0"}
              placeholder="Define the outcome you're chasing..."
            />
          </label>

          <div className="grid gap-6 sm:grid-cols-2">
            <label className={labelClass}>
              <span className="inline-flex items-center gap-2 font-heading text-3xl font-normal italic text-zinc-800">
                <CalendarRange className="h-5 w-5 text-emerald-700" />
                Start Date
              </span>
              <input
                type="datetime-local"
                required
                value={startLocal}
                onChange={(e) => setStartLocal(e.target.value)}
                className={inputClass + " mt-4 rounded-[18px] border-zinc-100 bg-white shadow-none focus:ring-0"}
              />
            </label>

            <label className={labelClass}>
              <span className="inline-flex items-center gap-2 font-heading text-3xl font-normal italic text-zinc-800">
                <CalendarRange className="h-5 w-5 text-emerald-700" />
                Target End
              </span>
              <input
                type="datetime-local"
                required
                value={endLocal}
                onChange={(e) => setEndLocal(e.target.value)}
                className={inputClass + " mt-4 rounded-[18px] border-zinc-100 bg-white shadow-none focus:ring-0"}
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <button
              type="submit"
              disabled={pending}
              className={btnPrimaryClass + " rounded-2xl px-8 py-4 text-base"}
            >
              {pending ? "Creating…" : "Create goal"}
            </button>
            <Link
              href="/goals"
              className="text-base font-semibold text-emerald-800 transition hover:text-emerald-900"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>

      <aside className="rounded-[28px] bg-[#f5f6f1] p-8 shadow-[0_22px_55px_-42px_rgba(15,23,42,0.12)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#b9f7c9] text-emerald-800">
          <Lightbulb className="h-5 w-5" />
        </div>

        <h2 className="mt-6 font-heading text-4xl italic tracking-[-0.04em] text-zinc-950">
          The Path to Clarity
        </h2>
        <p className="mt-4 text-lg leading-8 text-zinc-600">
          A well-defined goal is half achieved. Take a moment to reflect on the
          intention behind this pursuit.
        </p>

        <div className="mt-8 space-y-6">
          {[
            {
              number: "1",
              title: "What outcome?",
              body: "Focus on a specific, measurable result rather than a vague desire.",
            },
            {
              number: "2",
              title: "Why now?",
              body: "Intrinsic motivation is the fuel for long-term consistency.",
            },
            {
              number: "3",
              title: "How long?",
              body: "Shorter milestones often create stronger completion momentum.",
            },
          ].map((item) => (
            <div key={item.number} className="grid grid-cols-[40px_1fr] gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-semibold text-zinc-600 shadow-sm">
                {item.number}
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-800">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-7 text-zinc-600">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-[22px] bg-[linear-gradient(180deg,#b8d4d8_0%,#a9c6c8_32%,#53656c_32%,#34464d_68%,#26383e_100%)] p-0 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.28)]">
          <div className="h-40 w-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent_38%),linear-gradient(180deg,transparent_0%,transparent_58%,rgba(26,38,44,0.95)_58%)]" />
          <svg
            viewBox="0 0 400 150"
            className="-mt-14 block h-40 w-full text-[#32454c]"
            aria-hidden
          >
            <path
              d="M0 95 C55 75, 95 118, 150 108 C195 100, 230 126, 280 100 C325 76, 352 88, 400 70 L400 150 L0 150 Z"
              fill="currentColor"
            />
            <path
              d="M0 120 C75 102, 120 136, 185 126 C240 118, 285 146, 400 124 L400 150 L0 150 Z"
              fill="#24353b"
            />
          </svg>
        </div>
      </aside>
    </div>
  );
}
