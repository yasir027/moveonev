import { HeroEditorial } from "@/components/hero/HeroEditorial";
import { HeroStudio } from "@/components/hero/HeroStudio";
import { ProductCard } from "@/components/ProductCard";
import { StatBlock } from "@/components/StatBlock";

export default function Home() {
  return (
    <main>
      {/* TEMP: two hero directions stacked for comparison — keep one, delete the other. */}
      <HeroStudio />

      <div className="flex items-center gap-4 px-[max(1.5rem,4vw)] py-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-carbon/40">
        <span className="h-px flex-1 bg-carbon/10" />
        Variant B — split editorial
        <span className="h-px flex-1 bg-carbon/10" />
      </div>
      <HeroEditorial />

      {/* Product collection — editorial layout, not generic cards */}
      <section id="models" className="mx-auto max-w-7xl px-8 py-20">
        <h2 className="mb-4 font-display text-3xl font-semibold text-carbon lg:text-4xl">
          The lineup
        </h2>

        <ProductCard
          name="MOVE ON X1"
          words={["Urban.", "Agile.", "Effortless."]}
          image="/scooters/x1.png"
          range="150 KM"
          topSpeed="80 KM/H"
        />

        <ProductCard
          name="MOVE ON X2"
          words={["Bolder.", "Faster.", "Further."]}
          image="/scooters/x2.png"
          range="190 KM"
          topSpeed="95 KM/H"
          reversed
        />

        <ProductCard
          name="MOVE ON PRO"
          words={["Performance.", "Refined."]}
          image="/scooters/pro.png"
          range="220 KM"
          topSpeed="110 KM/H"
        />
      </section>

      {/* Specification section — large numbers, thin dividers */}
      <section
        id="technology"
        className="border-t border-carbon/10 bg-mist py-20"
      >
        <div className="mx-auto max-w-7xl px-8">
          <h2 className="mb-10 font-display text-3xl font-semibold text-carbon lg:text-4xl">
            Built to perform
          </h2>

          <div className="grid grid-cols-2 gap-x-8 lg:grid-cols-4">
            <StatBlock value={150} suffix="KM" label="True range" />
            <StatBlock value={80} suffix="KM/H" label="Top speed" />
            <StatBlock value={4.2} suffix="SEC" label="0–40 km/h" decimals={1} />
            <StatBlock value={4.5} suffix="H" label="Charge time" decimals={1} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-carbon py-24 text-center text-white">
        <h2 className="mx-auto mb-6 max-w-xl font-display text-4xl font-semibold lg:text-5xl">
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