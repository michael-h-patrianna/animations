# ADR-010: PixiJS + GSAP Runtime for Embedded Games

**Status**: Accepted

**Date**: 2026-05-04

## Context

The catalog originally served two runtimes:

- `css/` — CSS + React for web applications
- `framer/` — Motion + React as the starting point for React Native Moti/Reanimated ports

Embedded games introduce a third use case. These games run in React Native through a WebView, not through native Moti ports. They need canvas-native effects, batching, sprite/text control, and animation freedom that the React Native portability subset intentionally forbids.

## Decision

Add `pixijs/` as an optional third runtime for groups that need embedded-game variants.

- Baseline coverage remains `framer/` + `css/` for every animation.
- `pixijs/` is opt-in per group through category registration: `techs: ['framer', 'css', 'pixijs']`.
- URLs use the same pattern as existing runtimes: `/<group>-pixijs?animation=<animation-id>`.
- Metadata can include `urlSlugPixijs` and should tag PixiJS variants with `pixijs`.
- Generated group indexes include PixiJS globs only when a `pixijs/` folder exists.
- The left sidebar mode switch exposes `Framer`, `CSS`, and `PixiJS` when a group has that runtime.

## Runtime Pattern

Catalog cards mount PixiJS through `src/pixijs/PixiAnimationHost.tsx`.

The host owns catalog concerns:

- Create and destroy the PixiJS `Application`.
- Register GSAP PixiPlugin once.
- Pause animation when the card is offscreen.
- Limit device pixel ratio for preview canvases.
- Clean up timelines and display objects on unmount.

Animation files own portable game concerns:

- Define scene factories that accept a Pixi application/stage context.
- Use GSAP timelines for orchestration.
- Expose every consumer-tunable value as an optional prop.
- Keep scene code free of catalog UI assumptions.

A game developer can copy the React wrapper and host for standalone use, or copy the scene factory into an existing PixiJS game and call it against the game stage.

## Performance Rules

- Prefer one `PixiAnimationHost` canvas per visible catalog card. Current UI shows roughly 8 cards at once, so this is acceptable for previews.
- Do not allocate display objects continuously inside animation loops.
- Do not use unmanaged `app.ticker.add` in animation variants; centralize ticking in the host or GSAP.
- Do not mutate PixiJS `Text.text` or `Text.style` every frame. Pre-create glyph sprites when possible; counters may update text only when the displayed rounded value changes.
- Destroy timelines, textures, and display objects on unmount.
- Respect `prefers-reduced-motion` by shortening or simplifying timelines.

## Consequences

**Easier:**

- Game effects can use canvas-native rendering without weakening React Native portability rules for `framer/`.
- Developers can copy a PixiJS scene recipe directly into a PixiJS + GSAP game.
- Sidebar, URLs, source tabs, and metadata stay consistent across all runtimes.

**Harder:**

- PixiJS variants need lifecycle discipline: canvas creation, visibility pause, and cleanup are correctness requirements.
- Unit tests cannot prove WebGL rendering in happy-dom; canvas rendering needs browser/E2E checks.
- Source examples need explicit dependency closure because PixiJS variants often share scene/helper files.

## References

- `src/pixijs/PixiAnimationHost.tsx`
- `src/pixijs/registerGsapPixi.ts`
- `src/components/base/text-effects/pixijs/`
- `src/types/animation.ts` (`AnimationTech`)
- `src/lib/lazyGroupRegistry.ts` (`techs`)
- `scripts/codegen/generate-group-indexes.mjs`
