import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAllBlogPosts } from "@/lib/blog-posts";
import { SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read practical guides on consistency, time management, and long-term goal planning.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `Blog | ${SITE_NAME}`,
    description:
      "Read practical guides on consistency, time management, and long-term goal planning.",
    url: "/blog",
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <main className="min-h-full bg-[#f6f8f3] px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl rounded-[34px] border border-zinc-200 bg-white px-8 py-10 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.18)] lg:px-10">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:items-start">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-emerald-700">
              GoalTrack blog
            </p>
            <h1 className="mt-4 max-w-3xl font-heading text-6xl leading-[0.92] tracking-[-0.06em] text-zinc-950">
              Build consistent progress,
              <span className="block italic font-normal">one useful idea at a time.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-600">
              Practical writing on consistency, focus, time management, and
              long-term goal execution.
            </p>
          </div>

          <div className="rounded-[22px] bg-[#f7f8f4] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              What you will find
            </p>
            <p className="mt-4 text-sm leading-7 text-zinc-600">
              Short, clear playbooks you can apply this week. Every post is
              written to help you act, not just read.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-5 lg:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="rounded-[26px] border border-zinc-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.22)]"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
              {post.category}
            </p>
            <h2 className="mt-3 font-heading text-4xl leading-[0.95] tracking-[-0.04em] text-zinc-950">
              {post.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">{post.excerpt}</p>

            <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-zinc-500">
              <span>{post.readingTime}</span>
              <span>{new Date(post.publishedAt).toLocaleDateString("en-US")}</span>
            </div>

            <Link
              href={`/blog/${post.slug}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
            >
              Read article
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
