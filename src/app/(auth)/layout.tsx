import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Compass, Layers3, Sparkles } from "lucide-react";
import { LogoMark } from "@/components/Logo";

const authHighlights = [
  {
    title: "Shape long-term goals",
    body: "Create goals with a real time horizon and keep them visible.",
    icon: Layers3,
  },
  {
    title: "Support them weekly",
    body: "Build a calm routine that turns intention into repeatable action.",
    icon: Compass,
  },
  {
    title: "Track meaningful progress",
    body: "Complete stages, review momentum, and keep the next step clear.",
    icon: CheckCircle2,
  },
];

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-full flex-1 overflow-hidden bg-[#f6f8f3]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.82),rgba(255,255,255,0))]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-[-5rem] top-12 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-[-7rem] bottom-12 h-80 w-80 rounded-full bg-cyan-200/20 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <LogoMark className="h-9 w-9" />
            <span className="font-heading text-xl tracking-[-0.03em] text-zinc-950">
              GoalTrack
            </span>
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
          >
            Back home
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[0.95fr_0.9fr] lg:gap-14 lg:py-12">
          <section className="hidden lg:block">
            <div className="max-w-xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-zinc-900/8 bg-white/75 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Quiet momentum
              </p>
              <h1 className="mt-6 font-heading text-6xl leading-[0.94] tracking-[-0.05em] text-zinc-950">
                Keep your goals elegant, visible, and in motion.
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-zinc-600">
                Sign in to return to your roadmap, or create an account to start
                turning long-term ambition into a calmer weekly practice.
              </p>
            </div>

            <div className="mt-10 grid gap-4">
              {authHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="rounded-[1.8rem] border border-zinc-900/8 bg-white/82 p-5 shadow-[0_22px_50px_-36px_rgba(15,23,42,0.22)] backdrop-blur"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/12 text-emerald-700">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="text-xl font-semibold tracking-[-0.02em] text-zinc-950">
                          {item.title}
                        </h2>
                        <p className="mt-2 text-sm leading-7 text-zinc-600">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <div className="flex items-center justify-center">{children}</div>
        </div>
      </div>
    </div>
  );
}
