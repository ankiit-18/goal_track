import { Suspense } from "react";
import { VerifyEmailForm } from "./VerifyEmailForm";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Loading…
        </p>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
