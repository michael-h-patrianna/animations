# Style Guide — Immutable Rules

**Purpose**: Project-specific rules that are code review rejections if violated.

---

## CSS Layers

Four CSS layers with strict boundaries enforced by stylelint.

| Layer                | Directory                                       | Prefix                  | Animation CSS                                                           | Enforcement                                                      |
| -------------------- | ----------------------------------------------- | ----------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Framer animation CSS | `framer/*.module.css`                           | `pf-*-fm`               | Banned (`@keyframes`, `animation`, `transition`)                        | Stylelint: `at-rule-disallowed-list`, `property-disallowed-list` |
| CSS animation CSS    | `css/*.module.css` (per component)              | `pf-*`                  | Allowed                                                                 | —                                                                |
| PixiJS canvas        | `pixijs/*.tsx`                                  | n/a                     | Canvas objects animated by GSAP. No global CSS animation dependencies.  | Code review + custom ESLint rules                                |
| Demo-blocks          | `demo-blocks/demo-blocks.css`                   | `pf-demo-*`             | Banned in shared file; component-specific CSS (e.g. `DemoToast.css`) OK | Stylelint override                                               |
| Demo-UI              | `demo-ui/`, `src/styles/`, `src/components/ui/` | `[data-demo-ui]` scoped | Allowed (catalog transitions, selection glow)                           | Attribute scoping                                                |

**shared.css** (group-level): structural/visual foundation only — layout, sizing, colors. Zero `@keyframes`, `animation`, or `transition` properties. Enforced by stylelint.

### What a consumer copies per animation

1. Framer: `ComponentName.tsx` + listed shared `.ts`/`.tsx` files + runtime deps `react`, `motion`.
2. CSS: `ComponentName.tsx` + `ComponentName.module.css` + listed shared files + runtime dep `react`.
3. PixiJS: `ComponentName.tsx` + listed scene/helper files + `src/pixijs/*` host helpers + runtime deps `react`, `pixi.js`, `gsap`.

Demo-blocks are not consumer-facing — they exist only to make the showcase work.

## CSS Rules

| Rule                  | Required                                                    | Forbidden                                                            |
| --------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------- |
| Class prefix          | `pf-` (e.g., `pf-modal`, `pf-modal--variant`)               | Unprefixed classes in animation components                           |
| Framer class suffix   | `-fm` (e.g., `pf-ripple-fm`)                                | `pf-*` without `-fm` in `framer/*.module.css`                        |
| CSS scope             | Group-scoped `shared.css` or component-scoped `.module.css` | Global CSS in `App.css` or `index.css`                               |
| Animation CSS         | Component's own CSS file in `css/` only                     | Animation keyframes in `framer/`, `shared.css`, or `demo-blocks.css` |
| Layout CSS in framer/ | Allowed for layout-only concerns                            | Animation properties (`@keyframes`, `transition`)                    |

## Import Rules

| Import        | Correct                                               | Wrong                                                           |
| ------------- | ----------------------------------------------------- | --------------------------------------------------------------- |
| Framer Motion | `import * as m from 'motion/react-m'`                 | `import { motion } from 'framer-motion'`                        |
| PixiJS        | `import { Container, Graphics, Text } from 'pixi.js'` | Deep imports from Pixi internals                                |
| GSAP          | `import { gsap } from 'gsap'`                         | Direct DOM animation in PixiJS variants                         |
| Path aliases  | `import X from '@/components/X'`                      | `import X from '../../../components/X'`                         |
| Types         | `import type { X } from '@/types/animation'`          | `import { X } from '@/types/animation'` (for type-only imports) |
| Shared styles | `import '../shared.css'` (from group root)            | Importing CSS from other groups                                 |

## Animation Component Rules

- Every component exports a named function (no default exports)
- Root element has `data-animation-id` matching metadata `id` exactly
- No presentation wrappers (cards, titles, replay buttons) — AnimationCard provides these
- No `useState` for replay logic — parent remounts via key toggle
- Every animation has baseline `framer/` and `css/` variants. `pixijs/` is optional and only for groups registered with `techs: ['framer', 'css', 'pixijs']`
- Metadata file (`.meta.ts`) required next to every component file (`.tsx`)
- **Standalone**: no catalog-specific demo imports (`MockContent`, `DemoAnchors`, `isDemo` branches). `@/components/demo-blocks` imports ARE allowed — these are portable UI primitives (buttons, modals, lists, etc.) that ship with the animation as content. Demo UI orchestration (what to show, when) is rendered by the catalog layer via `demoMode` metadata, not by the component
- **All props optional**: components typed `ComponentType<Record<string, unknown>>`. Sensible defaults when props omitted (container center for spatial, placeholder content for wrappers)
- **Every configurable value is a prop**: hardcoded counts, positions, colors, durations, images that a consumer would want to change must be exposed as optional props
- **File header comment**: lists copy-paste files and runtime deps
- **CSS Modules scoping**: All component CSS uses `.module.css` — class names are locally scoped, eliminating cross-variant animation bleed without manual `animation: 'none'` overrides
- **CSS particle elements**: require `opacity: 0` + `animation-fill-mode: both` to prevent flash-of-visibility during delay
- **PixiJS host**: Catalog variants use `PixiAnimationHost`; game consumers may reuse the scene factory inside an existing Pixi `Application`
- **PixiJS performance**: Use GSAP timelines for orchestration. Pause when offscreen. Destroy timelines, textures, and display objects on unmount. Avoid unmanaged `app.ticker.add`, unbounded object creation, and per-frame text/style mutation.
- **PixiJS text**: Create text sprites up front when possible. Counters may update text only when the displayed rounded value changes.

## TypeScript

- Strict mode — no `any`, no `@ts-ignore`
- Use discriminated unions for state machines
- Animation metadata type: `AnimationMetadata` from `@/types/animation`
- Group type: `GroupExport` from `@/types/animation`
- Category registration: `declareCategoryGroups()` from `@/lib/lazyGroupRegistry`

## Naming

| Item            | Convention                           | Example                              |
| --------------- | ------------------------------------ | ------------------------------------ |
| Component files | PascalCase                           | `ModalBaseScaleGentlePop.tsx`        |
| CSS files       | Match component + `.module`          | `ModalBaseScaleGentlePop.module.css` |
| Metadata files  | Match component + `.meta`            | `ModalBaseScaleGentlePop.meta.ts`    |
| Animation IDs   | `group__variant` (double underscore) | `modal-base__scale-gentle-pop`       |
| CSS classes     | `pf-element--modifier`               | `pf-modal--scale-gentle-pop`         |
| Folders         | kebab-case                           | `modal-base`, `loading-states`       |

## JSDoc

Exported components, hooks, and public APIs require JSDoc with `@param` and `@returns`. Animation components are exempt (metadata serves as documentation).

## On-Demand References

| Detail                                     | Serena Memory            |
| ------------------------------------------ | ------------------------ |
| JSDoc templates (component, hook, utility) | `jsdoc_templates`        |
| General engineering principles             | `code_style_conventions` |
