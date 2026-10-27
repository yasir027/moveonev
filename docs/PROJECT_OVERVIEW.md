# MOVE ON — Project Overview

*Last updated 2026-10-26. Companion doc: [HANDOVER.md](HANDOVER.md) (state, history, open issues, how to work).*

---

## 1. What it is

The marketing website for **MOVE ON** (legal name used on the site: **MOVE ON EV MOTO**), an
electric-scooter showroom in **Afzal Gunj, Hyderabad (old city), India**. It sells **XIDAA**
scooters. It's a neighbourhood showroom, not a tech brand.

**Goal of the site:** visitors browse the 8 scooter models, compare battery options and prices,
then **book a test ride**, **send an enquiry** or **message on WhatsApp**. Google Ads and
Google Analytics are planned, so the site is also an ad landing page.

**Audience:** students, first-time riders ("newbies"), seniors. The site leans on "no licence,
no RTO" (low-speed scooters). That claim still needs checking with XIDAA (see HANDOVER §5).

**People**
| Who | Role |
|---|---|
| Maryum Urooj | Design lead. Does most of the UI and motion work with Claude, and merges into `main` |
| Yasir Hussain (GitHub `yasir027`) | Repo owner and colleague. Adds pages and content on dated branches (`yasir20thOct` etc.). His commits show author "unknown" |
| Showroom contact | moveonevmoto@gmail.com · +91 78936 20380 (WhatsApp `917893620380`) |

**Status:** In active development. Not deployed yet as far as the sessions show (no hosting
configured in the repo). `npm run dev` works. `npm run build` **fails** because of
`lib/oldmodels.ts`.

**Links**
- Repo: https://github.com/yasir027/moveonev (default branch `main`)
- Local: `C:\Users\Maryum Urooj Ahmed\Desktop\moveonev`

---

## 2. Functionality

✅ Done · 🔄 In progress / partial · 📋 Planned / not started

