"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  btnPrimaryClass,
  cardClass,
  inputClass,
  labelClass,
  sectionTitleClass,
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
      setMessage("Saved.");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className={`${cardClass} space-y-4`}
    >
      <h2 className={sectionTitleClass}>Display name</h2>
      {message ? (
        <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-800 dark:text-emerald-300">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </p>
      ) : null}
      <label className={labelClass}>
        Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="How we greet you"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className={btnPrimaryClass}
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
