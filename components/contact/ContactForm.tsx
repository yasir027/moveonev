"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";
import { EASE_PREMIUM } from "@/lib/motion";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Field, INPUT, VehiclePeek } from "@/components/GetInTouch";
import { SHOWROOM } from "@/lib/showroom";

const TOPICS = ["Test ride", "Buying a scooter", "Service", "Battery", "Something else"];

/**
 * Web3Forms access key, registered to moveonevmoto@gmail.com: every enquiry is emailed there.
 * The key is meant to sit in the browser (Web3Forms' free plan only takes browser submissions)
 * and lives in .env.local, which git ignores. Setup steps are in the README.
 */
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

const INITIAL = {
  name: "",
  phone: "",
  email: "",
  topic: TOPICS[0],
  message: "",
};

/**
 * The contact page's enquiry form: any question, not just a test ride (that's GetInTouch on
 * the home page). Laid out like GetInTouch — same container, spacing, panel and the scooter
 * rising out of the foot — so the two read as one.
 */
export function ContactFormSection() {
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [botField, setBotField] = useState("");

  function set<K extends keyof typeof INITIAL>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (botField) return;

    if (!WEB3FORMS_KEY) {
      console.warn("Contact form: NEXT_PUBLIC_WEB3FORMS_KEY is not set (see README).");
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Website enquiry: ${form.topic} — ${form.name}`,
          from_name: "MOVE ON website",
          name: form.name,
          phone: form.phone,
          // Web3Forms sets this as the reply-to, so "Reply" in Gmail goes to the customer.
          ...(form.email ? { email: form.email } : {}),
          topic: form.topic,
          message: form.message,
        }),
      });
      const data: { success?: boolean } = await res.json();
      if (!res.ok || !data.success) throw new Error("Web3Forms rejected the enquiry");
      setStatus("sent");
      setForm(INITIAL);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="message"
      data-theme="dark"
      className="relative w-full overflow-x-clip bg-carbon py-16 pb-[150px] text-white sm:pb-[180px] lg:py-24 lg:pb-[100px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 15%, rgb(125 255 64 / 0.16), transparent 62%), radial-gradient(55% 50% at 92% 88%, rgb(0 168 107 / 0.14), transparent 62%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-[7%]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-16">
          {/* Left: the ask */}
          <div className="lg:pt-4">
            <span className="mb-4 block h-px w-10 bg-volt" />
            <span className="mb-4 block font-display text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
              Send us a message
            </span>
            <RevealHeading
              className="text-white"
              lines={["Ask us anything.", <span key="b" className="text-white/30">We&apos;ll call you back.</span>]}
            />

            <Reveal delay={0.25}>
              <p className="mt-6 max-w-[420px] text-base leading-relaxed text-white/60">
                Prices, batteries, servicing or which model suits your ride. Leave your number
                and someone from the showroom will ring you.
              </p>

              <div className="mt-8 flex items-start gap-3.5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.05]">
                  <Clock className="h-3.5 w-3.5 text-volt" strokeWidth={2.5} aria-hidden />
                </span>
                <div>
                  <p className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
                    We call back
                  </p>
                  <p className="mt-0.5 text-[14px] font-medium text-white/80">
                    {SHOWROOM.hours.label}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: the form. Opacity only: a transform here would kill the card's blur. */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: EASE_PREMIUM, delay: 0.08 }}
          >
            <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.02] p-7 shadow-2xl backdrop-blur-md sm:p-10 lg:backdrop-blur-xl">
              {status === "sent" ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex min-h-[420px] flex-col items-center justify-center text-center"
                >
                  <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-volt">
                    <Check className="h-6 w-6 text-carbon" strokeWidth={3} aria-hidden />
                  </span>
                  <h3 className="font-display text-[22px] font-bold tracking-tight text-white">
                    We&apos;ve got it.
                  </h3>
                  <p className="mt-3 max-w-[34ch] text-[14px] leading-relaxed text-white/60">
                    Someone from the showroom will call you within a working day.
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

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="contact-name" label="Full name" className="sm:col-span-2">
                      <input
                        id="contact-name"
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

                    <Field id="contact-phone" label="Phone">
                      <input
                        id="contact-phone"
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

                    <Field id="contact-email" label="Email" hint="Optional">
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        className={INPUT}
                      />
                    </Field>

                    <fieldset className="sm:col-span-2">
                      <legend className="mb-2 font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
                        What&apos;s it about?
                      </legend>
                      <div className="flex flex-wrap gap-2">
                        {TOPICS.map((t) => (
                          <label key={t} className="cursor-pointer">
                            <input
                              type="radio"
                              name="topic"
                              value={t}
                              checked={form.topic === t}
                              onChange={() => set("topic", t)}
                              className="peer sr-only"
                            />
                            <span className="block rounded-full border border-white/[0.12] px-4 py-1.5 text-[13px] font-medium text-white/70 transition-colors duration-300 ease-premium hover:border-white/30 hover:text-white peer-checked:border-volt peer-checked:bg-volt peer-checked:text-carbon peer-focus-visible:ring-2 peer-focus-visible:ring-volt/60">
                              {t}
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <Field id="contact-message" label="Message" className="sm:col-span-2">
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={3}
                        required
                        placeholder="What would you like to know?"
                        value={form.message}
                        onChange={(e) => set("message", e.target.value)}
                        className={`${INPUT} resize-none`}
                      />
                    </Field>
                  </div>

                  {status === "error" && (
                    <p role="alert" className="mt-5 text-[13px] font-medium text-[#FF8080]">
                      That didn&apos;t go through. Try again, or call the showroom directly.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="mt-8 w-full rounded-full bg-volt py-4 font-display text-[13px] font-bold tracking-[0.02em] text-carbon transition-colors duration-300 ease-premium hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "sending" ? "Sending…" : "Send message"}
                  </button>

                  <p className="mt-5 text-center text-[12px] leading-relaxed text-white/30">
                    We use your details to reply to you and nothing else.
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
