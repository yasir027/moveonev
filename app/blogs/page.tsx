import type { Metadata } from "next";
// import { posts } from "@/lib/blogs";
// import { PostCard } from "@/components/blog/PostCard";
import { Reveal } from "@/components/ui/Reveal";
import { BlueprintBg } from "@/components/ui/BlueprintBg";
import { RevealHeading } from "@/components/ui/RevealHeading";

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

/* /blogs: placeholder while the articles are being written. The full page is kept
   commented out below. */
export default function BlogsPage() {
  return (
    <main className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-x-clip bg-white pb-20 pt-[88px]">
      <BlueprintBg
        name="rear"
        className="right-[-26%] top-[96px] h-[420px] sm:right-[-6%] sm:h-[560px] lg:right-[2%] lg:top-[70px] lg:h-[720px]"
      />

      <header className="px-[7%] pb-10 pt-2 sm:pt-12 lg:pb-12 lg:pt-16">
        <p className="mb-3 font-display text-[13px] font-bold uppercase tracking-[0.16em] text-leaf">
          Blog
        </p>
        <RevealHeading
          as="h1"
          base="max-w-[18ch] font-display text-[clamp(2.25rem,4.2vw,3.75rem)] font-bold leading-[1.02] tracking-[-0.035em]"
          className="text-carbon"
          lines={["Stay tuned."]}
        />
        <Reveal as="p" delay={0.2} className="mt-5 max-w-[56ch] text-[17px] leading-relaxed text-[#475569]">
          Guides on batteries, charging and electric scooter ownership are coming soon.
        </Reveal>
        <Reveal delay={0.3} className="mt-6">
          <span className="inline-flex items-center rounded-full border border-volt bg-volt/15 px-4 py-2 font-display text-[12px] font-bold uppercase tracking-[0.16em] text-carbon">
            Coming soon
          </span>
        </Reveal>
      </header>
    </main>
  );
}

/* ---------------------------------------------------------------------------
   FULL BLOG PAGE: restore by deleting the placeholder above, un-commenting the two
   imports at the top, and un-commenting this.

export default function BlogsPage() {
  const [featured, ...rest] = posts;

  return (
    <main className="relative isolate overflow-x-clip bg-white pb-20 pt-[88px]">
      <BlueprintBg
        name="rear"
        className="right-[-26%] top-[96px] h-[420px] sm:right-[-6%] sm:h-[560px] lg:right-[2%] lg:top-[70px] lg:h-[720px]"
      />
      <header className="px-[7%] pb-10 pt-2 sm:pt-12 lg:pb-12 lg:pt-16">
        <p className="mb-3 font-display text-[13px] font-bold uppercase tracking-[0.16em] text-leaf">
          Blog
        </p>
        <RevealHeading
          as="h1"
          base="max-w-[18ch] font-display text-[clamp(2.25rem,4.2vw,3.75rem)] font-bold leading-[1.02] tracking-[-0.035em]"
          className="text-carbon"
          lines={["Ride smarter."]}
        />
        <Reveal as="p" delay={0.2} className="mt-5 max-w-[56ch] text-[17px] leading-relaxed text-[#475569]">
          Plain answers on batteries, charging and living with an electric scooter.
        </Reveal>
      </header>

      <div className="px-[7%]">
        {featured && (
          <Reveal delay={0.3}>
            <PostCard post={featured} featured />
          </Reveal>
        )}

        {rest.length > 0 && (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <Reveal key={post.slug} index={i} className="h-full">
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
--------------------------------------------------------------------------- */