# ADR-007: Auto-Discovery via import.meta.glob

**Status**: Accepted

**Date**: 2025

## Context

Each animation group requires registering both framer and CSS component variants along with their metadata and raw source files. Manual registration in group index files meant:

- ~200 lines of import/lazy/map boilerplate per group
- Every new animation required editing the group index
- Easy to forget registering one variant, causing silent omissions
- Source file registration for the code viewer doubled the import count

## Decision

Use Vite's `import.meta.glob` with `buildGroupExport()` (src/lib/groupBuilder.ts) for automatic component discovery. Adding a `.tsx` component and its `.meta.ts` metadata file to a `framer/` or `css/` directory is sufficient for registration. No index edits needed.

The `SKIP_PATTERN` regex (line 31 of groupBuilder.ts) excludes helper files (Mock*, Shared*, *Parts, *Components, etc.) from being treated as animation components.

Source loaders are attached to each `AnimationExport` via a `WeakMap` to avoid polluting the export interface with internal implementation details. The WeakMap ensures source loaders are garbage-collected when their associated exports are no longer referenced.

## Consequences

**Easier:**
- Adding new animations: create 2 files (component + meta), done
- Consistency: all groups use identical index.ts boilerplate
- Code viewer: source files are automatically available without explicit imports

**Harder:**
- Debugging discovery failures: silent skips when SKIP_PATTERN matches unexpectedly
- Understanding the system: WeakMap indirection is invisible at the type level
- Dev-only duplicate ID check (line 140) requires running the dev server to catch conflicts

## Verification

A metadata-integrity test (`src/__tests__/metadata-integrity.test.ts`) validates that every registered animation has a matching component and metadata entry, catching discovery failures at test time.
