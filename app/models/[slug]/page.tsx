import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BATTERIES, getModel, models } from "@/lib/models";
import { ModelView } from "@/components/models/ModelView";
import { ExpandPanel } from "@/components/ui/ExpandPanel";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal } from "@/components/ui/Reveal";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { LineupSection } from "@/components/LineupSection";

/*
 * The real page behind /models/<slug>: what a refresh, a shared link, a bookmark, the
 * modal's "New tab" button and the modal's Expand all land on. It renders the same
 * ModelView as the popup's expanded state, so the two can't drift apart. Server-rendered
 * HTML with its own title, description, canonical URL and Product structured data.
 */

const SITE = "https://moveonevmoto.com";

export function generateStaticParams() {
  return models.map((m) => ({ slug: m.slug }));
}

// Next 15 signature: params is a Promise. On Next 14 it is a plain object, so drop the
// `await` and the Promise<> wrapper.
type Props = {
  params: Promise<{ slug: string }>;
  /* ?finish=&battery= — the picks the popup hands over on Expand. Reading them makes the
     page render per request rather than at build time. */
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const model = getModel((await params).slug);
  if (!model) return {};
  const url = `/models/${model.slug}`;
  return {
    title: `${model.name} | MOVE ON`,
    description: model.blurb,
    alternates: { canonical: url },
    openGraph: {
      title: `${model.name} | MOVE ON`,
      description: model.blurb,
      url,
      images: model.image ? [model.image] : [],
    },
  };
}

export default async function ModelPage({ params, searchParams }: Props) {
  const model = getModel((await params).slug);
  if (!model) notFound();

  /* Only values this model actually has; anything else falls back to the defaults. */
  const query = await searchParams;
  const finish = model.finishes.find((f) => f === query.finish);
  const battery = BATTERIES.find((b) => b.id === query.battery)?.id;

  const offers = Object.values(model.pricing).map((p) => p.offer);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: model.name,
    description: model.blurb,
    image: model.image ? [`${SITE}${model.image}`] : undefined,
    brand: { "@type": "Brand", name: "XIDAA" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: Math.min(...offers),
      highPrice: Math.max(...offers),
      offerCount: offers.length,
      availability: "https://schema.org/InStock",
      url: `${SITE}/models/${model.slug}`,
    },
  };

  return (
    /* pt clears the fixed navbar; tune it until the scooter sits exactly where it did in
       the grown popup. */
    <main className="bg-white pt-[88px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ModelView
        model={model}
        expanded
        asPage
        initialFinish={finish}
        initialBattery={battery}
      />

      {/* CLOSING CTA — dark, so the page ends on the one action it exists for. */}
      <section
        data-theme="dark"
        className="mx-[7%] mt-6 rounded-[32px] bg-carbon px-8 py-14 text-center lg:py-16"
      >
        <h2 className="font-display text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold tracking-[-0.03em] text-white">
          Ride the {model.name} before you decide.
        </h2>
        
        <p className="mx-auto mt-4 max-w-[46ch] text-[17px] leading-relaxed text-white/65">
          Book a free test ride. No paperwork, no licence — just turn up.
        </p>
        <Link
          href="/#book"
          className="mt-8 inline-block rounded-full bg-volt px-8 py-4 font-display text-[16px] font-bold text-carbon transition-colors duration-200 hover:bg-white"
        >
          Book a test ride
        </Link>
        
      </section>
    <LineupSection/>
    </main>
  
);
}