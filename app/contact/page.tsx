import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ArrowUpRight, Clock, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import { ContactFormSection } from "@/components/contact/ContactForm";
import { ExpandPanel } from "@/components/ui/ExpandPanel";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal } from "@/components/ui/Reveal";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { WHATSAPP_NUMBER } from "@/lib/heroModels";
import { SHOWROOM } from "@/lib/showroom";

/*
 * /contact — three ways to reach the showroom, an enquiry form, and a map.
 *
 * Motion is borrowed from the home page, a little of it: RevealHeading / Reveal for the
 * headings and cards (once, the first time they are seen), ExpandPanel opening the dark form
 * panel, the .focus-siblings veil on the contact cards, and Magnetic on the directions
 * button. All of it falls back for reduced motion.
 */

export const metadata: Metadata = {
  title: "Contact us | MOVE ON",
  description:
    "Call, WhatsApp or visit the MOVE ON showroom at Shabbir Medical Hall, Afzal Gunj, Hyderabad. Open Mon–Sat, 10am – 8pm.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact us | MOVE ON",
    description: "Call, WhatsApp or visit the MOVE ON showroom in Afzal Gunj, Hyderabad.",
    url: "/contact",
  },
};

const WHATSAPP = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi MOVE ON, I have a question about your electric scooters.",
)}`;

const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(
  `Shabbir Medical Hall, ${SHOWROOM.area}, ${SHOWROOM.city}`,
)}&output=embed`;

const WAYS: { icon: LucideIcon; label: string; value: ReactNode; note: string; href: string; external?: boolean }[] = [
  {
    icon: Phone,
    label: "Call",
    value: SHOWROOM.phone.display,
    note: SHOWROOM.hours.label,
    href: `tel:${SHOWROOM.phone.tel}`,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Message us",
    note: "Chat with the showroom",
    href: WHATSAPP,
    external: true,
  },
  {
    icon: MapPin,
    label: "Visit",
    value: SHOWROOM.addressLines[0],
    note: SHOWROOM.addressLines[1],
    href: SHOWROOM.mapsUrl,
    external: true,
  },
];

export default function ContactPage() {
  return (
    <main className="bg-white pt-[88px]">
      {/* 1 — HERO + ways to reach us */}
      <section className="px-[7%] pb-16 pt-12 lg:pb-20 lg:pt-16">
        <Eyebrow>Contact us</Eyebrow>
        <RevealHeading
          as="h1"
          className="text-carbon"
          lines={["Talk to us.", <span key="b" className="text-carbon/30">We&apos;re just round the corner.</span>]}
        />
        <Reveal delay={0.25}>
          <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-[#475569]">
            Questions about a model, a battery or a service? Call, message or drop in at the
            showroom in Afzal Gunj.
          </p>
        </Reveal>

        <div className="focus-siblings mt-10 grid gap-4 sm:grid-cols-3 lg:mt-12 lg:gap-6">
          {WAYS.map(({ icon: Icon, label, value, note, href, external }, i) => (
            <Reveal key={label} index={i} delay={0.15}>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group relative flex h-full flex-col rounded-[24px] border border-carbon/10 bg-white p-6 shadow-[0_20px_40px_-15px_rgba(16,20,18,0.06)] transition-all duration-500 ease-premium hover:-translate-y-1 hover:shadow-[0_30px_60px_-15px_rgba(16,20,18,0.12)] lg:p-7"
              >
                <span aria-hidden className="focus-veil" />
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-volt/25 text-carbon">
                    <Icon size={20} strokeWidth={2.25} aria-hidden />
                  </span>
                  <ArrowUpRight
                    size={20}
                    aria-hidden
                    className="text-carbon/30 transition-all duration-300 ease-premium group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-carbon"
                  />
                </div>
                <p className="mt-8 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-carbon/45">
                  {label}
                </p>
                <p className="mt-1.5 font-display text-[clamp(1.125rem,1.6vw,1.375rem)] font-bold tracking-tight text-carbon">
                  {value}
                </p>
                <p className="mt-1 text-[14px] text-[#475569]">{note}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 2 — ENQUIRY FORM, opening out of an inset panel */}
      <ExpandPanel gutterClassName="bg-white">
        <ContactFormSection />
      </ExpandPanel>

      {/* 3 — FIND US */}
      <section className="px-[7%] py-16 lg:py-20">
        <Eyebrow>Find us</Eyebrow>
        <RevealHeading className="text-carbon" lines={["Afzal Gunj, old city."]} />

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-end lg:gap-12">
          <Reveal>
            <div className="overflow-hidden rounded-[24px] border border-carbon/10 bg-mist">
              <iframe
                src={MAP_EMBED}
                title={`Map showing ${SHOWROOM.name}, ${SHOWROOM.addressLines.join(", ")}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-[320px] w-full border-0 sm:h-[400px]"
              />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <ul className="divide-y divide-carbon/10 border-y border-carbon/10">
              <InfoRow icon={MapPin} label="Address">
                {SHOWROOM.addressLines[0]},<br />
                {SHOWROOM.addressLines[1]}
              </InfoRow>
              <InfoRow icon={Clock} label="Open">
                {SHOWROOM.hours.label}
              </InfoRow>
              <InfoRow icon={Phone} label="Phone">
                <a href={`tel:${SHOWROOM.phone.tel}`} className="transition-colors hover:text-leaf">
                  {SHOWROOM.phone.display}
                </a>
              </InfoRow>
            </ul>

            <Magnetic className="mt-8">
              <a
                href={SHOWROOM.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-carbon px-7 py-4 font-display text-[15px] font-bold text-white transition-colors duration-300 ease-premium hover:bg-volt hover:text-carbon"
              >
                Get directions
                <ArrowUpRight
                  size={18}
                  aria-hidden
                  className="transition-transform duration-300 ease-premium group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </Magnetic>
          </Reveal>
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

function InfoRow({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
  return (
    <li className="flex items-start gap-4 py-5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-volt/25 text-carbon">
        <Icon size={16} strokeWidth={2.25} aria-hidden />
      </span>
      <div>
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-carbon/45">
          {label}
        </p>
        <p className="mt-1 text-[15px] font-medium leading-snug text-carbon">{children}</p>
      </div>
    </li>
  );
}
