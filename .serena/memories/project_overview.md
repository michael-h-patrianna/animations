# Project Overview

- **Purpose**: React + Motion animation catalog showcasing standalone, copy-pasteable animation components. Every animation is fully configurable via optional props, works with zero props in the catalog, and can be dropped into any React web or React Native (Moti) project.
- **Stack**: React 19, TypeScript 5.9, Vite 7, Tailwind CSS v4, Motion (Framer Motion v12), Radix UI.
- **Structure**: `src/components/&lt;category&gt;/&lt;group&gt;/{framer|css}` for animations. `src/components/ui` for catalog shell. `src/hooks`, `src/services`, `src/types`, `src/lib`, `src/utils`, `src/demo-ui` for app logic.

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
| `codebase_structure` | Detailed folder map with every key file and directory purpose |
| `code_style_conventions` | TypeScript strict mode, state management (Context+hooks), naming, import conventions, error handling patterns |
| `jsdoc_templates` | Component/hook/utility/context JSDoc templates with examples |
| `project_tier_definitions` | Tier 1-4 portability definitions — what consumer copies per level, import rules, enforcement tests |
| `animation_design_principles` | Motion timing/easing, particle guidelines, reduced motion, performance, parity rules |
| `test_templates_advanced` | Hook, integration, parity, behavior, and property test templates with real examples |
| `refactoring_consumer_product_identity` | Lesson: identify consumer product before refactoring — drives props, defaults, dependencies |

## Key References

- Quality bar / methodology: `docs/reports/animation-refactoring-playbook.md`
- Reference implementation: `src/components/rewards/collection-effects/`
- Demo separation: animation components contain zero demo code. Catalog renders demo UI via `demoMode` metadata → `DemoModeWrapper` in `GroupSection.tsx`.
