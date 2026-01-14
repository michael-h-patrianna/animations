# Architecture Guide for LLM Coding Agents

**Purpose**: Instructions for where to put code and what patterns to follow in this animation library.

**Tech Stack**: React 19 + Motion (Framer Motion v12) + Vite 7 + TypeScript 5.8 + Tailwind CSS

---

## Where to Put New Code

```
src/
├── components/
│   ├── <category-id>/           # PUT animation categories HERE (e.g., dialogs, progress, rewards)
│   │   ├── index.ts             # Category aggregation (exports categoryExport)
│   │   └── <group-id>/          # PUT animation groups HERE (e.g., modal-base, loading-states)
│   │       ├── index.ts         # Group aggregation (exports groupExport)
│   │       ├── framer/          # PUT Framer Motion animations HERE
│   │       │   ├── ComponentName.tsx      # Animation component
│   │       │   └── ComponentName.meta.ts  # Metadata export
│   │       ├── css/             # PUT CSS animations HERE
│   │       │   ├── ComponentName.tsx      # Animation component
│   │       │   ├── ComponentName.meta.ts  # Metadata export
│   │       │   └── ComponentName.css      # Animation styles
│   │       ├── shared.css       # Shared group styles
│   │       └── MockContent.tsx  # Demo content components
│   ├── ui/                      # PUT catalog UI components HERE
│   └── animationRegistry.ts     # Central registry (imports all categories)
├── services/                    # PUT data logic HERE
├── hooks/                       # PUT React hooks HERE
├── types/                       # PUT TypeScript types HERE
├── motion/                      # PUT shared motion primitives HERE
└── __tests__/                   # PUT unit tests HERE
```

**Decision tree**:
- Creating new animation? → Put in `src/components/<category>/<group>/{framer|css}/`
- Creating UI component? → Put in `src/components/ui/`
- Creating React hook? → Put in `src/hooks/`
- Creating data service? → Put in `src/services/`
- Creating type definition? → Put in `src/types/`
- Creating test? → Put in `src/__tests__/` or co-locate with component

---

## How to Create a New Animation Component

### Step 1: Create the Component File

**Framer Motion Template** (`src/components/<category>/<group>/framer/GroupNameVariantName.tsx`):
```typescript
import * as m from 'motion/react-m'
import { MockModalContent } from '../MockModalContent'
import '../shared.css'

export function GroupNameVariantName() {
  return (
    <m.div
      className="pf-[element-type]"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.42, ease: [0.12, 0.75, 0.4, 1] }}
      data-animation-id="group-name__variant-name"
    >
      <MockModalContent />
    </m.div>
  )
}
```

**CSS Template** (`src/components/<category>/<group>/css/GroupNameVariantName.tsx`):
```typescript
import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import './GroupNameVariantName.css'

export function GroupNameVariantName() {
  return (
    <div
      className="pf-[element-type] pf-[element-type]--variant-name"
      data-animation-id="group-name__variant-name"
    >
      <MockModalContent />
    </div>
  )
}
```

### Step 2: Create the Metadata File

**Template** (`src/components/<category>/<group>/{framer|css}/GroupNameVariantName.meta.ts`):
```typescript
import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'group-name__variant-name',  // MUST match data-animation-id
  title: 'Human Readable Title',
  description: 'Describe the animation effect in detail.',
  tags: ['framer'],  // or ['css']
}
```

### Step 3: Register in Group Index

**Add to** `src/components/<category>/<group>/index.ts`:
```typescript
// Add import at top
import { metadata as variantNameMetadata } from './framer/GroupNameVariantName.meta'

// Add lazy component
const GroupNameVariantName = lazy(() =>
  import('./framer/GroupNameVariantName').then((m) => ({ default: m.GroupNameVariantName }))
)

// Add to groupExport.framer (or .css)
export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    // ... existing animations
    'group-name__variant-name': {
      component: GroupNameVariantName,
      metadata: variantNameMetadata,
    },
  },
  css: { /* ... */ },
}
```

---

## How to Create a New Animation Group

**Steps**:
1. Create folder: `src/components/<category>/<new-group>/`
2. Create subfolders: `framer/` and `css/`
3. Create `index.ts` with template below
4. Add animations to subfolders
5. Import and add to category's `index.ts`

