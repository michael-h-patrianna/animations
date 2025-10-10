# CSS @keyframes to Framer Motion Migration Guide

## Overview
This document tracks the systematic migration of all 89 animations from CSS @keyframes to Framer Motion for React Native iOS compatibility via Moti/Reanimated.

## Migration Status

### ✅ Completed (11/89 files)

#### base/standard-effects (5/5)
- ✅ StandardEffectsSoftPulse.tsx / .css
- ✅ StandardEffectsMorphPulse.tsx / .css
- ✅ StandardEffectsRadialPulse.tsx / .css
- ✅ StandardEffectsFlip.tsx / .css
- ✅ StandardEffectsPop.tsx / .css

#### base/button-effects (4/4)
- ✅ ButtonEffectsJitter.tsx / .css
- ✅ ButtonEffectsLiquidMorph.tsx / .css
- ✅ ButtonEffectsRipple.tsx / .css
- ✅ ButtonEffectsShockwave.tsx / .css

#### base/text-effects (2/2)
- ✅ TextEffectsWaveText.tsx / .css
- ✅ TextEffectsCounterIncrement.tsx / .css

### 🔄 Remaining (78/89 files)

#### dialogs/modal-content (8 files)
- ❌ ModalContentListVerticalWipe
- ❌ ModalContentListSpotlight
- ❌ ModalContentListSoftStagger
- ❌ ModalContentFormFieldRightReveal
- ❌ ModalContentFormFieldLeftReveal
- ❌ ModalContentFormFieldGradient
- ❌ ModalContentButtonsStagger3
- ❌ ModalContentButtonsStagger2

#### misc/misc (6 files)
- ❌ MiscPendulumWave
- ❌ MiscSpiralGalaxy
- ❌ MiscSequentialPulse
- ❌ MiscPulsingGrid
- ❌ MiscOscillatingDots
- ❌ MiscOrbitalPulse
- ❌ MiscConcentricRings

#### progress/loading-states (11 files)
- ❌ LoadingStatesSpinnerDualRing
- ❌ LoadingStatesSpinnerGalaxy
- ❌ LoadingStatesSpinnerOrbital
- ❌ LoadingStatesSkeletonVertical
- ❌ LoadingStatesSkeletonTile
- ❌ LoadingStatesSkeletonHorizontal
- ❌ LoadingStatesSkeletonCard
- ❌ LoadingStatesRingProgress
- ❌ LoadingStatesRingMulti
- ❌ LoadingStatesDotsRise
- ❌ LoadingStatesDotsPortal

#### progress/progress-bars (2 files)
- ❌ ProgressBarsZoomedProgress
- ❌ ProgressBarsProgressSpark

#### realtime/timer-effects (9 files)
- ❌ TimerEffectsPillCountdownGlitch
- ❌ TimerEffectsPillCountdownHeartbeat
- ❌ TimerEffectsTimerFlashSoft
- ❌ TimerEffectsTimerFlash
- ❌ TimerEffectsPillCountdownExtreme
- ❌ TimerEffectsPillCountdownStrong
- ❌ TimerEffectsPillCountdownMedium
- ❌ TimerEffectsPillCountdownSoft
- ❌ TimerEffectsTimerPulse

#### realtime/update-indicators (7 files)
- ❌ UpdateIndicatorsLivePing
- ❌ UpdateIndicatorsHomeIconDotSweep
- ❌ UpdateIndicatorsHomeIconDotRadar
- ❌ UpdateIndicatorsHomeIconDotPulse
- ❌ UpdateIndicatorsHomeIconDotBounce
- ❌ UpdateIndicatorsBadgePulse
- ❌ UpdateIndicatorsBadgePop

#### rewards/icon-animations (4 files)
- ❌ IconAnimationsPulse
- ❌ IconAnimationsShake
- ❌ IconAnimationsFloat
- ❌ IconAnimationsBounce

#### rewards/lights (8 files)
- ❌ LightsCircleStatic8
- ❌ LightsCircleStatic7
- ❌ LightsCircleStatic6
- ❌ LightsCircleStatic5
- ❌ LightsCircleStatic4
- ❌ LightsCircleStatic3
- ❌ LightsCircleStatic2
- ❌ LightsCircleStatic1

#### rewards/modal-celebrations (12 files)
- ❌ ModalCelebrationsRewardSpotlight
- ❌ ModalCelebrationsJackpotCelebration
- ❌ ModalCelebrationsFireworksTriple
- ❌ ModalCelebrationsFireworksRing
- ❌ ModalCelebrationsConfettiSpiral
- ❌ ModalCelebrationsConfettiRain
- ❌ ModalCelebrationsConfettiPulse
- ❌ ModalCelebrationsConfettiBurst
- ❌ ModalCelebrationsCoinsSwirl
- ❌ ModalCelebrationsCoinsFountain
- ❌ ModalCelebrationsCoinsArc
- ❌ ModalCelebrationsCoinTrail

#### rewards/reward-basic (10 files)
- ❌ RewardBasicStarRadiate
- ❌ RewardBasicStarBurst
- ❌ RewardBasicGlowPulse
- ❌ RewardBasicGlowOrbit
- ❌ RewardBasicCoinSpinSoft
- ❌ RewardBasicCoinSpinFast
- ❌ RewardBasicBounceSoft
- ❌ RewardBasicBounceEnergy
- ❌ RewardBasicBadgeSweep
- ❌ RewardBasicBadgeGlint

## Migration Pattern

Each migration follows this established pattern:

### 1. TSX File Changes

