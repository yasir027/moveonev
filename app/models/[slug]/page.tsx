import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { FINISH, formatPrice, getModel, models } from "@/lib/models";
import { ModelDetail } from "@/components/models/ModelDetail";

/*
 * The real page behind /models/<slug>. This is what a refresh, a shared link, a bookmark
 * and the modal's "New tab" button all land on. The modal's expanded state renders the
 * same ModelDetail below its own hero, so what a model includes can't drift between the
 * two — only the hero and the closing CTA are written twice.
 */

export function generateStaticParams() {
  return models.map((m) => ({ slug: m.slug }));
}

// Next 15 signature: params is a Promise. On Next 14 it is a plain object, so drop the
// `await` and the Promise<> wrapper.
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const model = getModel((await params).slug);
  return model
    ? { title: `${model.name} | MOVE ON`, description: model.blurb }
    : {};
}

export default async function ModelPage({ params }: Props) {
  const model = getModel((await params).slug);
  if (!model) notFound();

  const photos = model.gallery?.length ? model.gallery : model.image ? [model.image] : [];

  const keyNumbers = [
    ["Top speed", model.topSpeed],
    ["Range", model.range],
    ["Motor", model.motor],
    ["Load", model.load],
  ];

  return (
    <main className="bg-white pb-20 pt-28 lg:pt-32">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8">
        <Link
          href="/models"
          className="mb-8 inline-flex items-center gap-2 font-display text-[15px] font-semibold text-carbon/60 transition-colors hover:text-carbon"
        >
          <ArrowLeft size={17} /> All models
        </Link>

        {/* HERO */}
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          {/* Photos. Sticky, so the scooter stays in view while the buy box scrolls. */}
          <div className="self-start lg:sticky lg:top-28">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] bg-soft-grey">
              {/* Floor: tight contact ellipse plus a wide ambient one. */}
              <div
                aria-hidden
                className="absolute bottom-[12%] left-1/2 h-5 w-[58%] -translate-x-1/2 rounded-[50%] bg-carbon/15 blur-2xl"
              />
              <div
                aria-hidden
                className="absolute bottom-[15%] left-1/2 h-2 w-[30%] -translate-x-1/2 rounded-[50%] bg-carbon/25 blur-lg"
              />
              {photos[0] ? (
                <Image
                  src={photos[0]}
                  alt={`MOVE ON ${model.name}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 55vw, 92vw"
                  className="relative z-10 object-contain p-6 drop-shadow-[0_22px_22px_rgba(0,0,0,0.16)]"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center font-display text-[12px] font-bold tracking-[0.25em] text-carbon/30">
                  IMAGE PENDING
                </div>
              )}
            </div>

            {photos.length > 1 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {photos.slice(1).map((src) => (
                  <div
                    key={src}
                    className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-soft-grey"
                  >
                    <Image
                      src={src}
                      alt={`MOVE ON ${model.name}`}
                      fill
                      sizes="(min-width: 1024px) 18vw, 30vw"
                      className="object-contain p-2"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buy box */}
          <div>
            <span className="mb-4 block h-px w-10 bg-volt" />
            <p className="mb-4 font-display text-[13px] font-bold uppercase tracking-[0.16em] text-leaf">
              No licence · No RTO
            </p>

            <h1 className="font-display text-[clamp(2.25rem,4vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.035em] text-carbon">
              {model.name}
            </h1>

            <p className="mt-4 font-display text-[22px] font-bold text-carbon/75">
              From <span className="text-carbon">{formatPrice(model.price)}</span>
            </p>

            <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-carbon/65">
              {model.blurb}
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-3">
              {keyNumbers.map(([label, value]) => (
                <div key={label} className="rounded-[18px] bg-soft-grey px-5 py-4">
                  <dt className="font-display text-[12px] font-bold uppercase tracking-[0.14em] text-carbon/55">
                    {label}
                  </dt>
                  <dd className="mt-1 font-display text-[24px] font-bold tracking-tight text-carbon">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8">
              <p className="mb-3 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-carbon/55">
                Finishes
              </p>
              <ul className="flex flex-wrap gap-2.5">
                {model.finishes.map((finish) => (
                  <li
                    key={finish}
                    className="flex items-center gap-2.5 rounded-full border border-carbon/10 py-2 pl-2.5 pr-4 text-[15px] font-medium text-carbon/80"
                  >
                    <span
                      className="h-4 w-4 rounded-full shadow-[inset_0_0_0_1px_rgb(16_20_18/0.18)]"
                      style={{ backgroundColor: FINISH[finish] ?? "#8A9199" }}
                    />
                    {finish}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/#book"
                className="min-w-[200px] flex-1 rounded-full bg-volt px-7 py-4 text-center font-display text-[16px] font-bold text-carbon transition-colors duration-200 hover:bg-carbon hover:text-white"
              >
                Book a test ride
              </Link>
              <Link
                href="/models"
                className="min-w-[160px] flex-1 rounded-full border-[1.5px] border-carbon/15 px-7 py-4 text-center font-display text-[16px] font-semibold text-carbon transition-colors duration-200 hover:border-carbon/40"
              >
                Compare models
              </Link>
            </div>
          </div>
        </div>

        {/* DETAIL */}
        <div className="mt-16 border-t border-carbon/10 pt-14 lg:mt-20 lg:pt-16">
          <ModelDetail model={model} />
        </div>
      </div>

      {/* CLOSING CTA — dark, so the page ends on the one action it exists for. */}
      <section
        data-theme="dark"
        className="mx-auto mt-6 w-[calc(100%-2.5rem)] max-w-[1200px] rounded-[32px] bg-carbon px-8 py-14 text-center sm:w-[calc(100%-3rem)] lg:py-16"
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