"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  hasDeepLoginParams,
  mergeDeepParamsOntoNext,
  registerHrefWithDeepParams,
} from "@/lib/deep-login";
import {
  btnPrimaryClass,
  cardClass,
  inputClass,
  labelClass,
} from "@/lib/ui-styles";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = searchParams.get("next") ?? "/dashboard";
  const isDeepControl =
    searchParams.get("mode") === "login" && hasDeepLoginParams(searchParams);

  const registerHref = useMemo(
    () => registerHrefWithDeepParams(searchParams),
    [searchParams]
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not sign in");
        return;
      }
      const target = mergeDeepParamsOntoNext(next, searchParams);
      router.push(target);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className={`${cardClass} w-full max-w-md space-y-5`}
    >
      <div>
        {isDeepControl ? (
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Login · Deep control
          </p>
        ) : null}
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          {isDeepControl ? "Continue sign-in" : "Welcome back"}
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
          {isDeepControl
            ? "Use your GoalTrack account to finish this linked session."
            : "Sign in with your email and password."}
        </p>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </p>
      ) : null}

      <label className={labelClass}>
        Email
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Password
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className={`${btnPrimaryClass} w-full py-3`}
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        No account?{" "}
        <Link
          href={registerHref}
          className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
