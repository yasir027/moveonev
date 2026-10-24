import Link from "next/link";

/*
 * The consent bits both website forms share (GetInTouch and the contact page form), on the
 * forms' dark panel. Offers are opt-in: the box starts unticked, as the Privacy Policy says.
 */

export function OffersCheckbox({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="mt-6 flex cursor-pointer items-start gap-3 text-[13px] leading-snug text-white/65">
      <input
        id={id}
        name="offers"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[#7DFF40]"
      />
      <span>
        Send me offers and new-model updates on WhatsApp. <span className="text-white/40">Optional, and you can stop them any time.</span>
      </span>
    </label>
  );
}

export function PrivacyNote({ purpose }: { purpose: string }) {
  return (
    <p className="mt-5 text-center text-[12px] leading-relaxed text-white/40">
      We use your details to {purpose}. See our{" "}
      <Link href="/privacy" className="text-white/70 underline decoration-white/30 underline-offset-2 transition-colors hover:text-white">
        Privacy Policy
      </Link>
      .
    </p>
  );
}
