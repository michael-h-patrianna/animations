# API & Data Service Guide for LLM Coding Agents

**Purpose**: This document explains how to interact with the internal Data Service and defining Component APIs.

**Context**: This is a frontend-only application. "API" refers to internal services and component props.

---

## Data Service Architecture

### AnimationDataService
**Location**: `src/services/animationData.ts`
**Role**: Transforms the static code registry (`animationRegistry.ts`) into consumable UI data (`Category[]`).

**Key Methods**:
- `loadAnimations()`: Returns full catalog (async).
- `getAnimationsByGroup(catId, groupId)`: Returns specific animations.
- `addAnimation(anim)`: Adds a runtime-only animation (e.g., for prototyping).

**Usage Pattern**:
```typescript
// In a component/hook
import { animationDataService } from '@/services/animationData';

useEffect(() => {
  const fetchData = async () => {
    const data = await animationDataService.loadAnimations();
    setCategories(data);
  };
  fetchData();
}, []);
```

---

## Component API Standards

### Animation Components
**Interface**: Animation components should generally accept *no required props* to ensure they work in the generic `AnimationCard`.
**Customization**: If props are needed, provide defaults.

**Template**:
```typescript
import React from 'react';
import { AnimationMetadata } from '@/types/animation';

export const metadata: AnimationMetadata = {
  id: 'category-group__animation-name',
  title: 'Animation Title',
  description: 'Description of behavior.',
  tags: ['tag1', 'tag2'],
};

const AnimationName: React.FC = () => {
  return (
    <div className="relative ...">
      {/* Content */}
    </div>
  );
};

export default AnimationName;
```

---

## Registry API (`src/components/animationRegistry.ts`)

**Role**: The "Source of Truth" linking IDs to React Components.

**Key Exports**:
- `categories`: Hierarchical object of all code exports.
- `buildRegistryFromCategories()`: Returns flattened `Record<string, ComponentType>`.
- `getAnimationMetadata(id)`: Lookup helper.

**How to use in UI**:
1. Get list of items from `AnimationDataService` (contains IDs, Titles, Descriptions).
2. When rendering, look up the Component using `buildRegistryFromCategories()` (or a cached version of it) using the `id`.

---

## Common Patterns

### Dynamic Loading
The registry imports everything statically. Tree-shaking is not a primary concern for this specific demo app, but be aware that *all* animations are bundled.

### Adding "Extras"
To support runtime additions (like an "AI Generated" preview), use `animationDataService.addAnimation()`. This modifies the in-memory catalog but does not persist to disk.

---

## Common Mistakes

❌ **Don't**: Hardcode animation data in the UI component.
✅ **Do**: Fetch it from `animationDataService`.

❌ **Don't**: Try to `fetch('/api/...')`.
✅ **Do**: This is a static app. Use the internal services.