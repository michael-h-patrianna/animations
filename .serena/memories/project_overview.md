# Project overview

- Purpose: React + Motion animation catalog/playground showcasing many animation components grouped by category/group.
- Stack: React 19, TypeScript 5, Vite 7, Tailwind CSS v4, Motion (Framer Motion v12), Radix UI.
- Structure:
  - `src/components/<category>/<group>/{framer|css}` for animation implementations.
  - `src/components/ui` for app shell and shared UI components.
  - `src/components/animationRegistry.ts` as central registry.
  - `src/hooks`, `src/services`, `src/types`, `src/lib` for app logic/types/helpers.
- Always-loaded docs:
  - `CLAUDE.md` — identity, constraints, commands, data flow
  - `docs/architecture.md` — file placement, templates, decision trees
  - `docs/testing.md` — test stack, templates, selector policy
  - `docs/meta/styleguide.md` — immutable naming/CSS/import/component rules
- On-demand Serena memories: `codebase_structure`, `code_style_conventions`, `jsdoc_templates`, `test_templates_advanced`
- Current state note: repository can be very dirty during large refactors; avoid reverting unrelated user changes.
