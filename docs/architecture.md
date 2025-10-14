# Animation Library Architecture

## Overview

This document describes the co-located metadata architecture for the animation component library.

## Core Principle: Folder Structure IS the Hierarchy

The folder structure directly defines the category → group → animation hierarchy:

```
src/components/
├─ base/                    # Category: "Base effects"
│  ├─ text-effects/         # Group: "Text effects"
│  │  ├─ framer/
│  │  │  ├─ TextEffectsWaveText.tsx
│  │  │  └─ TextEffectsGlitchText.tsx
│  │  ├─ css/
│  │  │  └─ TextEffectsWaveText.css
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

Each group now separates animations by implementation technology:

- `framer/` holds Framer Motion components and their metadata exports.
- `css/` holds CSS-driven components plus their stylesheets.
- Shared assets that multiple animations rely on (for example `shared.css`) remain at the group root alongside `index.ts`.

## Component-Level Metadata

Each animation component exports its metadata:

```typescript
// src/components/base/text-effects/framer/TextEffectsWaveText.tsx
import type { AnimationMetadata } from '@/types/animation'
import '../css/TextEffectsWaveText.css'

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

Each group's `index.ts` aggregates all animations in that group while referencing the technology-specific subfolders:

```typescript
// src/components/base/text-effects/index.ts
import type { GroupExport, GroupMetadata } from '@/types/animation'
import { TextEffectsWaveText, metadata as waveTextMeta } from './framer/TextEffectsWaveText'
import { TextEffectsGlitchText, metadata as glitchTextMeta } from './framer/TextEffectsGlitchText'

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

## Animation Registration Pipeline

The registration pipeline transforms the folder structure into a queryable catalog:

### 1. Component Definition
Each animation component exports itself and its metadata:
```tsx
export function ButtonBounce() { /* ... */ }
export const metadata: AnimationMetadata = { /* ... */ }
```

### 2. Group Aggregation
Group-level `index.ts` collects all animations in that group:
```tsx
export const groupExport: GroupExport = {
  metadata: { id: 'button-effects', title: 'Button Effects', tech: 'framer' },
  animations: {
    'button-effects__bounce': { component: ButtonBounce, metadata: bounceMeta },
    // ... more animations
  }
}
```

### 3. Category Aggregation
Category-level `index.ts` collects all groups:
```tsx
export const categoryExport: CategoryExport = {
  metadata: { id: 'base', title: 'Base Effects' },
  groups: {
    'button-effects': buttonEffectsGroup,
    'text-effects': textEffectsGroup,
    // ... more groups
  }
}
```

### 4. Registry Consolidation
`animationRegistry.ts` provides the complete catalog:
```tsx
export const categories: Record<string, CategoryExport> = {
  'base': baseCategory,
  'dialogs': dialogsCategory,
  // ... all categories
}
```

### 5. Data Service Layer
`animationDataService` builds the hierarchical structure:
- Flattens category → group → animation hierarchy
- Enriches metadata with computed properties
- Provides caching for performance
- Handles refresh/reload operations

**Flow Diagram:**
```
Component Files → Group Index → Category Index → Registry → Data Service → UI
    (TSX)           (index.ts)     (index.ts)    (registry)  (service)   (App)
```

## Preload Strategy

Critical animation assets are preloaded at application startup to ensure smooth initial render.

### Implementation

**Manifest (`src/lib/preload-manifest.ts`):**
```tsx
export const CRITICAL_ICON_IMAGES = [
  '/images/star/star-1.png',
  '/images/star/star-2.png',
  '/images/trophy/trophy-gold.png',
  // ... essential images
]
```

**Preload Service (`src/lib/preload.ts`):**
```tsx
export function preloadImages(urls: string[]): void {
  urls.forEach(url => {
    const img = new Image()
    img.src = url
  })
}
```

**Application Entry (`src/main.tsx`):**
```tsx
preloadImages(CRITICAL_ICON_IMAGES) // Preload ASAP at startup
```

### Rationale

1. **First Paint Performance**: Icon animations render immediately without image fetch delays
2. **Perceived Performance**: Users see complete animations on first load
3. **Reduced Layout Shift**: Images available before render prevents CLS
4. **Critical Path Optimization**: Only preload truly critical assets (~10-20 images)

### Best Practices

- ✅ Preload images used in above-the-fold animations
- ✅ Keep manifest small (<100KB total)
- ✅ Use modern image formats (WebP with PNG fallback)
- ❌ Don't preload all assets (defeats lazy loading)
- ❌ Avoid preloading group-specific images (load on demand)

## AnimationCard Lifecycle

The `AnimationCard` component manages animation playback with visibility detection and replay functionality.

### Component States

```tsx
interface CardState {
  replayKey: number        // Triggers re-mount for replay
  hasPlayed: boolean       // Tracks first play
  isVisible: boolean       // Intersection observer state
  isExpanded: boolean      // Description expansion
  bulbCount: number        // For lights animations
  onColor: string          // For lights animations
}
```

### Lifecycle Flow

1. **Mount**: Component mounts, IntersectionObserver attached
2. **Visibility Detection**: Observer fires when card enters viewport
3. **First Play**: Animation plays automatically on first visibility
4. **Idle**: Animation completes, card shows replay button
5. **Replay**: User clicks replay → `replayKey` increments → child re-mounts
6. **Unmount**: Observer cleanup on component unmount

**State Diagram:**
```
[Mount] → [Observing] → [Visible & !hasPlayed] → [Playing] → [Idle]
                                                       ↑           ↓
                                                       └─[Replay]──┘
