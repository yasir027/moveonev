import { HeroEditorial } from "@/components/hero/HeroEditorial";
import { UspSection } from "@/components/UspSection";
import { ProductCard } from "@/components/ProductCard";
import { StatBlock } from "@/components/StatBlock";
import { AudienceSection } from "@/components/WhoIsItFor";
import { FaqSection } from "@/components/FaqSection";
import { BatterySection } from "@/components/BatterySection";
import {LineupSection} from "@/components/LineupSection";

export default function Home() {
  return (
    <main>
      {/* The full-bleed studio direction is parked in components/hero/HeroStudio.tsx. */}
      <HeroEditorial />
      {/* TEMP: three USP visual directions stacked — keep one, delete the rest. */}
      <UspSection visual="closeups" />
      <LineupSection/>
      <AudienceSection />
      <BatterySection/>
      {/* Product collection — editorial layout, one card after another. */}
      <section id="models" className="relative bg-white pt-24 lg:pt-32">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <header className="mb-12 max-w-2xl md:mb-20">
            <span className="mb-4 block font-display text-[10px] font-bold uppercase tracking-[0.2em] text-carbon/40">
              The Collection
            </span>
            <h2 className="font-display text-[clamp(3rem,5vw,4.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em] text-carbon">
              Built for the <br />
              <span className="text-carbon/30">road ahead.</span>
            </h2>
          </header>
        </div>
      </section>

      {/* Specification section — large numbers, thin dividers 
      <section id="technology" className="border-t border-carbon/10 bg-mist py-20">
        <div className="mx-auto max-w-7xl px-8">
          <h2 className="mb-10 text-3xl text-carbon lg:text-4xl">Built to perform</h2>

          <div className="grid grid-cols-2 gap-x-8 lg:grid-cols-4">
            <StatBlock value={150} suffix="KM" label="True range" />
            <StatBlock value={80} suffix="KM/H" label="Top speed" />
            <StatBlock value={4.2} suffix="SEC" label="0–40 km/h" decimals={1} />
            <StatBlock value={4.5} suffix="H" label="Charge time" decimals={1} />
          </div>
        </div>
      </section>
*/}
      <FaqSection />

      {/* Final CTA */}
      <section data-theme="dark" className="bg-carbon py-24 text-center text-white">
        <h2 className="mx-auto mb-6 max-w-xl text-4xl lg:text-5xl">
          Ride the future, today.
        </h2>
        <p className="mx-auto mb-8 max-w-md text-white/60">
          Book a test ride at your nearest MOVE ON showroom and feel the
          difference for yourself.
        </p>
      </section>

      {/* Minimal footer */}
      <footer className="border-t border-carbon/10 px-8 py-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-sm text-carbon/50">
          <span>© {new Date().getFullYear()} MOVE ON</span>
          <span>Made for the road ahead.</span>
        </div>
      </footer>
    </main>
  );
}

/** TEMP: separates the stacked USP variants above. Goes when one is chosen. */
function VariantDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 bg-white px-[max(1.5rem,4vw)] py-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-carbon/40">
      <span className="h-px flex-1 bg-carbon/10" />
      {label}
      <span className="h-px flex-1 bg-carbon/10" />
    </div>
  );
}
