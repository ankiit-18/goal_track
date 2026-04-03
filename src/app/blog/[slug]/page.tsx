import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  type BlogPost,
} from "@/lib/blog-posts";
import { SITE_NAME } from "@/lib/site-config";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) {
    return {
      title: "Blog",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: `${post.title} | ${SITE_NAME}`,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
    },
    twitter: {
      title: `${post.title} | ${SITE_NAME}`,
      description: post.excerpt,
    },
  };
}

function ArticleBody({ post }: { post: BlogPost }) {
  return (
    <article className="rounded-[28px] border border-zinc-200 bg-white p-8 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.18)] sm:p-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
        {post.category}
      </p>
      <h1 className="mt-4 font-heading text-5xl leading-[0.94] tracking-[-0.05em] text-zinc-950">
        {post.title}
      </h1>
      <div className="mt-5 flex flex-wrap gap-4 text-xs uppercase tracking-[0.18em] text-zinc-500">
        <span>{post.readingTime}</span>
        <span>{new Date(post.publishedAt).toLocaleDateString("en-US")}</span>
      </div>

      <div className="mt-8 space-y-5 text-base leading-8 text-zinc-700">
        {post.content.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <section className="mt-10 rounded-[22px] border border-emerald-100 bg-emerald-50/65 p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
          About our product
        </p>
        <h2 className="mt-3 font-heading text-3xl tracking-[-0.03em] text-zinc-950">
          How GoalTrack helps you achieve what you want
        </h2>
        <p className="mt-3 text-sm leading-7 text-zinc-700">
          GoalTrack helps you turn ambition into action. You can define a
          long-term goal, split it into practical stages, and support it with a
          weekly routine so progress stays consistent. Instead of relying on
          motivation, you get a clear system that helps you stay focused, track
          momentum, and finish what matters.
        </p>
        <div className="mt-5">
          <Link
            href="/register"
            className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Start with GoalTrack
          </Link>
        </div>
      </section>
    </article>
  );
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="min-h-full bg-[#f6f8f3] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/blog"
          className="mb-6 inline-flex text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
        >
          Back to blog
        </Link>
        <ArticleBody post={post} />
      </div>
    </main>
  );
}
