/*
 * The model popup's hand-over to /models/<slug>. While the popup grows to full screen,
 * html[data-handover] lifts the header above it and fades it in (globals.css), and the
 * Navbar takes its top-of-page form, so the screen already looks exactly like the page by
 * the time the route swaps. RouteTransition ends it once the new page is showing, and
 * skips its own slide-in for that one change.
 *
 * Browser-only: call these from event handlers and effects.
 */

export const HANDOVER_EVENT = "model-handover";

export const isHandover = () => document.documentElement.hasAttribute("data-handover");

function set(on: boolean) {
  if (isHandover() === on) return;
  document.documentElement.toggleAttribute("data-handover", on);
  window.dispatchEvent(new CustomEvent(HANDOVER_EVENT, { detail: on }));
}

export const startHandover = () => set(true);
export const endHandover = () => set(false);
