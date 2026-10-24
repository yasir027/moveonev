import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { RevealHeading } from "@/components/ui/RevealHeading";

/*
 * The shared layout for /privacy and /terms: a plain header, a numbered contents list
 * (sticky beside the text on laptops, a tap-to-open list on phones) and the sections as
 * anchors. Body text uses the blog's ArticleParts, so it reads like the rest of the site.
 * Calm on purpose: no background art, and the text itself never moves.
 */

export type LegalSection = { id: string; title: string; body: ReactNode };

export function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: ReactNode;
  /** Shown as "Last updated: …". */
  updated: string;
  sections: LegalSection[];
}) {
  const contents = (
    <ol className="space-y-1 border-l border-carbon/10">
      {sections.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className="-ml-px block border-l border-transparent py-1.5 pl-4 text-[14px] leading-snug text-[#475569] transition-colors hover:border-leaf hover:text-carbon"
          >
            <span className="mr-1.5 tabular-nums text-carbon/35">{String(i + 1).padStart(2, "0")}</span>
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <main className="bg-white pb-24 pt-[88px]">
      <header className="px-[7%] pb-10 pt-2 sm:pt-12 lg:pb-14 lg:pt-16">
        <p className="mb-3 font-display text-[13px] font-bold uppercase tracking-[0.16em] text-leaf">{eyebrow}</p>
        <RevealHeading
          as="h1"
          base="max-w-[18ch] font-display text-[clamp(2.25rem,4.2vw,3.75rem)] font-bold leading-[1.02] tracking-[-0.035em]"
          className="text-carbon"
          lines={[title]}
        />
        <Reveal as="p" delay={0.2} className="mt-5 max-w-[62ch] text-[17px] leading-relaxed text-[#475569]">
          {intro}
        </Reveal>
        <p className="mt-4 text-[14px] text-[#64748B]">Last updated: {updated}</p>
      </header>

      <div className="px-[7%] lg:grid lg:grid-cols-[230px_minmax(0,720px)] lg:gap-16">
        {/* Phones and tablets: the contents fold away. */}
        <details className="group mb-10 rounded-[20px] border border-carbon/10 px-5 py-4 lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between font-display text-[15px] font-semibold text-carbon">
            On this page
            <ChevronDown size={18} aria-hidden className="transition-transform duration-300 group-open:rotate-180" />
          </summary>
          <div className="mt-4">{contents}</div>
        </details>

        {/* Laptops: the contents stay in view beside the text. */}
        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-28">
            <p className="mb-3 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-carbon/45">
              On this page
            </p>
            {contents}
          </div>
        </nav>

        <div>
          {sections.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              className="scroll-mt-28 border-t border-carbon/10 py-10 first:border-t-0 first:pt-0"
            >
              <h2 className="mb-5 font-display text-[clamp(1.375rem,2.2vw,1.75rem)] font-bold leading-[1.15] tracking-[-0.03em] text-carbon">
                <span className="mr-2 text-carbon/30">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h2>
              {s.body}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
