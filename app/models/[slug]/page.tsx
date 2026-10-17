import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BATTERIES, getModel, models } from "@/lib/models";
import { ModelView } from "@/components/models/ModelView";
import { ExpandPanel } from "@/components/ui/ExpandPanel";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal } from "@/components/ui/Reveal";
import { RevealHeading } from "@/components/ui/RevealHeading";

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

      {/* CLOSING CTA — dark, so the page ends on the one action it exists for. It opens
          from an inset, rounded panel to full width as it scrolls in, like the home's Get
          in Touch, and runs straight on into the dark footer. */}
      <div className="mt-10 lg:mt-16">
        <ExpandPanel gutterClassName="bg-white">
          <section
            data-theme="dark"
            className="relative bg-carbon px-8 py-20 text-center lg:py-28"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(60% 50% at 20% 15%, rgb(125 255 64 / 0.16), transparent 62%), radial-gradient(55% 50% at 92% 88%, rgb(0 168 107 / 0.14), transparent 62%)",
              }}
            />
            <div className="relative">
              <RevealHeading replay
                className="text-white"
                lines={[
                  `Ride the ${model.name}`,
                  <span key="b" className="text-white/30">
                    before you decide.
                  </span>,
                ]}
              />
              <Reveal replay
                as="p"
                delay={0.25}
                className="mx-auto mt-6 max-w-[46ch] text-[17px] leading-relaxed text-white/65"
              >
                Book a free test ride. No paperwork, no licence — just turn up.
              </Reveal>
              <Reveal replay delay={0.35} className="mt-10">
                <Magnetic>
                  <Link
                    href="/#book"
                    className="inline-block rounded-full bg-volt px-8 py-4 font-display text-[16px] font-bold text-carbon transition-colors duration-200 hover:bg-white"
                  >
                    Book a test ride
                  </Link>
                </Magnetic>
              </Reveal>
            </div>
          </section>
        </ExpandPanel>
      </div>
    </main>
  );
}