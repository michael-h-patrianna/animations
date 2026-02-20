# Project overview
- Purpose: React + Motion animation catalog/playground showcasing many animation components grouped by category/group.
- Stack: React 19, TypeScript 5, Vite 7, Tailwind CSS v4, Motion (Framer Motion v12), Radix UI.
- Structure:
  - `src/components/<category>/<group>/{framer|css}` for animation implementations.
  - `src/components/ui` for app shell and shared UI components.
  - `src/components/animationRegistry.ts` as central registry.
  - `src/hooks`, `src/services`, `src/types` for app logic/types.
- Key docs: `docs/architecture.md` and `docs/testing.md` define placement and testing conventions.
- Current state note: repository can be very dirty during large refactors; avoid reverting unrelated user changes.