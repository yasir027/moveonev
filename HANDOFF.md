# MOVE ON — handoff & context

Written 2026-10-22 when Maryum moved to a new Claude account. It condenses ~25 Claude Code
sessions on this repo (2026-09-19 → 2026-10-17) plus the git history, so a fresh Claude can
pick up without the old transcripts. Facts below were checked against the repo on the date
above; anything marked **verify** was reported in a past session but not re-checked.

---

## 1. Start here

**What this is.** The marketing website for **MOVE ON**, an electric-scooter showroom in
**Afzal Gunj, Hyderabad (old city), India** — a local business, not a tech brand. Eight
scooter models (X Double Light, X-Ozone, X-ORL Cheetah, X-Robox, X-Torvo, X-E4, X-FH Big
Activa, X-Lambretta), sold with 30Ah / 55Ah battery options, priced in ₹. Visitors browse
models, then book a test ride or message on WhatsApp.

**People.**
- **Maryum Urooj** — design lead on the site; does most of the UI/motion work with Claude and
  owns merging into `main`.
- **Yasir Hussain** (GitHub `yasir027`, owner of the repo) — colleague; adds pages/content on
  his own dated branches (`yasir22ndSept`, `yasir29thSept`, `yasir16thOct`, `yasir20thOct`).
- Repo: `https://github.com/yasir027/moveonev`

**State right now (2026-10-22).**
- `main` = `origin/main` = `0e7e393`. Has all of Maryum's latest work (footer, model popup →
  page hand-over, scroll motion on model pages).
