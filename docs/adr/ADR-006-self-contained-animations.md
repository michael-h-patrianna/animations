# ADR-006: Self-Contained Animation Components

**Status**: Accepted

**Date**: 2026-03-18

## Context

Each animation in this catalog is intended to be a drop-in component. A consumer should be able to copy an animation's files into their project and have it work without pulling in shared infrastructure from other animations. This is the core portability promise — animations travel independently.

The distinction that matters:

- **Animation code** — styles, layouts, sub-components, and logic that are structurally necessary for the animation to function. These must be self-contained within the animation's own files.
- **Demo scaffolding** — mock content, placeholder UI, and canvas wrappers that exist only to showcase the animation in this catalog. These may be shared because they are stripped when extracting an animation.

Today, several groups violate this boundary by sharing animation infrastructure across multiple animations within a group:

| Shared file                     | Lines | Animations depending on it           | Content                                                                                                       |
| ------------------------------- | ----- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `modal-celebrations/shared.css` | 216   | All 9 celebration animations         | Celebration layers, confetti shapes, firework elements, shockwave rings, spark rays                           |
| `modal-celebrations/utils.ts`   | 50+   | 20 imports across framer + css       | `randBetween`, `polarToXY`, `deg2rad`, `pickRandom`, `CELEBRATION_COLORS`, `GOLDEN_COLORS`, `CONFETTI_SHAPES` |
| `modal-base/shared.css`         | 157   | All modal-base animations            | Modal overlay, modal card, header/body/footer structure, buttons, badges                                      |
| `modal-content/shared.css`      | 191   | All modal-content animations         | Modal content layout and structural CSS                                                                       |
| `timer-effects/css/shared.css`  | 185   | Timer pill animations (CSS variants) | Pill container, countdown display, timer bar structure                                                        |
| `modal-dismiss/shared.css`      | 90    | Modal dismiss animations             | Dismiss overlay and layout                                                                                    |
| `button-effects/shared.css`     | 37    | Button effect animations             | Button demo container and `.pf-btn` base                                                                      |
| `standard-effects/shared.css`   | 33    | Standard effect animations           | Demo container and demo element styling                                                                       |

There are two categories of violation:

1. **Structural animation CSS** (`modal-celebrations/shared.css`, `timer-effects/css/shared.css`) — classes like `.pf-celebration__flash`, `.pf-celebration__confetti--star`, `.pf-timer-pill` define the visual structure of the animation itself. Without these, the animation doesn't render correctly. This violates self-containment.

2. **Demo scaffolding CSS** (`modal-base/shared.css`, `button-effects/shared.css`, `standard-effects/shared.css`) — classes like `.pf-modal-overlay`, `.pf-modal`, `.button-demo`, `.standard-demo-container` provide the showcase wrapper around the animation. These are catalog-specific and would be replaced by the consumer's own UI. This is acceptable to share.

The shared `utils.ts` files contain pure math helpers (`randBetween`, `deg2rad`, `polarToXY`) and color palette constants. These are trickier — the math is generic enough to inline or copy, but the color palettes are design tokens that belong to the animation's visual identity.

## Decision

### Principle

**Every animation component must be extractable by copying only its own files.** The set of files required is:

- The component `.tsx` file (in `framer/` or `css/`)
- Its `.meta.ts` metadata file
- Its `.css` file (CSS variants only)
- Any `*Parts.tsx` sub-component file that is exclusively used by this animation

Shared code at the group level is permitted only for **demo scaffolding** — content and layout that exists solely for the catalog showcase and would be replaced by the consumer's own UI.

### What must be self-contained

**CSS classes that define the animation's visual structure.** If removing a CSS class breaks the animation (not the demo wrapper), that class must live in the animation's own `.css` file or be defined inline.

**Sub-components that are part of the animation.** A `CrystalShatterParts.tsx` that only serves `PrizeRevealCrystalShatter.tsx` is fine at the group level — it moves with the animation. A `utils.ts` that serves 20 animations is not self-contained.

**Color palettes and design tokens used by the animation.** If an animation references `CELEBRATION_COLORS` or `GOLDEN_COLORS`, those values must be inlined or co-located, not imported from a shared group utility.

### What may be shared

**Mock content components** (`Mock*.tsx`) — `MockModalContent.tsx`, `MockContent.tsx`. These render placeholder UI ("New Creator Quest", "Accept", "Later") that the consumer replaces with their own content. Sharing these is expected and harmless.

**Demo layout wrappers** — CSS classes like `.pf-modal-overlay` (centers the modal in the demo canvas), `.button-demo` (centers the button), `.standard-demo-container` (centers the element). These provide the catalog's card layout context and are not part of the animation itself.

### Migration path for existing violations

This ADR does not require immediate refactoring. Existing shared files are grandfathered under the following conditions:

1. **No new shared animation CSS.** New animations must define all structural CSS in their own files. The `shared.css` pattern must not grow.
2. **No new shared utils across animations.** Math helpers like `randBetween` should be inlined or copied into the animation that uses them. A 4-line function is cheaper to duplicate than to share.
3. **Existing shared code is flagged for incremental migration.** When an animation is modified for any reason, its shared dependencies should be inlined into its own files at that time.

The priority order for migration:

1. `modal-celebrations/shared.css` (216 lines, 9 animations) — highest impact, structural animation CSS
2. `timer-effects/css/shared.css` (185 lines) — structural timer layout
3. `modal-celebrations/utils.ts` — inline `randBetween`/`deg2rad`/`pickRandom` (trivial), co-locate color palettes
4. Remaining `shared.css` files — audit which classes are demo scaffolding vs animation structure

### How to distinguish demo vs animation CSS

Apply this test: **if a consumer copies the animation into their own project and does not include this CSS class, does the animation itself break — or just the demo wrapper?**

- `.pf-modal-overlay` (grid centering in demo canvas) → demo scaffolding, consumer has their own modal container
- `.pf-celebration__confetti--star` (clip-path star shape) → animation structure, the confetti won't render correctly without it
- `.pf-btn` (button styling) → demo scaffolding, consumer has their own button
- `.pf-celebration__flash` (origin flash element with gradient and will-change) → animation structure

## Consequences

### Positive

- **True drop-in portability.** A team can grab an animation by copying 2-4 files. No hidden dependencies, no "also grab shared.css from two directories up."
- **Independent evolution.** Modifying one animation's structure can't accidentally break another animation in the same group.
- **Simpler mental model.** "Everything the animation needs is in its own files" is easy to verify and enforce.

### Negative

- **CSS duplication within groups.** Celebration animations will each define their own `.pf-celebration__confetti--star` clip-path. For 9 animations sharing 216 lines, this could add ~1500 lines total. This is an acceptable cost — the animations are lazy-loaded and tree-shaken, so only the CSS for the active animation is loaded.
- **Utility duplication.** `randBetween`, `deg2rad`, and `pickRandom` will appear in multiple files. These are 1-4 line functions. The duplication is negligible compared to the coupling they introduce when shared.
- **Migration effort.** 7 `shared.css` files across 6 groups need auditing and incremental inlining. This is not urgent but is ongoing work.

## References

- `modal-celebrations/shared.css` — primary violation (216 lines of animation infrastructure)
- `modal-celebrations/utils.ts` — shared math helpers and color palettes across 20 imports
- ADR-005 — related constraint on portable animation properties
- `eslint-rules/extra-rules.js` (`require-dual-implementation`) — enforces that each animation exists in both framer/ and css/ but does not enforce self-containment
