import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Loading…
        </p>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
