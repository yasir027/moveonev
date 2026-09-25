"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown, Phone, MapPin, Clock, Check } from "lucide-react";
import { EASE_PREMIUM } from "@/lib/motion";
import { RevealHeading } from "@/components/ui/RevealHeading";

const MODELS = [
  "X Double Light",
  "X-Torvo",
  "X-Robox",
  "X-Lambretta",
  "X-ORL Cheetah",
  "X-E4",
  "X-FH",
  "X-Ozone",
];

const CTA_VEHICLE: string | null = "/CTABike.png";

const INITIAL = {
  name: "",
  email: "",
  phone: "",
  model: "",
  query: "",
};

export function GetInTouchSection() {
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [botField, setBotField] = useState("");

  function set<K extends keyof typeof INITIAL>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (botField) return;

    setStatus("sending");
    try {
      await new Promise((r) => setTimeout(r, 600));
      setStatus("sent");
      setForm(INITIAL);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="book"
      data-theme="dark"
      className={[
        "relative w-full overflow-x-clip bg-carbon py-16 text-white lg:py-24",
        CTA_VEHICLE ? "pb-[150px] sm:pb-[180px] lg:pb-[100px]" : "",
      ].join(" ")}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 15%, rgb(125 255 64 / 0.16), transparent 62%), radial-gradient(55% 50% at 92% 88%, rgb(0 168 107 / 0.14), transparent 62%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1240px] px-5 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-16">
          {/* Left: the ask */}
          <div className="lg:pt-4">
            <span className="mb-4 block h-px w-10 bg-volt" />
            <span className="mb-4 block font-display text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
              Get in touch
            </span>
            <RevealHeading
              className="text-white"
              lines={["Book a test ride.", <span key="b" className="text-white/30">Ride it first.</span>]}
            />

            {/* The copy follows the heading in, rather than arriving with it. */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.55, ease: EASE_PREMIUM, delay: 0.25 }}
            >
            <p className="mt-6 max-w-[420px] text-base leading-relaxed text-white/60">
              Tell us which model you have your eye on and we&apos;ll have it
              charged and waiting. No paperwork, no licence — just turn up.
            </p>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <Detail icon={Phone} label="Call or WhatsApp">
                +91 00000 00000
              </Detail>
              <Detail icon={MapPin} label="Showroom">
                Add the street address here
              </Detail>
              <Detail icon={Clock} label="Open">
                Mon–Sat, 10am – 8pm
              </Detail>
            </ul>
            </motion.div>
          </div>

          {/* Right: the form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.55, ease: EASE_PREMIUM, delay: 0.08 }}
          >
            {/* Refined Panel: Replaced hard inset shadows with a soft border, backdrop blur, and slightly softer curves */}
            <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.02] p-7 shadow-2xl backdrop-blur-xl sm:p-10">
              {status === "sent" ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex min-h-[420px] flex-col items-center justify-center text-center"
                >
                  <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-volt">
                    <Check
                      className="h-6 w-6 text-carbon"
                      strokeWidth={3}
                      aria-hidden
                    />
                  </span>
                  <h3 className="font-display text-[22px] font-bold tracking-tight text-white">
                    We&apos;ve got it.
                  </h3>
                  <p className="mt-3 max-w-[34ch] text-[14px] leading-relaxed text-white/60">
                    Someone from the showroom will call you within a working day
                    to fix a time.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-7 rounded-full border border-white/20 px-6 py-2.5 font-display text-[12px] font-bold text-white transition-colors duration-300 ease-premium hover:border-white/50 hover:bg-white/5"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    value={botField}
                    onChange={(e) => setBotField(e.target.value)}
                    className="pointer-events-none absolute h-0 w-0 opacity-0"
                  />

                  {/* Increased gap from gap-4 to gap-5 for elegance */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="name" label="Full name" className="sm:col-span-2">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        className={INPUT}
                      />
                    </Field>

                    <Field id="email" label="Email">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        className={INPUT}
                      />
                    </Field>

                    <Field id="phone" label="Phone">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="Mobile number"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        className={INPUT}
                      />
                    </Field>

                    <Field id="model" label="Model" className="sm:col-span-2">
                      <div className="relative">
                        <select
                          id="model"
                          name="model"
                          required
                          value={form.model}
                          onChange={(e) => set("model", e.target.value)}
                          className={`${INPUT} appearance-none pr-11 ${
                            form.model ? "" : "text-white/40"
                          }`}
                        >
                          <option value="" disabled>
                            Choose a model
                          </option>
                          {MODELS.map((m) => (
                            <option key={m} value={m} className="text-carbon">
                              {m}
                            </option>
                          ))}
                          <option value="Not sure yet" className="text-carbon">
                            Not sure yet — recommend one
                          </option>
                        </select>
                        <ChevronDown
                          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
                          aria-hidden
                        />
                      </div>
                    </Field>

                    <Field
                      id="query"
                      label="Queries"
                      hint="Optional"
                      className="sm:col-span-2"
                    >
                      <textarea
                        id="query"
                        name="query"
                        rows={4}
                        placeholder="Anything you'd like to know before you ride"
                        value={form.query}
                        onChange={(e) => set("query", e.target.value)}
                        className={`${INPUT} resize-none`}
                      />
                    </Field>
                  </div>

                  {status === "error" && (
                    <p
                      role="alert"
                      className="mt-5 text-[13px] font-medium text-[#FF8080]"
                    >
                      That didn&apos;t go through. Try again, or call the
                      showroom directly.
                    </p>
                  )}

                  {/* Refined Button: Taller padding, smoother hover transition */}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="mt-8 w-full rounded-full bg-volt py-4 font-display text-[13px] font-bold tracking-[0.02em] text-carbon transition-all duration-300 ease-premium hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "sending" ? "Sending…" : "Book my test ride"}
                  </button>

                  <p className="mt-5 text-center text-[12px] leading-relaxed text-white/30">
                    We use your details to arrange the ride and nothing else.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <VehiclePeek />
    </section>
  );
}

/* Refined Input Skin: Replaced hard inset shadows with a clean border, added slightly more padding, and a glowing ring on focus. */
const INPUT =
  "w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3.5 text-[14px] text-white placeholder:text-white/30 outline-none transition-all duration-300 ease-out focus:bg-white/[0.08] focus:border-volt/50 focus:ring-1 focus:ring-volt/50";

function VehiclePeek() {
  if (!CTA_VEHICLE) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[210px] overflow-hidden sm:h-[280px] lg:h-[400px]"
    >
      {/* Adjusted the large screen (lg) top positioning from -top-[10px] to top-[20px] to bring it down a fraction */}
      <Image
        src={CTA_VEHICLE}
        alt=""
        width={1400}
        height={1000}
        className="absolute -top-[30px] left-[2%] h-[360px] w-auto object-contain sm:-top-[40px] sm:left-[4%] sm:h-[470px] lg:top-[20px] lg:left-[1%] lg:h-[660px]"
      />
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  className = "",
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 flex items-baseline gap-2 font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45"
      >
        {label}
        {hint && (
          <span className="font-body text-[10px] font-normal normal-case tracking-normal text-white/30">
            {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Phone;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3.5">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.08]">
        <Icon className="h-3.5 w-3.5 text-volt" strokeWidth={2.5} aria-hidden />
      </span>
      <div>
        <p className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
          {label}
        </p>
        <p className="mt-0.5 text-[14px] font-medium text-white/80">
          {children}
        </p>
      </div>
    </li>
  );
}