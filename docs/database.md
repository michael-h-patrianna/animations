# Data Registry Guide for LLM Coding Agents

**Purpose**: This document explains the "File System as Database" pattern used in this project.

**Database Engine**: The File System + TypeScript Exports.

---

## Core Principles

### 1. Source of Truth
The directory structure and `export const metadata` in component files are the **single source of truth**.
There is no `database.sqlite` or `data.json`.

### 2. Schema
The "Schema" is defined by the TypeScript interfaces in `src/types/animation.ts`.

**Category Schema** (`src/components/<category>/index.ts`):
- `id`: string (must match folder name)
- `title`: string
- `groups`: Record<string, GroupExport>

**Group Schema** (`src/components/<category>/<group>/index.ts`):
- `metadata`: { id, title, tech, demo }
- `framer`: Record<string, Animation>
- `css`: Record<string, Animation>

**Animation Schema** (`Component.tsx`):
- `metadata`: { id, title, description, tags }

---

## Operations (CRUD)

### Create (Add New Animation)
1. **Create File**: `src/components/<category>/<group>/framer/NewAnim.tsx`.
2. **Define Metadata**: Export `metadata` object.
3. **Register**: Import in `src/components/<category>/<group>/index.ts` and add to `framer` object.

### Read (Query)
- **List All**: `animationDataService.loadAnimations()`
- **Get One**: `animationRegistry.getAnimationMetadata(id)`

### Update
- **Modify Metadata**: Edit the `export const metadata` in the component file.
- **Modify Logic**: Edit the React component.

### Delete
1. **Remove from Registry**: Delete line in group's `index.ts`.
2. **Delete File**: Remove the `.tsx` file.

---

## Registry Consistency

**Invariant**: The `id` in metadata SHOULD match the registry key and file path convention.
- Convention: `category-group__name-variant`

**Safety**:
The `buildRegistryFromCategories` function flattens the hierarchy. Duplicate IDs will overwrite each other. **Ensure IDs are unique.**

---

## Common Mistakes

❌ **Don't**: Rename a file without updating the `index.ts` import.
✅ **Do**: Check the group's `index.ts` after any file rename.

❌ **Don't**: Expect data to persist after refresh (for runtime additions).
✅ **Do**: Understand that `animationDataService` is reset on reload (unless hardcoded in files).