# PLAN: Portfolio, informed by gregorywieber.com/indy/

## 0. Decision and status (branch `feat/aio-desk`)

The whole portfolio is a **full-screen 3D desk** with a **1998 Bondi Blue iMac G3**, built with `three` (plain Three.js, no react-three-fiber, no model or image files). A late-1990s "Platinum"-style desktop runs on its screen.

Layout:
- `src/lib/portfolio/`: `vfs.ts` builds a virtual drive from `src/data` (the single source of truth for the terminal and the Storage Explorer).
- `src/lib/terminal/`: `parser.ts`, `terminal.ts` (commands, tab completion) and `terminal.test.ts` (`npm test`, uses `node:test`, no new dependency).
- `src/components/scene/`: `imac.ts` (shell, CRT, grille, vents), `peripherals.ts` (full keyboard, round mouse, cables), `build-desk.ts` (room and props), `engine.ts` (camera, picking, hover, lighting), `experience.tsx` (HUD, tooltips, fallback).
- `src/components/desk/`: the desktop (`os-screen.tsx`, windows, menus, icons, trash, context menus).
- `src/components/apps/`: `terminal-app.tsx` and the lazy-loaded `storage-explorer.tsx` with its own scene `explorer-scene.ts`.

Physical interactions: iMac and mouse zoom in, keyboard opens the Terminal, books and frames open projects, the note opens Contact, the lamp toggles. Every object has a hover tooltip, and the HUD has keyboard-reachable quick-launch buttons.

Known gaps: see the hand-off notes in the conversation (close-up keyboard legends, GPU cost, impeccable critique not run).

---



## 1. What the reference actually is

The reference (`/indy/`) is **not a pixel-art site and not a conventional portfolio**. It is a single full-screen Three.js scene: a 1993 SGI Indy workstation on a desk. The visitor "sits down" and uses a working fake IRIX desktop inside the CRT. The real portfolio at `gregorywieber.com/` is a plain editorial page that links to it.

Source: REA browser capture (38 requests, all same-origin, no backend or API) plus the shipped HTML/CSS/JS.

### Observed architecture
| Layer | What it does |
|---|---|
| `index.html` | One `<canvas id="gl">`, a `#tube` div overlaid on the 3D monitor, a glass HUD, a PROM-style boot loader, a no-WebGL fallback with plain links, `<noscript>` text. |
| `js/main.js` | Scene controller: renderer, lights, day/night, power-on, bloom post-FX, camera states, pointer/wheel/keyboard, resize, render loop. |
| `js/scene/*` | Procedural hardware, room, props and textures. Geometry is built in code, with no GLTF models. |
| `js/irix/*` | A DOM-based desktop (Motif/4Dwm look) with windows, a toolchest menu, a file manager, a terminal, a browser, a movie player, a music player, a 3D file-system viewer and a playable game. |
| `js/site.js` | All content (links, videos, apps) in one editable file. |
| `js/audio.js` | Synthesized sound, mute toggle. |
| CSS | `scene.css` is minimal chrome (glass pills, one accent, system sans). `irix.css` is bevelled grey UI built from `box-shadow` pairs. |

### Why it reads as human-designed (the transferable part)
1. **One strong concept**, carried to the last detail (boot dialog, tooltips, window titles like `winterm — gregory@indy`).
2. **Content is the interface.** Videos, apps and music are windows in the world, not cards.
3. **Restraint in chrome.** One accent colour (`#ff7a3d`), small uppercase labels with letter-spacing, and no gradients on the UI shell.
4. **Craft signals:** hand-made period-accurate bevels, day/night lighting, power-on sequence, sound, `Esc` to go back, hover hints, reduced-motion and low-power paths (`LOW`, `prefers-reduced-motion`).
5. **Graceful degradation:** a WebGL failure shows a plain link list.
6. **Dated, specific copy** ("A 1993 workstation you can sit down at"). No generic hero.

## 2. Hard rule: do not clone

