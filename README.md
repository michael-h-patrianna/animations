# Animations Catalog (React + TypeScript)

Purpose

This project is a living catalog of reusable UI animations for a modern React web applications. Each animation is implemented as a small React (TypeScript) component using CSS and/or Framer Motion, organized into categories and groups and rendered in a consistent showcase. The goal is to make high‑quality, production‑ready motion easy to discover, copy, and reuse across products.

Portability

Animations are intentionally authored with transform/opacity‑driven patterns so they can be translated to React Native using React Reanimated and Moti with minimal rework. The catalog serves as a reference and source of truth for motion behaviors that teams can adopt on web today and migrate to native later without redesigning the animation logic.

Read: `docs/REACT_NATIVE_REFACTORING_PATTERNS.md` how to ensure that all animations can easily be translated to our native react apps.

## Project structure

**Co-located Metadata System** - The project uses component-based metadata.

- **Source of truth**: Folder structure + component metadata exports
  - `src/components/<category>/` – Each category folder contains groups
  - `src/components/<category>/<group>/` – Each group folder contains animations
  - Each animation exports its metadata: `export const metadata: AnimationMetadata = { ... }`
  - Each group's `index.ts` aggregates animations
  - Each category's `index.ts` aggregates groups

- **Data → UI wiring**:
  - `src/services/animationData.ts` – builds catalog from component exports
  - `src/components/animationRegistry.ts` – provides hierarchical access
  - See `ARCHITECTURE.md` for detailed documentation

- **Components (implementation)**:
  - `src/components/<category-id>/<group-id>/` – all animations for a group
    - `*.tsx` – one React component per animation + metadata export
    - `*.css` – co-located CSS file per component with all styles
  - Catalog UI: `src/components/ui/` (AnimationCard, GroupSection, CategorySection)

New categories and groups

- Added category `Misc` with a group `Misc` hosting small CSS-only dot/circle animations adapted to the project's color scheme and without backgrounds.

Where to find something to edit

1. Navigate to `src/components/<category-id>/<group-id>/` and find the PascalCase component file
2. The component contains both the animation logic AND metadata export
3. Styles live next to the component in a co-located `.css` file

## How to add an animation

1. **Create component** in `src/components/<category-id>/<group-id>/YourAnimation.tsx`:
   ```typescript
   import type { AnimationMetadata } from '@/types/animation'

   export function YourAnimation() {
     return <div>...</div>
   }

   export const metadata: AnimationMetadata = {
     id: 'group-id__your-animation',
     title: 'Your Animation',
     description: 'What it does',
     tags: ['css'], // or ['framer'], ['js', 'css'], etc.
   }
   ```

2. **Add to group index** (`src/components/<category>/<group>/index.ts`):
   - Import component + metadata
   - Add to `groupExport.animations` object

3. **Create CSS file** (if needed) next to your component

4. **Run tests**: `npm run build && npm run test`

See `ARCHITECTURE.md` for complete details.

Notes for RN-friendly animations

- Avoid SVG/Canvas and prefer pure CSS or Framer Motion transforms that translate to Reanimated/Moti
- Use transform/opacity-driven patterns for portability

## How to remove an animation

1. Delete the component file from `src/components/<category-id>/<group-id>/`
2. Delete its co-located `.css` file if present
3. Remove from group's `index.ts` (groupExport.animations)
4. Run tests to ensure the catalog renders correctly
