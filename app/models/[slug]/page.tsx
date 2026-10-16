import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getModel, models } from "@/lib/models";
import { ModelView } from "@/components/models/ModelView";

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
type Props = { params: Promise<{ slug: string }> };

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

export default async function ModelPage({ params }: Props) {
  const model = getModel((await params).slug);
  if (!model) notFound();

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
    <main className="bg-white pb-20 pt-[88px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ModelView model={model} expanded asPage />

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
    </main>
  );
}