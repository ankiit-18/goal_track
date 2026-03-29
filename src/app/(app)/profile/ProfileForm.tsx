"use client";

import { useState } from "react";
import { CheckCircle2, PencilLine } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  btnPrimaryClass,
  cardClass,
  inputClass,
  labelClass,
} from "@/lib/ui-styles";

type Props = { initialName: string | null };

export function ProfileForm({ initialName }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialName ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setPending(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() || null }),
      });
      if (!res.ok) {
        setError("Could not update profile");
        return;
      }
      setMessage("Profile updated successfully.");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className={`${cardClass} rounded-[32px] border-white/70 bg-white/85 p-6 shadow-[0_22px_60px_-36px_rgba(15,23,42,0.3)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/75`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
            Personal details
          </p>
          <h2 className="mt-2 font-heading text-3xl text-zinc-950 dark:text-white">
            Update your profile
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            Your display name is what the app can use to address you across the
            workspace.
          </p>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
          <PencilLine className="h-5 w-5" />
        </span>
      </div>

      {message ? (
        <p className="mt-6 flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          {message}
        </p>
      ) : null}

      {error ? (
        <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </p>
      ) : null}

      <div className="mt-6 grid gap-5">
        <label className={labelClass}>
          Display name
          <input
            type="text"
            value={name}
            maxLength={120}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="How we greet you"
          />
          <span className="mt-2 block text-xs text-zinc-500 dark:text-zinc-400">
            Leave it blank if you prefer using only your email address.
          </span>
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200/80 pt-5 dark:border-white/10">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Changes save instantly to your account.
        </p>
        <button type="submit" disabled={pending} className={btnPrimaryClass}>
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
