# Animation Migration Guide for Coding Agents

This project renders the animation catalog from structured data rather than hard coded JSX. Follow these notes when migrating showcase animations into their React components.

## High-Level Data Flow

1. `docs/showcase.html` is the source of truth for animation behaviour and styling. Groups and variants are defined near the bottom via `createGroup({ categoryId, groupId, ... })` and variant factories.
2. `docs/structure.json` mirrors that hierarchy. Each entry supplies:
   - `category.id` / `category.title`
   - `group.id`, `group.title`, `tech`, `demo`
   - `animations[]` with `id`, `title`, `description`, `categoryId`, `groupId`
3. `src/services/animationData.ts` reads `structure.json`, builds the category → group → animation catalog, and exposes it through `animationDataService`.
4. `src/components/animationRegistry.ts` maps every animation id to its React component. `GroupSection` consults this registry and renders each animation inside an `AnimationCard`.

## File/Folder Layout

```
src/
├─ components/
│  ├─ ui/                     // Catalog UI (CategorySection, GroupSection, AnimationCard)
│  ├─ <category-id>/          // One folder per category id from structure.json
│  │  └─ <group-id>/          // One folder per group id within that category
│  │     ├─ *.tsx             // Animation components (PascalCase name derived from animation id)
│  │     └─ *.css             // Co-located CSS per component (no shared group CSS)
├─ hooks/useAnimations.ts     // Loads catalog data for the app
├─ types/animation.ts         // Core types (Category, Group, Animation, registry types)
```

## Locating an Animation Component

Given an animation id `category-group__variant` (same id in `structure.json` and `docs/showcase.html`):

1. Split the id into parts:
   - Category id → folder name under `src/components/` (e.g. `modal-base__scale-gentle-pop` ⇒ category `dialogs`).
   - Group id → folder inside the category (e.g. `modal-base`).
2. Inside `src/components/<category>/<group>/`, open the component whose filename is the PascalCase version of the animation id (e.g. `ModalBaseScaleGentlePop.tsx`).
3. Each component owns its styles via a co-located `.css` file. Replace any placeholder markup with the React implementation and keep styles scoped to the component root.

## Migrating from `docs/showcase.html`

1. Search the showcase file for the animation key (e.g. `scaleGentlePop`). The variant generator will show the relevant HTML/CSS.
2. Recreate the animation using React/TypeScript inside the target component. Keep the container element returned by the component self-contained; the `AnimationCard` already provides the outer frame and replay behaviour.
3. Place styles in a co-located `.css` file next to the component. Prefer selectors scoped to the component root to avoid collisions.
4. If the animation needs assets or utilities, add them under `src/assets` or `src/utils` as needed and import them from the component.

## Rendering Context

- Components render as children of `<AnimationCard>` inside `GroupSection` (in `src/components/ui`). The card supplies the title, description, replay button, and `.pf-demo-canvas` wrapper. Do not duplicate those wrappers inside the animation component.
- Components should render deterministic DOM and handle a replay by restarting animations when remounted. The replay button remounts the child by toggling a key.

## Testing & Verification

- Unit tests live under `src/` (e.g., `src/components/ui/AnimationCard.test.tsx`, `src/App.test.tsx`). Add new tests if the animation logic requires helpers.
- E2E coverage (`tests/e2e/homepage.spec.ts`) ensures cards and replay controls appear. After migrating animations, validate styling/functionality manually or extend Playwright specs if behaviour changes.

## Summary Checklist

1. Identify `categoryId`, `groupId`, and animation id from `docs/showcase.html` / `structure.json`.
2. Edit the matching component in `src/components/<category>/<group>/`.
3. Add or update the component’s co-located CSS file; do not introduce shared/group CSS.
4. Verify the catalog renders (run `npm run dev`) and tests pass (`npm run test`).

Following this structure ensures each animation lives in its dedicated React component while the catalog UI remains consistent.