- Checked-out branch is **`yasir20thOct`** (Yasir's blogs / about / technology pages). It
  forked from `main` at `a08e879`, is **2 commits ahead and 6 behind**, and is **not merged**.
- `npm run build` **fails** on `main` because of `lib/oldmodels.ts` (see §7). `npm run dev` works.
- Working tree was clean apart from this file and the `@HANDOFF.md` line in `CLAUDE.md`.

**Likely next steps.**
1. Fix the `lib/oldmodels.ts` build failure (ask Yasir, then delete it or add `"55ah"` pricing).
2. Merge `yasir20thOct` with `main` (check divergence first — see §6).
3. Clean the TEMP leftovers on the home page and settle the open design threads in §7.

---

## 2. Stack & running it

| | |
|---|---|
| Framework | **Next.js 16.3.5**, App Router. Not the Next.js in your training data — per `AGENTS.md`, read `node_modules/next/dist/docs/` before writing Next-specific code. |
| UI | React 19.2, TypeScript 5, Tailwind CSS v4 (`@tailwindcss/postcss`; tokens in `@theme` in `app/globals.css`) |
| Motion | framer-motion 13 (most reveals/layout), GSAP 3 + `@gsap/react` (intro/loader timelines) |
| Other | zustand (hero state), lucide-react icons |
| Fonts | Montserrat (display, 500–800) and Inter (body, 400–600) via `next/font/google` in `app/layout.tsx` |

```bash
npm run dev
```
- Dev server on http://localhost:3000. `.claude/launch.json` has a `dev` config for the
  Claude browser pane.
- Add **`?intro`** to any URL to replay the loader (it otherwise plays once per browser
  session — key `moveon:intro-seen` in `lib/intro/loader.ts`).
- Node is v20.16; one eslint dependency wants ≥20.19 (warning only).
- If dev ever dies with "next not found" / "not a valid Win32 application" / missing
  `motion-dom` files: delete `node_modules` and `.next`, then `npm ci` (this fixed it on 09-19).
- `npm run lint` and `npx tsc --noEmit` were the usual checks after every change.

---

## 3. Design system

**Colours** (`app/globals.css` `@theme`; `tailwind.config.ts` has an older copy)
- `volt` `#7DFF40` — brand green. Too light for small text on white (~1.4:1).
- `leaf` `#3B6D11` — volt's readable sibling for small green text on light backgrounds.
- `ev-green` `#00A86B`, `lime` `#7DFF40`
- `carbon` `#101412` (dark sections, text), `mist` `#F6F8F6`, `soft-grey` `#EDF1EE`
- Selection/focus use volt.

**Motion tokens**: `ease-premium` = `cubic-bezier(0.22, 1, 0.36, 1)`; `LUXURY_EASE`
`[0.16, 1, 0.3, 1]` in `lib/heroModels.ts`; shared variants in `lib/motion.ts`.

**Glass** (a recurring theme)
- `components/ui/GlassFilter.tsx` — global SVG filter; sets `html[data-liquid]`, which switches
  glass from plain blur to refracting backdrop filter (Chromium).
- `components/ui/NavGlassFilter.tsx` + `lib/glass.ts` — the navbar's liquid-glass pill
  (rounded-rect displacement map, 3-pass chromatic dispersion). `lib/glass.ts` holds the shared
  refraction maths.
- `.glass-liquid` / `.glass-nav` in `globals.css`. The `.glass-liquid::before` rim sets both
  `-webkit-mask` and standard `mask` (Firefox fix; never verified in Firefox — not installed).
- `components/ui/GlassLens.tsx` — cursor magnifier lens. **Currently disabled** (commented out
  in `app/layout.tsx`).

**Hard-won rules**
- Glass cards: reveal with **opacity only**. A transform on an ancestor kills `backdrop-filter`.
- `body` uses `overflow-x: clip`, not `hidden` — `hidden` makes it a scroll container and
  silently breaks every `position: sticky` (pinned sections rely on sticky).
- Hover "dim the others" effects use an overlay, not opacity/filter on the card (that also kills
  the glass blur).
- Respect `prefers-reduced-motion` everywhere (every motion feature so far has a fallback).

---

## 4. Site map & architecture

**Layout** (`app/layout.tsx`): inline `LOADER_BOOT_SCRIPT` (sets `data-loader` before
hydration) → `<BrandLoader />` → `<GlassFilter />` → `<RouteTransition header={<Navbar />}>`.
The navbar lives in the layout so it persists across pages; `RouteTransition` does page
slide-ins and the header-logo "recharge".

**Pages**
| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Home (section order below) |
| `/models` | `app/models/page.tsx` → `components/models/ModelsBrowser.tsx` | Filterable grid + Get In Touch |
| `/models/[slug]` | `app/models/[slug]/page.tsx` → `ModelView` / `ModelDetail` | Full model page |
| `/about`, `/blogs`, `/blogs/[slug]`, `/technology` | `app/...` | **Only on `yasir20thOct`** (Yasir, 10-20/21). Blog posts are TSX in `content/blogs/`, indexed by `lib/blogs.ts`. |

**Home section order** (`app/page.tsx`): `HeroSection` → `HeroEditorial` → `UspSection
visual="closeups"` ("Own it. Skip everything else.") → `LineupSection` → `AudienceSection`
(`WhoIsItFor.tsx`) → `BatterySection` → `ExpandPanel(GetInTouchSection)` → `FaqSection` →
closing CTA → footer. On `main` the footer is `components/SiteFooter.tsx` (with
`ShowroomLead`); on `yasir20thOct` it's still the old inline footer.

**Components by folder**
- `components/hero/` — `HeroSection` (Yasir's), `HeroEditorial` (Maryum's editorial hero),
  `ScooterStage` (the scooter image, ride-out/in, wheel spin), `HeroStudio` (parked
  alternative, not rendered), `useHeroState.ts` (zustand).
- `components/loader/` — `BrandIntro.tsx` (the big intro animation), `BrandLoader.tsx`,
  `RouteTransition.tsx`.
- `components/models/` — `ModelCard` → `ModelModal` (popup, shares `layoutId` with the card) →
  expands into `/models/<slug>`; `ModelDetail`, `ModelView`, `ModelStage`, `ModelsBrowser`,
  `LineupShowcase`, `ModelGrid`.
- `components/ui/` — `ExpandPanel` (inset rounded panel that opens to full width on scroll),
  `RevealHeading` (masked line-by-line heading reveal; `replay` option on `main`), `Reveal`
  (`main` only), `Magnetic` (button drifts toward cursor), `Button`, glass components.
- Other: `Navbar`, `UspSection`, `WhoIsItFor`, `BatterySection`, `LineupSection`,
  `GetInTouch`, `FaqSection`, `ScrollCurtain` (built, **not used**), `ProductCard`,
  `StatBlock`, `brand/Logo.tsx`.

**Data**
- `lib/models.ts` — **source of truth** for the 8 models: per-model data (name, motor, finishes,
  photos, `pricing` per battery with list/offer) + shared spec-sheet data from the XIDAA
  catalogue (batteries, start methods, smart features, chargers, in-the-box, warranty,
  `specRows()`). `BatteryId = "30ah" | "55ah"`. `formatPrice` → `₹` en-IN.
- `lib/heroModels.ts` — the hero's own 3-model list (X-Double Light, X-Torvo, X-Robox) with
  colour swatches and placeholder `priceFrom` values, plus `WHATSAPP_NUMBER`, `RIDER_COUNT`,
  `GOOGLE_RATING`, `whatsappUrl()`. On `main` `WHATSAPP_NUMBER` includes the `91` country code
  (needed for `wa.me` links).
- `lib/showroom.ts` (`main`) — showroom name, address (Shabbir Medical Hall building, Afzal
  Gunj), hours Mon–Sat 10am–8pm, phone, Maps link. Used by footer + Get In Touch.
- `lib/handover.ts` (`main`) — popup → page hand-over flags (`html[data-handover]`).
- `lib/footerBlueprint.ts` (`main`), `lib/intro/*` (loader paths, logo geometry, intro photo).
- `lib/oldmodels.ts` — stale backup of the old models file; imported by nothing; breaks build.

**Scripts** (manual — nothing runs them automatically)
- `node scripts/prepare-hero-photo.mjs <source.png> <name>` — cuts a scooter photo off a
  near-white background → `public/Hero/<name>.webp`, prints the aspect ratio. Then point
  `lib/heroModels.ts` at it.
- `scripts/build-wheel-sprites.mjs` — builds the hero's spinning-wheel layers (full wheel +
  cut-out covers: mudguard/fork front, motor housing/shock rear). Positions are measured for
  the current photo; a new photo means re-running/re-measuring.
