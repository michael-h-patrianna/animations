# Project Overview

- **Purpose**: React + Motion animation catalog showcasing standalone, copy-pasteable animation components. Every animation is fully configurable via optional props, works with zero props in the catalog, and can be dropped into any React web or React Native (Moti) project.
- **Stack**: React 19, TypeScript 5.9, Vite 7, Tailwind CSS v4, Motion (Framer Motion v12), Radix UI.
- **Structure**: `src/components/<category>/<group>/{framer|css}` for animations. `src/components/ui` for catalog shell. `src/hooks`, `src/services`, `src/types`, `src/lib` for app logic.

## Always-Loaded Docs

| Doc | Content |
|-----|---------|
| `CLAUDE.md` | Identity, constraints, commands, data flow |
| `docs/architecture.md` | File placement, templates, decision trees |
| `docs/testing.md` | Test stack, templates, E2E selector policy |
| `docs/meta/styleguide.md` | Immutable naming/CSS/import/component rules |

## On-Demand Serena Memories

| Memory | Content |
|--------|---------|
| `codebase_structure` | Detailed folder map with every key file |
| `code_style_conventions` | TypeScript, state management, rendering patterns |
| `jsdoc_templates` | Component/hook/utility JSDoc templates |
| `project_tier_definitions` | Tier 1-4: what the consumer copies per level |
| `animation_design_principles` | Motion principles, timing, easing, performance rules |
| `test_templates_advanced` | Hook, integration, parity, and behavior test templates |
| `refactoring_consumer_product_identity` | Lesson: identify the consumer product before refactoring |

## Key References

- Quality bar / methodology: `docs/reports/animation-refactoring-playbook.md`
- Reference implementation: `src/components/rewards/collection-effects/`
- Demo separation: animation components contain zero demo code. Catalog renders demo UI via `demoMode` metadata → `DemoModeWrapper` in `GroupSection.tsx`.
