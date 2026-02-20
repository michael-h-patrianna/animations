# Animation Implementation Patterns

Code patterns for building and registering animations in the showcase catalog. Each pattern includes complete examples from the actual codebase.

## Component Patterns

### Motion+React Component

```tsx
// src/components/base/standard-effects/framer/StandardEffectsBounce.tsx
import { memo } from 'react'
import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'
import '../shared.css'

function StandardEffectsBounceComponent() {
  return (
    <div className="standard-demo-container">
      <m.div
        className="standard-demo-element"
        style={{ transformOrigin: 'center bottom' }}
        animate={{
          y: [0, 0, -30, -35, -30, 0, 0],
          scaleY: [1, 0.8, 1.1, 1.05, 1.02, 0.95, 1],
          scaleX: [1, 1.1, 0.95, 0.98, 0.99, 1.02, 1],
          rotate: [0, 0, 2, 1, -1, 0, 0],
        }}
        transition={{
          duration: 0.8,
          ease: easeInOut,
          times: [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1],
        }}
      >
        <div className="demo-text">Bounce</div>
      </m.div>
    </div>
  )
}

export const StandardEffectsBounce = memo(StandardEffectsBounceComponent)
```

### CSS+React Component

```tsx
// src/components/base/standard-effects/css/StandardEffectsBounce.tsx
import { memo } from 'react'
import '../shared.css'
import './StandardEffectsBounce.css'

function StandardEffectsBounceComponent() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element bounce-element">
        <div className="demo-text">Bounce</div>
      </div>
    </div>
  )
}

export const StandardEffectsBounce = memo(StandardEffectsBounceComponent)
```

```css
/* src/components/base/standard-effects/css/StandardEffectsBounce.css */
.bounce-element {
  transform-origin: center bottom;
  animation: bounce-effect 0.8s ease-in-out infinite;
  will-change: transform;
}

@keyframes bounce-effect {
  0%   { transform: translateY(0) scaleY(1) scaleX(1) rotate(0deg); }
  20%  { transform: translateY(0) scaleY(0.8) scaleX(1.1) rotate(0deg); }
  40%  { transform: translateY(-30px) scaleY(1.1) scaleX(0.95) rotate(2deg); }
  50%  { transform: translateY(-35px) scaleY(1.05) scaleX(0.98) rotate(1deg); }
  60%  { transform: translateY(-30px) scaleY(1.02) scaleX(0.99) rotate(-1deg); }
  80%  { transform: translateY(0) scaleY(0.95) scaleX(1.02) rotate(0deg); }
  100% { transform: translateY(0) scaleY(1) scaleX(1) rotate(0deg); }
}
```

### Metadata File

Both Motion and CSS variants share the same structure. Only `tags` differs.

```tsx
// framer/StandardEffectsBounce.meta.ts
import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'standard-effects__bounce',
  title: 'Bounce',
  description: 'Vertical bounce with squash-stretch deformation and tilt for playful feedback.',
  tags: ['framer'],
}
```

```tsx
// css/StandardEffectsBounce.meta.ts — same content except tags
export const metadata: AnimationMetadata = {
  id: 'standard-effects__bounce',
  title: 'Bounce',
  description: 'Vertical bounce with squash-stretch deformation and tilt for playful feedback.',
  tags: ['css'],
}
```

### Shared CSS (Per Group)

Each group has a `shared.css` at the group root providing demo container and element styles.

```css
/* src/components/base/standard-effects/shared.css */
.standard-demo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  position: relative;
}
.standard-demo-element {
  padding: 24px 32px;
  background: linear-gradient(135deg, rgba(236, 195, 255, 0.12) 0%, rgba(198, 255, 119, 0.08) 100%);
  border: 1px solid rgba(236, 195, 255, 0.24);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  position: relative;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
}
.demo-text {
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
}
```

---

## Registration Patterns

### Group Index

The group index imports metadata statically and lazy-loads components. It exports `groupMetadata` and `groupExport`.