```

### IntersectionObserver Usage

```tsx
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !hasPlayed) {
        setIsVisible(true)
        setHasPlayed(true)
        setReplayKey(key => key + 1) // Trigger animation
      }
    },
    { threshold: 0.1 } // 10% visible triggers play
  )

  if (cardRef.current) observer.observe(cardRef.current)

  return () => observer.disconnect()
}, [hasPlayed])
```

### Replay Mechanism

Replay works by incrementing `replayKey`, which is passed as `key` prop to the animation child:

```tsx
<div key={replayKey}>
  {typeof children === 'function'
    ? children({ bulbCount, onColor })
    : children
  }
</div>
```

React treats different `key` values as different components, forcing a re-mount and resetting animation state.

### Performance Considerations

- ✅ AnimationCard is memoized with `React.memo`
- ✅ IntersectionObserver prevents off-screen animations from running
- ✅ `hasPlayed` flag prevents re-triggering on scroll
- ✅ Only one observer instance per card
- ✅ Cleanup prevents memory leaks

## Group Navigation Flow

The app supports URL-based navigation to specific animation groups with automatic scrolling and state synchronization.

### URL Structure

```
/                          → Default (first group)
/:groupId                  → Specific group (e.g., /button-effects-framer)
```

### Navigation Components

1. **URL Parameter**: React Router captures `:groupId` from URL
2. **State Management**: `currentGroupId` state tracks active group
3. **Sidebar**: `AppSidebar` highlights active category/group
4. **Content**: `GroupSection` renders active group's animations
5. **Scroll**: Automatic scroll to group section on navigation

### Navigation Flow

```
User clicks group → navigate(groupId) → URL updates → useEffect detects change
→ setCurrentGroupId → Sidebar updates → Content scrolls → Group visible
```

### Implementation Details

**URL Sync (App.tsx):**
```tsx
useEffect(() => {
  if (allGroups.length === 0) return

  if (groupId && allGroups.some(g => g.id === groupId)) {
    setCurrentGroupId(groupId)
  } else if (!groupId) {
    const firstGroupId = allGroups[0].id
    setCurrentGroupId(firstGroupId)
    window.location.href = `/${firstGroupId}` // Update URL
  }
}, [allGroups, groupId])
```

**Scroll-to-View:**
```tsx
useEffect(() => {
  if (!currentGroupId) return

  const id = `group-${currentGroupId}`
  const element = document.getElementById(id)

  requestAnimationFrame(() => {
    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  })
}, [currentGroupId])
```

**Handler (App.tsx):**
```tsx
const handleGroupSelect = useCallback((groupId: string) => {
  if (groupId === currentGroupId) return
  window.location.href = `/${groupId}` // Full page navigation for URL update
}, [currentGroupId])
```

### State Persistence

- URL is the source of truth for current group
- Browser back/forward buttons work correctly
- Deep linking to specific groups supported
- Refresh preserves current group

### Mobile Drawer

On mobile, group selection also closes the drawer:

```tsx
const handleGroupSelectMobile = useCallback((groupId: string) => {
  handleGroupSelect(groupId)
  setIsDrawerOpen(false) // Close drawer after selection
}, [handleGroupSelect])
```

## Architecture Decision Records

For detailed context on major architectural decisions, see:

- [ADR-001: Framer Motion Selection](./adr/ADR-001-framer-motion.md)
- [ADR-002: Co-located Metadata System](./adr/ADR-002-colocated-metadata.md)
- [ADR-003: Test Infrastructure](./adr/ADR-003-test-infrastructure.md)

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
