# Architecture Guide for LLM Coding Agents

**Purpose**: Instructions for where to put code and what patterns to follow in this animation library.

**Tech Stack**: React 19 + Motion (Framer Motion v12) + PixiJS v8 + GSAP + Vite 7 + TypeScript 5.9 + Tailwind CSS v4

---

## Where to Put New Code

```
src/
├── components/
│   ├── <category-id>/           # Animation categories (e.g., dialogs, progress, rewards)
│   │   ├── index.ts             # Category registration (declareCategoryGroups)
│   │   └── <group-id>/          # Animation groups (e.g., modal-base, loading-states)
│   │       ├── index.ts         # Group aggregation (exports groupExport via buildGroupExport)
│   │       ├── framer/          # Framer Motion animations
│   │       │   ├── ComponentName.tsx      # Animation component
│   │       │   └── ComponentName.meta.ts  # Metadata export
│   │       ├── css/             # CSS animations
│   │       │   ├── ComponentName.tsx      # Animation component
│   │       │   ├── ComponentName.meta.ts  # Metadata export
│   │       │   └── ComponentName.module.css # Animation styles (CSS Modules)
│   │       ├── pixijs/          # Optional PixiJS + GSAP animations for embedded games
│   │       │   ├── ComponentName.tsx      # React wrapper around Pixi scene
│   │       │   ├── ComponentName.meta.ts  # Metadata export with urlSlugPixijs
│   │       │   └── Shared*.ts             # Copy-pasteable scene recipes/helpers
│   │       ├── shared.css       # Shared group styles
│   │       └── MockContent.tsx  # Demo content components
│   ├── ui/                      # Catalog UI components
│   ├── lazyBootstrap.ts         # Side-effect imports all category registrations
│   └── animationRegistry.ts     # Thin wrapper: getGroupAnimations() for loaded groups
├── services/                    # Logging, error tracking, performance
├── hooks/                       # React hooks (useLazyAnimations, useLazyAppNavigation, etc.)
├── contexts/                    # React contexts (AppNavigation, CodeMode, AnimationInspector)
├── types/                       # TypeScript types (see animation.ts for core types)
├── lib/                         # Build helpers (groupBuilder, lazyGroupRegistry, sourceTransform, etc.)
├── motion/                      # Shared motion primitives
├── pixijs/                      # Shared PixiAnimationHost, GSAP PixiPlugin registration, canvas helpers
└── __tests__/                   # Unit tests
```

**Decision tree**:

- Creating new baseline animation? → `src/components/<category>/<group>/{framer|css}/`
- Creating embedded-game animation? → add `src/components/<category>/<group>/pixijs/` and opt the group into `pixijs`
- Creating UI component? → `src/components/ui/`
- Creating React hook? → `src/hooks/`
- Creating data service? → `src/services/`
- Creating type definition? → `src/types/`
- Creating test? → `src/__tests__/` or co-locate with component

---

## How to Create a New Animation Component

### Design first, code second

Before writing any code, write the consumer scenario: "A developer building [app type] wants [visual result]. They write: [JSX]." The JSX reveals the props interface. See `docs/reports/animation-refactoring-playbook.md` for the full methodology.

### Step 1: Create the Component File

Components must be **standalone** — no catalog-specific demo imports (`MockContent`, `DemoAnchors`). Imports from `@/components/demo-blocks` are allowed — these are portable UI primitives (buttons, modals, forms) that ship with the animation. All props optional with sensible defaults.

**Framer Motion** (`src/components/<category>/<group>/framer/GroupNameVariantName.tsx`):

```typescript
/**
 * [One-line description of what this animation does]
 *
 * Copy-paste files: this file + [list dependencies]
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useLayoutEffect, useRef, useState } from 'react'

// Props interface — all optional, sensible defaults
interface GroupNameVariantNameProps {
  duration?: number    // ms, default 400
  // ... animation-specific props
}

function GroupNameVariantNameComponent({
  duration = 400,
}: GroupNameVariantNameProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <m.div
      className="pf-[element-type]"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: duration / 1000, ease: [0.12, 0.75, 0.4, 1] }}
      data-animation-id="group-name__variant-name"
    >
      {/* Animation DOM — demo-blocks imports OK, no catalog scaffolding */}
    </m.div>
  )
}

export const GroupNameVariantName = memo(GroupNameVariantNameComponent)
```

**CSS** (`src/components/<category>/<group>/css/GroupNameVariantName.tsx`):

```typescript
/**
 * [One-line description] — CSS variant.
 *
 * Copy-paste files: this file + GroupNameVariantName.module.css + [shared deps]
 * Runtime deps: react
 */

import { memo } from 'react'
import styles from './GroupNameVariantName.module.css'

interface GroupNameVariantNameProps {
  duration?: number
}

function GroupNameVariantNameComponent({
  duration = 400,
}: GroupNameVariantNameProps) {
  return (
    <div
      className={styles['pf-element-type']}
      data-animation-id="group-name__variant-name"
      style={{ animationDuration: `${duration}ms` }}
    >
      {/* Animation DOM — demo-blocks imports OK, no catalog scaffolding */}
    </div>
  )
}

export const GroupNameVariantName = memo(GroupNameVariantNameComponent)
```

