import type { Metadata } from "next";
import { posts } from "@/lib/blogs";
import { PostCard } from "@/components/blog/PostCard";

export const metadata: Metadata = {
  title: "Blog | MOVE ON",
  description:
    "Guides and answers for electric scooter owners: choosing a battery, charging, LFP technology and everyday ownership.",
  alternates: { canonical: "/blogs" },
  openGraph: {
    title: "Blog | MOVE ON",
    description:
      "Guides and answers for electric scooter owners: batteries, charging and ownership.",
    url: "/blogs",
  },
};

/* /blogs — the latest article large, the rest in a grid. All posts come from lib/blogs.ts. */
export default function BlogsPage() {
  const [featured, ...rest] = posts;

  return (
    <main className="bg-white pb-20 pt-[88px]">
      <header className="px-[7%] pb-10 pt-12 lg:pb-12 lg:pt-16">
        <p className="mb-3 font-display text-[13px] font-bold uppercase tracking-[0.16em] text-leaf">
          Blog
        </p>
        <h1 className="max-w-[18ch] font-display text-[clamp(2.25rem,4.2vw,3.75rem)] font-bold leading-[1.02] tracking-[-0.035em] text-carbon">
          Ride smarter.
        </h1>
        <p className="mt-5 max-w-[56ch] text-[17px] leading-relaxed text-[#475569]">
          Plain answers on batteries, charging and living with an electric scooter.
        </p>
      </header>

      <div className="px-[7%]">
        {featured && <PostCard post={featured} featured />}

        {rest.length > 0 && (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}