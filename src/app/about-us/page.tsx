import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about the mission behind GoalTrack and the founder building the product.",
  alternates: { canonical: "/about-us" },
};

export default function AboutUsPage() {
  return (
    <main className="min-h-full bg-[#f6f8f3] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[28px] border border-zinc-200 bg-white p-8 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.18)] sm:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
          About {SITE_NAME}
        </p>
        <h1 className="mt-4 font-heading text-5xl leading-[0.94] tracking-[-0.05em] text-zinc-950">
          Built for focused progress.
        </h1>

        <div className="mt-8 space-y-7 text-sm leading-7 text-zinc-700">
          <section>
            <h2 className="text-xl font-semibold text-zinc-950">Our mission</h2>
            <p className="mt-2">
              GoalTrack was created to make long-term planning feel simple,
              calm, and actionable. We combine clear goal stages with weekly
              execution so progress becomes repeatable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-950">Founder</h2>
            <p className="mt-2">
              <span className="font-semibold text-zinc-950">Ankit Kumar</span>,
              IIT Gandhinagar.
            </p>
          </section>
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-6">
          <Link href="/" className="text-sm font-semibold text-emerald-700 hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
