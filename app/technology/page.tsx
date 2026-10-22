import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { LineupSection } from "@/components/LineupSection";
import {
  Bike,
  BatteryCharging,
  BellRing,
  Bluetooth,
  Check,
  CircleDot,
  CreditCard,
  Cpu,
  Droplets,
  Flame,
  Gauge,
  KeyRound,
  Layers,
  ParkingCircle,
  Radio,
  RotateCw,
  Scale,
  ShieldCheck,
  Smartphone,
  Usb,
  Watch,
  Zap,
  ArrowLeftRight,
  type LucideIcon,
} from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/heroModels";

/*
 * /technology — one page, five blocks: hero, battery, motor + controller,
 * charging + app, smart ride. Icons and text carry it; the only photos are the battery
 * pack and the battery-app screenshot.
 *
 * Server component, no client JS. Every figure is from the XIDAA catalogue.
 */

export const metadata: Metadata = {
  title: "Technology | MOVE ON",
  description:
    "What's inside a XIDAA electric scooter: 60V lithium LFP battery with smart BMS, BLDC motor and controller, fast chargers, battery health app and smart ride features.",
  alternates: { canonical: "/technology" },
  openGraph: {
    title: "Technology | MOVE ON",
    description:
      "60V lithium LFP battery, smart BMS, BLDC motor, fast chargers and smart ride features.",
    url: "/technology",
  },
};

/* ---------------------------------------------------------------------------------
   Content
--------------------------------------------------------------------------------- */

const STATS = [
  { value: "60V", label: "LFP lithium battery" },
  { value: "2000", label: "Charge cycles" },
  { value: "IP67", label: "Water protection" },
  { value: "2+1 yrs", label: "Battery warranty" },
];

const PROTECTION: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Flame, title: "Fire / heat proof", body: "LFP cells stay stable under heat." },
  { icon: Droplets, title: "IP67 waterproof", body: "Sealed against rain and splashes." },
  { icon: Zap, title: "Laser welding", body: "Strong, low-resistance cell joints." },
  { icon: Layers, title: "Pure nickel strips", body: "Even current across the pack." },
  { icon: Scale, title: "J.K. active balancer", body: "Keeps every cell at the same level." },
  { icon: RotateCw, title: "2000 life cycles", body: "Built for years of daily charging." },
];

const MOTOR_POINTS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Gauge,
    title: "BLDC heavy-duty motor",
    body: "Brushless, so there is nothing to wear out. 1000W on X Single and Double Light, 1200 / 1500W on the other models.",
  },
  {
    icon: Cpu,
    title: "Matched controller",
    body: "Manages power from the battery to the motor, smooth off the line. Motor and controller carry 2 years of warranty.",
  },
  {
    icon: CircleDot,
    title: "Disc brake, 25 km/h",
    body: "Front disc brake, tubeless tyres and a 150 kg load capacity, tuned for steady city riding.",
  },
];

const SMART: { icon: LucideIcon; title: string }[] = [
  { icon: KeyRound, title: "Key start" },
  { icon: Radio, title: "Remote start" },
  { icon: CreditCard, title: "NFC smart card" },
  { icon: Watch, title: "NFC smart watch" },
  { icon: BellRing, title: "Anti-theft alarm" },
  { icon: Bike, title: "Side stand sensor" },
  { icon: ParkingCircle, title: "Parking switch" },
  { icon: ArrowLeftRight, title: "Reverse gear" },
  { icon: Usb, title: "USB charging" },
  { icon: Gauge, title: "Cruise control (optional)" },
  { icon: Bluetooth, title: "In-built Bluetooth speaker" },
  { icon: ShieldCheck, title: "All-in-one tool kit" },
];

/* ---------------------------------------------------------------------------------
   Page
--------------------------------------------------------------------------------- */

