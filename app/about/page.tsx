import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BatteryCharging,
  Bike,
  Clock,
  Gauge,
  Heart,
  RotateCw,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/heroModels";
import { CountUp } from "@/components/ui/CountUp";
import { ExpandPanel } from "@/components/ui/ExpandPanel";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal } from "@/components/ui/Reveal";
import { RevealHeading } from "@/components/ui/RevealHeading";

/*
 * /about — one page, everything inside this file: hero with the building photo, stats,
 * story, vision (with the showroom photo), batteries, why choose us, call to action.
 *
 * Photos: /public/SMH.png (building, outside; the capitals matter on a Linux host) and
 * /public/showroom.png (inside).
 * Server component; the motion pieces (Reveal, RevealHeading, CountUp, ExpandPanel,
 * Magnetic) are the home page's, and every reveal plays once.
 *
 * Facts used: Shabbir Medical Hall since 1920; MOVE ON EV MOTO sells XIDAA scooters from
 * the same premises. Battery figures are from the XIDAA catalogue.
 */

export const metadata: Metadata = {
  title: "About us | MOVE ON",
  description:
    "MOVE ON EV MOTO is an authorised XIDAA dealership run from Shabbir Medical Hall, a name trusted since 1920. Genuine electric scooters and batteries, and the freedom to ride without hassle.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About us | MOVE ON",
    description:
      "An authorised XIDAA dealership from Shabbir Medical Hall, trusted since 1920.",
    url: "/about",
    images: ["/SMH.png"],
  },
};

const SITE = "https://moveonevmoto.com";

/** `count` marks the figures that count up as they appear (not the year: "since 0" reads oddly). */
const STATS: { value: string; label: string; count?: { to: number; suffix?: string } }[] = [
  { value: "1920", label: "Serving customers since" },
  { value: "100%", label: "Genuine XIDAA products", count: { to: 100, suffix: "%" } },
  { value: "Free", label: "Test rides, no pressure" },
];

const BELIEFS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: BadgeCheck,
    title: "Genuine products only",
    body: "Every scooter, battery and charger we sell is a genuine XIDAA product, sold with its full warranty.",
  },
  {
    icon: Heart,
    title: "Honest advice",
    body: "If a smaller battery suits your daily ride better, we will tell you, even when it is the cheaper one.",
  },
  {
    icon: Clock,
    title: "Trust that lasts",
    body: "We have kept customers for generations. We plan to keep you for just as long.",
  },
];

const BATTERY_POINTS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: ShieldCheck,
    title: "LFP lithium, smart BMS",
    body: "Fire and heat proof, IP67 water resistant, laser welded.",
  },
  {
    icon: RotateCw,
    title: "2000 charge cycles",
    body: "Built for years of daily charging.",
  },
  {
    icon: Gauge,
    title: "70–120 km per charge",
    body: "60V 30AH for 70–80 km, 60V 45AH for 110–120 km.",
  },
];

const WHY: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: BadgeCheck,
    title: "Authorised XIDAA dealership",
    body: "Official products, backed by the manufacturer.",
  },
  {
    icon: BatteryCharging,
    title: "Genuine batteries",
    body: "2+1 year battery warranty, 2 years on motor and controller.",
  },
  {
    icon: Clock,
    title: "A century of trust",
    body: "A business with over 100 years behind its name.",
  },
  {
    icon: Bike,
    title: "Free test rides",
    body: "Ride it first. Decide with confidence.",
  },
];

