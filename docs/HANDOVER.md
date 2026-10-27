# MOVE ON — Handover

*Written 2026-10-26 for the move to a new Claude account. It covers all 33 Claude Code sessions
on this repo (2026-09-19 → 2026-10-25) plus git history, and replaces the older `HANDOFF.md`
(2026-10-22), which stays in the repo for history. Facts were checked against the repo on
2026-10-26. Read [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) for what the site is and how it's built.*

---

## 1. Where it lives

| | |
|---|---|
| Local folder | `C:\Users\Maryum Urooj Ahmed\Desktop\moveonev` |
| Remote | https://github.com/yasir027/moveonev (owner: Yasir) |
| Current branch | `main`, equal to `origin/main` at `0c0743b` "hero changes" (2026-10-26). Everything is pushed |
| Working tree | Clean, apart from these new docs (`docs/`, the `CLAUDE.md` edit and the note at the top of `HANDOFF.md`) |

**Branches**
| Branch | State |
|---|---|
| `main` | Live line of work. Has everything, including all of Yasir's merged work |
| `yasir20thOct` | Merged into `main` on 10-23 (Maryum resolved 2 model-page conflicts herself) |
| `main-merge-yasir20thOct`, `main-merge-yasir29thSept` | Old integration branches, already in `main` |
| `yasir16thOct` (remote only), `yasir29thSept`, `yasir22ndSept`, `maryum-chnages`, `master`, `main-copy` | Old. Don't delete without asking |

---

## 2. Setup and run

**Prerequisites:** Node 20 (20.16 is installed; one eslint dep wants ≥20.19, warning only) and npm.

```bash
npm ci            # or npm install
npm run dev       # http://localhost:3000
npm run lint
npx tsc --noEmit  # type check (fails only on lib/oldmodels.ts today)
npm run build     # FAILS until lib/oldmodels.ts is fixed
```

**Environment (`.env.local`, git-ignored, each machine needs its own):**
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Web3Forms access key registered to moveonevmoto@gmail.com. Without it both forms show "didn't go through". Get one free at web3forms.com by entering that email |

- `.claude/launch.json` has a `dev` config (port 3000) for the Claude browser pane.
- Add `?intro` to any URL to replay the loader (otherwise it plays once per session; key `moveon:intro-seen`).
- If dev dies with "next not found", "not a valid Win32 application" or missing `motion-dom` files: delete `node_modules` and `.next`, then run `npm ci`.

---

## 3. Work done (timeline)

| Dates | Work |
|---|---|
| 09-19 → 09-24 | Project set up (Next 16). Cinematic loader v7, then replaced by the M-logo blueprint intro. Liquid-glass navbar. `HeroEditorial` with ride-out/ride-in and wheel spin. USP section went light-themed with real close-up crops. "Who is it for" pinned sequence. Battery section compacted. Section transitions (`ExpandPanel`, `RevealHeading`, hover-dim, `Magnetic`). 15-question FAQ |
| 10-06 → 10-07 | Cursor glass lens disabled. `/models` lineup redesign, filter bar, `ModelModal` redesign. Merged Yasir's 29-Sept work |
| 10-15 → 10-18 | `SiteFooter` with blueprint scooter and torch, compact showroom strip. Popup → page hand-over. Model pages got the home page's scroll motion. Merged `yasir16thOct`. Build failure recorded in README |
| 10-22 | Wrote the first `HANDOFF.md`. Merged `yasir20thOct` (about, technology, blogs) into an integration branch. Built **`/contact`** with Web3Forms (test email confirmed). Fixed the `ExpandPanel` scroll glitch. Added subtle motion to Technology, About and Blogs. About storefront hero (later reverted). Integration branch merged to `main`. **Decided: no Claude co-author line in commits** |
| 10-23 | Floating CTA pill. Merged Yasir's "images added and models redefined" (lifestyle photos, colour dots instead of a picker). Phone navbar menu |
| 10-24 | Mobile pass on Home (stacking cards, swipe rows, lens badges on USP cards). About hero **reverted** to the original. Phone top-padding fixed on every page. Contact form restyled like Home's Get In Touch; laptop opens straight on the form. Pill and full footer restored after Yasir's commit removed them. Minimal phone footer. **Blueprint backgrounds.** Navbar: Contact on phones only, Book button depth/hover. **Booking form now really emails** (shared `lib/enquiry.ts`). **Privacy Policy and Terms of Use**, plus opt-in checkbox. Dead hero buttons fixed, 01/02/03 badges removed, footer trimmed to 3 models. Audience collage and USP cards scale on smaller laptops. Design review written (§5) |
| 10-25 → 10-26 | Yasir: real audience photos and component sizing. Maryum + Claude: **removed the top `HeroSection`** (only `HeroEditorial` remains), fixed the X-Torvo image path, **removed wheel spin**, per-model hotspot dots, catalogue colours and prices in the hero, new X-Torvo photo (`XtorvoOlive.webp`) and X-Robox cut-out. Committed as "hero changes" |

