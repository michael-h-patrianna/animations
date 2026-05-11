# API & Data Service Guide for LLM Coding Agents

**Purpose**: How the internal data layer transforms code exports into UI-consumable catalog data.

**Context**: This is a frontend-only application. "API" refers to internal services and component interfaces.

---

## Data Service Architecture

### Lazy Group Registry (`src/lib/lazyGroupRegistry.ts`)

**Role**: Central registry for lazy-loadable animation groups. Categories register lightweight navigation metadata at module init; actual animation code is loaded on demand.

**Key Exports**:

- `declareCategoryGroups(categoryId, title, groups)` — Registers all groups in a category with a single call. Creates lazy loaders and nav metadata for `framer` + `css` by default; add `techs: ['framer', 'css', 'pixijs']` for PixiJS groups.
- `loadLazyGroup(groupId)` — Loads a group by ID with caching. Returns `LazyGroupResult`.
- `getLazyNavCatalog()` — Returns the lightweight navigation catalog (no animation code, just IDs and titles).
- `getLoadedGroupAnimations(groupId)` — Returns the `AnimationExport` map for an already-loaded group.

### Animation Registry (`src/components/animationRegistry.ts`)

**Role**: Thin wrapper over the lazy group registry. Provides `getGroupAnimations(baseGroupId, tech)` for synchronous component lookup after a group has been loaded. `tech` is `framer`, `css`, or `pixijs`.

### Data Flow

```
Category index.ts → declareCategoryGroups() → lazyGroupRegistry
                                                    ↓
useLazyAnimations hook → loadLazyGroup() → GroupExport → Group
                                                    ↓
AppNavigationContext → EditorLayout → GroupSection → AnimationCard
```

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
  tier: 2,
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

New animations are discovered automatically via `import.meta.glob` in generated group `index.ts` files. Adding a new variant requires only two files in the runtime folder:

1. `ComponentName.tsx` — the animation component
2. `ComponentName.meta.ts` — the metadata export

Runtime folders are `framer/`, `css/`, and optional `pixijs/`. No manual group index editing required; run `pnpm run generate:groups` after adding a `pixijs/` folder so the generated index includes PixiJS globs.

---

## Common Mistakes

- **Don't** hardcode animation data in UI components. Use `.meta.ts` files.
- **Don't** try to `fetch('/api/...')`. This is a static app with no backend.
- **Don't** manually edit group or category `index.ts` files. Auto-discovery handles registration.
- **Don't** expose `pixijs/` in the sidebar unless the category registration includes `techs: ['framer', 'css', 'pixijs']`.
