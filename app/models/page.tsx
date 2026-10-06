import type { Metadata } from "next";
import { ModelsBrowser } from "@/components/models/ModelsBrowser";
import {GetInTouchSection} from "@/components/GetInTouch";

export const metadata: Metadata = {
  title: "Models | MOVE ON",
  description:
    "Eight electric scooters, no licence and no RTO registration. Filter by price, battery and finish.",
};

export default function ModelsPage() {
  return (
    <main>
      <ModelsBrowser />
      <GetInTouchSection/>

    </main>
  );
}