---

## 4. Work in progress / last thing being done

The last session (10-25 evening) was on the **home hero**:
- One photo per model, with the other catalogue colours **tinted** onto it until real photos arrive.
- Maryum supplied a bigger X-Torvo photo (olive). Its checkerboard background was painted in and had to be cleaned by hand. It's now saved as `public/Hero/XtorvoOlive.webp`; a new filename avoids browser-cache mix-ups.
- Still waiting for: **real per-colour photos** for X-Double Light, X-Torvo and X-Robox. They need to be ≥1500px tall, and every colour of a model must be shot from the same angle. Then allow per-colour images in `lib/heroModels.ts`.
- Leftovers that can be deleted when Maryum agrees: `components/hero/HeroSection.tsx` (unused), wheel sprites in `public/Hero/veloce-l-*` and `scripts/build-wheel-sprites.mjs`, and `public/Hero/Xtorvo.png`.

---

## 5. Open issues and TODO

### Blocking launch
- [ ] **`npm run build` fails**: `lib/oldmodels.ts(93,5) TS2741: Property '"55ah"' is missing`. It's an unused backup. Delete it after checking with Yasir, or add `"55ah"` pricing.
- [ ] **Deploy** isn't set up. Add `NEXT_PUBLIC_WEB3FORMS_KEY` to the host's environment.
- [ ] **"No licence, no RTO" claim**: valid only at ≤25 km/h **and** ≤250 W motor, but the Technology page lists 1000–1500 W. Confirm certification with XIDAA.
- [ ] **Cookie consent banner** is required when Google Analytics/Ads go in (the Privacy Policy already describes them).
- [ ] Have someone legally review the Privacy and Terms wording.

### Content and trust (from the 10-24 design review; items 1 and 5 are already fixed)
- [ ] **Numbers contradict each other**: the home stats block says 150 km / 80 km/h / 4.2 s (placeholder `StatBlock`s in `app/page.tsx`) while models say 25 km/h. Battery section "60V 45AH" vs photo 55AH. Range 110–120 vs 160–170 km. Cycles 2,000 vs 2,500+. The FAQ still mentions "X1, X2 and PRO".
- [ ] **Unverified social proof**: `RIDER_COUNT "2,400+"`, `GOOGLE_RATING "4.9"` (`lib/heroModels.ts:25` TODO), "150+ riders this week" in the FAQ, "100% Genuine" stats.
- [ ] FAQ answers mention unconfirmed features (under-seat storage + hook, eco mode, app alarm/live location, doorstep technicians, in-app service booking).
- [ ] Some model-page lifestyle shots look AI-generated (e.g. X-Robox on a snowy mountain). Real shop and customer photos would be better.
- [ ] `app/page.tsx` still has the "TEMP: three USP visual directions" comment and an unused `VariantDivider`.

### Design polish (review items not yet acted on)
- [ ] The same "black line + grey line" heading formula appears on nearly every section.
- [ ] Numbering everywhere ("01 / REGISTRATION", FAQ 01–15).
- [ ] Giant faint watermark words ("EVERYONE", "RANGE").
- [ ] Generic pale-green icon circles; green radial glows in dark sections.
- [ ] Blog cards have no images.
- [ ] Copy has AI tells (em dashes, stock lines).
- [ ] Too many CTAs, worded 8 different ways; the navbar button opens WhatsApp while others go to the form.
- [ ] The "Eight models" lineup block is repeated on many pages.
- [ ] Model names are written inconsistently ("X Double Light" / "X-Double Light" / "X-DOUBLE LIGHT").
- [ ] Motion on almost everything. Consider keeping only the signature moments.
- [ ] Intro M-morph "flip" at the outer cuts. Proposed fix: morph the left half and mirror it.
- [ ] Glass rim mask never checked in Firefox. `GlassLens` is disabled (uncomment 2 lines in `layout.tsx` to restore).
- [ ] `ScrollCurtain.tsx` and `HeroStudio.tsx` are unused.

---

