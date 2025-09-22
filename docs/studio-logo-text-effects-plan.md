# Studio Logo Text Effects – Implementation Plan (Web + React Native Parity)

This document specifies how to implement a set of studio‑logo–inspired text effects within this repository’s conventions. It is designed to be self‑contained for a coding agent that did not read any prior conversation.

Scope and constraints:

- Platform: React + TypeScript (web). Animations should be portable to React Native with Reanimated/Moti.
- Strict constraints: Do NOT use SVG, masks, blur, clip‑path, or CSS filters. Only animate transforms, opacity, and color.
- Accessibility: Provide reduced‑motion variants (prefers‑reduced‑motion). Avoid discomfort (flicker/jitter minimal and brief).
- Performance: Precompute layout/metrics once. Animate transform/opacity only. Avoid per‑frame layout reads.
- Organization: This group lives under `text-effects/studio-logo`. Each animation is packaged as a standalone pair: one TSX component file and one namespaced CSS file (no shared utilities or shared CSS), optimized for copy‑paste into production.

Repository conventions (from README):

- Add new animation metadata to `docs/structure.json` (id, title, description, categoryId, groupId).
- Component files go in `src/components/<category-id>/<group-id>/` with PascalCase names.
- Register components in `src/components/animationRegistry.ts`.

## 1) Animations and IDs

Category: `text-effects`
Group: `studio-logo`
Directory: `src/components/text-effects/studio-logo/`

Proposed effects and IDs (id format shown inline; use PascalCase for filenames):

- text-effects—studio-logo\_\_LightSweepDraw → `LightSweepDraw.tsx`
- text-effects—studio-logo\_\_TwinSpotlightCallout → `TwinSpotlightCallout.tsx`
- text-effects—studio-logo\_\_ArcRiseConverge → `ArcRiseConverge.tsx`
- text-effects—studio-logo\_\_HorizonLightPass → `HorizonLightPass.tsx`
- text-effects—studio-logo\_\_IrisCenterReveal → `IrisCenterReveal.tsx`
- text-effects—studio-logo\_\_MetallicSpecularFlash → `MetallicSpecularFlash.tsx`
- text-effects—studio-logo\_\_ProjectorFlicker → `ProjectorFlicker.tsx`
- text-effects—studio-logo\_\_NeonPulseStabilize → `NeonPulseStabilize.tsx`
- text-effects—studio-logo\_\_CrestingWaveHighlight → `CrestingWaveHighlight.tsx`

Per‑animation CSS files (no group stylesheet). Example: `src/components/text-effects/studio-logo/LightSweepDraw.css`

## 2) Packaging pattern: lift‑and‑shift (no shared code)

Goal: A developer can copy exactly two files per animation (TSX + CSS) into a production app without touching any shared code.

For each animation:

- Files:
  - Component: `src/components/text-effects/studio-logo/<Name>.tsx`
  - Styles: `src/components/text-effects/studio-logo/<Name>.css`
- Component header must include a short block comment:
  - “Standalone: copy this file and <Name>.css into your app.”
  - “Runtime deps: react, framer-motion (or none if using requestAnimationFrame).”
  - “RN parity: transforms/opacity/color only; port with Reanimated/Moti.”
- No imports from project‑local shared utilities. Inline minimal helpers inside the component:
  - Simple grapheme split (`Array.from(text)`)
  - Small sweep/phase helper
  - Reduced‑motion check via `window.matchMedia('(prefers-reduced-motion)')` with prop override
- Namespaced CSS per animation to avoid collisions, e.g.:
  - `.studioLogo-<Name>` (container)
  - `.studioLogo-<Name>__letter` (letters)
- Accessibility:
  - Letter spans `aria-hidden="true"`
  - Container `aria-label={text}` or a visually hidden full string

Note: If DRY becomes desirable later, we can add a build step that generates these standalone files from shared utilities. For now, we optimize for ease of lift‑and‑shift.

## 3) Per‑animation specifications

Each spec includes purpose, props (with defaults), timeline, algorithm, implementation, edge cases, and acceptance criteria. All must adhere to: transforms/opacity/color only; no SVG/masks/blur/clip‑path/filters.

---

### 3.2 TwinSpotlightCallout

Purpose

- Two phase‑shifted virtual beams sweep; letters within proximity brighten/tilt briefly.

Props

- `text: string`
- `durationMs?: number = 1400`
- `beamGapPhase?: number = 0.35`
- `proximityWidth?: number = 0.1`
- `peakScale?: number = 1.05`
- `tiltDeg?: number = 2`
- `colorLift?: number = 0.2`
- `reducedMotion?: boolean`

Timeline

- 0–200ms: anticipation (container `scaleX: 0.99`).
- 200–1200ms: two sweeps pass with offset; letters peak near either beam.
- 1200–1400ms: settle.

Algorithm

- Compute two intensities (beam1, beam2) using `computeSweepIntensity` with a phase offset; intensity = `max(i1, i2)`.
- Map intensity to color lift, scale, and rotateZ (alternating sign by index for subtlety).

Implementation

- Same pattern as 3.1; just compute intensity from two beams.

Acceptance

- Letters visibly receive callouts twice across the word; motion is smooth, not flickery.

---

### 3.3 ArcRiseConverge

Purpose

- Letters rise along an implied arc, crest, then settle on the baseline.

Props

- `text: string`
- `durationMs?: number = 900`
- `arcHeightPx?: number = 14`
- `staggerMs?: number = 30`
- `overshootPx?: number = 2`