export default function AboutPage() {
  const whatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi, I'd like to visit the showroom and know more about your electric scooters.",
  )}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MOVE ON EV MOTO",
    url: SITE,
    parentOrganization: {
      "@type": "Organization",
      name: "Shabbir Medical Hall",
      foundingDate: "1920",
    },
  };

  return (
    <main className="bg-white pt-[88px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1 — HERO */}
      <section className="px-[7%] pb-12 pt-2 sm:pt-12 lg:pb-14 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <Eyebrow>About us</Eyebrow>
            <RevealHeading
              as="h1"
              base="max-w-[14ch] font-display text-[clamp(2.25rem,4.2vw,3.75rem)] font-bold leading-[1.02] tracking-[-0.035em]"
              className="text-carbon"
              lines={["Freedom to ride.", "No hassle."]}
            />
            <Reveal as="p" delay={0.25} className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-[#475569]">
              MOVE ON EV MOTO is an authorised XIDAA dealership, run from Shabbir Medical Hall, a
              name this community has trusted since 1920.
            </Reveal>
            <Reveal delay={0.35} className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Link
                  href="/models"
                  className="inline-flex items-center gap-2 rounded-full bg-carbon px-7 py-3.5 font-display text-[15px] font-bold text-white transition-colors duration-300 hover:bg-leaf"
                >
                  See the scooters
                  <ArrowRight size={16} strokeWidth={2.75} aria-hidden />
                </Link>
              </Magnetic>
              <Link
                href="/#book"
                className="rounded-full border border-carbon/15 px-7 py-3.5 font-display text-[15px] font-bold text-carbon transition-colors duration-200 hover:bg-carbon/5"
              >
                Book a test ride
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="relative aspect-[1312/1199] w-full overflow-hidden rounded-[32px] shadow-[0_0_0_1px_rgba(16,20,18,0.08),0_28px_56px_-24px_rgba(16,20,18,0.35)]">
            <Image
              src="/SMH.png"
              alt="The MOVE ON EV MOTO showroom beside Shabbir Medical Hall, since 1920"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </Reveal>
        </div>

        <dl className="mt-12 grid grid-cols-3 border-y border-carbon/10">
          {STATS.map((s, i) => (
            <Reveal
              key={s.label}
              index={i}
              className={["py-6 pl-4 sm:pl-8", i === 0 ? "!pl-0" : "border-l border-carbon/10"].join(" ")}
            >
              <dd className="font-display text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold leading-none tracking-[-0.04em] text-carbon">
                {s.count ? <CountUp value={s.count.to} suffix={s.count.suffix} /> : s.value}
              </dd>
              <dt className="mt-2 text-[13px] leading-snug text-[#475569] sm:text-[14px]">
                {s.label}
              </dt>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* 2 — OUR STORY */}
      <section className="mx-[7%] border-t border-carbon/10 py-12 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <Eyebrow>Our story</Eyebrow>
            <H2>Built on something older than the scooters.</H2>
          </div>
          <div className="space-y-5 text-[17px] leading-[1.8] text-[#334155]">
            <Reveal as="p" index={0} delay={0.15}>
              MOVE ON EV MOTO is our electric scooter business, and it stands on something much
              older than the scooters themselves.
            </Reveal>
            <Reveal as="p" index={1} delay={0.15}>
              Shabbir Medical Hall has been serving customers since 1920. For over a century,
              people have come to us because we sell what is genuine and tell them the truth.
              When electric mobility started to make real sense for everyday riders, we decided to
              bring the same standard to it.
            </Reveal>
            <Reveal as="p" index={2} delay={0.15}>
              Today we sell XIDAA electric scooters under the MOVE ON EV MOTO name, from the same
              premises, with the same promise: what you buy from us is the real thing, and we
              stand behind it.
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3 — VISION + BELIEFS, with the showroom photo */}
      <section className="mx-[7%] border-t border-carbon/10 py-12 lg:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal className="relative aspect-[3/2] w-full overflow-hidden rounded-[32px] shadow-[0_0_0_1px_rgba(16,20,18,0.08),0_28px_56px_-24px_rgba(16,20,18,0.3)]">
            <Image
              src="/showroom.png"
              alt="Inside the MOVE ON EV MOTO showroom, with a row of XIDAA electric scooters"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </Reveal>

          <div>
            <Eyebrow>Our vision</Eyebrow>
            <H2>Freedom to ride without any hassle.</H2>
            <Reveal as="p" delay={0.2} className="mt-4 max-w-[52ch] text-[16px] leading-relaxed text-[#475569]">
              No queue at the petrol pump, no engine to service, no gear to learn. You get on,
              start it with a key, remote or NFC card, and go. We want every rider to feel that
              freedom from the first day, and keep feeling it for years.
            </Reveal>

            <ul className="mt-8 space-y-6">
              {BELIEFS.map(({ icon: Icon, title, body }, i) => (
                <Reveal as="li" key={title} index={i} className="group flex gap-4">
                  <IconChip>
                    <Icon size={20} strokeWidth={2.25} aria-hidden />
                  </IconChip>
                  <div>
                    <h3 className="font-display text-[17px] font-bold tracking-tight text-carbon">
                      {title}
                    </h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-[#475569]">{body}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4 — THE BATTERIES */}
      <section className="mx-[7%] border-t border-carbon/10 py-12 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <Eyebrow>The batteries</Eyebrow>
            <H2>Powerful, long-lasting, and exactly what the label says.</H2>
            <Reveal delay={0.2}>
              <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-[#475569]">
                The battery is the heart of an electric scooter, and it is where we are most
                particular. Every XIDAA pack is genuine, with the manufacturer&rsquo;s warranty.
              </p>
              <Link
                href="/technology"
                className="group mt-6 inline-flex items-center gap-2 font-display text-[15px] font-bold text-leaf transition-colors hover:text-carbon"
              >
                See the technology
                <ArrowRight
                  size={16}
                  strokeWidth={2.75}
                  aria-hidden
                  className="transition-transform duration-300 ease-premium group-hover:translate-x-1"
                />
              </Link>
            </Reveal>
          </div>

          <ul className="divide-y divide-carbon/10 border-y border-carbon/10">
            {BATTERY_POINTS.map(({ icon: Icon, title, body }, i) => (
              <Reveal as="li" key={title} index={i} className="group flex gap-4 py-5">
                <IconChip>
                  <Icon size={20} strokeWidth={2.25} aria-hidden />
                </IconChip>
                <div>
                  <h3 className="font-display text-[17px] font-bold tracking-tight text-carbon">
                    {title}
                  </h3>
                  <p className="mt-1 text-[15px] text-[#475569]">{body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 5 — WHY CHOOSE US */}
      <section className="mx-[7%] border-t border-carbon/10 py-12 lg:py-14">
        <Eyebrow>Why choose us</Eyebrow>
        <H2>Four reasons riders stay with us.</H2>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {WHY.map(({ icon: Icon, title, body }, i) => (
            <Reveal as="li" key={title} index={i} className="group border-t border-carbon/15 pt-6">
              <IconChip>
                <Icon size={20} strokeWidth={2.25} aria-hidden />
              </IconChip>
              <h3 className="mt-5 font-display text-[clamp(1.0625rem,1.5vw,1.25rem)] font-bold tracking-tight text-carbon">
                {title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#475569]">{body}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* CLOSING CTA — dark, opening from an inset panel to full width as it scrolls in (like
          the model pages), and running straight on into the dark footer. */}
      <ExpandPanel gutterClassName="bg-white">
        <section data-theme="dark" className="relative bg-carbon px-8 py-16 text-center lg:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 50% at 20% 15%, rgb(125 255 64 / 0.16), transparent 62%), radial-gradient(55% 50% at 92% 88%, rgb(0 168 107 / 0.14), transparent 62%)",
            }}
          />
          <div className="relative">
            <RevealHeading
              base="font-display text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold tracking-[-0.03em]"
              className="text-white"
              lines={["Come and ride one."]}
            />
            <Reveal
              as="p"
              delay={0.25}
              className="mx-auto mt-4 max-w-[46ch] text-[17px] leading-relaxed text-white/65"
            >
              Visit us at Shabbir Medical Hall, book a free test ride, or message us on WhatsApp.
            </Reveal>
            <Reveal delay={0.35} className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Magnetic>
                <Link
                  href="/#book"
                  className="inline-block rounded-full bg-volt px-8 py-4 font-display text-[16px] font-bold text-carbon transition-colors duration-200 hover:bg-white"
                >
                  Book a test ride
                </Link>
              </Magnetic>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/25 px-8 py-4 font-display text-[16px] font-bold text-white transition-colors duration-200 hover:bg-white/10"
              >
                Chat on WhatsApp
              </a>
            </Reveal>
          </div>
        </section>
      </ExpandPanel>
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

/** Rises out of its mask the first time it's seen (RevealHeading), at this page's h2 size. */
function H2({ children }: { children: ReactNode }) {
  return (
    <RevealHeading
      base="max-w-[26ch] font-display text-[clamp(1.5rem,2.6vw,2.125rem)] font-bold leading-[1.1] tracking-[-0.03em]"
      className="text-carbon"
      lines={[children]}
    />
  );
}

/** Fills with solid volt when its `group` parent is hovered. */
function IconChip({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-volt/25 text-carbon transition-colors duration-300 ease-premium group-hover:bg-volt">
      {children}
    </span>
  );
}
