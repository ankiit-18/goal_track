import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ProfileForm } from "./ProfileForm";
import { cardClass, sectionTitleClass } from "@/lib/ui-styles";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Profile
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Account details and how we address you in the app.
        </p>
      </header>

      <div className={cardClass}>
        <h2 className={sectionTitleClass}>Account</h2>
        <dl className="mt-5 space-y-4 text-sm">
          <div className="rounded-xl bg-zinc-50/80 px-4 py-3 dark:bg-zinc-800/50">
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Email
            </dt>
            <dd className="mt-1 font-medium text-zinc-900 dark:text-zinc-50">
              {user.email}
            </dd>
          </div>
          <div className="rounded-xl bg-zinc-50/80 px-4 py-3 dark:bg-zinc-800/50">
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Member since
            </dt>
            <dd className="mt-1 font-medium text-zinc-800 dark:text-zinc-200">
              {user.createdAt.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </dd>
          </div>
        </dl>
      </div>

      <ProfileForm initialName={user.name} />
    </div>
  );
}