- `scripts/prepare-intro-blueprint.mjs`, `scripts/import-intro-m.mjs` — intro loader assets.
- `scripts/prepare-footer-blueprint.mjs` + `scripts/lib/blueprint.mjs` (`main`) — footer art.

---

## 5. What was built, and the decisions behind it

Roughly chronological.

**Loader / intro (09-19 → 09-24).** First a "v7" cinematic loader from a concept file
(`moveon-hero-concept.html`): pen-drawn scooter, parts dock in, scan to photo, flies into the
hero. Maryum then replaced it: the logo is an **M shaped like a scooter seen from the front**,
so the intro draws a front-view scooter blueprint (`public/intro/scooter-front.webp`), traces
the M on it, lifts it to centre, morphs into the real logo, then docks into the header while a
circle reveal opens **from the logo's own position**. Maryum hand-drew the distorted M that
sits on the scooter (`intro-m-fit.svg`, imported via `scripts/import-intro-m.mjs`).
- Open: during the morph the M's outer cuts look like they "flip". A per-edge
  rotate/stretch fix removed the flip but broke left/right symmetry, so it was reverted — the
  **committed version is live**. Proposed fix not yet done: morph the left half only and
  mirror it.
- Logo viewBox was extended (690 → 786) so the green ring isn't clipped in the navbar.

**Navbar.** Liquid-glass pill with refraction (see §3). Full-width at top, shrinks to a pill
on scroll (`MORPH` timing). Later: resized; menu labels made smaller with more padding so the
bar stays exactly the same size (25→20px top, 18→15px pill).

**Hero.** Maryum's `HeroEditorial` combines the boxy, full-width layout from an earlier hero
with a facts bar underneath. Rules Maryum set: no glowing shadows; liquid glass where
readability doesn't matter, glassmorphism where it does; header text must be legible.
Changing model makes the scooter **ride out left and the next ride in from the right**, with
real wheel spin (full wheel sprite sandwiched between the bike and cut-out covers) — Maryum's
own idea after a blur-only version was rejected. On 09-21 the facts bar was also made
near-clear glass (22% white, 18px blur) overlapping the bottom of the front wheel to sell the
illusion — **verify**: that styling isn't in the current `HeroEditorial.tsx`, so it was likely
lost in a later merge. Every model/colour currently uses **one photo, tinted** per colour.

