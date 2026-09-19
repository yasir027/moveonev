/**
 * The site-wide loader system (concept v7, Scene 6):
 *
 *   home  first visit, homepage       the full Assembly          ~5.1 s
 *   page  first visit, any other page  the Logo Assembly          ~2.4 s
 *   (route change inside the site)     header logo recharges      ~0.75 s  (RouteTransition)
 *   fade  seen this visit / reduced motion   a plain fade         <= 0.3 s
 *
 * The long intro plays once per visit (sessionStorage). Add ?intro to any URL to replay it.
 */
export type LoaderVariant = "home" | "page" | "fade";

export const LOADER_SEEN_KEY = "moveon:intro-seen";

export const COLORS = {
  volt: "#7DFF40",
  logoGreen: "#4CC51C",
  ink: "#101412",
  night: "#0B0C0A",
  muted: "#8A8E85",
} as const;

/**
 * Runs before first paint (inlined in the root layout) so the right cover is already
 * on screen when the page appears, with no flash of the site underneath.
 */
export const LOADER_BOOT_SCRIPT = `(function(){try{
var d=document.documentElement,l=location;
var force=/[?&]intro(=|&|$)/.test(l.search);
var seen=sessionStorage.getItem(${JSON.stringify(LOADER_SEEN_KEY)});
var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
var v=reduce||(seen&&!force)?"fade":(l.pathname==="/"?"home":"page");
d.setAttribute("data-loader",v);
if(v!=="fade"){if("scrollRestoration" in history)history.scrollRestoration="manual";scrollTo(0,0);}
}catch(e){}})();`;

export function readLoaderVariant(): LoaderVariant | null {
  const v = document.documentElement.getAttribute("data-loader");
  return v === "home" || v === "page" || v === "fade" ? v : null;
}

/** Hands the page back: marks the visit as seen and lifts the pre-paint cover. */
export function finishLoader() {
  try {
    sessionStorage.setItem(LOADER_SEEN_KEY, "1");
  } catch {}
  document.documentElement.removeAttribute("data-loader");
  if ("scrollRestoration" in history) history.scrollRestoration = "auto";
}

/** Resolves when every image has loaded (or failed), or after `timeout` ms. */
export function preloadImages(srcs: string[], timeout = 1500): Promise<void> {
  const all = Promise.all(
    srcs.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = img.onerror = () => resolve();
          img.src = src;
        }),
    ),
  ).then(() => undefined);
  return Promise.race([all, new Promise<void>((r) => setTimeout(r, timeout))]);
}

/** Size and position of an `object-fit: contain` image's visible pixels. */
export function containedRect(el: Element, naturalW: number, naturalH: number) {
  const box = el.getBoundingClientRect();
  const s = Math.min(box.width / naturalW, box.height / naturalH);
  const w = naturalW * s;
  const h = naturalH * s;
  return { x: box.left + (box.width - w) / 2, y: box.top + (box.height - h) / 2, s };
}
