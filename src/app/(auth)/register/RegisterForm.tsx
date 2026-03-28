"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  loginHrefWithDeepParams,
  mergeDeepParamsOntoNext,
} from "@/lib/deep-login";
import {
  btnPrimaryClass,
  cardClass,
  inputClass,
  labelClass,
} from "@/lib/ui-styles";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginHref = useMemo(
    () => loginHrefWithDeepParams(searchParams),
    [searchParams]
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          ...(name.trim() ? { name: name.trim() } : {}),
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : "Could not create account"
        );
        return;
      }
      router.push(mergeDeepParamsOntoNext("/dashboard", searchParams));
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
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Create account
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
          Use a strong password—at least 8 characters.
        </p>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </p>
      ) : null}

      <label className={labelClass}>
        Name <span className="font-normal text-zinc-500">(optional)</span>
        <input
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </label>

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
          autoComplete="new-password"
          required
          minLength={8}
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
        {pending ? "Creating…" : "Sign up"}
      </button>

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link
          href={loginHref}
          className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