**Group Index Template** (`src/components/<category>/<new-group>/index.ts`):
```typescript
import type { GroupExport, GroupMetadata } from '@/types/animation'
import { lazy } from 'react'

// Import metadata
import { metadata as exampleMetadata } from './framer/NewGroupExample.meta'

// Lazy load components
const NewGroupExample = lazy(() =>
  import('./framer/NewGroupExample').then((m) => ({ default: m.NewGroupExample }))
)

export const groupMetadata: GroupMetadata = {
  id: 'new-group',
  title: 'New Group Title',
  tech: 'framer',
  demo: 'Description of group purpose',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    'new-group__example': {
      component: NewGroupExample,
      metadata: exampleMetadata,
    },
  },
  css: {},
}
```

---

## How to Create a New Category

**Steps**:
1. Create folder: `src/components/<new-category>/`
2. Create group subfolders
3. Create `index.ts` with template below
4. Import and add to `src/components/animationRegistry.ts`

**Category Index Template** (`src/components/<new-category>/index.ts`):
```typescript
import type { CategoryExport, CategoryMetadata } from '@/types/animation'
import { groupExport as exampleGroup } from './example-group'

export const categoryMetadata: CategoryMetadata = {
  id: 'new-category',
  title: 'New Category Title',
}

export const categoryExport: CategoryExport = {
  metadata: categoryMetadata,
  groups: {
    'example-group': exampleGroup,
  },
}
```

**Add to Registry** (`src/components/animationRegistry.ts`):
```typescript
import { categoryExport as newCategory } from '@/components/new-category'

export const categories: Record<string, CategoryExport> = {
  // ... existing categories
  'new-category': newCategory,
}
```

---

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Category folder | `kebab-case` | `dialogs`, `progress` |
| Group folder | `kebab-case` | `modal-base`, `loading-states` |
| Component file | `PascalCase` | `ModalBaseScaleGentlePop.tsx` |
| Animation ID | `group-name__variant-name` | `modal-base__scale-gentle-pop` |
| CSS class | `pf-[element]--[modifier]` | `pf-modal--scale-gentle-pop` |

---

## Component Rendering Rules

**DO**:
- Always include `data-animation-id` attribute matching metadata id
- Import shared styles from parent group folder (`import '../shared.css'`)
- Use `motion/react-m` for Framer Motion (optimized import)
- Render only animation content (no cards, titles, replay buttons)
- Components are remounted for replay (key toggle by AnimationCard)

**DON'T**:
- Add margins, padding, or presentation wrappers
- Import components directly in App.tsx
- Create global CSS files (use group-scoped or component-scoped CSS)
- Use state for replay logic (handled by parent)

---

## Key Types Reference

```typescript
// Animation metadata exported by each component
interface AnimationMetadata {
  id: string          // Unique: group-name__variant-name
  title: string       // Human readable
  description: string // Detailed description
  tags: string[]      // e.g., ['framer'] or ['css']
  disableReplay?: boolean
}

// Group export from index.ts
interface GroupExport {
  metadata: GroupMetadata
  framer: Record<string, { component: ComponentType, metadata: AnimationMetadata }>
  css: Record<string, { component: ComponentType, metadata: AnimationMetadata }>
}

// Category export from index.ts
interface CategoryExport {
  metadata: CategoryMetadata
  groups: Record<string, GroupExport>
}
```

---

## Common Mistakes

❌ **Don't**: Create external JSON/YAML config files for animation metadata
✅ **Do**: Export metadata from `.meta.ts` file next to component

❌ **Don't**: Import animation components directly in App.tsx
✅ **Do**: Use `animationDataService` for catalog, `buildRegistryFromCategories()` for components

❌ **Don't**: Put styles in global App.css or index.css
✅ **Do**: Create group-scoped `shared.css` or component-scoped CSS files

❌ **Don't**: Add presentation wrappers (cards, titles) in animation components
✅ **Do**: Render only the animation content; AnimationCard handles presentation

❌ **Don't**: Forget `data-animation-id` attribute on root element
✅ **Do**: Always include it, matching the metadata id exactly

❌ **Don't**: Use `import { motion } from 'framer-motion'`
✅ **Do**: Use `import * as m from 'motion/react-m'` (optimized bundle)

❌ **Don't**: Name component files with kebab-case: `modal-base-scale-gentle-pop.tsx`
✅ **Do**: Use PascalCase: `ModalBaseScaleGentlePop.tsx`

❌ **Don't**: Skip the lazy loading pattern for components
✅ **Do**: Always lazy load in group index for code splitting
