# Data Registry Guide for LLM Coding Agents

**Purpose**: How the "File System as Database" pattern works in this project.

**Database Engine**: The File System + TypeScript Exports + `import.meta.glob` auto-discovery.

---

## Core Principles

### 1. Source of Truth

The directory structure and `.meta.ts` metadata files are the **single source of truth**.
There is no `database.sqlite` or `data.json`.

### 2. Schema

The "Schema" is defined by the TypeScript interfaces in `src/types/animation.ts`.

**Category Schema** (`src/components/<category>/index.ts`):

- `metadata`: { id, title }
- `groups`: Record<string, GroupExport>

**Group Schema** (`src/components/<category>/<group>/index.ts`):

- `metadata`: { id, title, tech, demo }
- `framer`: Record<string, AnimationExport> (auto-discovered)
- `css`: Record<string, AnimationExport> (auto-discovered)

**Animation Schema** (`.meta.ts` file):

- `metadata`: { id, title, description, tags, disableReplay?, infinite?, controls?, prizeCountMax? }

---

## Operations (CRUD)

### Create (Add New Animation)

1. Create `ComponentName.tsx` in `src/components/<category>/<group>/framer/` (and `css/`).
2. Create `ComponentName.meta.ts` alongside it with metadata export.
3. **No manual registration required.** `import.meta.glob` in the group's `index.ts` discovers new files automatically.

### Read (Query)

- **Full catalog**: `buildCatalog()` from `src/services/animationData.ts`
- **Via hook**: `useAnimations()` returns `{ categories: Category[] }`
- **Component lookup**: `buildRegistryFromCategories()` from `src/components/animationRegistry.ts`

### Update

- **Modify metadata**: Edit the `.meta.ts` file.
- **Modify animation**: Edit the `.tsx` component file.

### Delete

1. Delete the `.tsx`, `.meta.ts`, and `.module.css` files.
2. **No manual de-registration required.** Auto-discovery handles removal.
3. Run `pnpm test` to verify the catalog renders correctly.

---

## Registry Consistency

**Invariant**: The `id` in metadata must be unique across the entire catalog.

- Convention: `group-name__variant-name` (e.g., `modal-base__scale-gentle-pop`)

**Safety**: `buildRegistryFromCategories()` flattens the hierarchy. Duplicate IDs silently overwrite each other (CSS wins over Framer for the same ID). ID uniqueness is enforced by the `metadata-integrity.test.ts` test suite, which catches cross-group ID collisions, prefix mismatches, and duplicate IDs within tech variants.

---

## Common Mistakes

- **Don't** manually edit group `index.ts` files to register animations. Auto-discovery handles it.
- **Don't** forget the `.meta.ts` file. The `require-animation-metadata` ESLint rule catches this.
- **Don't** forget the dual implementation. The `require-dual-implementation` ESLint rule catches this.
