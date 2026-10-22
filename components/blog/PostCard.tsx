import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatDate, type Post } from "@/lib/blogs";

/*
 * One card for the blog: used for the featured post and the grid on /blogs, and for the
 * "keep reading" row under an article. No photos, so the cover is a tinted tile with the
 * post's icon. Same ring + deep shadow + hover lift as ModelCard.
 */
export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const Icon = post.icon;

  return (
    <Link
      href={`/blogs/${post.slug}`}
      className={[
        "group flex flex-col overflow-hidden rounded-[28px] bg-white p-3 shadow-[0_0_0_1px_rgba(16,20,18,0.08),0_2px_4px_rgba(16,20,18,0.04),0_28px_56px_-24px_rgba(16,20,18,0.28)] transition-[translate,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_0_0_1px_rgba(16,20,18,0.12),0_2px_4px_rgba(16,20,18,0.04),0_36px_70px_-24px_rgba(16,20,18,0.36)]",
        featured ? "lg:flex-row lg:gap-8 lg:p-4" : "h-full",
      ].join(" ")}
    >
      {/* Cover */}
      <div
        className={[
          "relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-[20px] bg-volt/15",
          featured ? "lg:aspect-auto lg:min-h-[340px] lg:w-[46%] lg:shrink-0" : "",
        ].join(" ")}
      >
        <span aria-hidden className="absolute h-44 w-44 rounded-full bg-volt/25" />
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-carbon text-volt transition-transform duration-500 ease-premium group-hover:scale-110">
          <Icon size={34} strokeWidth={2.25} aria-hidden />
        </span>
      </div>

      {/* Text */}
      <div className={["flex flex-1 flex-col p-4", featured ? "lg:justify-center lg:py-6 lg:pr-6" : ""].join(" ")}>
        <div className="flex items-center gap-3 text-[13px] text-[#475569]">
          <span className="rounded-full bg-volt/35 px-3 py-1.5 font-display text-[12px] font-bold uppercase tracking-[0.08em] text-carbon">
            {post.category}
          </span>
          <span>{post.readMin} min read</span>
        </div>

        <h3
          className={[
            "mt-4 font-display font-bold leading-[1.1] tracking-[-0.03em] text-carbon",
            featured
              ? "text-[clamp(1.75rem,3vw,2.5rem)]"
              : "text-[clamp(1.25rem,1.8vw,1.5rem)]",
          ].join(" ")}
        >
          {post.title}
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-[#475569]">{post.excerpt}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <span className="text-[14px] text-[#64748B]">{formatDate(post.date)}</span>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-carbon/5 text-carbon transition-colors duration-300 group-hover:bg-carbon group-hover:text-volt">
            <ArrowUpRight size={20} strokeWidth={2.5} aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}