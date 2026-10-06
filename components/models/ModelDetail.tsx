import type { ReactNode } from "react";
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

export function ModelDetail({ model }: { model: Model }) {
  return (
    <div>
      {/* 1 — the most distinctive thing on the sheet */}
      <Section eyebrow="Start it your way" title="Four ways to start. No fumbling for keys.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {START_METHODS.map((method) => {
            const Icon = ICONS[method.icon];
            return (
              <div key={method.title} className="rounded-[20px] bg-soft-grey p-6">
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-carbon text-volt">
                  <Icon size={20} strokeWidth={2.25} aria-hidden />
                </span>
                <h3 className="font-display text-[18px] font-bold tracking-tight text-carbon">
                  {method.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-carbon/65">{method.body}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* 2 */}
      <Section eyebrow="Smart features" title="Built for performance, comfort and connectivity.">
        <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {SMART_FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <Tick />
              <span className="text-[16px] font-medium text-carbon/80">{feature}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* 3 */}
      <Section eyebrow="The battery" title="Two packs. Same protection, different distance.">
        <div className="grid gap-4 sm:grid-cols-2">
          {BATTERIES.map((pack) => (
            <div key={pack.id} className="rounded-[24px] border border-carbon/10 p-6 sm:p-7">
              <p className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-leaf">
                {pack.label}
              </p>
              <p className="mt-3 font-display text-[clamp(2.25rem,4vw,3rem)] font-extrabold leading-none tracking-[-0.04em] text-carbon">
                {pack.range}
              </p>
              <p className="mt-1.5 text-[14px] text-carbon/55">per charge</p>

              <dl className="mt-6 space-y-3 border-t border-carbon/10 pt-5">
                <Row label="Cells" value={pack.cells} />
                <Row label="Warranty" value={pack.warranty} />
              </dl>
            </div>
          ))}
        </div>

        <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {BATTERY_PROTECTION.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <li
                key={item.label}
                className="flex items-center gap-3 rounded-[16px] bg-soft-grey px-4 py-3.5"
              >
                <Icon size={18} className="shrink-0 text-leaf" strokeWidth={2.25} aria-hidden />
                <span className="text-[14px] font-medium leading-tight text-carbon/80">
                  {item.label}
                </span>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 max-w-[62ch] text-[16px] leading-relaxed text-carbon/65">{BATTERY_APP}</p>

        <Notice>{WARRANTY_NOTE}</Notice>
      </Section>

      {/* 4 */}
      <Section eyebrow="Charging" title="Pick the charger that fits your routine.">
        <div className="grid gap-4 sm:grid-cols-2">
          {CHARGERS.map((charger) => (
            <div key={charger.label} className="rounded-[20px] bg-soft-grey p-6">
              <p className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-carbon/55">
                {charger.label}
              </p>
              <p className="mt-2 font-display text-[28px] font-extrabold tracking-[-0.03em] text-carbon">
                {charger.time}
              </p>
              <p className="mt-1 text-[14px] text-carbon/55">full charge</p>
            </div>
          ))}
        </div>
        <p className="mt-5 max-w-[62ch] text-[16px] leading-relaxed text-carbon/65">
          The charger display shows charge percentage, charging status and when the
          battery is full. 1 year warranty on the charger.
        </p>
      </Section>

      {/* 5 */}
      <Section eyebrow="In the box" title="Everything you need on day one.">
        <div className="grid gap-4 sm:grid-cols-2">
          {IN_THE_BOX.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <div key={item.title} className="flex gap-5 rounded-[20px] border border-carbon/10 p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-carbon text-volt">
                  <Icon size={20} strokeWidth={2.25} aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-[18px] font-bold tracking-tight text-carbon">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-carbon/65">{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* 6 */}
      <Section eyebrow="Warranty" title="Covered where it counts.">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {WARRANTY.map((item) => (
            <div key={item.part} className="rounded-[20px] bg-soft-grey p-6">
              <p className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-carbon/55">
                {item.part}
              </p>
              <p className="mt-2 font-display text-[20px] font-bold leading-tight tracking-tight text-carbon">
                {item.cover}
              </p>
            </div>
          ))}
        </div>
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