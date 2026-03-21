# API & Data Service Guide for LLM Coding Agents

**Purpose**: How the internal data layer transforms code exports into UI-consumable catalog data.

**Context**: This is a frontend-only application. "API" refers to internal services and component interfaces.

---

## Data Service Architecture

### buildCatalog()

**Location**: `src/services/animationData.ts`
**Role**: Transforms the hierarchical registry (`animationRegistry.ts`) into a flat `Category[]` array for the UI.

This is a **pure, synchronous function** — the catalog is derived entirely from static imports. No async data fetching, no loading states.

```typescript
import { buildCatalog } from '@/services/animationData'

const categories: Category[] = buildCatalog()
```

The `useAnimations` hook wraps this in `useMemo` for stable references:

```typescript
import { useAnimations } from '@/hooks/useAnimations'

function App() {
  const { categories } = useAnimations()
  // categories: Category[] — stable across re-renders
}
```

---

## Registry API (`src/components/animationRegistry.ts`)

**Role**: Central import point for all category exports.

**Key Exports**:

- `categories`: `Record<string, CategoryExport>` — hierarchical registry of all animations.
- `buildRegistryFromCategories()`: Returns flattened `Record<string, ComponentType>` mapping animation IDs to their React components.

**How the UI uses it**:

1. `buildCatalog()` transforms `categories` into `Category[]` with separate Framer/CSS groups.
2. `GroupSection` calls `getGroupAnimations(baseGroupId, tech)` to look up components for the active group and tech variant.

---

## Component API Standards

### Animation Components

Animation components accept **no required props** by default. This ensures they work inside the generic `AnimationCard` wrapper.

Components that need interactive controls declare `controls` in their metadata:

```typescript
// ComponentName.meta.ts
export const metadata: AnimationMetadata = {
  id: 'group-name__variant-name',
  title: 'Variant Name',
  description: 'What it does',
  tags: ['framer'],
  controls: 'lights', // optional: 'lights' | 'prizeCount'
  infinite: true, // optional: loops continuously
  disableReplay: false, // optional: disable replay button
}
```

Components receiving controls accept them as props:

```typescript
export function LightsCircleStatic1({
  numBulbs = 16,
  onColor = '#ffd700',
}: {
  numBulbs?: number
  onColor?: string
}) {
  // ...
}
```

### Auto-Discovery

New animations are discovered automatically via `import.meta.glob` in group `index.ts` files. Adding a new animation requires only two files:

1. `ComponentName.tsx` — the animation component
2. `ComponentName.meta.ts` — the metadata export

No manual index editing required.

---

## Common Mistakes

- **Don't** hardcode animation data in UI components. Use `.meta.ts` files.
- **Don't** try to `fetch('/api/...')`. This is a static app with no backend.
- **Don't** manually edit group or category `index.ts` files. Auto-discovery handles registration.
