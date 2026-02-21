# Sidebar group dedupe with code-mode routing (2026-02-21)
- Requirement: show one sidebar entry per logical group; top Framer/CSS tabs determine which variant to open.
- Implementation:
  - `src/components/ui/AppSidebar.tsx` now groups category groups by base ID (strip `-framer`/`-css`), renders a single label per base group, and routes click to variant matching `codeMode` with fallback (CSS -> Framer -> fallback or Framer -> CSS -> fallback).
  - `AppSidebar` now requires `codeMode` prop.
  - `src/App.tsx` passes `codeMode` to both desktop and mobile `AppSidebar` instances.
- Tests:
  - `src/components/ui/AppSidebar.test.tsx` validates deduped rendering, mode-aware selection, and fallback when requested mode variant is missing.