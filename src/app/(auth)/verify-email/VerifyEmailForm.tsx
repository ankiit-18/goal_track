"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MailCheck, RefreshCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { sanitizeNextPath } from "@/lib/deep-login";
import {
  btnPrimaryClass,
  cardClass,
  inputClass,
  labelClass,
} from "@/lib/ui-styles";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const next = sanitizeNextPath(searchParams.get("next"));
  const loginHref = useMemo(() => {
    const q = new URLSearchParams();
    if (next) q.set("next", next);
    return q.toString() ? `/login?${q.toString()}` : "/login";
  }, [next]);

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    if (!email) {
      setError("Missing email. Please go back and sign up again.");
      return;
    }
    setError(null);
    setNotice(null);
    setPending(true);

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = (await res.json()) as {
        error?: string;
        refreshedCode?: boolean;
      };
      if (!res.ok) {
        if (data.refreshedCode) {
          setCode("");
          setNotice(
            typeof data.error === "string"
              ? data.error
              : "A new code has been sent. Please use the latest one."
          );
          return;
        }
        setError(
          typeof data.error === "string"
            ? data.error
            : "Could not verify that code"
        );
        return;
      }

      router.push(next);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function resendCode() {
    setError(null);
    setNotice(null);
    setResending(true);
    try {
      const res = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : "Could not resend the code"
        );
        return;
      }
      setNotice("A fresh code has been sent to your email.");
    } finally {
      setResending(false);
    }
  }

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className={`${cardClass} w-full max-w-xl rounded-[2rem] border-zinc-900/8 bg-white/86 p-7 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.32)] backdrop-blur sm:p-8`}
    >
      <div>
        <p className="inline-flex items-center gap-2 rounded-full border border-zinc-900/8 bg-[#f5f7f1] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
          <MailCheck className="h-3.5 w-3.5" />
          Verify your email
        </p>
        <h1 className="mt-5 font-heading text-5xl leading-[0.96] tracking-[-0.05em] text-zinc-950">
          Enter your 6-digit code.
        </h1>
        <p className="mt-4 max-w-lg text-base leading-7 text-zinc-600">
          We sent a verification code to <span className="font-semibold text-zinc-900">{email}</span>.
          Once you confirm it, your account will be ready.
        </p>
      </div>

      {error ? (
        <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {notice ? (
        <p className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {notice}
        </p>
      ) : null}

      <div className="mt-6 space-y-5">
        <label className={labelClass}>
          Verification code
          <input
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            maxLength={6}
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            className={inputClass + " text-center text-lg tracking-[0.32em]"}
            placeholder="000000"
          />
        </label>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200/80 pt-5">
        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
          <button
            type="button"
            onClick={() => void resendCode()}
            disabled={resending}
            className="inline-flex items-center gap-2 font-semibold text-emerald-700 transition hover:text-emerald-800 disabled:opacity-50"
          >
            <RefreshCcw className="h-4 w-4" />
            {resending ? "Sending…" : "Resend code"}
          </button>
          <Link href={loginHref} className="font-semibold text-zinc-600 hover:text-zinc-950">
            Back to sign in
          </Link>
        </div>

        <button
          type="submit"
          disabled={pending || code.length !== 6}
          className={`${btnPrimaryClass} gap-2 px-5 py-3`}
        >
          {pending ? "Verifying…" : "Verify email"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
