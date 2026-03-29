import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoMark } from "@/components/Logo";
import { getSession } from "@/lib/session";
import { btnPrimaryClass, btnSecondaryClass } from "@/lib/ui-styles";

const heroMetrics = [
  { value: "12 wk", label: "Focused roadmaps" },
  { value: "3 views", label: "Goals, stages, weekly" },
  { value: "1 place", label: "For momentum" },
];

const featureCards = [
  {
    title: "Map the climb",
    description:
      "Turn a fuzzy long-term ambition into stages with deadlines that actually feel finishable.",
  },
  {
    title: "See the week clearly",
    description:
      "Anchor your goals to weekly habits, so progress comes from repeatable effort, not motivation spikes.",
  },
  {
    title: "Track real motion",
    description:
      "Watch momentum build with progress that reflects completed stages instead of vanity metrics.",
  },
];

const routinePreview = [
  { day: "Mon", done: true },
  { day: "Tue", done: true },
  { day: "Wed", done: true },
  { day: "Thu", done: false },
  { day: "Fri", done: false },
];

const journeySteps = [
  "Define one meaningful goal with a finish line.",
  "Break it into stages you can complete in sequence.",
  "Keep the week honest with a steady routine.",
];

export default async function Home() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <main className="relative isolate flex min-h-full flex-1 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[38rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.86),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),rgba(255,255,255,0))]"
        aria-hidden
      />
      <div
        className="animate-float-slow pointer-events-none absolute right-[-8rem] top-20 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-400/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-[-5rem] top-[24rem] h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-400/10"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <header className="animate-rise-in flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-sm font-semibold tracking-[0.24em] text-zinc-700 uppercase dark:text-zinc-200"
          >
            <span className="rounded-2xl border border-white/70 bg-white/70 p-2.5 shadow-lg shadow-zinc-900/5 backdrop-blur dark:border-white/10 dark:bg-white/5">
              <LogoMark className="h-9 w-9" />
            </span>
            GoalTrack
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className={btnSecondaryClass + " px-5"}>
              Sign in
            </Link>
            <Link href="/register" className={btnPrimaryClass + " px-5"}>
              Start free
            </Link>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-14 pb-10 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pt-16">
          <div className="animate-rise-in-delay-1 max-w-2xl">
            <p className="inline-flex items-center rounded-full border border-emerald-500/20 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700 shadow-sm shadow-emerald-950/5 backdrop-blur dark:border-emerald-400/20 dark:bg-white/5 dark:text-emerald-300">
              Plan with clarity. Finish with momentum.
            </p>
            <h1 className="mt-6 font-heading text-5xl leading-none tracking-[-0.04em] text-zinc-950 sm:text-6xl lg:text-7xl dark:text-white">
              Make your goals feel
              <span className="block text-emerald-600 dark:text-emerald-400">
                elegant, visible, and alive.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600 sm:text-xl dark:text-zinc-300">
              GoalTrack gives your ambitions shape: clear stages, a weekly rhythm,
              and a dashboard that helps you stay in motion without feeling busy.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className={btnPrimaryClass + " min-w-[160px] px-6 py-3"}
              >
                Build your system
              </Link>
              <Link
                href="/login"
                className={btnSecondaryClass + " min-w-[160px] px-6 py-3"}
              >
                Explore your dashboard
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {heroMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-[1.75rem] border border-white/70 bg-white/70 p-5 shadow-lg shadow-zinc-900/5 backdrop-blur dark:border-white/10 dark:bg-white/5"
                >
                  <div className="font-heading text-3xl tracking-[-0.04em] text-zinc-950 dark:text-white">
                    {metric.value}
                  </div>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-rise-in-delay-2 relative">
            <div className="absolute inset-x-10 top-4 h-40 rounded-full bg-emerald-500/15 blur-3xl dark:bg-emerald-400/10" />
            <div className="relative rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(244,247,245,0.72))] p-4 shadow-2xl shadow-zinc-950/10 backdrop-blur-xl dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(24,24,27,0.88),rgba(24,24,27,0.65))]">
              <div className="rounded-[1.6rem] border border-zinc-200/70 bg-zinc-950 p-5 text-zinc-50 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-emerald-300/80">
                      Active Goal
                    </p>
                    <h2 className="mt-2 font-heading text-3xl tracking-[-0.03em] text-white">
                      Launch the side project
                    </h2>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
                    68% complete
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between text-sm text-zinc-300">
                      <span>Stage progress</span>
                      <span>5 / 7 closed</span>
                    </div>
                    <div className="mt-4 h-3 rounded-full bg-white/10">
                      <div className="h-3 w-[68%] rounded-full bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-300" />
                    </div>

                    <div className="mt-6 space-y-3">
                      {[
                        { title: "Validate idea", status: "Done", done: true },
                        { title: "Ship MVP", status: "In progress", done: true },
                        { title: "First 25 users", status: "Next", done: false },
                      ].map((item) => (
                        <div
                          key={item.title}
                          className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${item.done ? "bg-emerald-400" : "bg-zinc-500"}`}
                            />
                            <span className="text-sm text-zinc-100">{item.title}</span>
                          </div>
                          <span className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[1.4rem] border border-emerald-400/20 bg-emerald-400/10 p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-emerald-200/80">
                        Weekly rhythm
                      </p>
                      <div className="mt-4 flex gap-2">
                        {routinePreview.map((day) => (
                          <div
                            key={day.day}
                            className={`flex h-16 flex-1 flex-col items-center justify-center rounded-2xl border text-xs font-medium ${
                              day.done
                                ? "border-emerald-300/20 bg-emerald-300/20 text-emerald-100"
                                : "border-white/10 bg-white/5 text-zinc-400"
                            }`}
                          >
                            <span>{day.day}</span>
                            <span className="mt-1 text-[11px]">
                              {day.done ? "Done" : "Queued"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                        This week
                      </p>
                      <p className="mt-3 font-heading text-4xl tracking-[-0.04em] text-white">
                        11.5h
                      </p>
                      <p className="mt-1 text-sm text-zinc-400">
                        Deep work logged toward your current objective
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 border-t border-zinc-200/70 py-10 sm:grid-cols-2 xl:grid-cols-4 dark:border-white/10">
          <div className="xl:pr-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
              Designed for deliberate progress
            </p>
            <h2 className="mt-3 font-heading text-3xl tracking-[-0.03em] text-zinc-950 dark:text-white">
              Less clutter, more traction.
            </h2>
          </div>
          {featureCards.map((feature) => (
            <article
              key={feature.title}
              className="rounded-[1.75rem] border border-white/70 bg-white/70 p-6 shadow-lg shadow-zinc-950/5 backdrop-blur dark:border-white/10 dark:bg-white/5"
            >
              <h3 className="font-heading text-2xl tracking-[-0.03em] text-zinc-950 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 pb-8 pt-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-zinc-200/70 bg-zinc-950 p-8 text-white shadow-xl shadow-zinc-950/10 dark:border-white/10">
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-300/85">
              A calm operating system
            </p>
            <h2 className="mt-4 max-w-md font-heading text-4xl tracking-[-0.04em]">
              Beautiful enough to revisit, simple enough to trust.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-300">
              Your goals deserve more than a checkbox graveyard. This flow keeps
              the signal high, the structure clean, and the next step obvious.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/70 p-8 shadow-lg shadow-zinc-950/5 backdrop-blur dark:border-white/10 dark:bg-white/5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
              How it feels
            </p>
            <div className="mt-6 space-y-5">
              {journeySteps.map((step, index) => (
                <div key={step} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/12 font-heading text-lg text-emerald-700 dark:text-emerald-300">
                    0{index + 1}
                  </div>
                  <p className="pt-2 text-base leading-7 text-zinc-700 dark:text-zinc-300">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
