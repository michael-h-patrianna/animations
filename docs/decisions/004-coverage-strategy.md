# ADR-004: Per-Subsystem Coverage Thresholds

**Status:** Accepted
**Date:** 2026-02

## Context

A global coverage threshold (e.g., 90% for the whole project) is unachievable because animation components (~500 files) are tested via smoke tests and metadata integrity checks, not per-component unit tests. Their inherent coverage is ~20%. A global threshold would either be set too low (meaningless) or too high (unreachable).

## Decision

Coverage thresholds are set per-subsystem in `vitest.config.ts`:

| Subsystem                     | Statements | Branches | Functions | Lines |
| ----------------------------- | ---------- | -------- | --------- | ----- |
| `src/hooks/**`                | 90%        | 75%      | 90%       | 90%   |
| `src/lib/**`                  | 90%        | 75%      | 90%       | 90%   |
| `src/services/**`             | 90%        | 60%      | 90%       | 90%   |
| `src/utils/**`                | 90%        | 85%      | 90%       | 90%   |
| `src/components/**/framer/**` | 20%        | 10%      | 15%       | 20%   |
| `src/components/**/css/**`    | 20%        | 10%      | 15%       | 20%   |

## Consequences

- **Positive:** Core infrastructure (hooks, lib, services, utils) is held to a high bar.
- **Positive:** Animation components aren't gated on unrealistic thresholds but still have a floor.
- **Negative:** UI components (`src/components/ui`) aren't explicitly thresholded — they're covered indirectly. Consider adding a threshold when UI tests mature.
- **Enforced by:** `npm run test:coverage` fails if any threshold is missed. CI runs this.