Timeline

- Staggered starts per letter; each letter moves Y along an arc‑like ease, overshoots slightly, then springs to baseline.

Algorithm

- For letter i, progress `p_i = clamp01((t - i*stagger)/duration)`. yOffset ≈ `arcHeight * (1 - cos(π * p_i))` mapped to up then back, plus a small overshoot below baseline, then spring to 0.

Implementation

- Index‑based; no metrics required. Use easing + spring settle.

Acceptance

- Clear arc‑like rise; landing is soft with minimal bounce.

---

### 3.7 ProjectorFlicker

Purpose

- Classic reel feel via micro‑jitter and brief brightness dips, then stabilize.

Props

- `text: string`
- `jitterPx?: number = 1`
- `jitterDeg?: number = 0.4`
- `flickerCount?: number = 2`
- `flickerDepth?: number = 0.2`
- `durationMs?: number = 1200`

Timeline

- 0–600ms: random jitter every ~30–60ms, 1–2 quick opacity dips.
- 600–1200ms: decay jitter; stabilize.

Algorithm

- Deterministic pseudo‑random sequence (seed from text hash) drives small container transforms and brief opacity dips. Amplitude decays over time.

Acceptance

- Subtle, non‑nauseating jitter; clear stabilization.

---

### 3.8 NeonPulseStabilize

Purpose

- Letters “charge on” with 2–3 flickers, then stabilize; optional idle micro pulse.

Props

- `text: string`
- `flickers?: number = 3`
- `pulseScaleY?: number = 0.02`
- `colorOn?: string` (brighter)
- `colorOff?: string` (darker)
- `durationMs?: number = 1000`
- `loopIdle?: boolean = false`

Timeline

- 0–600ms: staggered per‑letter flickers (opacity/color).
- 600–1000ms: steady on; optional slow pulse if `loopIdle`.

Algorithm

- Per‑letter timing offsets based on index. Pulse: long ease scaleY up/down at low amplitude.

Acceptance

- Intentional flicker; clean steady state; pulse barely perceptible if enabled.

---

### 3.9 CrestingWaveHighlight

Purpose

- A sinusoidal wave of emphasis moves across; letters scaleY/brighten at the crest.

Props

- `text: string`
- `durationMs?: number = 1200`
- `waveLength?: number = 0.35`
- `amplitudeScaleY?: number = 0.06`
- `colorLift?: number = 0.18`

Timeline

- 0–1000ms: one wave cycle L→R.
- 1000–1200ms: settle.

Algorithm

- phase = (centerX/width - t/D); intensity = 0.5*(1 + sin(2π*phase))^k (k>1 sharpens). Map to scaleY + color.

Acceptance

- Smooth, readable wave; no popping; gentle rest.

## 4) Implementation pattern (all components)

1. Render container (e.g., `motion.div`) with class `.studioLogo-<Name>` and `aria-label={text}`; render per‑letter spans `.studioLogo-<Name>__letter` (`aria-hidden="true").
2. After mount, measure centers (`useLetterMetrics`). Do not read layout during the animation.
3. Drive a clock for `durationMs` (Framer Motion or `requestAnimationFrame`).
4. For each letter, compute intensity by the chosen algorithm at current time.
5. Apply styles derived from intensity (transform, color, opacity).
6. On reduced motion, short‑circuit to a simpler fade/settle sequence.
7. Cleanup timers on unmount.

Each animation ships with its own namespaced CSS defining baseline layout/typography; dynamic styles are set inline or via CSS variables from the component.

## 5) Testing and QA

Unit tests (React Testing Library)

- Renders with typical inputs, empty string, single letter, and long text.
- Grapheme count equals number of rendered letter spans.
- Reduced motion path is taken when prop is set or system pref is detected.

Visual tests (Playwright)

- Deterministic timing snapshots at start/mid/end for each effect.
- Reduced‑motion snapshots confirm simplified behavior.

Performance checks

- With ~25–30 letters, verify only transform/opacity change over time (no layout thrash). Chrome DevTools performance timeline should not show repeated layout passes.

Accessibility

- Screen readers announce full text once (container label). Letter spans are hidden from accessibility tree.

## 6) Implementation order and effort

Recommended order

1. LightSweepDraw (foundation for sweep utilities)
2. MetallicSpecularFlash (narrow band, reuses sweep)
3. HorizonLightPass (band sweep variant)
4. IrisCenterReveal (center‑out variant)
5. ArcRiseConverge (index‑staggered, no metrics)
6. TwinSpotlightCallout (two beams)
7. CrestingWaveHighlight (sinusoidal)
8. NeonPulseStabilize (timed flickers)
9. ProjectorFlicker (jitter/flicker comfort)

Estimated effort (per effect after utilities exist): 1–3 hours each including tests and snapshots.

Dependencies

- None required beyond current stack. Optional: a small grapheme splitter if precise clusters are needed.

## 7) Notes for implementers (without repo context)

- Register each new component in `src/components/animationRegistry.ts` and add metadata to `docs/structure.json` with `categoryId: "text-effects"` and `groupId: "studio-logo"`.
- Keep everything transform/opacity/color only. Do not use SVG, masks, clip‑path, blur, or filters.
- Provide a reduced‑motion variant for every effect.
- Precompute letter metrics once and avoid layout reads during animation.
- For React Native, port logic using per‑letter Text wrappers and Reanimated/Moti transforms/opacity/color. If measuring exact centers is difficult, approximate by index with average letter width, or measure onLayout per letter.