```tsx
// src/components/base/standard-effects/index.ts
import type { GroupExport, GroupMetadata } from '@/types/animation'
import { lazy } from 'react'

// Static metadata imports
import { metadata as bounceMeta } from './framer/StandardEffectsBounce.meta'
import { metadata as bounceCssMeta } from './css/StandardEffectsBounce.meta'

// Lazy-loaded components (named export → default adapter)
const StandardEffectsBounce = lazy(() =>
  import('./framer/StandardEffectsBounce').then((m) => ({ default: m.StandardEffectsBounce }))
)
const CssStandardEffectsBounce = lazy(() =>
  import('./css/StandardEffectsBounce').then((m) => ({ default: m.StandardEffectsBounce }))
)

export const groupMetadata: GroupMetadata = {
  id: 'standard-effects',
  title: 'Standard effects',
  tech: 'framer',
  demo: 'standardEffects',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    'standard-effects__bounce': { component: StandardEffectsBounce, metadata: bounceMeta },
    // ... other framer animations
  },
  css: {
    'standard-effects__bounce': { component: CssStandardEffectsBounce, metadata: bounceCssMeta },
    // ... other CSS animations
  },
}
```

### Category Index

The category index aggregates group exports.

```tsx
// src/components/base/index.ts
import type { CategoryExport, CategoryMetadata } from '@/types/animation'
import { groupExport as textEffectsGroup } from './text-effects'
import { groupExport as standardEffectsGroup } from './standard-effects'
import { groupExport as buttonEffectsGroup } from './button-effects'

export const categoryMetadata: CategoryMetadata = {
  id: 'base',
  title: 'Base effects',
}

export const categoryExport: CategoryExport = {
  metadata: categoryMetadata,
  groups: {
    'text-effects': textEffectsGroup,
    'standard-effects': standardEffectsGroup,
    'button-effects': buttonEffectsGroup,
  }
}
```

### Central Registry

When adding a new category, register it in `src/components/animationRegistry.ts`:

```tsx
import { categoryExport as newCategory } from '@/components/<category-name>'

export const categories: Record<string, CategoryExport> = {
  // ... existing categories
  '<category-name>': newCategory,
}
```

---

## Complex Animation Patterns

### AnimatePresence for Mount/Unmount

```tsx
import { AnimatePresence, m } from 'motion/react'

<AnimatePresence mode="wait">
  {isVisible && (
    <m.div
      key="content"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </m.div>
  )}
</AnimatePresence>
```

### Staggered Children

```tsx
<m.div
  variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
  initial="hidden"
  animate="visible"
>
  {items.map((item) => (
    <m.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 15 } }
      }}
    />
  ))}
</m.div>
```

### Layered Animations (Primary + Secondary)

One primary animation communicates the main effect. Secondary animations support without competing.

```tsx
// Primary: element pops in with overshoot
<m.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: [0, 1.2, 1], opacity: 1 }}
  transition={{ type: 'spring', stiffness: 260, damping: 15 }}
>
  {/* Main content */}

  {/* Secondary: subtle glow pulse behind element */}
  <m.div
    className="glow-backdrop"
    animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.05, 0.95] }}
    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
  />
</m.div>
```

### Spring Transitions

```tsx
// Gentle entrance
transition={{ type: 'spring', stiffness: 120, damping: 14 }}

// Snappy feedback
transition={{ type: 'spring', stiffness: 260, damping: 20 }}

// Bouncy overshoot
transition={{ type: 'spring', stiffness: 300, damping: 10 }}
```

### CSS Looping Animation

```css
.element {
  animation: effect-name 1.5s ease-in-out infinite;
  will-change: transform;
}

@keyframes effect-name {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.05); }
}
```

---

## Anti-Patterns

| Do NOT | Do Instead |
|-|-|
| Copy reference components into `src/` | Study the technique, build fresh |
| Use default exports | Use named exports wrapped in `memo()` |
| Import `motion` from `motion/react` | Import `m` from `motion/react-m` |
| Put container/title/description in animation component | Let `AnimationCard` handle the wrapper |
| Use SCSS modules or `.module.css` | Use plain `.css` files |
| Animate `box-shadow`, `filter`, `clip-path` in CSS variant | Stick to `transform` and `opacity` for RN portability |
| Use `useMotionValue`/`useTransform` in Motion variant | Stick to declarative `animate`/`transition` for Moti portability |
| Create a Motion variant without a CSS variant (or vice versa) | Always implement both variants |
