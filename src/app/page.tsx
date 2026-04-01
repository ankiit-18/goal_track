import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Mountain,
} from "lucide-react";
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
    body: "Turn a hazy long-term ambition into stages with deadlines that actually feel finishable.",
    icon: Mountain,
    tone: "from-sky-100 to-cyan-50",
  },
  {
    title: "See the week clearly",
    body: "Anchor your goals to weekly habits, so progress comes from repeatable effort, not motivation spikes.",
    icon: CalendarDays,
    tone: "from-emerald-100 to-lime-50",
  },
];

const processCards = [
  {
    title: "Define one meaningful goal",
    body: "Start with a single finish line. Clarity is the antidote to anxiety. We help you name it with precision.",
  },
  {
    title: "Break it into stages",
    body: "Don’t tackle the whole mountain. We help you create sequence-based steps you can complete one by one.",
  },
  {
    title: "Keep the week honest",
    body: "Integrate it into your steady routine. Progress is the sum of small, recurring actions handled with care.",
  },
];

export default async function Home() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <main className="min-h-full bg-[#f6f8f3] text-zinc-950">
      <div className="border-b border-emerald-900/8 bg-[#edf8f2]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <LogoMark className="h-9 w-9" />
            <span className="font-heading text-xl tracking-[-0.03em] text-zinc-950">
              GoalTrack
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-zinc-600 md:flex">
            <a href="#features" className="transition hover:text-zinc-950">
              Features
            </a>
            <a href="#how-it-feels" className="transition hover:text-zinc-950">
              Pricing
            </a>
            <Link href="/how-it-works" className="transition hover:text-zinc-950">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-700 transition hover:text-zinc-950"
            >
              Sign in
            </Link>
            <Link href="/register" className={btnPrimaryClass + " px-5 py-2.5"}>
              Start free
            </Link>
          </div>
        </div>
      </div>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:pb-18 lg:pt-14">
        <div className="max-w-2xl">
          <p className="inline-flex rounded-full border border-zinc-900/8 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500">
            Intentional design
          </p>
          <h1 className="mt-5 max-w-xl font-heading text-5xl leading-[0.95] tracking-[-0.05em] text-zinc-950 sm:text-6xl lg:text-7xl">
            Make your goals feel elegant, visible, and alive.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-zinc-600 sm:text-lg">
            GoalTrack gives your ambitions shape: clear stages, a weekly rhythm,
            and a dashboard that helps you stay in motion without feeling busy.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register" className={btnPrimaryClass + " px-6 py-3"}>
              Build your system
            </Link>
            <Link href="/login" className={btnSecondaryClass + " px-6 py-3"}>
              Explore your dashboard
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.65),transparent_60%)]" />
          <div className="relative mx-auto max-w-xl rounded-[2rem] border border-zinc-900/10 bg-[#dde3dd] p-4 shadow-[0_30px_70px_-30px_rgba(15,23,42,0.3)]">
            <div className="overflow-hidden rounded-[1.4rem] bg-[linear-gradient(135deg,#202935,#121820)] p-6 text-white">
              <div className="rounded-[999px] border border-[#cdb376] bg-[radial-gradient(circle_at_center,#2f3946,#0f141b_70%)] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
                <div className="relative aspect-[1.45] rounded-[999px] border border-[#9a8b5e] bg-[radial-gradient(circle_at_center,#314153_0%,#17202b_58%,#0d1219_100%)] p-8">
                  <div className="absolute inset-x-12 bottom-10 h-1 rounded-full bg-white/10">
                    <div className="h-1 w-[62%] rounded-full bg-gradient-to-r from-lime-300 via-emerald-400 to-emerald-500" />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {[
                      "Vision",
                      "Stages",
                      "Weekly",
                      "Focus",
                      "Review",
                      "Finish",
                    ].map((item, index) => (
                      <div
                        key={item}
                        className="rounded-full border border-white/8 bg-white/5 p-3 text-center"
                      >
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-zinc-300">
                          0{index + 1}
                        </div>
                        <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="absolute bottom-4 left-8 right-8 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    <span>Act</span>
                    <span>Review</span>
                    <span>Refine</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-900/6 bg-white/35">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 text-sm text-zinc-500 sm:grid-cols-3 sm:px-6 lg:px-8">
          {heroMetrics.map((metric) => (
            <div key={metric.label} className="flex items-center gap-3">
              <span className="rounded-md bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 shadow-sm">
                {metric.value}
              </span>
              <span className="font-heading text-lg tracking-[-0.02em] text-zinc-700">
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <h2 className="font-heading text-4xl tracking-[-0.04em] text-zinc-950">
            Less clutter, more traction.
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-600">
            Designed for depth, not distraction. Move away from endless lists
            and toward meaningful milestones.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className="rounded-[1.8rem] border border-zinc-900/8 bg-white p-6 shadow-[0_22px_50px_-38px_rgba(15,23,42,0.25)]"
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${card.tone} text-zinc-800`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="mt-5 font-heading text-3xl tracking-[-0.03em] text-zinc-950">
                  {card.title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-7 text-zinc-600">
                  {card.body}
                </p>
                <div className="mt-7 h-28 rounded-[1rem] bg-[linear-gradient(135deg,#8fb8c5,#dbeff3_48%,#8aa8b6)]" />
              </article>
            );
          })}
        </div>

        <article className="mt-6 grid gap-6 rounded-[1.8rem] border border-zinc-900/8 bg-[#e7ebe4] p-6 shadow-[0_22px_50px_-38px_rgba(15,23,42,0.22)] lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-zinc-900 shadow-sm">
              <ArrowUpRight className="h-4 w-4" />
            </span>
            <h3 className="mt-5 font-heading text-3xl tracking-[-0.03em] text-zinc-950">
              Track real motion
            </h3>
            <p className="mt-3 max-w-md text-sm leading-7 text-zinc-600">
              Watch momentum build with progress that reflects completed stages
              instead of vanity metrics.
            </p>
          </div>

          <div className="rounded-[1.2rem] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              <span>Q3 growth stage</span>
              <span>82%</span>
            </div>
            <div className="mt-4 h-2.5 rounded-full bg-zinc-100">
              <div className="h-2.5 w-[82%] rounded-full bg-gradient-to-r from-emerald-700 via-emerald-500 to-lime-400" />
            </div>
          </div>
        </article>
      </section>

      <section className="bg-white/55 py-18">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:items-center">
          <div className="rounded-[1.8rem] bg-[radial-gradient(circle_at_center,#fff8d2_0%,#f6eeb2_16%,#1e1f2b_42%,#0f1017_100%)] p-3 shadow-[0_28px_65px_-30px_rgba(15,23,42,0.35)]">
            <div className="flex aspect-[0.78] items-center justify-center rounded-[1.45rem] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(255,244,194,0.9),rgba(255,226,153,0.35)_16%,rgba(27,28,37,0.4)_35%,rgba(10,10,15,0.95)_72%)]">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-white/40 bg-[radial-gradient(circle_at_center,rgba(255,252,229,1),rgba(252,230,154,0.8)_45%,rgba(255,255,255,0)_68%)] shadow-[0_0_60px_rgba(255,233,170,0.55)]">
                <div className="absolute inset-[-16px] rounded-full border border-amber-100/60" />
                <div className="h-12 w-12 rounded-full bg-zinc-950/75" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="max-w-xl font-heading text-5xl leading-[0.96] tracking-[-0.05em] text-zinc-950">
              Beautiful enough to revisit, simple enough to trust.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-zinc-600">
              Your goals deserve more than a checkbox graveyard. This flow keeps
              the signal high, the structure clean, and the next step obvious.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "No infinite scrolling, only active focus.",
                "Automatic synthesis of your weekly output.",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-zinc-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="how-it-feels" className="mx-auto max-w-7xl px-4 py-18 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-4xl tracking-[-0.04em] text-zinc-950">
          How it feels
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600">
          A rhythm that turns ambition into a peaceful, repeatable practice.
        </p>

        <div className="mt-12 grid gap-8 text-left md:grid-cols-3">
          {processCards.map((card) => (
            <article key={card.title}>
              <h3 className="text-base font-semibold text-zinc-950">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-600">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-[#11804a] px-6 py-12 text-center text-white shadow-[0_28px_70px_-34px_rgba(17,128,74,0.55)] sm:px-10">
          <h2 className="mx-auto max-w-3xl font-heading text-4xl leading-[0.96] tracking-[-0.05em] sm:text-5xl">
            Start your journey into quiet focus.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-emerald-50/90">
            Join creators, students, and builders who manage their goals with a
            calmer system.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-950 shadow-sm transition hover:bg-emerald-50"
          >
            Build your system for free
          </Link>
        </div>
      </section>

      <footer className="border-t border-emerald-900/8 bg-[#edf8f2]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-[11px] uppercase tracking-[0.18em] text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="font-heading normal-case tracking-normal text-zinc-700">
            GoalTrack
          </div>
          <div className="flex flex-wrap gap-5">
            <span>Privacy policy</span>
            <span>Terms of service</span>
            <Link href="/how-it-works">About</Link>
            <span>Contact</span>
          </div>
          <div>© 2026 GoalTrack</div>
        </div>
      </footer>
    </main>
  );
}
