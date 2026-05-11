# ADR-005: Ban Blur and Non-Linear Gradients as Animated Properties

**Status**: Accepted

**Date**: 2026-03-18

## Context

This project maintains baseline CSS+React and Motion+React implementations of every animation. The `framer/` variants are the canonical source for future React Native portability via Moti/Reanimated. Optional `pixijs/` variants are embedded-game/WebView variants and are outside the React Native portability subset.

React Native's animation ecosystem (Reanimated 3 + Moti) operates under hard constraints:

1. **Blur is not animatable.** React Native has no `filter: blur()` or `backdrop-filter`. The `@react-native-community/blur` package provides a static `BlurView`, but it cannot be driven by Reanimated shared values. Animating blur on mobile also causes severe GPU pipeline stalls — each frame requires a full-screen texture read, gaussian convolution, and composite — dropping well below 60fps on mid-tier devices.

2. **Radial and conic gradients do not exist in React Native.** `expo-linear-gradient` and `react-native-linear-gradient` only support linear gradients. `react-native-svg` can approximate radial gradients via `<RadialGradient>`, but SVG gradients cannot be animated via Reanimated shared values — they require full re-renders, defeating the native animation thread.

3. **Gradient transitions are not animatable.** Even `linear-gradient` cannot be interpolated in React Native. On web, CSS gradient transitions require hacks (pseudo-element opacity crossfade). In Reanimated, gradient stops are not shared values. Any animation that transitions between gradient states has no portable path.

The project already enforces these constraints via custom lint rules:

- `animation-rules/no-blur-animation` (ESLint) — bans `blur()` in JS/TS
- `animation-rules/no-radial-angular-gradient` (ESLint) — bans `radial-gradient()` and `conic-gradient()` in JS/TS
- `animation-rules/no-blur` (Stylelint) — bans `blur()` in CSS
- `animation-rules/no-radial-angular-gradient` (Stylelint) — bans radial/conic gradients in CSS

However, 13 inline `eslint-disable` suppressions exist across 8 files, all using `radial-gradient()` for **static** background styling (bulb glow appearance, progress bar highlights, ring effects). These are not animated gradient transitions — the gradient value is set once and never interpolated. The distinction matters.

## Decision

### What is banned

**Blur as an animated property.** No `framer/` or `css/` animation may use `filter: blur()`, `backdrop-filter: blur()`, or any blur function in a value that changes over time (keyframes, motion values, transition targets).

**Radial and conic gradients as animated properties.** No `framer/` or `css/` animation may transition between gradient states, animate gradient stops, or use radial/conic gradients in motion values.

**PixiJS exception.** `pixijs/` variants render into canvas for WebView games. They may use canvas-native blur, glow, masks, shaders, and gradients when the effect is performant and cleaned up correctly. Do not import those choices back into `framer/` or `css/`.

**All blur and gradient usage in CSS files.** The Stylelint rules remain absolute — CSS files must not contain `blur()`, `radial-gradient()`, or `conic-gradient()` under any circumstances.

### What is permitted

**Static radial gradients in JS/TS inline styles**, where the gradient is a fixed background that does not change during the animation lifecycle. These exist today in 8 components for visual effects like:

- Bulb glow appearance (`LightsCircleStatic1.tsx`) — radial gradient simulates light diffusion
- Progress bar edge highlights (`ProgressBarsProgressBounce.tsx`, `ProgressBarsProgressThin.tsx`) — radial gradient creates a soft highlight
- Milestone glow (`ProgressBarsProgressMilestones.tsx`) — radial gradient for ambient glow
- Level breakthrough rings (`TextEffectsLevelBreakthrough.tsx`) — radial gradient for ring burst effect

These static gradients can be ported to React Native using `react-native-svg` `<RadialGradient>` inside a non-animated `<Svg>` container, which is acceptable for static decorative elements.

### Enforcement

The existing lint rules remain as-is. The 13 inline suppressions for static radial gradients are **accepted** under this ADR — they must each carry a `-- justification` comment explaining that the gradient is static (not animated). New suppressions require the same justification and are limited to static-only usage.

No per-directory overrides are introduced. The inline suppression pattern is preferred here because:

1. It forces a conscious decision at each usage site.
2. It documents the justification at the point of use.
3. It avoids creating a "gradient-allowed zone" that could be abused for animated gradients.

### Migration path for React Native

When porting framer/ variants to Moti/Reanimated:

| Web pattern                           | Native replacement                                                       |
| ------------------------------------- | ------------------------------------------------------------------------ |
| `filter: blur(Xpx)`                   | Not portable. Use `opacity` fade or `scale` zoom instead.                |
| `backdrop-filter: blur()`             | Use `@react-native-community/blur` `BlurView` (static only).             |
| Static `radial-gradient()` background | `react-native-svg` `<Defs><RadialGradient>` in a non-animated container. |
| Static `conic-gradient()`             | `react-native-svg` `<Defs>` with stop-based approximation.               |
| Animated gradient transition          | Replace with opacity crossfade between two solid-color layers.           |

## Consequences

### Positive

- **Guaranteed portability.** Every framer/ animation can be translated to Reanimated without redesigning the core animation logic. Visual decorations may need native equivalents, but the animation itself is clean.
- **Mobile performance.** Eliminating blur from animations prevents the single most common cause of animation jank on mobile GPUs.
- **Explicit trade-offs.** Static gradient usage is visible via inline suppressions — anyone scanning the codebase can find and evaluate every exception.

### Negative

- **Visual fidelity ceiling.** Some web-native effects (frosted glass, radial glow animations, gaussian blur transitions) are permanently off-limits. Designers must work within the portable subset.
- **Inline suppression noise.** 13 suppressions across 8 files add visual clutter. This is an acceptable cost for the explicitness it provides.
- **Static vs animated distinction is manual.** The lint rules cannot automatically distinguish static radial-gradient usage from animated usage — enforcement relies on code review and the justification comments.

## References

- Reanimated 3 supported properties: transform, opacity, colors, layout — no filter, no gradient interpolation
- `expo-linear-gradient`: linear only, no radial/conic
- `@react-native-community/blur`: static blur only, not drivable by shared values
- ESLint rules: `eslint-rules/animation-rules.js` (no-blur-animation, no-radial-angular-gradient)
- Stylelint rules: `stylelint.config.js` (no-blur, no-radial-angular-gradient, no-hardcoded-colors)
