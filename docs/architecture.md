# Architecture Guide for LLM Coding Agents

**Purpose**: This document helps you make architectural decisions and locate/place code correctly in the animations project.

**Tech Stack**: React 19 + Motion (Framer Motion v12) + Vite 7 + Vitest 3 + Playwright + TypeScript 5.8

---

## Core Architectural Principles

### 1. Co-Located Metadata System
**Mental Model**: Folder structure IS the single source of truth. Each component exports its own metadata alongside the implementation.

**Decision Rule**: Never create external config files (JSON, YAML) for animation metadata. Always export metadata from the component file itself.

**Pattern**:
```typescript
// Component exports metadata next to implementation
export const metadata: AnimationMetadata = {
  id: 'modal-base__scale-gentle-pop',
  title: 'Gentle Pop',
  description: 'A smooth scaling animation with gentle easing',
  tags: ['scale', 'modal', 'gentle'],
  disableReplay: false
}
```

### 2. Hierarchical Aggregation Pattern
**Mental Model**: Data flows up through three aggregation levels: Component → Group → Category → Central Registry

**Hierarchy**:
```
Category (dialogs)
  ├─ Group (modal-base)
  │   ├─ Framer animations (modal-base__scale-gentle-pop, etc.)
  │   └─ CSS animations (modal-base__scale-gentle-pop, etc.)
  └─ Group (modal-content)
      ├─ Framer animations
      └─ CSS animations
```

**Decision Rule**:
- Component level: Export metadata + component
- Group level: Import all animations, export groupExport
- Category level: Import all groups, export categoryExport
- Central registry: Import all categories, export categories object

---

## Where to Put New Code

### Folder Structure Pattern
```
src/
├─ components/
│  ├─ <category-id>/           # Category folder (e.g., dialogs, progress, rewards)
│  │  ├─ index.ts               # Category aggregation (exports categoryExport)
│  │  └─ <group-id>/            # Group folder (e.g., modal-base, modal-content)
│  │     ├─ index.ts            # Group aggregation (exports groupExport)
│  │     ├─ framer/             # Framer Motion animations
│  │     │  ├─ Component.tsx    # Animation component
│  │     │  └─ Component.meta.ts # Metadata export
│  │     ├─ css/                # CSS animations
│  │     │  ├─ Component.tsx    # Animation component
│  │     │  ├─ Component.meta.ts # Metadata export
│  │     │  └─ styles.css       # Component-specific styles
│  │     ├─ shared.css          # Shared group styles
│  │     └─ MockModalContent.tsx # Shared mock/demo components
│  ├─ ui/                       # Catalog UI components
│  │  ├─ CategorySection.tsx
│  │  ├─ GroupSection.tsx
│  │  └─ AnimationCard.tsx
│  └─ animationRegistry.ts      # Central registry
├─ services/
│  └─ animationData.ts          # Builds catalog from registry
├─ hooks/
│  └─ useAnimations.ts          # React hook for catalog data
├─ types/
│  └─ animation.ts              # Core types
└─ __tests__/                   # Vitest unit tests
```

### Decision Tree: "Where do I put X?"

**Adding a new animation variant to existing group?**
1. Navigate to `src/components/<category>/<group>/framer/` or `css/`
2. Create `ComponentName.tsx` (PascalCase of animation id)
3. Create `ComponentName.meta.ts` exporting metadata
4. Add to group's `index.ts` (import metadata, lazy load component, add to groupExport)

**Adding a new animation group to existing category?**
1. Create folder: `src/components/<category>/<new-group>/`
2. Create `index.ts` exporting `groupMetadata` and `groupExport`
3. Create `framer/` and/or `css/` subfolders
4. Add animations to subfolders
5. Import and add to category's `index.ts`

**Adding a new category?**
1. Create folder: `src/components/<new-category>/`
2. Create `index.ts` exporting `categoryMetadata` and `categoryExport`
3. Create group subfolders
4. Import and add to `src/components/animationRegistry.ts`

**Adding shared styles for a group?**
- Place in `src/components/<category>/<group>/shared.css`
- Import in components: `import '../shared.css'`

**Adding mock/demo content?**
- Place in `src/components/<category>/<group>/MockComponent.tsx`
- Import in animation components

**Adding a utility hook?**
- Place in `src/hooks/hookName.ts`
- Export from `src/hooks/index.ts` if needed

**Adding a service?**
- Place in `src/services/serviceName.ts`
- Keep services framework-agnostic (pure domain logic)

---

## Animation Component Patterns

### Two Technologies: Framer Motion and CSS