**USP — "Own it. Skip everything else."** Glassmorphism attempt rejected ("looks generic and
childish", icons removed). Went from dark to **light theme**; line-art blueprints replaced by
**real close-up crops** of the scooter cut from `public/Hero/bike_1.png` (its checkerboard
background was painted in and had to be removed) → `public/usp/closeup-*.webp`. Close-up sits
right of each card on desktop, as a band on top on phones.

**Who is it for (`WhoIsItFor.tsx`).** Pinned scroll sequence: students → newbies → seniors →
handlebar detail tile, one at a time inside a `300svh` sticky track; thresholds in `STEP_AT`
(`[0, 0.24, 0.52, 0.8]`). The two-box state is deliberately the longest beat. Reverses on
scroll up. Audience images in `public/audience/` are Unsplash **placeholders** Maryum plans to
replace. `ScrollCurtain` was removed from this area.

**Battery section.** Kept big imagery; compacted padding/margins, then fonts. Bottom
transparent space cropped off `Battery1-3.png`.

**Section transitions (09-23).** Inspired by electricscooter.framer.website but toned down:
`ExpandPanel` around Get In Touch, `RevealHeading` on section headings, hover-dim on Lineup and
Battery grids, `Magnetic` on the hero CTA.

**FAQ.** Layout from a reference, styled to the site; 15 questions; reveals **replay every
time** the section scrolls back into view. Answers were written without real product data —
see §7.

**Cursor glass lens.** Made to fade away over links/buttons (it made targets look shifted),
then disabled entirely on 10-06.

**Models page & popup (10-06 → 10-17).**
- `/models` lineup redesigned (four scooters in the middle, outlined text over them — no tint,
  thicker colour outline). Filter bar was sticky across the whole page; now confined to the
  card grid, sticks at 96px, desktop-only.
- `ModelModal` redesigned: scooter large in a tall left area (no grey box), big stylised model
  name (50px desktop / 40px phone), USP tags always visible, popup uses near-full height.
  Maryum rejected a colour arch behind the scooter and asked that the expanded page stay as it
  was.
- Popup → page: Expand grows the popup to full screen, the header fades in already in its
  top-of-page form, the route swaps with no visible jump (`lib/handover.ts`), scrollbar space is
  always reserved. Model pages got the home page's scroll motion (`Reveal`, replaying
  `RevealHeading`, closing `ExpandPanel` CTA). Commits `7c1eaef`, `0e7e393`.

**Footer & "Come ride" (10-15 → 10-16, `main` only).** `SiteFooter.tsx`: a faint side-profile
scooter blueprint watermark (same style as the loader) that redraws each time you scroll to
it, rolls in with wheels turning, a cursor "torch" lighting the lines, staggered columns, link
underline hovers. The store/contact block was cut down to a compact strip (call, WhatsApp,
directions as buttons; no status text), and **blended into the footer while staying a separate
component** (`ShowroomLead`). A "cyber-security" look was explicitly rejected — it should feel
like a neighbourhood showroom.

---

## 6. Git & branches

