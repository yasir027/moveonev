import { ShieldCheck } from "lucide-react";
import type { PostMeta } from "@/lib/blogs";
import { A, Figure, H2, H3, LI, Note, P, Pullquote, Strong, UL } from "@/components/blog/ArticleParts";

/* DUMMY ARTICLE: replace the text with your own. */

export const meta: PostMeta = {
  slug: "what-is-an-lfp-battery",
  title: "What is an LFP battery, and why does it matter?",
  excerpt:
    "Lithium iron phosphate is the chemistry inside every XIDAA pack. What it is, and what it means for you.",
  category: "Technology",
  date: "2026-10-14",
  readMin: 4,
  icon: ShieldCheck,
};

export default function Body() {
  return (
    <>
      <P>
        LFP stands for <Strong>lithium iron phosphate</Strong>. It is a type of lithium-ion battery
        chemistry, and it is the one XIDAA uses in its 60V scooter packs.
      </P>

      <Figure
        src="/Battery.png"
        alt="XIDAA 60V lithium LFP battery pack"
        caption="A XIDAA 60V LFP battery pack."
      />

      <H2>Why LFP suits a scooter</H2>
      <UL>
        <LI>
          <Strong>Stable under heat:</Strong> LFP cells tolerate high temperatures better than many
          other lithium chemistries, which matters in a hot climate.
        </LI>
        <LI>
          <Strong>Long life:</Strong> XIDAA rates its packs for 2000 charge cycles.
        </LI>
        <LI>
          <Strong>Steady output:</Strong> power stays consistent through most of the charge.
        </LI>
      </UL>

      <Pullquote>Safety and cycle life matter more than shaving a few hundred grams.</Pullquote>

      <H2>The trade-off</H2>
      <P>
        LFP packs store a little less energy for their weight than some other lithium types. For a
        scooter, that is a fair trade.
      </P>

      <H2>What the smart BMS does</H2>
      <P>
        A battery management system (BMS) is the pack&rsquo;s brain. XIDAA&rsquo;s smart BMS
        watches the voltage and temperature of the cells.
      </P>
      <H3>Active balancing</H3>
      <P>
        The J.K. active balancer keeps every cell at the same level, so no single cell is
        overworked.
      </P>

      <H2>Built to be checked</H2>
      <P>
        Each pack has a QR code. Scan it with the JK BMS app (free on the Google Play Store) to see
        live voltage, cell health, temperature and charging status. For more, see the{" "}
        <A href="/technology">technology page</A>.
      </P>

      <Note>
        XIDAA packs are fire and heat proof, IP67 water resistant, laser welded and use pure nickel
        strips.
      </Note>
    </>
  );
}
