# Animation Showcase Catalog

Dual-implementation (CSS + Motion) animation library for a monetisation platform. Every animation exists as both a CSS/React and a Motion/React variant — the Motion variant serves as starting point for React Native (Moti) adaptation.

## Quality Bar

Every animation must be **standalone and copy-pasteable**. A consumer copies the component file and its listed dependencies into their project, writes JSX with the documented props, and it works. No catalog imports, no demo scaffolding, no `@/assets` that don't exist in their project.

Every hardcoded value a consumer would want to change is exposed as an optional prop with a sensible default. The animation works with zero props in the catalog and with full configuration in a consumer's app.

Before implementing or reviewing any animation, think about the real use case: what would a developer building a mobile game, web app, or gamification layer want to configure? Research how professional games and animation libraries implement the same effect. The difference between "mechanically correct" and "feels professional" comes from understanding the specific motion principles that apply to that effect type.

Reference implementation: `src/components/rewards/collection-effects/`
Refactoring playbook: `docs/reports/animation-refactoring-playbook.md`

## Constraints

| Constraint            | Rule                                                                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dual implementation   | Every animation has both `framer/` and `css/` variants                                                                                                                                |
| Standalone components | No catalog-specific demo imports (`MockContent`, `DemoAnchors`, `isDemo`). `@/components/demo-blocks` OK — portable UI primitives that ship with the animation                        |
| Auto-discovery        | Adding `.tsx` + `.meta.ts` to `framer/` or `css/` is sufficient — no index edits                                                                                                      |
| No global CSS         | Styles scoped to group (`shared.css`) or component (`.module.css` file)                                                                                                               |
| Motion import         | `import * as m from 'motion/react-m'` (never `framer-motion`)                                                                                                                         |
| Path aliases          | Always use `@/` imports, never relative `../` chains                                                                                                                                  |
| Metadata co-location  | `.meta.ts` next to component — no external config files                                                                                                                               |
| Component purity      | Animation components render only animation DOM — no cards, titles, replay, or demo anchors. Demo-blocks (`DemoButton`, `DemoModal`, etc.) are animation content, not demo scaffolding |
| All props optional    | Components typed `ComponentType<Record<string, unknown>>` — must work with zero props                                                                                                 |
| CSS/framer conflict   | Resolved by CSS Modules — class names are locally scoped, eliminating cross-variant animation bleed                                                                                   |

## Required Reading

@docs/architecture.md
@docs/testing.md
@docs/meta/styleguide.md

## Commands

| Command                   | Purpose                                             |
| ------------------------- | --------------------------------------------------- |
| `npm run dev`             | Dev server (already running — do not start another) |
| `npm test`                | Unit tests (single run)                             |
| `npm run test:coverage`   | Unit tests with coverage                            |
| `npm run test:e2e`        | Playwright E2E (headless)                           |
| `npm run test:e2e:headed` | Playwright E2E (visible browser)                    |
| `npm run type-check`      | TypeScript validation                               |
| `npm run lint`            | ESLint + Stylelint                                  |
| `npm run lint:css`        | Stylelint only                                      |
| `npm run lint:fix`        | Auto-fix lint issues                                |
| `npm run build`           | Production build (`tsc` + Vite)                     |
| `npx vite build`          | Build without `tsc` gate                            |

## Data Flow

Component → Group `index.ts` (buildGroupExport) → Category `index.ts` (declareCategoryGroups) → `lazyGroupRegistry.ts` → `useLazyAnimations` hook → `AppNavigationContext` → `GroupSection` → `AnimationCard`

## Demo Separation

Animation components contain zero demo code. The catalog handles demo rendering:

1. Animation metadata has optional `demoMode` field
2. `GroupSection.tsx` checks `demoMode` and wraps component with `DemoModeWrapper`
3. The wrapper renders demo UI (anchors, mock data) as siblings and passes refs/values as props
4. The component receives these as normal optional props — it doesn't know about demos

## Locating an Animation

Given animation id `modal-base__scale-gentle-pop`:

1. Group = `modal-base` → find group folder under a category
2. Category = `dialogs` → `src/components/dialogs/modal-base/`
3. Component = PascalCase of id → `ModalBaseScaleGentlePop.tsx` in `framer/` or `css/`

## Rendering Context

- Components render as children of `AnimationCard` inside `GroupSection`
- AnimationCard supplies title, description, replay button, `.pf-demo-canvas` wrapper
- Replay remounts the child by toggling a React key — components restart on mount
- `DemoModeWrapper` renders demo anchors as siblings when `demoMode` metadata is set
