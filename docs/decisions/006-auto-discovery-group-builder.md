# 006: Auto-Discovery via buildGroupExport

## Status

Accepted

## Context

Group index files (`src/components/<category>/<group>/index.ts`) originally used manual lazy loading and explicit animation registration:

```ts
import { metadata } from './framer/Anim.meta'
const Anim = lazy(() => import('./framer/Anim').then((m) => ({ default: m.Anim })))
export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: { group__anim: { component: Anim, metadata } },
  css: {},
}
```

Each new animation required editing the group index — importing the metadata, creating a lazy wrapper, and adding the entry to the framer/css map. This was error-prone (typos in IDs, forgotten imports) and created large, mechanical diffs for every animation addition.

## Decision

Replace manual registration with `buildGroupExport()` from `@/lib/groupBuilder`, powered by Vite's `import.meta.glob`:

```ts
export const groupExport = buildGroupExport(
  metadata,
  import.meta.glob('./framer/*.tsx'),
  import.meta.glob<{ metadata: AnimationMetadata }>('./framer/*.meta.ts', { eager: true }),
  import.meta.glob('./css/*.tsx'),
  import.meta.glob<{ metadata: AnimationMetadata }>('./css/*.meta.ts', { eager: true }),
  {
    /* raw source loaders for code viewer */
  }
)
```

`buildGroupExport` pairs metadata modules with component loaders by matching filenames, creates `React.lazy` wrappers automatically, and attaches raw source loaders for the code viewer.

## Consequences

**Positive:**

- Adding an animation requires only creating the `.tsx` and `.meta.ts` files — zero index edits
- Eliminates an entire class of registration bugs (wrong ID, missing import, stale entry)
- Group index files are identical across all 15 groups — one template, no drift
- Raw source loading for the code viewer is wired automatically
- The `SKIP_PATTERN` in groupBuilder.ts excludes non-animation files (Mock*, Shared*, \*Helper, etc.)

**Negative:**

- Component export names must match filenames exactly (e.g., `FooBar.tsx` must export `FooBar`)
- `import.meta.glob` is Vite-specific — not portable to other bundlers without a shim
- Build-time glob patterns are slightly less explicit than named imports (harder to trace in an IDE)

**Tradeoffs:**

- Vite lock-in is acceptable since the project already depends on Vite for dev server, HMR, and CSS handling
- Filename-export-name coupling is enforced by the `no-default-export-in-animation` ESLint rule
