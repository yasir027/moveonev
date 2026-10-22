import { Gauge } from "lucide-react";
import type { PostMeta } from "@/lib/blogs";
import { A, Compare, H2, InlineCTA, LI, Note, P, Stats, Strong, UL } from "@/components/blog/ArticleParts";

/* DUMMY ARTICLE: replace the text with your own. Layout pieces show how each part is used. */

export const meta: PostMeta = {
  slug: "30ah-or-45ah-which-battery-to-choose",
  title: "30AH or 45AH: which battery should you choose?",
  excerpt:
    "Both packs share the same chemistry, BMS and warranty. Only the distance changes. Here is a simple way to pick.",
  category: "Buying guide",
  date: "2026-10-18",
  readMin: 4,
  icon: Gauge,
};

export default function Body() {
  return (
    <>
      <P>
        Every XIDAA scooter we sell comes with a choice of two 60V lithium LFP battery packs. They
        use the same chemistry, the same smart BMS and the same warranty. What differs is how far
        you can go on one charge. If you want the full picture of what is inside, read our{" "}
        <A href="/technology">technology page</A>.
      </P>

      <Stats
        items={[
          { value: "70–80 km", label: "60V 30AH per charge" },
          { value: "110–120 km", label: "60V 45AH per charge" },
          { value: "2+1 yrs", label: "Warranty on both" },
        ]}
      />

      <H2>The two packs side by side</H2>
      <Compare
        head={["", "60V 30AH", "60V 45AH"]}
        rows={[
          ["Range per charge", "70–80 km", "110–120 km"],
          ["Battery warranty", "2+1 years / 40,000 km", "2+1 years / 40,000 km"],
          ["Chemistry", "LFP, smart BMS", "LFP, smart BMS"],
        ]}
      />

      <H2>A simple way to choose</H2>
      <P>
        Work out your daily distance, then add a buffer. Ranges are quoted per charge, and real
        distance changes with rider weight, load, speed and road conditions, so don&rsquo;t plan to
        run the battery down to the last kilometre.
      </P>
      <UL>
        <LI>
          <Strong>Up to about 40 km a day:</Strong> the 30AH pack covers it with room to spare.
        </LI>
        <LI>
          <Strong>40 to 70 km a day,</Strong> or you would rather charge every other day: go for
          the 45AH pack.
        </LI>
        <LI>
          <Strong>Deliveries, shared use or long commutes:</Strong> the 45AH pack.
        </LI>
      </UL>

      <Note tone="warn">
        Whichever pack you pick, don&rsquo;t let it drain completely. XIDAA&rsquo;s battery
        warranty does not cover deep discharge.
      </Note>

      <H2>What about price?</H2>
      <P>
        The 45AH pack costs more upfront. The exact difference depends on the model, and you can
        see both prices on each model&rsquo;s page, for example the{" "}
        <A href="/models/x-double-light">X Double Light</A>.
      </P>

      <InlineCTA
        title="Not sure which pack fits your route?"
        href="/#book"
        label="Book a test ride"
      />
    </>
  );
}