## 6. Next steps (suggested order)
1. Fix the build (`lib/oldmodels.ts`), then pick a host and deploy with the Web3Forms key.
2. Fix the contradicting numbers and placeholder stats against `lib/models.ts` and the XIDAA catalogue.
3. Confirm the RTO/licence claim with XIDAA.
4. Add Google Analytics/Ads together with a consent banner.
5. Drop in real per-colour hero photos when they arrive.
6. Work through the design-polish list with Maryum (discuss first; she picks).

---

## 7. Key decisions and why
| Decision | Why |
|---|---|
| Web3Forms for email | Maryum didn't want to share a Gmail password. Free, no backend |
| One shared sender `lib/enquiry.ts` | The booking form had silently "succeeded" without sending anything. One path keeps the two forms in sync. It also sends in a way that avoids Web3Forms' Cloudflare pre-check failure |
| No "Co-Authored-By: Claude" in commits | GitHub listed Claude as a contributor on a client-facing repo. The 13 old commits were **left as they are** (a rewrite would force-push Yasir's branches) |
| Merge Yasir's work through an integration branch | His branches are cut from older `main` and often lack Maryum's newer work |
| About storefront hero reverted (10-24) | Maryum preferred the original |
| Audience collage scales as one fixed design | Maryum rejected a separate small-laptop layout ("why did u change the collage style") |
| Wheel spin removed (10-25) | Sprites were measured for one photo and broke on X-Torvo |
| Tint one photo per model | Catalogue photos are only ~300px, too small for the hero |
| Pill shows from the top on non-home pages | Those pages don't have a hero holding the CTAs |
| Legal pages say "as certified by the manufacturer" | The RTO claim isn't confirmed yet |

**Tried and dropped:** cinematic v7 loader. Cursor glass lens. Glassmorphism USP cards ("generic and childish"). Colour arch behind the popup scooter. "Cyber-security" footer. Per-edge rotate fix for the M-morph (broke symmetry). Three-card small-laptop audience layout. USP phone options A/B (kept C, lens badges). Wheel spin.

---

## 8. Gotchas
- **Tailwind classes not appearing in dev:** the dev server's CSS can go stale after an edit. Touch `app/globals.css`, or make and revert a tiny change in it, to force a rebuild.
- **Claude browser pane hidden = animations paused.** Screenshots come out blank or mid-reveal. Bring the pane to the front before judging motion.
- **Next allows one dev server per folder.** Reuse the one already running on port 3000.
- **Check phone view with real screenshots,** not just measurements. A 10-24 mobile pass that only measured got rejected as "so gross".
- **Browser image cache:** when replacing an image, give it a **new filename** (see `XtorvoOlive.webp`).
- **PNG "transparency" is often a painted checkerboard** in supplied photos. Clean it before running `scripts/prepare-hero-photo.mjs`.
- **PowerShell drops multi-line commit messages.** Write the message to a file and use `git commit -F`.
- Yasir's commits sometimes undo Maryum's layout pieces (e.g. the pill and footer on 10-24). After merging his work, check `app/layout.tsx`.
- `AGENTS.md` is rewritten by `next dev`. Leave it alone.

---

## 9. External services and accounts (names only, no secrets)
| Service | Account | Notes |
|---|---|---|
| GitHub | `yasir027/moveonev` | Maryum has push access |
| Web3Forms | moveonevmoto@gmail.com | Access key lives in `.env.local` only |
| Gmail | moveonevmoto@gmail.com | Receives enquiries. First mails may land in Spam/Promotions |
| WhatsApp Business | +91 78936 20380 | |
| Google Analytics / Ads | Planned | Not set up |

---

## 10. How Maryum likes to work
- **Change only what was asked.** "Keep X as it was" means don't touch X. Confirm **which page** is meant: on 10-24 a Contact request was applied to About by mistake.
- **Discuss before big redesigns:** offer 2–3 directions, then build the chosen one. Build on her sketches and ideas.
- **Capture and look first** (screenshots at real sizes: 1920, 1536, 1440, 1366, 1280, 1024, 375) before planning layout fixes.
- **Explain simply.** Short, plain answers, no jargon.
- **Be honest about verification:** say what was seen in the browser and what wasn't.
- **Git:** commit only when asked, and **don't push** unless asked. Prefer one commit per logical change. **No Claude co-author line.** Check divergence and do a test merge before merging; let Maryum resolve model-page conflicts if she wants to.
- Aesthetic: premium and minimal. No glows. Local showroom, not tech.

---

## 11. Start-here prompt for the new account
> I'm continuing work on the MOVE ON website in this repo. Read `docs/HANDOVER.md` and
> `docs/PROJECT_OVERVIEW.md` first. Then tell me the current branch status and what you'd
> tackle first. Don't commit or push unless I ask, and never add a Claude co-author line.
