import Link from "next/link";
import { ArrowRight, CheckCheck, Compass, Layers3, Target } from "lucide-react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { btnPrimaryClass } from "@/lib/ui-styles";

const steps = [
  {
    number: "01",
    title: "Create one long-term goal",
    description:
      "Start with one clear outcome, a short reason, and a real time window.",
    icon: Target,
  },
  {
    number: "02",
    title: "Break it into stages",
    description:
      "Add milestones with deadlines so the goal feels concrete and easier to follow.",
    icon: Layers3,
  },
  {
    number: "03",
    title: "Use the weekly board",
    description:
      "Turn repeated effort into a simple weekly rhythm that supports the goal.",
    icon: Compass,
  },
  {
    number: "04",
    title: "Complete stages to finish the goal",
    description:
      "As stages are completed, progress updates automatically and the goal can close out.",
    icon: CheckCheck,
  },
];

const pages = [
  {
    name: "Dashboard",
    summary: "See what needs attention now, what is overdue, and what is moving.",
  },
  {
    name: "Goals",
    summary: "View every long-term goal, its progress, and its stages in one place.",
  },
  {
    name: "Weekly routine",
    summary: "Keep repeatable habits organized by day so your week stays simple.",
  },
  {
    name: "Profile",
    summary: "Update your details and keep your account set up the way you want.",
  },
];

const principles = [
  "Keep one important goal visible.",
  "Use stages for milestones, not tiny tasks.",
  "Let the weekly board carry the repeated work.",
];

export default async function HowItWorksPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="space-y-10 pb-14">
      <section className="rounded-[34px] border border-zinc-200 bg-white px-8 py-10 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.18)] lg:px-10">
        <div className="grid gap-8 xl:grid-cols-[1.18fr_0.82fr] xl:items-start">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-emerald-700">
              How it works
            </p>
            <h1 className="mt-4 max-w-3xl font-heading text-6xl leading-[0.92] tracking-[-0.06em] text-zinc-950">
              A simple path from
              <span className="block italic font-normal">big goal to daily action.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-600">
              GoalTrack is easiest to use when you follow one clear flow:
              create a long-term goal, break it into stages, and support it with
              a weekly routine.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/goals/new" className={btnPrimaryClass + " px-5 py-3"}>
                Create a goal
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-xl px-4 py-3 text-sm font-medium text-emerald-800 transition hover:bg-zinc-50"
              >
                Back to dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-[22px] bg-[#f7f8f4] p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              In one sentence
            </p>
            <p className="mt-4 font-heading text-3xl italic leading-tight text-zinc-950">
              Plan the destination.
              <span className="block not-italic font-normal text-zinc-700">
                Then repeat the work that gets you there.
              </span>
            </p>

            <div className="mt-6 space-y-3">
              {principles.map((item) => (
                <div
                  key={item}
                  className="rounded-[18px] border border-zinc-200 bg-white px-4 py-3 text-sm leading-6 text-zinc-600"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end gap-3">
          <h2 className="font-heading text-4xl tracking-[-0.04em] text-zinc-950">
            The flow
          </h2>
          <p className="pb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Four simple steps
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.title}
                className="rounded-[26px] border border-zinc-200 bg-[#fafaf7] p-6"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                      Step {step.number}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-zinc-950">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-zinc-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[30px] border border-zinc-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.22)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Best way to use it
          </p>
          <h2 className="mt-3 font-heading text-4xl tracking-[-0.04em] text-zinc-950">
            Keep it clear.
          </h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-[20px] bg-[#f7f8f4] px-4 py-4">
              <p className="text-sm font-semibold text-zinc-950">One goal at a time</p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Start with one serious goal instead of building a crowded list.
              </p>
            </div>
            <div className="rounded-[20px] bg-[#f7f8f4] px-4 py-4">
              <p className="text-sm font-semibold text-zinc-950">Real stages only</p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Each stage should feel like a milestone, not a random task.
              </p>
            </div>
            <div className="rounded-[20px] bg-[#f7f8f4] px-4 py-4">
              <p className="text-sm font-semibold text-zinc-950">Repeat the effort weekly</p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Use the weekly page for actions you want to show up for again and again.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-zinc-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.22)]">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Main pages
              </p>
              <h2 className="mt-3 font-heading text-4xl tracking-[-0.04em] text-zinc-950">
                Where to go
              </h2>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {pages.map((page) => (
              <div
                key={page.name}
                className="flex items-start justify-between gap-4 rounded-[22px] border border-zinc-200 bg-[#fafaf7] px-4 py-4"
              >
                <div>
                  <p className="text-lg font-semibold text-zinc-950">{page.name}</p>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600">
                    {page.summary}
                  </p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-zinc-400" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-zinc-200 bg-[#f7f8f4] px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Ready to begin
            </p>
            <h2 className="mt-3 font-heading text-4xl tracking-[-0.04em] text-zinc-950">
              Start small, then keep it visible.
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/goals/new" className={btnPrimaryClass + " px-5 py-3"}>
              Create your first goal
            </Link>
            <Link
              href="/dashboard/weekly"
              className="inline-flex items-center rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              Open weekly page
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
