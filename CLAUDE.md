# Animation Showcase Catalog

Dual-implementation (CSS + Framer Motion) animation library for a monetisation platform. Every animation exists as both a CSS/React and a Motion/React variant for cross-platform portability.

## Constraints

| Constraint | Rule |
|-|-|
| Dual implementation | Every animation has both `framer/` and `css/` variants |
| Auto-discovery | Adding `.tsx` + `.meta.ts` to `framer/` or `css/` is sufficient — no index edits |
| No global CSS | Styles scoped to group (`shared.css`) or component (`.css` file) |
| Motion import | `import * as m from 'motion/react-m'` (never `framer-motion`) |
| Path aliases | Always use `@/` imports, never relative `../` chains |
| Metadata co-location | `.meta.ts` next to component — no external config files |
| Component purity | Animation components render only animation DOM — no cards, titles, or replay |

## Required Reading

@docs/architecture.md
@docs/testing.md
@docs/meta/styleguide.md

## Commands

| Command | Purpose |
|-|-|
| `npm run dev` | Dev server (already running — do not start another) |
| `npm test` | Unit tests (single run) |
| `npm run test:coverage` | Unit tests with coverage |
| `npm run test:e2e` | Playwright E2E (headless) |
| `npm run test:e2e:headed` | Playwright E2E (visible browser) |
| `npm run type-check` | TypeScript validation |
| `npm run lint` | ESLint + Stylelint |
| `npm run lint:css` | Stylelint only |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run build` | Production build (`tsc` + Vite) |
| `npx vite build` | Build without `tsc` gate |

## Data Flow

Component → Group `index.ts` (buildGroupExport) → Category `index.ts` → `animationRegistry.ts` → `animationData.ts` (buildCatalog) → `useAnimations` hook → `GroupSection` → `AnimationCard`

## Locating an Animation

Given animation id `modal-base__scale-gentle-pop`:

1. Group = `modal-base` → find group folder under a category
2. Category = `dialogs` → `src/components/dialogs/modal-base/`
3. Component = PascalCase of id → `ModalBaseScaleGentlePop.tsx` in `framer/` or `css/`

## Rendering Context

- Components render as children of `AnimationCard` inside `GroupSection`
- AnimationCard supplies title, description, replay button, `.pf-demo-canvas` wrapper
- Replay remounts the child by toggling a React key — components restart on mount