**Framer Motion Pattern** (recommended for complex animations):
```typescript
// src/components/dialogs/modal-base/framer/ModalBaseScaleGentlePop.tsx
import * as m from 'motion/react-m'
import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import { overlayStyles } from '@/motion/primitives'

export function ModalBaseScaleGentlePop() {
  return (
    <m.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.42, ease: [0.12, 0.75, 0.4, 1] }}
      style={overlayStyles.standard}
      data-animation-id="modal-base__scale-gentle-pop"
    >
      <div className="pf-modal-center">
        <m.div
          className="pf-modal"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <MockModalContent />
        </m.div>
      </div>
    </m.div>
  )
}
```

**CSS Pattern** (recommended for simpler animations):
```typescript
// src/components/dialogs/modal-base/css/ModalBaseScaleGentlePop.tsx
import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import './ModalBaseScaleGentlePop.css'

export function ModalBaseScaleGentlePop() {
  return (
    <div
      className="pf-modal-overlay pf-modal-overlay--scale-gentle-pop"
      data-animation-id="modal-base__scale-gentle-pop"
    >
      <div className="pf-modal-center">
        <div className="pf-modal pf-modal--scale-gentle-pop">
          <MockModalContent />
        </div>
      </div>
    </div>
  )
}
```

**Key Points**:
- Always include `data-animation-id` attribute
- Framer: Use `motion/react-m` import (optimized)
- CSS: Create separate `.css` file with animation
- Import shared styles from parent group folder
- Components render deterministic DOM
- Replay handled by remounting (key toggle in AnimationCard)

---

## Metadata Export Pattern

### Component-Level Metadata
```typescript
// ComponentName.meta.ts
import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'category-group__variant-name',  // Unique ID: category-group__variant
  title: 'Human Readable Title',
  description: 'Detailed description of animation behavior',
  tags: ['tag1', 'tag2', 'tag3'],      // For search/filtering
  disableReplay: false                  // Optional: disable replay button
}
```

**Naming Convention**:
- **ID Format**: `{group}__{variant-name}` (kebab-case, double underscore separator)
- **File Name**: PascalCase version of ID (e.g., `ModalBaseScaleGentlePop.tsx`)
- **Component Name**: PascalCase version of ID

### Group-Level Aggregation
```typescript
// src/components/dialogs/modal-base/index.ts
import type { GroupExport, GroupMetadata } from '@/types/animation'
import { lazy } from 'react'

// Import metadata only (NOT components)
import { metadata as scaleGentlePopMetadata } from './framer/ModalBaseScaleGentlePop.meta'
import { metadata as scaleGentlePopCSSMetadata } from './css/ModalBaseScaleGentlePop.meta'

// Lazy load components
const ModalBaseScaleGentlePop = lazy(() =>
  import('./framer/ModalBaseScaleGentlePop').then((m) => ({ default: m.ModalBaseScaleGentlePop }))
)
const ModalBaseScaleGentlePopCSS = lazy(() =>
  import('./css/ModalBaseScaleGentlePop').then((m) => ({ default: m.ModalBaseScaleGentlePop }))
)

export const groupMetadata: GroupMetadata = {
  id: 'modal-base',
  title: 'Base modal animations',
  tech: 'framer',  // Primary tech: 'framer' | 'css' | 'js'
  demo: 'modalBaseFramer',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    'modal-base__scale-gentle-pop': {
      component: ModalBaseScaleGentlePop,
      metadata: scaleGentlePopMetadata,
    },
  },
  css: {
    'modal-base__scale-gentle-pop': {
      component: ModalBaseScaleGentlePopCSS,
      metadata: scaleGentlePopCSSMetadata,
    },
  },
}
```

**Key Points**:
- Import metadata eagerly (small, needed immediately)
- Lazy load components (large, needed on-demand)
- Separate `framer` and `css` objects
- Same animation ID can exist in both framer and css

### Category-Level Aggregation
```typescript
// src/components/dialogs/index.ts
import type { CategoryExport, CategoryMetadata } from '@/types/animation'
import { groupExport as modalBaseGroup } from './modal-base'
import { groupExport as modalContentGroup } from './modal-content'

export const categoryMetadata: CategoryMetadata = {
  id: 'dialogs',
  title: 'Dialog & Modal Animations',
}

export const categoryExport: CategoryExport = {
  metadata: categoryMetadata,
  groups: {
    'modal-base': modalBaseGroup,
    'modal-content': modalContentGroup,
  },
}
```

