"use client";

import { useState } from "react";
import { MODELS } from "@/lib/heroModels";

/** Model + paint selection shared by the hero variants. */
export function useHeroState() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const active = MODELS[activeIndex];

  function selectModel(index: number) {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    setColorIndex(0); // the photo's own colour
  }

  return {
    active,
    activeIndex,
    activeColor: active.colors[colorIndex],
    colorIndex,
    direction,
    selectModel,
    setColorIndex,
  };
}
