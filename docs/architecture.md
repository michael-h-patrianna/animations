# Animation Library Architecture

## Overview

This document describes the co-located metadata architecture for the animation component library.

## Core Principle: Folder Structure IS the Hierarchy

The folder structure directly defines the category → group → animation hierarchy:

```
src/components/
├─ base/                    # Category: "Base effects"
│  ├─ text-effects/         # Group: "Text effects"
│  │  ├─ TextEffectsWaveText.tsx
│  │  ├─ TextEffectsGlitchText.tsx
│  │  └─ index.ts           # Aggregates all text-effects animations
│  ├─ standard-effects/
│  └─ button-effects/
│  └─ index.ts             # Aggregates all base category groups
├─ dialogs/                 # Category: "Dialog & Modal Animations"
├─ progress/                # Category: "Progress & Loading Animations"
├─ realtime/                # Category: "Real-time Updates & Timers"
├─ rewards/                 # Category: "Game Elements & Rewards"
└─ misc/                    # Category: "Misc"
```

## Component-Level Metadata

Each animation component exports its metadata:

```typescript
// src/components/base/text-effects/TextEffectsWaveText.tsx
import type { AnimationMetadata } from '@/types/animation'

export function TextEffectsWaveText() {
  return <div>...</div>
}

export const metadata: AnimationMetadata = {
  id: 'text-effects__wave-text',
  title: 'Wave Text',
  description: 'Smooth undulating wave motion through characters',
  tags: ['framer'],
  disableReplay: false
}
```

## Group-Level Aggregation

Each group's `index.ts` aggregates all animations in that group:

```typescript
// src/components/base/text-effects/index.ts
import type { GroupExport, GroupMetadata } from '@/types/animation'
import { TextEffectsWaveText, metadata as waveTextMeta } from './TextEffectsWaveText'
import { TextEffectsGlitchText, metadata as glitchTextMeta } from './TextEffectsGlitchText'

export const groupMetadata: GroupMetadata = {
  id: 'text-effects',
  title: 'Text effects',
  tech: 'framer',
  demo: 'textEffects'
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  animations: {
    'text-effects__wave-text': { component: TextEffectsWaveText, metadata: waveTextMeta },
    'text-effects__glitch-text': { component: TextEffectsGlitchText, metadata: glitchTextMeta },
  }
}
```

## Category-Level Aggregation

Each category's `index.ts` aggregates all groups:

```typescript
// src/components/base/index.ts
import type { CategoryExport, CategoryMetadata } from '@/types/animation'
import { groupExport as textEffectsGroup } from './text-effects'
import { groupExport as standardEffectsGroup } from './standard-effects'

export const categoryMetadata: CategoryMetadata = {
  id: 'base',
  title: 'Base effects',
}

export const categoryExport: CategoryExport = {
  metadata: categoryMetadata,
  groups: {
    'text-effects': textEffectsGroup,
    'standard-effects': standardEffectsGroup,
  }
}
```

## Central Registry

`src/components/animationRegistry.ts` provides access to all animations:

```typescript
import { categoryExport as baseCategory } from './base'
import { categoryExport as dialogsCategory } from './dialogs'
// ... other categories

// Hierarchical registry
export const categories: Record<string, CategoryExport> = {
  'base': baseCategory,
  'dialogs': dialogsCategory,
  // ... all categories
}

// Helper functions
export function buildRegistryFromCategories() { ... }
export function getAnimationMetadata(animationId: string): AnimationMetadata | null { ... }
```

## Data Service

`src/services/animationData.ts` builds the catalog from category exports:

```typescript
import { categories } from '@/components/animationRegistry'

const buildCatalogFromCategories = (): Category[] => {
  return Object.values(categories).map(cat => ({
    id: cat.metadata.id,
    title: cat.metadata.title,
    groups: Object.values(cat.groups).map(group => ({
      id: group.metadata.id,
      title: group.metadata.title,
      animations: Object.values(group.animations).map(anim => ({
        id: anim.metadata.id,
        title: anim.metadata.title,
        description: anim.metadata.description,
        categoryId: cat.metadata.id,
        groupId: group.metadata.id,
        tags: anim.metadata.tags,
        disableReplay: anim.metadata.disableReplay,
      })),
    })),
  }))
}
```

## Benefits

### ✅ Single Source of Truth
- Metadata lives with component code
- Folder structure defines hierarchy
- No external configuration files

### ✅ Type-Safe
- Full TypeScript support
- Compile-time validation
- IntelliSense for metadata

### ✅ Easy Refactoring
- Move file → hierarchy updates automatically
- Rename component → ID updates in one place
- Add/remove animations → no external files to sync

### ✅ Better DX
- Metadata right next to implementation
- Clear component structure
- Self-documenting code

### ✅ Tree-Shakeable
- Only import what you use
- Smaller bundle sizes
- Faster builds

## Testing

Comprehensive test coverage ensures:
- All animations have valid metadata
- No duplicate IDs
- Type safety is enforced
- Registry building works correctly
- E2E tests verify UI functionality

See:
- `src/components/animationRegistry.test.ts` (Unit tests)
- `src/__tests__/services.animationData.test.ts` (Service tests)
- `tests/e2e/*.spec.ts` (E2E tests)