```typescript
// BEFORE
import type { AnimationMetadata } from '@/types/animation'
import './ComponentName.css'

export function ComponentName() {
  return (
    <div className="animated-element">Content</div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'category__animation-name',
  title: 'Animation Name',
  description: 'Description here.',
  tags: ['css'],
}

// AFTER
import type { AnimationMetadata } from '@/types/animation'
import { motion, useReducedMotion } from 'framer-motion'
import './ComponentName.css'

export function ComponentName() {
  const shouldReduceMotion = useReducedMotion()

  const animationVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
        times: [0, 0.5, 1],
      },
    },
  }

  if (shouldReduceMotion) {
    return <div className="animated-element">Content</div>
  }

  return (
    <motion.div
      className="animated-element"
      variants={animationVariants}
      animate="animate"
    >
      Content
    </motion.div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'category__animation-name',
  title: 'Animation Name',
  description: 'Description here.',
  tags: ['framer'],
}
```

### 2. CSS File Changes

```css
/* BEFORE */
.animated-element {
  animation: my-animation 2s ease-in-out infinite;
}

@keyframes my-animation {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

/* AFTER */
.animated-element {
  /* Animation handled by Framer Motion */
}

/* Remove @keyframes entirely, keep structural/color styles */
```

## Conversion Rules

### Transform Properties
- ✅ `transform: scale(x)` → `scale: x`
- ✅ `transform: rotate(deg)` → `rotate: deg`
- ✅ `transform: translateX(px)` → `x: px`
- ✅ `transform: translateY(px)` → `y: px`
- ✅ `opacity` → `opacity`

### Timing
- `animation-duration: 2s` → `duration: 2`
- `animation-delay: 1s` → `delay: 1`
- `animation-iteration-count: infinite` → `repeat: Infinity`
- `animation-timing-function: ease-in-out` → `ease: 'easeInOut'`

### Easing Functions
- `ease` → `'easeIn'`
- `ease-out` → `'easeOut'`
- `ease-in-out` → `'easeInOut'`
- `linear` → `'linear'`
- `cubic-bezier(a,b,c,d)` → `[a, b, c, d]`

### Array Animations (Keyframe Sequence)
```typescript
// CSS: 0%, 50%, 100%
scale: [1, 1.5, 1],
times: [0, 0.5, 1],
```

### React Native Compatibility Notes

#### ✅ Safe for React Native
- `scale`, `scaleX`, `scaleY`
- `rotate`, `rotateX`, `rotateY`, `rotateZ`
- `translateX`, `translateY`, `x`, `y`
- `opacity`

#### ⚠️ Avoid in Motion Props (keep in CSS for now)
- `linear-gradient`, `radial-gradient`
- `box-shadow`
- `filter`, `backdrop-filter`
- `clip-path`

These should remain in CSS files with a comment:
```css
/* TODO: Replace gradient with RN-compatible solution for native */
background: linear-gradient(...);
```

### Accessibility

Always include `useReducedMotion()` check:

```typescript
const shouldReduceMotion = useReducedMotion()

if (shouldReduceMotion) {
  return <div>Static content</div>
}
```

## Testing Checklist

After migrating each component:

1. ✅ Visual verification in browser
2. ✅ Check animation timing matches original
3. ✅ Verify reduced motion mode works
4. ✅ Ensure no @keyframes remain in CSS
5. ✅ Confirm metadata tags updated to `['framer']`
6. ✅ Check eslint-disable comment added for metadata

## Common Patterns

### Pattern 1: Simple Loop Animation
```typescript
const variants = {
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
}
```

### Pattern 2: Staggered Children
```typescript
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}
```

### Pattern 3: Click-Triggered Animation
```typescript
const [isAnimating, setIsAnimating] = useState(false)

const variants = {
  initial: { scale: 1 },
  animate: { scale: [1, 1.2, 1] },
}

<motion.button
  variants={variants}
  animate={isAnimating ? 'animate' : 'initial'}
  onClick={() => setIsAnimating(true)}
/>
```

### Pattern 4: Delayed Sequence
```typescript
const ringVariants = (delay: number) => ({
  animate: {
    scale: [0, 2],
    opacity: [1, 0],
    transition: {
      duration: 2,
      delay,
      repeat: Infinity,
    },
  },
})

{[0, 1, 2].map((i) => (
  <motion.div
    key={i}
    variants={ringVariants(i * 0.3)}
    animate="animate"
  />
))}
```

## Next Steps

### Immediate (Batch 1): High-Impact Categories
Priority order for remaining migrations:

1. **rewards/icon-animations** (4 files) - Simple, high-visibility
2. **rewards/reward-basic** (10 files) - Core reward animations
3. **progress/loading-states** (11 files) - Frequently used
4. **realtime/update-indicators** (7 files) - User feedback critical

### Medium Term (Batch 2): Modal & Dialog Enhancements
5. **dialogs/modal-content** (8 files)
6. **rewards/modal-celebrations** (12 files)

### Final Polish (Batch 3): Complex Animations
7. **misc/misc** (6 files) - Experimental/decorative
8. **rewards/lights** (8 files) - Background effects
9. **realtime/timer-effects** (9 files) - Time-sensitive
10. **progress/progress-bars** (2 files)

## Automation Opportunities

For future migrations, consider:

1. **AST-based transformation** using `jscodeshift` or `ts-morph`
2. **CSS parser** to extract @keyframes and generate variants
3. **Template generator** for common animation patterns
4. **Batch testing script** to verify all animations render

## Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Moti (Framer Motion for React Native)](https://moti.fyi/)
- [Project: /src/motion/primitives.ts](./src/motion/primitives.ts)
- [Project: /src/motion/tokens.ts](./src/motion/tokens.ts)

## Notes

- Shared CSS files (like `shared.css`) are intentional UI scaffolding and should be preserved
- Each component should be self-contained (developer can copy component + its CSS)
- Gradients and shadows stay in CSS for now with TODO comments for React Native
- All migrations maintain backward compatibility through `useReducedMotion()`
