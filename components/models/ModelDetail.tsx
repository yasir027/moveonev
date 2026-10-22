import type { ReactNode } from "react";
import Image from "next/image";
import {
  BatteryCharging,
  Check,
  CreditCard,
  Droplets,
  Flame,
  KeyRound,
  Layers,
  Radio,
  RotateCw,
  Scale,
  Smartphone,
  Watch,
  Wrench,
  Zap,
  ArrowLeftRight,
  Bike,
  Bluetooth,
  ParkingCircle,
  ShieldCheck,
  Usb,
  BellRing,
  Gauge,
  Info,
  type LucideIcon,
} from "lucide-react";
import {
  BATTERIES,
  BATTERY_APP,
  BATTERY_PROTECTION,
  CHARGERS,
  IN_THE_BOX,
  SMART_FEATURES,
  START_METHODS,
  WARRANTY,
  WARRANTY_NOTE,
  specRows,
  type IconKey,
  type Model,
} from "@/lib/models";

/*
 * Everything below the hero, as a stack of full-width sections. Shared by the expanded
 * modal and the /models/[slug] page, so the two can't drift on what a model includes.
 *
 * No "use client": it renders from either side, and the spec table uses <details>, which
 * needs no JavaScript.
 *
 * Sections carry only a top hairline and no background of their own, so the stack sits
 * the same on the page's white and inside the modal.
 */

const ICONS: Record<IconKey, LucideIcon> = {
  key: KeyRound,
  remote: Radio,
  card: CreditCard,
  watch: Watch,
  wrench: Wrench,
  fire: Flame,
  water: Droplets,
  laser: Zap,
  nickel: Layers,
  app: Smartphone,
  balancer: Scale,
  fast: BatteryCharging,
  cycle: RotateCw,
};

/* The photo for each start method, from /public/keys. */
const START_IMAGES: Partial<Record<IconKey, string>> = {
  key: "/keys/keys.png",
  remote: "/keys/remote.png",
  card: "/keys/nfc.png",
  watch: "/keys/watch.png",
};

const FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: BellRing, title: "Anti-theft alarm", body: "Keeps your scooter safe, wherever you park." },
  { icon: Bike, title: "Side stand sensor", body: "Prevents accidental start for added safety." },
  { icon: ArrowLeftRight, title: "Reverse gear", body: "Easily reverse in tight spaces." },
  { icon: ParkingCircle, title: "Parking switch", body: "Stay in control, even on slopes." },
  { icon: Usb, title: "USB charger", body: "Keep your devices charged on the go." },
  { icon: Bluetooth, title: "In-built Bluetooth speaker", body: "Enjoy your favourite music while you ride." },
  { icon: Gauge, title: "Cruise control", body: "Hold a steady speed on long, open roads. Optional." },
  { icon: Watch, title: "NFC smart watch", body: "Wear it. Tap it. Ride." },
];

/* One lifestyle photo per model, from /public/people. A model without one gets the
   features at full width instead. */
const PEOPLE: Record<string, string> = {
  "x-single-light": "/people/x-singlelight.png",
  "x-double-light": "/people/x-doublelight.png",
  "x-torvo": "/people/x-torvo.png",
  "x-e4": "/people/x-e4.png",
  "x-fh-big-activa": "/people/x-fh.png",
  "x-ozone": "/people/x-ozone.png",
  "x-orl-cheetah": "/people/x-orlcheetah.png",
  "x-robox": "/people/x-robox.png",
  "x-lambretta": "/people/x-lambretta.png",
};

/* Pack photos from /public. Keyed by the battery ids in lib/models.ts. */
const BATTERY_IMAGES: Record<string, string> = {
  "30ah": "/Battery.png",
  "55ah": "/55Ah.png",
};