### Central Registry
```typescript
// src/components/animationRegistry.ts
import type { CategoryExport } from '@/types/animation'
import { categoryExport as baseCategory } from '@/components/base'
import { categoryExport as dialogsCategory } from '@/components/dialogs'

export const categories: Record<string, CategoryExport> = {
  base: baseCategory,
  dialogs: dialogsCategory,
}

// Helper: Build flat registry (id → component)
export function buildRegistryFromCategories() {
  const registry: Record<string, React.ComponentType<Record<string, unknown>>> = {}
  Object.values(categories).forEach((cat) => {
    Object.values(cat.groups).forEach((group) => {
      if (group.framer) {
        Object.entries(group.framer).forEach(([id, anim]) => {
          registry[id] = anim.component
        })
      }
      if (group.css) {
        Object.entries(group.css).forEach(([id, anim]) => {
          registry[id] = anim.component
        })
      }
    })
  })
  return registry
}

// Helper: Get metadata by animation ID
export function getAnimationMetadata(animationId: string) {
  for (const cat of Object.values(categories)) {
    for (const group of Object.values(cat.groups)) {
      if (group.framer && group.framer[animationId]) {
        return group.framer[animationId].metadata
      }
      if (group.css && group.css[animationId]) {
        return group.css[animationId].metadata
      }
    }
  }
  return null
}
```

---

## Data Flow Pattern

### 1. Component Exports Metadata
```typescript
// Component.meta.ts
export const metadata = { id, title, description, tags }
```

### 2. Group Aggregates Components
```typescript
// group/index.ts
export const groupExport = {
  metadata: groupMetadata,
  framer: { [id]: { component, metadata } },
  css: { [id]: { component, metadata } },
}
```

### 3. Category Aggregates Groups
```typescript
// category/index.ts
export const categoryExport = {
  metadata: categoryMetadata,
  groups: { [groupId]: groupExport },
}
```

### 4. Central Registry Aggregates Categories
```typescript
// animationRegistry.ts
export const categories = { [categoryId]: categoryExport }
```

### 5. Data Service Transforms for UI
```typescript
// services/animationData.ts
// Transforms hierarchical registry → flat Category[] for UI
const buildCatalogFromCategories = (): Category[] => {
  return Object.values(categories).map(cat => ({
    id: cat.metadata.id,
    title: cat.metadata.title,
    groups: Object.values(cat.groups).flatMap(group => {
      // Creates SEPARATE groups for Framer and CSS
      // e.g., "modal-base-framer" and "modal-base-css"
    })
  }))
}
```

### 6. UI Consumption
```typescript
// Components use hooks to get catalog data
const { categories } = useAnimations()

// GroupSection uses registry to render animations
const registry = buildRegistryFromCategories()
const Component = registry[animationId]
```

---

## Rendering Context

### AnimationCard Wrapper
**Pattern**: Animation components render as children of `<AnimationCard>` in `GroupSection`.

**AnimationCard provides**:
- Title and description display
- Replay button (remounts child via key toggle)
- `.pf-demo-canvas` wrapper for layout

**Your animation component should**:
- NOT duplicate title/description/replay UI
- Render only the animation DOM
- Use `data-animation-id` attribute for debugging
- Handle replay by restarting animations when remounted

---

## Type System

### Core Types Location
```typescript
// src/types/animation.ts
export interface AnimationMetadata { /* ... */ }
export interface GroupMetadata { /* ... */ }
export interface CategoryMetadata { /* ... */ }
export interface AnimationExport { /* ... */ }
export interface GroupExport { /* ... */ }
export interface CategoryExport { /* ... */ }
export interface Animation { /* ... */ }
export interface Group { /* ... */ }
export interface Category { /* ... */ }
```

**Two Type Sets**:
1. **Component Metadata Types**: `AnimationMetadata`, `GroupMetadata`, `CategoryMetadata` (what components export)
2. **Export Types**: `AnimationExport`, `GroupExport`, `CategoryExport` (what aggregators export)
3. **UI Types**: `Animation`, `Group`, `Category` (what UI consumes)

---

## Styling Patterns

### Three Styling Approaches

**1. Shared Group Styles**
```css
/* src/components/dialogs/modal-base/shared.css */
.pf-modal-overlay { /* ... */ }
.pf-modal { /* ... */ }
```
- Import in all components: `import '../shared.css'`
- Use for common structure/layout

**2. Component-Specific Styles (CSS animations)**
```css
/* src/components/dialogs/modal-base/css/ModalBaseScaleGentlePop.css */
.pf-modal--scale-gentle-pop {
  animation: scale-gentle-pop 0.42s cubic-bezier(0.12, 0.75, 0.4, 1);
}
```
- Import in component: `import './ModalBaseScaleGentlePop.css'`

