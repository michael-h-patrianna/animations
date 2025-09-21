# Test Gap Report — Animations Catalog

Date: 2025-09-21

This report identifies all current violations of the principle “everything must be covered by tests” across unit, integration, and end-to-end layers. It is based on the current repository state and test configuration.

## Scope reviewed

- Unit test setup via Jest (`jest.config.cjs`, `src/test/setup.ts`)
- E2E setup via Playwright (`playwright.config.ts`)
- Source files under `src/**`
- Existing unit tests under `src/**/*.test.{ts,tsx}` and `src/**/AnimationCard.test.tsx`
- Existing e2e tests under `tests/e2e/**`

## Executive summary

- Several existing tests are out-of-date with the current implementation, yielding false assumptions and leaving real behavior unverified.
- Large portions of the codebase have no direct unit tests (services, hooks, registry, catalog sections, UI primitives, utility helpers).
- The vast majority of animation components (dozens across categories) lack any form of automated smoke/unit testing.
- No invariant/contract tests ensure the catalog metadata (`docs/structure.json`) is in sync with the component registry (`src/components/animationRegistry.ts`).
- No coverage thresholds are enforced in Jest, which weakens the “everything must be covered” principle.

## A. Drifted/broken tests (do not reflect current UI contracts)

These tests either target props/contracts that no longer exist or rely on DOM structure that is no longer rendered by the app. This means the covered behavior is not what users actually get, violating the “coverage” principle in practice.

1) `src/components/Sidebar.test.tsx` vs `src/components/Sidebar.tsx`
- Prop mismatch:
  - Test assumes props `currentCategoryId` and `onGroupSelect(categoryId, groupId)`.
  - Implementation uses `currentGroupId` and `onGroupSelect(groupId)`.
- Behavioral assumption mismatch:
  - Test case “shows groups only for the active category” assumes only active category’s groups are displayed.
  - Implementation renders groups for each category regardless of active state and only toggles active styling using `currentGroupId`.
- Result: Tests are not validating the real component behavior and likely fail to compile or assert invalid expectations.

2) `src/App.test.tsx` vs `src/App.tsx`
- DOM/structure mismatch:
  - Test expects category-level headings like “Base effects” / “Dialog & Modal Animations” to be present and switchable.
  - Implementation renders only a single `GroupSection` (current group) and does not render `CategorySection` or category-level headings in the main content.
- Result: Assertions for category headings will not reflect the actual DOM rendered by `App`.

3) E2E: `tests/e2e/category-navigation.spec.ts`
- Relies on `.pf-category` sections and category-level `<h1>` headings (e.g., `h1:has-text("Dialog & Modal Animations")`).
- The current `App` renders group-level sections (`.pf-group`) and uses a sliding/swipe transition between groups; `CategorySection` is not part of the live UI flow.
- Result: Scenarios like “displays only one category at a time” and selectors using `.pf-category` target a structure not present at runtime.

4) E2E: `tests/e2e/homepage.spec.ts`
- Assumes a group element `#group-modal-base` is present on initial load.
- The app initializes to the first group in the first category (`base → text-effects`), so `#group-modal-base` is not visible by default.
- Also expects a “Categories” heading which is not rendered in the current layout; categories are represented as buttons in the sidebar.

Impact: These drifted tests provide a false sense of coverage and should be updated to match the current contracts, or the app’s UI should be adjusted to reintroduce the intended structure—choose one and make it consistent.

## B. Untested modules and surfaces (unit level)

The following modules have no direct unit tests. While some behavior may be exercised indirectly through other tests, there are no focused tests guaranteeing their contracts and edge cases.

- Services and hooks
  - `src/services/animationData.ts` — missing tests for:
    - Mapping `docs/structure.json` → catalog (`mapStructureToCatalog` path via `ensureCatalog`)
    - `addAnimation` ID format and side effects (extra list, incremental catalog updates)
    - `refreshCatalog` rebuild semantics
    - `getAnimationsByGroup` lookup and empty cases
  - `src/hooks/useAnimations.ts` — missing tests for:
    - Loading state lifecycle (initial, success)
    - Error path when service throws (message propagation)
    - `refreshAnimations` behavior