export function ModelDetail({ model }: { model: Model }) {
  return (
    <div>
      {/* 1 — the most distinctive thing on the sheet */}
<section className="pb-12 lg:pb-14">
  <h2 className="mb-8 max-w-[26ch] font-display text-[clamp(1.5rem,2.6vw,2.125rem)] font-bold leading-[1.1] tracking-[-0.03em] text-carbon">
    Four ways to start. No fumbling for keys.
  </h2>

  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {START_METHODS.map((method) => {
      const Icon = ICONS[method.icon];
      const photo = START_IMAGES[method.icon];
      return (
        <div key={method.title} className="rounded-[28px] bg-volt/10 p-6">
          <div className="relative aspect-square">
<span aria-hidden className="absolute inset-[3%] rounded-full bg-volt/25" />
            {photo && (
              <Image
                src={photo}
                alt={method.title}
                fill
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                className="object-contain p-[4%] drop-shadow-[0_14px_14px_rgba(0,0,0,0.18)]"
              />
            )}
            <span className="absolute bottom-2 left-0 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-carbon text-volt shadow-[0_8px_20px_-6px_rgba(16,20,18,0.5)]">
              <Icon size={22} strokeWidth={2.25} aria-hidden />
            </span>
          </div>

          <h3 className="mt-5 font-display text-[18px] font-bold tracking-tight text-carbon">
            {method.title}
          </h3>
          <p className="mt-1.5 text-[14px] leading-relaxed text-[#475569]">{method.body}</p>
        </div>
      );
    })}
  </div>
</section>
      
      
      {/* 2 */}
<section className="border-t border-carbon/10 py-12 lg:py-14">
  <div
    className={
      PEOPLE[model.slug]
        ? "grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12"
        : ""
    }
  >
    <div>
      <p className="mb-3 font-display text-[13px] font-bold uppercase tracking-[0.16em] text-leaf">
        Smart features
      </p>
      <h2 className="max-w-[26ch] font-display text-[clamp(1.5rem,2.6vw,2.125rem)] font-bold leading-[1.1] tracking-[-0.03em] text-carbon">
        Built for performance, comfort and connectivity.
      </h2>
      <p className="mb-8 mt-3 text-[14px] text-[#475569]">
        Thoughtful technology that makes every ride easier.
      </p>

      <ul className="grid gap-3 sm:grid-cols-2">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <li
            key={title}
            className="flex items-center gap-4 rounded-[20px] bg-volt/10 p-4"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-volt/25">
              <Icon size={24} strokeWidth={2} className="text-leaf" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-[15px] font-bold tracking-tight text-carbon">
                {title}
              </span>
              <span className="mt-0.5 block text-[14px] leading-snug text-[#475569]">
                {body}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>

    {PEOPLE[model.slug] && (
      <div className="relative min-h-[320px] overflow-hidden rounded-[28px] lg:min-h-0">
        <Image
          src={PEOPLE[model.slug]}
          alt={`${model.name} on the road`}
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover"
        />
      </div>
    )}
  </div>
</section>

      {/* 3 */}
<Section eyebrow="The battery" title="Two packs. Same protection, different distance.">
  <div className="grid gap-4 lg:grid-cols-2">
    {BATTERIES.map((pack, i) => (
      <div
        key={pack.id}
        className={[
          "relative min-h-[300px] overflow-hidden rounded-[28px] p-6 lg:p-8",
          i === 0 ? "bg-soft-grey" : "bg-volt/10",
        ].join(" ")}
      >
        {/* Text on the left, the pack photo on the right. */}
        <div className="relative z-10 w-[52%] sm:w-1/2">
          <p className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-leaf">
            {pack.label}
          </p>
<p className="mt-2 font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-extrabold leading-none tracking-[-0.04em] text-carbon">            {pack.range}
          </p>
          <p className="mt-1.5 text-[14px] text-[#475569]">per charge</p>

          <dl className="mt-6 space-y-3 border-t border-carbon/10 pt-5">
            <Row label="Cells" value={pack.cells} />
            <Row label="Warranty" value={pack.warranty} />
          </dl>
        </div>

        <div className="absolute inset-y-6 right-4 w-[46%] lg:right-6">
          <Image
            src={BATTERY_IMAGES[pack.id]}
            alt={`${pack.label} battery`}
            fill
            sizes="(min-width: 1024px) 22vw, 45vw"
            className="object-contain drop-shadow-[0_18px_18px_rgba(0,0,0,0.25)]"
          />
        </div>
      </div>
    ))}
  </div>

  {/* Protection panel */}
<div className="mt-4 py-6 lg:py-8">
      <h3 className="font-display text-[clamp(1.25rem,2vw,1.5rem)] font-bold tracking-tight text-carbon">
      Engineered for peace of mind
    </h3>
    <p className="mt-1 text-[14px] text-[#475569]">
      Advanced protection. Longer life. A safer ride, every day.
    </p>

    <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
      {BATTERY_PROTECTION.map((item) => {
        const Icon = ICONS[item.icon];
        return (
          <li key={item.label} className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-volt/25">
              <Icon size={20} strokeWidth={2} className="text-leaf" aria-hidden />
            </span>
            <span className="text-[14px] font-medium leading-tight text-carbon">
              {item.label}
            </span>
          </li>
        );
      })}
    </ul>
  </div>

  <p className="mt-6 max-w-[62ch] text-[14px] leading-relaxed text-[#475569]">{BATTERY_APP}</p>
</Section>

      {/* 4 */}
<section className="border-t border-carbon/10 py-12 lg:py-14">
  <p className="mb-3 font-display text-[13px] font-bold uppercase tracking-[0.16em] text-leaf">
    Charging
  </p>
  <h2 className="max-w-[26ch] font-display text-[clamp(1.5rem,2.6vw,2.125rem)] font-bold leading-[1.1] tracking-[-0.03em] text-carbon">
    Pick the charger that fits your routine.
  </h2>
  <p className="mb-8 mt-3 text-[14px] text-[#475569]">
    Fast, reliable charging for everyday use.
  </p>

  <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
    <div className="relative aspect-[8/5] w-full">
      <Image
        src="/charger.png"
        alt="XIDAA 60V lithium battery charger with LED display"
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
      className="object-contain p-[8%] drop-shadow-[0_18px_18px_rgba(0,0,0,0.18)]"      />
    </div>

    <div>
      <div className="divide-y divide-carbon/15">
        {CHARGERS.map((charger) => (
          <div key={charger.label} className="py-5 first:pt-0">
            <p className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-[#475569]">
              {charger.label}
            </p>
<p className="mt-2 font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-extrabold leading-none tracking-[-0.04em] text-carbon">              {charger.time}
            </p>
            <p className="mt-1.5 text-[14px] text-[#475569]">Full charge</p>
          </div>
        ))}
      </div>

      <p className="mt-2 flex items-start gap-3 border-t border-carbon/15 pt-5 text-[14px] leading-relaxed text-[#475569]">
        <Info size={18} aria-hidden className="mt-0.5 shrink-0 text-leaf" />
        <span>
          The charger display shows charge percentage, charging status and when the
          battery is full. 1 year warranty on the charger.
        </span>
      </p>
    </div>
  </div>
</section>

      {/* 5 */}
<section className="border-t border-carbon/10 py-12 lg:py-14">
  <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)] lg:gap-12">
    <div>
      <h2 className="mb-8 max-w-[26ch] font-display text-[clamp(1.5rem,2.6vw,2.125rem)] font-bold leading-[1.1] tracking-[-0.03em] text-carbon">
        Everything you need on day one.
      </h2>

      <div className="space-y-6">
        {IN_THE_BOX.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <div key={item.title} className="flex gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-volt/25">
                <Icon size={24} strokeWidth={2} className="text-leaf" aria-hidden />
              </span>
              <div>
                <h3 className="font-display text-[18px] font-bold tracking-tight text-carbon">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-[#475569]">
                  {item.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    <div className="relative aspect-[8/5] w-full">
      <Image
        src="/ToolKit.png"
        alt="All-in-one tool kit: flat wrench 8, 10, 15 mm and 14GE; inner hex key wrench 2, 2.5, 3, 4, 5 and 6 mm; socket hex wrench 8, 9 and 10 mm; flathead and Phillips screwdrivers with sleeve extension rod"
        fill
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="object-contain"
      />
    </div>
  </div>
</section>

      {/* 6 */}
      <Section eyebrow="Warranty" title="Covered where it counts.">
  <dl className="grid grid-cols-2 gap-x-8 lg:grid-cols-4 lg:gap-x-10">
    {WARRANTY.map((item) => {
      /* "2+1 years / 40,000 km" -> big "2+1 years", small "40,000 km" under it. */
      const [main, extra] = item.cover.split(" / ");
      return (
        <div key={item.part} className="border-t border-carbon/15 py-5">
          <dt className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#475569]">
            {item.part}
          </dt>
          <dd className="mt-2">
            <span className="block font-display text-[clamp(1.5rem,2.4vw,2rem)] font-bold leading-tight tracking-tight text-carbon">
              {main}
            </span>
            {extra && (
              <span className="mt-1 block text-[14px] font-semibold text-leaf">{extra}</span>
            )}
          </dd>
        </div>
      );
    })}
  </dl>

  <p role="note" className="mt-2 flex items-center gap-2 text-[14px] text-[#475569]">
    <Info size={16} aria-hidden className="shrink-0" />
    {WARRANTY_NOTE}
  </p>
</Section>

      {/* 7 — reference, so it folds away by default */}
      <Section eyebrow="Specifications" title="The full spec sheet.">
        <details className="group rounded-[20px] border border-carbon/10">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-display text-[16px] font-bold text-carbon [&::-webkit-details-marker]:hidden">
            Show all specifications
            <span
              aria-hidden
              className="flex h-8 w-8 items-center justify-center rounded-full bg-carbon/5 text-carbon transition-transform duration-300 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <dl className="grid gap-x-12 border-t border-carbon/10 px-6 py-3 md:grid-cols-2">
            {specRows(model).map(([label, value]) => (
              <div
                key={label}
                className="flex items-baseline justify-between gap-6 border-b border-carbon/10 py-3.5 last:border-b-0 md:[&:nth-last-child(2):nth-child(odd)]:border-b-0"
              >
                <dt className="text-[15px] text-carbon/55">{label}</dt>
                <dd className="text-right text-[15px] font-medium text-carbon/85">{value}</dd>
              </div>
            ))}
          </dl>
        </details>
      </Section>
    </div>
  );
}

/* ---------------------------------------------------------------------------------
   Pieces
--------------------------------------------------------------------------------- */

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-carbon/10 py-12 first:border-t-0 first:pt-0 lg:py-14">
      <p className="mb-3 font-display text-[13px] font-bold uppercase tracking-[0.16em] text-leaf">
        {eyebrow}
      </p>
      <h2 className="mb-8 max-w-[26ch] font-display text-[clamp(1.5rem,2.6vw,2.125rem)] font-bold leading-[1.1] tracking-[-0.03em] text-carbon">
        {title}
      </h2>
      {children}
    </section>
  );
}

/* Volt disc, leaf tick: volt can't carry a small mark on white, but it can carry a disc. */
function Tick() {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-volt/30">
      <Check size={13} strokeWidth={3.5} className="text-leaf" aria-hidden />
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-[15px] text-carbon/55">{label}</dt>
      <dd className="text-right text-[15px] font-medium text-carbon/85">{value}</dd>
    </div>
  );
}

/* A warning that has to be read. No icon component: a plain "!" can't go missing in a
   different lucide version. */
function Notice({ children }: { children: ReactNode }) {
  return (
    <p
      role="note"
      className="mt-6 flex items-center gap-3 rounded-[16px] bg-[#C8102E]/[0.07] px-5 py-4 text-[15px] font-semibold text-[#9B0B22]"
    >
      <span
        aria-hidden
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C8102E] font-display text-[13px] font-bold text-white"
      >
        !
      </span>
      {children}
    </p>
  );
}