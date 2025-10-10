# Migration Completion Guide

## Current Status (as of completion)

### ✅ Completed (90 files with `tags: ['framer']`)
- All `base/standard-effects` - Framer Motion ✅
- All `base/text-effects` - Framer Motion ✅  
- All `base/button-effects` (except SplitReveal) - Framer Motion ✅
- All `dialogs/modal-base-framer` - Framer Motion ✅
- All `dialogs/modal-orchestration` - Framer Motion ✅
- All `realtime/realtime-data` - Framer Motion ✅
- All `realtime/update-indicators` - Framer Motion ✅
- All `dialogs/modal-content` - Framer Motion ✅
- `rewards/icon-animations` (4 files) - Framer Motion ✅
- `rewards/reward-basic` (10 files) - Framer Motion ✅
- Most `progress/loading-states` - Framer Motion ✅
- Some `dialogs/modal-dismiss` - Framer Motion ✅

### 🔄 Remaining Work (48 files still with `tags: ['css']`)

#### High Priority (essential animations):
1. **progress/loading-states** (4 skeleton files):
   - LoadingStatesSkeletonCard
   - LoadingStatesSkeletonHorizontal
   - LoadingStatesSkeletonTile
   - LoadingStatesSkeletonVertical

2. **progress/progress-bars** (6 files):
   - ProgressBarsProgressBounce
   - ProgressBarsProgressGradient
   - ProgressBarsProgressMilestones
   - ProgressBarsProgressSegmented
   - ProgressBarsProgressThin
   - ProgressBarsZoomedProgress

3. **dialogs/modal-dismiss** (7 files):
   - ModalDismissSnackbarScale
   - ModalDismissSnackbarWipe
   - ModalDismissToastDrop
   - ModalDismissToastFadeProgress
   - ModalDismissToastRaise
   - ModalDismissToastSlideLeft
   - ModalDismissToastSlideRight

#### Medium Priority (visual effects):
4. **misc/misc** (7 files):
   - MiscConcentricRings
   - MiscOrbitalPulse
   - MiscOscillatingDots
   - MiscPendulumWave
   - MiscPulsingGrid
   - MiscSequentialPulse
   - MiscSpiralGalaxy

#### Lower Priority (complex celebrations):
5. **rewards/lights** (8 files):
   - LightsCircleStatic1-8
   - Complex: 10+ @keyframes per file with CSS variables

6. **rewards/modal-celebrations** (15 files):
   - ModalCelebrationsCoinCascade
   - ModalCelebrationsCoinTrail
   - ModalCelebrationsCoinsArc
   - ModalCelebrationsCoinsFountain
   - ModalCelebrationsCoinsSwirl
   - ModalCelebrationsConfettiBurst
   - ModalCelebrationsConfettiPulse
   - ModalCelebrationsConfettiRain
   - ModalCelebrationsConfettiSpiral
   - ModalCelebrationsFireworksRing
   - ModalCelebrationsFireworksTriple
   - ModalCelebrationsJackpotCelebration
   - ModalCelebrationsMultiCoin
   - ModalCelebrationsRewardSpotlight
   - ModalCelebrationsTreasureParticles

7. **base/button-effects** (1 file):
   - ButtonEffectsSplitReveal

## Migration Pattern (Copy-Paste Template)

For each remaining file:

### Step 1: Update TSX File

```tsx
import { motion, useReducedMotion } from 'framer-motion'
import type { AnimationMetadata } from '@/types/animation'
import './ComponentName.css'

export function ComponentName() {
  const shouldReduceMotion = useReducedMotion()
  
  // Define animation variants
  const variants = {
    animate: {
      // Convert CSS keyframes values here
      scale: [1, 1.2, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
        times: [0, 0.5, 1],
      },
    },
  }
  
  // Provide static fallback for reduced motion
  if (shouldReduceMotion) {
    return (
      <div className="component-wrapper">
        {/* Static version */}
      </div>
    )
  }
  
  // Animated version
  return (
    <motion.div
      className="component-wrapper"
      variants={variants}
      animate="animate"
    >
      {/* Animated content */}
    </motion.div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  id: 'category__component-name',
  title: 'Component Title',
  description: 'Description',
  tags: ['framer'], // ← CHANGED from ['css'] or ['js', 'css']
} satisfies AnimationMetadata
```

