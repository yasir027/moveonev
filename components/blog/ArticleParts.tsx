import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";

/*
 * ARTICLE PARTS
 *
 * The building blocks every article file uses, so all articles share one look. An article
 * is plain JSX: mix these with your own markup and Tailwind classes anywhere, between any
 * two paragraphs. Nothing here is required, so use what the article needs.
 *
 *   H2, H3          headings
 *   P               paragraph
 *   A               inline link (internal links use next/link automatically)
 *   Strong          bold word inside a paragraph
 *   UL, LI          ticked list
 *   Note            callout, tone="info" (default) or "warn"
 *   Stats           a row of big numbers
 *   Figure          image with a caption
 *   Compare         comparison table
 *   Pullquote       large highlighted line
 *   InlineCTA       a call to action in the middle of an article
 *
 * Server components, so no client JS.
 */

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-4 mt-12 font-display text-[clamp(1.375rem,2.2vw,1.75rem)] font-bold leading-[1.15] tracking-[-0.03em] text-carbon first:mt-0">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-3 mt-8 font-display text-[clamp(1.125rem,1.7vw,1.25rem)] font-bold tracking-tight text-carbon">
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="mb-5 text-[17px] leading-[1.8] text-[#334155]">{children}</p>;
}

export function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-carbon">{children}</strong>;
}

/* Inline link. Paths starting with "/" are internal; anything else opens in a new tab. */
export function A({ href, children }: { href: string; children: ReactNode }) {
  const cls =
    "font-medium text-leaf underline decoration-leaf/30 underline-offset-4 transition-colors hover:decoration-leaf";
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {children}
    </a>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="mb-6 space-y-3">{children}</ul>;
}

export function LI({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-[17px] leading-[1.7] text-[#334155]">
      <span
        aria-hidden
        className="mt-[0.6rem] h-2 w-2 shrink-0 rounded-full bg-leaf"
      />
      <span>{children}</span>
    </li>
  );
}

export function Note({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "warn";
}) {
  const warn = tone === "warn";
  return (
    <div
      role="note"
      className={[
        "my-8 flex items-start gap-3 rounded-[20px] px-5 py-4 text-[16px] font-medium leading-relaxed",
        warn ? "bg-[#C8102E]/[0.07] text-[#9B0B22]" : "bg-volt/10 text-carbon",
      ].join(" ")}
    >
      {warn ? (
        /* A plain "!" so it can't go missing in a different lucide version. */
        <span
          aria-hidden
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C8102E] font-display text-[12px] font-bold text-white"
        >
          !
        </span>
      ) : (
        <Info size={20} className="mt-0.5 shrink-0 text-leaf" aria-hidden />
      )}
      <div>{children}</div>
    </div>
  );
}

export function Stats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl
      className="my-10 grid divide-y divide-carbon/10 border-y border-carbon/10 sm:divide-x sm:divide-y-0"
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((s) => (
        <div key={s.label} className="py-6 sm:px-6 sm:first:pl-0">
          <dd className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold leading-none tracking-[-0.04em] text-carbon">
            {s.value}
          </dd>
          <dt className="mt-2 text-[14px] text-[#475569]">{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}

export function Figure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="my-10">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[24px] bg-volt/10">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 760px, 100vw"
          className="object-contain p-[6%]"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-[14px] text-[#64748B]">{caption}</figcaption>
      )}
    </figure>
  );
}

export function Compare({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="my-10 overflow-x-auto">
      <table className="w-full min-w-[480px] text-left">
        <thead>
          <tr className="border-b border-carbon/15 text-[13px] font-bold uppercase tracking-[0.12em] text-[#475569]">
            {head.map((h) => (
              <th key={h} className="py-3 pr-4 font-display">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-[16px] text-[#334155]">
          {rows.map((row) => (
            <tr key={row[0]} className="border-b border-carbon/10">
              {row.map((cell, i) => (
                <td
                  key={i}
                  className={["py-4 pr-4", i === 0 ? "font-medium text-carbon" : ""].join(" ")}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Pullquote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-10 border-l-4 border-volt pl-6 font-display text-[clamp(1.375rem,2.4vw,1.875rem)] font-bold leading-[1.2] tracking-[-0.03em] text-carbon">
      {children}
    </blockquote>
  );
}

export function InlineCTA({
  title,
  href,
  label,
}: {
  title: string;
  href: string;
  label: string;
}) {
  return (
    <div className="my-10 flex flex-col gap-4 rounded-[24px] bg-carbon px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <p className="font-display text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold tracking-tight text-white">
        {title}
      </p>
      <Link
        href={href}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-volt px-6 py-3 font-display text-[15px] font-bold text-carbon transition-colors duration-200 hover:bg-white"
      >
        {label}
        <ArrowRight size={16} strokeWidth={2.75} aria-hidden />
      </Link>
    </div>
  );
}
