=== CONSTINUTIONAL PRINCIPLES (IMMUTABLE) ===
1. CORE PURPOSE: Create high-quality, production-ready animations in a showcase for a gamified website and online casino
2. BOUNDARIES: Always optimize for quality, not for time or token usage. Never cut corners. Never skip tasks.
3. QUALITY STANDARDS: All testable functionality must be covered by unit, integration and e2e tests.
4. MANDATORY TOOL USE: Always use sequential thinking MCP and TodoWrite.
5. MANDATORY SUBAGENT USE: Where possible use the Task tool and subagents. Prompt them with all the information the agent needs to know.
=== END CONSTINUTIONAL PRINCIPLES ===

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
│  ├─ catalog/                // Shared catalog UI (CategorySection, GroupSection, AnimationCard)
│  ├─ <category-id>/          // One folder per category id from structure.json
│  │  └─ <group-id>/          // One folder per group id within that category
│  │     ├─ <group-id>.css    // Shared CSS imported by every animation in the group
│  │     ├─ *.tsx             // Animation components (PascalCase name derived from animation id)
│  │     └─ index.ts          // Exports components and AnimationComponentMap for the group
├─ hooks/useAnimations.ts     // Loads catalog data for the app
├─ types/animation.ts         // Core types (Category, Group, Animation, registry types)
```

## Locating an Animation Component

Given an animation id `category-group__variant` (same id in `structure.json` and `docs/showcase.html`):

1. Split the id into parts:
   - Category id → folder name under `src/components/` (e.g. `modal-base__scale-gentle-pop` ⇒ category `dialogs`).
   - Group id → folder inside the category (e.g. `modal-base`).
2. Inside `src/components/<category>/<group>/`, open the component whose filename is the PascalCase version of the animation id (e.g. `ModalBaseScaleGentlePop.tsx`).
3. Each component currently returns a placeholder `<div data-animation-id="…">…</div>` and imports the group CSS. Replace the placeholder markup with the React implementation of the animation.

## Migrating from `docs/showcase.html`

1. Search the showcase file for the animation key (e.g. `scaleGentlePop`). The variant generator will show the relevant HTML/CSS.
2. Recreate the animation using React/TypeScript inside the target component. Keep the container element returned by the component self-contained; the `AnimationCard` already provides the outer frame and replay behaviour.
3. Place shared styles in the group CSS (`<group-id>.css`). Prefer CSS classes scoped to the group to avoid collisions.
4. If the animation needs assets or utilities, add them under `src/assets` or `src/utils` as needed and import them from the component.

## Rendering Context

- Components render as children of `<AnimationCard>` inside `GroupSection`. The card supplies the title, description, replay button, and `.pf-demo-canvas` wrapper. Do not duplicate those wrappers inside the animation component.
- Components should render deterministic DOM and handle a replay by restarting animations when remounted. The replay button remounts the child by toggling a key.

## Testing & Verification

- Unit tests live alongside the catalog (`src/components/catalog/AnimationCard.test.tsx`, `src/App.test.tsx`). Add new tests if the animation logic requires helpers.
- E2E coverage (`tests/e2e/homepage.spec.ts`) ensures cards and replay controls appear. After migrating animations, validate styling/functionality manually or extend Playwright specs if behaviour changes.

## Summary Checklist

1. Identify `categoryId`, `groupId`, and animation id from `docs/showcase.html` / `structure.json`.
2. Edit the matching component in `src/components/<category>/<group>/`.
3. Update group CSS to host shared styles.
4. Verify the catalog renders (run `npm run dev`) and tests pass (`npm run test`).

Following this structure ensures each animation lives in its dedicated React component while the catalog UI remains consistent.


=== CONSTINUTIONAL PRINCIPLES CHECKLIST ===
1. Created high-quality, production-ready output?
2. BOUNDARIES: Did not cut corners, skipped tasks or prioritized speed over quality?
3. QUALITY STANDARDS: Everything you did can be tested and passes all tests?
4. MANDATORY TOOL USE: Used sequential thinking MCP and TodoWrite?
5. MANDATORY SUBAGENT USE: Delegated work via the Task tool and subagents?
=== END CONSTINUTIONAL PRINCIPLES CHECKLIST ===

