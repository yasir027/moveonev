"use client";

import { useEffect, useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/heroModels";

/* Pre-filled messages. Edit freely. */
const MESSAGE = "Hi MOVE ON, I'd like to know more about your electric scooters.";
const BUBBLE_MESSAGE = "Hi MOVE ON, I'd like to book a free test drive.";
const BUBBLE_TEXT = "Book a test drive, it's free";
const KEY = "wa-bubble-dismissed";

const wa = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

/*
 * Floating WhatsApp button, bottom-right on every page.
 * About 2.5s after load a "1" badge appears on the icon and a message bubble pops up
 * above it. Clicking the bubble, the icon or the × clears both, and they stay away for
 * the rest of the visit. z-40 keeps it under the navbar (z-50) and the model popup (z-60).
 */
export function WhatsAppFloat() {
  const [bubble, setBubble] = useState(false);
  // Starts true so nothing flashes before the sessionStorage check below.
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    let was = false;
    try {
      was = sessionStorage.getItem(KEY) === "1";
    } catch {}
    setDismissed(was);
    if (was) return;
    const t = window.setTimeout(() => setBubble(true), 2500);
    return () => window.clearTimeout(t);
  }, []);

  function dismiss() {
    setBubble(false);
    setDismissed(true);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
  }

  const show = bubble && !dismissed;

  return (
    <div className="fixed bottom-5 right-5 z-40 sm:bottom-6 sm:right-6">
      {/* Message bubble, above the icon */}
      <div
        className={[
          "absolute bottom-full right-0 mb-3 w-max max-w-[240px] transition-all duration-300",
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        ].join(" ")}
      >
        <div className="relative flex items-center gap-2 rounded-2xl bg-white py-3 pl-4 pr-2 shadow-[0_0_0_1px_rgba(16,20,18,0.08),0_16px_36px_-12px_rgba(16,20,18,0.35)]">
          <a
            href={wa(BUBBLE_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismiss}
            className="font-display text-[15px] font-bold leading-snug text-carbon"
          >
            {BUBBLE_TEXT}
          </a>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#64748B] transition-colors hover:bg-carbon/5 hover:text-carbon"
          >
            ×
          </button>
          {/* Tail, pointing at the icon */}
          <span
            aria-hidden
            className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 bg-white shadow-[2px_2px_3px_-1px_rgba(16,20,18,0.15)]"
          />
        </div>
      </div>

      {/* The button */}
      <a
        href={wa(MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={dismiss}
        aria-label="Chat with us on WhatsApp"
        className="group relative flex items-center rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.6)] transition-transform duration-300 hover:scale-105"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-7 w-7 shrink-0">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        <span className="max-w-0 overflow-hidden whitespace-nowrap font-display text-[15px] font-bold opacity-0 transition-all duration-300 group-hover:ml-2.5 group-hover:max-w-[160px] group-hover:opacity-100">
          Chat with us
        </span>

        {/* Notification badge */}
        <span
          aria-hidden
          className={[
            "absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E11D48] font-display text-[11px] font-bold text-white ring-2 ring-white transition-transform duration-300",
            show ? "scale-100" : "scale-0",
          ].join(" ")}
        >
          1
        </span>
      </a>
    </div>
  );
}