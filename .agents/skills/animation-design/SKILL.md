---
name: animation-design
description: Design and implement new animations for the showcase catalog. Use when the user asks to add animations, transitions, motion design, or visual effects. Every animation is implemented twice — CSS+React and Motion+React — for cross-platform portability (web + React Native via Moti). Includes 198 example animations as technique reference. Examples are for study and inspiration, not for copying into the project.
---

## Instructions

Follow this workflow to design and implement new animations for the showcase catalog while preserving dual CSS/Motion parity and project conventions.

### Constitution (IMMUTABLE)

1. **DUAL IMPLEMENTATION.** Every animation produces two variants: a CSS+React component using `@keyframes` in a plain `.css` file, and a Motion+React component using `motion/react` v12. Both variants render identically.
2. **REFERENCES ARE EXAMPLES, NOT TEMPLATES.** The 198 animations in `reference/` are production examples that demonstrate techniques — motion curves, timing, keyframe sequences, composition. Study them for inspiration when creating new animations. Never paste reference code into the project. Extract the technique, then build fresh.
3. **THE PROJECT EXISTS TO CREATE NEW ANIMATIONS.** Every animation added to the showcase is an original creation. References inform technique; the user's request defines the animation. Name the animation's visual intent before building it.
4. **USE `motion/react`, NOT `framer-motion`.** Import as `import * as m from 'motion/react-m'` for components. Import helpers from `'motion/react'`. Use `<m.div>` never `<motion.div>`.
5. **SELF-CONTAINED COMPONENTS.** Each animation component renders only its own DOM and styles. The `AnimationCard` wrapper provides title, description, replay button, and `.pf-demo-canvas` container. Do not duplicate those inside the animation component.

## Dual-Implementation Workflow

### Phase 1 — Research Technique

Browse [catalog.md](catalog.md) for reference animations that use a similar motion pattern to what you are creating. These are examples to learn from, not components to reuse. Open the reference file and extract:
- Motion curves (easing, spring config)
- Timing (durations, delays)
- Keyframe sequences (value arrays)
- Layering (primary vs secondary animations)

Read [tokens.md](tokens.md) for standardized duration, easing, spring, and stagger values. If the animation you are creating has no close reference, design the motion from first principles using these tokens.

### Phase 2 — Build the Motion+React Variant

Create the component in the `framer/` subfolder of the target group.

**File structure** for a Motion variant:
```
src/components/<category>/<group>/framer/
  GroupNameVariantName.tsx      # Component
  GroupNameVariantName.meta.ts  # Metadata
```

**Component pattern:**
```tsx
import { memo } from 'react'
import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'
import '../shared.css'

function GroupNameVariantNameComponent() {
  return (
    <div className="<group>-demo-container">
      <m.div
        className="<group>-demo-element"
        animate={{ /* motion values */ }}
        transition={{ /* timing config */ }}
      >
        <div className="demo-text">Label</div>
      </m.div>
    </div>
  )
}

export const GroupNameVariantName = memo(GroupNameVariantNameComponent)
```

**Metadata pattern:**
```tsx
import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: '<group-id>__<variant-name>',
  title: 'Human-Readable Title',
  description: 'One sentence describing the visual effect and its use case.',
  tags: ['framer'],
}
```

**Portability constraint:** Use only `motion/react` APIs that have Moti equivalents. Allowed: `animate`, `transition` (spring/tween), `initial`, `exit`, `variants`, `AnimatePresence`. Avoid: `useMotionValue`, `useTransform`, `layout` animations, `drag` gestures — these lack direct Moti equivalents.

### Phase 3 — Build the CSS+React Variant

Create the matching component in the `css/` subfolder.

**File structure** for a CSS variant:
```
src/components/<category>/<group>/css/
  GroupNameVariantName.tsx   # Component
  GroupNameVariantName.meta.ts  # Metadata
  GroupNameVariantName.css   # Keyframes + animation classes
```

**Component pattern:**
```tsx
import { memo } from 'react'
import '../shared.css'
import './GroupNameVariantName.css'

function GroupNameVariantNameComponent() {
  return (
    <div className="<group>-demo-container">
      <div className="<group>-demo-element <variant>-element">
        <div className="demo-text">Label</div>
      </div>
    </div>
  )
}

export const GroupNameVariantName = memo(GroupNameVariantNameComponent)
```

