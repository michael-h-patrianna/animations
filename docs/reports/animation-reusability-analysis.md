# Animation Reusability Analysis

**Date**: 2026-03-22
**Scope**: ~174 dual-implementation animations across 17 groups in 5 categories

---

## Problem Statement

The catalog showcases animations ranging from simple CSS effects to full interactive scenes. The current tier system (1–4) measures copy-paste file complexity but fails to answer the questions users actually ask:

1. Where does this go in my component tree?
2. What can I configure?
3. What do I need to install/copy?
4. How do I trigger and control it?

## Current Tier Distribution

| Tier               | Count | Definition                                   |
| ------------------ | ----- | -------------------------------------------- |
| 1 (Effect)         | 22    | Copy CSS keyframes or Motion props           |
| 2 (Decorated)      | 29    | Copy component + CSS                         |
| 3 (Orchestration)  | 54    | Copy component + CSS + follow HTML structure |
| 4 (Full Component) | 69    | Copy entire group directory                  |

## Observed Integration Patterns

Regardless of tier, animations fall into four distinct integration patterns:

| Pattern            | User action                                          | Examples                                                            |
| ------------------ | ---------------------------------------------------- | ------------------------------------------------------------------- |
| **Element Effect** | Wrap or apply to any existing element                | `IconAnimationsBounce`, `ButtonEffectsRipple`, `TextEffectsVerbJog` |
| **Overlay Layer**  | Absolute-positioned layer triggered on demand        | `ConfettiBurst`, `Firework`, `CoinBurst`, `CoinMagnet`              |
| **Orchestration**  | Multi-element coordinator — user provides children   | `GridHighlight`, wizard-slide variants, stagger-inview              |
| **Full Scene**     | Self-contained component with own DOM, assets, state | `CardPackOpen`, `PrizeRevealArcanePortal`, `LightsCircleStatic*`    |

The tier system conflates these. `CoinBurst` (overlay layer, structurally simple to integrate) and `CardPackOpen` (full scene with state machine) are both tier 4.

## Why the Initial Taxonomy Proposal Was Wrong

An initial analysis proposed adding three metadata dimensions (`integration`, `spatialModel`, `customizable`) to all 174 animations. This was rejected for these reasons:

1. **Engineering taxonomy, not user solution.** `spatialModel: 'origin-target'` means nothing to someone building a mobile game. Users think in use cases ("coins fly from button to counter"), not coordinate models.

2. **Uniform customization interface is premature abstraction.** "Origin" means radial center for `CoinBurst`, start-of-path for `CoinTrail`, and nothing for `Firework`. A `customizable: { origin: boolean }` bag hides these differences.

3. **Metadata without component changes is theater.** Adding `integration: 'overlay-layer'` to `CoinBurst` metadata doesn't make it portable. The component still hardcodes pixel values, imports `@/assets`, and assumes AnimationCard's remount model.

4. **Waterfall phasing.** "Classify all 174 → extract props → fix UI" delivers zero value until all three phases complete. Bottom-up (design real APIs → derive patterns) is faster and higher-fidelity.

5. **Not all animations are the same product.** Element effects and full scenes need different distribution models, not a unified taxonomy.

## Correct Approach: Work Backwards From the Paste Moment

Design what the user pastes into their project and what they type to make it work. The consumer API IS the specification.

### Example: Collection Effects Consumer API

```tsx
// What a user writes in their app
<CoinMagnet
  from={buttonRef}          // RefObject<HTMLElement> | { x: number; y: number }
  to={balanceRef}           // RefObject<HTMLElement> | { x: number; y: number }
  count={12}                // particle count (default: 10)
  particleImages={["/coin.png", "/gem.png"]}  // up to 10, randomly chosen per particle
  onComplete={() => updateBalance()}
/>

// Fallback: no images provided → colored SVG confetti
<CoinMagnet from={buttonRef} to={balanceRef} />
```

This consumer API immediately reveals:

- The component needs `from` and `to` as ref or coordinate
- It needs image preloading before animation starts
- It needs a fallback particle renderer (SVG confetti)
- It needs an `onComplete` callback for integration with app state
- The special case where `from === to` must produce a radial burst, not a trajectory

### Process Per Complexity Band

1. **Pick one representative animation**
2. **Write the consumer JSX** — what does the user type?
3. **Write the TypeScript props interface** — what does the component accept?
4. **Refactor the component** to match the designed API
5. **Write the "Quick Start" snippet** the copy button produces
6. **Add demo elements** to AnimationCard/preview that visualize from/to points
7. **Validate** at card, desktop, and mobile preview sizes
8. **Derive taxonomy** from patterns that emerged across bands

### Demo Element Requirements

Animations that accept `from`/`to` refs need visual anchors in the catalog previews:

- **AnimationCard (small)**: Compact from/to indicators (e.g., small pill-shaped elements labeled "Source" and "Target") positioned to demonstrate the effect within the card's constrained space
- **Desktop preview**: Full-size from/to elements that behave like real UI components (button, balance counter) so users see how the animation integrates
- **Mobile preview**: Same from/to elements adapted for mobile viewport proportions

These demo elements are catalog concerns — they live in the group's `MockContent` or a shared `DemoAnchors` component, not in the animation component itself.

## Execution Order

Start with the **collection-effects** group (4 animations: CoinBurst, CoinMagnet, CoinTrail, CoinsFountain). These are overlay-layer particle effects with clear from/to semantics, representative of the highest-value refactoring pattern. Lessons learned here inform all other overlay-layer animations.

Then proceed to modal-celebrations (11 animations), then orchestrations, then remaining groups — each time applying and refining the patterns established in collection-effects.
