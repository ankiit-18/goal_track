import { Suspense } from "react";
import { RegisterForm } from "./RegisterForm";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Loading…
        </p>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
