import { HeroEditorial } from "@/components/hero/HeroEditorial";
import { UspSection } from "@/components/UspSection";
import { ProductCard } from "@/components/ProductCard";
import { StatBlock } from "@/components/StatBlock";
import { AudienceSection } from "@/components/WhoIsItFor";
import { FaqSection } from "@/components/FaqSection";
import { BatterySection } from "@/components/BatterySection";
import { LineupSection } from "@/components/LineupSection";
import {GetInTouchSection} from "@/components/GetInTouch";
import {HeroSection} from "@/components/hero/HeroSection"
import { ExpandPanel } from "@/components/ui/ExpandPanel";
import { ShowroomLead } from "@/components/SiteFooter";
export default function Home() {
  return (
    <main>
      <HeroSection/>
      {/* The full-bleed studio direction is parked in components/hero/HeroStudio.tsx. */}
      <HeroEditorial />
      {/* TEMP: three USP visual directions stacked — keep one, delete the rest. */}
      <UspSection visual="closeups" />
      <LineupSection/>
      <AudienceSection />
      <BatterySection/>
      <ExpandPanel>
        <GetInTouchSection/>
      </ExpandPanel>
      

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
      {/* Runs straight on into the footer: same ground, no rule between them. */}
      <ShowroomLead />
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
