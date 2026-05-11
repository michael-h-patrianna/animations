# Animation Showcase Catalog

Multi-runtime animation library for a monetisation platform. Every animation exists as CSS/React and Motion/React; selected embedded-game groups also expose PixiJS v8 + GSAP variants. Motion remains the React Native (Moti) starting point. PixiJS variants target games loaded in React Native WebViews, so they are not constrained by Moti portability rules.

## Quality Bar

Every animation must be **standalone and copy-pasteable**. A consumer copies the component file and its listed dependencies into their project, writes JSX with the documented props, and it works. No catalog imports, no demo scaffolding, no `@/assets` that don't exist in their project.

Every hardcoded value a consumer would want to change is exposed as an optional prop with a sensible default. The animation works with zero props in the catalog and with full configuration in a consumer's app.

Before implementing or reviewing any animation, think about the real use case: what would a developer building a mobile game, web app, or gamification layer want to configure? Research how professional games and animation libraries implement the same effect. The difference between "mechanically correct" and "feels professional" comes from understanding the specific motion principles that apply to that effect type.

Reference implementation: `src/components/rewards/collection-effects/`
Refactoring playbook: `docs/reports/animation-refactoring-playbook.md`

## Constraints

| Constraint            | Rule                                                                                                                                                                                |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime coverage      | `framer/` + `css/` are baseline for every animation. Add `pixijs/` only for game/WebView groups and opt the group into `techs: ['framer', 'css', 'pixijs']`.                        |
| Standalone components | No catalog-specific demo imports (`MockContent`, `DemoAnchors`, `isDemo`). `@/components/demo-blocks` OK — portable UI primitives that ship with the animation                      |
| PixiJS portability    | PixiJS variants must be copy-pasteable into a PixiJS + GSAP game: list component, scene, host/helper files, and runtime deps in the file header.                                    |
| Auto-discovery        | Adding `.tsx` + `.meta.ts` to `framer/`, `css/`, or opted-in `pixijs/` is sufficient — no generated index edits                                                                     |
| No global CSS         | Styles scoped to group (`shared.css`) or component (`.module.css` file). PixiJS animation visuals belong in canvas objects, not global CSS.                                         |
| Motion import         | `import * as m from 'motion/react-m'` (never `framer-motion`)                                                                                                                       |
| PixiJS runtime        | Use `PixiAnimationHost` for catalog cards. Use GSAP timelines for orchestration; avoid unmanaged ticker loops, per-frame text rasterization, and unbounded display-object creation. |
| Path aliases          | Always use `@/` imports, never relative `../` chains                                                                                                                                |
| Metadata co-location  | `.meta.ts` next to component. PixiJS metadata includes `urlSlugPixijs: '/<group>-pixijs?animation=<id>'`.                                                                           |
| Component purity      | Animation components render only animation DOM/canvas — no cards, titles, replay, or demo anchors. Demo-blocks (`DemoButton`, `DemoModal`, etc.) are animation content.             |
| All props optional    | Components typed `ComponentType<Record<string, unknown>>` — must work with zero props                                                                                               |
| CSS/framer conflict   | Resolved by CSS Modules — class names are locally scoped, eliminating cross-variant animation bleed                                                                                 |

## Required Reading

@docs/architecture.md
@docs/testing.md
@docs/meta/styleguide.md

## Commands

| Command                    | Purpose                                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| `pnpm run dev`             | Dev server (already running — do not start another)                                         |
| `pnpm test`                | Unit tests (single run)                                                                     |
| `pnpm run test:coverage`   | Unit tests with coverage                                                                    |
| `pnpm run test:e2e`        | Playwright E2E (headless)                                                                   |
| `pnpm run test:e2e:headed` | Playwright E2E (visible browser)                                                            |
| `pnpm run type-check`      | TypeScript validation                                                                       |
| `pnpm run lint`            | ESLint + Stylelint                                                                          |
| `pnpm run lint:css`        | Stylelint only                                                                              |
| `pnpm run lint:fix`        | Auto-fix lint issues                                                                        |
| `pnpm run build`           | Production build (`tsc` + Vite)                                                             |
| `pnpm exec vite build`     | Build without `tsc` gate                                                                    |
| `pnpm run generate:groups` | Regenerate group `index.ts` files from codegen manifest                                     |
| `pnpm run validate`        | Full quality gate (codegen-check + type-check + lint + format + test + build + bundle-size) |

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
3. Component = PascalCase of id → `ModalBaseScaleGentlePop.tsx` in `framer/`, `css/`, or opted-in `pixijs/`

## Group Name Lookup

| UI Title              | Group ID                     | Folder Path                                          |
| --------------------- | ---------------------------- | ---------------------------------------------------- |
| Base modal animations | `modal-base`                 | `src/components/dialogs/modal-base/`                 |
| Content choreography  | `modal-content-choreography` | `src/components/dialogs/modal-content-choreography/` |
| Auto-dismiss patterns | `auto-dismiss`               | `src/components/dialogs/auto-dismiss/`               |
| Modal open            | `modal-open`                 | `src/components/dialogs/modal-open/`                 |
| Tile animations       | `tile-animations`            | `src/components/dialogs/tile-animations/`            |
| Celebration effects   | `celebration-effects`        | `src/components/rewards/celebration-effects/`        |
| Collection Effects    | `collection-effects`         | `src/components/rewards/collection-effects/`         |
| Icon Animations       | `icon-animations`            | `src/components/rewards/icon-animations/`            |
| Lights                | `lights`                     | `src/components/rewards/lights/`                     |
| Prize Reveal          | `prize-reveal`               | `src/components/rewards/prize-reveal/`               |
| Button effects        | `button-effects`             | `src/components/base/button-effects/`                |
| Standard effects      | `standard-effects`           | `src/components/base/standard-effects/`              |
| Text effects          | `text-effects`               | `src/components/base/text-effects/`                  |
| Progress bars         | `progress-bars`              | `src/components/progress/progress-bars/`             |
| Loading states        | `loading-states`             | `src/components/progress/loading-states/`            |
| Timer effects         | `timer-effects`              | `src/components/realtime/timer-effects/`             |
| Update indicators     | `update-indicators`          | `src/components/realtime/update-indicators/`         |
| Realtime data         | `realtime-data`              | `src/components/realtime/realtime-data/`             |

Categories: `base` = "Base Effects", `dialogs` = "Dialog & Modal Animations", `progress` = "Progress & Loading Animations", `realtime` = "Real-time Updates & Timers", `rewards` = "Game Elements & Rewards"

## Rendering Context

- Components render as children of `AnimationCard` inside `GroupSection`
- AnimationCard supplies title, description, replay button, `.pf-demo-canvas` wrapper
- Replay remounts the child by toggling a React key — components restart on mount
- `DemoModeWrapper` renders demo anchors as siblings when `demoMode` metadata is set
