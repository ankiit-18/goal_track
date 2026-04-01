"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  hasDeepLoginParams,
  mergeDeepParamsOntoNext,
  registerHrefWithDeepParams,
  sanitizeNextPath,
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

  const next = sanitizeNextPath(searchParams.get("next"));
  const isDeepControl =
    searchParams.get("mode") === "login" && hasDeepLoginParams(searchParams);
  const authError = searchParams.get("error");
  const mergedNext = useMemo(
    () => mergeDeepParamsOntoNext(next, searchParams),
    [next, searchParams]
  );

  const registerHref = useMemo(
    () => registerHrefWithDeepParams(searchParams),
    [searchParams]
  );
  const googleHref = useMemo(() => {
    const q = new URLSearchParams({ next: mergedNext });
    return `/api/auth/google/start?${q.toString()}`;
  }, [mergedNext]);

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
      const data = (await res.json()) as {
        error?: string;
        requiresVerification?: boolean;
        email?: string;
      };
      if (!res.ok) {
        if (data.requiresVerification && data.email) {
          const q = new URLSearchParams({
            email: data.email,
            next: mergedNext,
          });
          router.push(`/verify-email?${q.toString()}`);
          return;
        }
        setError(data.error ?? "Could not sign in");
        return;
      }
      router.push(mergedNext);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className={`${cardClass} w-full max-w-xl rounded-[2rem] border-zinc-900/8 bg-white/86 p-7 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.32)] backdrop-blur sm:p-8`}
    >
      <div>
        <p className="inline-flex items-center gap-2 rounded-full border border-zinc-900/8 bg-[#f5f7f1] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
          <Sparkles className="h-3.5 w-3.5" />
          {isDeepControl ? "Deep control sign in" : "Welcome back"}
        </p>
        <h1 className="mt-5 font-heading text-5xl leading-[0.96] tracking-[-0.05em] text-zinc-950">
          {isDeepControl ? "Continue your session." : "Sign in with calm focus."}
        </h1>
        <p className="mt-4 max-w-lg text-base leading-7 text-zinc-600">
          {isDeepControl
            ? "Use your GoalTrack account to finish this linked session."
            : "Return to your dashboard, stages, and weekly rhythm from one clean workspace."}
        </p>
      </div>

      {authError === "google_not_configured" ? (
        <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Google sign-in is not configured yet. Add your Google client keys first.
        </p>
      ) : null}

      {authError === "google_failed" ||
      authError === "google_cancelled" ||
      authError === "google_state_invalid" ? (
        <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Google sign-in could not be completed. Please try again.
        </p>
      ) : null}

      {error ? (
        <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </p>
      ) : null}

      <div className="mt-6">
        <Link
          href={googleHref}
          className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"
        >
          Continue with Google
        </Link>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200/80" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
          or use email
        </span>
        <div className="h-px flex-1 bg-zinc-200/80" />
      </div>

      <div className="mt-6 space-y-5">
        <label className={labelClass}>
          Email
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
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
            placeholder="Enter your password"
          />
        </label>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200/80 pt-5">
        <p className="text-sm text-zinc-500">
          No account yet?{" "}
          <Link href={registerHref} className="font-semibold text-emerald-700 hover:underline">
            Create one
          </Link>
        </p>
        <button
          type="submit"
          disabled={pending}
          className={`${btnPrimaryClass} gap-2 px-5 py-3`}
        >
          {pending ? "Signing in…" : "Sign in"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
