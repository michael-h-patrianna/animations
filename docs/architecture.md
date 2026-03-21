# Architecture Guide for LLM Coding Agents

**Purpose**: Instructions for where to put code and what patterns to follow in this animation library.

**Tech Stack**: React 19 + Motion (Framer Motion v12) + Vite 7 + TypeScript 5.9 + Tailwind CSS v4

---

## Where to Put New Code

```
src/
├── components/
│   ├── <category-id>/           # Animation categories (e.g., dialogs, progress, rewards)
│   │   ├── index.ts             # Category aggregation (exports categoryExport)
│   │   └── <group-id>/          # Animation groups (e.g., modal-base, loading-states)
│   │       ├── index.ts         # Group aggregation (exports groupExport via buildGroupExport)
│   │       ├── framer/          # Framer Motion animations
│   │       │   ├── ComponentName.tsx      # Animation component
│   │       │   └── ComponentName.meta.ts  # Metadata export
│   │       ├── css/             # CSS animations
│   │       │   ├── ComponentName.tsx      # Animation component
│   │       │   ├── ComponentName.meta.ts  # Metadata export
│   │       │   └── ComponentName.css      # Animation styles
│   │       ├── shared.css       # Shared group styles
│   │       └── MockContent.tsx  # Demo content components
│   ├── ui/                      # Catalog UI components
│   └── animationRegistry.ts     # Central registry (imports all categories)
├── services/                    # Data logic
├── hooks/                       # React hooks
├── types/                       # TypeScript types (see animation.ts for core types)
├── lib/                         # Build helpers (groupBuilder, sourceTransform, etc.)
├── motion/                      # Shared motion primitives
└── __tests__/                   # Unit tests
```

**Decision tree**:

- Creating new animation? → `src/components/<category>/<group>/{framer|css}/`
- Creating UI component? → `src/components/ui/`
- Creating React hook? → `src/hooks/`
- Creating data service? → `src/services/`
- Creating type definition? → `src/types/`
- Creating test? → `src/__tests__/` or co-locate with component

---

## How to Create a New Animation Component

### Step 1: Create the Component File

**Framer Motion** (`src/components/<category>/<group>/framer/GroupNameVariantName.tsx`):

```typescript
import * as m from 'motion/react-m'
import { MockModalContent } from '../MockModalContent'

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

**CSS** (`src/components/<category>/<group>/css/GroupNameVariantName.tsx`):

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
  id: 'group-name__variant-name',        // MUST match data-animation-id
  urlSlugFramer: '/group-name-framer?animation=group-name__variant-name',
  urlSlugCss: '/group-name-css?animation=group-name__variant-name',
  title: 'Human Readable Title',
  description: 'Describe the animation effect in detail.',
  tier: 2,                               // 1-4, see tier definitions in Serena memory
}
```

### Step 3: Done — No Manual Registration Required

Group `index.ts` files use `buildGroupExport` with `import.meta.glob` for **automatic discovery**. Adding a `.tsx` component and its `.meta.ts` file to the `framer/` or `css/` directory is sufficient. No imports or index edits needed.

---

## How to Create a New Animation Group

**Steps**:

1. Create folder: `src/components/<category>/<new-group>/`
2. Create subfolders: `framer/` and `css/`
3. Create `shared.css` with group-level layout styles
4. Create `index.ts` with template below
5. Add animations to subfolders
6. Import and add to category's `index.ts`

**Group Index Template** (`src/components/<category>/<new-group>/index.ts`):

```typescript
import './shared.css'
import type { AnimationMetadata, GroupMetadata } from '@/types/animation'
import { buildGroupExport } from '@/lib/groupBuilder'

// Side-effect: load framer-variant CSS (layout only — animation CSS banned by lint)
import.meta.glob('./framer/*.css', { eager: true })

const metadata: GroupMetadata = {
  id: 'new-group',
  title: 'New Group Title',
  demo: 'Description of group purpose',
}

export const groupExport = buildGroupExport(
  metadata,
  import.meta.glob<Record<string, unknown>>('./framer/*.tsx'),
  import.meta.glob<{ metadata: AnimationMetadata }>('./framer/*.meta.ts', { eager: true }),
  import.meta.glob<Record<string, unknown>>('./css/*.tsx'),
  import.meta.glob<{ metadata: AnimationMetadata }>('./css/*.meta.ts', { eager: true }),
  {
    framerTsx: import.meta.glob<string>('./framer/*.tsx', { query: '?raw', import: 'default' }),
    framerCss: import.meta.glob<string>('./framer/*.css', { query: '?raw', import: 'default' }),
    cssTsx: import.meta.glob<string>('./css/*.tsx', { query: '?raw', import: 'default' }),
    cssCss: import.meta.glob<string>('./css/*.css', { query: '?raw', import: 'default' }),
    shared: import.meta.glob<string>('./*.{ts,tsx}', { query: '?raw', import: 'default' }),
  }
)
```

---

## How to Create a New Category

**Steps**:

1. Create folder: `src/components/<new-category>/`
2. Create group subfolders with animations
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

## Naming & Rendering Rules

See `docs/meta/styleguide.md` for the full naming conventions table and animation component rules.

Key patterns visible in templates above:
- Folders: `kebab-case` — Component files: `PascalCase` — IDs: `group-name__variant-name`
- Root element must have `data-animation-id` matching metadata `id`
- Render only animation content (AnimationCard handles presentation)

---

## On-Demand References

| Detail | Serena Memory |
|-|-|
| Tier 1-4 definitions | `project_tier_definitions` (also in auto-memory) |
| Animation design principles | `animation_design_principles` |
| Full type definitions | Read `src/types/animation.ts` directly |
