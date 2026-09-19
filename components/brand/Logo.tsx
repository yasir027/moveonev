import { useId } from "react";
import {
  LOGO_MARK,
  LOGO_SUB,
  LOGO_SUB_DOT,
  LOGO_VIEWBOX_STR,
  LOGO_WORD,
} from "@/lib/intro/logo";
import { COLORS } from "@/lib/intro/loader";

/** The mark split into its subpaths, so a pen can draw them one after another. */
export const LOGO_MARK_SUBPATHS = LOGO_MARK.split(/(?=M)/)
  .map((s) => s.trim())
  .filter(Boolean);

interface LogoProps {
  className?: string;
  /** "light" = ink wordmark for light backgrounds, "dark" = white wordmark. */
  tone?: "light" | "dark";
  /**
   * Marks this as the header logo: the Logo Assembly docks onto it and route changes
   * recharge it (see BrandLoader and RouteTransition).
   */
  header?: boolean;
}

export function Logo({ className, tone = "light", header = false }: LogoProps) {
  const clipId = "logo-charge-" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const green = tone === "light" ? COLORS.logoGreen : COLORS.volt;
  const word = tone === "light" ? "#111310" : "#FFFFFF";
  const muted = tone === "light" ? "#5E625A" : "#CECECE";

  return (
    <svg
      viewBox={LOGO_VIEWBOX_STR}
      className={className}
      role="img"
      aria-label="MoveOn EV Moto"
      data-brand-logo={header ? "" : undefined}
    >
      <defs>
        <clipPath id={clipId}>
          {/* Header recharge: this rect grows from the bottom of the mark (y 910) upward. */}
          <rect data-logo-charge x="350" y="140" width="770" height="770" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <path d={LOGO_MARK} fill={green} stroke={green} />
      </g>
      <g data-logo-stroke fill="none" stroke={green} strokeWidth="16" opacity="0">
        {LOGO_MARK_SUBPATHS.map((d) => (
          <path key={d.slice(0, 24)} d={d} />
        ))}
      </g>
      <path d={LOGO_WORD[0]} fill={word} />
      <path d={LOGO_WORD[1]} fill={green} />
      <path d={LOGO_SUB[0]} fill={green} stroke={green} strokeWidth="4" />
      <path d={LOGO_SUB[1]} fill={muted} stroke={muted} strokeWidth="3" />
      <circle cx={LOGO_SUB_DOT.cx} cy={LOGO_SUB_DOT.cy} r={LOGO_SUB_DOT.r} fill={green} />
    </svg>
  );
}