- Catalog components
  - `src/components/catalog/CategorySection.tsx` — missing tests for:
    - Animation count aggregation and rendering of headings
    - Empty state rendering when no groups
  - `src/components/catalog/GroupSection.tsx` — missing tests for:
    - Placeholder rendering when a registry entry is missing
    - `isInfiniteAnimation` routing (e.g., all `loading-states` and specific real-time/update indicator IDs)
    - Empty state when `group.animations` is empty

- Registry and metadata invariants
  - `src/components/animationRegistry.ts` — missing tests for:
    - Every `id` in `docs/structure.json` has a corresponding component in the registry
    - No orphaned components in registry that aren’t present in `structure.json`

- UI primitives and utilities
  - `src/components/ui/*` (button, card, accordion, sidebar) — missing smoke tests for render, ref forwarding, and class variance props
  - `src/lib/utils.ts` (`cn`) — missing tests for class merging precedence and deduplication

- Types (optional but helpful for stability)
  - `src/types/animation.ts` — could include compile-time tests or minimal runtime guards around critical contracts; currently untested

## C. Animation components — missing smoke coverage (unit level)

None of the animation components themselves are directly exercised by unit tests. This includes, but is not limited to, all `*.tsx` under:

- `src/components/base/standard-effects/*`
- `src/components/base/text-effects/*`
- `src/components/dialogs/modal-base/*`
- `src/components/dialogs/modal-content/*`
- `src/components/dialogs/modal-dismiss/*`
- `src/components/dialogs/modal-orchestration/*`
- `src/components/progress/loading-states/*`
- `src/components/progress/progress-bars/*`
- `src/components/realtime/realtime-data/*`
- `src/components/realtime/timer-effects/*`
- `src/components/realtime/update-indicators/*`
- `src/components/rewards/icon-animations/*`
- `src/components/rewards/reward-basic/*`
- `src/components/rewards/reward-feedback/*`
- `src/components/rewards/reward-mechanics/*`
- `src/components/rewards/reward-orchestrations/*`

Risk: refactors to any single animation component could break export names, props, or render without any test catching it.

Recommended fix: add a parameterized “registry smoke test” that renders every component from `animationRegistry` inside an `AnimationCard` with `infiniteAnimation` enabled and asserts it mounts successfully without throwing (and includes a sanity DOM assertion). This yields broad coverage with minimal per-component boilerplate.

## D. E2E coverage gaps (behavioral flows)

- No end-to-end invariant test that the catalog renders a card for every animation ID in `docs/structure.json` (guard against registry drift and missing exports).
- No end-to-end test that the “Replay” control remounts the child content for multiple cards (only spot-checked).
- No end-to-end test that infinite animations are visible immediately (e.g., all `loading-states` and specific real-time/update indicator animations).
- No end-to-end test for deep navigation across all categories and groups using only the sidebar buttons to verify all group sections can be reached.
- No E2E coverage for error state UI in `App` (service error path). This is hard to trigger currently since data is local; would require an injection point or feature flag for testing.

## E. Configuration/policy gaps

- `jest.config.cjs` has no `coverageThreshold`. Without thresholds, “everything must be covered” is not enforced. Add strict thresholds (e.g., start with 90–95% global and ratchet up, or require 100% where realistic) and use per-path overrides selectively.
- Coverage is collected from `src/**/*.{js,jsx,ts,tsx}` excluding `src/main.tsx` and types, which is fine. However, due to missing tests mentioned above, the effective coverage is far below the stated principle.
- No guard or CI check highlighted here to fail builds when tests are out-of-date (e.g., selectors using `.pf-category`), leading to drift.

## Recommended actions (prioritized)