The reference's code, textures, icons, copy, and the SGI/IRIX look are Gregory Wieber's work and tied to his story. Reuse the **principles above and the architecture pattern**, not the files. The concept for this site must come from Sri's own identity. Candidate concepts (pick one in Phase 0):

- **A. The dev desk:** a lit desk, a laptop running a fake terminal and editor, and a second screen showing project previews.
- **B. The terminal-as-nav:** a real-feeling shell (`ls projects/`, `cat about.md`) over a restrained 2D layout. This is cheapest, with no WebGL.
- **C. The blueprint/lab bench:** systems diagrams as the interface (the repo already has `SystemFlow`).

Recommendation: **B first, with A as an optional later layer.** It fits a software engineer, ships fast, and avoids the performance and accessibility cost of a full 3D scene.

## 3. Target stack (matches the repo)
Next.js 16 (App Router), React 19, Tailwind 4, `motion`. Add `three` only if concept A is chosen, loaded with `next/dynamic` and `ssr:false`. Content stays in `src/data/` (the existing pattern).

## 4. Phases

**Phase 0: Direction (Opus-level thinking, short)**
- Read `PRODUCT.md`, `DESIGN.md` and `IMAGES-NEEDED.md` in the repo and write down the concept, one accent colour, and 2 typefaces max.
- Exit: one paragraph of concept plus a token list.

**Phase 1: Shell and tokens**
- Tokens in CSS variables (`@theme`), type scale, spacing rhythm, focus styles.
- Boot/loader screen that earns its place (under 1.2s, skippable).
- Exit: layout, header and footer, light and dark.

**Phase 2: The signature interaction**
- Concept B: a command-driven navigator with keyboard support, a visible mouse path for every command, and `Esc`/back handling.
- Content windows (project detail, about, contact) as in-world panels.
- Exit: every route reachable by mouse, keyboard and screen reader.

**Phase 3: Content and craft details**
- Projects from `src/data/projects`, real screenshots, specific copy (no filler).
- Small details: tooltips, sound toggle (off by default), day/night or theme transition, custom 404.

**Phase 4: Resilience**
- `prefers-reduced-motion`, low-power path, no-JS fallback with plain links, mobile layout at 360px.
- Exit: Lighthouse a11y ≥ 95, LCP < 2.5s on mobile profile.

**Phase 5: Review pass**
- Run `impeccable` critique and a manual "does this look generated?" checklist:
  - no identical card grids, no purple/blue gradient hero, no emoji icons;
  - copy has no "seamless/elevate/unleash";
  - spacing and type are consistent but not mechanical;
  - at least three places show an opinionated, non-default choice.

## 5. Acceptance criteria
- A visitor can say what the concept is within 5 seconds.
- Works without WebGL and without JS for core links.
- Keyboard-complete, visible focus, contrast AA.
- No asset or string copied from gregorywieber.com.

## 6. Model recommendation
- **Default: Claude Sonnet 5.5.** It is the best cost/speed fit for Phases 1, 3, 4 and 5 (token setup, components, data wiring, accessibility, fixes).
- **Escalate to Claude Opus 5.5 for Phases 0 and 2 only.** These need taste and a coherent concept, and (if you pick concept A) the Three.js scene code. The extra cost is worth it there.
- **Fable 5.1:** not needed. Use it only if concept A stalls on the 3D work.
- Haiku 5.5 is too weak for the design judgement this needs.

Pair the model with the `impeccable` skill for Phases 0 and 5.

## 7. Evidence and limits of this analysis
- Observed: the request list (Chromium 157 via REA), HTML, CSS, and the head of the JS files. Not read in full: `props.js`, `hardware.js`, `textures.js`, `fsn.js`, `softbreak.js`.
- Not observed: runtime visuals (no screenshot was taken), exact camera positions and timings, audio.
- Response bodies were fetched directly with `curl` from the URLs REA listed, because the REA scenario view does not return bodies.
