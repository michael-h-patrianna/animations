# Animation Showcase

A living catalog of reusable UI animations for React applications. Every animation is implemented twice — **CSS+React** and **Framer Motion+React** — for cross-platform portability (web today, React Native via Moti later).

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

## Commands

| Command                | Purpose                                            |
| ---------------------- | -------------------------------------------------- |
| `npm run dev`          | Dev server (port 3000)                             |
| `npm run build`        | Production build                                   |
| `npm run lint`         | ESLint + Stylelint                                 |
| `npm run type-check`   | TypeScript strict check                            |
| `npm test`             | Vitest unit tests                                  |
| `npm run test:e2e`     | Playwright E2E (Chromium, Firefox, Safari, mobile) |
| `npm run format:check` | Prettier format check                              |

## Architecture

**Stack**: React 19, TypeScript 5.9, Vite 7, Tailwind CSS v4, Motion (Framer Motion v12), Radix UI.

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
├── types/                    # TypeScript types
├── motion/                   # Shared motion tokens and primitives
└── lib/                      # Utilities (groupBuilder, preload)
```

Each animation component has a co-located `.meta.ts` file with its metadata (id, title, description, tags, and optional behavioral flags like `infinite` or `controls`). Group `index.ts` files use `import.meta.glob` for auto-discovery — adding a new animation requires only two files: the component and its metadata.

See [docs/architecture.md](docs/architecture.md) for full placement rules and component templates.

## How to add an animation

1. Create `<ComponentName>.tsx` in `src/components/<category>/<group>/framer/` (and `css/`)
2. Create `<ComponentName>.meta.ts` alongside it with metadata:

   ```typescript
   import type { AnimationMetadata } from '@/types/animation'

   export const metadata: AnimationMetadata = {
     id: 'group-id__variant-name',
     title: 'Variant Name',
     description: 'What it does',
     tags: ['framer'],
   }
   ```

3. Run `npm test` — the smoke test and lint rules verify registration automatically.

No manual index editing required. The `import.meta.glob` in the group's `index.ts` discovers new files automatically.

## How to remove an animation

1. Delete the component `.tsx`, `.meta.ts`, and `.css` files
2. Run `npm test` to verify the catalog renders correctly

## Custom lint rules

The project enforces animation portability through 16 custom ESLint rules in `eslint-rules/`:

- **No hardcoded colors** — use CSS custom properties
- **Dual implementation required** — every animation must exist in both `css/` and `framer/`
- **No CSS animations in Motion variants** — Motion files must drive animation through the Motion API
- **No non-portable styles** — `clipPath`, `boxShadow`, `grid` banned in `framer/` (not available in React Native)
- **No shallow test assertions** — `toBeDefined()`, `toBeTruthy()`, tautological `getBy*.toBeInTheDocument()` are errors

## Portability

Animations use transform/opacity-driven patterns so they can be translated to React Native using Reanimated and Moti with minimal rework. The catalog serves as a reference for motion behaviors that teams can adopt on web and migrate to native without redesigning the animation logic.
