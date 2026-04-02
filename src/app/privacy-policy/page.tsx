import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read how GoalTrack handles account details, usage data, and communication preferences.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-full bg-[#f6f8f3] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[28px] border border-zinc-200 bg-white p-8 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.18)] sm:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
          GoalTrack
        </p>
        <h1 className="mt-4 font-heading text-5xl leading-[0.94] tracking-[-0.05em] text-zinc-950">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm leading-7 text-zinc-600">
          Last updated: April 2, 2026
        </p>

        <div className="mt-8 space-y-7 text-sm leading-7 text-zinc-700">
          <section>
            <h2 className="text-xl font-semibold text-zinc-950">
              What we collect
            </h2>
            <p className="mt-2">
              We collect account information you provide (such as name and
              email), plus goal and stage content you create in the app.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-950">
              Why we collect it
            </h2>
            <p className="mt-2">
              We use your data to run your account, secure login, send
              verification emails, and provide product analytics that help
              improve performance and usability.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-950">
              Data sharing
            </h2>
            <p className="mt-2">
              We do not sell your personal information. We may use trusted
              service providers (hosting, analytics, and email delivery) only
              to operate GoalTrack.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-950">Your control</h2>
            <p className="mt-2">
              You can request updates or deletion of your account data by
              contacting us at{" "}
              <a className="font-semibold text-emerald-700" href="mailto:hello@goaltrack.in">
                hello@goaltrack.in
              </a>
              .
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