**3. Inline Styles (Framer Motion & dynamic values)**
```typescript
<m.div style={overlayStyles.standard} />
```
- Use for dynamic values
- Mirror theme tokens when possible

### Style Pattern Tokens (Recommended)
```typescript
import { stylePatternTokens } from '@/theme/tokens'

// Use predefined patterns
<div style={stylePatternTokens.flexCenter}>Centered</div>
<div style={stylePatternTokens.absoluteFill}>Full overlay</div>
```

---

## Common Patterns

### Pattern: Locating an Animation Component
Given animation ID `group__variant`:
1. Determine category from context (check which category folder)
2. Navigate: `src/components/<category>/<group>/framer/` or `css/`
3. File: PascalCase version (e.g., `GroupVariant.tsx`)

### Pattern: Adding New Animation to Existing Group
```bash
# 1. Create component files
touch src/components/dialogs/modal-base/framer/ModalBaseNewAnimation.tsx
touch src/components/dialogs/modal-base/framer/ModalBaseNewAnimation.meta.ts

# 2. Implement component (export function ModalBaseNewAnimation)
# 3. Export metadata (export const metadata: AnimationMetadata)
# 4. Add to group/index.ts (import, lazy load, add to groupExport.framer)
```

### Pattern: Creating New Group
```bash
# 1. Create group folder
mkdir -p src/components/dialogs/new-group/{framer,css}

# 2. Create group index
touch src/components/dialogs/new-group/index.ts

# 3. Implement groupMetadata and groupExport
# 4. Add to category/index.ts
```

---

## Quick Reference

### File Naming Conventions
| Type | Pattern | Example |
|------|---------|---------|
| Animation Component | PascalCase | `ModalBaseScaleGentlePop.tsx` |
| Metadata File | PascalCase + `.meta.ts` | `ModalBaseScaleGentlePop.meta.ts` |
| CSS File | PascalCase + `.css` | `ModalBaseScaleGentlePop.css` |
| Shared CSS | `shared.css` | `shared.css` |
| Mock Component | PascalCase + `Mock` prefix | `MockModalContent.tsx` |
| Animation ID | kebab-case + `__` | `modal-base__scale-gentle-pop` |

### Import Aliases
```typescript
'@' → '/src'
'@/components' → '/src/components'
'@/types' → '/src/types'
'@/hooks' → '/src/hooks'
'@/services' → '/src/services'
```

---

## Common Mistakes

❌ **Don't**: Create external JSON/YAML files for animation metadata
✅ **Do**: Export metadata from component files

❌ **Don't**: Import components eagerly in group index
✅ **Do**: Lazy load components, import metadata eagerly

❌ **Don't**: Put category ID in component metadata
✅ **Do**: Category/group IDs are implicit from folder structure

❌ **Don't**: Duplicate AnimationCard's title/description/replay UI in your component
✅ **Do**: Render only the animation DOM

❌ **Don't**: Use global CSS for component-specific animations
✅ **Do**: Co-locate CSS with components, use shared.css for group-wide styles

❌ **Don't**: Mix framer and css animations in same object
✅ **Do**: Separate into `groupExport.framer` and `groupExport.css`

❌ **Don't**: Hardcode animation behavior in central registry
✅ **Do**: Keep registry as pure aggregation, behavior in components

❌ **Don't**: Create monolithic components mixing multiple animations
✅ **Do**: One component per animation variant

---

## Performance Patterns

### Lazy Loading (Required)
```typescript
// ✅ Correct: Lazy load components
const Component = lazy(() => import('./Component').then(m => ({ default: m.Component })))

// ❌ Wrong: Eager import
import { Component } from './Component'
```

### Metadata Imports (Required)
```typescript
// ✅ Correct: Eager import metadata (small, needed immediately)
import { metadata } from './Component.meta'

// ❌ Wrong: Lazy load metadata
const metadata = lazy(() => import('./Component.meta'))
```

### Code Splitting
- Vite automatically splits by route and lazy imports
- Framer Motion components chunked separately
- See `vite.config.ts` for manual chunks configuration

---

## Debug Helpers

### Finding Component by ID
```typescript
import { getAnimationMetadata, buildRegistryFromCategories } from '@/components/animationRegistry'

const metadata = getAnimationMetadata('modal-base__scale-gentle-pop')
const Component = buildRegistryFromCategories()['modal-base__scale-gentle-pop']
```

### Viewing All Categories
```typescript
import { categories } from '@/components/animationRegistry'
console.log(Object.keys(categories)) // ['base', 'dialogs', 'progress', ...]
```

### Checking Animation Exists
```typescript
const animationId = 'modal-base__scale-gentle-pop'
const exists = getAnimationMetadata(animationId) !== null
```