```
main / origin/main        0e7e393  Maryum's latest (footer, popup hand-over, model-page motion)
yasir20thOct (checked out) 2c7e575  Yasir: blogs foundation, about, technology  [2 ahead / 6 behind main]
main-merge-yasir29thSept            Integration branch used for the 10-16 merges (now in main)
maryum-chnages, master, main-copy, yasir29thSept, yasir22ndSept, yasir16thOct   older
```
- `master` and `main` had the same code as of 10-06 (`main` = `master` merged via PR #2).
- Yasir's branches are cut from whatever `main` was at the time, so they often lack Maryum's
  newer work — that was the cause of "transitions missing on Yasir's branch" on 10-06.
- `yasir20thOct` vs `main` touch the same files in places: `components/Navbar.tsx`,
  `lib/models.ts`, `app/page.tsx` imports. Also `main` has `SiteFooter`, `Reveal`,
  `lib/showroom.ts` etc. that the blog/about pages may want to use.

**How merges were done before** (Maryum's preferred flow):
1. Fetch, then report how far apart the branches are and where each was cut from — **before**
   merging.
2. Merge into an integration branch (e.g. `main-merge-yasir29thSept`), keep Yasir's new
   content and re-apply Maryum's motion/design on top in conflicts.
3. `npx tsc --noEmit`, `npm run lint`, `npm run build`, load the pages.
4. Don't push, don't delete branches, don't touch `main` until Maryum says so.

Commit author note: Yasir's latest commits show author "unknown" (git user not configured on
that machine).

---

## 7. Open issues & TODO

**Blocking**
- [ ] **`npm run build` fails** — `lib/oldmodels.ts:87` `TS2741: Property '"55ah"' is
  missing`. The file is an unused backup of the old models data; Next type-checks it anyway.
  Fix: delete it after confirming with Yasir, or add `"55ah"` pricing. Recorded in the README
  "Known issues" section and a `TODO(before production)` comment on `main`.
- [ ] **Merge `yasir20thOct` ↔ `main`** (see §6).

**Clean-up on the home page**
- [ ] Both heroes render (`HeroSection` then `HeroEditorial`). Pick one.
- [ ] `app/page.tsx` still has the "TEMP: three USP visual directions" comment and an unused
  `VariantDivider` helper; the USP now only uses `visual="closeups"`.
- [ ] On `main` the "Built to perform" `StatBlock` section is live with placeholder numbers
  (150 km, 80 km/h…) that may not match `lib/models.ts`; on `yasir20thOct` it's commented out.
- [ ] `ScrollCurtain.tsx` and `HeroStudio.tsx` are unused.

**Content / data**
- [ ] Hero uses one photo tinted per colour. For real photos: one white-background shot per
  model × colour → `prepare-hero-photo.mjs` → allow per-colour images in `lib/heroModels.ts` →
  redo wheel sprites or turn spin off.
- [ ] Hero `priceFrom` values in `lib/heroModels.ts` (₹45,000 / ₹75,000 / ₹1,05,000) look like
  placeholders; real prices are in `lib/models.ts`.
- [ ] FAQ answers include **unconfirmed features**: under-seat storage + front hook, eco mode,
  app alarm/live location, doorstep technicians, in-app service booking. Confirm before launch.
- [ ] Audience images are Unsplash placeholders.
- [ ] **verify** — on 10-06 the `/models` range-filter chips did nothing and some cards showed
  stale data (₹49,999 vs ₹61,999 for X Double Light, "100+ km"); Yasir's 10-16 models work may
  have fixed this.

**Polish / unverified**
- [ ] Intro M-morph "flip" at the outer cuts (mirror-half fix proposed, §5).
- [ ] GlassLens is off; uncomment the two lines in `app/layout.tsx` to bring it back.
- [ ] Glass rim mask never checked in Firefox.
- [ ] Many animations were checked by measuring positions because the Claude preview pane was
  hidden/throttled — watch the intro, hero ride, WhoIsItFor sequence and footer live.

---

## 8. How Maryum likes to work

- **Aesthetic:** modern, minimal, premium, "cool" — never gamified, never generic or
  "AI-looking". No glowing shadows. Liquid glass for decorative spots, glassmorphism where text
  must stay readable. Local-business feel, not tech/cyber.
- **Change only what was asked.** When Maryum says "keep X as it was", don't touch X. Past
  sessions lost trust by restyling the expanded model page, hiding USP tags, or shrinking a
  heading that was supposed to grow.
- **Big screens matter, but sections shouldn't be oversized:** compact padding/margins first,
  keep hero imagery large.
- **Scroll reveals should replay/reverse** when scrolling back, not play once.
- **Discuss before big redesigns:** offer 2–3 concrete directions, then build the chosen one.
  Maryum often sketches ideas (e.g. the wheel-layer trick, the hand-drawn M) — build on them.
- **Explain simply.** Short, plain answers; skip jargon and unnecessary detail.
- **Be honest about verification:** say what was checked in the browser and what wasn't.
- **Git:** don't commit, push, merge to `main` or delete branches unless asked. Check branch
  divergence before merging.

---

## 9. Assets & reference material

- `public/Hero/` — hero photos (`veloce-l*.webp` incl. wheel/cover sprites, `bike_1.png` hi-res
  source, `Xtorvo`, `Xdoublelight`).
- `public/Lineup/` — model cut-outs used by cards (`xdoublelight`, `xozone`, `xorlcheetah`,
  `xrobox`, `xtorvo`, `xe4`, `xfh`, `xlambretta`).
- `public/usp/` close-ups, `public/intro/` loader art, `public/audience/` placeholders,
  `public/keys/` start methods, `Battery*.png`, `charger.png`, `ToolKit*.png`,
  `public/footer/scooter-side.webp` (`main`).
- Repo root: `XIDAA PRODUCT CATALAOGUE NEW (1) (1).pdf` (spec source), `arafat new pdf.pdf`,
  `moveon-hero-concept.html` (original loader/hero concept), `intro-m-fit.svg`,
  `Design Concepts/` and `Gallery/` (reference images).

---

## 10. Starter prompt for the new account

> I'm continuing work on the MOVE ON website in this repo. Read `HANDOFF.md` first — it has
> the project context, branch state, open issues and how I like to work. Then tell me the
> current branch status and what you'd tackle first.
