"use client";

import { useEffect, useState } from "react";
import { finishLoader, readLoaderVariant, type LoaderVariant } from "@/lib/intro/loader";
import { BrandIntro } from "./BrandIntro";

/**
 * Picks the loader for this page load. The choice itself is made before first paint by
 * LOADER_BOOT_SCRIPT (see lib/intro/loader.ts); this component plays it.
 */
export function BrandLoader() {
  const [variant, setVariant] = useState<LoaderVariant | null>(null);

  useEffect(() => {
    const v = readLoaderVariant();
    if (v === "fade") {
      // The CSS fade is already running; hand back once it's done.
      const t = setTimeout(finishLoader, 320);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the variant is only known in the browser
    setVariant(v);
  }, []);

  const done = () => setVariant(null);

  return (
    <>
      {/* Covers the page from first paint until the loader below takes over. */}
      <div className="brand-cover" aria-hidden="true" />
      {(variant === "home" || variant === "page") && <BrandIntro onDone={done} />}
    </>
  );
}