1) Repair drifted tests to match real contracts
- Sidebar tests: update props and expectations to `currentGroupId` and `onGroupSelect(groupId)`; remove assumptions that only active category groups are shown.
- App tests: assert group-level rendering (current group only), not category-level headings. Verify swipe/navigation between groups if kept at unit level (or move to E2E only).
- E2E suites: replace `.pf-category` selectors with the current structure. Use sidebar buttons and `#group-<group-id>` anchors that exist in `GroupSection` only when that group is visible.

2) Add invariant tests for metadata ↔ registry parity
- Unit: Assert that every `docs/structure.json` animation `id` exists in `animationRegistry`, and optionally that every registry key is declared in the structure.
- E2E: Iterate groups and verify a card renders for each animation ID (visible after navigating to its group), and the replay button remains functional.

3) Unit tests for service and hook
- `animationDataService`: map/load, add/refresh, lookups, ID format.
- `useAnimations`: loading and error lifecycle plus `refreshAnimations`.

4) Unit tests for catalog components
- `GroupSection`: placeholder when registry item missing, infinite-animation routing logic.
- `CategorySection`: animation count and empty state.

5) Smoke tests for UI primitives and utilities
- `ui/button`, `ui/card`, `ui/accordion`, `ui/sidebar`: render, variant props, ref forwarding exists.
- `lib/utils.ts (cn)`: class merging and deduplication.

6) Broad animation smoke test
- Parameterized render of every registry component inside `AnimationCard` with `infiniteAnimation` to ensure mount stability.

7) Enforce coverage thresholds in Jest
- Add `coverageThreshold` in `jest.config.cjs` (e.g., minimally 90% global to start). Ratchet once the suite stabilizes.

## File-by-file overview of notable gaps

- App shell and navigation
  - `src/App.tsx` — only partially covered by outdated tests; behaviors like swipe, direction, and drag guards are unverified by unit tests (covered partially by E2E but those are also drifted).
  - `src/components/Sidebar.tsx` — tests exist but target obsolete props and behaviors.

- Catalog
  - `src/components/catalog/AnimationCard.tsx` — has focused tests (good coverage around replay, accordion toggle, intersection observer).
  - `src/components/catalog/GroupSection.tsx` — no tests.
  - `src/components/catalog/CategorySection.tsx` — no tests.

- Data flow
  - `src/services/animationData.ts` — no tests.
  - `src/hooks/useAnimations.ts` — no tests.
  - `src/components/animationRegistry.ts` — no tests; high-value invariant checks missing.

- UI primitives and helpers
  - `src/components/ui/button.tsx` — no tests.
  - `src/components/ui/card.tsx` — no tests.
  - `src/components/ui/accordion.tsx` — no tests.
  - `src/components/ui/sidebar.tsx` — no tests.
  - `src/lib/utils.ts` — no tests.

- Animations (examples of untested sets; all components in these folders are untested):
  - `src/components/base/standard-effects/*.tsx`
  - `src/components/base/text-effects/*.tsx`
  - `src/components/dialogs/modal-base/*.tsx`
  - `src/components/dialogs/modal-content/*.tsx`
  - `src/components/dialogs/modal-dismiss/*.tsx`
  - `src/components/dialogs/modal-orchestration/*.tsx`
  - `src/components/progress/loading-states/*.tsx`
  - `src/components/progress/progress-bars/*.tsx`
  - `src/components/realtime/realtime-data/*.tsx`
  - `src/components/realtime/timer-effects/*.tsx`
  - `src/components/realtime/update-indicators/*.tsx`
  - `src/components/rewards/icon-animations/*.tsx`
  - `src/components/rewards/reward-basic/*.tsx`
  - `src/components/rewards/reward-feedback/*.tsx`
  - `src/components/rewards/reward-mechanics/*.tsx`
  - `src/components/rewards/reward-orchestrations/*.tsx`

## Closing note

The fastest path to align with “everything must be covered” is to: (1) fix drifted tests so they validate current contracts; (2) add invariant tests between `structure.json` and the registry; (3) introduce a parameterized smoke test over all registry components; and (4) enforce coverage thresholds. This yields immediate, broad coverage and prevents silent catalog drift, while leaving room for deeper, behavior-specific tests to be added incrementally.
