import { BatteryCharging } from "lucide-react";
import type { PostMeta } from "@/lib/blogs";
import { A, Compare, H2, InlineCTA, LI, Note, P, Strong, UL } from "@/components/blog/ArticleParts";

/* DUMMY ARTICLE: replace the text with your own. */

export const meta: PostMeta = {
  slug: "charging-your-electric-scooter-the-right-way",
  title: "Charging your electric scooter the right way",
  excerpt:
    "Which charger to use, how long it takes and the habits that keep your battery healthy for years.",
  category: "Ownership",
  date: "2026-10-10",
  readMin: 3,
  icon: BatteryCharging,
};

export default function Body() {
  return (
    <>
      <P>A little care with charging goes a long way. Here is what we tell every new owner.</P>

      <H2>Pick the right charger</H2>
      <Compare
        head={["Charger", "Full charge", "Good for"]}
        rows={[
          ["60V / 6A", "4–5 hours", "Overnight charging"],
          ["60V / 10A", "2–3 hours", "Riding more than once a day"],
        ]}
      />
      <P>
        Always use the charger supplied for your scooter. The display shows the charge percentage,
        the charging status and when the battery is full, and the charger carries a{" "}
        <Strong>1 year warranty</Strong>.
      </P>

      <H2>Habits that protect the battery</H2>
      <UL>
        <LI>Charge after your ride instead of waiting until the battery is empty.</LI>
        <LI>
          Never leave the battery fully drained for days. XIDAA&rsquo;s warranty does not cover deep
          discharge.
        </LI>
        <LI>Charge in a shaded, ventilated spot, away from water and direct sun.</LI>
        <LI>
          Glance at the JK BMS app now and then to check cell health. See how in our{" "}
          <A href="/blogs/what-is-an-lfp-battery">LFP battery guide</A>.
        </LI>
      </UL>

      <Note>
        If the scooter will be parked for a long time, leave it with a healthy charge, not empty.
      </Note>

      <InlineCTA title="Want to see the charger in person?" href="/#book" label="Book a test ride" />
    </>
  );
}
