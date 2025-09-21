# Animations Catalog (React + TypeScript)

Purpose

This project is a living catalog of reusable UI animations for a modern React web applications. Each animation is implemented as a small React (TypeScript) component using CSS and/or Framer Motion, organized into categories and groups and rendered in a consistent showcase. The goal is to make high‑quality, production‑ready motion easy to discover, copy, and reuse across products.

Portability

Animations are intentionally authored with transform/opacity‑driven patterns so they can be translated to React Native using React Reanimated and Moti with minimal rework. The catalog serves as a reference and source of truth for motion behaviors that teams can adopt on web today and migrate to native later without redesigning the animation logic.

Read: `docs/REACT_NATIVE_REFACTORING_PATTERNS.md` how to ensure that all animations can easily be translated to our native react apps.

## Project structure

- Source of truth for behaviors and grouping:
	- `docs/structure.json` – category → group → animations metadata
- Data → UI wiring:
	- `src/services/animationData.ts` – reads `structure.json` and exposes catalog
	- `src/components/animationRegistry.ts` – maps animation ids to React components
- Components (implementation):
	- `src/components/<category-id>/<group-id>/` – all animations for a group
		- `<group-id>.css` – shared CSS for the group
		- `*.tsx` – one React component per animation (PascalCase of animation id)

Base effects groups include:
- `text-effects` – animated text patterns
- `standard-effects` – common micro-interactions
- `button-effects` – button interactions (press, hover, ripples)

Where to find something to edit

1) Identify the animation’s id in `docs/structure.json` (format: `category-group__variant`).
2) Open `src/components/<category-id>/<group-id>/` and edit the corresponding `PascalCase` component file.
3) Shared styles live in `<group-id>.css` in the same folder.

## How to add an animation

1) Define it in `docs/structure.json` under the correct category/group with fields: `id`, `title`, `description`, `categoryId`, `groupId`.
2) Create a new component file in `src/components/<category-id>/<group-id>/` named after the animation id in PascalCase (e.g., `ModalBaseScaleGentlePop.tsx`). Implement using CSS and/or Framer Motion.
3) Add or update group-level styles in `src/components/<category-id>/<group-id>/<group-id>.css` as needed (scoped selectors only).
4) Register the component id → component in `src/components/animationRegistry.ts` so it renders in the catalog.
5) Run tests and verify the card renders; ensure replay works via remount.

## How to remove an animation

1) Remove its entry from `docs/structure.json` under the relevant group.
2) Remove the component mapping from `src/components/animationRegistry.ts`.
3) Delete the component file from `src/components/<category-id>/<group-id>/`.
4) Clean up any now-unused CSS in `<group-id>.css` (only if nothing else references it).
5) Run tests to ensure the catalog and groups render without the removed item.
