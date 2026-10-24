import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/heroModels";
import { formatDate, getPost, posts } from "@/lib/blogs";
import { PostCard } from "@/components/blog/PostCard";
import { Reveal } from "@/components/ui/Reveal";
import { RevealHeading } from "@/components/ui/RevealHeading";

/*
 * /blogs/<slug> — one article. The page is the template (header, SEO, structured data,
 * related cards, call to action). The article itself is the Body component exported by
 * its own file in content/blogs/, so each article controls its own layout.
 *
 * Motion is kept to the edges: the header, "Keep reading" and the call to action reveal
 * once; the article body stays still so nothing moves while someone reads.
 */

const SITE = "https://moveonevmoto.com";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

// Next 15 signature: params is a Promise. On Next 14 it is a plain object, so drop the
// `await` and the Promise<> wrapper.
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  const url = `/blogs/${post.slug}`;
  return {
    title: `${post.title} | MOVE ON`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url,
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const Body = post.Body;
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2);
  const whatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi, I read "${post.title}" and have a question.`,
  )}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: `${SITE}/blogs/${post.slug}`,
    author: { "@type": "Organization", name: "MOVE ON EV MOTO" },
    publisher: { "@type": "Organization", name: "MOVE ON EV MOTO", url: SITE },
  };

  return (
    <main className="bg-white pb-20 pt-[88px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="px-[7%] pt-2 sm:pt-10 lg:pt-14">
        <div className="mx-auto max-w-[760px]">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[#475569] transition-colors hover:text-carbon"
          >
            <ArrowLeft size={16} aria-hidden />
            All articles
          </Link>

          <header className="mt-8 border-b border-carbon/10 pb-10">
            <div className="flex items-center gap-3 text-[13px] text-[#475569]">
              <span className="rounded-full bg-volt/35 px-3 py-1.5 font-display text-[12px] font-bold uppercase tracking-[0.08em] text-carbon">
                {post.category}
              </span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden>·</span>
              <span>{post.readMin} min read</span>
            </div>

            <RevealHeading
              as="h1"
              base="mt-5 font-display text-[clamp(2.25rem,4.2vw,3.5rem)] font-bold leading-[1.04] tracking-[-0.035em]"
              className="text-carbon"
              lines={[post.title]}
            />
            <Reveal as="p" delay={0.2} className="mt-5 text-[19px] leading-relaxed text-[#475569]">
              {post.excerpt}
            </Reveal>
          </header>

          {/* The article. Its own file decides everything in here. */}
          <div className="pt-10">
            <Body />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mx-[7%] mt-16 border-t border-carbon/10 pt-12 lg:mt-20 lg:pt-14">
          <p className="mb-3 font-display text-[13px] font-bold uppercase tracking-[0.16em] text-leaf">
            Keep reading
          </p>
          <RevealHeading
            base="mb-8 max-w-[26ch] font-display text-[clamp(1.5rem,2.6vw,2.125rem)] font-bold leading-[1.1] tracking-[-0.03em]"
            className="text-carbon"
            lines={["More from the blog."]}
          />
          <div className="grid gap-6 md:grid-cols-2">
            {related.map((p, i) => (
              <Reveal key={p.slug} index={i} className="h-full">
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section
        data-theme="dark"
        className="mx-[7%] mt-16 rounded-[32px] bg-carbon px-8 py-14 text-center lg:py-16"
      >
        <RevealHeading
          base="font-display text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold tracking-[-0.03em]"
          className="text-white"
          lines={["Questions? Ask us."]}
        />
        <Reveal as="p" delay={0.2} className="mx-auto mt-4 max-w-[46ch] text-[17px] leading-relaxed text-white/65">
          Book a free test ride, or message us and we will help you choose.
        </Reveal>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/#book"
            className="rounded-full bg-volt px-8 py-4 font-display text-[16px] font-bold text-carbon transition-colors duration-200 hover:bg-white"
          >
            Book a test ride
          </Link>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/25 px-8 py-4 font-display text-[16px] font-bold text-white transition-colors duration-200 hover:bg-white/10"
          >
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}