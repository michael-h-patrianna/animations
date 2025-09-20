=== CONSTITUTIONAL PRINCIPLES (IMMUTABLE) ===
1. CORE PURPOSE: Build high-quality, production-ready React (TypeScript) animation components using CSS and/or Framer Motion that can be cleanly translated to React Native using React Reanimated and Moti.
2. SCOPE & BOUNDARIES: Work only within the requested task and existing repository context (e.g., `docs/structure.json`, current code). Do NOT invent features, assets, requirements, or architectural changes that weren't explicitly asked for.
3. QUALITY STANDARDS: All testable behaviours must be covered by appropriate unit, integration, and e2e tests. Prefer deterministic outputs, structured steps, and minimal diffs. If information is missing, state "Information not available" or ask, rather than guessing.
4. MANDATORY PROCESS TOOLS: Always use Sequential Thinking MCP and TodoWrite. Start by creating a TodoWrite plan with exactly one in-progress item. After each step, update TodoWrite (complete current item before starting the next). Do not proceed without a plan.
5. MANDATORY SUBAGENT USE: Where helpful, use the Task tool and subagents. Provide them only the necessary, factual context from the repo/user request—no speculation.
6. IMAGE ASSETS: Do not draw images yourself. Check /Users/Spare/Documents/graphics/image_manifest.json and /Users/Spare/Documents/graphics/ for image assets to use.
=== END CONSTITUTIONAL PRINCIPLES ===

## High-Level Data Flow

1. `docs/structure.json` defines the hierarchy. Each entry supplies:
   - `category.id` / `category.title`
   - `group.id`, `group.title`, `tech`, `demo`
   - `animations[]` with `id`, `title`, `description`, `categoryId`, `groupId`
2. `src/services/animationData.ts` reads `structure.json`, builds the category → group → animation catalog, and exposes it through `animationDataService`.
3. `src/components/animationRegistry.ts` maps every animation id to its React component. `GroupSection` consults this registry and renders each animation inside an `AnimationCard`.

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

Given an animation id `category-group__variant` :

1. Split the id into parts:
   - Category id → folder name under `src/components/` (e.g. `modal-base__scale-gentle-pop` ⇒ category `dialogs`).
   - Group id → folder inside the category (e.g. `modal-base`).
2. Inside `src/components/<category>/<group>/`, open the component whose filename is the PascalCase version of the animation id (e.g. `ModalBaseScaleGentlePop.tsx`).
3. Each component currently returns a placeholder `<div data-animation-id="…">…</div>` and imports the group CSS. Replace the placeholder markup with the React implementation of the animation.

## Rendering Context

- Components render as children of `<AnimationCard>` inside `GroupSection`. The card supplies the title, description, replay button, and `.pf-demo-canvas` wrapper. Do not duplicate those wrappers inside the animation component.
- Components should render deterministic DOM and handle a replay by restarting animations when remounted. The replay button remounts the child by toggling a key.

## Scope and Technology Choices (Animation Implementation)

CRITICAL INSTRUCTION BLOCK [CIB-ANIM-001]
- Allowed: CSS keyframes/transforms/opacity/transitions, and Framer Motion components/hooks for React.
- Goal: Keep animations portable to React Native via React Reanimated + Moti. Prefer transform/opacity timing and declarative motion patterns that map to RN.
- Avoid: Introducing libraries outside CSS/Framer Motion; web-only APIs that don't translate to RN; speculative assets or features.
- Styling: Place shared styles in the group CSS (`<group-id>.css`); scope selectors to avoid collisions.
- Structure: Keep components self-contained; do not add extra outer wrappers already provided by `AnimationCard`.
END CIB-ANIM-001

Recall CIB-ANIM-001 immediately before emitting any new animation code or edits.

Portability guidelines (non-exhaustive, do not overreach beyond task):
- Prefer transforms (translate/scale/rotate), opacity, border-radius, background-position, and timing curves that have RN counterparts.
- Avoid relying on CSS filters/blend modes, complex mask/path effects, or Web Animations API unless explicitly requested.
- With Framer Motion, prefer idiomatic motion values/variants that have clear Moti/Reanimated equivalents.

## Testing & Verification

- Unit tests live alongside the catalog (`src/components/catalog/AnimationCard.test.tsx`, `src/App.test.tsx`). Add new tests if the animation logic requires helpers.
- E2E coverage (`tests/e2e/homepage.spec.ts`) ensures cards and replay controls appear. After migrating animations, validate styling/functionality manually or extend Playwright specs if behaviour changes.

Quality gates (apply before finalizing):
✓ Changes are limited to the necessary files/scope and follow repository conventions
✓ Animations implemented with CSS and/or Framer Motion only (see CIB-ANIM-001)
✓ No invented requirements; all behaviour maps to explicit user ask
✓ Replay behaviour works by remount (no hidden global state)
✓ Tests pass locally (unit/integration/e2e as applicable)
✓ If missing info, the output explicitly notes it rather than guessing

## Summary Checklist

1. Create or edit the matching component in `src/components/<category>/<group>/`.
2. Update group CSS to host shared styles.
3. Verify the catalog renders (run `npm run dev`) and tests pass (`npm run test`).
4. Portability: The implementation uses CSS/Framer Motion patterns that translate to RN Reanimated + Moti (transforms/opacity preferred; no web-only features unless requested).
5. No invention: Confirm all added behaviour/features exist in the source (showcase/structure) or the explicit request.
6. Process: A TodoWrite plan was created first; steps were executed with only one in-progress item at a time and updated after completion.

Following this structure ensures each animation lives in its dedicated React component while the catalog UI remains consistent, portable, and delivered via a reliable, planned workflow.


=== CONSTITUTIONAL PRINCIPLES CHECKLIST ===
1. CORE PURPOSE: Output is a React (TS) animation using CSS and/or Framer Motion, and is readily translatable to RN Reanimated + Moti.
2. SCOPE & NO INVENTION: Only implemented what was explicitly requested or present in structure; no speculative features/assets.
3. QUALITY: All applicable tests pass; replay behaviour is deterministic; minimal, focused diffs.
4. PROCESS: Used Sequential Thinking MCP and TodoWrite with a proper plan (single in-progress item, updates after each step).
5. SUBAGENTS: Where used, subagents were provided only necessary, factual context.
=== END CONSTITUTIONAL PRINCIPLES CHECKLIST ===