export default function TechnologyPage() {
  const whatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi, I'd like to know more about the technology in your electric scooters.",
  )}`;

  return (
    <main className="bg-white pb-20 pt-[88px]">
      {/* 1 — HERO */}
      <section className="px-[7%] pb-12 pt-12 lg:pb-14 lg:pt-16">
        <Eyebrow>Technology</Eyebrow>
        <h1 className="max-w-[18ch] font-display text-[clamp(2.25rem,4.2vw,3.75rem)] font-bold leading-[1.02] tracking-[-0.035em] text-carbon">
          Built around the battery.
        </h1>
        <p className="mt-5 max-w-[58ch] text-[17px] leading-relaxed text-[#475569]">
          Every MOVE ON scooter runs on XIDAA&rsquo;s lithium LFP battery with a smart BMS, a
          heavy-duty BLDC motor and a controller made to work together. Here is what that means
          on the road.
        </p>

        <dl className="mt-10 grid grid-cols-2 border-y border-carbon/10 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={[
                "py-6 lg:px-8",
                i % 2 === 1 ? "pl-6" : "",
                i > 0 ? "lg:border-l lg:border-carbon/10" : "lg:pl-0",
                i > 1 ? "border-t border-carbon/10 lg:border-t-0" : "",
              ].join(" ")}
            >
              <dd className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold leading-none tracking-[-0.04em] text-carbon">
                {s.value}
              </dd>
              <dt className="mt-2 text-[14px] text-[#475569]">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* 2 — THE BATTERY */}
      <section className="mx-[7%] border-t border-carbon/10 py-12 lg:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div>
            <Eyebrow>The battery</Eyebrow>
            <H2>LFP lithium, the safer chemistry.</H2>
            <p className="mt-4 max-w-[56ch] text-[16px] leading-relaxed text-[#475569]">
              LFP (lithium iron phosphate) cells are known for staying stable under heat and for
              a long life. Each pack has a smart BMS that watches every cell and keeps the pack
              balanced, so it lasts and stays safe.
            </p>

            <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {PROTECTION.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4">
                  <IconChip>
                    <Icon size={20} strokeWidth={2.25} aria-hidden />
                  </IconChip>
                  <div>
                    <h3 className="font-display text-[16px] font-bold tracking-tight text-carbon">
                      {title}
                    </h3>
                    <p className="mt-0.5 text-[14px] leading-snug text-[#475569]">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[420px]">
            <span aria-hidden className="absolute inset-[8%] rounded-full bg-volt/15" />
            <Image
              src="/Battery.png"
              alt="XIDAA 60V lithium LFP battery pack"
              fill
              sizes="(min-width: 1024px) 34vw, 80vw"
              className="object-contain p-[6%] drop-shadow-[0_18px_18px_rgba(0,0,0,0.18)]"
            />
          </div>
        </div>

        {/* Two packs, as a plain table */}
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left">
            <thead>
              <tr className="border-b border-carbon/15 text-[13px] font-bold uppercase tracking-[0.12em] text-[#475569]">
                <th className="py-3 pr-4 font-display">Pack</th>
                <th className="py-3 pr-4 font-display">Range per charge</th>
                <th className="py-3 font-display">Warranty</th>
              </tr>
            </thead>
            <tbody className="text-[16px] text-carbon">
              {[
                ["60V / 30AH LFP, smart BMS", "70–80 km"],
                ["60V / 45AH LFP, smart BMS", "110–120 km"],
              ].map(([pack, range]) => (
                <tr key={pack} className="border-b border-carbon/10">
                  <td className="py-4 pr-4 font-medium">{pack}</td>
                  <td className="py-4 pr-4 font-display font-bold">{range}</td>
                  <td className="py-4 text-[#475569]">2+1 years / 40,000 km</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-[14px] font-medium text-[#9B0B22]">
            No battery warranty in case of deep discharge.
          </p>
        </div>
      </section>

      {/* 3 — MOTOR + CONTROLLER */}
      <section className="mx-[7%] border-t border-carbon/10 py-12 lg:py-14">
        <Eyebrow>Motor &amp; controller</Eyebrow>
        <H2>Power that doesn&rsquo;t fuss.</H2>

        <ul className="mt-8 grid gap-6 md:grid-cols-3 md:gap-10">
          {MOTOR_POINTS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="border-t border-carbon/15 pt-6">
              <IconChip>
                <Icon size={20} strokeWidth={2.25} aria-hidden />
              </IconChip>
              <h3 className="mt-5 font-display text-[clamp(1.125rem,1.6vw,1.375rem)] font-bold tracking-tight text-carbon">
                {title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#475569]">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 4 — CHARGING + APP */}
      <section className="mx-[7%] border-t border-carbon/10 py-12 lg:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div>
            <Eyebrow>Charging &amp; battery app</Eyebrow>
            <H2>Know your battery, always.</H2>
            <p className="mt-4 max-w-[56ch] text-[16px] leading-relaxed text-[#475569]">
              Pick the charger that fits your routine. The display shows charge percentage,
              charging status and when the battery is full, and the charger carries a 1 year
              warranty.
            </p>

            <dl className="mt-8 divide-y divide-carbon/10 border-y border-carbon/10">
              {[
                ["60V / 6A charger", "4–5 hours"],
                ["60V / 10A charger", "2–3 hours"],
              ].map(([label, time]) => (
                <div key={label} className="flex items-center justify-between gap-6 py-5">
                  <dt className="flex items-center gap-3 text-[16px] font-medium text-carbon">
                    <BatteryCharging size={20} className="text-leaf" aria-hidden />
                    {label}
                  </dt>
                  <dd className="font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-extrabold leading-none tracking-[-0.04em] text-carbon">
                    {time}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex gap-4">
              <IconChip>
                <Smartphone size={20} strokeWidth={2.25} aria-hidden />
              </IconChip>
              <p className="max-w-[48ch] text-[15px] leading-relaxed text-[#475569]">
                <span className="font-display font-bold text-carbon">JK BMS app.</span> Scan the
                QR on the battery and watch live voltage, cell health, temperature and charge
                status from your phone. Free on the Google Play Store.
              </p>
            </div>
          </div>

          {/* Phone frame: the top of the screenshot only, so it reads as a UI, not a data dump. */}
          <div className="relative mx-auto h-[460px] w-[240px] overflow-hidden rounded-[36px] border-[7px] border-carbon bg-carbon shadow-[0_30px_60px_-24px_rgba(16,20,18,0.45)]">
            <Image
              src="/battery-app.png"
              alt="JK BMS battery app showing live voltage, cell data and temperature"
              fill
              sizes="240px"
              className="object-cover object-top"
            />
          </div>
        </div>
      </section>

      {/* 5 — SMART RIDE */}
      <section className="mx-[7%] border-t border-carbon/10 py-12 lg:py-14">
        <Eyebrow>Smart ride</Eyebrow>
        <H2>Start it. Park it. Protect it.</H2>

        <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-4">
          {SMART.map(({ icon: Icon, title }) => (
            <li key={title} className="flex items-center gap-4">
              <IconChip>
                <Icon size={20} strokeWidth={2.25} aria-hidden />
              </IconChip>
              <span className="font-display text-[15px] font-bold leading-tight tracking-tight text-carbon">
                {title}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-8 flex items-center gap-2 text-[14px] text-[#475569]">
          <Check size={16} className="text-leaf" strokeWidth={3} aria-hidden />
          Feature availability can vary by model. Ask us for the sheet for the one you like.
        </p>
      </section>
<LineupSection/>
      {/* CTA */}
      <section
        data-theme="dark"
        className="mx-[7%] mt-6 rounded-[32px] bg-carbon px-8 py-14 text-center lg:py-16"
      >
        <h2 className="font-display text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold tracking-[-0.03em] text-white">
          See it in person.
        </h2>
        <p className="mx-auto mt-4 max-w-[46ch] text-[17px] leading-relaxed text-white/65">
          Book a free test ride, or ask us anything about the battery, charging or warranty.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/#book"
            className="rounded-full bg-volt px-8 py-4 font-display text-[16px] font-bold text-carbon transition-colors duration-200 hover:bg-white"
          >
            Book a test ride
          </Link>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/25 px-8 py-4 font-display text-[16px] font-bold text-white transition-colors duration-200 hover:bg-white/10"
          >
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}

/* ---------------------------------------------------------------------------------
   Pieces
--------------------------------------------------------------------------------- */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 font-display text-[13px] font-bold uppercase tracking-[0.16em] text-leaf">
      {children}
    </p>
  );
}

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="max-w-[26ch] font-display text-[clamp(1.5rem,2.6vw,2.125rem)] font-bold leading-[1.1] tracking-[-0.03em] text-carbon">
      {children}
    </h2>
  );
}

function IconChip({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-volt/25 text-carbon">
      {children}
    </span>
  );
}
