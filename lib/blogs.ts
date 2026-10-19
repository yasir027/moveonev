import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

import * as battery from "@/content/blogs/30ah-or-45ah-which-battery-to-choose";
import * as lfp from "@/content/blogs/what-is-an-lfp-battery";
import * as charging from "@/content/blogs/charging-your-electric-scooter-the-right-way";

/*
 * BLOG REGISTRY
 *
 * Each article is its own file in content/blogs/, written as free-form JSX, so it can
 * have any layout and styling between paragraphs. An article file exports two things:
 *
 *   export const meta: PostMeta = { slug, title, excerpt, category, date, readMin, icon };
 *   export default function Body() { return <>...</>; }
 *
 * To publish a new article:
 *   1. Copy any file in content/blogs/ and rename it. Use the slug as the filename.
 *   2. Edit `meta` and the body.
 *   3. Add one `import * as ... from` line above and add it to `entries` below.
 *
 * The listing, article page, related cards, sorting (newest first), static params and
 * SEO tags are all generated from this list.
 */

export type PostMeta = {
  slug: string;
  title: string;
  /** One or two sentences: shown on cards, and used as the meta description. */
  excerpt: string;
  category: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  readMin: number;
  icon: LucideIcon;
};

export type Post = PostMeta & { Body: ComponentType };

const entries: { meta: PostMeta; default: ComponentType }[] = [battery, lfp, charging];

export const posts: Post[] = entries
  .map((e) => ({ ...e.meta, Body: e.default }))
  .sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

/* Fixed to UTC so the server and the browser always print the same day. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