**PixiJS + GSAP** (`src/components/<category>/<group>/pixijs/GroupNameVariantName.tsx`):

```typescript
/**
 * [One-line description] — PixiJS + GSAP variant.
 *
 * Copy-paste files: this file + SharedGroupNamePixiScenes.ts + src/pixijs/PixiAnimationHost.tsx + src/pixijs/pixiText.ts
 * Runtime deps: react, pixi.js, gsap
 */

import { memo, useMemo } from 'react'
import { PixiAnimationHost, type PixiSceneFactory } from '@/pixijs/PixiAnimationHost'
import { createGroupNameScene, type GroupNameSceneProps } from './SharedGroupNamePixiScenes'

interface GroupNameVariantNameProps extends GroupNameSceneProps {
  text?: string
}

function GroupNameVariantNameComponent(props: GroupNameVariantNameProps) {
  const scene = useMemo<PixiSceneFactory<GroupNameVariantNameProps>>(
    () => (context, sceneProps) => createGroupNameScene(context, sceneProps),
    []
  )

  return (
    <PixiAnimationHost
      animationId="group-name__variant-name"
      createScene={scene}
      props={props}
      ariaLabel="Group name variant animation"
    />
  )
}

export const GroupNameVariantName = memo(GroupNameVariantNameComponent)
```

PixiJS variants in the catalog use one canvas per visible card through `PixiAnimationHost`. A game consumer can copy the scene factory and call it against an existing game `Application`/stage instead of mounting a separate React canvas. Keep scene factories free of catalog UI assumptions.

### Step 2: Create the Metadata File

```typescript
import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'group-name__variant-name', // MUST match data-animation-id
  urlSlugFramer: '/group-name-framer?animation=group-name__variant-name',
  urlSlugCss: '/group-name-css?animation=group-name__variant-name',
  urlSlugPixijs: '/group-name-pixijs?animation=group-name__variant-name', // Only when pixijs/ exists
  title: 'Human Readable Title',
  description: 'What it does + what props are configurable.',
  tier: 2,
  demoMode: 'burst', // Optional — tells catalog to render demo UI alongside component
} satisfies AnimationMetadata
```

### Step 3: Done — No Manual Registration Required

Group `index.ts` files use `buildGroupExport` with `import.meta.glob` for **automatic discovery**. Adding a `.tsx` component and its `.meta.ts` file to the `framer/`, `css/`, or opted-in `pixijs/` directory is sufficient. No generated index edits needed.

Shared infrastructure files at group root must match `SKIP_PATTERN` in `src/lib/groupBuilder.ts:31` — prefix with `Shared` or `Mock`.

---

## How to Create a New Animation Group

**Steps**:

1. Create folder: `src/components/<category>/<new-group>/`
2. Create baseline subfolders: `framer/` and `css/`
3. Create optional `pixijs/` only when the group has embedded-game/WebView use cases
4. Create `shared.css` with group-level layout styles
5. Add the group to the manifest in `scripts/codegen/generate-group-indexes.mjs`
6. Run `pnpm run generate:groups` to create the `index.ts`
7. Add animations to subfolders
8. Import and add to category's `index.ts`

Group `index.ts` files are **generated** — do not create or edit them by hand. The manifest in `scripts/codegen/generate-group-indexes.mjs` is the single source of truth. The generator detects `shared.css` and `pixijs/` from the filesystem automatically.

---

## How to Create a New Category

**Steps**:

1. Create folder: `src/components/<new-category>/`
2. Create group subfolders with animations
3. Create `index.ts` with template below
4. Add a side-effect import to `src/components/lazyBootstrap.ts`

**Category Index Template** (`src/components/<new-category>/index.ts`):

```typescript
import { declareCategoryGroups } from '@/lib/lazyGroupRegistry'
import type { GroupMetadata } from '@/types/animation'

const exampleGroupMeta: GroupMetadata = {
  id: 'example-group',
  title: 'Example Group',
  demo: 'Description of group purpose',
}

const gameGroupMeta: GroupMetadata = {
  id: 'game-group',
  title: 'Game Group',
  demo: 'PixiJS + GSAP embedded-game animations',
}

declareCategoryGroups('new-category', 'New Category Title', [
  { metadata: exampleGroupMeta, load: () => import('./example-group') },
  {
    metadata: gameGroupMeta,
    load: () => import('./game-group'),
    techs: ['framer', 'css', 'pixijs'],
  },
])
```

**Add to Bootstrap** (`src/components/lazyBootstrap.ts`):

```typescript
import '@/components/new-category'
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

| Detail                       | Location                                                 |
| ---------------------------- | -------------------------------------------------------- |
| Refactoring playbook         | `docs/reports/animation-refactoring-playbook.md`         |
| Reference implementation     | `src/components/rewards/collection-effects/`             |
| PixiJS host/helpers          | `src/pixijs/`                                            |
| PixiJS text example          | `src/components/base/text-effects/pixijs/`               |
| Tier 1-4 definitions         | Serena: `project_tier_definitions` (also in auto-memory) |
| Animation design principles  | Serena: `animation_design_principles`                    |
| Demo separation architecture | Auto-memory: `project_demo_separation`                   |
| Full type definitions        | Read `src/types/animation.ts` directly                   |