### Pages
| Route | Status | What it does |
|---|---|---|
| `/` Home | ✅ | Editorial hero → USP "Own it. Skip everything else." → models lineup → "Built for every kind of rider" collage → batteries → Get In Touch / test-ride form → stats → FAQ → showroom strip → footer |
| `/models` | ✅ | Models lineup, a filterable grid of 8 cards, and a card → popup (`ModelModal`) that grows into the model page |
| `/models/[slug]` | ✅ | Full model page: photo, colour dots, battery/pricing, spec sheet, lifestyle photo, models list, closing CTA |
| `/technology` | ✅ | Battery, motor, charging and smart-ride content (Yasir's) with count-up stats and reveals |
| `/about` | ✅ | Story, vision, stats. The hero was reverted to the original (not the storefront redesign) |
| `/blogs`, `/blogs/[slug]` | ✅ | 3 posts written as TSX in `content/blogs/`. Light reveals; the article text itself doesn't animate |
| `/contact` | ✅ | Call, WhatsApp and Visit actions plus an enquiry form (laptop opens straight on the form), and a map |
| `/privacy`, `/terms` | ✅ | Privacy Policy (DPDP Act, Google Analytics/Ads, Web3Forms) and Terms of Use. Shared `LegalPage` layout with a contents list |

### Features
| Feature | Status | Notes |
|---|---|---|
| Brand intro loader | ✅ | Draws a front-view scooter blueprint, traces the M logo, morphs into the logo and docks into the header. Plays once per browser session; add `?intro` to any URL to replay it |
| Liquid-glass navbar | ✅ | Full width at the top, shrinks to a pill on scroll. Phone menu added 10-23. Contact shows on phones only (highlighted lime row) |
| "Book test ride" navbar button | ✅ | Depth and hover lift. Opens WhatsApp |
| Floating CTA pill (Contact us / Book now) | ✅ | Every page. On Home it appears after the hero; on other pages it shows from the top. Hides over forms, "Come ride one" and the footer. Sits left on phones so it clears the WhatsApp bubble |
| WhatsApp floating button | ✅ | Yasir's `WhatsAppFloat`, bottom right |
| Hero model switcher | ✅ | 3 models (X-Double Light, X-Torvo, X-Robox). The scooter rides out left and the next rides in from the right. **Wheel spin removed 10-25.** Hotspot dots per model. Catalogue colours, tinted onto one photo per model |
| Test-ride booking form | ✅ | Home and `/models`. Emails via Web3Forms through `lib/enquiry.ts` |
| Contact enquiry form | ✅ | Same sender. Tested end-to-end 10-22 and 10-24 |
| Offers opt-in checkbox | ✅ | Unticked by default; adds "offers: Yes" to the email |
| Blueprint backgrounds | ✅ | Faint lime scooter outlines behind page headers (Models, Technology, Blogs, articles, Contact on phone/tablet, each model page) |
| Footer | ✅ | Blueprint scooter that redraws on scroll, a cursor "torch", 3 models + "View all models", Privacy/Terms. Minimal layout on phones |
| Mobile responsiveness | ✅ | Home, Contact, Navbar, footer and top padding on every page done 10-23/24. Stacking cards and swipe rows on phones |
| Small-laptop scaling | ✅ | Audience collage scales as one fixed design; USP cards rearrange by their own width (10-24) |
| Google Analytics / Ads | 📋 | Described in the Privacy Policy but **not installed**. Needs a cookie consent banner when added |
| Real per-colour hero photos | 📋 | Waiting on photos from Maryum (≥1500px tall, same angle for every colour) |
| Deployment | 📋 | Not set up. Needs the build fix plus `NEXT_PUBLIC_WEB3FORMS_KEY` in the host's environment |

---

## 3. Design

### Look and feel
- Modern, minimal, premium, "cool". Never gamified, generic or "AI-looking".
- **No glowing shadows.** Use liquid glass where readability doesn't matter, and glassmorphism (frosted) where text must stay readable.
- It should feel like a **local neighbourhood showroom**, not tech or cyber. A "cyber-security" footer look was explicitly rejected.
- Big imagery, compact padding.
- Scroll reveals: on Home they replay and reverse when scrolling back. On the newer pages (Contact, Technology, About, Blogs) they **play once**, at Maryum's request.

### Design tokens (`app/globals.css` `@theme`)
| Token | Value | Use |
|---|---|---|
| `volt` / `lime` | `#7DFF40` | Brand green. Too light for small text on white |
| `leaf` | `#3B6D11` | Readable green for small text on light backgrounds |
| `ev-green` | `#00A86B` | Secondary green |
| `carbon` | `#101412` | Dark sections, body text |
| `mist` | `#F6F8F6` | Light background |
| `soft-grey` | `#EDF1EE` | Light panels |

- **Fonts:** Montserrat (display, 500–800) and Inter (body, 400–600) via `next/font/google`.
- **Easing:** `ease-premium` = `cubic-bezier(0.22, 1, 0.36, 1)`; `LUXURY_EASE` `[0.16, 1, 0.3, 1]`. Shared variants live in `lib/motion.ts`, including `useIsCompact()` for toned-down motion on small screens.
- **Logo:** an "M" shaped like a scooter seen from the front, with a green ring. Maryum hand-drew the distorted M (`intro-m-fit.svg`).

### Signature design moments
1. The intro loader (blueprint → M → logo → docks into the header).
2. The hero ride-out/ride-in when switching models.
3. The model card → popup → full page "hand-over" with no visible jump (`lib/handover.ts`).
4. The "Who is it for" collage. Desktop shows a fixed 1376×620 design that scales down; phones get stacked cards.
5. The footer blueprint scooter that redraws on scroll, with the cursor torch.
6. Faint blueprint outlines behind page headers.

### Hard-won CSS rules
- Glass cards reveal with **opacity only**: any transform on an ancestor kills `backdrop-filter`.
- `body` uses `overflow-x: clip`, **not** `hidden`, because `hidden` breaks every `position: sticky`.
- "Dim the others" hover effects use an overlay, not opacity or filter on the card.
- `ExpandPanel` opens by clipping its edges, not by changing width. Changing the width re-wrapped the text on every frame and made scrolling glitchy.
- Respect `prefers-reduced-motion` everywhere.

---

## 4. Architecture

### Stack
| | |
|---|---|
| Framework | **Next.js 16.3.5**, App Router. Per `AGENTS.md`, this is newer than Claude's training data, so read `node_modules/next/dist/docs/` before writing Next-specific code |
| UI | React 19.2, TypeScript 5, Tailwind CSS v4 (`@tailwindcss/postcss`, tokens in `@theme`, container queries) |
| Motion | framer-motion 13 (reveals, layout), GSAP 3 + `@gsap/react` (intro and loader timelines) |
| State | zustand (hero state, `components/hero/useHeroState.ts`) |
| Icons | lucide-react |
| Forms → email | **Web3Forms** (free) → moveonevmoto@gmail.com. Key in `NEXT_PUBLIC_WEB3FORMS_KEY` |
| Maps | Google Maps embed on `/contact` |
| Backend / DB | **None.** It's a static marketing site. All data lives in TypeScript files in `lib/` |

### Layout chain (`app/layout.tsx`)
```
<html>  inline LOADER_BOOT_SCRIPT (sets data-loader before hydration)
 ├─ <BrandLoader/>            intro animation
 ├─ <GlassFilter/>            global SVG refraction filter
 ├─ <RouteTransition header={<Navbar/> + <FloatingCta/>}>   page slide-ins
 │     └─ {page}
 ├─ <SiteFooter/>
 └─ <WhatsAppFloat/>
 (GlassLens cursor magnifier: commented out, disabled since 10-06)
```

### Folder map
```
app/                     routes (page.tsx per route; models/[slug], blogs/[slug])
components/
  hero/                  HeroEditorial (live), ScooterStage, useHeroState, HeroSection (unused since 10-25), HeroStudio (unused)
  loader/                BrandIntro, BrandLoader, RouteTransition
  models/                ModelCard → ModelModal → ModelView/ModelDetail, ModelsBrowser, LineupShowcase, ModelGrid, ModelStage
  contact/ContactForm    blog/ (ArticleParts, PostCard)   legal/ (LegalPage, FormConsent)   brand/Logo
  ui/                    ExpandPanel, Reveal, RevealHeading, Magnetic, CountUp, StackCards, SwipeRail,
                         BlueprintBg, Glass*, WhatsAppFloat, Button
  Navbar, FloatingCta, SiteFooter (+ShowroomLead), UspSection, WhoIsItFor, BatterySection,
  LineupSection, GetInTouch (VehiclePeek), FaqSection, StatBlock, ScrollCurtain (unused), ProductCard
content/blogs/           blog posts as TSX
lib/
  models.ts              SOURCE OF TRUTH: 8 models, pricing per battery, spec sheet from the XIDAA catalogue
  heroModels.ts          hero's 3 models, colours, hotspots, WHATSAPP_NUMBER, RIDER_COUNT, GOOGLE_RATING
  showroom.ts            name, address, hours, phone, Maps link
  enquiry.ts             shared Web3Forms sender for both forms
  blogs.ts  blueprints.ts  footerBlueprint.ts  handover.ts  glass.ts  motion.ts  intro/*
  oldmodels.ts           stale backup, imported by nothing, BREAKS THE BUILD
scripts/                 one-off asset scripts (hero photo cut-out, blueprints, wheel sprites, intro)
public/                  Hero/, Lineup/, usp/, audience/, people/, blueprints/, footer/, intro/, keys/, batteries…
```

### Data model (`lib/models.ts`)
- `Model`: `slug`, `name`, motor, finishes (colours), photos, `pricing: Record<BatteryId, {mrp, offer}>`.
- `BatteryId = "30ah" | "55ah"`. `formatPrice()` gives ₹ in en-IN format.
- Shared spec-sheet data from the XIDAA catalogue: batteries, start methods, smart features, chargers, in-the-box, warranty, `specRows()`.

**The 8 models (slug):** X Double Light (`x-double-light`), X-Ozone, X-ORL Cheetah, X-Robox,
X-Torvo, X-E4, X-FH Big Activa (`x-fh-big-activa`, renamed from X-FX), X-Lambretta.

**Hero models (`lib/heroModels.ts`):**
| Model | Colours (first = the photo's own paint) | Facts bar |
|---|---|---|
| X-Double Light | Glossy Red, Glossy Black, Glossy Grey, Matte Blue, Ivory White | 25 km/h · 170 km · ₹61,999 |
| X-Torvo | Creme, Light Blue, Ivory White, Glossy Red, Dark Blue (all tinted; the photo is olive, `XtorvoOlive.webp`) | 25 km/h · 170 km · ₹77,999 |
| X-Robox | Golden Yellow, Ivory White, Aqua Blue, Beige Gold | 25 km/h · 170 km · ₹85,999 |

### Integrations
| Service | Used for | Config |
|---|---|---|
| Web3Forms | Both forms → email to moveonevmoto@gmail.com | `NEXT_PUBLIC_WEB3FORMS_KEY` in `.env.local` (git-ignored). The key is browser-visible by design |
| WhatsApp (`wa.me`) | Navbar button, floating button, contact actions | `WHATSAPP_NUMBER` in `lib/heroModels.ts` (must include `91`) |
| Google Maps | Map embed and directions on `/contact` | Link in `lib/showroom.ts` |
| Google Analytics / Ads | Planned | Not installed |

---

## 5. Business rules and content facts
- Prices are shown in ₹ with MRP and offer price per battery (30Ah / 55Ah). The showroom price includes GST; insurance and accessories are extra (Terms).
- Speeds are 25 km/h (low-speed). The "no licence, no RTO" exemption only applies at ≤25 km/h **and** ≤250 W, but the Technology page lists 1000–1500 W motors. **Confirm with XIDAA.** The Terms currently say "as certified by the manufacturer".
- Warranty terms are XIDAA's. Deep discharge voids the battery warranty.
- Form submissions are requests, not sales. Offers go only to people who tick the opt-in.
- Showroom hours: Mon–Sat, 10am–8pm. Address: Shabbir Medical Hall building, Afzal Gunj.
- Spec source: `XIDAA PRODUCT CATALAOGUE  NEW (1) (1).pdf` in the repo root (17 pages; images only, colour shots ~300px).

---

## 6. Glossary
| Term | Meaning |
|---|---|
| XIDAA | Scooter manufacturer whose models MOVE ON sells |
| Hand-over | Model popup growing into the model page with no visible jump (`html[data-handover]`) |
| Pill | The floating "Contact us / Book now" bar (`FloatingCta`) |
| Blueprint | Faint line-art scooter outlines used in the loader, footer and page backgrounds |
| `?intro` | URL flag that replays the intro loader |
| Integration branch | e.g. `main-merge-yasir20thOct`: where Yasir's branch is merged and checked before `main` |
