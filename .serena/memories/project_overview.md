# Project Overview

- **Purpose**: React animation catalog showcasing standalone, copy-pasteable animation components. Every animation is fully configurable via optional props, works with zero props in the catalog, and can be dropped into consumer projects.
- **Runtime model**: Baseline variants are `framer/` (Motion + React; React Native Moti/Reanimated starting point) and `css/` (CSS + React). Selected embedded-game groups may add optional `pixijs/` variants using PixiJS v8 + GSAP for React Native WebView games.
- **Stack**: React 19, TypeScript 5.9, Vite 7, Tailwind CSS v4, Motion (Framer Motion v12), PixiJS v8, GSAP, Radix UI.
- **Structure**: `src/components/<category>/<group>/{framer|css|pixijs}` for animation runtimes; `pixijs/` is opt-in per group via `techs: ['framer', 'css', 'pixijs']`. `src/pixijs/` contains shared Pixi host/helpers. `src/components/ui` for catalog shell. `src/hooks`, `src/services`, `src/types`, `src/lib` for app logic.

## Always-Loaded Docs

| Doc | Content |
|-----|---------|
| `CLAUDE.md` | Identity, constraints, commands, data flow |
| `docs/architecture.md` | File placement, runtime templates, decision trees |
| `docs/testing.md` | Test stack, PixiJS test policy, E2E selector policy |
| `docs/meta/styleguide.md` | Immutable naming/CSS/import/component/runtime rules |
| `docs/adr/ADR-010-pixijs-gsap-runtime.md` | PixiJS + GSAP runtime decision |

## On-Demand Serena Memories

| Memory | Content |
|--------|---------|
| `pixijs_gsap_runtime` | PixiJS runtime model, copy-paste contract, performance rules |
| `codebase_structure` | Detailed folder map with every key file |
| `code_style_conventions` | TypeScript, state management, rendering patterns |
| `jsdoc_templates` | Component/hook/utility JSDoc templates |
| `project_tier_definitions` | Tier 1-4: what the consumer copies per level |
| `animation_design_principles` | Motion principles, timing, easing, performance rules |
| `test_templates_advanced` | Hook, integration, parity, and behavior test templates |
| `refactoring_consumer_product_identity` | Lesson: identify the consumer product before refactoring |

## Key References

- Quality bar / methodology: `docs/reports/animation-refactoring-playbook.md`
- Reference implementation for baseline portability: `src/components/rewards/collection-effects/`
- PixiJS reference implementation: `src/components/base/text-effects/pixijs/`
- PixiJS host/helpers: `src/pixijs/`
- Demo separation: animation components contain zero demo code. Catalog renders demo UI via `demoMode` metadata → `DemoModeWrapper` in `GroupSection.tsx`.
