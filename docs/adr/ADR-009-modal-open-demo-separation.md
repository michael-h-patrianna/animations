# ADR-009: Modal-Open Demo Separation

**Status**: proposed

## Context

The modal-open animation group (`src/components/dialogs/modal-open/`) embeds demo-specific logic directly in its shared hook (`SharedModalOpenLogic.ts:163`). The hook uses `from === undefined` as a proxy for "demo mode" and manages demo presets, demo click handlers, and idle/opening phase logic internally.

This violates the project's established demo separation architecture (ADR-006, CLAUDE.md "Demo Separation") where:

- Animation components are standalone and know nothing about demos
- The catalog layer renders demo UI via `demoMode` metadata and `DemoModeWrapper`
- Demo anchors, triggers, and mock data are siblings rendered by the wrapper

10 animation components (5 framer + 5 CSS) depend on `useModalOpenLogic`, making this the largest remaining demo-coupling debt in the codebase.

## Decision

Migrate modal-open animations to the `demoMode` metadata pattern:

1. **Add `demoMode: 'modal-open'` to modal-open `.meta.ts` files** — signals the catalog to render demo preset buttons alongside the animation.

2. **Extend `DemoModeWrapper` with a `modal-open` mode** — renders preset trigger buttons as siblings. Each button click sets a `from` point (relative to the card canvas) and invokes the animation.

3. **Make `from` always required in consumer code** — the component always receives a `from` point. In catalog demo mode, the wrapper provides it. In consumer apps, the developer provides it.

4. **Remove `isDemoMode` branches from `SharedModalOpenLogic`** — eliminate the `from === undefined` detection, `DemoConfig` type, `useDemoClickHandler`, and idle phase logic. The hook becomes a pure animation state machine.

5. **Move `SharedDemoTriggers.tsx` to the catalog layer** — the preset button UI moves from the animation group to the catalog's demo infrastructure.

## Affected Files

| File                                   | Change                                                         |
| -------------------------------------- | -------------------------------------------------------------- |
| `SharedModalOpenLogic.ts`              | Remove isDemoMode, DemoConfig, useDemoClickHandler, idle phase |
| `SharedDemoTriggers.tsx`               | Move to catalog demo infrastructure                            |
| `SharedTypes.ts`                       | Make `from` required in ModalOpenProps                         |
| 5 framer components                    | Remove preset arrays, simplify hook usage                      |
| 5 css components                       | Same                                                           |
| 5 framer `.meta.ts`                    | Add `demoMode: 'modal-open'`                                   |
| 5 css `.meta.ts`                       | Add `demoMode: 'modal-open'`                                   |
| `GroupSection.tsx` / `DemoModeWrapper` | Add modal-open demo mode handler                               |

Estimated scope: ~400 lines changed across 14 files.

## Consequences

**Positive:**

- Modal-open components become truly standalone — no demo awareness
- Consistent with all other animation groups in the catalog
- Removes the last TODO in the codebase
- Simplifies `SharedModalOpenLogic` by ~60 lines

**Negative:**

- Large cross-cutting change touching 14 files
- Preset configuration (force/duration/reveal) must be encoded in metadata or the demo wrapper, adding complexity to the demo infrastructure
- Risk of visual regression in the catalog demo for 10 animations

**Mitigation:**

- Implement in a dedicated session with visual verification
- Run E2E tests after each component migration
- Compare demo behavior before/after using browser screenshots