### Step 2: Update CSS File

Remove all @keyframes and animation properties:

```css
/* REMOVE THESE: */
@keyframes my-animation { ... }
.element { animation: my-animation 2s infinite; }
.element { animation-delay: 0.5s; }

/* KEEP THESE: */
.element {
  width: 100px;
  height: 100px;
  background: linear-gradient(...);
  border-radius: 50%;
  /* All structural/styling CSS */
}
```

### Step 3: Handle Pseudo-Elements

Convert `::before` and `::after` to real elements:

```tsx
// Before (CSS):
// .element::before { content: ''; animation: glow 2s; }

// After (TSX):
<div className="element">
  <motion.span className="element__glow" animate={{...}} />
  Content
</div>
```

## Testing Each Migration

After migrating each file:

```bash
# Visual test - view in browser
npm run dev

# Run tests
npm test -- ComponentName

# Verify no CSS tags remain
grep -r "tags: \['css'\]" src/components/
```

## Common Patterns

### Pattern 1: Simple Loop
```tsx
<motion.div
  animate={{ rotate: [0, 360] }}
  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
/>
```

### Pattern 2: Multi-Step Keyframes
```tsx
// CSS: 0% { scale: 0 } 50% { scale: 1.2 } 100% { scale: 1 }
<motion.div
  animate={{ scale: [0, 1.2, 1] }}
  transition={{ duration: 0.6, times: [0, 0.5, 1] }}
/>
```

### Pattern 3: Staggered Children
```tsx
<motion.div variants={{ visible: { transition: { staggerChildren: 0.1 }}}}>
  {items.map((item, i) => (
    <motion.div
      key={i}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }}
    />
  ))}
</motion.div>
```

### Pattern 4: JS-Controlled Looping
```tsx
const [key, setKey] = useState(0)

useEffect(() => {
  const interval = setInterval(() => setKey(k => k + 1), 2000)
  return () => clearInterval(interval)
}, [])

return <motion.div key={key} animate={{...}} />
```

## React Native Compatibility Notes

### ✅ Safe for React Native (via Moti/Reanimated):
- `scale`, `rotate`, `translateX`, `translateY`
- `opacity`
- Basic transforms

### ⚠️ Keep in CSS (NOT in motion props):
- `linear-gradient`, `radial-gradient`
- `box-shadow`, `filter`, `backdrop-filter`
- `clip-path`, `mask`

These will need separate React Native implementations later using:
- `react-native-linear-gradient` for gradients
- `react-native-shadow-2` for shadows
- Custom implementations for filters

## Final Verification

When all migrations are complete:

```bash
# Should return 0:
grep -r "tags: \['css'\]" src/components/ | wc -l
grep -r "tags: \['js', 'css'\]" src/components/ | wc -l
find src/components -name "*.css" -exec grep -l "@keyframes" {} \; | wc -l

# Should return ~138 (total migrated files):
grep -r "tags: \['framer'\]" src/components/ | wc -l

# All tests should pass:
npm test
```

## Estimated Time to Complete

- **High Priority** (17 files): 3-4 hours
- **Medium Priority** (7 files): 1-2 hours  
- **Lower Priority** (24 files): 6-8 hours

**Total**: 10-14 hours of focused work

## Documentation Created

1. `FRAMER_MIGRATION_GUIDE.md` - Technical patterns
2. `MIGRATION_STATUS.md` - Detailed status
3. `MIGRATION_SUMMARY.md` - Executive overview
4. `FINAL_MIGRATION_REPORT.md` - Complete audit
5. `MIGRATION_COMPLETION_GUIDE.md` - This file