**CSS pattern:**
```css
.<variant>-element {
  animation: <variant>-effect 0.8s ease-in-out;
  will-change: transform;
}

@keyframes <variant>-effect {
  0%   { transform: /* start */ ; }
  50%  { transform: /* peak */  ; }
  100% { transform: /* end */   ; }
}
```

**Metadata pattern** — identical to the Motion variant except `tags: ['css']`:
```tsx
import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: '<group-id>__<variant-name>',
  title: 'Human-Readable Title',
  description: 'One sentence describing the visual effect and its use case.',
  tags: ['css'],
}
```

**Portability constraint:** Use only CSS properties supported by React Native's `Animated` API: `transform` (translate, scale, rotate), `opacity`, `backgroundColor`. Avoid: `box-shadow` animation, `filter`, `clip-path`, `background-position` — these have no React Native equivalent.

### Phase 4 — Register in the Group Index

Open `src/components/<category>/<group>/index.ts`. Add:

1. Static import of both `.meta.ts` files
2. `React.lazy()` wrappers for both components
3. Entries in the `groupExport.framer` and `groupExport.css` maps

```tsx
// Add to existing imports
import { metadata as variantNameMeta } from './framer/GroupNameVariantName.meta'
import { metadata as variantNameCssMeta } from './css/GroupNameVariantName.meta'

// Add lazy-loaded components
const GroupNameVariantName = lazy(() =>
  import('./framer/GroupNameVariantName').then((m) => ({ default: m.GroupNameVariantName }))
)
const CssGroupNameVariantName = lazy(() =>
  import('./css/GroupNameVariantName').then((m) => ({ default: m.GroupNameVariantName }))
)

// Add to groupExport.framer:
'<group-id>__<variant-name>': { component: GroupNameVariantName, metadata: variantNameMeta },

// Add to groupExport.css:
'<group-id>__<variant-name>': { component: CssGroupNameVariantName, metadata: variantNameCssMeta },
```

If creating a new group or category, also create the group `index.ts` and category `index.ts` following the patterns in [patterns.md](patterns.md), and register the new category in `src/components/animationRegistry.ts`.

### Phase 5 — Verify

- [ ] Both variants render visually identical animation
- [ ] Motion variant uses only `motion/react` APIs with Moti equivalents
- [ ] CSS variant uses only properties supported by React Native's `Animated` API
- [ ] Both `.meta.ts` files have matching `id`, `title`, `description`; tags differ (`framer` vs `css`)
- [ ] Components are wrapped in `memo()`
- [ ] Components use named exports, not default exports
- [ ] Group index lazy-loads both components and registers both in `groupExport`
- [ ] No `position: fixed` — use `absolute` within container
- [ ] No `!important`
- [ ] No hardcoded colors if theme variables exist for that purpose
- [ ] Animation plays correctly on replay (remount via key change)

## Technical Constraints

### Allowed

| Technology | Usage |
|-|-|
| `motion/react` v12 | `m.div`, `AnimatePresence`, spring/tween transitions |
| `motion/react-m` | `import * as m from 'motion/react-m'` for lazy motion components |
| Plain CSS files | `@keyframes`, animation classes |
| `will-change` | On animated elements for GPU compositing |
| `memo()` | Wrap every animation component |

### Forbidden

| Technology | Reason |
|-|-|
| `framer-motion` | Deprecated package name; use `motion/react` |
| `<motion.div>` | Eagerly loads all features; use `<m.div>` |
| `gsap`, `anime.js`, `three.js`, `pixi.js` | External animation libraries not permitted |
| SCSS / `.module.css` | Project uses plain `.css` files |
| `position: fixed` | Breaks card containment |
| `!important` | Overrides cascade unpredictably |
| Default exports on components | Registry requires named exports |

## Supporting Files

| File | Read when |
|-|-|
| [catalog.md](catalog.md) | Choosing which animation technique to study |
| [tokens.md](tokens.md) | Tuning timing, easing, springs, staggers |
| [patterns.md](patterns.md) | Writing group/category registration code or complex animation patterns |
| `reference/` | Studying a specific technique's full implementation |

Each reference animation has both a `framer/` and `css/` implementation, plus a `.meta.ts` metadata file.
