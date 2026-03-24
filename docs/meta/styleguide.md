# Style Guide — Immutable Rules

**Purpose**: Project-specific rules that are code review rejections if violated.

---

## CSS Rules

| Rule                  | Required                                             | Forbidden                                         |
| --------------------- | ---------------------------------------------------- | ------------------------------------------------- |
| Class prefix          | `pf-` (e.g., `pf-modal`, `pf-modal--variant`)        | Unprefixed classes in animation components        |
| CSS scope             | Group-scoped `shared.css` or component-scoped `.css` | Global CSS in `App.css` or `index.css`            |
| Animation CSS         | CSS files in `css/` subdirectory only                | Animation keyframes in framer/ components         |
| Layout CSS in framer/ | Allowed for layout-only concerns                     | Animation properties (`@keyframes`, `transition`) |

## Import Rules

| Import        | Correct                                      | Wrong                                                           |
| ------------- | -------------------------------------------- | --------------------------------------------------------------- |
| Framer Motion | `import * as m from 'motion/react-m'`        | `import { motion } from 'framer-motion'`                        |
| Path aliases  | `import X from '@/components/X'`             | `import X from '../../../components/X'`                         |
| Types         | `import type { X } from '@/types/animation'` | `import { X } from '@/types/animation'` (for type-only imports) |
| Shared styles | `import '../shared.css'` (from group root)   | Importing CSS from other groups                                 |

## Animation Component Rules

- Every component exports a named function (no default exports)
- Root element has `data-animation-id` matching metadata `id` exactly
- No presentation wrappers (cards, titles, replay buttons) — AnimationCard provides these
- No `useState` for replay logic — parent remounts via key toggle
- Every animation implemented twice: one in `framer/`, one in `css/`
- Metadata file (`.meta.ts`) required next to every component file (`.tsx`)
- **Standalone**: no catalog-specific demo imports (`MockContent`, `DemoAnchors`, `isDemo` branches). `@/components/demo-blocks` imports ARE allowed — these are portable UI primitives (buttons, modals, lists, etc.) that ship with the animation as content. Demo UI orchestration (what to show, when) is rendered by the catalog layer via `demoMode` metadata, not by the component
- **All props optional**: components typed `ComponentType<Record<string, unknown>>`. Sensible defaults when props omitted (container center for spatial, placeholder content for wrappers)
- **Every configurable value is a prop**: hardcoded counts, positions, colors, durations, images that a consumer would want to change must be exposed as optional props
- **File header comment**: lists copy-paste files and runtime deps
- **Framer `m.*` elements sharing class names with CSS-animated elements**: add `style={{ animation: 'none' }}` to prevent CSS variant's animation overriding Motion transforms
- **CSS particle elements**: require `opacity: 0` + `animation-fill-mode: both` to prevent flash-of-visibility during delay

## TypeScript

- Strict mode — no `any`, no `@ts-ignore`
- Use discriminated unions for state machines
- Animation metadata type: `AnimationMetadata` from `@/types/animation`
- Group/category types: `GroupExport`, `CategoryExport` from `@/types/animation`

## Naming

| Item            | Convention                           | Example                           |
| --------------- | ------------------------------------ | --------------------------------- |
| Component files | PascalCase                           | `ModalBaseScaleGentlePop.tsx`     |
| CSS files       | Match component                      | `ModalBaseScaleGentlePop.css`     |
| Metadata files  | Match component + `.meta`            | `ModalBaseScaleGentlePop.meta.ts` |
| Animation IDs   | `group__variant` (double underscore) | `modal-base__scale-gentle-pop`    |
| CSS classes     | `pf-element--modifier`               | `pf-modal--scale-gentle-pop`      |
| Folders         | kebab-case                           | `modal-base`, `loading-states`    |

## JSDoc

Exported components, hooks, and public APIs require JSDoc with `@param` and `@returns`. Animation components are exempt (metadata serves as documentation).

## On-Demand References

| Detail                                     | Serena Memory            |
| ------------------------------------------ | ------------------------ |
| JSDoc templates (component, hook, utility) | `jsdoc_templates`        |
| General engineering principles             | `code_style_conventions` |
