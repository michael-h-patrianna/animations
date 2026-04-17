# Animation Showcase

[![CI](https://github.com/michael-haufschild-gib/animations/actions/workflows/ci.yml/badge.svg)](https://github.com/michael-haufschild-gib/animations/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/michael-haufschild-gib/animations/graph/badge.svg)](https://codecov.io/gh/michael-haufschild-gib/animations)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built with Claude Code](https://img.shields.io/badge/Built%20with-Claude%20Code-blueviolet)](https://claude.ai/claude-code)

**[Live Demo](https://animations-nine-sandy.vercel.app/)**

A catalog of 170+ reusable UI animations for React, each implemented twice: **CSS+React** and **Motion (Framer Motion)+React**. Every animation is standalone and copy-pasteable — grab the component file, drop it in your project, and it works.

This entire project was vibecoded with [Claude Code](https://claude.ai/claude-code).

## Quick start

Requires **pnpm >= 10**. `package.json` pins the exact version via `packageManager`, so `corepack enable` is the recommended install — it resolves and caches the pinned version automatically.

```bash
corepack enable           # or: npm install -g pnpm
pnpm install
pnpm run dev              # http://localhost:3000
pnpm exec playwright install   # one-time — needed before `pnpm run test:e2e`
```

`playwright` has no postinstall, so browser binaries are not downloaded by `pnpm install`. Run `pnpm exec playwright install` once per clone before executing E2E tests.

### Dependency build scripts (pnpm v10)

pnpm v10 blocks install-time build scripts by default. The allowlist lives under `pnpm.onlyBuiltDependencies` in `package.json` — currently `esbuild` (used by Vite). When adding or updating a devDependency that ships a `preinstall`/`install`/`postinstall` script, run `pnpm ignored-builds` after `pnpm install`; if the package appears there and its build step is needed, add it to `onlyBuiltDependencies` in the same PR. Review this list on dependency bumps to avoid silent breakage.

## Commands

| Command                     | Purpose                         |
| --------------------------- | ------------------------------- |
| `pnpm run dev`              | Dev server (port 3000)          |
| `pnpm run build`            | Production build (`tsc` + Vite) |
| `pnpm run lint`             | ESLint + Stylelint              |
| `pnpm run type-check`       | TypeScript strict check         |
| `pnpm test`                 | Vitest unit tests               |
| `pnpm run test:coverage`    | Unit tests with coverage        |
| `pnpm run test:e2e`         | Playwright E2E (3 browsers)     |
| `pnpm run format:check`     | Prettier format check           |
| `pnpm run build:check-size` | Bundle size budget check        |
| `pnpm run lighthouse`       | Lighthouse CI (perf + a11y)     |

## Architecture

**Stack**: React 19, TypeScript 5.9, Vite 7, Tailwind CSS v4, Motion (Framer Motion v12).

```
src/
├── components/
│   ├── <category>/           # e.g. base, dialogs, progress, realtime, rewards
│   │   ├── index.ts          # Category aggregation
│   │   └── <group>/          # e.g. standard-effects, modal-base
│   │       ├── index.ts      # Auto-discovers animations via import.meta.glob
│   │       ├── framer/       # Motion implementations + .meta.ts
│   │       └── css/          # CSS implementations + .meta.ts + .css
│   ├── ui/                   # Catalog shell (sidebar, cards, controls)
│   └── animationRegistry.ts  # Central registry
├── services/                 # Data layer (synchronous catalog builder)
├── hooks/                    # React hooks
├── types/                    # TypeScript types (branded IDs, discriminated unions)
├── motion/                   # Shared motion tokens and primitives
└── lib/                      # Utilities (groupBuilder, preload, sourceTransform)
```

Each animation component has a co-located `.meta.ts` file with its metadata (id, title, description, tier, and optional behavioral flags like `infinite` or `controls`). Group `index.ts` files use `import.meta.glob` for auto-discovery — adding a new animation requires only two files: the component and its metadata. No index editing.

See [docs/architecture.md](docs/architecture.md) for full placement rules and component templates.

## How to use an animation

Every animation is designed to be copied out of this repo and into your project:

1. Browse the [live catalog](https://animations-nine-sandy.vercel.app/)
2. Find an animation you like, click the code viewer to see the source
3. Copy the component `.tsx` (and `.css` for CSS variants) into your project
4. Write `<ComponentName />` — all props are optional with sensible defaults

Animations are classified by **portability tier** (1-4) indicating what you need to copy:

| Tier               | What you copy                          | Example                    |
| ------------------ | -------------------------------------- | -------------------------- |
| 1 — Effect         | Just the CSS keyframes or Motion props | Fade, bounce, slide        |
| 2 — Decorated      | Component + CSS file                   | Glow pulse, shimmer        |
| 3 — Orchestration  | Component + CSS + HTML structure       | Staggered list, tab morph  |
| 4 — Full Component | Entire group directory                 | Prize reveal, celebrations |

## How to add an animation

1. Create `<ComponentName>.tsx` in `src/components/<category>/<group>/framer/` (and `css/`)
2. Create `<ComponentName>.meta.ts` alongside it with metadata:

   ```typescript
   import type { AnimationMetadata } from '@/types/animation'

   export const metadata = {
     id: 'group-id__variant-name',
     title: 'Variant Name',
     description: 'What it does',
     tier: 2,
   } satisfies AnimationMetadata
   ```

3. Run `pnpm test` — smoke tests and lint rules verify registration automatically.

## Quality gates

The CI pipeline enforces:

- **TypeScript** strict mode with `noUncheckedIndexedAccess` and branded ID types
- **30+ custom ESLint rules** enforcing animation portability (no hardcoded colors, dual implementation required, no CSS animations in Motion variants, no non-portable styles in `framer/`)
- **6 custom Stylelint rules** (no blur, no conic gradients, no z-index magic numbers, no hardcoded colors in CSS)
- **1250+ unit tests** (Vitest) with per-subsystem coverage thresholds (90% for hooks/lib/services)
- **Property-based tests** (fast-check) for color utilities, metadata validation, source transforms
- **60+ E2E test specs** across Chromium, WebKit, and Firefox (Playwright)
- **Bundle size budgets** per chunk — lazy-loaded animation groups stay within defined limits
- **Lighthouse CI** — performance >= 0.8, accessibility >= 0.9
- **Pre-commit**: lint-staged + type-check. **Pre-push**: build + bundle size check.

## Custom lint rules

- **No hardcoded colors** — use CSS custom properties
- **Dual implementation required** — every animation must exist in both `css/` and `framer/`
- **No CSS animations in Motion variants** — Motion files drive animation through the Motion API
- **No non-portable styles** — `clipPath`, `boxShadow`, `grid` banned in `framer/` (not available in React Native)
- **No shallow test assertions** — `toBeDefined()`, `toBeTruthy()` are errors
- **No CSS class selectors in E2E** — use `data-testid` or `aria-*` attributes
- **Tier dependency budgets** — imports must respect the declared portability tier

## Portability

Animations use transform/opacity-driven patterns so they can be translated to React Native using Reanimated and Moti with minimal rework. The catalog serves as a reference for motion behaviors that teams can adopt on web and migrate to native without redesigning the animation logic.

## Architecture decisions

Key design decisions are documented as ADRs in [docs/adr/](docs/adr/):

- [ADR-001](docs/adr/ADR-001-framer-motion.md) — Framer Motion as primary animation driver
- [ADR-002](docs/adr/ADR-002-colocated-metadata.md) — Co-located component metadata system
- [ADR-006](docs/adr/ADR-006-self-contained-animations.md) — Self-contained animation components
- [ADR-007](docs/adr/ADR-007-auto-discovery-glob.md) — Auto-discovery via import.meta.glob
- [ADR-008](docs/adr/ADR-008-lint-integrity-enforcement.md) — Lint config integrity enforcement

## License

[MIT](LICENSE)
