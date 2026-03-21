# ADR-002: Co-located Metadata System

**Status:** Accepted
**Date:** 2026-02

## Context

Animation metadata (id, title, description, tags) must be associated with each component. Options considered:

1. **Central JSON/YAML config file** — Single source of truth but disconnected from components. Rename a file, forget the config.
2. **Co-located `.meta.ts` exports** — Metadata lives next to the component. Type-checked at build time.
3. **Inline metadata in component files** — Tight coupling but mixes concerns.

## Decision

Option 2: Each animation exports metadata from a sibling `.meta.ts` file. Group `index.ts` files aggregate these via `buildGroupExport` using Vite's `import.meta.glob`.

## Consequences

- **Positive:** Adding an animation is self-contained — create component + meta file, glob picks it up automatically.
- **Positive:** TypeScript enforces `AnimationMetadata` shape at compile time.
- **Positive:** `buildGroupExport` reduces ~200 lines of manual import/lazy/map boilerplate to ~15 lines per group.
- **Negative:** Glob patterns are implicit — a misspelled filename won't cause a build error, just a silently missing animation. Mitigated by `metadata-integrity.test.ts` which validates all metadata IDs match their component `data-animation-id`.
- **Enforced by:** ESLint rule `require-animation-metadata` ensures every animation component has a co-located `.meta.ts` file.
